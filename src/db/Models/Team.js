import { DataTypes } from "sequelize";
import { db } from "../db.js";

export const Team = db.define(
  "Team",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    locationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teamName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    room: {
      type: DataTypes.STRING,
    },
  },
  { sequelize: db, timestamps: false }
);
