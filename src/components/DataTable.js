import React from "react";
import { formatCurrency } from "./FormatCurrency";
import { formatDate } from "../utils";
import styles from "./DataTable.module.css";

export const TableHeader = () => {
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

export const PropertyRow = ({ property }) => {
  return (
    <tr>
        <td className={styles.listingId}>{property["ListingId"].substring(3)}</td>
        <td className={styles.currentPrice}>{formatCurrency(property["ListPrice"])}</td>
        <td className={styles.previousPrice}>{formatCurrency(property["PreviousListPrice"])}</td>
        <td className={styles.originalPrice}>{formatCurrency(property["OriginalListPrice"])}</td>
        <td className={styles.priceChangeTimestamp}>{formatDate(property["PriceChangeTimestamp"])}</td>
        <td className={styles.address}>{property["UnparsedAddress"]}</td>
        <td className={styles.city}>{property["City"]}</td>
        <td className={styles.county}>{property["CountyOrParish"]}</td>
        <td className={styles.subdivision}>{property["SubdivisionName"]}</td>
        <td className={styles.listDate}>{formatDate(property["ListDate"])}</td>
        <td className={styles.bedrooms}>{property["BedroomsTotal"]}</td>
        <td className={styles.bathroomsFull}>{property["BathroomsFull"]}</td>
        <td className={styles.bathroomsHalf}>{property["BathroomsHalf"]}</td>
        <td className={styles.yearBuilt}>{property["YearBuilt"]}</td>
        <td className={styles.lotSizeAcres}>{property["LotSizeAcres"]}</td>
        <td className={styles.livingArea}>{property["LivingArea"]} {property["LivingAreaUnits"]}</td>
        <td className={styles.propertyType}>{property["PropertyType"]}</td>
        <td className={styles.subtype}>{property["PropertySubType"]}</td>
        <td className={styles.cumulativeDaysOnMarket}>{property["CumulativeDaysOnMarket"]}</td>
        <td className={styles.daysOnMarket}>{property["DaysOnMarket"]}</td>
        <td className={styles.agent}>{property["ListAgentFullName"]}</td>
        <td className={styles.agentPhone}>{property["ListAgentDirectPhone"]}</td>
        <td className={styles.agentEmail}>{property["ListAgentEmail"]}</td>
    </tr>
  );
};
