import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByEmail, getUserByUsername, addUser } from "../models/usersModel.js";


//Käyttäjän rekisteröinti
export async function registerUser(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Salasanan validointi
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long and include at least one uppercase letter and one number",
      });
    }

    //Tarkistetaan onko käyttäjätunnus jo käytössä
    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ error: "Username is already in use" });
    }

    //Tarkistetaan onko sähköposti jo käytössä
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    //Hashataan salasana, ehkä turha rivi?? usersModelin addUser tekee hashin??
    const hash = await bcrypt.hash(password, 10);

    //addUser odottaa user-objektia
    const newUser = await addUser({
      username,
      email,
      password,
      avatar_url: null,
      bio: null,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    next(err);
  }
}

//Käyttäjän kirjautuminen
export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    //Haetaan käyttäjä tietokannasta
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verrataan salasanaa hashattuun versioon
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    //Luodaan JWT-token
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
}
