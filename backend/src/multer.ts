import multer from "multer";
import path from "path";
import fs from "fs";

const storageSellerLogo = multer.diskStorage({
  destination: (req: any, file, cb) => {
    const userId = req.params.id;

    const uploadPath = path.join("uploads", "sellers", String(userId));

    console.log(req.file);

    fs.mkdirSync(uploadPath, {
      recursive: true,
    });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(null, `logo-${Date.now()}${ext}`);
  },
});

export const uploadSellerLogo = multer({
  storage: storageSellerLogo,

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
  destination: (req: any, file, cb) => {
    console.log(req.query);

    const sellerId = Number(req.body.seller_id || req.user.id);
    const productId = Number(req.params.id);

    const folder = path.join(
      "uploads",
      "products",
      String(sellerId),
      String(productId),
    );

    console.log("FOLDER:", folder);

    fs.mkdirSync(folder, {
      recursive: true,
    });

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const filename = `${Date.now()}-${Math.round(Math.random() * 999999)}${ext}`;

    console.log("FILENAME:", filename);

    cb(null, filename);
  },
});

export const uploadProductImages = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
