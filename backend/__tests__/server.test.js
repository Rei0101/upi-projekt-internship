import request from "supertest";
import { app, server } from "../server.js";

describe("Povezivanje na server", () => {
  afterAll(() => {
    server.close();
  });

  test("trebalo bi dat dobrodošlicu kad se pozove GET /", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Dobrodošli na API za ScheduleIT.",
    });
  });
});
