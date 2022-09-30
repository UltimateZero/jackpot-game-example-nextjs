import request from "supertest";
import app from "./app";
import crypto from "crypto";

describe("Sample Test", () => {
  let accountId = it("should create a new account", async () => {
    const res = await request(app).post("/accounts").send({
      id: crypto.randomUUID(),
      balance: 0,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    accountId = res.body.id;
  });
  it("should get 10 credit on new session", async () => {
    const res = await request(app)
      .get("/accounts/" + accountId)
      .send();
    expect(res.body.credit).toEqual(10);
  });
  it("should deduct 1 credit on roll", async () => {
    const res = await request(app).post("/roll").send({});
    if (res.body.won) {
      expect(res.body.credit).toEqual(10 - 1 + res.body.reward);
    } else {
      expect(res.body.credit).toEqual(9);
    }
  });
});
