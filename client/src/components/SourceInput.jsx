import { useState } from 'react';
import axios from 'axios';

function SourceInput({ urls, setUrls, labels, setCards }) {
  const [input, setInput] = useState('');

  const addUrl = () => {
    const trimmed = input.trim();
    if (trimmed) {
      setUrls([...urls, trimmed]);
      setInput('');
    }
  };

  const deleteUrl = (index) => {
    const updated = [...urls];
    updated.splice(index, 1);
    setUrls(updated);
  };

  const analyze = async () => {
    try {
      setCards([]); // Clear old cards
      const res = await axios.post('http://localhost:3001/analyze', {
        urls,
        labels,
      });
      setCards(res.data.cards);
    } catch (err) {
      alert('Failed to analyze');
    }
  };

  return (
    <div className="backdrop-blur-sm bg-white/80 shadow-inner p-6 rounded-2xl border border-gray-200 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">2️⃣ Add Website Links</h2>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a course URL"
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 shadow-sm bg-white/60 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addUrl}
          className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-gray-700 font-medium transition"
        >
          + Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {urls.map((url, i) => (
          <div
            key={i}
            className="bg-blue-100/70 text-blue-800 px-3 py-1.5 rounded-full flex items-center gap-2 max-w-full truncate"
          >
            <span className="truncate">{url}</span>
            <button
              onClick={() => deleteUrl(i)}
              className="hover:text-red-500 text-sm font-bold"
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {urls.length > 0 && (
        <button
          onClick={analyze}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl transition"
        >
          🔍 Analyze
        </button>
      )}
    </div>
  );
}

export default SourceInput;
