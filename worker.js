export default {
  async fetch(request, env) {
    try {
      if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
        return await env.ASSETS.fetch(request);
      }
    } catch (e) {
      console.error('Asset fetch error:', e);
    }
    return new Response('RADCOM Workspace is loading...', {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};
