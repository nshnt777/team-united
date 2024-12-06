import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@repo/db/client";
import { authOptions } from "@/app/lib/auth";

// type UserObject = {
//     username: string,
//     email: string,
//     age: number,
//     hobbies: string[]
// }

export default async function EditProfile() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: {
            id: Number(session.user.id)
        },
        select: {
            username: true,
            email: true,
            age: true,
            hobbies: {
                select: {
                    hobby: true
                }
            }
        }
    });

    let hobbiesArray = user?.hobbies.map((hobby) => {
        return hobby.hobby.name
    }) || [];

    hobbiesArray = hobbiesArray?.length > 0 ? hobbiesArray : ['', '', ''];

    async function handleSubmit(formData: FormData) {
        "use server";

        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const age = Number(formData.get('age'));
        const newHobbies = [
            formData.get('hobby1') as string,
            formData.get('hobby2') as string,
            formData.get('hobby3') as string
        ].filter(Boolean);

        const userId = Number(session?.user.id);

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                username: username,
                email: email,
                age: age
            }
        });

        // delete all previous hobbies
        await prisma.userHobby.deleteMany({
            where: { userId: userId }
        });

        // Use upsert to create new hobbies or get existing ones
        const hobbyIds = await Promise.all(
            newHobbies.map(async (hobbyName) => {
                const upsertedHobby = await prisma.hobby.upsert({
                    where: {
                        name: hobbyName
                    },
                    update: {},
                    create: {
                        name: hobbyName
                    }
                });

                console.log(upsertedHobby);
                return upsertedHobby.id;
            })
        );

        // const existingLinks = await prisma.userHobby.findMany({
        //     where: {
        //         userId: userId,
        //         hobbyId: {in: hobbyIds}
        //     }
        // })

        // const existingLinkIds = existingLinks.map(hobby => hobby.hobbyId);

        // const hobbiesToRemove = existingLinkIds.filter(id => !hobbyIds.includes(id));

        // if (hobbiesToRemove.length > 0) {
        //     await prisma.userHobby.deleteMany({
        //         where: {
        //             userId: userId,
        //             hobbyId: { in: hobbiesToRemove }
        //         }
        //     });
        // }

        // const hobbiesToAdd = hobbyIds.filter(id => !existingLinkIds.includes(id));

        // if (hobbiesToAdd.length > 0) {
        //     const userHobbyData = hobbiesToAdd.map(hobbyId => ({
        //         userId: userId,
        //         hobbyId
        //     }));
    
        //     await prisma.userHobby.createMany({
        //         data: userHobbyData
        //     });
        // }

        if (hobbyIds.length > 0) {
            const userHobbyData = hobbyIds.map(hobbyId => ({
                userId: userId,
                hobbyId
            }));
    
            await prisma.userHobby.createMany({
                data: userHobbyData
            });
        }

        redirect('/profile');
    };

    if (!user) {
        return (
            <p className="container mx-auto p-4 text-black">User not found</p>
        );
    }

    return (
        <div className="container mx-auto p-4 text-black">
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <form action={handleSubmit} method="post" className="mt-4">
                <div className="mb-4">
                    <label className="block text-sm font-semibold">Username</label>
                    <input
                        type="text"
                        name="username"
                        defaultValue={user.username}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <label className="block text-sm font-semibold">Email</label>
                    <input
                        type="text"
                        name="email"
                        defaultValue={user.email}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <label className="block text-sm font-semibold">Age</label>
                    <input
                        type="number"
                        name="age"
                        defaultValue={user.age || ""}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className='flex mb-4'>

                    <div className="mb-4 w-1/3">
                        <label className="block text-sm font-semibold">Hobby 1</label>
                        <input
                            type="text"
                            name="hobby1"
                            defaultValue={hobbiesArray[0]}
                            className="mt-1 w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="px-2 w-1/3">
                        <label className="block text-sm font-semibold">Hobby 2</label>
                        <input
                            type="text"
                            name="hobby2"
                            defaultValue={hobbiesArray[1]}
                            className="mt-1 w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="w-1/3">
                        <label className="block text-sm font-semibold">Hobby 3</label>
                        <input
                            type="text"
                            name="hobby3"
                            defaultValue={hobbiesArray[2]}
                            className="mt-1 w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    Save Changes
                </button>
            </form>
        </div>
    );
}
