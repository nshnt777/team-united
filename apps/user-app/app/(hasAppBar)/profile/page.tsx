import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import prisma from "@repo/db/client";
import Link from "next/link";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect('/login');
    }

    const user = await prisma.user.findFirst({
        where: {
            id: Number(session.user.id)
        },
        select: {
            password: false,
            longitude: false,
            latitude: false,
            username: true,
            email: true,
            age: true,
            address1: true,
            address2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            teams: {
                select: {
                    team: true
                }
            },
            hobbies: {
                select: {
                    hobby: true
                }
            }
        }
        // include: {
        //     teams: {
        //         include: {
        //             team: true
        //         }
        //     },
        //     hobbies: {
        //         include: {
        //             hobby: true
        //         }
        //     }
        // }

    });

    const teamArray = user?.teams.map(team => team.team.name) || [];
    const hobbiesArray = user?.hobbies.map(hobby => hobby.hobby.name) || [];

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-semibold">Your Profile</h2>

            <div className="shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                    <p>
                        <strong>Username:</strong> {user?.username}
                    </p>
                    <p>
                        <strong>Email:</strong> {user?.email}
                    </p>
                    <p>
                        <strong>Age:</strong> {user?.age}
                    </p>
                    <p>
                        <strong>Address:</strong> {user?.address1} {user?.address2}, {user?.city}, {user?.state} {user?.postalCode}, {user?.country}
                        <Link
                            href={'/register/address'}
                            className="bg-green-100 text-sm text-white mx-2 px-1 py-0.5 rounded mt-2">
                            <Edit02Icon />
                        </Link>
                    </p>

                    <p>
                        <strong>Hobbies: </strong>
                        {hobbiesArray?.length > 0 ? hobbiesArray.join(', ') : "No Hobbies listed!"}
                    </p>
                    <p>
                        <strong>Teams: </strong>
                        {teamArray?.length > 0 ? teamArray.join(', ') : "No teams yet!"}
                    </p>
                </div>

                <div className="flex justify-between">
                    <Link
                        href={'/profile/edit'}
                        className="bg-blue-600 text-sm text-white px-2 py-1 mr-4 rounded mt-2">
                        Update Profile
                    </Link>

                    <Link href={"/bookings"}
                        className="bg-primaryRed text-sm text-white px-2 py-1 rounded mt-2">
                        Your bookings
                    </Link>

                </div>
            </div>
        </div>
    )
}

const Edit02Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={15} height={15} color={"#15853c"} fill={"none"} {...props} className="inline">
      <path d="M14.0737 3.88545C14.8189 3.07808 15.1915 2.6744 15.5874 2.43893C16.5427 1.87076 17.7191 1.85309 18.6904 2.39232C19.0929 2.6158 19.4769 3.00812 20.245 3.79276C21.0131 4.5774 21.3972 4.96972 21.6159 5.38093C22.1438 6.37312 22.1265 7.57479 21.5703 8.5507C21.3398 8.95516 20.9446 9.33578 20.1543 10.097L10.7506 19.1543C9.25288 20.5969 8.504 21.3182 7.56806 21.6837C6.63212 22.0493 5.6032 22.0224 3.54536 21.9686L3.26538 21.9613C2.63891 21.9449 2.32567 21.9367 2.14359 21.73C1.9615 21.5234 1.98636 21.2043 2.03608 20.5662L2.06308 20.2197C2.20301 18.4235 2.27297 17.5255 2.62371 16.7182C2.97444 15.9109 3.57944 15.2555 4.78943 13.9445L14.0737 3.88545Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M13 4L20 11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 22L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );