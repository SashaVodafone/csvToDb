import fs from "fs";
import csvParser from "csv-parser";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
// INTERNAL IMPORTS
import { db } from "./db/db.js";
import { Team, Participant } from "./db/Models/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

//CSV FILES
// const csvParticipantsFile = join(__dirname, "./csv/HackathonParticipants.csv");
// const csvTeamsFile = join(__dirname, "./csv/HackathonTeams.csv");
// const csvTeamInfoFile = join(__dirname, "./csv/TeamInfo.csv");

const csvParticipantsFile = join(__dirname, "./mockCsv/FakeParticipants.csv");
const csvTeamsFile = join(__dirname, "./mockCsv/FakeTeams.csv");
const csvTeamInfoFile = join(__dirname, "./mockCsv/FakeTeamInfo.csv");

async function createData() {
  async function createTeams() {
    return new Promise(resolve => {
      const infoResults = [];
      //create team tables
      fs.createReadStream(csvTeamInfoFile)
        .pipe(csvParser())
        .on("data", async data => {
          infoResults.push(data);
        })
        .on("end", async () => {
          const infoResultsRes = await Promise.all(
            infoResults.map(async teamInfo => {
              const infoKeys = Object.keys(teamInfo);
              const name = infoKeys[0];

              const newTeam = await Team.create({
                teamName: teamInfo[name],
                room: teamInfo.room,
                locationName: teamInfo.location,
              });
              console.log(await newTeam.dataValues.teamName, " team entry created");
            })
          );
          resolve(infoResultsRes);
        });
      console.log("Participant CSV data has been imported into the SQL database.");
    });
  }

  async function createParticipants() {
    return new Promise(resolve => {
      const participantsResults = [];
      //create participant tables
      fs.createReadStream(csvParticipantsFile)
        .pipe(csvParser())
        .on("data", data => {
          participantsResults.push(data);
        })
        .on("end", async () => {
          const participantResultsRes = await Promise.all(
            participantsResults.map(async participant => {
              const newParticipant = await Participant.create({
                name: participant.name,
                email: participant.email,
                position: participant.position,
                area: participant.area,
                shirtSize: participant.shirtSize,
                dietaryRequirements: participant.dietRequirements,
                canLead: participant.canLead,
                canFund: participant.canFund,
              });

              console.log(await newParticipant.dataValues.name, " participant entry created");
            })
          );
          resolve(participantResultsRes);
        });
      console.log("Participant CSV data has been imported into the SQL database.");
    });
  }

  async function createRelations() {
    return new Promise(resolve => {
      const teamsResults = [];
      //add participants to team table
      fs.createReadStream(csvTeamsFile)
        .pipe(csvParser({ headers: false }))
        .on("data", data => {
          teamsResults.push(data);
        })
        .on("end", async () => {
          //results = array of objects, each object has key of 0-8
          //and values where 0 is the team name and 1-8 are either participant names or empty string ''
          const teamResultsRes = await Promise.all(
            teamsResults.map(async team => {
              // team['0'] will always be the team name
              const teamArray = [
                team["1"],
                team["2"],
                team["3"],
                // team["4"],
                // team["5"],
                // team["6"],
                // team["7"],
                // team["8"],
              ];
              const participantsArray = [];
              //for each team member, find participant with that name
              await Promise.all(
                teamArray.map(async member => {
                  if (member !== "") {
                    Participant.findOne({
                      where: { name: member },
                    })
                      .then(currentParticipant => {
                        console.log(currentParticipant.dataValues.name);
                        participantsArray.push(currentParticipant);
                      })
                      .catch(error => {
                        console.log("Issue finding participant:", member, error);
                      });
                  }
                })
              );

              //const currentTeam = await
              Team.findOne({ where: { teamName: team["0"] } })
                .then(currentTeam => {
                  console.log(currentTeam.dataValues.teamName);
                  currentTeam.addParticipant(participantsArray);
                })
                .catch(error => console.log("Issue finding team:", team["0"], error));
            })
          );
          resolve(teamResultsRes);
          console.log("Team CSV data has been imported into the SQL database.");
        });
    });
  }

  async function createAll() {
    await db.sync({ force: true });
    const teamPromise = await createTeams();
    const participantPromise = await createParticipants();
    const relationPromise = await createRelations();
    console.log("Data seeded");
    // Promise.allSettled([teamPromise, participantPromise, relationPromise]).then(async results => {
    //   console.log("function results", results);
    //   await db.close();
    // });
  }

  createAll();
}

createData();
