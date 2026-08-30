import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - List user's addresses
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Fetch addresses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// POST - Create new address
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      recipientName,
      phone,
      country,
      city,
      addressLine,
      apartmentDetails,
      deliveryInstructions,
      label,
    } = body;

    // Validate required fields
    if (!recipientName || !phone || !country || !city || !addressLine) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate field types
    if (
      typeof recipientName !== "string" ||
      typeof phone !== "string" ||
      typeof country !== "string" ||
      typeof city !== "string" ||
      typeof addressLine !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid field types" },
        { status: 400 }
      );
    }

    // Validate label
    const validLabels = ["HOME", "OFFICE", "OTHER"];
    if (label && !validLabels.includes(label)) {
      return NextResponse.json({ error: "Invalid label" }, { status: 400 });
    }

    // If this is the first address or explicitly set as default, make it default
    const existingAddresses = await prisma.address.findMany({
      where: { userId: session.user.id },
    });

    const shouldBeDefault = existingAddresses.length === 0 || body.isDefault;

    // If setting as default, unset other defaults
    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        country: country.trim(),
        city: city.trim(),
        addressLine: addressLine.trim(),
        apartmentDetails: apartmentDetails?.trim() || null,
        deliveryInstructions: deliveryInstructions?.trim() || null,
        label: label || "OTHER",
        isDefault: shouldBeDefault,
      },
    });

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}