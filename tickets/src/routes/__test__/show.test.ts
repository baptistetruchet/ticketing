import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the ticket if the ticket if found", async () => {
  const title = "A title";
  const price = 10;

  const ticket = Ticket.build({ title, price, userId: "asdf" });
  ticket.save();

  const response = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .send()
    .expect(200);

  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(price);
});
