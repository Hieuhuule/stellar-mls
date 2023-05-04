import React from "react";
import styles from "./KeywordFilter.module.css";

export const keywords = [
  "abandoned property",
  "as-is",
  "attorney-in-fact",
  "ATTY-IN-FACT",
  "auction",
  "Bank-owned",
  "basement issues",
  "basement problems",
  "basement repairs",
  "below assessed value",
  "Below market value",
  "bring all offers",
  "cash flow",
  "cash only",
  "Distressed Properties",
  "do not disturb tenant",
  "engineer report",
  "estate",
  "estate sale",
  "fixer",
  "fixer upper",
  "fixer-upper",
  "flipping",
  "foreclosure",
  "foundation issues",
  "foundation problems",
  "foundation repairs",
  "heir",
  "heirs",
  "hidden gem",
  "high ROI",
  "inherited",
  "investor special",
  "investment opportunity",
  "junker",
  "lease option",
  "leak",
  "low inventory",
  "motivated",
  "motivated seller",
  "multi-unit",
  "must sell",
  "no FHA",
  "not responsible",
  "off market",
  "opportunity zone",
  "out of state",
  "owner finance",
  "owner financing",
  "owner will carry",
  "owner will carry 2nd",
  "owner will finance",
  "personal rep",
  "personal representative",
  "preforeclosure",
  "pre-foreclosure",
  "price change",
  "probate",
  "probate sale",
  "quick close",
  "quit claim deed",
  "relocation",
  "relocated",
  "renovation",
  "rental property",
  "repairs",
  "rented",
  "seller financing",
  "short sale",
  "special warranty deed",
  "structural issues",
  "structural problems",
  "structural repairs",
  "TLC",
  "tenant",
  "trustee",
  "vacant",
  "value-add",
  "water issues",
  "water problems",
];

const KeywordFilter = ({ keyword, checked, onChange }) => {
  return (
    <div className={`${styles.KeywordFilter} ${styles.keywordItem}`}>
      <input
        type="checkbox"
        id={keyword}
        name={keyword}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={keyword} className={styles.keywordLabel}>
        {keyword}
      </label>
    </div>
  );
};

const KeywordsFilterList = ({ keywordFilters, handleKeywordCheckboxChange }) => {
  return (
    <div className={styles.keywordFilters}>
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
  );
};

export const containsSelectedKeywords = (text, keywordFilters) => {
  return keywords.every(
    (keyword) =>
      !keywordFilters[keyword] || text.toLowerCase().includes(keyword.toLowerCase())
  );
};



export { KeywordsFilterList };
