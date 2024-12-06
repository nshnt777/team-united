
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const OPEN_CAGE_URL = "https://api.opencagedata.com/geocode/v1/json?"

const posSchema = z.object({
    lat: z.number(),
    lng: z.number()
});

export type PosType = z.infer<typeof posSchema>;

function extractAddress(address : string){
    const parts = address.split(', ');

    const n = parts.length;

    const country = parts[n-1];
    const state = parts[n-2];
    const postalCode = parts[n - 3]?.match(/\d+/)?.[0];
    const city = parts[n-4];
    const addressLine1 = parts.slice(0, n - 4).join(', ');

    return {
        addressLine1: addressLine1,
        city: city,
        state: state,
        postalCode: postalCode,
        country: country
    }
}

export async function POST(req: NextRequest){
    const pos : PosType = await req.json();

    try {
        const position = `${pos.lat},${pos.lng}`; 

        const encodedPos = encodeURIComponent(position);

        const response = await axios.get(OPEN_CAGE_URL, {
            params: {
                q: encodedPos,
                key: process.env.GEOCODING_API_KEY,
            },
        });

        const address = response.data.results[0].formatted;

        const {addressLine1, city, state, postalCode, country} = extractAddress(address);

        return NextResponse.json({
            addressLine2: addressLine1,
            city: city,
            state: state,
            postalCode: postalCode,
            country: country
        }, {
            status: 201
        });

    }
    catch (error) {
        console.error('Error Locating user:', error);

        return NextResponse.json({
            error: 'Failed to locate your position'
        }, {
            status: 500
        });
    }
}