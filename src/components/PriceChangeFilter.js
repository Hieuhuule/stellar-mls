import React from "react";
import styles from "./PriceChangeFilter.module.css";

const PriceChangeFilter = ({
  label,
  filterPriceDifference,
  setFilterPriceDifference,
  type = "checkbox",
}) => {
  const handleChange = (event) => {
    setFilterPriceDifference(event.target.checked);
  };

  return (
    <label className={styles.filterLabel}>
      <input
        className={type === "checkbox" ? styles.filterCheckbox : styles.filterRadio}
        type={type}
        checked={filterPriceDifference}
        onChange={handleChange}
      />
      {label}
    </label>
  );
};


export default PriceChangeFilter;
