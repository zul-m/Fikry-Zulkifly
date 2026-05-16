export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const studioHostname = env.STUDIO_HOSTNAME;

    if (studioHostname && url.hostname === studioHostname) {
      const pathname = url.pathname === '/' || url.pathname === '' ? '/studio/' : url.pathname;
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
