import SearchBar from "@/components/SearchBar";
import prisma from "@repo/db/client";
import Link from "next/link";

export default async function VenuesPage() {

    const venues = await prisma.venue.findMany({
        include: {
            sports: {
                include: {
                    hobby: true,
                }
            }
        }
    });

    return (
        <div className="p-5 w-full">
            <h1 className="text-2xl mb-4 font-bold text-center">All Venues</h1>
            
            <SearchBar page={"venues"}/>

            <ul className="ml-5">
                {venues.map((venue) => (
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
                ))}
            </ul>
        </div>
    );
}
