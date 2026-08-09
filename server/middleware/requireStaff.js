import { prisma } from "../lib/db.js";

export default async function staff(req, res, next) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not Authenticated",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
      },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Found",
      });
    }

    if (user.role !== "STAFF") {
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }

    req.staff = user;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
