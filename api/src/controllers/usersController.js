import * as usersModel from "../models/usersModel.js";

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
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
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
    const deletedUser = await usersModel.deleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted", user: deletedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};
