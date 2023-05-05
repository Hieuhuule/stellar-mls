// FilteredProperties.js
import React from "react";
import PropertyRow from "./PropertyRow";

const FilteredProperties = ({
  properties,
  filters,
  excludedSubtypes,
  excludedCounty,
  containsSelectedKeywords,
  formatDate,
}) => {
  const {
    keywordFilters,
    priceChangeFilter,
    ageFilter,
    filterDaysOnMarketDifference,
    priceRangeFilter,
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
      // Apply subtype exclusion
      return !excludedSubtypes.includes(property.PropertyType);
    })
    .filter((property) => {
      // Apply county exclusion
      return !excludedCounty.includes(property.CountyOrParish);
    })
    .filter((property) => {
      // Apply keyword filters
      return (
        !Object.values(keywordFilters).some((checked) => checked) ||
        containsSelectedKeywords(property.PublicRemarks)
      );
    })
    .filter((property) => {
      // Apply price change filter
      if (priceChangeFilter === "one") {
        return (
          property.ListPrice !== property.PreviousListPrice &&
          property.PreviousListPrice === property.OriginalListPrice
        );
      } else if (priceChangeFilter === "twoOrMore") {
        return (
          property.ListPrice !== property.PreviousListPrice &&
          property.PreviousListPrice !== property.OriginalListPrice &&
          property.ListPrice !== property.OriginalListPrice
        );
      } else {
        return true;
      }
    })
    .filter((property) => {
      // Apply age filter
      return isAgeFilterMatch(property, ageFilter);
    })
    .filter((property) => {
      // Apply days on market discrepancy filter
      return (
        !filterDaysOnMarketDifference ||
        property.CumulativeDaysOnMarket !== property.DaysOnMarket
      );
    })
    .filter((property) => {
      // Apply price range filter
      switch (priceRangeFilter) {
        case "50000-100000":
          return (
            property.OriginalListPrice >= 50000 &&
            property.OriginalListPrice <= 100000
          );
        case "100000-200000":
          return (
            property.OriginalListPrice >= 100000 &&
            property.OriginalListPrice <= 200000
          );
        case "200000-300000":
          return (
            property.OriginalListPrice >= 200000 &&
            property.OriginalListPrice <= 300000
          );
        case "300000-400000":
          return (
            property.OriginalListPrice >= 300000 &&
            property.OriginalListPrice <= 400000
          );
        case "400000-500000":
          return (
            property.OriginalListPrice >= 400000 &&
            property.OriginalListPrice <= 500000
          );
        case "500000+":
          return property.OriginalListPrice > 500000;
        default:
          return true;
      }
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
