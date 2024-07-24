import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options"; // Ensure the correct path
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { messageid } = req.query;
    return await handleDelete(req, res, messageid as string);
  } else {
    return res.status(405).json({ message: 'Method not allowed', success: false });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, messageId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return res.status(401).json({
      success: false,
      message: "Not Authenticated",
    });
  }

  try {
    const deleteResult = await prisma.message.deleteMany({
      where: {
        id: parseInt(messageId, 10),
        userId: session.user.id, // Ensure session.user.id matches your schema
      },
    });

    if (deleteResult.count === 0) {
      return res.status(404).json({
        message: "Message not found or already deleted",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Message deleted",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({
      message: "Error deleting message",
      success: false,
    });
  } finally {
    await prisma.$disconnect();
  }
}
