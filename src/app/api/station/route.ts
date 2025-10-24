import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const st = await prisma.station.findFirst()
    return NextResponse.json(st)
}
