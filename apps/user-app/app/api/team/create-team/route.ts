import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@repo/db/client';
import { Team, teamSchema } from '@repo/validation/team';
import { authOptions } from '@/app/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const team: Team = await req.json();

        const validTeam = teamSchema.safeParse(team)

        if (!validTeam.success) {
            return NextResponse.json({
                error: 'Invalid Data Sent' 
            }, { status: 400 });
        }

        // Ensure hobby exists
        const hobby = await prisma.hobby.findUnique({
            where: { id: team.hobbyId },
        });

        if (!hobby) {
            return NextResponse.json({
                error: 'Invalid hobby selected'
            }, { status: 404 });
        }

        // Create the team
        const createdTeam = await prisma.team.create({
            data: {
                name: team.name,
                description: team.description,
                hobby: {
                    connect: {
                        id: team.hobbyId
                    }
                },
                members: {
                    create: [
                        {
                            user: {
                                connect: {
                                    id: Number(session.user.id)
                                }
                            },
                            role: "Leader"
                        }
                    ]
                }
            },
        });

        return NextResponse.json({
            success: true 
        }, { status: 200 });
    }
    catch (error) {
        console.error('Error creating team:', error);
        return NextResponse.json({
            error: 'Something went wrong'
        }, { status: 500 });
    }
}
