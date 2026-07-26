'use client';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

export function PayPalCheckout({ total, onComplete }: { total: number; onComplete: () => void }) {
  const [error, setError] = useState<string | null>(null);

  const initialOptions = {
    "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "capture",
  };

  return (
    <div className="w-full">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: total.toFixed(2),
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            if (!actions.order) return;
            try {
              const details = await actions.order.capture();
              // In a real app, verify details on the server here
              onComplete();
            } catch (err) {
              setError("Payment failed. Please try again.");
            }
          }}
          onError={(err) => {
            setError("PayPal is unavailable right now.");
          }}
        />
      </PayPalScriptProvider>
      {error && <p className="text-red-500 text-sm mt-2 font-bold">{error}</p>}
    </div>
  );
}
