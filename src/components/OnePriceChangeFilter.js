// OnePriceChangeFilter.js
import React from 'react';
import styles from './PropertyList.module.css';

const OnePriceChangeFilter = ({ filterOnePriceChange, setFilterOnePriceChange }) => {
  return (
    <label className={styles.filterLabel}>
      <input
        className={styles.filterCheckbox}
        type="checkbox"
        checked={filterOnePriceChange}
        onChange={(event) => setFilterOnePriceChange(event.target.checked)}
      />
      1 Price Change
    </label>
  );
};

export default OnePriceChangeFilter;
