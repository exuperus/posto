// middleware.ts (na raiz do projeto)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    // proteger páginas /admin (mas deixar /admin/login livre)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const cookie = req.cookies.get('ak')?.value?.trim()
        const envKey = process.env.ADMIN_KEY?.trim()
        if (!cookie || !envKey || cookie !== envKey) {
            const url = req.nextUrl.clone()
            url.pathname = '/admin/login'
            return NextResponse.redirect(url)
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
