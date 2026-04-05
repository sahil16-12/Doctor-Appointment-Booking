import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Button from "../../ui/Button";
import toast from "react-hot-toast";

const PaymentForm = ({
  clientSecret,
  onSuccess,
  onCancel,
  amount,
  doctorName,
  currency = "inr",
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatAmount = (amountInSmallestUnit) => {
    const actualAmount = amountInSmallestUnit / 100;
    if (currency.toLowerCase() === "inr") {
      return `₹${actualAmount.toFixed(2)}`;
    }
    return `$${actualAmount.toFixed(2)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        await onSuccess(paymentIntent.id);
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Payment Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 font-medium">
            Consultation with {doctorName}
          </span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold text-gray-900">
          <span>Total Amount:</span>
          <span>{formatAmount(amount)}</span>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="border border-gray-200 rounded-lg p-4">
        <PaymentElement />
      </div>

      {/* Payment Note */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="mb-1">
          🔒 <strong>Secure Payment:</strong> Your payment information is
          encrypted and secure.
        </p>
        <p>
          ✅ <strong>Refund Policy:</strong> If the doctor cancels the
          appointment, you'll receive a full refund.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? "Processing..." : `Pay ${formatAmount(amount)}`}
        </Button>
      </div>
    </form>
  );
};

const PaymentModal = ({
  isOpen,
  onClose,
  clientSecret,
  stripePromise,
  onSuccess,
  amount,
  doctorName,
  currency = "inr",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2
            className="text-2xl font-semibold text-[#1e293b]"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Complete Payment
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {clientSecret && stripePromise ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm
                clientSecret={clientSecret}
                onSuccess={onSuccess}
                onCancel={onClose}
                amount={amount}
                doctorName={doctorName}
                currency={currency}
              />
            </Elements>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Preparing payment...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
