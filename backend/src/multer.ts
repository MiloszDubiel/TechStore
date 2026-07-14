import multer from "multer";
import path from "path";
import fs from "fs";

const storage1 = multer.diskStorage({
  destination: "uploads/sellers",
  filename: (req: any, file: any, cb: any) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadSellerLogo = multer({
  storage: storage1,
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
