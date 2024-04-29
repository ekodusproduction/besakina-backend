import dotenv from "dotenv"
dotenv.config()
export class ApplicationError extends Error {
    constructor(message, code) {
        super(process.env.NODE_ENVIRONMENT === "development" ? message : "Internal server error");
        this.code = code;
    }
}