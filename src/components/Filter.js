import React from "react";
import styles from "./Filter.module.css";

const Filter = ({ label, checked, onChange, type = "checkbox" }) => {
  return (
    <label className={styles.filterLabel}>
      <input
        className={type === "checkbox" ? styles.filterCheckbox : styles.filterRadio}
        type={type}
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
};

export default Filter;
