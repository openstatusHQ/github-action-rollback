import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  // Simulate a slow response
  // await new Promise((r) => setTimeout(r, 1000));
  return c.text("Hello OpenStatus!");
});

export default app;
