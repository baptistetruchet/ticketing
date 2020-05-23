import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import mongoose from "mongoose";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signIn())
    .send({ title: "A title", price: 10 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "A title", price: 10 })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const ticket = Ticket.build({ title: "A title", price: 10, userId: "asdf" });
  ticket.save();

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", global.signIn())
    .send({ title: "New title", price: 10 })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({ title: "A title", price: 10, userId });
  ticket.save();

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", global.signIn(userId))
    .send({ title: "", price: 10 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", global.signIn(userId))
    .send({ title: "New title", price: -10 })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({ title: "A title", price: 10, userId });
  ticket.save();

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", global.signIn(userId))
    .send({ title: "New title", price: 100 })
    .expect(200);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual("New title");
  expect(updatedTicket!.price).toEqual(100);
});
