import { getServerSession } from 'next-auth';
import prisma from '@repo/db/client';
import { authOptions } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import JoinTeam from '../../../../components/JoinTeam';

export default async function TeamDetails({ params }: { params: { teamId: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const userId = Number(session?.user.id);
    const teamId = Number(params.teamId);

    const team = await prisma.team.findUnique({
        where: {
            id: teamId
        },
        include: {
            hobby: true,
            members: {
                select: {
                    user: {
                        select: {
                            username: true,
                            id: true
                        }
                    },
                    role: true
                }
            }
        },
    });

    if (!team) {
        return <p>Team not found</p>;
    }

    const isMember = await prisma.userTeam.findFirst({
        where: {
            teamId: teamId,
            userId: userId,
        },
    });

    return (
        <div className="container size-full flex flex-col items-center justify-center mx-auto p-4">
            <h1 className="text-2xl font-bold">{team.name}</h1>
            
            <p className=''>
                <strong>Main Sport: </strong> 
                {team.hobby.name}
            </p>

            <p>{team.description}</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt hic ipsum vel nihil recusandae. Cumque possimus id, voluptates ea consequatur est officiis quaerat aliquam laboriosam sit ullam fugit quisquam magnam?
            Id enim dolorum eos ad iusto at beatae distinctio quia consequuntur illum ipsa, cumque, repellat iure accusamus! Inventore accusamus illum, quaerat libero fugit laudantium delectus veniam dolores corrupti, explicabo ipsam.</p>

            <div className=' self-start border rounded-md px-2 py-1 mt-3'>
                <h2 className='text-lg font-bold'>Team members</h2>
            
                {team.members.map((member)=>{
                    if(member.role === "Leader"){
                        return(
                            <p key={member.user.id}>{member.user.username} : {member.role}</p>
                        )

                    }

                    return(
                        <p key={member.user.id}>{member.user.username}</p>
                    )
                })
                }
                
                
            </div>

           <JoinTeam teamId={teamId} userId={userId} isMember = {!!isMember}/>
        </div>
    );
}
