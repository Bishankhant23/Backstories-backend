import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    cast: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    favoriteCharacters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    photos: [
      {
        type: String,
        default: [],
      },
    ],
    expectations: {
      type: String,
      default: "",
    },
    learning: {
      type: String,
      default: "",
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["public", "private", "personal"],
      default: "personal",
    },
    mood : {
      type : String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Episode", episodeSchema);
