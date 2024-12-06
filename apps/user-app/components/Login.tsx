"use client";

import Link from "next/link";

export default function Login(){
    return(
        <Link href={"login"} className="bg-blue-500 px-3 py-1 text-sm rounded-sm shadow-slate-500 drop-shadow-md mr-3">
            Sign In
        </Link>
    )
}