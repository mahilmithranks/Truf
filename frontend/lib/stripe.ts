// Stripe integration utilities

declare global {
  interface Window {
    Stripe: any;
  }
}

export interface StripePaymentOptions {
  clientSecret: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

// Load Stripe.js script
export const loadStripeScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Stripe) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Stripe payment
export const initiateStripePayment = async (
  options: StripePaymentOptions
): Promise<void> => {
  const isLoaded = await loadStripeScript();

  if (!isLoaded) {
    throw new Error('Failed to load Stripe SDK');
  }

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error('Stripe publishable key not configured');
  }

  const stripe = window.Stripe(publishableKey);
  
  // For testing, we'll use a simple card payment
  // In production, you'd use Stripe Elements for a better UI
  const { error, paymentIntent } = await stripe.confirmCardPayment(
    options.clientSecret,
    {
      payment_method: {
        card: {
          // Test card details - will be replaced with actual Stripe Elements
          token: 'tok_visa', // Stripe test token
        },
      },
    }
  );

  if (error) {
    options.onError(error.message || 'Payment failed');
  } else if (paymentIntent?.status === 'succeeded') {
    options.onSuccess(paymentIntent.id);
  }
};

// Simplified version for mock testing
export const mockStripePayment = async (
  clientSecret: string,
  onSuccess: (paymentIntentId: string) => void,
  onError: (error: string) => void
): Promise<void> => {
  // Show mock payment confirmation
  const confirmed = window.confirm(
    'Mock Stripe Payment\n\n' +
    'Click OK to simulate successful payment\n' +
    'Click Cancel to simulate payment failure'
  );

  if (confirmed) {
    // Simulate successful payment
    setTimeout(() => {
      const mockPaymentIntentId = `pi_mock_${Date.now()}`;
      onSuccess(mockPaymentIntentId);
    }, 500);
  } else {
    onError('Payment cancelled by user');
  }
};
