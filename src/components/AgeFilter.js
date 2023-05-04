import React from "react";


const AgeFilter = ({ ageFilter, setAgeFilter }) => {
  return (
    <div>
      <h3>Age filter</h3>
      {/* Age filter radio buttons */}
      <div>
        <label>
          <input
            type="radio"
            name="ageFilter"
            value="60-90"
            checked={ageFilter === "60-90"}
            onChange={(event) => setAgeFilter(event.target.value)}
          />
          60-90 days
        </label>
        <label>
          <input
            type="radio"
            name="ageFilter"
            value="90-180"
            checked={ageFilter === "90-180"}
            onChange={(event) => setAgeFilter(event.target.value)}
          />
          90-180 days
        </label>
        <label>
          <input
            type="radio"
            name="ageFilter"
            value="180-365"
            checked={ageFilter === "180-365"}
            onChange={(event) => setAgeFilter(event.target.value)}
          />
          180-365 days
        </label>
        <label>
          <input
            type="radio"
            name="ageFilter"
            value=""
            checked={ageFilter === ""}
            onChange={(event) => setAgeFilter(event.target.value)}
          />
          Clear age filter
        </label>
      </div>
    </div>
  );
};

export default AgeFilter;
