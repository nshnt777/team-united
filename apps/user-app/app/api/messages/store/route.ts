import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

interface MessageInterface{
    text: string,
    userId: number,
    teamId: number
}

export async function POST(req: NextRequest) {

    try {
        const msg: MessageInterface = await req.json();
        console.log(msg)
        const message = await prisma.message.create({
            data: {
                text: msg.text,
                userId: Number(msg.userId),
                teamId: Number(msg.teamId)
            },
        });
    
        return NextResponse.json({
            messageID: message.id, 
            success: true 
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error storing message:', error);
        return NextResponse.json({
            error: 'Something went wrong',
            success: false
        }, { status: 500 });
    }
}
