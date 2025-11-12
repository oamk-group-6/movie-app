import * as commentsModel from "../models/commentsModel.js";

export const getComments = async (req, res) => {
  try {
    const comments = await commentsModel.getAllComments();
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const comment = await commentsModel.getCommentById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const createComment = async (req, res) => {
  try {
    const newComment = await commentsModel.addComment(req.body);
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const updatedComment = await commentsModel.updateComment(req.params.id, req.body);
    if (!updatedComment) return res.status(404).json({ error: "Comment not found" });
    res.json(updatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const patchComment = async (req, res) => {
  try {
    const updated = await commentsModel.patchComment(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Comment not found or no fields provided" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const deletedComment = await commentsModel.deleteComment(req.params.id);
    if (!deletedComment) return res.status(404).json({ error: "Comment not found" });
    res.json({ message: "Comment deleted", comment: deletedComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};