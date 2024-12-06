
import { addressSchema, AddressType } from '@repo/validation/address';
import axios from 'axios';
import prisma from '@repo/db/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const OPEN_CAGE_URL = "https://api.opencagedata.com/geocode/v1/json?"

async function getLatLng(address: string) {
    try {
        const encodedAddress = encodeURIComponent(address);
        console.log(encodedAddress)
        const response = await axios.get(OPEN_CAGE_URL, {
            params: {
                q: encodedAddress,
                key: process.env.GEOCODING_API_KEY,
            },
        });

        if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            return { lat, lng };
        } else {
            throw new Error('Geocoding failed');
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        throw new Error('Failed to retrieve latitude and longitude');
    }
}

export async function POST(req: NextRequest){
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
            message: 'Unauthorized'
        }, {
            status: 401
        });
    }

    const userId = session.user.id;
    const addressData : AddressType = await req.json();

    const validData = addressSchema.safeParse(addressData);
    if (!validData.success) {
        return NextResponse.json({
            message: 'Invalid input data'
        }, {
            status: 400
        });
    }

    try {
        const fullAddress = `${addressData.addressLine2}, ${addressData.city}, ${addressData.state}, ${addressData.country}`;

        const { lat, lng } = await getLatLng(fullAddress);

        await prisma.user.update({
            where: { 
                id: Number(userId)
            },
            data: {
                address1: addressData.addressLine1,
                address2: addressData.addressLine2,
                city: addressData.city,
                state: addressData.state,
                postalCode: addressData.postalCode,
                country: addressData.country,
                latitude: lat,
                longitude: lng
            },
        });

        return NextResponse.json({
            message: 'Address updated successfully'
        }, {
            status: 201
        });

    }
    catch (error) {
        console.error('Error updating address:', error);

        return NextResponse.json({
            message: 'Failed to update address'
        }, {
            status: 500
        });
    }
}