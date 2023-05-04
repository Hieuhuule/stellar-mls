// FilteredProperties.js
import React from 'react';
import PropertyRow from './PropertyRow';

const FilteredProperties = ({ properties }) => {
  return (
    <>
      {properties.map((property, index) => (
        <PropertyRow key={index} property={property} />
      ))}
    </>
  );
};

export default FilteredProperties;
