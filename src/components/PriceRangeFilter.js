import React from "react";
import styles from "./PriceRangeFilter.module.css";

const PriceRangeFilter = ({ priceRangeFilter, setPriceRangeFilter }) => {
  const handlePriceRangeChange = (event) => {
    setPriceRangeFilter(event.target.value);
  };

  return (
    <div>
      <h3>Price Range Filter</h3>
      <label className={styles.labelPriceRangeFilter} htmlFor="priceRangeFilter">Price Range: </label>
      <select
        id="priceRangeFilter"
        value={priceRangeFilter}
        onChange={handlePriceRangeChange}
      >
        <option value="all">All</option>
        <option value="50000-100000">50,000 - 100,000</option>
        <option value="100000-200000">100,000 - 200,000</option>
        <option value="200000-300000">200,000 - 300,000</option>
        <option value="300000-400000">300,000 - 400,000</option>
        <option value="400000-500000">400,000 - 500,000</option>
        <option value="500000+">500,000+</option>
      </select>
    </div>
  );
};

export default PriceRangeFilter;
