import dotenv from "dotenv"
dotenv.config()
export class ApplicationError extends Error {
    constructor(error, code) {
        const message = process.env.NODE_ENVIRONMENT == "development" ? error : "Internal server error"
        console.log("message in err handler", message)
        super(message);
        this.code = code;
    }
}