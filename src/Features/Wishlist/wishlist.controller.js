import { ApplicationError } from "../../ErrorHandler/applicationError.js";
import User from "../Users/Models/UserModel.js";
import { sendResponse, sendError } from "../../Utility/response.js";
import { ensureUniqueArray } from "../../Utility/ensureUniqueArray.js"

export const addWishListItem = async function (req, res, next) {
    const user = req.user;
    const data = req.body.adv_id;

    try {
        // First, add the new item to the wishlist
        const updatedUser = await User.findByIdAndUpdate(
            user,
            { $push: { wishlist: data } },
            { new: true }
        );

        if (!updatedUser) {
            throw new ApplicationError('User not found', 404);
        }

        const uniqueUser = await ensureUniqueArray(updatedUser._id);

        console.log("wishlist ", uniqueUser.wishlist);

        return await sendResponse(res, 'Advertisement added to wishlist successfully', 201, uniqueUser._id);
    } catch (error) {
        next(new ApplicationError(error.message || 'Internal server error', 500));
    }
};

export const removeWishListItem = async function (req, res, next) {
    const user = req.user;
    const advId = req.params.id;

    try {
        const result = await User.findByIdAndUpdate(
            user,
            { $pull: { wishlist: advId } },
            { new: true, useFindAndModify: false }
        );

        if (!result) {
            throw new ApplicationError('User not found', 404);
        }

        return await sendResponse(res, 'Wishlist item deleted successfully.', 200);
    } catch (error) {
        next(new ApplicationError(error.message || 'Internal server error', 500));
    }
};


export const getWishList = async function (req, res, next) {
    const userId = req.user;
    try {
        const user = await User.findById(userId).populate('wishlist');
        if (!user) {
            throw new ApplicationError('User not found', 404);
        }

        if (user.wishlist.length === 0) {
            return await sendResponse(res, "Wishlist is empty", 200);
        }

        return await sendResponse(res, 'Wishlist details fetched successfully', 200, user.wishlist);
    } catch (error) {
        next(new ApplicationError(error.message || 'Internal server error', 500));
    }
};
