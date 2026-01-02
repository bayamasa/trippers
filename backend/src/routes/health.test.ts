import { createApp } from "../app";

describe("Health API", () => {
  const app = createApp();

  describe("GET /health", () => {
    it("should return status ok", async () => {
      const res = await app.request("/health");
      expect(res.status).toBe(200);

      const json = (await res.json()) as { status: string; timestamp: string };
      expect(json.status).toBe("ok");
      expect(json.timestamp).toBeDefined();
    });
  });
});
