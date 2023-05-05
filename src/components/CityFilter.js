import React, { useState, useEffect } from "react";
import styles from "./CityFilter.module.css";

const CityFilterList = ({
  properties,
  cityFilters,
  setCityFilters,
  excludedCounty,
}) => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const uniqueCities = Array.from(
      new Set(
        properties
          .filter(
            (prop) =>
              !excludedCounty.includes(prop.CountyOrParish) &&
              prop.StateOrProvince === "FL" &&
              prop.Country === "US"
          )
          .map((prop) => prop.City)
      )
    ).sort();
    setCities(uniqueCities);
  }, [properties, excludedCounty]);

  const handleCitySelectChange = (event) => {
    const { value } = event.target;
    setCityFilters((prevState) => ({
      ...prevState,
      [value]: !prevState[value],
    }));
  };

  return (
    <div className={styles.cityFilterContainer}>
      <h3>City Filters</h3>
      <select
        value={cityFilters}
        onChange={handleCitySelectChange}
        className={styles.citySelect}
      >
        <option value="">Select a City</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};

CityFilterList.defaultProps = {
  excludedCounty: ["Out of Area", "", null, undefined],
};

export default CityFilterList;
