import React, { useState, useEffect } from "react";
import styles from "./CityFilter.module.css";

const CityFilterList = ({
  properties,
  cityFilters,
  setCityFilters,
  excludedCounty,
}) => {
  const [cities, setCities] = useState([]);
  const [visible, setVisible] = useState(true);

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

  const handleCityCheckboxChange = (event) => {
    const { value } = event.target;
    setCityFilters((prevState) => ({
      ...prevState,
      [value]: !prevState[value],
    }));
  };

  return (
    <div>
      <button className={styles.toggleButton} onClick={() => setVisible(!visible)}>Toggle City Filters</button>
      {visible && (
        <div className={styles.cityFilterContainer}>
          {cities.map((city) => (
            <div key={city}>
              <input
                type="checkbox"
                id={city}
                value={city}
                checked={!!cityFilters[city]}
                onChange={handleCityCheckboxChange}
              />
              <label htmlFor={city}>{city}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

CityFilterList.defaultProps = {
  excludedCounty: ["Out of Area", "", null, undefined],
};

export default CityFilterList;
