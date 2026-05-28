import React, { useEffect, useState } from "react";
import "./savedCountries.css";

function SavedCountries({
  allCountries = [],
  savedCountries,
  setSavedCountries,
}) {
  // State to hold user profile information
  const [profileInfo, setProfileInfo] = useState({});

  // Form state to hold user input before submission
  const [form, setForm] = useState({
    name: "",
    email: "",
    country_name: "",
    bio: "",
  });

  // State to manage loading status
  const [loading, setLoading] = useState(true);

  // Handler to update form state when user types in the input fields
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Function to fetch the newest user information from the backend api endpoint
  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/get-newest-user");
      const data = await response.json();
      setProfileInfo(data[0]);
      console.log("profile info:", data[0]);
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch the list of saved countries from the backend api endpoint
  const fetchSavedCountries = async () => {
    try {
      const response = await fetch("/api/get-all-saved-countries");
      const data = await response.json();

      setSavedCountries(data);
    } catch (error) {
      console.error("Error fetching saved countries:", error);
    }
  };

  // Function to save user information to the backend api endpoint and then fetch the updated user information
  const saveUserInfo = async () => {
    try {
      const response = await fetch("/api/add-one-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const message = await response.text();
      console.log(message);

      fetchUserInfo();
    } catch (error) {
      console.error("Error saving user info:", error);
    }
  };

  // Function to save a country to the backend api endpoint and then fetch the updated list of saved countries
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

      fetchSavedCountries();
    } catch (error) {
      console.error("Error saving country:", error);
    }
  };

  // Function to unsave a country from the backend api endpoint and then fetch the updated list of saved countries
  const unsaveCountry = async (countryName) => {
    try {
      const response = await fetch("/api/unsave-one-country", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country_name: countryName }),
      });

      const message = await response.text();
      console.log(message);

      fetchSavedCountries();
    } catch (error) {
      console.error("Error unsaving country:", error);
    }
  };

  // Handler for form submission that saves user information and the favorite country, then resets the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveUserInfo();
    const matched = allCountries.find(
      (country) =>
        country.name.common.toLowerCase() === form.country_name.toLowerCase(),
    );

    if (matched) {
      await saveCountry(matched.name.common);
    }

    // Reset form fields after submission
    setForm({
      name: "",
      email: "",
      country_name: "",
      bio: "",
    });
  };

  // useEffect to fetch user information and saved countries when the page loads
  useEffect(() => {
    fetchUserInfo();
    fetchSavedCountries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="savedCountries">
      {loading ? (
        <p>Loading...</p>
      ) : profileInfo?.name ? (
        <h1>Welcome, {profileInfo.name}</h1>
      ) : (
        <h2>My Profile</h2>
      )}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleFormChange}
          placeholder="Your Name"
        />
        <br />

        <input
          type="text"
          name="email"
          value={form.email}
          onChange={handleFormChange}
          placeholder="Email"
        />
        <br />

        <input
          type="text"
          name="country_name"
          value={form.country_name}
          onChange={handleFormChange}
          placeholder="Favorite Country"
        />
        <br />

        <input
          type="text"
          name="bio"
          value={form.bio}
          onChange={handleFormChange}
          placeholder="Bio"
        />
        <br />

        <button type="submit" className="profile-submit">
          Submit
        </button>
      </form>

      <h2>Saved Countries:</h2>

      {/* Display the list of saved countries with their flags if available, or just the name if not */}
      <div className="saved-list">
        {savedCountries?.map((savedCountry, index) => {
          const countryName =
            savedCountry.country_name ||
            savedCountry.name ||
            savedCountry.country ||
            savedCountry;

          const matched = allCountries.find(
            (country) =>
              country.name.common.toLowerCase() ===
              String(countryName).toLowerCase(),
          );

          return (
            <div key={index} className="saved-country">
              {matched ? (
                <>
                  <img
                    src={matched.flags?.svg || matched.flags?.png}
                    alt={`${matched.name.common} flag`}
                    width="40"
                  />

                  <span>{matched.name.common}</span>

                  <button onClick={() => unsaveCountry(matched.name.common)}>
                    Unsave
                  </button>
                </>
              ) : (
                <span>{String(countryName)}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SavedCountries;
