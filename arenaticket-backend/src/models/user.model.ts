import bcrypt from "bcrypt";
import { Document, Model, Schema, Types, model } from "mongoose";
import { UserRole } from "../types/user.type";

export interface IUserDocument extends Document {
  email: string;
  password: string;
  role: UserRole;
  person: Types.ObjectId;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    person: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function handlePasswordHash(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const UserModel: Model<IUserDocument> = model<IUserDocument>("User", userSchema);
