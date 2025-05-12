import { useState } from 'react';
import axios from 'axios';

function ResultsDisplay({ cards , setCards, setUrls }) {
  if (cards.length === 0) return null;

  const handleDelete = (urlToDelete) => {
    setCards((prev) => prev.filter((c) => c.url !== urlToDelete));
    setUrls((prev) => prev.filter((u) => u !== urlToDelete));
  };

  return (
    <div className="backdrop-blur-sm bg-white/80 shadow-inner p-6 rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">3️⃣ Extracted Results</h2>

      <div className="space-y-6">
        {cards.map((card, i) => (
          <CardDisplay key={i} card={card} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

function CardDisplay({ card, onDelete }) {
  const [values, setValues] = useState(card.values || {});
  const [usedSuggestions, setUsedSuggestions] = useState([]);

  const handleSuggestionClick = async (labelRaw) => {
    const label = labelRaw.trim();
  
    if (!label || usedSuggestions.includes(label)) return;
  
    try {
      const res = await axios.post('http://localhost:3001/infer-label', {
        label,
        rawText: card.rawText,
      });
  
      const newValue = res.data.value || 'not found';
  
      setValues((prev) => ({
        ...prev,
        [label]: newValue,
      }));
  
      setUsedSuggestions((prev) => [...prev, label]);
    } catch (err) {
      console.error('❌ Failed to fetch label:', err);
    }
  };
  
  
  

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl shadow-md p-5 transition-all hover:shadow-lg">

      {/* 🗑 Delete button */}
      <button
        onClick={() => onDelete(card.url)}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600"
        title="Delete"
      >
        🗑
      </button>


      <p className="text-sm text-gray-500 mb-3 break-words">
        🔗 <a href={card.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">{card.url}</a>
      </p>

      <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2 font-mono">
        {Object.entries(values).map(([label, value]) => (
          <div key={label}>
            <strong>{label}:</strong> {value}
          </div>
        ))}
      </div>

      {card.suggested?.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600 mb-1">💡 Suggested labels:</p>
          <div className="flex flex-wrap gap-2">
          {card.suggested
            .filter((label) => !usedSuggestions.includes(label))
            .map((label) => (
              <button
                key={label}
                onClick={() => handleSuggestionClick(label)}
                className="px-3 py-1 text-sm rounded-full border bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                {label}
              </button>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsDisplay;
