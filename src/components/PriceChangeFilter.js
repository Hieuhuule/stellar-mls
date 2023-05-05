import React from 'react';
import styles from './PropertyList.module.css';

const PriceChangeFilter = ({
  priceChangeFilter,
  setPriceChangeFilter,
}) => {
  const handlePriceChangeFilter = (event) => {
    setPriceChangeFilter(event.target.value);
  };

  return (
    <>
      <h3>Price Change Filter</h3>
      <label className={styles.filterLabel}>
        <input
          className={styles.filterRadio}
          type="radio"
          name="priceChangeFilter"
          value="one"
          checked={priceChangeFilter === 'one'}
          onChange={handlePriceChangeFilter}
        />
        1 Price Change
      </label>
      <label className={styles.filterLabel}>
        <input
          className={styles.filterRadio}
          type="radio"
          name="priceChangeFilter"
          value="twoOrMore"
          checked={priceChangeFilter === 'twoOrMore'}
          onChange={handlePriceChangeFilter}
        />
        2+ Price Changes
      </label>
      <label className={styles.filterLabel}>
        <input
          className={styles.filterRadio}
          type="radio"
          name="priceChangeFilter"
          value="none"
          checked={priceChangeFilter === 'none'}
          onChange={handlePriceChangeFilter}
        />
        No Filter
      </label>
    </>
  );
};

export default PriceChangeFilter;
