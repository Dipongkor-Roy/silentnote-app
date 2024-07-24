
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function POST(request: Request) {
  try {
    const { username, content } = await request.json();

    const user = await prisma.user.findFirst({
      where: {
        name: {startsWith:username}, // Match exact username
      },
      include: { messages: true },
    });

    if (!user) {
      return Response
        .json({ message: "User not found", success: false });
    }

    // Check if user is accepting messages
    if (!user.isAcceptingMessage) {
      return Response.json({
        success: false,
        message: "User is not accepting messages",
      });
    }

    // Create new message
    const newMessage = await prisma.message.create({
      data: {
        content,
        createdAt: new Date(),
        user: { connect: { id: user.id } },
      },
    });

    return Response.json({
      success: true,
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    console.error("Error adding message:", error);
    return Response.json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    
  }
}
