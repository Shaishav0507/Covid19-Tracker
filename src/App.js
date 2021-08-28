import { MenuItem, FormControl, Select } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './InfoBox';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

  useEffect(() => {
    const getCountreisData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }));

          setCountries(countries);
      })
    };
    getCountreisData();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;

    setCountry(countryCode);
  }
  return (
      <div className="app">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country} >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
            <InfoBox title="Coronovirus Cases" total={2000} />
            <InfoBox title="Recovered" total={2000} />
            <InfoBox title="Deaths" total={2000} />
        </div>
      
        {/* title + select input dropdown */}

      </div>   
  );
}

export default App;
