import prisma from "@repo/db/client";
import { notFound, redirect } from "next/navigation";
import { VenueSlot } from "@prisma/client";
import BookButton from "@/components/BookButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export default async function VenueDetailsPage({ params }: { params: { venueId: string } }) {
    const venueId = parseInt(params.venueId);

    // Fetch venue details and available slots
    const venue = await prisma.venue.findUnique({
        where: { id: venueId },
        include: {
            sports: {
                include: {
                    hobby: true,
                }
            },
            slots: true,
        }
    });

    const session = await getServerSession(authOptions);
    if (!session) {
        return redirect('/login');
    }

    const userId = Number(session.user.id);

    const userTeams = await prisma.userTeam.findMany({
        where: { userId },
        include: {
            team: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    if (!venue) {
        notFound();
    }

    const allSlots = venue.slots.filter((slot: VenueSlot) => slot);

    return (
        <div className="p-5 w-full">
            <h1 className="text-4xl mb-4 font-semibold text-center">{venue.name}</h1>
            <p className="text-center">{venue.address}</p>

            <div className="flex justify-center md:flex-row flex-col items-center md:items-start">
                <span><strong>Sports Available:</strong> 
                </span>
                <ul className="ml-5">
                    {venue.sports.map((hobby) => {
                        return(
                            <li key={hobby.hobbyId}
                                className="list-disc">
                                {hobby.hobby.name}
                            </li>
                        )
                    })}
                </ul>
            </div>


            <h2 className="text-lg my-3">Available Slots</h2>
            <ul className="flex flex-row gap-3 flex-wrap">
                {allSlots.length > 0 ? (
                    allSlots.map((slot) => (
                        <li key={slot.id} className="border-2 border-dashed bg-slate-50 p-3 rounded min-w-fit">
                            <p><strong>Date:</strong> {new Date(slot.date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {new Date(slot.startTime).toLocaleTimeString([] ,{hour: '2-digit', minute: '2-digit'})} - {new Date(slot.endTime).toLocaleTimeString([] ,{hour: '2-digit', minute: '2-digit'})}</p>

                            <BookButton slotId={slot.id} isAvailable={slot.isAvailable} userTeams={userTeams.map(uteam => uteam.team)} />
                        </li>
                    ))
                ) : (
                    <p>No available slots for this venue at the moment.</p>
                )}
            </ul>
        </div>
    );
}
