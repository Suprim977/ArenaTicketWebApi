import { Document, Model, Schema, model } from "mongoose";

export interface IPersonDocument extends Document {
  firstName: string;
  lastName: string;
  arenaTag?: string;
  avatar?: string;
}

const personSchema = new Schema<IPersonDocument>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    arenaTag: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const PersonModel: Model<IPersonDocument> = model<IPersonDocument>("Person", personSchema);
