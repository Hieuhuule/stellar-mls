import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import styles from "./PropertyList.module.css";

const API_BASE_URL = "https://api-demo.mlsgrid.com/v2/Property";
const ACCESS_TOKEN = "19cf3858acb8e0296488848bef6b32379af6b55c";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  // state variable to manage the price filter checkbox state
  const [filterKeywords, setFilterKeywords] = useState(false);
  const [filterPriceDifference, setFilterPriceDifference] = useState(false);
  const [ageFilter, setAgeFilter] = useState("");
  const [filterDaysOnMarketDifference, setFilterDaysOnMarketDifference] =
    useState(false);

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


  // clear all filters
  const clearAllFilters = () => {
    setFilterKeywords(false);
    setFilterPriceDifference(false);
    setFilterDaysOnMarketDifference(false);
    setAgeFilter("");
  };

  const containsKeywords = (text) => {
    const keywords = ["reduced", "cozy"];
    return keywords.some((keyword) =>
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "NA"; // return an 'NA' if dateString is not provided

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "NaN-NaN-NaN"; // return 'NaN-NaN-NaN' if the date is invalid

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // export to CSV
  const escapeCsvField = (field) => {
    if (typeof field !== 'string') {
      return field;
    }
    return `"${field.replace(/"/g, '""')}"`;
  };

  const exportToCSV = () => {
    const filteredProperties = properties.filter(
      (property) =>
        (!filterKeywords || containsKeywords(property["PublicRemarks"])) &&
        (!filterPriceDifference ||
          (property["ListPrice"] !== property["PreviousListPrice"] &&
            property["ListPrice"] !== property["OriginalListPrice"] &&
            property["PreviousListPrice"] !== property["OriginalListPrice"])) &&
        (ageFilter === "" ||
          property["CumulativeDaysOnMarket"] >= parseInt(ageFilter)) &&
        (!filterDaysOnMarketDifference ||
          property["CumulativeDaysOnMarket"] !== property["DaysOnMarket"])
    );

    const headers = [
      "Listing ID",
      "Current Price",
      "Previous Price",
      "Original Price",
      "Price Change Timestamp",
      "City",
      "County",
      "List Date",
      "Cumulative Days on Market",
      "Days on Market",
      "Agent",
      "Agent Phone",
      "Agent Email",
      "Public Remarks",
      "Private Remarks"
    ];

    const csvContent = filteredProperties.map((property) => [
      property["ListingId"],
      property["ListPrice"],
      property["PreviousListPrice"],
      property["OriginalListPrice"],
      formatDate(property["PriceChangeTimestamp"]),
      escapeCsvField(property["City"]),
      escapeCsvField(property["CountyOrParish"]),
      formatDate(property["ListDate"]),
      property["CumulativeDaysOnMarket"],
      property["DaysOnMarket"],
      escapeCsvField(property["ListAgentFullName"]),
      escapeCsvField(property["ListAgentDirectPhone"]),
      escapeCsvField(property["ListAgentEmail"]),
      escapeCsvField(property["PublicRemarks"]),
      escapeCsvField(property["PrivateRemarks"])
    ]);

    const csvData = [
      headers.join(","),
      ...csvContent.map((row) => row.join(",")),
    ].join("\n");

  const csvBlob = new Blob([csvData], { type: "text/csv" });
  const csvUrl = URL.createObjectURL(csvBlob);

  const downloadLink = document.createElement("a");
  downloadLink.href = csvUrl;
  downloadLink.download = "property_list.csv";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

  return (
    <>
      {/* checkbox input element */}
      <div className={styles.filterContainer}>
        <div className={styles.box}>
          <h2>Filters</h2>
          <p>Filter the properties based on the following criteria:</p>

          {/*Keywords filter checkbox*/}
          <label className={styles.filterLabel}>
            <input
              className={styles.filterCheckbox}
              type="checkbox"
              checked={filterKeywords}
              onChange={(event) => setFilterKeywords(event.target.checked)}
            />
            Keywords: "reduced","cozy"
          </label>
          {/*2+ Price Change*/}
          <label className={styles.filterLabel}>
            <input
              className={styles.filterCheckbox}
              type="checkbox"
              checked={filterPriceDifference}
              onChange={(event) =>
                setFilterPriceDifference(event.target.checked)
              }
            />
            2+ Price Change
          </label>
          {/*Days on Market Discrepancy*/}
          <label className={styles.filterLabel}>
            <input
              className={styles.filterCheckbox}
              type="checkbox"
              checked={filterDaysOnMarketDifference}
              onChange={(event) =>
                setFilterDaysOnMarketDifference(event.target.checked)
              }
            />
            Days on Market Discrepancy
          </label>

          {/*Age filter radio buttons*/}
          <div className={styles.radioGroup}>
            <label className={styles.filterLabel}>
              <input
                className={styles.filterRadio}
                type="radio"
                name="ageFilter"
                value="90"
                checked={ageFilter === "90"}
                onChange={(event) => setAgeFilter(event.target.value)}
              />
              90 days+
            </label>
            <label className={styles.filterLabel}>
              <input
                className={styles.filterRadio}
                type="radio"
                name="ageFilter"
                value="180"
                checked={ageFilter === "180"}
                onChange={(event) => setAgeFilter(event.target.value)}
              />
              6 months+
            </label>
            <label className={styles.filterLabel}>
              <input
                className={styles.filterRadio}
                type="radio"
                name="ageFilter"
                value="365"
                checked={ageFilter === "365"}
                onChange={(event) => setAgeFilter(event.target.value)}
              />
              1 year+
            </label>
            <label className={styles.filterLabel}>
              <input
                className={styles.filterRadio}
                type="radio"
                name="ageFilter"
                value=""
                checked={ageFilter === ""}
                onChange={(event) => setAgeFilter(event.target.value)}
              />
              Clear age filter
            </label>
          </div>

          {/* Clear all filters button */}
          <button
            className={styles.clearAllFiltersButton}
            onClick={clearAllFilters}
          >
            Clear All Filters
          </button>

          {/* Export to CSV button */}
          <button className={styles.exportButton} onClick={exportToCSV}>
            Export to CSV
          </button>
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
            <th>Address</th>
            <th>City</th>
            <th>County</th>
            <th>List Date</th>
            <th>Cumulative Days on Market</th>
            <th>Days on Market</th>
            <th>Agent</th>
            <th>Agent Phone</th>
            <th>Agent Email</th>

          </tr>
        </thead>
        <tbody>
          {properties

            // filter the properties array based on the checkbox state
            .filter(
              (property) =>
                (!filterKeywords ||
                  containsKeywords(property["PublicRemarks"])) &&
                (!filterPriceDifference ||
                  (property["ListPrice"] !== property["PreviousListPrice"] &&
                    property["ListPrice"] !== property["OriginalListPrice"] &&
                    property["PreviousListPrice"] !==
                      property["OriginalListPrice"])) &&
                (ageFilter === "" ||
                  property["CumulativeDaysOnMarket"] >= parseInt(ageFilter)) &&
                (!filterDaysOnMarketDifference ||
                  property["CumulativeDaysOnMarket"] !==
                    property["DaysOnMarket"])
            )

            .map((property, index) => (
              <tr key={index}>
                <td>{property["ListingId"]}</td>
                <td>{property["ListPrice"]}</td>
                <td>{property["PreviousListPrice"]}</td>
                <td>{property["OriginalListPrice"]}</td>
                <td>{formatDate(property["PriceChangeTimestamp"])}</td>
                <td>{property["UnparsedAddress"]}</td>
                <td>{property["City"]}</td>
                <td>{property["CountyOrParish"]}</td>
                <td>{formatDate(property["ListDate"])}</td>
                <td>{property["CumulativeDaysOnMarket"]}</td>
                <td>{property["DaysOnMarket"]}</td>
                <td>{property["ListAgentFullName"]}</td>
                <td>{property["ListAgentDirectPhone"]}</td>
                <td>{property["ListAgentEmail"]}</td>

              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default PropertyList;
