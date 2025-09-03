import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 mx-auto max-w-2xl flex items-center gap-3">
      <input
        className="input-field"
        placeholder="Search by city or hotel name"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit" className="btn-primary">Search</button>
    </form>
  );
}


