import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import styles from "./PropertyList.module.css";
import Filter from "./Filter";
import KeywordFilter from "./KeywordFilter";
import ExportToCSVButton from "./ExportToCSVButton";
import { formatCurrency } from "./FormatCurrency";

const API_BASE_URL = "https://api-demo.mlsgrid.com/v2/Property?$top=5000";
const ACCESS_TOKEN = "19cf3858acb8e0296488848bef6b32379af6b55c";

const PropertyList = (props) => {
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

  return (
    <>
      {/* checkbox input element */}
      <div className={styles.filterContainer}>
        <div className={styles.box}>
          <h2>Filters</h2>
          <p>Filter the properties based on the following criteria:</p>

          {/*2+ Price Change*/}
          <Filter
            label="2+ Price Change"
            checked={filterPriceDifference}
            onChange={(event) => setFilterPriceDifference(event.target.checked)}
          />

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
                <KeywordFilter
                  key={index}
                  keyword={keyword}
                  checked={keywordFilters[keyword]}
                  onChange={handleKeywordCheckboxChange}
                />
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
          <ExportToCSVButton
            properties={properties}
            filters={{
              keywordFilters,
              filterPriceDifference,
              ageFilter,
              filterDaysOnMarketDifference,
            }}
            excludedSubtypes={excludedSubtypes}
            containsSelectedKeywords={containsSelectedKeywords}
            formatDate={formatDate}
          />
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
                !excludedSubtypes.includes(property["PropertySubType"]) // Add this line
            )

            .map((property, index) => (
              <tr key={index}>
                <td>{property["ListingId"]}</td>
                <td>{formatCurrency(property["ListPrice"])}</td>
                <td>{formatCurrency(property["PreviousListPrice"])}</td>
                <td>{formatCurrency(property["OriginalListPrice"])}</td>
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
                <td>
                  {property["LivingArea"]} {property["LivingAreaUnits"]}
                </td>
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
