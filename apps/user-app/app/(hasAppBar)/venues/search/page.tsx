import { getServerSession } from 'next-auth';
import prisma from '@repo/db/client';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/lib/auth';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

export default async function SearchTeams({ searchParams }: { searchParams: { query?: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const searchQuery = searchParams.query || '';

    // Fetch venue based on the search query
    const venues = await prisma.venue.findMany({
        where: {
            OR: [{
                name: {
                    contains: searchQuery,
                    mode: 'insensitive',
                },
            },
            {
                sports: {
                    some: {
                        hobby: {
                            name: {
                                contains: searchQuery,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            },
            ],
        },
        select: {
            id: true,
            name: true,
            address: true,
            sports:  {
                select: {
                    hobby: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        },
    });

    return (
        <div className="container mx-auto p-4">

            <SearchBar page={"venues"}/>

            <h1 className="text-2xl font-bold">Search Results for: "{searchQuery}"</h1>
            <Link href="/venues" className="text-blue-500 underline mt-4">Back to venues</Link>

            <div className="mt-4">
                {venues.length > 0 ? (
                    venues.map(venue => (
                        <li key={venue.id} className="mb-5 border-l-2 pl-2 pr-5 flex md:flex-row flex-col justify-between">
                        <div>
                            <h2 className="text-xl">{venue.name}</h2>
                            <p>{venue.address}</p>
                            <p><strong>Sports Available:</strong> {venue.sports.map(hobby => hobby.hobby.name).join(', ')}</p>
                        </div>
                        <div className="flex justify-center items-center mr-2">
                            <Link href={`/venues/${venue.id}`} className="text-blue-600 hover:underline">
                                View Details
                            </Link>
                        </div>
                    </li>
                    ))
                ) : (
                    <p>No teams found matching your search criteria.</p>
                )}
            </div>
        </div>
    );
}
