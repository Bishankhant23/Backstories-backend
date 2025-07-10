import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dbx7qb5wm",
  api_key: process.env.CLOUDINARY_API_KEY || "825917974552187",
  api_secret: process.env.CLOUDINARY_API_SECRET || "EdWJjba_F3D5m008QPUr6R4ZFXs",
  secure: true,
});

export default cloudinary;