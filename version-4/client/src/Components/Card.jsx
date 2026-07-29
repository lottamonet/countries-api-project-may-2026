import React from "react";
import { Link } from "react-router";
import "../App.css";

function Card({ imageSrc, imageAlt, name, population, region, capital }) {
  return (
    <Link to={`/country-detail/${name}`}>
      <div className="card">
        <img src={imageSrc} alt={imageAlt} className="flag" />
        <div className="infoContainer">
          <p className="name">{name}</p>
          <p id="population">Population: {population}</p>
          <p id="region">Region: {region}</p>
          <p id="capital">Captital: {capital}</p>
        </div>
      </div>
    </Link>
  );
}

export default Card;
