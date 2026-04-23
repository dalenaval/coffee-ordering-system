import { apiKey, apiPaymongoUrl } from '@/config/config'
import axios from 'axios'

const PAYMONGO_PUBLIC_KEY = import.meta.env.VITE_PAYMONGO_PUBLIC_KEY;
const PAYMONGO_BASE_URL = "https://api.paymongo.com/v1";

const publicAuthHeader = `Basic ${btoa(`${PAYMONGO_PUBLIC_KEY}:`)}`;

export const createCardPaymentMethod = async (payload) => {
  const response = await fetch(`${PAYMONGO_BASE_URL}/payment_methods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: publicAuthHeader,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          type: "card",
          details: {
            card_number: payload.card_number,
            exp_month: Number(payload.exp_month),
            exp_year: Number(payload.exp_year),
            cvc: payload.cvc,
          },
          billing: {
            name: payload.name,
            email: payload.email,
            phone: payload.phone || "",
          },
        },
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.errors?.[0]?.detail || "Failed to create payment method.");
  }

  return data.data.id;
};

export const createPaymentIntent = async (orderId) => {
  const response = await api.post(`/payments/create-intent/${orderId}`);
  return response.data;
};

export const attachPaymentIntent = async (payment_intent_id, payment_method_id) => {
  const response = await api.post("/payments/attach", {
    payment_intent_id,
    payment_method_id,
  });
  return response.data;
};

export const verifyPaymentIntent = async (payment_intent_id) => {
  const response = await api.get(`/payments/verify/${payment_intent_id}`);
  return response.data;
};

export const createPaymentMethod = async (payload) => {
  const response = await fetch('https://api.paymongo.com/v1/payment_methods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(import.meta.env.VITE_PAYMONGO_PUBLIC_KEY)}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          type: "card",
          details: {
            card_number: payload.card_number,
            exp_month: payload.exp_month,
            exp_year: payload.exp_year,
            cvc: payload.cvc,
          },
          billing: {
            name: payload.name,
            email: payload.email,
          }
        }
      }
    }),
  });

  const data = await response.json();
  return data.data.id;
};

const api = axios.create({
  baseURL: apiPaymongoUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${btoa(apiKey)}`,
  },
})

export const getPaymentMethodId = async (payment_method, payload) => {
  const paymentMethodResponse = await fetch('https://api.paymongo.com/v1/payment_methods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${import.meta.env.VITE_PAYMONGO_PUBLIC_KEY}:`)}`
    },
    body: JSON.stringify({
      data: {
        attributes: {
          type: payment_method,
          billing: payload,
        },
      },
    }),
  })
  const pmData = await paymentMethodResponse.json()
  return pmData.data.id
}

export const paymongoClient = async (payload) => {
  const response = await api.post('/payment_methods', {
    data: {
      attributes: {
        type: payload.payment_method,
        details: {
          card_number: payload?.card_number ?? '',
          exp_month: payload?.exp_month ?? '',
          exp_year: payload?.exp_year ?? '',
          cvc: payload?.cvc ?? '',
        },
        billing: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
        },
      },
    },
  })

  return response.data
}

export const createEwalletPaymentMethod = async (payload) => {
  const response = await fetch("https://api.paymongo.com/v1/payment_methods", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: publicAuthHeader,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          type: payload.payment_method,
          billing: {
            name: payload.name,
            email: payload.email,
            phone: payload.phone || "",
          },
        },
      },
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.errors?.[0]?.detail || "Failed to create e-wallet payment method.")
  }

  return data.data.id
}