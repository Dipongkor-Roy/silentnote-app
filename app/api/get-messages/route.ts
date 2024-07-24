import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"; // Ensure the correct path
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);//only auth options

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const userId = session.user.id; // Ensure this matches your schema

    // Fetch messages for the user, sorted by creation date in descending order
    const userMessages = await prisma.message.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!userMessages || userMessages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No messages found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messages: userMessages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Prisma client is properly disconnected
  }
}
