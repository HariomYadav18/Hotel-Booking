export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="w-full flex items-center justify-center py-10">
      <div className="spinner mr-3" />
      <span className="text-gray-600">{label}</span>
    </div>
  );
}


