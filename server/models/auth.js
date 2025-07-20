import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String },
  joinedon: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
