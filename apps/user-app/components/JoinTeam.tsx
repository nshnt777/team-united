'use client'

import axios from "axios";
import { useState } from "react";

interface JoinTeamFormProps {
    teamId: number;
    userId: number;
    isMember: boolean;
}

export default function JoinTeam({ teamId, userId, isMember }: JoinTeamFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [member, setMember] = useState(isMember);

    async function handleJoin(event: React.FormEvent){
        event.preventDefault();

        const join = confirm("Do you want to join this team?");
        if(!join){
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post('/api/team/join-team', {
                teamId: teamId,
                userId: userId
            })

            if (response.status === 200) {
                alert('Successfully joined the team!');
                setMember(true);
            }
            
        }
        catch (error: any) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    async function handleLeave(event: React.FormEvent){
        event.preventDefault();

        const leave = confirm("Are you sure you want to leave?");
        if(!leave){
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post('/api/team/leave-team', {
                teamId: teamId,
                userId: userId
            })

            if (response.status === 200) {
                alert('Successfully left the team!');
                setMember(false);
            }
            
        }
        catch (error: any) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full">
            {!member ? (
                <form onSubmit={handleJoin} method="POST" className="mt-4 flex flex-col justify-center items-center">

                    {error && <p className="text-red-600 mt-2">{error}</p>}

                    <input type="hidden" name="teamId" value={teamId} />
                    <input type="hidden" name="userId" value={userId} />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-200 border-2 border-green-400 text-black px-2 py-1 rounded"
                    >
                        {loading ? 'Joining...' : 'Join Team'}
                    </button>
                </form>
            ) : (
                <div className="w-full">
                    <form onSubmit={handleLeave} method="POST" className="mt-4 flex flex-row justify-between items-center w-full">
                        <p className="text-green-600">You are already a member of this team.</p>

                        <input type="hidden" name="teamId" value={teamId} />
                        <input type="hidden" name="userId" value={userId} />
    
                        <button
                            type="submit"
                            disabled={loading}
                            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-1 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1.5 me-2 mb-2"
                            >
                            {loading ? 'Leaving...' : 'Leave Team'}
                        </button>
                    </form>

                    {error && <p className="text-red-600 mt-2">{error}</p>}
                </div>
            )}
        </div>
    )
}