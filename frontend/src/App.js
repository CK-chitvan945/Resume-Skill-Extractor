import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Upload a file");

    const formData = new FormData();
    formData.append("resume", file);
    setLoading(true);

    try {
      //const res = await axios.post("http://localhost:8000/extract", formData);
      const res = await axios.post("resume-skill-extractor-production-66dd.up.railway.app/extract", formData);
      setSkills(res.data.skills);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Resume Skill Extractor</h1>
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Extracting..." : "Upload and Extract"}
      </button>

      <div className="results">
        {skills.map((skill, i) => (
          <span key={i} className="tag">{skill}</span>
        ))}
      </div>
    </div>
  );
}

export default App;
