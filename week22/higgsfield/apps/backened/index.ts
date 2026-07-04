import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import axios from "axios";
import bcrypt from "bcryptjs";
import { GoogleGenAI } from "@google/genai";

import { prisma } from "./db";
import { CreateAvatarSchema, CreateUserSchema, SignInSchema } from "./types";
import { authMiddleware, signToken, type AuthedRequest } from "./middleware";

const app = express();
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});

const ASSETS_DIR = path.join(process.cwd(), "assets");
fs.mkdirSync(ASSETS_DIR, { recursive: true });

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "API is running" });
});

app.post("/api/v1/signup", async (req, res) => {
    const { success, data, error } = CreateUserSchema.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "incorrect credentials",
            errors: error.flatten()
        })
        return;
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            res.status(409).json({ message: "email already registered" });
            return;
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
            },
        });

        const token = signToken(user.id);
        res.json({ id: user.id, token });
        } catch (err) {
            console.error("signup error:", err);
            res.status(500).json({ message: "could not create user" });
        }
});




app.post("/api/v1/signin", async (req, res) => {
  const { success, data } = SignInSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({ message: "incorrect credentials" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      res.status(401).json({ message: "invalid email or password" });
      return;
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches) {
      res.status(401).json({ message: "invalid email or password" });
      return;
    }

    const token = signToken(user.id);
    res.json({ success: true, message: "User signed in", token });
  } catch (err) {
    console.error("signin error:", err);
    res.status(500).json({ message: "could not sign in" });
  }
});


/*
app.post("/api/v1/avatar", async (req, res) => {

    const { success, data } = CreateAvatarSchema.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "incorrect payload"
        })
        return;
    }

    // Download the source image
    const imageResponse = await axios.get(data.image, { responseType: "arraybuffer" });
    const base64Image = Buffer.from(imageResponse.data, "binary").toString("base64");

    // Generate avatar with Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "Create a left side profile portrait headshot for this user, " +
                "based on the given image. Keep it photorealistic and well lit.",
            },
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const parts = response.candidates?.[0]?.content?.parts!;
    if (!parts || parts.length === 0) {
      res.status(502).json({ message: "no response from image model" });
      return;
    }

    let savedFilePath: string | null = null;

    for (const part of parts) {
        if (part.text) {
            console.log("model text:", part.text);
        } else if (part.inlineData?.data) {
            const buffer = Buffer.from(part.inlineData.data, "base64");

        const filename = `avatar-${req.userId}-${Date.now()}.png`;
        const filePath = path.join(ASSETS_DIR, filename);

        fs.writeFileSync(filePath, buffer);

        savedFilePath = filePath;
        console.log("Image saved as", filename);
        }
    }

    if (!savedFilePath) {
      res.status(502).json({ message: "Model did not return an image" });
      return;
    }

    const avatar = await prisma.avatar.create({
      data: {
        name: data.name,
        sourceImageUrl: data.image,
        filePath: savedFilePath,
        userId: req.userId!,
      },
    });

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      avatar,
    });

    res.json({
        success: true,
        message: "Avatar uploaded",
    });
});
*/

app.post("/api/v1/avatar", authMiddleware, async (req: AuthedRequest, res) => {
  const { success, data } = CreateAvatarSchema.safeParse(req.body);

  if (!success) {
    res.status(400).json({ message: "incorrect payload" });
    return;
  }

  try {
    // Download the source image
    const imageResponse = await axios.get(data.image, {
      responseType: "arraybuffer",
    });

    const base64Image = Buffer.from(imageResponse.data).toString("base64");

    // Generate avatar with Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "Create a left side profile portrait headshot for this user based on the given image. Keep it photorealistic and well lit.",
            },
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const parts = response.candidates?.[0]?.content?.parts;

    if (!parts || parts.length === 0) {
      res.status(502).json({ message: "No response from image model" });
      return;
    }

    let savedFilePath: string | null = null;

    for (const part of parts) {
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData?.data) {
        const buffer = Buffer.from(part.inlineData.data, "base64");

        const filename = `avatar-${req.userId}-${Date.now()}.png`;
        const filePath = path.join(ASSETS_DIR, filename);

        fs.writeFileSync(filePath, buffer);

        savedFilePath = filePath;
        console.log("Image saved as", filename);
      }
    }

    if (!savedFilePath) {
      res.status(502).json({ message: "Model did not return an image" });
      return;
    }

    const avatar = await prisma.avatar.create({
      data: {
        name: data.name,
        sourceImageUrl: data.image,
        filePath: savedFilePath,
        userId: req.userId!,
      },
    });

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      avatar,
    });
  } catch (error) {
    console.error("Avatar generation error:", error);
    res.status(500).json({
      success: false,
      message: "Avatar generation failed",
    });
  }
});

app.get("/api/v1/avatars", authMiddleware, async (req: AuthedRequest, res) => {
  try {
    const avatars = await prisma.avatar.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, avatars });
  } catch (err) {
    console.error("fetch avatars error:", err);
    res.status(500).json({ message: "could not fetch avatars" });
  }
});


app.post("/api/v1/video", authMiddleware, async (req: AuthedRequest, res) => {
  // TODO: video generation is long-running (often 30s-several minutes).
  // Don't do this synchronously in the request handler:
  //   1. Create a "pending" Video row in the DB and return its id immediately.
  //   2. Kick off the generation job (e.g. Veo) in the background / a queue.
  //   3. Update the row to "completed" (with the output URL) or "failed" when done.
  //   4. Let the client poll GET /api/v1/video/:id or use a webhook/websocket.
  res.status(501).json({
    success: false,
    message: "Video generation not implemented yet",
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});