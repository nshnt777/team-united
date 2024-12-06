import { getServerSession } from "next-auth";
import LoginForm from "@/components/LoginForm";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await getServerSession(authOptions);
  if(session){
    redirect('/home');
  }
  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/2 flex flex-col justify-center items-stretch">
        <LoginForm />
      </div>
      <div className="w-1/2 bg-primaryRed flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl font-bold">
          Welcome back!
        </h1>
        <p className="text-xl">Login to find your crew.</p>
      </div>
    </div>
  );
}
