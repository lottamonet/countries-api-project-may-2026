import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Pages/home.jsx";
import CountryDetail from "./Pages/countryDetail.jsx";
import SavedCountries from "./Pages/savedCountries.jsx";
import localData from "./data/localData.js";

function App() {
  // state for fetched data
  const [data, setData] = useState([]);
  // state for saved countries; going to be passed down to the saved countries page via props
  const [savedCountries, setSavedCountries] = useState([]);
  // light or dark mode
  const [darkMode, setDarkMode] = useState(false);
  // asynchronous api call to the countries api; requesting, and recieving all country data with error handling
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,capital,population,region,currencies,borders,flags,cca3",
        );
        const responseJson = await response.json();
        responseJson ? setData(responseJson) : setData(localData);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setData(localData);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      {/* Global Nav bar */}
      <nav>
        <ul id="navList">
          <li className="where">
            <Link to="/">Where in the World</Link>
          </li>
          <li className="saved">
            <Link to="/savedCountries">Saved Countries</Link>
          </li>
        </ul>
      </nav>
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className="theme-toggle"
      >
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>
      <div>
        {/* Routes for App ; passing data into each page*/}
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route
            path="/country-detail/:countryName"
            element={
              <CountryDetail
                data={data}
                savedCountries={savedCountries}
                setSavedCountries={setSavedCountries}
              />
            }
          />
          <Route
            path="/savedCountries"
            element={
              <SavedCountries
                data={data}
                allCountries={data}
                savedCountries={savedCountries}
                setSavedCountries={setSavedCountries}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
