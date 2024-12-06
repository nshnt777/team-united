"use client"

import SocketProvider, { Message, SocketContext, useSocket } from "@/context/SocketProvider";
import axios from "axios";
import { Session } from "next-auth";
import { useSearchParams } from "next/navigation";
// import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

type TeamData = {
    id: number,
    name: string
}

export default function ChatPage({ teams, session }: { teams: TeamData[], session: Session | null }) {

    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const params = useSearchParams();
    const teamId = params.get("teamId");

    useEffect(() => {
        if (teamId){
            const isMember = teams.some((team)=>{
                return team.id === Number(teamId);
            });

            if(isMember){
                setSelectedChat(Number(teamId));
                setError(null);
            }
            else{
                // alert("User is not a member of this team");
                setError("You are not a member of this team.");
            }
        }
    }, [teamId, teams]);

    if(error && !selectedChat){
        return(
            <SocketProvider>
            <div className="flex flex-grow w-full items-stretch">
                <Sidebar
                    teams={teams}
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                />

                <div className="flex justify-center items-center h-full w-full">
                    <p className="text-red-500 text-2xl font-bold text-center">{error}</p>
                </div>
            </div>
        </SocketProvider>
        )
    }

    return (
        <SocketProvider>
            <div className="flex flex-grow w-full items-stretch">
                <Sidebar
                    teams={teams}
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                />
                <TeamChat
                    selectedTeam={selectedChat}
                    session={session} />
            </div>
        </SocketProvider>
    )
}

interface SidebarProps {
    teams: TeamData[],
    selectedChat: number | null,
    setSelectedChat: (teamId: number) => void
}

export function Sidebar({ teams, selectedChat, setSelectedChat }: SidebarProps) {
    const { joinRoom } = useSocket();

    const joinChat = useCallback((teamId: number)=>{
        setSelectedChat(teamId);
        joinRoom(teamId);
    }, [setSelectedChat, joinRoom]);

    return (
        <div className="w-1/4 bg-gray-100 p-2 border-r border-gray-200">
            <h2 className="md:text-lg text-md text-center font-bold mb-2">Your Teams</h2>
            <ul className="flex flex-col gap-2">
                {teams.map(team => (
                    <li
                        key={team.id}
                        className={`p-2 rounded cursor-pointer ${
                            selectedChat === team.id ? 'bg-blue-500 text-white' : 'bg-white'
                        }`}
                        onClick={() => {
                            joinChat(team.id)
                        }}
                    >
                        {team.name}
                    </li>
                ))}
            </ul>
        </div>

    )
}

