import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./Infobox";
import Map from "./Map";
import Table from "./Table";
import "./App.css";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
//import numeral from "numeral";
//import CountUp from "react-countup";

// https://disease.sh/v3/covid-19/states

const App = () => {
  /* State variables */
  const [countries, setCountries] = useState([]);
  // Set Worldwide to be the default country in the dropdown menu
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  // UseEffect runs a piece of code based on a given condition
  useEffect(() => {
    // code runs once when the component loads and then not again
    const getCountriesData = async () => {
      // wait for the request to come back from website
      await fetch("https://disease.sh/v3/covid-19/countries")
        // get the entire json response
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // name of country
            value: country.countryInfo.ios2, // country abbreviations
          }));

          let sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  // Function to listen from onChange event of country click
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    //console.log("It Woorrkkedd ->>>", countryCode);
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    // Make a call
    await fetch(url)
      // Get the response and turn into a JSON request
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        // Stores the country response data
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  console.log("Country Info ->", countryInfo);

  return (
    <div className="app">
      {/* Info on the left of the app */}

      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker!</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* Loop through all the countries and show a drop down list of the options */}
              {countries.map((country) => (
                <MenuItem value={country.name}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* 3 InfoBoxs */}
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases Today"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />

          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered Cases"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />

          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        {/* Map being passed in as a prop*/}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      {/* Info on the right of the app */}
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            {/* Table of Countries */}
            <h3> Live Cases by Country</h3>
            <Table countries={tableData} />
            {/* Graph */}
            <h3 className="app__graphTitle"> Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
