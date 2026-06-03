import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const categorySelect = {
  id: true,
  name: true,
  type: true,
  color: true,
  icon: true,
  parentId: true,
  active: true,
} as const;

function serializeCategory(category: {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string | null;
  icon: string | null;
  parentId: string | null;
  active: boolean;
}) {
  return {
    id: category.id,
    name: category.name,
    type: category.type,
    color: category.color,
    icon: category.icon,
    parent_id: category.parentId,
    active: category.active,
  };
}

function isCategoryType(type: string | null): type is "income" | "expense" {
  return type === "income" || type === "expense";
}

function getCategoryId(request: NextRequest) {
  return request.nextUrl.searchParams.get("id");
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  if (type && !isCategoryType(type)) {
    return Response.json(
      { message: "Tipo de categoria inválido" },
      { status: 400 }
    );
  }

  const categoryType = isCategoryType(type) ? type : undefined;

  const categories = await prisma.category.findMany({
    where: categoryType ? { type: categoryType } : undefined,
    orderBy: {
      name: "asc",
    },
    select: categorySelect,
  });

  return Response.json({
    data: categories.map(serializeCategory),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parentId = body.parent_id ?? body.parentId ?? null;

  if (!body.name || typeof body.name !== "string") {
    return Response.json(
      { message: "Nome da categoria é obrigatório" },
      { status: 400 }
    );
  }

  if (!isCategoryType(body.type)) {
    return Response.json(
      { message: "Tipo de categoria inválido" },
      { status: 400 }
    );
  }

  const category = await prisma.category.create({
    data: {
      name: body.name,
      type: body.type,
      color: body.color ?? null,
      icon: body.icon ?? null,
      parentId,
      active: body.active ?? true,
    },
    select: categorySelect,
  });

  return Response.json(
    {
      message: "Categoria criada com sucesso",
      data: serializeCategory(category),
    },
    {
      status: 201,
    }
  );
}

export async function PATCH(request: NextRequest) {
  const id = getCategoryId(request);
  const body = await request.json();
  const parentId = body.parent_id ?? body.parentId;

  if (!id) {
    return Response.json(
      { message: "ID da categoria é obrigatório" },
      { status: 400 }
    );
  }

  if (body.name !== undefined && typeof body.name !== "string") {
    return Response.json(
      { message: "Nome da categoria inválido" },
      { status: 400 }
    );
  }

  if (body.type !== undefined && !isCategoryType(body.type)) {
    return Response.json(
      { message: "Tipo de categoria inválido" },
      { status: 400 }
    );
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.type !== undefined ? { type: body.type } : {}),
      ...(body.color !== undefined ? { color: body.color } : {}),
      ...(body.icon !== undefined ? { icon: body.icon } : {}),
      ...(parentId !== undefined ? { parentId } : {}),
      ...(body.active !== undefined ? { active: body.active } : {}),
    },
    select: categorySelect,
  });

  return Response.json({
    message: "Categoria atualizada com sucesso",
    data: serializeCategory(category),
  });
}

export async function DELETE(request: NextRequest) {
  const id = getCategoryId(request);

  if (!id) {
    return Response.json(
      { message: "ID da categoria é obrigatório" },
      { status: 400 }
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  return Response.json({
    message: "Categoria excluída com sucesso",
  });
}
