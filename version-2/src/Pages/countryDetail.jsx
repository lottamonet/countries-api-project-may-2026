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
        (country) => country.name.common === countryName,
      );
      setCountry(filteredCountry);
    }
  }, [data, countryName]);

  // view count for each country card on detail page
  // useEffect(() => {
  //   const incrementView = () => {
  //     if (!countryName) return;
  //     let key = `viewCount_${countryName}`;
  //     if (localStorage.getItem(key)) {
  //       let count = parseInt(localStorage.getItem(key)) || 0;
  //       let newCount = count + 1;
  //       localStorage.setItem(key, newCount);
  //       setViewCount(newCount);
  //     } else {
  //       localStorage.setItem(key, 1);
  //       setViewCount(1);
  //     }
  //   };
  //   incrementView();
  // }, [countryName]);

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
          body: JSON.stringify({ country_name: countryName }),
        });

        const data = await response.json();
        setViewCount(data.count);
      } catch (error) {
        console.error("Error incrementing view count:", error);
      }
    };
    incrementView();
  }, [countryName]);


  // Function to handle saving a country to the saved countries list using local storage and state management. It checks if the country is already saved to prevent duplicates, and then updates both the state and local storage with the new list of saved countries.
  // const handleSave = () => {
  //   if (!country) return;
  //   let newCountry = {
  //     name: country.name.common,
  //     flag: country.flags?.svg || country.flags?.png,
  //   };

  //   //prevent countries from being saved twice
  //   let alreadySaved = savedCountries.some((c) => c.name === newCountry.name);
  //   if (alreadySaved) return;

  //   //update the state and the local storage with the saved countries

  //   let updated = [...savedCountries, newCountry];
  //   setSavedCountries(updated);
  //   localStorage.setItem("savedCountries", JSON.stringify(updated));
  // };

  // Function to save a country to the backend api endpoint. It sends a POST request with the country name in the request body, and then logs the response message from the server. This function is called when the user clicks the "Save" button on the country detail card.
  const saveCountry = async (countryName) => {
    try {
      const response = await fetch("/api/save-one-country", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country_name: countryName }),
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
