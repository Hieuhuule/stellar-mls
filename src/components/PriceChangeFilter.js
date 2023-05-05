import React from 'react';
import styles from './PropertyList.module.css';

const PriceChangeFilter = ({ filterPriceDifference, setFilterPriceDifference }) => {
  return (
    <label className={styles.filterLabel}>
      <input
        className={styles.filterCheckbox}
        type="checkbox"
        checked={filterPriceDifference}
        onChange={(event) => setFilterPriceDifference(event.target.checked)}
      />
      2+ Price Change
    </label>
  );
};

export default PriceChangeFilter;
