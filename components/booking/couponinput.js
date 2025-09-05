import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CouponInput({ onApply }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    try {
      const { data } = await axios.post('/api/coupons/validate', {
        code: code.toUpperCase(),
        bookingAmount: 200 // This should come from booking context
      });
      
      onApply({ code: code.toUpperCase(), discountPercent: data.discountPercent });
      toast.success(`Coupon applied! ${data.discountPercent}% off`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold mb-3">Apply Coupon</h3>
      <form onSubmit={handleApply} className="flex gap-2">
        <input
          className="input-field"
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Applying...' : 'Apply'}
        </button>
      </form>
    </div>
  );
}

