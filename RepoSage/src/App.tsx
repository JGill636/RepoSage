import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import RepoInputForm from './components/RepoInputForm'

function App() {
  const [array, setArray] = useState([])

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api")
    setArray(response.data.fruits)
    console.log(response.data.fruits)
  }

  useEffect(() => {
    fetchAPI();
  }, [])

  return (
    <>
      <h1>Input Github URL here</h1>
      <RepoInputForm></RepoInputForm>
    </>
  )
}

export default App
