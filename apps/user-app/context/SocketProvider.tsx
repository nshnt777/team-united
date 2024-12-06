'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { io, Socket } from "socket.io-client";

export interface Message{
    id: number
    username: string,
    userID: number,
    text: string
}

interface SocketContextData{
    sendMessage: (roomID: number | null, username: string, userID: number, text: string)=>any,
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
    joinRoom: (roomId: number) => any
}

export const SocketContext = createContext<SocketContextData | null>(null);

export function useSocket(){
    const socket = useContext(SocketContext);

    if(!socket){
        throw new Error("socket is undefined");
    }
  
    return socket;
}

interface SocketProviderProps{
    children?: React.ReactNode
}

export default function SocketProvider({children}: SocketProviderProps){
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentRoom, setCurrentRoom] = useState<number | null>(null);

    const sendMessage : SocketContextData['sendMessage']  = useCallback((roomID, username, userID, msg)=>{
        if(socket){
            socket.emit("chat message", { 
                roomID: roomID,
                username: username,
                userID: userID,
                text: msg
            });
        }
    }, [socket]);

    const recieveMessage = useCallback((msg: Message)=>{
        console.log("From server: ", msg);
        setMessages((prev)=>{
            return [msg, ...prev]
        })
    }, []);

    const joinRoom : SocketContextData['joinRoom'] = useCallback((roomID)=>{
        if(socket && roomID !== currentRoom){
            console.log("Joining room: "+ roomID);
            socket.emit("join room", roomID);
            setMessages([]);
        }
    }, [socket, currentRoom])

    useEffect(()=>{
        const _socket = io('http://localhost:8080');

        // registering an event which can be emitted by server
        _socket.on("message", recieveMessage); // when the message event is emitted, run the recieveMessage function
        _socket.on("join room", joinRoom);
        
        setSocket(_socket);

        return ()=>{
            _socket.disconnect();
            _socket.off("message", recieveMessage);
            _socket.off("join room", joinRoom);
            setSocket(undefined);
            setCurrentRoom(null);
        };
    }, []);

    const contextValues = useMemo(()=>{
        return {
            sendMessage,
            messages,
            setMessages,
            joinRoom
        }
    }, [sendMessage, messages, joinRoom]);
        
    return (
        <SocketContext.Provider 
            value={contextValues}
        >
            {children}
        </SocketContext.Provider>
    )
}