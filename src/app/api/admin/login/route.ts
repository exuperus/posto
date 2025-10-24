import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { key } = await req.json().catch(() => ({ key: '' }))
    if (!key || key !== process.env.ADMIN_KEY) {
        return NextResponse.json({ ok: false, error: 'Chave inválida' }, { status: 401 })
    }
    const res = NextResponse.json({ ok: true })

    res.cookies.set('ak', key, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' })
    return res
}
