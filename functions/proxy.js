// Netlify Function proxy that forwards requests to Tren's backend
// and returns the response, adding permissive CORS headers for the browser.

const TARGET_HOST = 'https://mil.psy.ntu.edu.tw:5000';

exports.handler = async function (event, context) {
  console.log('proxy invoked', { path: event.path, rawQueryString: event.rawQueryString, method: event.httpMethod });
  try {
    const prefix = '/.netlify/functions/proxy';
    let proxyPath = event.path || '';
    // Handle multiple incoming path formats. netlify dev sometimes provides the original
    // request path (e.g. '/api/terms'), or the rewritten function path (e.g. '/.netlify/functions/proxy/terms').
    if (proxyPath.startsWith(prefix)) {
      proxyPath = proxyPath.slice(prefix.length);
    } else if (proxyPath.startsWith('/api/')) {
      proxyPath = proxyPath.slice('/api'.length);
    } else if (proxyPath === '/api') {
      proxyPath = '/';
    }
    if (!proxyPath.startsWith('/')) proxyPath = '/' + proxyPath;

    // Debug: show resolved proxyPath
    console.log('proxy resolved path ->', proxyPath);

    const qs = event.rawQueryString ? `?${event.rawQueryString}` : '';
  const targetUrl = `${TARGET_HOST}${proxyPath}${qs}`;
  console.log('proxy targetUrl ->', targetUrl);

    const fetchOptions = {
      method: event.httpMethod,
      headers: {}
    };

    for (const [k, v] of Object.entries(event.headers || {})) {
      const lk = k.toLowerCase();
      if (['host', 'x-forwarded-host', 'x-forwarded-proto'].includes(lk)) continue;
      fetchOptions.headers[k] = v;
    }

    if (event.body) {
      fetchOptions.body = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;
    }

    const res = await fetch(targetUrl, fetchOptions);
    const text = await res.text();

    const headers = {};
    res.headers.forEach((value, name) => { headers[name] = value; });

    headers['access-control-allow-origin'] = '*';
    headers['access-control-allow-methods'] = 'GET,HEAD,POST,OPTIONS';
    headers['access-control-allow-headers'] = 'Content-Type,Authorization';

    return {
      statusCode: res.status,
      headers,
      body: text
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'access-control-allow-origin': '*' },
      body: `Proxy error: ${err.message}`
    };
  }
};
