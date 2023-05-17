const https = require('https');
const fs = require('fs');
const { parse } = require('json2csv');

const API_BASE_URL =
  "https://api.mlsgrid.com/v2/Property?$filter=OriginatingSystemName%20eq%20%27mfrmls%27%20and%20MlgCanView%20eq%20true%20and%20StandardStatus%20eq%20%27Active%27%20and%20PropertyType%20eq%20%27Residential%27&$top=500";
const ACCESS_TOKEN = "7c0cc8a6877006b073dbc4cc978b45ba7c1cd6e2";
const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  'Accept-Encoding': 'gzip'
};

let allResults = [];

function handleApiResponse(response) {
  console.log(response);

  allResults.push(...response.value);

  if (response['@odata.nextLink']) {
  //   requestApiData(response['@odata.nextLink']);
  // } else {
    console.log("All data retrieved successfully.");
    console.log(allResults); // log all the results when finished

    // Convert the data to CSV format
    const csv = parse(allResults);

    // Write the CSV file
    fs.writeFile('data.csv', csv, (err) => {
      if (err) throw err;
      console.log('CSV file saved successfully.');
    });
  }
}

function requestApiData(url) {
  const options = { headers };
  if (!url.startsWith('https://api.mlsgrid.com')) {
    console.error("Invalid URL:", url);
    return;
  }

  https.get(url, options, (res) => {
    let data = '';
    const encoding = res.headers['content-encoding'];
    if (encoding && encoding.includes('gzip')) {
      const zlib = require('zlib');
      const gunzip = zlib.createGunzip();
      res.pipe(gunzip);
      gunzip.on('data', (chunk) => {
        data += chunk;
      });
      gunzip.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          handleApiResponse(parsedData);
        } catch (err) {
          console.error("Error parsing JSON response:", err);
        }
      });
    } else {
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          handleApiResponse(parsedData);
        } catch (err) {
          console.error("Error parsing JSON response:", err);
        }
      });
    }
  }).on('error', (err) => {
    console.error("Error requesting data:", err);
  });
}

requestApiData(API_BASE_URL);
