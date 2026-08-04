import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CountryOfTheDay.css";

const STORAGE_KEY = "countryOfTheDay";

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getUsableCountries(data) {
  return data.filter((c) => c?.name && c?.capital && c?.region && (c.flags?.svg || c.flags?.png));
}

function CountryOfTheDay({ data }) {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (data.length === 0) return;

    const pool = getUsableCountries(data);
    if (pool.length === 0) return;

    const today = getTodayString();
    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      stored = null;
    }

    let resolved = null;
    if (stored && stored.date === today) {
      resolved = pool.find((c) => c.name === stored.countryName) || null;
    }

    if (resolved === null) {
      resolved = pool[Math.floor(Math.random() * pool.length)];
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ date: today, countryName: resolved.name })
      );
    }

    setCountry(resolved);
  }, [data]);

  if (!country) {
    return (
      <div className="country-of-day">
        <p className="country-of-day-loading">Loading country of the day...</p>
      </div>
    );
  }

  return (
    <Link to={`/country-detail/${country.name}`} className="country-of-day-link">
      <div className="country-of-day">
        <img
          src={country.flags?.svg || country.flags?.png}
          alt={country.flags?.alt || `${country.name} flag`}
          className="country-of-day-flag"
        />
        <div className="country-of-day-info">
          <p className="country-of-day-label">Country of the Day</p>
          <p className="country-of-day-name">{country.name}</p>
          <p className="country-of-day-capital">Capital: {country.capital}</p>
          <p className="country-of-day-region">Region: {country.region}</p>
        </div>
      </div>
    </Link>
  );
}

export default CountryOfTheDay;
