import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import CountryCardDetail from "../Components/CountryDetailCard";
import "./countryDetail.css";

function CountryDetail({ data, savedCountries, setSavedCountries }) {
  const [country, setCountry] = useState({});
  const [viewCount, setViewCount] = useState(0);
  const { countryName } = useParams();

  //Filtered country data for country detail page
  useEffect(() => {
    if (data.length > 0 && countryName) {
      const filteredCountry = data.find(
        (country) => country.name === countryName,
      );
      setCountry(filteredCountry);
    }
  }, [data, countryName]);

  // Updated view count logic to use backend API instead of local storage. This useEffect hook sends a POST request to the backend API endpoint to increment the view count for the specific country whenever the countryName changes. The updated view count is then set in the state to be displayed on the country detail card.
 useEffect(() => {
  const incrementView = async () => {
    if (!countryName) return;

    try {
      const response = await fetch("/api/update-one-country-count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country_name: countryName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      console.log("Updated view count:", data);

      setViewCount(data.count);

    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  incrementView();
}, [countryName]);


  // Function to save a country to the backend api endpoint. It sends a POST request with the country name in the request body, and then logs the response message from the server. This function is called when the user clicks the "Save" button on the country detail card.
  const saveCountry = async () => {
    try {
      const response = await fetch("/api/save-one-country", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify({
          country_name: countryName,
        }),
      });

      const message = await response.text();
      console.log(message);
    } catch (error) {
      console.error("Error saving country:", error);
    }
  };


  return (
    <div className="country-detail">
      <CountryCardDetail
        country={country}
        allCountries={data}
        handleSave={saveCountry}
        views={viewCount}
      />
    </div>
  );
}

export default CountryDetail;
