import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const paymentMethodSelect = {
  id: true,
  name: true,
  type: true,
  description: true,
  active: true,
} as const;

function serializePaymentMethod(paymentMethod: {
  id: string;
  name: string;
  type: "cash" | "debit" | "credit" | "pix" | "transfer" | "other";
  description: string | null;
  active: boolean;
}) {
  return {
    id: paymentMethod.id,
    name: paymentMethod.name,
    type: paymentMethod.type,
    description: paymentMethod.description,
    active: paymentMethod.active,
  };
}

function isPaymentMethodType(
  type: string | null,
): type is "cash" | "debit" | "credit" | "pix" | "transfer" | "other" {
  return (
    type === "cash" ||
    type === "debit" ||
    type === "credit" ||
    type === "pix" ||
    type === "transfer" ||
    type === "other"
  );
}

function getPaymentMethodId(request: NextRequest) {
  return request.nextUrl.searchParams.get("id");
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  if (type && !isPaymentMethodType(type)) {
    return Response.json(
      { message: "Tipo de forma de pagamento inválido" },
      { status: 400 }
    );
  }

  const paymentMethodType = isPaymentMethodType(type) ? type : undefined;

  const paymentMethods = await prisma.paymentMethod.findMany({
    where: paymentMethodType ? { type: paymentMethodType } : undefined,
    orderBy: {
      name: "asc",
    },
    select: paymentMethodSelect,
  });

  return Response.json({
    data: paymentMethods.map(serializePaymentMethod),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || typeof body.name !== "string") {
    return Response.json(
      { message: "Nome da forma de pagamento é obrigatório" },
      { status: 400 }
    );
  }

  if (!isPaymentMethodType(body.type)) {
    return Response.json(
      { message: "Tipo de forma de pagamento inválido" },
      { status: 400 }
    );
  }

  const paymentMethod = await prisma.paymentMethod.create({
    data: {
      name: body.name,
      type: body.type,
      description: body.description ?? null,
      active: body.active ?? true,
    },
    select: paymentMethodSelect,
  });

  return Response.json(
    {
      message: "Forma de pagamento criada com sucesso",
      data: serializePaymentMethod(paymentMethod),
    },
    {
      status: 201,
    }
  );
}

export async function PATCH(request: NextRequest) {
  const id = getPaymentMethodId(request);
  const body = await request.json();

  if (!id) {
    return Response.json(
      { message: "ID da forma de pagamento é obrigatório" },
      { status: 400 }
    );
  }

  if (body.name !== undefined && typeof body.name !== "string") {
    return Response.json(
      { message: "Nome da forma de pagamento inválido" },
      { status: 400 }
    );
  }

  if (body.type !== undefined && !isPaymentMethodType(body.type)) {
    return Response.json(
      { message: "Tipo de forma de pagamento inválido" },
      { status: 400 }
    );
  }

  const paymentMethod = await prisma.paymentMethod.update({
    where: { id },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.type !== undefined ? { type: body.type } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.active !== undefined ? { active: body.active } : {}),
    },
    select: paymentMethodSelect,
  });

  return Response.json({
    message: "Forma de pagamento atualizada com sucesso",
    data: serializePaymentMethod(paymentMethod),
  });
}

export async function DELETE(request: NextRequest) {
  const id = getPaymentMethodId(request);

  if (!id) {
    return Response.json(
      { message: "ID da forma de pagamento é obrigatório" },
      { status: 400 }
    );
  }

  await prisma.paymentMethod.delete({
    where: { id },
  });

  return Response.json({
    message: "Forma de pagamento excluída com sucesso",
  });
}
