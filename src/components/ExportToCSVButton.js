import React from "react";
import styles from "./ExportToCSVButton.module.css";
import { formatCurrency } from "./FormatCurrency";

const ExportToCSVButton = ({
  properties,
  filters,
  excludedSubtypes = [],
  containsSelectedKeywords,
  formatDate,
}) => {
  const {
    keywordFilters,
    filterPriceDifference,
    ageFilter = "",
    filterDaysOnMarketDifference,
    cityFilters,
    priceRangeFilter,
    excludedCounty = [],
    priceChangeFilter,
  } = filters;

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
          (ageFilter && ageFilter.includes("-")
            ? ageFilter === "60-90"
              ? property["DaysOnMarket"] >= 60 && property["DaysOnMarket"] <= 90
              : ageFilter === "90-180"
              ? property["DaysOnMarket"] >= 90 &&
                property["DaysOnMarket"] <= 180
              : property["DaysOnMarket"] >= 180 &&
                property["DaysOnMarket"] <= 365
            : property["DaysOnMarket"] >= parseInt(ageFilter))) &&
        (!filterDaysOnMarketDifference ||
          property["CumulativeDaysOnMarket"] !== property["DaysOnMarket"]) &&
        !excludedSubtypes.includes(property["PropertySubType"]) &&
        !excludedCounty.includes(property["CountyOrParish"]) &&
        (!Object.values(cityFilters).some((checked) => checked) ||
          cityFilters[property["City"]]) &&
        (priceChangeFilter === "one"
          ? property["ListPrice"] !== property["PreviousListPrice"] &&
            property["PreviousListPrice"] === property["OriginalListPrice"]
          : priceChangeFilter === "twoOrMore"
          ? property["ListPrice"] !== property["PreviousListPrice"] &&
            property["PreviousListPrice"] !== property["OriginalListPrice"] &&
            property["ListPrice"] !== property["OriginalListPrice"]
          : true) &&
        (priceRangeFilter === "50000-100000"
          ? property["OriginalListPrice"] >= 50000 &&
            property["OriginalListPrice"] <= 100000
          : priceRangeFilter === "100000-200000"
          ? property["OriginalListPrice"] >= 100000 &&
            property["OriginalListPrice"] <= 200000
          : priceRangeFilter === "200000-300000"
          ? property["OriginalListPrice"] >= 200000 &&
            property["OriginalListPrice"] <= 300000
          : priceRangeFilter === "300000-400000"
          ? property["OriginalListPrice"] >= 300000 &&
            property["OriginalListPrice"] <= 400000
          : priceRangeFilter === "400000-500000"
          ? property["OriginalListPrice"] >= 400000 &&
            property["OriginalListPrice"] <= 500000
          : priceRangeFilter === "500000+"
          ? property["OriginalListPrice"] > 500000
          : true)
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
      property["ListingId"].substring(3),
      formatCurrency(property["ListPrice"], false),
      formatCurrency(property["PreviousListPrice"], false),
      formatCurrency(property["OriginalListPrice"], false),
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
      escapeCsvField(
        Array.isArray(property["ConstructionMaterials"])
          ? property["ConstructionMaterials"].join(";")
          : ""
      ),
      escapeCsvField(
        Array.isArray(property["CommunityFeatures"])
          ? property["CommunityFeatures"].join(";")
          : ""
      ),
      escapeCsvField(
        Array.isArray(property["PoolFeatures"])
          ? property["PoolFeatures"].join(";")
          : ""
      ),
      property["PoolPrivateYN"],
      escapeCsvField(
        Array.isArray(property["Cooling"]) ? property["Cooling"].join(";") : ""
      ),
      escapeCsvField(
        Array.isArray(property["Heating"]) ? property["Heating"].join(";") : ""
      ),
      property["FireplaceYN"],
      escapeCsvField(
        Array.isArray(property["Flooring"])
          ? property["Flooring"].join(";")
          : ""
      ),
      property["GarageYN"],
      property["GarageSpaces"],
      escapeCsvField(
        Array.isArray(property["PatioAndPorchFeatures"])
          ? property["PatioAndPorchFeatures"].join(";")
          : ""
      ),
      escapeCsvField(
        Array.isArray(property["WaterSource"])
          ? property["WaterSource"].join(";")
          : property["WaterSource"] ?? ""
      ),
      property["WaterfrontYN"],
      escapeCsvField(
        Array.isArray(property["Sewer"])
          ? property["Sewer"].join(";")
          : property["Sewer"] ?? ""
      ),
      escapeCsvField(
        Array.isArray(property["ElementarySchool"])
          ? property["ElementarySchool"].join(";")
          : property["ElementarySchool"] ?? ""
      ),
      escapeCsvField(
        Array.isArray(property["MiddleOrJuniorSchool"])
          ? property["MiddleOrJuniorSchool"].join(";")
          : property["MiddleOrJuniorSchool"] ?? ""
      ),
      escapeCsvField(
        Array.isArray(property["HighSchool"])
          ? property["HighSchool"].join(";")
          : property["HighSchool"] ?? ""
      ),
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
    <button className={styles.exportButton} onClick={exportToCSV}>
      Export to CSV
    </button>
  );
};

export default ExportToCSVButton;
