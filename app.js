const express = require("express");
const bodyParser = require("body-parser");
const sql = require("msnodesqlv8");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connectionString =
  "server=DESKTOP-BPQEBVP;Database=pet_adoption;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";

// Your SQL query logic goes here...
app.post("/submit", (req, res) => {
  const { name, email, address, petName, reason, petType } = req.body;

  var query;
  // SQL query to insert data into the 'pets' table
  switch (petType) {
    case "Cat":
      query = `insert into adoption (name,address,petName,email,reason) 
        values ('${name}','${address}','${petName}','${email}','${reason}');
        `;
      break;

    case "Dog":
      query = `insert into dogAdoption (name,address,petName,email,reason) 
        values ('${name}','${address}','${petName}','${email}','${reason}');
        `;
      break;
    case "Others":
      query = `insert into othersAdoption (name,address,petName,email,reason) 
        values ('${name}','${address}','${petName}','${email}','${reason}');
        `;
      break;

    default:
      break;
  }

  sql.query(connectionString, query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      //console.log("Data inserted successfully.");
      // res.status(200).send("Data inserted successfully!!");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
