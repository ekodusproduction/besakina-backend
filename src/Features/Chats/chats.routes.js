import { Router } from "express";
import { getChatRooms, getMessagesInChatRoom } from "./chats.controller.js";
const chatRouter = Router()

chatRouter.get('/rooms/id/:id', getChatRooms)
chatRouter.get('/messages/id/:id', getMessagesInChatRoom)

export default chatRouter