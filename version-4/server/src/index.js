// ---------------------------------
// Boilerplate Code to Set Up Server
// ---------------------------------

// import Node modules
import express from "express";
import pg from "pg";


// connect to PostgreSQL database
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true, // use SSL encryption when connecting to the database
});

const app = express();

app.use(express.json());

const port = 3000;


// ---------------------------------
// Helper Functions
// ---------------------------------

// 1. Save form data to database
async function saveUserInfo(name, email, country_name, bio) {
    await db.query(
        "INSERT INTO users (name, email, country_name, bio) VALUES ($1, $2, $3, $4)",
        [name, email, country_name, bio]
    );
}


// 2. Retrieve newest user
async function getNewestUser() {
    const result = await db.query(
        "SELECT * FROM users ORDER BY user_id DESC LIMIT 1"
    );

    return result.rows;
}


// 3. Retrieve all users
async function getAllUsers() {
    const result = await db.query(
        "SELECT * FROM users ORDER BY user_id DESC"
    );

    return result.rows;
}


// 4. Save a country
async function saveCountry(country_name) {
    await db.query(
        `INSERT INTO saved_countries (country_name) 
        VALUES ($1)
        ON CONFLICT (country_name) DO NOTHING
        `,
        [country_name]
    );
}


// 5. Retrieve saved countries
async function fetchAllSavedCountries() {
    const result = await db.query(
        `SELECT * FROM saved_countries`
    );

    return result.rows;
}

// 6. Increment country view count
async function incrementCountryViewCount(country_name) {
  const result = await db.query(
    `
      INSERT INTO country_counts (country_name, count)
      VALUES ($1, 1)
      ON CONFLICT (country_name)
      DO UPDATE
      SET count = country_counts.count + 1
      RETURNING *;
    `,
    [country_name]
  );

  return result.rows[0];
}


// 7. Unsave a country
async function unsaveCountry(country_name) {
    await db.query(
        "DELETE FROM saved_countries WHERE country_name = $1",
        [country_name]
    );
}


// ---------------------------------
// API Endpoints
// ---------------------------------

// 1. Add one user
app.post("/api/add-one-user", async (req, res) => {
    const { name, email, country_name, bio } = req.body;

    if (!name || !email || !country_name) {
        return res.status(400).send("Missing required user information");
    }

    try {
        await saveUserInfo(name, email, country_name, bio);

        res.send(`User ${name} added successfully!`);

    } catch (error) {
        console.error(`Error adding user: ${name}`, error);
        res.send(`Error adding user: ${name}`);
    }
});


// 2. Get newest user
app.get("/api/get-newest-user", async (req, res) => {
    try {
        const users = await getNewestUser();

        res.json(users);

    } catch (error) {
        console.error("Error retrieving newest user:", error);
        res.send("Error retrieving newest user");
    }
});


// 3. Get all users
app.get("/api/get-all-users", async (req, res) => {
    try {
        const users = await getAllUsers();

        res.json(users);

    } catch (error) {
        console.error("Error retrieving all users:", error);
        res.send("Error retrieving all users");
    }
});


// 4. Save one country
app.post("/api/save-one-country", async (req, res) => {
    const { country_name } = req.body;

    if (!country_name) {
        return res.status(400).send("Country name required");
    }

    try {
        await saveCountry(country_name);

        res.send(`Country ${country_name} saved successfully!`);

    } catch (error) {
        console.error(`Error saving country: ${country_name}`, error);
        res.send(`Error saving country: ${country_name}`);
    }
});


// 5. Get all saved countries
app.get("/api/get-all-saved-countries", async (req, res) => {
    try {
        const countries = await fetchAllSavedCountries();

        res.json(countries);

    } catch (error) {
        console.error("Error retrieving saved countries:", error);
        res.send("Error retrieving saved countries");
    }
});


// 6. Update country view count
app.post("/api/update-one-country-count", async (req, res) => {
    const { country_name } = req.body;

    if (!country_name) {
        return res.status(400).send("Country name required");
    }
 console.log("COUNTRY RECEIVED:", country_name);

  try {
    const updatedCountry = await incrementCountryViewCount(country_name);

    console.log("UPDATED DATABASE ROW:", updatedCountry);

    res.status(200).json(updatedCountry);
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      error: "Could not update view count",
    });
  }
});


// 7. Unsave one country
app.post("/api/unsave-one-country", async (req, res) => {
    const { country_name } = req.body;

    if (!country_name) {
        return res.status(400).send("Country name required");
    }

    try {
        await unsaveCountry(country_name);

        res.send(`Country ${country_name} unsaved successfully!`);

    } catch (error) {
        console.error(`Error unsaving country: ${country_name}`, error);

        res.send(`Error unsaving country: ${country_name}`);
    }
});



// ---------------------------------
// Start Server
// ---------------------------------

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});