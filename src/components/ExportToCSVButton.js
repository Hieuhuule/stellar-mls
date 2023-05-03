import React from "react";
import styles from "./ExportToCSVButton.module.css";
import { formatCurrency } from "./FormatCurrency";

const ExportToCSVButton = ({ 
    properties, 
    filters, 
    excludedSubtypes,
    containsSelectedKeywords,
    formatDate,
 }) => {
    const {
        keywordFilters,
        filterPriceDifference,
        ageFilter,
        filterDaysOnMarketDifference,
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
      escapeCsvField(
        Array.isArray(property["WaterSource"])
          ? property["WaterSource"].join(";")
          : property["WaterSource"]
      ),
      property["WaterfrontYN"],
      escapeCsvField(
        Array.isArray(property["Sewer"])
          ? property["Sewer"].join(";")
          : property["Sewer"]
      ),
      escapeCsvField(
        Array.isArray(property["ElementarySchool"])
          ? property["ElementarySchool"].join(";")
          : property["ElementarySchool"]
      ),
      escapeCsvField(
        Array.isArray(property["MiddleOrJuniorSchool"])
          ? property["MiddleOrJuniorSchool"].join(";")
          : property["MiddleOrJuniorSchool"]
      ),
      escapeCsvField(
        Array.isArray(property["HighSchool"])
          ? property["HighSchool"].join(";")
          : property["HighSchool"]
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

  return <button className={styles.exportButton} onClick={exportToCSV}>Export to CSV</button>;
};

export default ExportToCSVButton;
