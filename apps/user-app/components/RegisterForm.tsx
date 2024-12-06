"use client";

import { Register, registerSchema } from "@repo/validation/register"
import React, { useState } from "react"
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthCard from "./AuthCard";
import LabelledInput from "./LabelledInput";

export default function RegisterForm(){
    const [user, setUser] = useState<Register>({
        username: '',
        email: '',
        password: '',
        age: undefined
    });
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        const {name, value} = e.target;
        
        if(name === "age"){
            setUser((prevVal)=>{
                return {
                    ...prevVal,
                    [name]: value === '' ? undefined : Number(value)
                }
            })
        }
        else {
            setUser((prevVal)=>{
                return {
                    ...prevVal,
                    [name]: value
                }
            });
        }
    }
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const validData = registerSchema.safeParse(user);
        if(!validData.success){
            setError("Invalid inputs");
            return;
        }
        
        try {
            const response = await axios.post('/api/auth/register', user);
    
            if(response.status === 201){
                const result = await signIn("credentials", {
                    redirect: false,
                    email: user.email,
                    password: user.password
                });
                if(result?.ok){
                    router.push("/register/address");
                }
            }
            else{
                setError("Registration failed");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setError("An error occurred during registration");
        }
    }

    return(
        <AuthCard handleSubmit={handleSubmit} pageType="Register" error={error}>
                <LabelledInput 
                    label= "Username" 
                    type="text" 
                    placeholder="Enter a username"
                    name="username"
                    onChange={handleChange}
                />

                <LabelledInput
                    label="Age"
                    type="number"
                    placeholder=""
                    name="age"
                    onChange={handleChange}
                />

                <LabelledInput 
                    label= "Email" 
                    type="email" 
                    placeholder="Enter your email"
                    name="email"
                    onChange={handleChange}
                />

                <LabelledInput 
                    label= "Password" 
                    type="password" 
                    placeholder=""
                    name="password"
                    onChange={handleChange}
                />
        </AuthCard>
    )
}