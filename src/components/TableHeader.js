import React from "react";
import styles from "./TableHeader.module.css";

const TableHeader = () => {
  return (
    <tr>
      <th className={styles.listingId}>Listing ID</th>
      <th className={styles.currentPrice}>Current Price</th>
      <th className={styles.previousPrice}>Previous Price</th>
      <th className={styles.originalPrice}>Original Price</th>
      <th className={styles.priceChangeTimestamp}>Price Change Timestamp</th>
      <th className={styles.address}>Address</th>
      <th className={styles.city}>City</th>
      <th className={styles.county}>County</th>
      <th className={styles.subdivision}>Subdivision</th>
      <th className={styles.listDate}>List Date</th>
      <th className={styles.bedrooms}>Bedrooms</th>
      <th className={styles.bathroomsFull}>Bathrooms Full</th>
      <th className={styles.bathroomsHalf}>Bathrooms Half</th>
      <th className={styles.yearBuilt}>Year Built</th>
      <th className={styles.lotSizeAcres}>Lot Size Acres</th>
      <th className={styles.livingArea}>Living Area</th>
      <th className={styles.propertyType}>Property Type</th>
      <th className={styles.subtype}>Subtype</th>
      <th className={styles.cumulativeDaysOnMarket}>Cumulative Days on Market</th>
      <th className={styles.daysOnMarket}>Days on Market</th>
      <th className={styles.agent}>Agent</th>
      <th className={styles.agentPhone}>Agent Phone</th>
      <th className={styles.agentEmail}>Agent Email</th>
    </tr>
  );
};

export default TableHeader;
