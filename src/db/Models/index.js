import { Participant } from "./Participant.js";
import { Team } from "./Team.js";

Team.hasMany(Participant);
Participant.belongsTo(Team);

export { Participant, Team };
