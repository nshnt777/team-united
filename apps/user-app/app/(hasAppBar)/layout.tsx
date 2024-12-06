import Appbar from "@/components/Appbar";

export default function AppbarLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){

    return(
        <>
            <Appbar />
            <main className="flex-grow flex h-full">
              {children}
            </main>    
        </>
    )
}