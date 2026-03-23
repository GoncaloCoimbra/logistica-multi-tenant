const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Determine backend URL based on environment
  const backendUrl = process.env.NODE_ENV === 'production' 
    ? 'http://logistica-backend:3000'
    : 'http://localhost:3000';

  app.use(
    '/api',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
      logLevel: 'debug'
    })
  );

  app.use(
    '/ws',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
      ws: true,
      logLevel: 'debug'
    })
  );
};