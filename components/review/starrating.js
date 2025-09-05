import { useState } from 'react';

export default function StarRating({ rating = 0, onRatingChange, readonly = false }) {
  const [hoverRating, setHoverRating] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (star) => {
    if (!readonly && onRatingChange) {
      onRatingChange(star);
    }
  };

  const handleMouseEnter = (star) => {
    if (!readonly) {
      setHoverRating(star);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => {
        const filled = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            className={`text-2xl ${filled ? 'text-yellow-500' : 'text-gray-300'} ${
              !readonly ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'
            }`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
          >
            ★
          </button>
        );
      })}
      {!readonly && (
        <span className="ml-2 text-sm text-gray-600">
          {hoverRating || rating} out of 5
        </span>
      )}
    </div>
  );
}

