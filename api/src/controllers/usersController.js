

import * as usersModel from "../models/usersModel.js";
import fs from "fs";
import path from "path";
import { updateAvatar } from "../models/usersModel.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUsers = async (req, res) => {
  try {
    const users = await usersModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await usersModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const newUser = await usersModel.addUser(req.body);
    console.log("addUser returned: ", newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Detailed error: ", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await usersModel.updateUser(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Both oldPassword and newPassword are required" });
    }

    const updatedUser = await usersModel.updatePassword(id, oldPassword, newPassword);
    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    if (err.message === "Incorrect current password") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Database error" });
  }
};

export const patchUser = async (req, res) => {
  try {
    const updated = await usersModel.patchUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "User not found or no fields provided" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    if (err.message.includes("Password")) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Database error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const userId = req.user.userId;

    if (Number(targetId) !== Number(userId)) {
      return res.status(403).json({ error: "You can only delete your own account" });
    }

    const deletedUser = await usersModel.deleteUser(targetId);

    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted", user: deletedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error:" });
  }
};

export const searchUsersByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || username.length < 1) {
      return res.json([]); // return empty list for empty query
    }

    const users = await usersModel.searchUsersByUsername(username);
    res.json(users);
  } catch (err) {
    console.error("User search error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const userId = req.params.id;
    const avatarUrl = `/uploads/${req.file.filename}`;

    const updatedUser = await usersModel.updateAvatar(userId, avatarUrl);

    res.json({ avatar_url: updatedUser.avatar_url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
};

export async function deleteAvatar(req, res, next) {
  try {
    const userId = req.params.id;

    // Haetaan käyttäjä
    const user = await usersModel.getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Poistetaan tiedosto palvelimelta, jos on olemassa
    if (user.avatar_url) {
      const filePath = path.join(__dirname, "../uploads", path.basename(user.avatar_url));
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }

    // Päivitetään tietokanta
    await updateAvatar(userId, null);

    res.json({ message: "Avatar deleted successfully", avatar_url: null });
  } catch (err) {
    next(err);
  }
}
