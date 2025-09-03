import PaymentForm from './paymentform';

export default function StripeCheckout({ amount, metadata }) {
  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold mb-4">Checkout</h3>
      <PaymentForm amount={amount} metadata={metadata} />
    </div>
  );
}


