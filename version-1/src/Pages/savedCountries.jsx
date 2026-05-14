import React, { useEffect, useState } from "react";
import "./savedCountries.css";


function SavedCountries({ allCountries = [], savedCountries, setSavedCountries }) {
//user profile state
  const [profileInfo, setProfileInfo] = useState(null);
// form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    country: '',
    bio: ''
  });
  
//logs and displays each key stroke on the form
  const handleFormChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, [e.target.name]: value });
    console.log(form), 'form';
  };
// handling of the for submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form, 'form data');

// save form data to local storage
    localStorage.setItem('userInfo', JSON.stringify(form));

    setProfileInfo(form);
    setForm({
        name: '',
        email: '',
        country: '',
        bio: ''
      });
  
    // Try to find the country in allCountries by name
const matched = allCountries.find(c => c.name.common.toLowerCase() === form.country.toLowerCase());
if (matched) {
    setSavedCountries((prev) => [...prev, {
    name: matched.name.common,
    flag: matched.flags?.svg || matched.flags?.png
    }]);
}
  };  

  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    const deserialized = JSON.parse(info);
    console.log(deserialized, 'parsed json for user info')
    setProfileInfo(deserialized);
  }, [])

  useEffect(() => {
    const storedCountries = localStorage.getItem('savedCountries');
    const storedDeserialized = JSON.parse(storedCountries);
    console.log(storedDeserialized, 'parsed json for saved countries')
    setSavedCountries(storedDeserialized || []);
  }, [setSavedCountries])

  return (
    <div id="savedCountries">
    {profileInfo && profileInfo.name.length > 0 ? <h1>Welcome, {profileInfo.name}</h1> : null}
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="name" value={form.name} onChange={handleFormChange} placeholder="Your Name" /><br />
        <input type="text" name="email" value={form.email} onChange={handleFormChange} placeholder="Email" /><br />
        <input type="text" name="country" value={form.country} onChange={handleFormChange} placeholder="Favorite Country" /><br />
        <input type="text" name="bio" value={form.bio} onChange={handleFormChange} placeholder="Bio" /><br />
        <button type="submit" className="profile-submit">Submit</button>
      </form>

      <h2>Saved Countries:</h2>
      <div className="saved-list">
        { savedCountries ? savedCountries.map((c, index) => (
          <div key={index} className="saved-country">
            <img src={c.flag} alt={`${c.name} flag`} width="40" />
            <span>{c.name}</span>
          </div>
        )) : null}
      </div>
    </div>
  );
}

export default SavedCountries;
