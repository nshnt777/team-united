import prisma from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/lib/auth';

export async function POST(req: NextRequest) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
            error: 'Unauthorized'
        }, { status: 401 });
    }

    const sessionId = Number(session.user.id);
    let { teamId, userId } = await req.json();
    teamId = Number(teamId);
    userId = Number(userId);

    if (!(sessionId === userId)) {
        return NextResponse.json({
            error: 'Invalid user'
        }, { status: 401 });
    }

    try {
        const existingMembership = await prisma.userTeam.findFirst({
            where: {
                teamId: teamId,
                userId: userId,
            },
        });

        if (!existingMembership) {
            return NextResponse.json({
                error: 'User is not a member of the team'
            }, { status: 409 });
        }

        await prisma.userTeam.delete({
            where: {
                userId_teamId: {
                    userId: Number(userId),
                    teamId: Number(teamId),
                },
            },
        });

        return NextResponse.json({
            message: 'User successfully left the team'
        }, { status: 200 });
    }
    catch (error: any) {
        return NextResponse.json({
            error: 'Unable to leave team',
            message: error.message
        }, { status: 500 });
    }
}
