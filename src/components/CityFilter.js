import React, { useState, useEffect } from 'react';

const CityFilter = ({ properties, cityFilter, setCityFilter }) => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const uniqueCities = Array.from(
      new Set(properties.map((property) => property.City))
    ).sort();
    setCities(uniqueCities);
  }, [properties]);

  return (
    <div>
      <label>
        City:
        <select
          value={cityFilter}
          onChange={(event) => setCityFilter(event.target.value)}
        >
          <option value="">Select a city</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default CityFilter;
