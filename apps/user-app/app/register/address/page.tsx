"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LabelledInput from '@/components/LabelledInput';
import { addressSchema, AddressType } from '@repo/validation/address';
import axios from 'axios';
import AuthCard from '@/components/AuthCard';

function getUserLocation() : Promise<{lat: number, lng: number}>{
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }, (error) => {
                reject(error);
            }, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        }
        else {
            reject("Geolocation is not supported by this browser.")
        }
    });
}


export default function AddAddress() {
    const [addressData, setAddressData] = useState<AddressType>({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: 'India'
    });

    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    async function fetchLocation(){
        try {
            const pos = await getUserLocation();

            const geoResponse = await axios.post('/api/get-address', {
                lat: pos.lat,
                lng: pos.lng
            });
            const { addressLine2, city, state, postalCode, country } = geoResponse.data;

            setAddressData({
                addressLine1: "",
                addressLine2: addressLine2,
                city: city,
                state: state,
                postalCode: postalCode,
                country: country
            })

        } catch (err) {
            setError(`Failed to get location: ${(err as Error).message}`);
        }
    }

    useEffect(() => {
        fetchLocation();
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target

        setAddressData((prevVal) => {
            return (
                {
                    ...prevVal,
                    [name]: value
                }
            )
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const validData = addressSchema.safeParse(addressData);

        if (!validData.success) {
            setError("Invalid inputs");
            return;
        }

        try {
            const response = await axios.post('/api/add-address', addressData);

            if (response.status === 201) {
                router.push("/home");
            }
            else {
                setError("Address update failed");
            }
        } catch (error) {
            console.error("Error during address change:", error);
            setError("Failed to save address");
        }
    };

    return (
        <AuthCard handleSubmit={handleSubmit} pageType="Add Address" error={error}>
            <LabelledInput
                label="Address Line 1"
                type="text"
                placeholder="House no./Street no."
                name="addressLine1"
                onChange={handleChange}
                defaultValue={addressData.addressLine1}
            />
            <LabelledInput
                label="Address Line 2"
                type="text"
                placeholder="District/Locality"
                name="addressLine2"
                onChange={handleChange}
                defaultValue={addressData.addressLine2}
            />
            <LabelledInput
                label="City"
                type="text"
                placeholder=""
                name="city"
                onChange={handleChange}
                defaultValue={addressData.city}
            />
            <LabelledInput
                label="State"
                type="text"
                placeholder=""
                name="state"
                onChange={handleChange}
                defaultValue={addressData.state}
            />
            <LabelledInput
                label="Postal code"
                type="text"
                placeholder=""
                name="postalCode"
                onChange={handleChange}
                defaultValue={addressData.postalCode}
            />
            <LabelledInput
                label="Country"
                type="text"
                placeholder=""
                name="country"
                onChange={handleChange}
                defaultValue={addressData.country}
            />
        </AuthCard>
    );
}
