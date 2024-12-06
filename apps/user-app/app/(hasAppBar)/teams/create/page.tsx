"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getHobbies } from '../../../actions/hobbies';
import axios from 'axios';

type Hobby = {
    id: number,
    name: string
}

export default function CreateTeam() {
    const router = useRouter();

    const [team, setTeam] = useState({
        name: '',
        description: '',
        hobbyId: null as number | null,
    });

    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchHobbies() {
            const hobbyData = await getHobbies();
            setHobbies(hobbyData);
        }

        fetchHobbies();
    }, []);

    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>){
        const { name, value  } = event.target;
        
        setTeam((prev)=>{
            return{
                ...prev,
                [name]: name === "hobbyId" ? Number(value) : value,
            }
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (team.hobbyId === null) {
            alert('Please select a hobby.');
            return;
        }
        setIsSubmitting(true);

        try {
            const response = await axios.post('/api/team/create-team', team,);

            if (response.status === 200) {
                alert('Team created successfully!');
                router.push('/home');
            }
            else {
                alert('Error creating team.');
            }
        }
        catch (error: any) {
            console.error('Error:', error.response.data);
            console.error('Status', error.response.status);
            alert('Error creating team.');
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4">

            <h1 className="text-2xl font-bold text-center">Create a New Team</h1>

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                    <label className="block text-sm font-semibold">Team Name</label>
                    <input
                        type="text"
                        name="name"
                        value={team.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-2 py-0.5 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold">Description</label>
                    <textarea
                        name="description"
                        value={team.description}
                        onChange={handleChange}
                        className="mt-1 block w-full px-2 py-0.5 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold">Main Hobby/Sport</label>
                    <select
                        name="hobbyId"
                        value={team.hobbyId || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-2 py-1 border bg-white border-gray-300 rounded"
                        required
                    >
                        <option value="" disabled>Select a hobby</option>

                        {hobbies.map((hobby)=>{
                            return(
                            <option key={hobby.id} value={hobby.id}>
                                {hobby.name}
                            </option>
                            )
                        })}

                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-green-500 w-full text-white py-0.5 rounded"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating...' : 'Create'}
                </button>
            </form>
        </div>
    );
}
