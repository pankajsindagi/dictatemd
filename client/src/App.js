import React, { useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const uploadDocument = async () => {
    try {
      const doc = { name, author, date, text };
      await axios.post("http://localhost:80/upload", doc);
      setAuthor("");
      setDate("");
      setText("");
      setName("");
      alert("Document uploaded successfully");
    } catch (error) {
      console.error("Error uploading document", error);
    }
  };

  const searchDocuments = async () => {
    try {
      const response = await axios.get(`http://localhost:80/search?q=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error("Error searching documents", error);
    }
  };

  const highlight = (text, highlight) => {
    // Split text on highlight term, include term itself into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark>{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div>
      <h1>Upload Document</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <textarea
        placeholder="Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={uploadDocument}>Upload</button>

      <h1>Search Documents</h1>
      <input
        type="text"
        placeholder="Search"
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchDocuments}>Search</button>

      {results.map((doc, index) => (
        <div key={index}>
          <h2>{highlight(doc.name, query)}</h2>
          <div>
            <span>
              by <b>{highlight(doc.author, query)} &nbsp;</b>
            </span>
            <span>
              on <i>{doc.date}</i>
            </span>
          </div>
          <p>{highlight(doc.text, query)}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
