export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const studioHostname = env.STUDIO_HOSTNAME;
    const studioPath = env.STUDIO_PATH || '/login';

    if (studioHostname && url.hostname === studioHostname) {
      if (url.pathname === '/' || url.pathname === '') {
        return Response.redirect(`https://${studioHostname}${studioPath}`, 302);
      }
      return env.ASSETS.fetch(request);
    }

    if (!url.pathname.startsWith('/maintenance')) {
      return Response.redirect(new URL('/maintenance', url), 302);
    }
    return env.ASSETS.fetch(request);
  },
};
