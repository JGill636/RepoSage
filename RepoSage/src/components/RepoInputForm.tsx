import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const RepoInputForm = () => {
    const [repoUrl, setRepoUrl] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepoUrl(e.target.value); // update state when input changes
        console.log("Current repo URL:", e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() // stop page reload
        try {
            const response = await axios.post("http://localhost:8080/api/process-repo", {
                repoUrl, // send this as JSON in the request body
            })
            console.log(response.data)
        } catch (error) {
            console.error("Error Sending Repo URL:", error)
        }   
        
        
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="repoUrl">Enter GitHub Repo URL:</label>
            <input 
              type="text" 
              id="repoUrl" 
              value={repoUrl}
              onChange={handleChange}
            />
            <button type="submit">Submit</button>
        </form>

    )
}

export default RepoInputForm;