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
import "./App.css";

// https://disease.sh/v3/covid-19/states

function App() {
  //State variable
  const [countries, setCountries] = useState([]);
  // Set Worldwide to be the default country in the dropdown menu
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  //UseEffect runs a piece of code based on a given condition
  useEffect(() => {
    //code runs once when the component loads and then not again
    const getCountriesData = async () => {
      //wait for the request to come back from website
      await fetch("https://disease.sh/v3/covid-19/countries")
        //get the entire json response
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, //name of country
            value: country.countryInfo.ios2, // country abbreviations
          }));

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
      });
  };

  console.log("Country Info ->", countryInfo);

  return (
    <div className="app">
      {/* BEM naming convention"*/}
      {/* Info on the left of the app */}

      <div className="app__left">
        <div className="app__header">
          <h1>Time to build my COVID Tracker!</h1>
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
              <MenuItem value="worldwide">Worldwide</MenuItem>
              <MenuItem value="usa">United States</MenuItem>
              <MenuItem value="ca">Canada</MenuItem>
              <MenuItem value="mx">Mexico</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* 3 InfoBoxs */}
        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases Today"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />

          <InfoBox
            title="Recovered Cases"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />

          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>

        {/* Map */}
        <Map />
      </div>
      {/* Info on the right of the app */}
      <Card className="app__right">
        <CardContent>
          <h3> Live Cases by Country</h3>
          {/* Table of Countries */}
          <h3> Worldwide new cases</h3>
          {/* Graph */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
