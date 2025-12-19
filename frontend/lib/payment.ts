// Pure Mock Payment - No external payment gateway integration

// Simple mock payment confirmation
export const mockPayment = async (
  amount: number,
  description: string,
  onSuccess: (paymentId: string) => void,
  onError: (error: string) => void
): Promise<void> => {
  // Show mock payment confirmation dialog
  const confirmed = window.confirm(
    `Mock Payment\n\n` +
    `Amount: ₹${amount / 100}\n` +
    `Description: ${description}\n\n` +
    `Click OK to confirm payment\n` +
    `Click Cancel to decline payment`
  );

  if (confirmed) {
    // Simulate successful payment after short delay
    setTimeout(() => {
      const mockPaymentId = `pay_mock_${Date.now()}`;
      onSuccess(mockPaymentId);
    }, 500);
  } else {
    // Payment cancelled
    onError('Payment cancelled by user');
  }
};
