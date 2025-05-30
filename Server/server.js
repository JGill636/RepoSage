const express = require("express");
// creating a simple instance of an express app (like a small web server)
const app = express();

// cross origin resource sharing
const cors = require("cors");

// list of domains that are ok to share requests from (blocked by default by browser)
const corsOptions = {
    origin: ["http://localhost:5173"],
};

// applies it to all routes
app.use(cors(corsOptions));
app.use(express.json()); // Needed to parse JSON request bodies

// telling server what to do on get request on /api endpoint
app.get("/api", (req, res) => {
    res.json({"fruits": ["apple", "bruh", "banana", "kiwi"]});
});

app.post("/api/process-repo", (req, res) => {
    const { repoUrl } = req.body; // short for const repoUrl = req.body.repoUrl;
    console.log("Recieved repo URL:", repoUrl);

    // call github api

    
    res.json({ message: "Repo URL recieved!", repoUrl});
});

// listen for requests on port 8080
app.listen(8080, () => {
    console.log("Server started on port 8080")
})