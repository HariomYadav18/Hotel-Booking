import StarRating from './starrating';
import { formatDate } from '../../lib/utils';

export default function ReviewCard({ review }) {
  const { rating, comment, guestEmail, createdAt } = review;

  return (
    <div className="card p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {guestEmail.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{guestEmail}</div>
              <div className="text-sm text-gray-500">{formatDate(createdAt)}</div>
            </div>
          </div>
        </div>
        <StarRating rating={rating} readonly />
      </div>
      
      {comment && (
        <p className="text-gray-700">{comment}</p>
      )}
    </div>
  );
}

