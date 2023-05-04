import React from 'react';
import styles from './PropertyList.module.css';

const MarketDiscrepancyFilter = ({ filterDaysOnMarketDifference, setFilterDaysOnMarketDifference }) => {
  return (
    <label className={styles.filterLabel}>
      <input
        className={styles.filterCheckbox}
        type="checkbox"
        checked={filterDaysOnMarketDifference}
        onChange={(event) => setFilterDaysOnMarketDifference(event.target.checked)}
      />
      Days on Market Discrepancy
    </label>
  );
};

export default MarketDiscrepancyFilter;
