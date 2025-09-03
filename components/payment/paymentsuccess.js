export default function PaymentSuccess({ reference }) {
  return (
    <div className="card p-6 text-center">
      <h2 className="text-2xl font-semibold mb-2">Payment Successful</h2>
      <p className="text-gray-600">Reference: <span className="font-mono">{reference}</span></p>
    </div>
  );
}


