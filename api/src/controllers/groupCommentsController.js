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
        const userId = req.user.userId;
        const { group_id, content } = req.body;

        if (!content || !group_id) {
            return res.status(400).json({ error: "Missing content or group_id" });
        }

        const newComment = await gcModel.addGroupComment({
            user_id: userId,
            group_id,
            content
        });
        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const updateGroupComment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const commentId = req.params.id;

        const comment = await gcModel.getGroupCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.user_id !== userId) {
            return res.status(403).json({ error: "You can only edit your own comments" });
        }

        const updated = await gcModel.updateGroupComment(commentId, req.body);
        if (!updated) return res.status(404).json({ error: "Comment not found" });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const patchGroupComment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const commentId = req.params.id;

        const comment = await gcModel.getGroupCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.user_id !== userId) {
            return res.status(403).json({ error: "You can only edit your own comments" });
        }

        const updated = await gcModel.patchGroupComment(commentId, req.body);
        if (!updated) return res.status(404).json({ error: "Comment not found or no fields provided" });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

export const deleteGroupComment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const commentId = req.params.id;

        const comment = await gcModel.getGroupCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.user_id !== userId) {
            return res.status(403).json({ error: "You can only delete your own comments" });
        }

        const deleted = await gcModel.deleteGroupComment(commentId);
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