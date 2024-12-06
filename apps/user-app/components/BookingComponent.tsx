"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Booking {
    id: number;
    slotId: number;
    teamId: number;
}

export default function BookingComponent() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Load booking data from local storage on component mount
    useEffect(() => {
        const storedBookings = localStorage.getItem("bookings");
        if (storedBookings) {
            setBookings(JSON.parse(storedBookings));
        }
    }, []);

    return (
        <div>
            <h2>Your Bookings</h2>
            {bookings.length > 0 ? (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking.id}>
                            Booking ID: {booking.id}, Slot ID: {booking.slotId}, Team ID: {booking.teamId}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No bookings yet.</p>
            )}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
