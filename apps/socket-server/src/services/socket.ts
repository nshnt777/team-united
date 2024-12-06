import axios from 'axios';
import { Server } from 'socket.io'


interface Message{
    id: number
    username: string,
    userID: number,
    text: string
}

type ChatEventData = Omit<Message, 'id'> & {roomID: number};

class SocketService {
    private _io: Server;

    constructor() {
        console.log("init socket server");
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: "*"
            }
        });
    }

    public get io(): Server {
        return this._io;
    }

    public initListeners() {
        const io = this.io;
        console.log("initializing socket listeners...");

        io.on('connect', (socket) => {
            console.log("new socket connected ", socket.id);

            socket.on('chat message', async (data: ChatEventData ) => {

                const { roomID, username, userID, text } = data;

                // store the msg
                const response = await axios.post('http:localhost:3000/api/messages/store', {
                    text: text,
                    userId: userID,
                    teamId: roomID
                });

                if(response.data.success){
                    const messageID = response.data.messageID

                    io.to(`team-${roomID}`).emit('message', {
                        id: messageID,
                        username: username,
                        userID: userID,
                        text: text
                    });
                }
                else{
                    console.log("Error storing message")
                }

            });

            socket.on("join room", (room) => {
                socket.join(`team-${room}`);
                console.log(`User ${socket.id} joined room team-${room}`)
            })

            socket.on('disconnect', (reason) => {
                console.log(`Socket ${socket.id} disconnected. Reason: ${reason}`);
            });

            socket.on('error', (err) => {
                console.error(`Socket error from ${socket.id}: `, err);
            });
        });
    }
}

export default SocketService;