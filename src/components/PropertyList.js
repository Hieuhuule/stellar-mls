import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import styles from "./PropertyList.module.css";
import PriceChangeFilter from "./PriceChangeFilter";
import KeywordFilter, { keywords } from "./KeywordFilter";
import ExportToCSVButton from "./ExportToCSVButton";
import AgeFilter from "./AgeFilter";
import { formatDate } from "../utils";
import ClearFilters from "./ClearFilters";
import FilteredProperties from "./FilteredProperties";
import TableHeader from "./TableHeader";
import MarketDiscrepancyFilter from "./MarketDiscrepancyFilter";

const API_BASE_URL = "https://api.mlsgrid.com/v2/Property?$top=5000";
const ACCESS_TOKEN = "7c0cc8a6877006b073dbc4cc978b45ba7c1cd6e2";

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

  // automatically excludes these property types
  const excludedSubtypes = [
    "Condominium",
    "Townhouse",
    "Commercial",
    "Business",
    "Retail",
    "Industrial",
  ];

  // automatically excludes these property statuses from StandardStatus
  // const excludedStatuses = ["Sold", "Hold", "Pending", "Delete", "Incomplete", "Closed"];

  const [keywordFilters, setKeywordFilters] = useState(
    keywords.reduce((acc, keyword) => {
      acc[keyword] = false;
      return acc;
    }, {})
  );

  return (
    <>
      {/* checkbox input element */}
      <div className={styles.filterContainer}>
        <div className={styles.box}>
          <h2>Filters</h2>
          <p>Filter the properties based on the following criteria:</p>

          {/*2+ Price Change*/}
          <PriceChangeFilter
            label="2+ Price Change"
            filterPriceDifference={filterPriceDifference}
            setFilterPriceDifference={setFilterPriceDifference}
          />

          {/*Days on Market Discrepancy*/}
          <MarketDiscrepancyFilter
            filterDaysOnMarketDifference={filterDaysOnMarketDifference}
            setFilterDaysOnMarketDifference={setFilterDaysOnMarketDifference}
          />

          {/*Age filter*/}
          <AgeFilter ageFilter={ageFilter} setAgeFilter={setAgeFilter} />

          {/*Keywords filter checkboxes*/}
          <div className={styles.keywordBox}>
            <h3>Keywords filter</h3>
            <div className={styles.keywordFilterContainer}>
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
          <ClearFilters
            className="clearAllFiltersButton"
            clearAllFilters={clearAllFilters}
          />

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
            // excludedStatuses={excludedStatuses}
            containsSelectedKeywords={containsSelectedKeywords}
            formatDate={formatDate}
          />
        </div>
      </div>

      {/* table element */}
      <table className={styles.table}>
        <thead>
          <TableHeader />
        </thead>
        <tbody>
          <FilteredProperties
            properties={properties}
            filters={{
              keywordFilters,
              filterPriceDifference,
              ageFilter,
              filterDaysOnMarketDifference,
            }}
            excludedSubtypes={excludedSubtypes}
            // excludedStatuses={excludedStatuses}
            containsSelectedKeywords={containsSelectedKeywords}
            formatDate={formatDate}
          />
        </tbody>
      </table>
    </>
  );
};

export default PropertyList;
