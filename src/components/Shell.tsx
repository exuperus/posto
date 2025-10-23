// src/components/Shell.tsx
'use client'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Shell({ children }: { children: React.ReactNode }) {
    const isHome = usePathname() === '/'
    return (
        <>
            <Header />
            <main className={isHome ? '' : 'container-pro py-8 flex-1'}>{children}</main>
            <Footer isHome={isHome} />
        </>
    )
}
