const prompt = require("prompt-sync")();
const bcrypt = require("bcrypt");
const sql = require("mssql");

const sqlConfig = {
  user: "sa",
  password: "@Bloodstrike11",
  database: "dbPP",
  server: "localhost",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function registerUser() {
  const username = prompt("Enter username: ").toLowerCase();
  const plainPassword = prompt("Enter password: ");
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    await sql.connect(sqlConfig);
    const request = new sql.Request();

    const insertUserQuery = `
      INSERT INTO users (username, password)
      VALUES (@username, @password);
    `;

    request.input("username", sql.NVarChar, username);
    request.input("password", sql.NVarChar, hashedPassword);

    await request.query(insertUserQuery);
    console.log("User registered successfully!");
  } catch (err) {
    console.error("Error registering user:", err);
  } finally {
    sql.close();
  }
}

registerUser();
