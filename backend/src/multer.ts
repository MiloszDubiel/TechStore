import multer from "multer";
import path from "path";
import fs from "fs";

const storageSellerLogo = multer.memoryStorage();

export const uploadSellerLogo = multer({
  storage: storageSellerLogo,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Niepoprawny format pliku"));
    }
  },
});

const storage = multer.memoryStorage();

export const uploadProductImages = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },

  fileFilter: (_, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Niepoprawny format pliku"));
    }
  },
});
