import prisma from "@repo/db/client";
import ChatPage from "./ChatPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export default async function ChatPageWrapper() {
    const session = await getServerSession(authOptions);
    const userID = Number(session?.user.id);
    
    if(!session){
        return(
            <div>
                You are not Logged in
            </div>
        )
    }

    const teams = await prisma.team.findMany({
        where: {
            members: {
                some: {userId: userID}
            }
        },
        select: {
            id: true,
            name: true,
        },
    });

    return (
        <ChatPage teams={teams} session={session}/>
    );
}
