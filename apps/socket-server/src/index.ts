import http from 'http';
import SocketService from './services/socket';

const httpServer = http.createServer();
const PORT = process.env.PORT || 8080;

const socketService = new SocketService();
socketService.io.attach(httpServer);

httpServer.listen(PORT, ()=>{
    console.log(`http server started at ${PORT}`);
});

socketService.initListeners();