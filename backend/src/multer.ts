import multer from "multer";
import path from "path";
import fs from "fs";

const storageSellerLogo = multer.diskStorage({
  destination: (req: any, file, cb) => {
    const userId = req.user.id;

    const uploadPath = path.join("uploads", "sellers", String(userId));

    fs.mkdirSync(uploadPath, {
      recursive: true,
    });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(null, `logo${ext}`);
  },
});

export const uploadSellerLogo = multer({
  storage: storageSellerLogo,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
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
    const sellerId = req.user.id;
    const productId = req.params.id;

    const folder = path.join(
      "uploads",
      "products",
      String(sellerId),
      String(productId),
    );

    fs.mkdirSync(folder, {
      recursive: true,
    });

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const filename = `${Date.now()}-${Math.round(Math.random() * 999999)}${ext}`;

    cb(null, filename);
  },
});
export const uploadProductImages = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
