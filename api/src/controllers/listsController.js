import * as listsModel from "../models/listsModel.js";

export const getLists = async (req, res) => {
  try {
    const lists = await listsModel.getAllLists();
    res.json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getListById = async (req, res) => {
  try {
    const list = await listsModel.getListById(req.params.id);
    if (!list) return res.status(404).json({ error: "List not found" });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const createList = async (req, res) => {
  try {
    const { name, description, owner_user_id, owner_group_id, is_public = false } = req.body;

    if (!owner_user_id && !owner_group_id) {
      return res.status(400).json({
        error: "A list must have either owner_user_id or owner_group_id"
      });
    }

    if (owner_user_id && owner_group_id) {
      return res.status(400).json({
        error: "A list cannot belong to both a user and a group"
      });
    }

    const newList = await listsModel.addList({
      name,
      description,
      owner_user_id: owner_user_id || null,
      owner_group_id: owner_group_id || null,
      is_public
    });

    res.status(201).json(newList);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error while creating list" });
  }
};

export const updateList = async (req, res) => {
  try {
    const updatedList = await listsModel.updateList(req.params.id, req.body);
    if (!updatedList) return res.status(404).json({ error: "List not found" });
    res.json(updatedList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const patchList = async (req, res) => {
  try {
    const updated = await listsModel.patchList(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "List not found or no fields provided" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const deleteList = async (req, res) => {
  try {
    const deletedList = await listsModel.deleteList(req.params.id);
    if (!deletedList) return res.status(404).json({ error: "List not found" });
    res.json({ message: "List deleted", list: deletedList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getSharedList = async (req, res) => {
  try {
    const shareId = req.params.share_id;

    const list = await listsModel.getListByShareId(shareId);

     if (!list) {
      return res.status(404).json({ error: "Shared list not found" });
    }

    if (!list.is_public) {
      return res.status(403).json({ error: "This list is not public" });
    }

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error"});
  }
};