export function TeamChat({ selectedTeam, session }: { selectedTeam: number | null, session: Session | null }) {
    const { sendMessage, messages, setMessages } = useSocket();
    // const skt = useContext(SocketContext);
    // sendMessage = skt.sendMessage

    const [msg, setMsg] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const isAtBottom = useRef(true);
    const cursor = useRef<number | null>(null);
    const initialLoadComplete = useRef(false);

    const username = session?.user?.name || "";
    const userID = Number(session?.user.id);

    const loadMessages = useCallback(async (scrolled: boolean)=>{
        if (!selectedTeam || loading) {
            return;
        }

        setLoading(true);

        try {

            const res = await axios.get(`/api/messages/get?teamID=${selectedTeam}&take=20&cursor=${cursor.current}`);

            const newMessages = res.data.messages as Message[];

            if (newMessages && newMessages.length > 0) {
                if (scrolled) {
                    const scrollOffset = chatContainerRef.current?.scrollHeight ||  0;

                    setMessages((prev) => {
                        return [...prev, ...newMessages];
                    });

                    setTimeout(() => {
                        if (chatContainerRef.current) {
                            const chat = chatContainerRef.current;

                            chat.scrollTop = chat.scrollHeight - scrollOffset - 10;
                        }
                    }, 1);
                }
                else {
                    setMessages(newMessages);
                }

                // setCursor(messages[messages.length - 1]?.id ?? null);
                cursor.current = newMessages[newMessages.length - 1]?.id || null;

            }

        }
        catch (error) {
            console.log("Failed to load messages: ", error);
        }
        finally {
            setLoading(false);
            if(!scrolled){
                initialLoadComplete.current = true;
            }
        }
    }, [selectedTeam, setMessages]);

    const scrollToBottom = useCallback(()=>{
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    useEffect(() => {
        if (selectedTeam) {
            cursor.current = null;
            initialLoadComplete.current = false;
            isAtBottom.current = true;
            // loadMessages(false);
            setMessages([]);
        }
    }, [selectedTeam, setMessages]);

    useEffect(() => {
        let mounted = true;

        if (selectedTeam && !initialLoadComplete.current) {
            const loadInitialMessages = async () => {
                if (!mounted) return;
                await loadMessages(false);
            };
            loadInitialMessages();
        }

        return () => {
            mounted = false;
        };
    }, [selectedTeam, loadMessages]);

    useEffect(() => {
        if (isAtBottom.current) {
            scrollToBottom();
        }
    }, [messages, scrollToBottom]);


    const handleScroll = useCallback(()=>{
        if (chatContainerRef.current) {
            const chat = chatContainerRef.current;
            
            // Check if user is at the bottom
            isAtBottom.current = chat.scrollTop + chat.clientHeight >= chat.scrollHeight - 10;

            if(chat.scrollHeight == chat.clientHeight){
                return
            }

            if (chat.scrollTop === 0 && !loading) {
                loadMessages(true);
            }
        }
    }, [loadMessages, loading])

    const send = useCallback(async ()=>{
        if (!msg.trim() || !selectedTeam) return;

        // send msg to socket
        sendMessage(selectedTeam, username, userID, msg);
        setMsg('');
        isAtBottom.current = true;
    }, [msg, selectedTeam, sendMessage, username, userID]);

    if (!selectedTeam) {
        return (
            <div className="w-3/4 p-5 h-full">
                <div className="w-full h-full flex justify-center items-center">
                    <h1 className="font-semibold text-lg">All messages will appear here</h1>
                </div>
            </div>
        );
    }

    return (

        <div className="w-3/4 flex-grow flex flex-col justify-between h-full max-h-screen">
            <div 
                className="px-5 py-2 overflow-y-auto"
                ref={chatContainerRef}
                onScroll={handleScroll}
            >

                {messages.length === 0 ?
                    <h1 className="text-center font-semibold text-lg">Send a message to start a chat!</h1>
                    :
                    <ul>{
                        messages.slice().reverse().map((msg, index) => {
                            return (
                                <li
                                    key={index}
                                    className={`flex ${msg.userID == session?.user.id ? 'justify-end mb-1' : 'justify-start mb-2'} text-wrap`}
                                >
                                    <div
                                        className={`max-w-full text-wrap text-xs px-2 py-1.5 rounded-md shadow-md 
                                    ${msg.userID == session?.user.id ?
                                                'bg-blue-500 text-white rounded-br-none'
                                                :
                                                'bg-gray-200 text-gray-900 rounded-bl-none'}`}
                                    >
                                        <p className="font-bold mb-0.5">{msg.username}</p>
                                        <p className="whitespace-pre-wrap break-words text-wrap">{msg.text}</p>
                                    </div>
                                </li>
                            )
                        })
                    }</ul>
                }

                <div ref={messagesEndRef}></div>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    send();
                }}
                className="w-full flex justify-end items-center px-1.5 pb-2"
            >
                <input
                    type="text"
                    placeholder="Message..."
                    value={msg}
                    className="border-2 bg-gray-100 outline-none rounded-md mr-0.5 px-1.5 py-0.5 w-full"
                    onChange={(e) => {
                        setMsg(e.target.value);
                    }}
                />

                <button type="submit"
                    disabled={msg == '' ? true : false}
                    className="bg-blue-500 rounded-md px-3 text-white py-0.5 border-2 border-blue-500 disabled:text-gray-500 disabled:bg-gray-300 disabled:border-gray-300">
                    Send
                </button>
            </form>
        </div>


    )
}