import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    const st = await prisma.station.findFirst()
    return NextResponse.json(st)
}
