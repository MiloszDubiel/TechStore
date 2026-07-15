import multer from "multer";
import path from "path";
import fs from "fs";

const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/sellers");
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const filename =
      Date.now() + "-" + Math.round(Math.random() * 100000) + ext;

    cb(null, filename);
  },
});

export const uploadSellerLogo = multer({
  storage: storage1,

  limits: {
    fileSize: 5 * 1024 * 1024,
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const productId: unknown = req.params.id;

    if (typeof productId !== "string") return;
    const folder = path.join("uploads", "products", productId);

    fs.mkdirSync(folder, {
      recursive: true,
    });

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(null, `${Date.now()}${ext}`);
  },
});

export const uploadProductImages = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
