import Appbar from "@/components/Appbar";
import Link from "next/link";
import banner from "@/public/banner.jpg"

export default function Home() {
  return (
    <div>
      <Appbar />

      {/* Hero Section */}
      <section className="relative text-center text-white py-32">
        <div style={{ backgroundImage: `url(${banner.src})` }} className="absolute inset-0 bg-cover bg-center opacity-90"></div>
        <div className="absolute inset-0 bg-slate-700 opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Connect, Play, and Compete</h1>
          <p className="text-xl mb-6">Join teams, book venues, and discover your sports community.</p>
          <Link href="/register">
            <button className="bg-primaryRed hover:bg-red-700 text-white px-6 py-3 rounded-md">Get Started</button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">Main Features</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-white shadow-lg p-6 rounded-lg max-w-sm text-center">
            <h3 className="text-xl font-semibold mb-2">Create or Join Teams</h3>
            <p className="text-gray-600">Find and join teams based on your favorite sports.</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg max-w-sm text-center">
            <h3 className="text-xl font-semibold mb-2">Book Venues</h3>
            <p className="text-gray-600">Secure your spot at local venues for team games.</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg max-w-sm text-center">
            <h3 className="text-xl font-semibold mb-2">Team Communication</h3>
            <p className="text-gray-600">Stay connected with team chat and updates.</p>
          </div>
        </div>
      </section>

      {/* Popular Teams Section */}
      {/* <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Popular Teams</h2>
      </section> */}

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="max-w-4xl mx-auto">
          <ol className="list-decimal list-inside space-y-4 text-gray-700">
            <li>Sign up and create your profile.</li>
            <li>Join or create a team in your favorite sport.</li>
            <li>Book venues and schedule matches.</li>
          </ol>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Users Say</h2>
        <blockquote className="text-center italic text-gray-600 max-w-2xl mx-auto">
          "Team United has made organizing games with friends so much easier!" – Alex, Football Enthusiast
        </blockquote>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-white text-center">
        <p>© 2024 Team United. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          {/* Add social media icons/links here */}
        </div>
      </footer>
    </div>
  );
}