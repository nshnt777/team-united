import prisma from "@repo/db/client";
import { loginSchema } from "@repo/validation/login";
import bcrypt from "bcrypt";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'email',

            credentials: {
                email: {label: "Email", type: "email", placeholder: "example@abc.com"},
                password: {label: "Password", type: "text"}
            },

            async authorize(credentials){
                // add zod validation
                const validUser = loginSchema.safeParse(credentials);

                if(!validUser.success){
                    console.log("Invalid inputs")
                    return null;
                }

                const email = credentials?.email || "";
                const password = credentials?.password || "";

                // check if user already exists
                const existingUser = await prisma.user.findFirst({
                    where: {
                        email: email,
                    },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        password: true
                    }
                });

                if(existingUser){
                    const validPassword = await bcrypt.compare(password, existingUser.password);

                    if(validPassword){
                        return {
                            id: existingUser.id.toString(),
                            username: existingUser.username,
                            email: existingUser.email
                        }
                    }
                    
                    // if password is not valid return null
                    return null;
                }

                // if user doesnt exist return null
                return null;
            }
        })
    ],

    pages: {
        signIn: '/login'
    },

    secret: process.env.JWT_SECRET,
    
    callbacks: {
        async jwt({token, user} : { token: JWT, user?: any}){
            if(user){
                token.id = user.id;
                token.username = user.username;
            }
            return token;
        },

        session({session, token}: {session: Session, token : JWT}){
            if(session && session.user){
                session.user.id = token.sub;
                session.user.name = token.username as string;
            }

            return session;
        }
    }
}

export { authOptions };