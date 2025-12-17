import {
    addFavouriteToGroup,
    removeFavouriteFromGroup,
    checkGroupFavourite,
    getAllGroupFavourites
} from "../models/groupFavouritesModel.js";
import * as groupsModel from "../models/groupsModel.js";


export async function getGroupFavourites(req, res) {
    try {
        const { groupId } = req.params;

        const favourites = await getAllGroupFavourites(groupId);

        res.json(favourites);
    } catch (err) {
        console.error("Error loading group favourites:", err);
        res.status(500).json({ error: "Failed to load group favourites" });
    }
}

/* POST: add movie to group favourites */
export async function createGroupFavourite(req, res) {
    try {
        const userId = req.user.userId;
        const { groupId } = req.params;
        const { movieId } = req.body;
        
        const group = await groupsModel.getGroupById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const isMember = await groupsModel.isUserMember(userId, groupId);
        if (!isMember) {
            return res.status(403).json({ error: "Only group members can add favourites" });
        }

        const result = await addFavouriteToGroup(groupId, movieId, userId);

        res.status(201).json(result);
    } catch (err) {
        console.error("Error adding group favourite:", err);
        res.status(500).json({ error: "Failed to add group favourite" });
    }
}

/* DELETE: remove movie from group favourites */
export async function deleteGroupFavourite(req, res) {
    try {
        const userId = req.user.userId;
        const { groupId, movieId } = req.params;

        const group = await groupsModel.getGroupById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const isMember = await groupsModel.isUserMember(userId, groupId);
        if (!isMember) {
            return res.status(403).json({ error: "Only group members can remove favourites" });
        }

        const result = await removeFavouriteFromGroup(groupId, movieId);
        if (!result) {
            return res.status(404).json({ error: "Favourite not found" });
        }

        res.json({ message: "Removed from group favourites" });
    } catch (err) {
        console.error("Error removing group favourite:", err);
        res.status(500).json({ error: "Failed to remove group favourite" });
    }
}

/* GET: check if movie is favourite in this group */
export async function getGroupFavouriteStatus(req, res) {
    try {
        const { groupId, movieId } = req.params;

        const isFavourite = await checkGroupFavourite(groupId, movieId);

        res.json({ isFavourite });
    } catch (err) {
        console.error("Error checking favourite:", err);
        res.status(500).json({ error: "Failed to check favourite status" });
    }
}
