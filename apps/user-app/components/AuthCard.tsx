import Link from "next/link";

type authProps = {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>)=>void,
    children: React.ReactNode,
    pageType: string,
    error: string | null
}

export default function AuthCard({handleSubmit, children, pageType, error} : authProps){

    let buttonText = "";
    if(pageType === "Add Address"){
        buttonText = "Save Address"
    }
    else if(pageType === "Register"){
        buttonText = "Create Account"
    }
    else{
        buttonText = pageType
    }

    return(
        <div className="flex flex-col justify-center items-center w-full max-h-full py-5 overflow-auto">
            <h1 className="text-4xl font-bold mb-3 mt-10">{pageType}</h1>
            <form onSubmit={handleSubmit} className="flex flex-col w-10/12 p-5 rounded-sm pb-1">
                {children}

                <button type="submit" className=" bg-primaryRed text-white text-lg p-1 rounded-sm">{buttonText}</button>

                {error && <div className="error text-red-600 bg-red-100 border border-red-600 mt-2 rounded-sm px-2">{error}</div>}
                {pageType === "Register" ? 
                    <div className="text-center mt-2">
                        Already have an account? <br />
                        <Link href={'/login'} className="text-primaryRed">
                            Log In
                        </Link>
                    </div> 
                    : 
                    <div className="text-center mt-2">
                        Don't have an account? <br />
                        <Link href={'/register'} className="text-primaryRed">
                            Create an account
                        </Link>
                    </div>
                }
            </form>
        </div>
    )
}
