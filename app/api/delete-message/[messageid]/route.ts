import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options"; // Ensure the correct path
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } },
) {
  const messageId = params.messageid;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not Authenticated",
    });
  }

  try {
    const deleteResponseult = await prisma.message.delete({
      where: {
        id: parseInt(messageId as string, 10),
        // Ensure session.user.id matches your schema
      },
    });

    if (!deleteResponseult.content) {
      return Response.json({
        message: "Message not found or already deleted",
        success: false,
      });
    }

    return Response.json({
      message: "Message deleted",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json({
      message: "Error deleting message",
      success: false,
    });
  } finally {
  }
}
