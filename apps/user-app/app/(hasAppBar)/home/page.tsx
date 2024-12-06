import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@repo/db/client";
import { authOptions } from "@/app/lib/auth";
import Link from "next/link";
import Image from "next/image";
import football from "@/public/football.jpg"
import cricket from '@/public/cricket.jpeg'
import tennis from '@/public/Tennis.jpg'

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect('/login');
    }

    const user = await prisma.user.findFirst({
        where: {
            id: Number(session.user.id)
        },
        include: {
            teams: {
                include: {
                    team: true
                }
            },
            hobbies: {
                include: {
                    hobby: true
                }
            }
        }

    });

    if (!user) {
        return (
            <div>
                User Not Found
            </div>
        )
    }

    // Fetch the five teams with the most members
    const popularTeams = await prisma.team.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    members: true
                }
            }
        },
        orderBy: {
            members: {
                _count: 'desc'
            },
        },
        take: 5,
    });

    const joinedTeams = await prisma.userTeam.findMany({
        where: {
            userId: Number(session.user.id)
        },
        select: {
            team: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    const upcomingEvents = [
        { id: 1, name: "Football Tournament", date: "15-11-2024", location: "City Stadium", image: football },
        { id: 2, name: "Local Cricket Championship", date: "20-11-2024", location: "Pitampura", image: cricket },
        { id: 3, name: "Tennis Finals", date: "25-11-2024", location: "Rohini sector 13", image: tennis },
    ];

    return (
        <div className="w-full">
            <div className="container mx-auto p-4 px-10">
                {/* User Welcome Message */}
                <h1 className="text-3xl font-thin text-center divide-y-2">Welcome, {user?.username}!</h1>

                <hr className="h-px mt-4 bg-gray-300 border-0"></hr>

                {/* All events */}
                {/* <section className="mt-4">
                    <h2 className="text-2xl font-bold">Events:</h2>

                </section> */}

                {/* Upcoming Events */}
                <section className="bg-white p-4 rounded-lg mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-center">Upcoming Events</h3>

                    <ul className="flex flex-col md:flex-row md:justify-around items-center">
                        
                        {upcomingEvents.map(event => (
                            <li key={event.id} className="p-2 max-w-72 shadow-md rounded">
                                <Image 
                                    src={event.image}
                                    alt={event.name}
                                    // width={300}
                                    className="rounded mb-2 overflow-hidden w-64 max-h-44"
                                />

                                <p className="font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-xs">{event.name}</p>
                                <p className="text-sm">Date: {event.date}</p>
                                <p className="text-xs">Location: {event.location}</p>
                            </li>
                        ))}

                    </ul>
                </section>
                
                <hr className="h-px mt-4 bg-gray-300 border-0"></hr>

                {/* Team Recommendations (Placeholder for now) */}
                <section className="my-4 mt-8">
                    <h2 className="text-xl font-semibold">Recommended Teams</h2>
                    <p>No recommendations available yet.</p>
                </section>

                {/* Popular Teams */}
                <section className="bg-white p-4 rounded-lg shadow mb-8">
                    <h2 className="text-xl font-semibold mb-4">Popular Teams</h2>

                    <ul className="flex flex-col md:flex-row justify-around">
                        {popularTeams.map((team) => (
                            <li key={team.id}>

                            <Link href={`/teams/${team.id}`}
                                className="flex flex-col p-2 border-b-2"
                            >
                                <p className="font-bold">{team.name}</p>
                                <p className="text-sm">{team._count.members} members</p>
                            </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Your Teams */}
                <section className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Your Joined Teams</h2>
                    <ul>
                        {joinedTeams.map(({ team }) => (
                            <li key={team.id} className="p-2 border-b">
                                <Link href={`/chat/?teamId=${team.id}`} className="text-blue-500 hover:underline">
                                    {team.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Create a Team Option */}
                <div className="mt-4">
                    <Link href={"/teams/create"}
                        className="bg-green-600 text-sm text-white py-1 px-2 rounded">
                        Create a Team
                    </Link>
                </div>


            </div>
        </div>
    )
}