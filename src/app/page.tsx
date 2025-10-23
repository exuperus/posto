// src/app/page.tsx
import Hero from '@/components/Hero'
import { headers } from 'next/headers'

export const revalidate = 1800

async function abs(path: string) {
    const h = await headers()
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const host  = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
    return `${proto}://${host}${path}`
}

async function getStation(): Promise<{ nome_comercial?: string } | {}> {
    const url = await abs('/api/station')
    const res = await fetch(url, { cache: 'no-store', next: { revalidate } })
    if (!res.ok) return {}
    return res.json()
}

export default async function HomePage() {
    const station = await getStation()
    const title =
        (station as any)?.nome_comercial ?? 'Sandrina & Mário, LDA'

    return <Hero title={title} />
}
