// Mock Razorpay integration for testing without actual payment gateway

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Mock Razorpay SDK - simulates payment without external service
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Always return true for mock
    console.log('Mock Razorpay SDK loaded');
    resolve(true);
  });
};

// Mock payment modal - simulates user completing payment
export const initiateRazorpayPayment = async (
  options: RazorpayOptions
): Promise<void> => {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded) {
    throw new Error('Failed to load Razorpay SDK');
  }

  // Show mock payment confirmation dialog
  const userConfirmed = window.confirm(
    `Mock Payment Gateway\n\n` +
    `Amount: ₹${options.amount / 100}\n` +
    `Description: ${options.description}\n\n` +
    `Click OK to simulate successful payment\n` +
    `Click Cancel to simulate payment failure`
  );

  if (userConfirmed) {
    // Simulate successful payment
    setTimeout(() => {
      const mockResponse: RazorpayResponse = {
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_order_id: options.order_id,
        razorpay_signature: `mock_signature_${Date.now()}`,
      };
      options.handler(mockResponse);
    }, 500);
  } else {
    // Simulate payment cancellation
    if (options.modal?.ondismiss) {
      options.modal.ondismiss();
    }
  }
};
