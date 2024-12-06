import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

interface BookingRequest {
    slotId: number;
    teamId: number;
}

export async function POST(req: NextRequest) {
    try {
        const {slotId, teamId}: BookingRequest = await req.json();

        // Check if the slot is available
        const slot = await prisma.venueSlot.findUnique({
            where: {
                id: slotId
            },
        });

        if (!slot || !slot.isAvailable) {
            return NextResponse.json(
                { error: 'Slot is not available', success: false },
                { status: 400 }
            );
        }

        // Create the booking
        const booking = await prisma.booking.create({
            data: {
                teamId: Number(teamId),
                slotId: Number(slotId),
            },
        });

        // Mark the slot as unavailable
        await prisma.venueSlot.update({
            where: { 
                id: slotId 
            },
            data: {
                isAvailable: false
            },
        });

        return NextResponse.json(
            {
                bookingID: booking.id,
                success: true 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            {
                error: 'Something went wrong',
                success: false 
            },
            { status: 500 }
        );
    }
}
