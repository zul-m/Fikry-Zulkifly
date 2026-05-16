export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/maintenance')) {
      return Response.redirect(new URL('/maintenance', url), 302);
    }
    return env.ASSETS.fetch(request);
  },
};
