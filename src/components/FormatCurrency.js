
// Format currency
const formatCurrency = (value, includeCommaSeparator = true) => {
    if(isNaN(value)) {
        return "";
    }

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: includeCommaSeparator,
    });
    return formatter.format(value);
  };

export { formatCurrency };
