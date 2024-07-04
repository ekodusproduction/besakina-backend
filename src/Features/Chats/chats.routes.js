import { Router } from "express";
import { getChatRooms, getMessagesInChatRoom } from "./chats.controller.js";
import { jwtAuth } from "../../Middlewares/auth.middleware.js";
const chatRouter = Router()

chatRouter.get('/rooms', jwtAuth, getChatRooms)
chatRouter.get('/rooms/id/:id/messages', jwtAuth, getMessagesInChatRoom)

export default chatRouter