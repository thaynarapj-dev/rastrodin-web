import { PaymentMethod } from '@/app/interfaces/PaymentMethods';
import { api } from '../api';

const paymentMethodsRoute = '/payments_methods';

export type PaymentMethodPayload = {
  name: string;
  type: PaymentMethod['type'];
  description?: string | null;
  active?: boolean;
};

type PaymentMethodResponse =
  | PaymentMethod
  | PaymentMethod[]
  | { data?: PaymentMethod | PaymentMethod[] }
  | null
  | undefined;

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'id' in value &&
      'name' in value &&
      'type' in value,
  );
}

function normalizePaymentMethodsResponse(response: PaymentMethodResponse): PaymentMethod[] {
  if (Array.isArray(response)) {
    return response.filter(isPaymentMethod);
  }

  if (!response) {
    return [];
  }

  if ('data' in response) {
    const responseData = response.data;

    if (Array.isArray(responseData)) {
      return responseData.filter(isPaymentMethod);
    }

    return isPaymentMethod(responseData) ? [responseData] : [];
  }

  return isPaymentMethod(response) ? [response] : [];
}

function normalizePaymentMethodResponse(response: PaymentMethodResponse) {
  return normalizePaymentMethodsResponse(response)[0];
}

export async function getPaymentMethods() {
  const { data } = await api.get<PaymentMethodResponse>(paymentMethodsRoute, {});

  return normalizePaymentMethodsResponse(data);
}

export async function createPaymentMethod(paymentMethod: PaymentMethodPayload) {
  const { data } = await api.post<PaymentMethodResponse>(paymentMethodsRoute, paymentMethod, {
    headers: {
      Prefer: 'return=representation',
    },
  });

  return normalizePaymentMethodResponse(data);
}

export async function updatePaymentMethod(id: string, paymentMethod: PaymentMethodPayload) {
  const { data } = await api.patch<PaymentMethodResponse>(
    paymentMethodsRoute,
    paymentMethod,
    {
      params: { id },
      headers: {
        Prefer: 'return=representation',
      },
    },
  );

  return normalizePaymentMethodResponse(data);
}

export async function deletePaymentMethod(id: string) {
  await api.delete(paymentMethodsRoute, {
    params: { id },
  });
}
