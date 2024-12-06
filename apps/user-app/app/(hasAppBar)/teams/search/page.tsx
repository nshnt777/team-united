import { getServerSession } from 'next-auth';
import prisma from '@repo/db/client';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/lib/auth';
import Link from 'next/link';

export default async function SearchTeams({ searchParams }: { searchParams: { query?: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const searchQuery = searchParams.query || '';

    // Fetch teams based on the search query
    const teams = await prisma.team.findMany({
        where: {
            OR: [{
                name: {
                    contains: searchQuery,
                    mode: 'insensitive',
                },
            },
            {
                hobby: {
                    name: {
                        contains: searchQuery,
                        mode: 'insensitive',
                    },
                },
            },
            ],
        },
        select: {
            id: true,
            name: true,
            hobby: true,
        },
    });

    return (
        <div className="container mx-auto p-4">

            <form action="/teams/search" method="GET" className='flex justify-center items-center mb-4'>
                <label htmlFor="search">Search for teams:</label>
                <input
                    type="text"
                    name="query"
                    className='border-2 rounded ml-2 w-1/2 px-1 py-0.5'
                    placeholder="Enter team name or sport"
                />

                <button type="submit" className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">
                    Search
                </button>
            </form>

            <h1 className="text-2xl font-bold">Search Results for: "{searchQuery}"</h1>
            <Link href="/teams" className="text-blue-500 underline mt-4">Back to Teams</Link>

            <div className="mt-4">
                {teams.length > 0 ? (
                    teams.map(team => (
                        <Link key={team.id} href={`/teams/${team.id}`} className="block border p-4 mb-4 rounded shadow-sm">
                            <h2 className="text-xl font-semibold">{team.name}</h2>
                            <p><strong>Main Sport:</strong> {team.hobby.name}</p>
                        </Link>
                    ))
                ) : (
                    <p>No teams found matching your search criteria.</p>
                )}
            </div>
        </div>
    );
}
