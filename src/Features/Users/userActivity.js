import { asyncGet, asyncSet, asyncSadd, asyncSrem, asyncSmembers, asyncSismember } from "../../../redis.js";
const ONLINE_USERS_KEY = 'online_users';

// Function to add user to online users set
const addUserToOnline = async (userId) => {
    try {
        console.log(`attempting to add ${userId} to online users.`);
        await asyncSadd(ONLINE_USERS_KEY, userId);
        await getOnlineUsers()
        console.log(`User ${userId} added to online users.`);
    } catch (error) {
        console.error('Error adding user to online users:', error);
    }
};

// Function to remove user from online users set
const removeUserFromOnline = async (userId) => {
    try {
        console.log(`attempting to remove ${userId} to online users.`);
        await asyncSrem(ONLINE_USERS_KEY, userId);
        console.log(`User ${userId} removed from online users.`);
    } catch (error) {
        console.error('Error removing user from online users:', error);
    }
};

// Function to get all online users
const getOnlineUsers = async () => {
    try {
        console.log(`attempting to fetch online users.`);
        const onlineUsers = await asyncSmembers(ONLINE_USERS_KEY);
        console.log('Online users:', onlineUsers);
        return onlineUsers;
    } catch (error) {
        console.error('Error getting online users:', error);
        return [];
    }
};

// Function to check if a user is online
const isUserOnline = async (userId) => {
    try {
        console.log(`attempting to check  online users presence of ${userId}`);
        const isOnline = await asyncSismember(ONLINE_USERS_KEY, userId);
        console.log(`User ${userId} is online:`, isOnline);
        return isOnline === 1; // Return true or false based on membership
    } catch (error) {
        console.error('Error checking user online status:', error);
        return false;
    }
};

export { addUserToOnline, removeUserFromOnline, getOnlineUsers, isUserOnline }