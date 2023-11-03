import { DataTypes } from "sequelize";
import { db } from "../db.js";

export const Participant = db.define(
  "Participant",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shirtSize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dietaryRequirements: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    canLead: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    canFund: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize: db, timestamps: false }
);
