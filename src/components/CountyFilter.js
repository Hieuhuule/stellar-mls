import React, { useState, useEffect } from 'react';

const CountyFilter = ({
  properties,
  cityFilter,
  countyFilter,
  setCountyFilter,
}) => {
  const [associatedCounties, setAssociatedCounties] = useState([]);

  useEffect(() => {
    if (cityFilter) {
      const newAssociatedCounties = Array.from(
        new Set(
          properties
            .filter((property) => property.City === cityFilter)
            .map((property) => property.CountyOrParish)
        )
      ).sort();

      setAssociatedCounties(newAssociatedCounties);
    } else {
      setAssociatedCounties([]);
    }
  }, [cityFilter, properties]);

  return (
    <div>
      <label>
        County:
        {associatedCounties.map((county) => (
          <span key={county}>
            <input
              type="checkbox"
              name={county}
              checked={countyFilter.includes(county)}
              onChange={(event) => {
                if (event.target.checked) {
                  setCountyFilter((prevState) => [...prevState, county]);
                } else {
                  setCountyFilter((prevState) =>
                    prevState.filter((item) => item !== county)
                  );
                }
              }}
            />
            {county}
          </span>
        ))}
      </label>
    </div>
  );
};

export default CountyFilter;
