import Link from 'next/link'
import Appbar from '@/components/Appbar'

export default function NotFound() {
  return (
    <>
      <Appbar />

      <div className='h-screen w-full flex flex-col justify-center items-center'>
        <div className='border-2 border-primaryRed rounded-md p-5'>
          <h1 className='text-4xl font-bold text-center mb-2'>404</h1>
          <h2 className='text-2xl font-bold text-center'>Route not found!</h2>

          <p className='text-lg text-center'>
            Go back 
            <Link href="/home" className='text-red-700'> Home</Link>
          </p>
        </div>
      </div>
  </>
)
}
