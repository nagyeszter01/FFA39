const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

const fagylaltokUtvonal = require("./routes/fagylaltok");

app.use(cors());
app.use(express.json());

app.get("/", function (keres, valasz) {
    valasz.send("A Fagyizó backend működik.");
});

app.use("/api", fagylaltokUtvonal);

app.listen(PORT, function () {
    console.log("A szerver elindult: http://localhost:" + PORT);
});