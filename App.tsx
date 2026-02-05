import { useState } from "react";
import { getGeminiResponse } from "./services/geminiService";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    const result = await getGeminiResponse(prompt);
    setResponse(result);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vite + Gemini + Vercel</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Taip prompt..."
      />

      <button onClick={handleSubmit}>Hantar</button>

      <p><strong>Response:</strong> {response}</p>
    </div>
  );
}

export default App;
