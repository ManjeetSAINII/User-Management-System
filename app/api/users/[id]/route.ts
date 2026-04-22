import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { updateUserSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const requestingUserId = request.headers.get("x-user-id");
  const role = request.headers.get("x-user-role");

  if (role !== "ADMIN" && requestingUserId !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const requestingUserId = request.headers.get("x-user-id");
  const role = request.headers.get("x-user-role");
  const performedBy = request.headers.get("x-user-email") || "system";

  if (role !== "ADMIN" && requestingUserId !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = updateUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { password, ...rest } = result.data;
    const updateData: Record<string, unknown> = { ...rest };

    if (password && password.length > 0) {
      updateData.password = await hashPassword(password);
    }

    if (role !== "ADMIN") {
      delete updateData.role;
      delete updateData.status;
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await db.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "User",
        entityId: id,
        details: `Updated user ${user.email}`,
        performedBy,
        userId: id,
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const role = request.headers.get("x-user-role");
  const requestingUserId = request.headers.get("x-user-id");
  const performedBy = request.headers.get("x-user-email") || "system";

  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (requestingUserId === id) {
    return NextResponse.json(
      { error: "Cannot delete your own account" },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await db.auditLog.create({
    data: {
      action: "DELETE",
      entity: "User",
      entityId: id,
      details: `Deleted user ${user.email}`,
      performedBy,
    },
  });

  await db.user.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
