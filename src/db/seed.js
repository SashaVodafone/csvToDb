import { db } from "./db.js";
import { Participant, Team } from "./Models/index.js";

export async function seed() {
  await db.sync({ force: true });
  const Team1 = await Team.create({ name: "Team1", room: "room1" });
  const Participant1 = await Participant.create({
    name: "Participant1",
    email: "participant@email.com",
  });

  await Team1.addParticipant(Participant1);
  console.log("seeded");
}

seed();
