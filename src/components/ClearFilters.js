import React from 'react';
import styles from './ClearFilters.module.css';

const ClearFilters = ({ clearAllFilters }) => {
  return (
    <button className={styles.clearAllFiltersButton} onClick={clearAllFilters}>Clear All Filters</button>
  );
};

export default ClearFilters;
