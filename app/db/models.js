import { mongoose } from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

// ---------------------------------- User ----------------------------------
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
  },
  // Automatically add `createdAt` and `updatedAt` timestamps:
  // https://mongoosejs.com/docs/timestamps.html
  { timestamps: true },
);
// ---------------------------------- Password hook ----------------------------------
// pre save password hook
userSchema.pre("save", async function (next) {
  const user = this; // this refers to the user document

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) {
    return next(); // continue
  }

  const salt = await bcrypt.genSalt(10); // generate a salt
  user.password = await bcrypt.hash(user.password, salt); // hash the password
  next(); // continue
});

// ---------------------------------- Event ----------------------------------
const eventSchema = new Schema({
  titel: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }]
},
  { timestamps: true },
);


// For each model you want to create, please define the model's name, the
// associated schema (defined above), and the name of the associated collection
// in the database (which will be created automatically).
export const models = [
  {
    name: "User",
    schema: userSchema,
    collection: "user",
  },
  {
    name: "Events",
    schema: eventSchema,
    collection: "events",
  }
];