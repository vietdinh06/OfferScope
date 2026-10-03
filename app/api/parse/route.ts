import { extractText, getDocumentProxy } from "unpdf";

type OfferInfo = {
  company: string;
  job_title: string;
  pay: string;
  location: string;
  start_date: string;
  end_date: string;
  offer_deadline: string;
  type_of_employment: string;
};

const offerSchema = {
  type: "OBJECT",
  properties: {
    company: { type: "STRING" },
    job_title: { type: "STRING" },
    pay: { type: "STRING" },
    location: { type: "STRING" },
    start_date: { type: "STRING" },
    end_date: { type: "STRING" },
    offer_deadline: { type: "STRING" },
    type_of_employment: { type: "STRING" },
  },
  required: [
    "company",
    "job_title",
    "pay",
    "location",
    "start_date",
    "end_date",
    "offer_deadline",
    "type_of_employment",
  ],
};

const MAX_DOCUMENT_CHARS = 24000;

const extractionPrompt = `Extract the following fields from this job offer letter.
Return only JSON matching the provided schema. Use "" when a value is not explicitly stated.
Do not infer or guess.

Rules:
- company: full legal company name
- job_title: full title without internship season
- pay: base salary or hourly rate only, without commas
- location: city, state code, country
- dates: YYYY-MM-DD
- type_of_employment: exactly remote, hybrid, or in-person
- for remote work, use the company or HQ location if stated`;

function limitDocumentText(text: string) {
  if (text.length <= MAX_DOCUMENT_CHARS) {
    return text;
  }

  const firstSectionLength = 18000;
  const lastSectionLength = MAX_DOCUMENT_CHARS - firstSectionLength;
  return `${text.slice(0, firstSectionLength)}

[middle of document omitted]

${text.slice(-lastSectionLength)}`;
}

function isOfferInfo(value: unknown): value is OfferInfo {
  if (!value || typeof value !== "object") {
    return false;
  }

  const offer = value as Record<string, unknown>;
  return Object.values(offerSchema.properties).every((_, index) => {
    const key = Object.keys(offerSchema.properties)[index];
    return typeof offer[key] === "string";
  });
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key is not configured. Add GEMINI_API_KEY to enable parsing." },
        { status: 500 },
      );
    }

    const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
    const formData = await request.formData();
    const files = formData.getAll('files').filter(f => f instanceof File) as File[]

    const offers = await Promise.all(files.map(async (f) => {
      if (!f || !(f instanceof File)) {
        return Response.json({ error: "No file uploaded" }, { status: 400 });
      }

      if (f.type !== "application/pdf") {
        return Response.json(
          { error: "File must be a PDF" },
          { status: 400 },
        );
      }

      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (f.size > MAX_FILE_SIZE) {
        return Response.json(
          { error: "File too large. Maximum size is 10MB" },
          { status: 413 },
        );
      }

      const buffer = await f.arrayBuffer();
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const { text } = await extractText(pdf, { mergePages: true });

      const prompt = `${extractionPrompt}

Offer letter:
${limitDocumentText(text)}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: offerSchema,
              maxOutputTokens: 256,
            },
          }),
        },
      );

      const responseBody = await response.json() as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        error?: { message?: string };
      };

      if (!response.ok) {
        throw new Error(responseBody.error?.message ?? "Gemini request failed");
      }

      const generatedText = responseBody.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!generatedText) {
        throw new Error("Gemini returned an empty response");
      }

      const parsedOffer: unknown = JSON.parse(generatedText);
      if (!isOfferInfo(parsedOffer)) {
        throw new Error("Gemini returned an invalid offer format");
      }

      return parsedOffer;
    }))


    return Response.json(
      { offers }
    );

  } catch (e) {
    console.error("API Error:", e);
    return Response.json(
      {
        error: "Failed to process file",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}