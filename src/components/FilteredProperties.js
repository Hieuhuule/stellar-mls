// FilteredProperties.js
import React from "react";
import PropertyRow from "./PropertyRow";

const FilteredProperties = ({
  properties,
  filters,
  excludedSubtypes,
  containsSelectedKeywords,
  formatDate,
}) => {
  const {
    keywordFilters,
    priceChangeFilter,
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
    

  return (
    <>
      {filteredProperties.map((property, index) => (
        <PropertyRow key={index} property={property} />
      ))}
    </>
  );
};

export default FilteredProperties;
