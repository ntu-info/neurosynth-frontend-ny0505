// Simple Netlify Function proxy that forwards requests to Tren's backend
// and returns the response, adding permissive CORS headers for the browser.

const TARGET_HOST = 'https://mil.psy.ntu.edu.tw:5000';

exports.handler = async function (event, context) {
  try {
    // Netlify will redirect /api/* to /.netlify/functions/proxy/*
    // Extract the path after the function prefix
    const prefix = '/.netlify/functions/proxy';
    let proxyPath = event.path || '';
    if (proxyPath.startsWith(prefix)) proxyPath = proxyPath.slice(prefix.length);
    if (!proxyPath.startsWith('/')) proxyPath = '/' + proxyPath;

    const qs = event.rawQueryString ? `?${event.rawQueryString}` : '';
    const targetUrl = `${TARGET_HOST}${proxyPath}${qs}`;

    const fetchOptions = {
      method: event.httpMethod,
      headers: {}
    };

    // Copy headers except ones we should not forward
    for (const [k, v] of Object.entries(event.headers || {})) {
      const lk = k.toLowerCase();
      if (['host', 'x-forwarded-host', 'x-forwarded-proto'].includes(lk)) continue;
      fetchOptions.headers[k] = v;
    }

    if (event.body) {
      fetchOptions.body = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;
    }

    // Use global fetch (Node 18+ environment on Netlify supports fetch)
    const res = await fetch(targetUrl, fetchOptions);

    const text = await res.text();

    // Collect response headers
    const headers = {};
    res.headers.forEach((value, name) => { headers[name] = value; });

    // Ensure CORS headers for browser clients
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
