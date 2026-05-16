export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const studioHostname = env.STUDIO_HOSTNAME;
    const studioPath = env.STUDIO_PATH || '/login';

    if (studioHostname && url.hostname === studioHostname) {
      // Serve Studio at root — rewrite internally to the built HTML file
      const pathname = url.pathname === '/' || url.pathname === '' ? studioPath : url.pathname;
      const rewritten = new URL(url);
      rewritten.pathname = pathname;
      return env.ASSETS.fetch(new Request(rewritten.toString(), request));
    }

    if (!url.pathname.startsWith('/maintenance')) {
      return Response.redirect(new URL('/maintenance', url), 302);
    }
    return env.ASSETS.fetch(request);
  },
};
