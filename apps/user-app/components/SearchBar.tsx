export default function SearchBar({page} : {page: string}) {
    return (
        <form action={`/${page}/search`} method="GET" className='flex justify-center items-center mb-4'>
            <label htmlFor="search">Search for {page}:</label>
            <input
                type="text"
                name="query"
                className='border-2 rounded ml-2 w-1/2 px-1 py-0.5'
                placeholder={`Enter ${page.substring(0,  page.length-1)} name or sport`}
            />

            <button type="submit" className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">
                Search
            </button>
        </form>
    )
}