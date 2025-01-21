import request from "supertest";
import { app, server } from "../src/server.js";

describe("Povezivanje na server", () => {
  afterAll(() => {
    server.close();
  });

  test("trebalo bi dat dobrodošlicu kad se pozove GET /api", async () => {
    const response = await request(app).get("/api");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Dobrodošli na API za ScheduleIT.",
    });
  });
});
