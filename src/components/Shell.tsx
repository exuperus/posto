// src/components/Shell.tsx
'use client'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FridayNotification from '@/components/FridayNotification'
import LoyaltyCounter from '@/components/LoyaltyCounter'
import PromocaoBanner from '@/components/PromocaoBanner'
import PromocaoAlerta from '@/components/PromocaoAlerta'

export default function Shell({ children }: { children: React.ReactNode }) {
    const isHome = usePathname() === '/'
    return (
        <>
            <PromocaoBanner />
            <Header />
            <PromocaoAlerta />
            <main className={isHome ? '' : 'container-pro py-8 flex-1'}>{children}</main>
            <Footer isHome={isHome} />
            <FridayNotification />
            <LoyaltyCounter />
        </>
    )
}
