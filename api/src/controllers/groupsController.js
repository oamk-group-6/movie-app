import * as groupsModel from "../models/groupsModel.js";

export const getGroups = async (req, res) => {
    try {
        const groups = await groupsModel.getAllGroups();
        res.json(groups);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Database error"});
    }
};

export const getGroupById = async (req, res) => {
  try {
    const group = await groupsModel.getGroupById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const createGroup = async (req, res) => {
  try {
    const newGroup = await groupsModel.addGroup(req.body);
    res.status(201).json(newGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const updatedGroup = await groupsModel.updateGroup(req.params.id, req.body);
    if (!updatedGroup) return res.status(404).json({ error: "Group not found" });
    res.json(updatedGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const patchGroup = async (req, res) => {
  try {
    const updated = await groupsModel.patchGroup(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Group not found or no fields provided" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const deletedGroup = await groupsModel.deleteGroup(req.params.id);
    if (!deletedGroup) return res.status(404).json({ error: "Group not found" });
    res.json({ message: "Group deleted", group: deletedGroup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};