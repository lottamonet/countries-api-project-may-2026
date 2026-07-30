# 🌍 Where in the World?

## 📌 Project Description & Purpose

**Where in the World?** is a full-stack country information application built with React, Node.js, Express, and PostgreSQL.

The app allows users to explore countries from around the world, search by country name, filter countries by region, view detailed country information, save favorite countries, and track how many times each country’s detail page has been viewed.

This project began as a frontend country browser and was later expanded into a full-stack application with a custom REST API and PostgreSQL database.

The purpose of this project was to practice:

- Fetching and displaying data from an external API
- Creating reusable React components
- Managing state with React hooks
- Using dynamic routes with React Router
- Building a REST API with Express
- Connecting a Node.js server to PostgreSQL
- Creating and querying relational database tables
- Deploying a full-stack application
- Connecting a deployed frontend, backend, and database

---

## 🚀 Live Site

View the deployed application here:

[Visit Where in the World?](https://lotta-country-api-2026.netlify.app)

### Deployed Backend

The Express API is deployed on Render:

[View the Countries API](https://countries-app-o1s6.onrender.com)

> The backend is hosted on a free Render instance. If the server has been inactive, the first request may take several seconds while the server wakes up.

---

## 🖼️ Screenshots

### Home Page — Light Mode

<!-- Paste your light-mode home page screenshot here -->

### Home Page — Dark Mode

<!-- Paste your dark-mode home page screenshot here -->

### Country Detail Page

<!-- Paste your country detail screenshot here -->

### Saved Countries Page

<!-- Paste your saved countries screenshot here -->

---

## ✨ Features

Users can:

- View a list of countries and their flags
- Search for a country by name
- Filter countries by region
- View each country’s:
  - Population
  - Region
  - Capital
  - Flag
  - Bordering countries
- Navigate to dynamic country detail pages
- Switch between light mode and dark mode
- Save favorite countries
- Remove countries from the saved list
- Submit profile information
- View the newest submitted user profile
- Track how many times a country detail page has been viewed
- Store saved countries, users, and view counts in PostgreSQL
- Navigate directly to frontend routes without receiving a 404 error

---

## 🛠️ Tech Stack

### Frontend

- **Languages:** JavaScript, HTML, CSS
- **Library:** React
- **Build Tool:** Vite
- **Routing:** React Router
- **External Country Data:** Countries API
- **Deployment:** Netlify

### Server/API

- **Language:** JavaScript
- **Runtime:** Node.js
- **Framework:** Express
- **Database Driver:** `pg`
- **Deployment:** Render

### Database

- **Language:** SQL
- **Database:** PostgreSQL
- **Deployment:** Neon

### Development Tools

- Git
- GitHub
- Visual Studio Code
- Chrome DevTools
- Netlify redirects
- Render environment variables

---

## 🔹 API Documentation

The backend base URL is:

```text
https://countries-app-o1s6.onrender.com
```

These are the API endpoints I built:

### Add One User

```http
POST /api/add-one-user
```

Adds a new user profile to the database.

#### Request Body

```json
{
  "name": "LottaMonet",
  "email": "example@email.com",
  "country_name": "Spain",
  "bio": "Spain won the World Cup!"
}
```

#### Required Fields

- `name`
- `email`
- `country_name`

---

### Get Newest User

```http
GET /api/get-newest-user
```

Returns the most recently added user.

#### Example Response

```json
[
  {
    "user_id": 4,
    "name": "LottaMonet",
    "country_name": "Spain",
    "email": "example@email.com",
    "bio": "Spain won the World Cup!"
  }
]
```

---

### Get All Users

```http
GET /api/get-all-users
```

Returns all users, ordered from newest to oldest.

---

### Save One Country

```http
POST /api/save-one-country
```

Adds a country to the saved countries table.

#### Request Body

```json
{
  "country_name": "Ireland"
}
```

If the country has already been saved, PostgreSQL prevents a duplicate from being inserted.

---

### Get All Saved Countries

```http
GET /api/get-all-saved-countries
```

Returns all countries currently stored in the saved countries table.

---

### Update Country View Count

```http
POST /api/update-one-country-count
```

Creates or increments the view count for a country.

#### Request Body

```json
{
  "country_name": "Afghanistan"
}
```

#### Example Response

```json
{
  "country_count_id": 4,
  "country_name": "Afghanistan",
  "count": 14
}
```

---

### Unsave One Country

```http
POST /api/unsave-one-country
```

Removes a country from the saved countries table.

#### Request Body

```json
{
  "country_name": "Ireland"
}
```

---

## 🗄️ Database Schema

The application uses three PostgreSQL tables:

- `users`
- `saved_countries`
- `country_counts`

```sql
-- =====================
-- users
-- =====================

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  bio TEXT
);

INSERT INTO users (name, country_name, email, bio)
VALUES
  (
    'Carlotta Island',
    'Mexico',
    'carlotta@example.com',
    'Learning backend and APIs.'
  ),
  (
    'Naomi Island',
    'Brazil',
    'naomi@example.com',
    'Loves volleyball.'
  ),
  (
    'Nyla Island',
    'Ethiopia',
    'nyla@example.com',
    'Mommy cuddle bug.'
  );

-- =====================
-- saved_countries
-- =====================

CREATE TABLE saved_countries (
  saved_country_id SERIAL PRIMARY KEY,
  country_name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO saved_countries (country_name)
VALUES
  ('Ethiopia'),
  ('Brazil'),
  ('Mexico');

-- =====================
-- country_counts
-- =====================

CREATE TABLE country_counts (
  country_count_id SERIAL PRIMARY KEY,
  country_name VARCHAR(100) UNIQUE NOT NULL,
  count INTEGER NOT NULL DEFAULT 1
);

INSERT INTO country_counts (country_name, count)
VALUES
  ('Ethiopia', 1),
  ('Brazil', 1),
  ('Mexico', 1);
```

---

## 🔄 How the Application Works

The React frontend requests country information from an external countries API.

When a user performs an action involving saved data, the frontend sends a request to the Express backend.

```text
React frontend
      ↓
Netlify API redirect
      ↓
Express server on Render
      ↓
PostgreSQL database on Neon
```

For example, when a user opens a country detail page:

1. React gets the country name from the URL.
2. The matching country is found in the country data.
3. The frontend sends a `POST` request to the view-count endpoint.
4. Express receives the country name.
5. PostgreSQL creates a new row or increments the existing count.
6. The updated count is returned as JSON.
7. React stores the response in state and updates the UI.

---

## 💻 Running the Project Locally

### Clone the Repository

```bash
git clone https://github.com/lottamonet/countries-api-project-may-2026.git
```

```bash
cd countries-api-project-may-2026
```

### Install Frontend Dependencies

```bash
cd version-4/client
npm install
```

### Start the Frontend

```bash
npm run dev
```

### Install Backend Dependencies

Open another terminal:

```bash
cd version-4/server
npm install
```

### Add the Database Environment Variable

Create a `.env` file inside the server directory:

```env
DATABASE_URL=your_postgresql_connection_string
```

Do not commit the `.env` file or expose the database connection string publicly.

### Start the Backend

```bash
npm run dev
```

or:

```bash
node src/index.js
```

---

## 💭 Reflections

### What I Learned

I learned how the frontend, backend, and database work together as separate parts of a full-stack application.

I also learned how to:

- Build API endpoints with Express
- Send `GET` and `POST` requests from React
- Use parameterized SQL queries
- Insert, select, update, and delete database records
- Use PostgreSQL’s `ON CONFLICT` feature
- Store API responses in React state
- Trigger UI updates after database changes
- Use environment variables to protect database credentials
- Deploy a frontend, backend, and database through separate hosting platforms
- Read browser Network requests and production server logs while debugging

### What I’m Proud Of

I am proud that I successfully expanded a frontend project into a working full-stack application.

My React app, Express server, and PostgreSQL database are hosted on three separate platforms, but they communicate successfully in production.

I am also proud that I tested every endpoint, confirmed that the data was being stored correctly, implemented a persistent view counter, and deployed the completed application.

### What Challenged Me

Deployment was the most challenging part of this project.

Some of the issues I worked through included:

- Updating the project after a country API became deprecated
- Resolving CORS and failed-fetch errors
- Configuring the Vite development proxy
- Setting up Netlify redirects
- Correcting Netlify base and publish directories
- Configuring Render’s build and start commands
- Connecting Render to Neon with an environment variable
- Debugging an incorrect database connection string
- Understanding why a free Render server may take time to wake up
- Making sure frontend routes worked after deployment

These challenges taught me to inspect the browser Network tab, read deployment logs, isolate each layer of the application, and follow the error back to its source instead of randomly changing code.

### Future Ideas

In the future, I would like to:

- Add user authentication
- Associate saved countries with individual users
- Allow users to edit their profiles
- Add confirmation messages after saving or removing a country
- Add loading animations and more detailed error messages
- Persist the selected light or dark theme
- Improve mobile responsiveness
- Add sorting by population or country name
- Add pagination or lazy loading
- Create a dedicated API documentation page
- Add automated frontend and backend tests

---

## 🙌 Credits & Shoutouts


- Phil and classmates for instruction, feedback, and support


---

## 👩🏽‍💻 Author

**Carlotta Island / LottaMonet**
