import { getServerSession } from "next-auth";
import RegisterForm from "@/components/RegisterForm";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect('/home');
    }

    return (
        <div className="w-screen h-screen flex overflow-x-hidden">
            
            <div className="w-1/2 max-h-full bg-primaryRed flex flex-col justify-center items-center text-white">
                <h1 className="text-4xl font-bold">
                    Get in the game.
                </h1>
                <p className="text-xl">Connect. Play. Repeat</p>
            </div>

            <div className="w-1/2 max-h-full box-border flex justify-center items-center">
                <RegisterForm />
            </div>
        </div>
    )
}