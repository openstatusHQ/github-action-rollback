import { expect, test } from "bun:test";

import { z } from "zod";
 const schema = z.object({
  id: z.number(),
  raw: z.array(
    z.object({
      dnsStart: z.number(),
      dnsDone: z.number(),
      connectStart: z.number(),
      connectDone: z.number(),
      tlsHandshakeStart: z.number(),
      tlsHandshakeDone: z.number(),
      firstByteStart: z.number(),
      firstByteDone: z.number(),
      transferStart: z.number(),
      transferDone: z.number()
    })
  ),
  response: z.object({
    time: z.number(),
    status: z.number(),
    latency: z.number(),
    headers: z.object({
      "Alt-Svc": z.string(),
      "Cf-Ray": z.string(),
      "Content-Length": z.string(),
      "Content-Type": z.string(),
      Date: z.string(),
      Nel: z.string(),
      "Report-To": z.string(),
      Server: z.string(),
      Vary: z.string()
    }),
    timing: z.object({
      dnsStart: z.number(),
      dnsDone: z.number(),
      connectStart: z.number(),
      connectDone: z.number(),
      tlsHandshakeStart: z.number(),
      tlsHandshakeDone: z.number(),
      firstByteStart: z.number(),
      firstByteDone: z.number(),
      transferStart: z.number(),
      transferDone: z.number()
    }),
    region: z.string()
  }),
  aggregated: z.object({
    dns: z.object({
      p50: z.number(),
      p75: z.number(),
      p95: z.number(),
      p99: z.number(),
      min: z.number(),
      max: z.number()
    }),
    connect: z.object({
      p50: z.number(),
      p75: z.number(),
      p95: z.number(),
      p99: z.number(),
      min: z.number(),
      max: z.number()
    }),
    tls: z.object({
      p50: z.number(),
      p75: z.number(),
      p95: z.number(),
      p99: z.number(),
      min: z.number(),
      max: z.number()
    }),
    firstByte: z.object({
      p50: z.number(),
      p75: z.number(),
      p95: z.number(),
      p99: z.number(),
      min: z.number(),
      max: z.number()
    }),
    transfer: z.object({
      p50: z.number(),
      p75: z.number(),
      p95: z.number(),
      p99: z.number(),
      min: z.number(),
      max: z.number()
    }),
    latency: z.object({
      p50: z.number(),
      p75: z.number(),
      p95: z.number(),
      p99: z.number(),
      min: z.number(),
      max: z.number()
    })
  })
})

test("should fail if slow", async () => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-openstatus-key": process.env.OPENSTATUS_API_KEY || "",
    },
    body: '{"url":"https://github-action-rollback.thibaultleouay.workers.dev/","method":"GET","regions":["ams","iad","gru"],"runCount":2,"aggregated":true}',
  };

  const data = await fetch("https://api.openstatus.dev/v1/check", options);
  const json = await data.json();
  // console.log(JSON.stringify(json));
   const result = schema.parse(json);
   expect(result.aggregated.firstByte.p75 < 1000).toBe(true);
});
