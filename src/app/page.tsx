import Hero from '@/components/Hero'
import { headers } from 'next/headers'

export const revalidate = 1800

function abs(path: string) {
    const h = new Headers(headers())
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const host  = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
    return `${proto}://${host}${path}`
}

async function getStation() {
    const res = await fetch(abs('/api/station'), { cache: 'no-store', next: { revalidate } })
    if (!res.ok) return {}
    return res.json()
}

export default async function HomePage() {
    const station = await getStation()
    return <Hero stationName={station?.nome_comercial ?? 'Sandrina & Mário, LDA'} />
}
