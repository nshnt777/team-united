"use server"

import prisma from '@repo/db/client';

export async function getHobbies() {
  try {
    const hobbies = await prisma.hobby.findMany();
    return hobbies;
  } catch (error) {
    console.error('Error fetching hobbies:', error);
    return [];
  }
}