import { Router } from "express";
import { getChatRooms, getMessagesInChatRoom } from "./chats.controller.js";
const chatRouter = Router()

chatRouter.get('/rooms', getChatRooms)
chatRouter.get('/rooms/id/:id/messages', getMessagesInChatRoom)

export default chatRouter