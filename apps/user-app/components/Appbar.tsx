"use server"

import { getServerSession } from "next-auth"
import Logout from "./Logout"
import { authOptions } from "@/app/lib/auth"
import Login from "./Login";
import Link from "next/link";

export default async function Appbar() {
    const session = await getServerSession(authOptions);

    return (
        <header className="bg-primaryRed shadow-md text-white">
            <nav className="flex flex-row justify-between items-center px-5 py-2.5">
                <Link className="" href={!!session ? '/home' : '/'}>
                    Team United
                </Link>

                <div className="flex flex-row ">
                    {!!session ?
                    <>
                        <ul className="flex flex-row list-none mr-3 space-x-3">
                            <li><Link href="/chat">Connect</Link></li>
                            <li><Link href="/teams">Teams</Link></li>
                            <li><Link href="/venues">Venues</Link></li>
                            <li><Link href="/profile">Profile</Link></li>
                        </ul>
                        <Logout />
                    </>
                        :
                        <Login />
                    }
                </div>
            </nav>
        </header>
    )
}