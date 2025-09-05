import { useFilter } from '../../context/FilterContext';

export default function FilterSidebar() {
  const { state, dispatch } = useFilter();

  const amenities = ['Pool', 'Spa', 'WiFi', 'Gym', 'Restaurant', 'Bar', 'Parking', 'Heater'];

  const handleFilterChange = (key, value) => {
    dispatch({ type: 'SET_FIELD', payload: { key, value } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        
        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            className="input-field"
            placeholder="City or hotel name"
            value={state.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Price Range</label>
          <div className="flex gap-2">
            <input
              className="input-field"
              type="number"
              placeholder="Min"
              value={state.minPrice}
              onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
            />
            <input
              className="input-field"
              type="number"
              placeholder="Max"
              value={state.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
            />
          </div>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Minimum Rating</label>
          <select
            className="input-field"
            value={state.rating}
            onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
          >
            <option value={0}>Any Rating</option>
            <option value={4.5}>4.5+ Stars</option>
            <option value={4.0}>4.0+ Stars</option>
            <option value={3.5}>3.5+ Stars</option>
          </select>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Amenities</label>
          <div className="space-y-2">
            {amenities.map((amenity) => (
              <label key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={state.amenities.includes(amenity)}
                  onChange={(e) => {
                    const newAmenities = e.target.checked
                      ? [...state.amenities, amenity]
                      : state.amenities.filter(a => a !== amenity);
                    handleFilterChange('amenities', newAmenities);
                  }}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        {/* Reset */}
        <button
          className="btn-secondary w-full"
          onClick={() => dispatch({ type: 'RESET' })}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

