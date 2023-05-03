import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import styles from "./PropertyList.module.css";

const API_BASE_URL = "https://api-demo.mlsgrid.com/v2/Property?$top=5000";
const ACCESS_TOKEN = "19cf3858acb8e0296488848bef6b32379af6b55c";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  // state variable to manage the price filter checkbox state
  const handleKeywordCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setKeywordFilters((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

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
    setFilterPriceDifference(false);
    setFilterDaysOnMarketDifference(false);
    setAgeFilter("");
    setKeywordFilters(
      keywords.reduce((acc, keyword) => {
        acc[keyword] = false;
        return acc;
      }, {})
    );
  };

  // keywords filter
  const containsSelectedKeywords = (text) => {
    return keywords.some(
      (keyword) =>
        keywordFilters[keyword] &&
        text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const keywords = [
    "probate",
    "inherited",
    "foreclosure",
    "short sale",
    "preforeclosure",
    "estate",
    "bring all offers",
    "junker",
    "must sell",
    "investor special",
    "special warranty deed",
    "quit claim deed",
    "heir",
    "heirs",
    "TLC",
    "motivated",
    "fixer",
    "fixer upper",
    "fixer-upper",
    "repairs",
    "as-is",
    "relocation",
    "rented",
    "tenant",
    "do not disturb tenant",
    "owner will carry",
    "owner will carry 2nd",
    "owner finance",
    "owner will finance",
    "personal rep",
    "personal representative",
    "estate",
    "trustee",
    "basement issues",
    "basement repairs",
    "basement problems",
    "foundation issues",
    "foundation repairs",
    "foundation problems",
    "structural issues",
    "structural repairs",
    "structural problems",
    "no FHA",
    "lease option",
    "engineer report",
    "price change",
    "water issues",
    "leak",
    "water problems",
    "not responsible",
    "relocated",
    "vacant",
    "out of state",
  ];

  // automatically excludes these property types
  const excludedSubtypes = [
    "Condominium",
    "Townhouse",
    "Commercial",
    "Business",
    "Retail",
    "Industrial",
  ];

  const [keywordFilters, setKeywordFilters] = useState(
    keywords.reduce((acc, keyword) => {
      acc[keyword] = false;
      return acc;
    }, {})
  );

  // age filter
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
    if (typeof field !== "string") {
      return field;
    }
    return `"${field.replace(/"/g, '""')}"`;
  };

  const exportToCSV = () => {
    const filteredProperties = properties.filter(
      (property) =>
        (!Object.values(keywordFilters).some((checked) => checked) ||
          containsSelectedKeywords(property["PublicRemarks"])) &&
        (!filterPriceDifference ||
          (property["ListPrice"] !== property["PreviousListPrice"] &&
            property["ListPrice"] !== property["OriginalListPrice"] &&
            property["PreviousListPrice"] !== property["OriginalListPrice"])) &&
        (ageFilter === "" ||
          property["CumulativeDaysOnMarket"] >= parseInt(ageFilter)) &&
        (!filterDaysOnMarketDifference ||
          property["CumulativeDaysOnMarket"] !== property["DaysOnMarket"]) &&
        !excludedSubtypes.includes(property["PropertySubType"])
    );

    const headers = [
      "Listing ID",
      "Current Price",
      "Previous Price",
      "Original Price",
      "Price Change Timestamp",
      "City",
      "County",
      "State",
      "Subdivision",
      "List Date",
      "Bedrooms",
      "Bathrooms Full",
      "Bathrooms Half",
      "Year Built",
      "Lot Size (Acres)",
      "Living Area (SqFt)",
      "Property Type",
      "Property Subtype",
      "Property Description",
      "Construction Materials",
      "Community Features",
      "Pool Features",
      "Private Pool",
      "Cooling",
      "Heating",
      "Fireplace",
      "Flooring",
      "Garage",
      "Garage Spaces",
      "Patio and Porch Features",
      "Water Source",
      "Waterfront",
      "Sewer",
      "Elementary School",
      "Middle School",
      "High School",
      "Zoning",
      "Cumulative Days on Market",
      "Days on Market",
      "Agent",
      "Agent Phone",
      "Agent Email",
      "Agent Office",
      "Public Remarks",
      "Private Remarks",
    ];

    const csvContent = filteredProperties.map((property) => [
      property["ListingId"],
      property["ListPrice"],
      property["PreviousListPrice"],
      property["OriginalListPrice"],
      formatDate(property["PriceChangeTimestamp"]),
      escapeCsvField(property["City"]),
      escapeCsvField(property["CountyOrParish"]),
      escapeCsvField(property["StateOrProvince"]),
      escapeCsvField(property["SubdivisionName"]),
      formatDate(property["ListDate"]),
      property["BedroomsTotal"],
      property["BathroomsFull"],
      property["BathroomsHalf"],
      property["YearBuilt"],
      property["LotSizeAcres"],
      property["LivingArea"],
      property["PropertyType"],
      property["PropertySubType"],
      escapeCsvField(property["MFR_PropertyDescription"]),
      escapeCsvField((property?.["ConstructionMaterials"] ?? []).join(";")),
      escapeCsvField((property?.["CommunityFeatures"] ?? []).join(";")),
      escapeCsvField((property?.["PoolFeatures"] ?? []).join(";")),
      property["PoolPrivateYN"],
      escapeCsvField((property?.["Cooling"] ?? []).join(";")),
      escapeCsvField((property?.["Heating"] ?? []).join(";")),
      property["FireplaceYN"],
      escapeCsvField((property?.["Flooring"] ?? []).join(";")),
      property["GarageYN"],
      property["GarageSpaces"],
      escapeCsvField((property?.["PatioAndPorchFeatures"] ?? []).join(";")),
      escapeCsvField(Array.isArray(property["WaterSource"]) ? property["WaterSource"].join(";") : property["WaterSource"]),
      property["WaterfrontYN"],
      escapeCsvField(Array.isArray(property["Sewer"]) ? property["Sewer"].join(";") : property["Sewer"]),
      escapeCsvField(Array.isArray(property["ElementarySchool"]) ? property["ElementarySchool"].join(";") : property["ElementarySchool"]),
      escapeCsvField(Array.isArray(property["MiddleOrJuniorSchool"]) ? property["MiddleOrJuniorSchool"].join(";") : property["MiddleOrJuniorSchool"]),
      escapeCsvField(Array.isArray(property["HighSchool"]) ? property["HighSchool"].join(";") : property["HighSchool"]),
      escapeCsvField(property["Zoning"]),
      property["CumulativeDaysOnMarket"],
      property["DaysOnMarket"],
      escapeCsvField(property["ListAgentFullName"]),
      escapeCsvField(property["ListAgentDirectPhone"]),
      escapeCsvField(property["ListAgentEmail"]),
      escapeCsvField(property["ListOfficeName"]),
      escapeCsvField(property["PublicRemarks"]),
      escapeCsvField(property["PrivateRemarks"]),
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

          <h3>Age filter</h3>
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

          {/*Keywords filter checkboxes*/}
          <div className={styles.keywordBox}>
            <h3>Keywords filter</h3>
            <div className={styles.keywordFilters}>
              {keywords.map((keyword, index) => (
                <div key={index} className={styles.keywordItem}>
                  <input
                    type="checkbox"
                    id={keyword}
                    name={keyword}
                    checked={keywordFilters[keyword]}
                    onChange={handleKeywordCheckboxChange}
                  />
                  <label htmlFor={keyword} className={styles.keywordLabel}>
                    {keyword}
                  </label>
                </div>
              ))}
            </div>
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

      {/* table element */}
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
            <th>Subdivision</th>
            <th>List Date</th>
            <th>Bedrooms</th>
            <th>Bathrooms Full</th>
            <th>Bathrooms Half</th>
            <th>Year Built</th>
            <th>Lot Size Acres</th>
            <th>Living Area</th>
            <th>Property Type</th>
            <th>Subtype</th>
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
                (!Object.values(keywordFilters).some((checked) => checked) ||
                  containsSelectedKeywords(property["PublicRemarks"])) &&
                (!filterPriceDifference ||
                  (property["ListPrice"] !== property["PreviousListPrice"] &&
                    property["ListPrice"] !== property["OriginalListPrice"] &&
                    property["PreviousListPrice"] !==
                      property["OriginalListPrice"])) &&
                (ageFilter === "" ||
                  property["CumulativeDaysOnMarket"] >= parseInt(ageFilter)) &&
                (!filterDaysOnMarketDifference ||
                  property["CumulativeDaysOnMarket"] !==
                    property["DaysOnMarket"]) &&
            (!excludedSubtypes.includes(property["PropertySubType"])) // Add this line
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
                <td>{property["SubdivisionName"]}</td>
                <td>{formatDate(property["ListDate"])}</td>
                <td>{property["BedroomsTotal"]}</td>
                <td>{property["BathroomsFull"]}</td>
                <td>{property["BathroomsHalf"]}</td>
                <td>{property["YearBuilt"]}</td>
                <td>{property["LotSizeAcres"]}</td>
                <td>{property["LivingArea"]} {property["LivingAreaUnits"]}</td>
                <td>{property["PropertyType"]}</td>
                <td>{property["PropertySubType"]}</td>
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
