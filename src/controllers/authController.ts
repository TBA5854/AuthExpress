import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthToken } from "../types/authTypes";
import prisma from "../helpers/dbController";

enum AuthMode {
    PASSWORD = "password",
    GOOGLE = "google",
}

export async function login(req: Request, res: Response): Promise<void> {
    const email: string = req.body.email;
  const mode: string = req.body.mode;
  if (!mode) {
    res.status(400).send("Mode is required");
    return;
  }
  if (mode !== AuthMode.PASSWORD && mode !== AuthMode.GOOGLE) {
    res.status(400).send("Invalid mode");
    return;
  }
  const isPasswordAuth = mode === AuthMode.PASSWORD;
  if (!email) {
    res.status(400).send("Email is required");
    return;
  }
    const user = await prisma.user.findUnique({ where: { email }, include: { googleAuth: !isPasswordAuth, passwordAuth: isPasswordAuth } });
    // console.log(user);
    if (!user) {
        res.status(404).send("User Doesn't Exists");
        return;
    }
    
  if (mode === AuthMode.PASSWORD) {
    const password: string = req.body.password;
    if (!password) {
      res.status(400).send("Password is required");
      return;
    }
    if (!user.passwordAuth) {
      res.status(401).json({ message: "User doesn't have password authentication" });
      return;
    }
    const hashedPassword = user.passwordAuth.password;
  
    const loggingUser = await bcrypt.compare(password, hashedPassword);
    if (!loggingUser) {
        res.status(401).send("Incorrect Password");
        return;
    }
    
    console.log(loggingUser);
    const user_id = user.id;
    const token = jwt.sign({ user_id }, process.env.JWT_SECRET!, { expiresIn: '180d' });
    res.send({ token, is_first_time: false, message: "Old User" });
  } else if (mode === AuthMode.GOOGLE) {
      const token = req.body.token;
    if (!token) {
        res.status(400).send("Token is required");
        return;
    }
    const url = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`;
      // console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        res.status(400).json({ message: "Invalid token" ,token});
        return;
      }
      const tokenInfo:AuthToken = await response.json();
      if (tokenInfo.email !== email) {
        res.status(400).json({ message: "Token email does not match provided email" });
        return;
      }
      const existingToken = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET!, { expiresIn: "180d" });
      res.status(200).json({ token: existingToken, is_first_time: false, message: "Old User" });
  }
}


export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { email, mode } = req.body;
    const username: string = req.body.username;
    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }

    if (!mode || (mode !== AuthMode.PASSWORD && mode !== AuthMode.GOOGLE)) {
      res.status(400).json({ message: "Invalid or missing mode" });
      return;
    }

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    let user;
    if (mode === AuthMode.PASSWORD) {
      const password: string = req.body.password;
      if (!password || password.length < 6) {
        res.status(400).json({ message: "Password must be at least 6 characters" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = await prisma.user.create({
        data: {
          email,
          username,
          passwordAuth: {
            create: {
              password: hashedPassword,
            },
          },
        },
      });
    } else if (mode === AuthMode.GOOGLE) {
      const token: string = req.body.token;
      if (!token) {
        res.status(400).json({ message: "Google token is required" });
        return;
      }

      const googleRes = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
      if (!googleRes.ok) {
        res.status(400).json({ message: "Invalid Google token" });
        return;
      }

      const tokenInfo: AuthToken = await googleRes.json();

      if (tokenInfo.email !== email) {
        res.status(400).json({ message: "Token email does not match provided email" });
        return;
      }

      user = await prisma.user.create({
        data: {
          email,
          username,
          googleAuth: {
            create: {
              googleId: tokenInfo.user_id,
            },
          },
        },
      });
    }

    const user_id = user!.id;
    const jwtToken = jwt.sign({ user_id }, process.env.JWT_SECRET!, { expiresIn: "180d" });

    res.status(201).json({ token: jwtToken, is_first_time: true, message: "Signup successful" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
