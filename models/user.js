import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["guest", "host"],
      default: "guest",
    },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Home" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
