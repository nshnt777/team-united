import prisma from '@repo/db/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const teamID = Number(searchParams.get("teamID"));
    const cursor = Number(searchParams.get('cursor'));
    const take = Number(searchParams.get('take') || '20');

    if (!teamID) {
        return NextResponse.json({ 
            error: 'Team ID is required' 
        }, { status: 400 });
    }

    try{
        const messages = await prisma.message.findMany({
            take: take,
            skip: cursor? 1 : 0,
            cursor: cursor ? {
                id: cursor
            } : undefined,

            where: {
                teamId: teamID
            },

            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            },

            orderBy: {
                createdAt: 'desc'
            }
        });


        return NextResponse.json({
            messages: messages.map((msg)=>{
                return {
                    id: msg.id,
                    username: msg.user.username,
                    userID: msg.userId,
                    text: msg.text
                }
            })
        }, {status: 201});
    }
    catch(error){
        return NextResponse.json({
            error: "Failed to fetch messages",
            success: false
        }, {status: 500});
    }

}
