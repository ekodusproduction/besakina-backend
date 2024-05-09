import dotenv from "dotenv"
dotenv.config()
export class ApplicationError extends Error {
    constructor(error, code) {
        super(message);
        this.code = code;
    }
} 