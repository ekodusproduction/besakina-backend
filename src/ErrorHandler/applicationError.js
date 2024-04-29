import dotenv from "dotenv"
dotenv.config()
export class ApplicationError extends Error {
    constructor(error, code) {
        const message = process.env.NODE_ENVIRONMENT == "development" ? error : "Internal server error"
        super(message);
        this.code = code;
    }
}