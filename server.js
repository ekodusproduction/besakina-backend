import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import http from 'http';
import { initializeSocketIO } from './socket.js';

const server = http.createServer(app);
initializeSocketIO(server);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
