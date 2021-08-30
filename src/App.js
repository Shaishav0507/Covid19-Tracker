import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './Map';
import InfoBox from './InfoBox';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});

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

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
    })
  };

  return (
      <div className="app">
        <div className="app__left">
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
          <Map />
        </div>
        <Card className="app__right">
            <CardContent>
              <h3>Live Cases by Country</h3>
              <h3>Worldwode new cases</h3>
            </CardContent>
        </Card>
      </div>   
  );
}

export default App;
