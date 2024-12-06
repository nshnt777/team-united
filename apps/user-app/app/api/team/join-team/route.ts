import prisma from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/lib/auth';

export async function POST(req: NextRequest) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
            error: 'Unauthorized'
        }, {status: 401});
    }

    const sessionId = Number(session.user.id);
    let { teamId, userId } = await req.json();
    teamId = Number(teamId);
    userId = Number(userId);

    if(!(sessionId === userId)){
        return NextResponse.json({
            error: 'Invalid user'
        }, {status: 401});
    }

    try {
        // Check if the user is already a member of the team
        const existingMembership = await prisma.userTeam.findFirst({
            where: {
                teamId: teamId,
                userId: userId,
            },
        });

        if (existingMembership) {
            return NextResponse.json({
                error: 'User is already a member of the team'
            }, {status: 409});
        }

        await prisma.userTeam.create({
            data: {
                teamId: teamId,
                userId: userId,
                role: "Member"
            }
        });

        return NextResponse.json({
            message: 'User successfully added to the team'
        }, {status: 200});
    }
    catch (error: any) {
        return NextResponse.json({
            error: 'Internal server error',
            message: error.message
        }, {status: 500});
    }
}
