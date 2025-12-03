import * as gcModel from "../models/groupCommentsModel.js";

export const getGroupComments = async (req, res) => {
    try {
        const comments = await gcModel.getAllGroupComments();
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const getGroupCommentById = async (req, res) => {
    try {
        const comment = await gcModel.getGroupCommentById(req.params.id);
        if (!comment) return res.status(404).json({ error: "Comment not found" });
        res.json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const createGroupComment = async (req, res) => {
    try {
        const newComment = await gcModel.addGroupComment(req.body);
        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const updateGroupComment = async (req, res) => {
    try {
        const updated = await gcModel.updateGroupComment(req.params.id, req.body);
        if (!updated) return res.status(404).json({ error: "Comment not found" });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const patchGroupComment = async (req, res) => {
    try {
        const updated = await gcModel.patchGroupComment(req.params.id, req.body);
        if (!updated) return res.status(404).json({ error: "Comment not found or no fields provided" });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const deleteGroupComment = async (req, res) => {
    try {
        const deleted = await gcModel.deleteGroupComment(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Comment not found" });
        res.json({ message: "Comment deleted", deleted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const getCommentsByGroupId = async (req, res) => {
    try {
        const comments = await gcModel.getCommentsByGroupId(req.params.groupId);
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const getGroupCommentsCount = async (req, res) => {
    try {
        const count = await gcModel.countGroupComments(req.params.groupId);
        res.json(count);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const getUserGroupComments = async (req, res) => {
    try {
        const { userId, groupId } = req.params;
        const comments = await gcModel.getUserCommentsInGroup(userId, groupId);
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};