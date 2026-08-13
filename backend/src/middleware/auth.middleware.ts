import jwt from "jsonwebtoken";


export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      message: "Brak tokena",
    });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token wygasł",
    });
  }
};
