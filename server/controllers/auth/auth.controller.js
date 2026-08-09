import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/db.js";

const isProduction = process.env.NODE_ENV === "production";
const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req, res) {
  try {
    const { username, email, password, bookingRef } = req.body;

    if (!username || !email || !password || !bookingRef) {
      return res.status(400).json({
        success: false,
        message: "Username, email, password and booking reference are required",
      });
    }

    const isAlreadyRegistered = await prisma.user.findUnique({
      where: { email },
    });

    if (isAlreadyRegistered) {
      return res.status(409).json({
        success: false,
        message: "User Already Registered",
      });
    }

    const passenger = await prisma.passenger.findUnique({
      where: {
        bookingRef,
      },
    });

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Invalid booking reference",
      });
    }

    if (passenger.userId) {
      return res.status(409).json({
        success: false,
        message: "This passenger already has an account",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,

        passenger: {
          connect: {
            id: passenger.id,
          },
        },
      },

      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await prisma.session.create({
      data: {
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = jwt.sign(
      { id: user.id, sessionId: session.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
      },
      accessToken,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        passenger: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Registered",
      });
    }

    if (user.role === "PASSENGER" && !user.passenger) {
      return res.status(403).json({
        success: false,
        message: "No passenger profile linked to this account",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await prisma.session.create({
      data: {
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = jwt.sign(
      { id: user.id, sessionId: session.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
      },
      accessToken,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Token Not Found",
      });
    }

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await prisma.session.findFirst({
      where: { refreshTokenHash },
    });

    if (!session) {
      res.clearCookie("refreshToken");
      return res.status(401).json({
        success: false,
        message: "Session Not Found",
      });
    }

    await prisma.session.update({
      where: { id: session.id },
      data: { revoked: true },
    });

    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged Out Successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function refresh(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token Not Found",
      });
    }

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const session = await prisma.session.findUnique({
      where: { refreshTokenHash },
    });

    if (
      !session ||
      session.revoked ||
      session.expiresAt < new Date() ||
      session.userId !== decoded.id
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid Session",
      });
    }

    const accessToken = jwt.sign(
      { id: session.userId, sessionId: session.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const newRefreshToken = jwt.sign(
      { id: session.userId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const newRefreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    await prisma.session.update({
      where: { id: session.id },
      data: { refreshTokenHash: newRefreshTokenHash },
    });

    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    res.status(200).json({
      success: true,
      message: "Token refreshed Successfully",
      accessToken,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
