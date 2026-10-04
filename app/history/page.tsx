import History from '@/components/History'
import { getSavedOffers, type SavedOffer } from './actions'

export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
    let offers: SavedOffer[] = []

    try {
        offers = await getSavedOffers()
    } catch (error) {
        console.error(error)
    }

    return <History initialOffers={offers} />
}
