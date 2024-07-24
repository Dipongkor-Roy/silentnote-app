import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return await handlePost(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed', success: false });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username, content } = req.body;

    const user = await prisma.user.findUnique({
      where: { name : username },
      include: { messages: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Check if user is accepting messages
    if (!user.isAcceptingMessage) {
      return res.status(403).json({
        success: false,
        message: "User is not accepting messages",
      });
    }

    // Create new message
    const newMessage = await prisma.message.create({
      data: {
        content,
        createdAt: new Date(),
        user: { connect: { id: user.id } }
      }
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      newMessage
    });
  } catch (error) {
    console.error("Error adding message:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    await prisma.$disconnect();
  }
}
