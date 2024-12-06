import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Register, registerSchema } from "@repo/validation/register";

export async function POST(req: NextRequest){
    // if user doesn't exist then create and insert one
    try {
        const {username, age, email, password}: Register = await req.json();
        const validBody = registerSchema.safeParse({username, age, email, password})

        if(!validBody.success){
            return NextResponse.json({
                error: "inavlid inputs"
            }, {
                status: 422
            })
        }

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);
        
        const user = await prisma.user.create({
            data: {
                username: username,
                age: age,
                email: email,
                password: hashPassword
            }
        });

        return NextResponse.json({
            msg: "User registered successfully"
        }, {
            status: 201
        })
    } catch (error) {
        console.error("Error registering user:", error);
        
        return NextResponse.json({
            error: "Internal server error"
        }, {
            status: 500
        }) 
    }
}