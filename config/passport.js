import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        console.log("userrrrr",user)
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user id to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session by id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id).select("-password"); // omit password
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
