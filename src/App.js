import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import "./App.css";

// https://disease.sh/v3/covid-19/countries
function App() {
  const [countries, setCountries] = useState([]); // drop down all countries
  const [country, setCountry] = useState("worldwide"); //which country we selected def worldwide
  const [countryInfo, setCountryInfo] = useState({}); // single country selected to fetch data from url
  const [tableData, setTableData] = useState([]); // for the table
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 }); // just the center of pacific ocean
  const [mapZoom, setMapZoom] = useState(3); // just 3 scroll back zoom
  const [mapCountries, setMapCountries] = useState([]); // for the circle & popups
  const [casesType, setCasesType] = useState("cases"); // for changing the map when rec death are toggle

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(3);
      });
  };

  console.log("country Info", countryInfo);
  return (
    <div>
      <div className="app">
        {/* Header*/}
        <div className="app__left">
          <div className="app__header">
            <h1>COVID-19 TRACKER</h1>
            <FormControl className="app__dropdown">
              <Select
                variant="outlined"
                onChange={onCountryChange}
                value={country}
              >
                <MenuItem value="worldwide">Worldwide</MenuItem>

                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="app__stats">
            {/* InfoBoxs title= corona virus cases*/}
            <InfoBox
              isRed
              active={casesType === "cases"}
              onClick={(e) => setCasesType("cases")}
              title="🦠 Coronavirus Cases 🦠"
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={prettyPrintStat(countryInfo.cases)}
            ></InfoBox>
            {/* InfoBoxs title= corona virus recovered*/}
            <InfoBox
              active={casesType === "recovered"}
              onClick={(e) => setCasesType("recovered")}
              title="🏥 Recovered 🏥 "
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={prettyPrintStat(countryInfo.recovered)}
            ></InfoBox>
            {/* InfoBoxs title = deaths*/}
            <InfoBox
              isGrey
              active={casesType === "deaths"}
              onClick={(e) => setCasesType("deaths")}
              title="💀 Deaths 💀 "
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={prettyPrintStat(countryInfo.deaths)}
            ></InfoBox>
          </div>
          {/* map*/}
          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
        <Card className="app__right" style={{ backgroundColor: "#fde6fc" }}>
          <CardContent>
            <h3>Live Cases by Country</h3>
            {/* table*/}
            <Table countries={tableData}></Table>
            <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
            <LineGraph className="app__graph" casesType={casesType}></LineGraph>
            {/* graph*/}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;