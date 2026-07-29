import React from "react";
import Card from "./Card";


function CardList({countryData}) {
// aphabetizing the countries
let sortedCountries = [...countryData].sort((a, b) => a.name.localeCompare(b.name));
// iterating to create country cards
let countriesArray = sortedCountries.map((country, i) => (
<Card 
imageSrc={country.flags?.svg || country.flags?.png} 
imageAlt={country.flags?.alt || country.name}  
name={country.name} 
population={country.population.toLocaleString()} 
region={country.region} 
capital={country.capital} 
key={i} 
/> 
));
    return (
        <div id='cardContainer'>
            {countriesArray }
        </div>
        
    )
}

export default CardList;