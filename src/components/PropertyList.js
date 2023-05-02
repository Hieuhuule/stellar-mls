import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import styles from "./PropertyList.module.css";

const API_BASE_URL = "https://api-demo.mlsgrid.com/v2/Property";
const ACCESS_TOKEN = "19cf3858acb8e0296488848bef6b32379af6b55c";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  // state variable to manage the price filter checkbox state
  const [filterHighPrice, setFilterHighPrice] = useState(false);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    }),
    []
  );

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(API_BASE_URL, { headers });
        setProperties(response.data.value);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [headers]);

  // function to handle the checkbox state change
  const handleFilterChange = (event) => {
    setFilterHighPrice(event.target.checked);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'NA'; // return an 'NA' if dateString is not provided
  
    const date = new Date(dateString);
  
    if (isNaN(date.getTime())) return 'NaN-NaN-NaN'; // return 'NaN-NaN-NaN' if the date is invalid
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  
  return (
    <>
      {/* checkbox input element */}
      <div className={styles.filterContainer}>
        <div className={styles.box}>
          <h2>Filters</h2>
          <label className={styles.filterLabel}>
            <input
              className={styles.filterCheckbox}
              type="checkbox"
              checked={filterHighPrice}
              onChange={handleFilterChange}
            />
            Show properties with List Price over 800,000
          </label>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Listing ID</th>
            <th>Current Price</th>
            <th>Previous Price</th>
            <th>Original Price</th>
            <th>Price Change Timestamp</th>
            <th>City</th>
            <th>County</th>
            <th>Days on Market</th>
            <th>Public Remarks</th>
          </tr>
        </thead>
        <tbody>
          {properties
            // filter the properties array based on the checkbox state of FilterHighPrice
            .filter(
              (property) => !filterHighPrice || property["ListPrice"] > 800000
            )
            .map((property, index) => (
              <tr key={index}>
                <td>{property["ListingId"]}</td>
                <td>{property["ListPrice"]}</td>
                <td>{property["PreviousListPrice"]}</td>
                <td>{property["OriginalListPrice"]}</td>
                <td>{formatDate(property["PriceChangeTimestamp"])}</td>
                <td>{property["City"]}</td>
                <td>{property["CountyOrParish"]}</td>
                <td>{property["CumulativeDaysOnMarket"]}</td>
                <td>{property["PublicRemarks"]}</td>

              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default PropertyList;
