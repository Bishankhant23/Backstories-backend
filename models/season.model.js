import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seasonNumber: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      default: function () {
        return `Season ${this.seasonNumber}`;
      },
    },
    description: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
    expectations: {
      type: String,
      default: "",
    },
    learning: {
      type: String,
      default: "",
    },
    favouriteEpisodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Episode",
      },
    ],
    favouriteCharacters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    type: {
      type: String,
      enum: ["public", "private", "personal"],
      default: "public",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Season", seasonSchema);
