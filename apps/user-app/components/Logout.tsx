"use client";

import { signOut } from "next-auth/react";

export default function Logout(){
    return(
        <button 
            className="bg-gray-500 px-3 py-1 text-sm rounded-sm shadow-slate-500 drop-shadow-md mr-3"
            onClick={async ()=>{
                await signOut({
                    callbackUrl: '/'
                });
            }}
        >
            Logout
        </button>
    )
}