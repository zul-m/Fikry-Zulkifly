import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(({ url }, next) => {
  if (url.pathname.startsWith("/maintenance")) {
    return next();
  }
  return Response.redirect(new URL("/maintenance", url), 302);
});
