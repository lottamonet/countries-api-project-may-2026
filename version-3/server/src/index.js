// ---------------------------------
// Boilerplate Code to Set Up Server
// ---------------------------------

// import Node modules
import express from "express";
import pg from "pg"; // pg stands for PostgreSQL - connecting to database

// import configuration file
import config from "./config.js";

// connect to our PostgreSQL database, db for short
const db = new pg.Pool({
    connectionString: config.databaseUrl,
    ssl: true,
});

const app = express(); // creating an instance of the express module

app.use(express.json()); // This server will receive and respond in JSON format

const port = 3000; // Setting which port to listen to to receive requests

//defining our port, then turning on our server to listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// ---------------------------------
// Helper Functions
// ---------------------------------

//1. Create a helper function to save form data to the database- /add-one-user
async function saveUserInfo(name, email, country_name, bio) {
    await db.query(
        "INSERT INTO users (name, email, country_name, bio) VALUES ($1, $2, $3, $4)",
        [name, email, country_name, bio]
    );
}
//2. Create a helper function to retrieve the newest form data from the database -/get-newest-user
async function fetchUserInfo() {
    const result = await db.query(
        "SELECT * FROM users ORDER BY id DESC LIMIT 1"
    );
    return result.rows;
}   
//3. Create a helper function to save a country to the database -/save-one-country
async function saveCountry(country_name) {
    await db.query(
        "INSERT INTO saved_countries (country_name) VALUES ($1)",
        [country_name]
    );
}
//4. Create a helper function to retrieve all saved countries from the database -/get-all-saved-countries
async function fetchAllSavedCountries() {
    const result = await db.query("SELECT * FROM saved_countries");
    return result.rows;
}
//5. Create a helper function to increment the view count of a country in the database =-/update-one-country-count
async function incrementCountryViewCount(country_name, view_count) {
    await db.query(
        "INSERT INTO country_counts (country_name, view_count) VALUES ($1, $2) ON CONFLICT (country_name) DO UPDATE SET view_count = country_counts.view_count + 1 WHERE country_counts.country_name = $1",
        [country_name, view_count]
    );
}

// ---------------------------------
// API Endpoints
// ---------------------------------

//1. Create a POST endpoint to save form data to the database -/add-one-user
app.post("/api/add-one-user", async (req, res) => {
    const { name, email, country_name, bio } = req.body;
    try {
        await saveUserInfo(name, email, country_name, bio);
        res.send(`User ${name} added successfully!`);
    } catch (error) {
        console.error("Error adding user: ${name}", error);
        res.send("Error adding user: ${name}");
    }
});
//2. Create a GET endpoint to retrieve the newest form data from the database-/get-newest-user
app.get("/api/get-newest-user", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM users ORDER BY id DESC LIMIT 1"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error retrieving newest user:", error);
        res.send("Error retrieving newest user");
    }
});
//3. Create a POST endpoint to save a country to the database-/save-one-country
app.post("/api/save-one-country", async (req, res) => {
    const { country_name } = req.body;
    try {
        await saveCountry(country_name);    
        res.send(`Country ${country_name} saved successfully!`);
    } catch (error) {
        console.error("Error saving country: ${country_name}", error);
        res.send("Error saving country: ${country_name}");
    }
})
//4. Create a GET endpoint to retrieve all saved countries from the database-/get-all-saved-countries
app.get("/api/get-all-saved-countries", async (req, res) => {
    try {
        const result = await fetchAllSavedCountries();
        res.json(result);
    } catch (error) {
        console.error("Error retrieving saved countries:", error);
        res.send("Error retrieving saved countries");
    }
});
//5. Create a POST endpoint to increment the view count of a country in the database-/update-one-country-count
app.post("/api/update-one-country-count", async (req, res) => {
    const { country_name, view_count } = req.body;
    try {
        await incrementCountryViewCount(country_name, view_count); 
        res.send(`View count for ${country_name} updated successfully!`);
    } catch (error) {
        console.error("Error updating view count for country: ${country_name}", error);
        res.send("Error updating view count for country: ${country_name}"
        )
    }
});



// 🔷 Build API Endpoints for Form data
// POST /add-one-user: Save submitted form data
// GET /get-newest-user: Return the form data if it exists
// Test your API endpoints in Postman to make sure they're working
// Test your API endpoints with your frontend
// 🔷 Build API Endpoints for Saved Countries
// POST /save-one-country: Save a country
// GET /get-all-saved-countries: Return all saved countries
// Test your API endpoints in Postman to make sure they're working
// Test your API endpoints with your frontend
// 🔷 Build API Endpoint for Country Count
// POST /update-one-country-count: Increment the view count
// Test your API endpoint in Postman to make sure they're working
// Test your API endpoints with your frontend
