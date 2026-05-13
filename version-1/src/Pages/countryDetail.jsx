import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import CountryCardDetail from "../Components/CountryDetailCard";
import "./countryDetail.css";


function CountryDetail ({data, savedCountries, setSavedCountries}) {
    const [country, setCountry] = useState({});
    const [viewCount, setViewCount] = useState(0);
    const { countryName } = useParams();

    //Filtered country data for country detail page
    useEffect(() => {
      if (data.length > 0 && countryName) {
        const filteredCountry = data.find(
          (country) => country.name.common === countryName
        );
        setCountry(filteredCountry);
      }
    }, [data, countryName]);

// view count for each country card on detail page

useEffect(() => {
const incrementView = () => {
  if (!countryName) return;
  let key = `viewCount_${countryName}`
  if (localStorage.getItem(key)) {
    let count = parseInt(localStorage.getItem(key)) || 0;
    let newCount = count + 1;
    localStorage.setItem(key, newCount);
    setViewCount(newCount);
  } else {
    localStorage.setItem(key, 1)
    setViewCount(1);
  }
};
incrementView();
}, [])

    const handleSave = () => {
     if (!country) return;
     let newCountry = {
      name: country.name.common,
      flag: country.flags?.png
     }

     //prevent countries from being saved twice
     let alreadySaved = savedCountries.some(c => c.name === newCountry.name);
     if (alreadySaved) return;

     //update the state and the local storage with the saved countries

     let updated = [...savedCountries, newCountry];
     setSavedCountries(updated);
     localStorage.setItem('savedCountries', JSON.stringify(updated));
    };
    

  return (
    <div className="country-detail">
      
      <CountryCardDetail country={country} allCountries={data} handleSave={handleSave} views={viewCount}/>
    </div>
  );
}

export default CountryDetail;