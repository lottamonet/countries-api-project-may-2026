import React, { useState } from "react";
import CardList from "../Components/CardList";
import '../App.css';

function Home({ data }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = data.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

let regionArray = [];
const regions = data.forEach(country => {
  regionArray.push(country.region);
});


updatedRegions = new Set(regionArray);

  return (
    <div id="home">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <CardList countryData={filteredCountries} />
    </div>
  );
}

export default Home;
