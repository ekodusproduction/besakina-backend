import { sendError } from "../Utility/response.js"

export const requestBodyValidator = async function (req, res, next) {
    if (req.body == {}) {
        return sendError(res, "No request body", 400)
    }
    next()
}