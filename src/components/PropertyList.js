import React, { useState, useEffect, useRef, useCallback } from "react";
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

const API_BASE_URL = "http://localhost:5000/properties";

const PropertyList = (props) => {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
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

  const observer = useRef();
  const lastPropertyElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}?limit=2000&offset=${page * 2000}`
        );
        setProperties((prevProperties) => [
          ...prevProperties,
          ...response.data,
        ]);
        setHasMore(response.data.length > 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [page]);

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
              cityFilters,
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
          <tr ref={lastPropertyElementRef}>
            <td colSpan="100%">{loading ? "Loading..." : "End of results"}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default PropertyList;
