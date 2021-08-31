module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/anime/season',
        permanent: true,
      },
    ]
  },
}
