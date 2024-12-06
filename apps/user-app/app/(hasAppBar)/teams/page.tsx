import { getServerSession } from 'next-auth';
import prisma from '@repo/db/client';
import { redirect } from 'next/navigation';
import PaginationControls from '../../../components/PaginationControls';
import { authOptions } from '../../lib/auth';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

const ITEMS_PER_PAGE = 5;

export default async function Teams({ searchParams }: { searchParams: { page?: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const page = parseInt(searchParams.page as string) || 1;

    // Fetch user hobbies
    const user = await prisma.user.findUnique({
        where: {
            id: Number(session.user.id || 1)
        },
        select: {
            hobbies: {
                select: { hobby: true }
            }
        }
    });

    const hobbies = user?.hobbies.map((hobby) => {
        return hobby.hobby.id;
    }) || [1, 2, 3, 4, 5];

    // Fetch teams based on hobbies with pagination
    const [teams, totalTeams] = await Promise.all([
        prisma.team.findMany({
            where: {
                hobbyId: {
                    in: hobbies,
                },
            },
            select: {
                id: true,
                name: true,
                hobby: true
            },
            skip: (page - 1) * ITEMS_PER_PAGE,
            take: ITEMS_PER_PAGE,
        }),

        prisma.team.count({
            where: {
                hobbyId: {
                    in: hobbies,
                },
            },
        }),
    ]);

    const totalPages = Math.ceil(totalTeams / ITEMS_PER_PAGE);

    return (
        <div className="container mx-auto p-4">

            <SearchBar page={"teams"}/>

            <div className='flex flex-row justify-between'>
                <h1 className="text-2xl font-bold">Teams Related to Your Hobbies</h1>
                <Link
                    href={"/teams/create"}
                    className="bg-green-600 text-sm text-white pt-1.5 px-1 rounded shadow-sm"
                >
                    Create Team
                </Link>
            </div>

            <div className="mt-4">
                {teams.length > 0 ? (
                    teams.map(team => (
                        <Link key={team.id}
                            href={`/teams/${team.id}`}
                            className="block border p-4 mb-4 rounded shadow-sm">
                            <h2 className="text-xl font-semibold">{team.name}</h2>
                            <p><strong>Main Sport:</strong> {team.hobby.name}</p>
                        </Link>
                    ))
                ) : (
                    <p>No teams found related to your hobbies.</p>
                )}
            </div>
            <PaginationControls currentPage={page} totalPages={totalPages} />
        </div>
    );
}
