export default {
  async fetch(request, env) {
    if (env && env.ASSETS && typeof env.ASSETS.fetch === "function") {
      return env.ASSETS.fetch(request);
    }
    return new Response("RADCOM Email Workspace", {
      headers: { "Content-Type": "text/html" }
    });
  }
};
