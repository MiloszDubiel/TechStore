import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/sellers",
  filename: (req: any, file: any, cb: any) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadSellerLogo = multer({
  storage,
});
