const express = require("express");
// creating a simple instance of an express app (like a small web server)
const app = express();

// cross origin resource sharing
const cors = require("cors");
const axios = require('axios');

// list of domains that are ok to share requests from (blocked by default by browser)
const corsOptions = {
    origin: ["http://localhost:5173"],
};

function parseGitHubUrl(url) {
    const parts = url.replace('https://github.com/', '').split('/');
    return {
        owner: parts[0],
        repo: parts[1]
    };
} 

async function fetchRepoData(owner, repo) {
  const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
  return response.data;
}


// Fetches the file tree (contents) from a GitHub repo
async function fetchRepoFileTree(owner, repo) { 
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/`; // root directory
  const response = await axios.get(url);
  return response.data; // This will be an array of files/folders
}

// Downloads the raw content of a file
async function downloadFileContent(downloadURL) {
    const response = await axios.get(downloadURL);
    return response.data;
}

// applies it to all routes
app.use(cors(corsOptions));
app.use(express.json()); // Needed to parse JSON request bodies

// telling server what to do on get request on /api endpoint
app.get("/api", (req, res) => {
    res.json({"fruits": ["apple", "bruh", "banana", "kiwi"]});
});

app.post("/api/process-repo", async (req, res) => {
    const { repoUrl } = req.body; // short for const repoUrl = req.body.repoUrl;

    // parse owner and repo name
    const { owner, repo } = parseGitHubUrl(repoUrl);
    console.log("Extracted information from url: ", {owner, repo});
    
    
    // call github api and file structure
    try {
        const repoData = await fetchRepoData(owner, repo);

        const fileTree = await fetchRepoFileTree(owner, repo);

        // Filter to only 'file' type entries
        const files = fileTree.filter(item => item.type === 'file' && item.download_url);

        // For now, only grab first 5 files
        const filesToDownload = files.slice(0, 5);

        const downloadedFiles = [];

        for (const file of filesToDownload) {
        const content = await downloadFileContent(file.download_url);
        downloadedFiles.push({
            path: file.path,
            name: file.name,
            content
        });
        }

        res.json({repoData, downloadedFiles});
    } catch (error) {
        console.error("Failed to fetch repo data", error);
        res.status(500).json({ error: "Failed to fetch repo data" });
    }

    //res.json({ message: "Repo URL recieved!", repoUrl});
});

// listen for requests on port 8080
app.listen(8080, () => {
    console.log("Server started on port 8080")
})