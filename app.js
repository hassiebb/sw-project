const express = require("express");
const bodyParser = require("body-parser");
const sql = require("msnodesqlv8");
const app = express();
const path = require("path");

const port = 3000;
function isValidUser(username, password) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM login
      WHERE email = '${username}' AND password = '${password}';
    `;
    sql.query(connectionString, query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.length > 0);
      }
    });
  });
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));

const connectionString =
  "server=DESKTOP-BPQEBVP;Database=pet_adoption;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";

// Handle Adoption Applications
app.post("/adoption", (req, res) => {
  const { first_name, last_name, email, home_type, pet_name, animal_type } = req.body;
  const fullName = `${first_name} ${last_name}`;

  // Use a unified adoption table for a cleaner schema
  const query = `INSERT INTO adoption (name, email, petName, reason) 
                 VALUES ('${fullName}', '${email}', '${pet_name}', '${home_type}');`;

  sql.query(connectionString, query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.sendFile(path.join(__dirname, "index.html"));
    }
  });
});

app.post("/login", (req, res) => {
  const { signInEmail, signInPassword } = req.body;

  // Your authentication logic goes here
  isValidUser(signInEmail, signInPassword)
    .then((userExists) => {
      if (userExists) {
        // User exists, redirect to home
        res.sendFile(path.join(__dirname, "index.html"));
      } else {
        // User not found, send an error message
        res.status(401).send("Wrong username or password");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  const query = `
    INSERT INTO login (name, email, password)
    VALUES ('${name}', '${email}', '${password}');
  `;
  sql.query(connectionString, query, (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    } else {
      // User registered successfully
      res.status(200);
      res.sendFile(path.join(__dirname, "sign in.html"));
    }
  });
});

app.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  var query = `insert into contact (name,email,subject,message) values ('${name}','${email}','${subject}','${message}');`;

  sql.query(connectionString, query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      //console.log("Data inserted successfully.");
      // res.status(200).send("Data inserted successfully!!");
      res.sendFile(path.join(__dirname, "index.html"));
    }
  });
});

// Wrap the SQL query in a promise for better handling of asynchronous operations

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
