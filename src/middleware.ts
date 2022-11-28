import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const now = new Date()
  const x_real_ip = request.headers.get('x-real-ip')
  const x_forwarded_for = request.headers.get('x-forwarded-for')
  console.log(`${now.toISOString()} | x-real-ip: ${x_real_ip} | x-forwarded-for: ${x_forwarded_for}`)
  return NextResponse.next()
}

export const config = {
  matcher: ['/anime/season/:path*'],
}
