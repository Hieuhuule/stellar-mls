import React from 'react';
import styles from './ClearFilters.module.css';

const ClearFilters = ({
  setAgeFilter,
  setKeywordFilters,
  setFilterDaysOnMarketDifference,
  setPriceChangeFilter,
  setPriceRangeFilter,
}) => {
  const clearAllFilters = () => {
    setAgeFilter('');
    setKeywordFilters((prevState) => {
      const newKeywordFilters = { ...prevState };
      Object.keys(newKeywordFilters).forEach((key) => {
        newKeywordFilters[key] = false;
      });
      return newKeywordFilters;
    });
    setPriceChangeFilter("none");
    setPriceRangeFilter("all");
  };

  return (
    <button className={styles.clearAllFiltersButton} onClick={clearAllFilters}>
      Clear All Filters
    </button>
  );
};

export default ClearFilters;
