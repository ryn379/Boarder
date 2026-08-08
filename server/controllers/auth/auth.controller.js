import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/db.js";

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    const isAlreadyRegistered = await prisma.user.findUnique({
      where: { email },
    });

    if (isAlreadyRegistered) {
      return res.status(409).json({
        success: false,
        message: "User Already Registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Registered",
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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

    if (!session || session.revoked || session.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Session Not Found or Logged Out",
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

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
