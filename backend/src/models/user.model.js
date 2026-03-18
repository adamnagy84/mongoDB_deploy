import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is mandatory."],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: 6,
      maxlength: 60,
      select: false, //alapból ne jöjjön vissza
    },
    email: {
      type: String,
      required: [true, "Email is needed."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    refreshToken: {
      type: [String],
      default: [],
      select: false,
    },
  },
  { timestamps: true },
);

//Mentés előtt hash-eljük a jelszót
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; //this = objecten belül saját maga

  //Újra értéket adunk azért = jel
  this.password = await bcrypt.hash(this.password, 10);
});

//loginhoz jelszó összehasonlítás
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
