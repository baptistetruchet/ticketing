import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";

it("can fetch a list of tickets", async () => {
  Ticket.build({ title: "Title 1", price: 10, userId: "asdf" }).save();
  Ticket.build({ title: "Title 2", price: 20, userId: "qzer" }).save();
  Ticket.build({ title: "Title 3", price: 30, userId: "qzer" }).save();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
