import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://api-demo.mlsgrid.com/v2/Property';
const ACCESS_TOKEN = '19cf3858acb8e0296488848bef6b32379af6b55c';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  const headers = useMemo(() => ({
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
  }), [ACCESS_TOKEN]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(API_BASE_URL, { headers });
        setProperties(response.data.value);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, [headers]);

  return (
    <div>
      <h1>Property List</h1>
      <ul>
        {properties.map((property, index) => (
          <li key={index}>
            {property.PropertyID}: {property.ListPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
