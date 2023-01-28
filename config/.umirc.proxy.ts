
export default {
  '/proxy': {
    target: `https://gboss-test02.pinming.org`,
    // target: ' 172.16.100.243:8088',
    changeOrigin: true,
  },
  '/user': {
    target: `https://gboss-test02.pinming.org`,
    // target: ' 172.16.100.243:8088',
    changeOrigin: true,
  },
  '/api': {
    // target: `https://gboss-test02.pinming.org`,
		target: 'https://zz-test02.pinming.org',
    changeOrigin: true,
  },
}
