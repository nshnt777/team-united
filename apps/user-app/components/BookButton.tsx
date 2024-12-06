"use client";

import axios from "axios";
import { useState } from "react";

type UserTeam = {
    id: number,
    name: string
}

interface BookingProps {
    slotId: number,
    isAvailable: boolean,
    userTeams: UserTeam[]
}

export default function BookButton({ slotId, isAvailable, userTeams }: BookingProps) {
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    

    const handleBooking = async () => {
        if (!selectedTeamId) {
            alert('Please select a team before booking.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/book-slot', {
                slotId: slotId,
                teamId: selectedTeamId,
            });

            const bookingId = response.data.bookingID;
            if (response.status === 200) {
                alert('Slot booked successfully!');
                setShowModal(false);
            }
        } catch (error) {
            alert('Error booking slot.');
        } finally {
            setLoading(false);
            setSelectedTeamId(null);
        }
    };

    return (
        <div>
            <button
                onClick={() => setShowModal(true)}
                disabled={!isAvailable}
                className="bg-green-500 text-white w-full py-0.5 text-sm rounded mt-2 disabled:bg-gray-400"
            >
                {isAvailable ? 'Book Slot' : 'Booked'}
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-semibold mb-2">Select a Team</h2>
                        <div className="mb-4 flex justify-center">
                            <ul className="flex flex-row flex-wrap gap-x-4 gap-y-3 justify-start items-start">
                                {userTeams.map((uteam)=>{
                                    return(
                                        <li key={uteam.id} className={`text-lg text-wrap border-2 border-dashed rounded px-2 cursor-pointer ${ selectedTeamId === uteam.id
                                            ? 'border-blue-500 bg-blue-200'
                                            : 'bg-gray-50'
                                        }`}
                                        onClick={()=>{
                                            setSelectedTeamId(uteam.id)
                                        }}
                                        >
                                            {uteam.name}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setSelectedTeamId(null)
                                }}
                                className="bg-red-700 text-white w-1/2 py-0.5 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBooking}
                                disabled={!selectedTeamId || loading}
                                className="bg-green-700 text-white w-1/2 py-0.5 rounded disabled:bg-gray-300"
                            >
                                {loading ? 'Booking...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
