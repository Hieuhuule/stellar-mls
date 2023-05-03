import React from "react";
import styles from "./KeywordFilter.module.css";

const KeywordFilter = ({ keyword, checked, onChange }) => {
  return (
    <div className={styles.keywordItem}>
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

export default KeywordFilter;
