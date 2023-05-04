// FilteredProperties.js
import React from "react";
import PropertyRow from "./PropertyRow";

const FilteredProperties = ({
  properties,
  filters,
  excludedSubtypes,
  containsSelectedKeywords,
  formatDate,
  cityFilter,
  countyFilter,
}) => {
  const {
    keywordFilters,
    filterPriceDifference,
    ageFilter,
    filterDaysOnMarketDifference,
  } = filters;

  const isAgeFilterMatch = (property, ageFilter) => {
    const daysOnMarket = property.DaysOnMarket;
    if (ageFilter === "60-90") {
      return daysOnMarket >= 60 && daysOnMarket <= 90;
    } else if (ageFilter === "90-180") {
      return daysOnMarket > 90 && daysOnMarket <= 180;
    } else if (ageFilter === "180-365") {
      return daysOnMarket > 180 && daysOnMarket <= 365;
    } else {
      return true;
    }
  };

  const filteredProperties = properties
    .filter((property) => {
      // Apply city filter
      return !cityFilter || property.City === cityFilter;
    })
    .filter((property) => {
      // Apply county filter
      return (
        !countyFilter.length ||
        countyFilter.some((county) => property.CountyOrParish === county)
      );
    })
    .filter((property) => {
      // Apply subtype exclusion
      return !excludedSubtypes.includes(property.PropertyType);
    })
    .filter((property) => {
      // Apply keyword filters
      return (
        !Object.values(keywordFilters).some((checked) => checked) ||
        containsSelectedKeywords(property.PublicRemarks)
      );
    })
    .filter((property) => {
      // Apply price difference filter
      return (
        !filterPriceDifference ||
        (property.PriceChange && property.PriceChange.length >= 2)
      );
    })
    .filter((property) => {
      // Apply age filter
      return isAgeFilterMatch(property, ageFilter);
    })
    .filter((property) => {
      // Apply days on market discrepancy filter
      return (
        !filterDaysOnMarketDifference ||
        property.MLSMarketDaysOnMarket !== property.DaysOnMarket
      );
    });

  return (
    <>
      {filteredProperties.map((property, index) => (
        <PropertyRow key={index} property={property} />
      ))}
    </>
  );
};

export default FilteredProperties;
