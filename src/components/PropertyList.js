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

  return (
    <>
      {/* checkbox input element */}
      <div className={styles.filterContainer}>
        <div className={styles.box}>
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
            <th>Property ID</th>
            <th>List Price</th>
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
                <td>{property["@odata.id"]}</td>
                <td>{property["ListPrice"]}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default PropertyList;
