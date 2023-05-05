import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import styles from "./PropertyList.module.css";
import PriceChangeFilter from "./PriceChangeFilter";
import { keywords } from "./KeywordFilter";
import { KeywordsFilterList, containsSelectedKeywords } from "./KeywordFilter";
import ExportToCSVButton from "./ExportToCSVButton";
import AgeFilter from "./AgeFilter";
import { formatDate } from "../utils";
import ClearFilters from "./ClearFilters";
import FilteredProperties from "./FilteredProperties";
import TableHeader from "./TableHeader";
import DaysOnMarketDiscrepancyFilter from "./DaysOnMarketDiscrepancyFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import CityFilterList from "./CityFilter";

const API_BASE_URL =
  "https://api.mlsgrid.com/v2/Property?$filter=OriginatingSystemName%20eq%20%27mfrmls%27%20and%20MlgCanView%20eq%20true%20and%20StandardStatus%20eq%20%27Active%27%20and%20PropertyType%20eq%20%27Residential%27&$top=3000";
const ACCESS_TOKEN = "7c0cc8a6877006b073dbc4cc978b45ba7c1cd6e2";

const PropertyList = (props) => {
  const [properties, setProperties] = useState([]);
  const [priceChangeFilter, setPriceChangeFilter] = useState("none");
  const [priceRangeFilter, setPriceRangeFilter] = useState("none");
  const [ageFilter, setAgeFilter] = useState("");
  const [filterDaysOnMarketDifference, setFilterDaysOnMarketDifference] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [cityFilters, setCityFilters] = useState({});

  const handleKeywordCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setKeywordFilters((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    }),
    []
  );

  // PAGINATION - USE WHEN READY TO DEPLOY
  // useEffect(() => {
  //   const fetchPaginatedProperties = async (url, allProperties = []) => {
  //     try {
  //       const response = await axios.get(url, { headers });
  //       console.log("Fetched data from URL:", url); // Log the URL being fetched
  //       console.log("Fetched data:", response.data); // Log the fetched data

  //       const newProperties = allProperties.concat(response.data.value);
  //       console.log("New properties:", newProperties); // Log the updated properties array

  //       if (response.data["@odata.nextLink"]) {
  //         return await fetchPaginatedProperties(response.data["@odata.nextLink"], newProperties);
  //       } else {
  //         return newProperties;
  //       }
  //     } catch (error) {
  //       console.error("Error fetching properties:", error);
  //       return allProperties;
  //     }
  //   };

  //   const fetchProperties = async () => {
  //     const allProperties = await fetchPaginatedProperties(API_BASE_URL);
  //     console.log("All properties:", allProperties); // Log the final accumulated properties array
  //     setProperties(allProperties);
  //   };

  //   fetchProperties();
  // }, [headers]);

  // NO PAGINATION - USE WHEN TESTING
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_BASE_URL, { headers });
        setProperties(response.data.value);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [headers]);

  // automatically excludes these property types
  const excludedSubtypes = [
    "Condominium",
    "Townhouse",
    "Commercial",
    "Business",
    "Retail",
    "Industrial",
  ];

  const excludedCounty = ["Out of Area"];

  const [keywordFilters, setKeywordFilters] = useState(
    keywords.reduce((acc, keyword) => {
      acc[keyword] = false;
      return acc;
    }, {})
  );

  return (
    <>
      {/* Loading spinner */}
      {loading && (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {/* checkbox input element */}
      <div className={styles.filterContainer}>
        <div className={styles.box}>
          <h2>Filters</h2>
          <p>Filter the properties based on the following criteria:</p>

          {/* City filter list */}
          {!loading && (
            <CityFilterList
              properties={properties}
              cityFilters={cityFilters}
              setCityFilters={setCityFilters}
              excludedCounty={excludedCounty}
            />
          )}

          {/*Price Range Filter*/}
          <PriceRangeFilter
            priceRangeFilter={priceRangeFilter}
            setPriceRangeFilter={setPriceRangeFilter}
          />

          {/* Price Change Filter */}
          <PriceChangeFilter
            priceChangeFilter={priceChangeFilter}
            setPriceChangeFilter={setPriceChangeFilter}
          />

          {/*Days on Market Discrepancy*/}
          <DaysOnMarketDiscrepancyFilter
            filterDaysOnMarketDifference={filterDaysOnMarketDifference}
            setFilterDaysOnMarketDifference={setFilterDaysOnMarketDifference}
          />

          {/*Age filter*/}
          <AgeFilter ageFilter={ageFilter} setAgeFilter={setAgeFilter} />

          {/*Keywords filter list*/}
          <KeywordsFilterList
            keywordFilters={keywordFilters}
            handleKeywordCheckboxChange={handleKeywordCheckboxChange}
          />

          {/* Clear all filters button */}
          <ClearFilters
            setAgeFilter={setAgeFilter}
            setKeywordFilters={setKeywordFilters}
            setFilterDaysOnMarketDifference={setFilterDaysOnMarketDifference}
            setPriceChangeFilter={setPriceChangeFilter}
            setPriceRangeFilter={setPriceRangeFilter}
            setCityFilters={setCityFilters} // pass the setCityFilters function as a prop
          />

          {/* Export to CSV button */}
          <ExportToCSVButton
            properties={properties}
            filters={{
              keywordFilters,
              priceChangeFilter,
              ageFilter,
              filterDaysOnMarketDifference,
              priceRangeFilter,
            }}
            excludedSubtypes={excludedSubtypes}
            excludedCounty={excludedCounty}
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
              priceChangeFilter,
              ageFilter,
              filterDaysOnMarketDifference,
              priceRangeFilter,
              cityFilters,
            }}
            excludedSubtypes={excludedSubtypes}
            excludedCounty={excludedCounty}
            containsSelectedKeywords={(text) =>
              containsSelectedKeywords(text, keywordFilters)
            }
            formatDate={formatDate}
          />
        </tbody>
      </table>
    </>
  );
};

export default PropertyList;
