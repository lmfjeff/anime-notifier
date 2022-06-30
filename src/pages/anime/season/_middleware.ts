import { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const now = new Date()
  console.log(
    now.toISOString() + ' IP: ' + request.ip + ' x-real-ip: ',
    request.headers.get('x-real-ip'),
    ' x-forwarded-for: ',
    request.headers.get('x-forwarded-for')
  )
}
