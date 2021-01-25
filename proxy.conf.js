// eslint-disable-next-line import/no-extraneous-dependencies
const HttpsProxyAgent = require('https-proxy-agent');

/*
 * API proxy configuration.
 * This allows you to proxy HTTP request like `http.get('/api/stuff')` to another server/port.
 * This is especially useful during app development to avoid CORS issues
 * while running a local server. For more details and options,
 * see https://angular.io/guide/build#using-corporate-proxy
 */
const proxyConfig = [
  {
    context: '/api',
    pathRewrite: { '^/api': '' },
    target: 'http://localhost:3002',
    changeOrigin: true,
    secure: false,
  },
];

/*
 * Configures a corporate proxy agent for the API proxy if needed.
 */
function setupForCorporateProxy(proxyConf) {
  if (!Array.isArray(proxyConf)) {
    // eslint-disable-next-line no-param-reassign
    proxyConf = [proxyConf];
  }

  const proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  let agent = null;

  if (proxyServer) {
    console.log(`Using proxy server: ${proxyServer}`);
    agent = new HttpsProxyAgent(proxyServer);
    // eslint-disable-next-line no-param-reassign
    proxyConfig.forEach((entry) => { entry.agent = agent; });
  }

  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);
