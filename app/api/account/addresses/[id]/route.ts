import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Get single address (for future use)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: addressId } = await params;

    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (address.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Fetch address error:", error);
    return NextResponse.json(
      { error: "Failed to fetch address" },
      { status: 500 }
    );
  }
}

// PATCH - Update address or set as default
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: addressId } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // Handle setDefault action
    if (action === "setDefault") {
      // Verify user owns this address
      const existingAddress = await prisma.address.findUnique({
        where: { id: addressId },
      });

      if (!existingAddress) {
        return NextResponse.json({ error: "Address not found" }, { status: 404 });
      }

      if (existingAddress.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Unset all other defaults for this user
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });

      // Set this address as default
      await prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      });

      return NextResponse.json({ success: true });
    }

    // Handle regular update
    const body = await request.json();

    // Verify user owns this address
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (existingAddress.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const {
      recipientName,
      phone,
      country,
      city,
      addressLine,
      apartmentDetails,
      deliveryInstructions,
      label,
      isDefault,
    } = body;

    // Validate fields if provided
    if (recipientName !== undefined && typeof recipientName !== "string") {
      return NextResponse.json({ error: "Invalid recipient name" }, { status: 400 });
    }

    if (phone !== undefined && typeof phone !== "string") {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }

    if (country !== undefined && typeof country !== "string") {
      return NextResponse.json({ error: "Invalid country" }, { status: 400 });
    }

    if (city !== undefined && typeof city !== "string") {
      return NextResponse.json({ error: "Invalid city" }, { status: 400 });
    }

    if (addressLine !== undefined && typeof addressLine !== "string") {
      return NextResponse.json({ error: "Invalid address line" }, { status: 400 });
    }

    // Validate label if provided
    if (label !== undefined) {
      const validLabels = ["HOME", "OFFICE", "OTHER"];
      if (!validLabels.includes(label)) {
        return NextResponse.json({ error: "Invalid label" }, { status: 400 });
      }
    }

    // If setting as default, unset other defaults
    if (isDefault === true) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        ...(recipientName !== undefined && { recipientName: recipientName.trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(country !== undefined && { country: country.trim() }),
        ...(city !== undefined && { city: city.trim() }),
        ...(addressLine !== undefined && { addressLine: addressLine.trim() }),
        ...(apartmentDetails !== undefined && {
          apartmentDetails: apartmentDetails.trim() || null,
        }),
        ...(deliveryInstructions !== undefined && {
          deliveryInstructions: deliveryInstructions.trim() || null,
        }),
        ...(label !== undefined && { label }),
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    return NextResponse.json({ address: updatedAddress });
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

// DELETE - Delete address
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: addressId } = await params;

    // Verify user owns this address
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (existingAddress.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    // If deleted address was default, set another as default if available
    if (existingAddress.isDefault) {
      const remainingAddresses = await prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 1,
      });

      if (remainingAddresses.length > 0) {
        await prisma.address.update({
          where: { id: remainingAddresses[0].id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}