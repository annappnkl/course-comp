import { useState } from 'react';
import axios from 'axios';

function ResultsDisplay({ cards }) {
  if (cards.length === 0) return null;

  return (
    <div className="backdrop-blur-sm bg-white/80 shadow-inner p-6 rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">3️⃣ Extracted Results</h2>

      <div className="space-y-6">
        {cards.map((card, i) => (
          <CardDisplay key={i} card={card} />
        ))}
      </div>
    </div>
  );
}

function CardDisplay({ card }) {
  const [values, setValues] = useState(card.values || {});
  const [usedSuggestions, setUsedSuggestions] = useState([]);

  const handleSuggestionClick = async (labelRaw) => {
    const label = labelRaw.trim(); // always clean it
  
    if (!label || usedSuggestions.includes(label)) return;
  
    console.log('🟦 Sending label:', label);
    console.log('🟩 Card.rawText exists?', typeof card.rawText === 'string' && card.rawText.length > 10);
  
    try {
      const res = await axios.post('http://localhost:3001/infer-label', {
        label,
        rawText: card.rawText,
      });
  
      setValues((prev) => ({
        ...prev,
        [label]: res.data.value || 'not found',
      }));
      setUsedSuggestions((prev) => [...prev, label]);
    } catch (err) {
      console.error('❌ Failed to fetch label:', err);
    }
  };
  

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-5 transition-all hover:shadow-lg">
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
            {card.suggested.map((label) => (
              <button
                key={label}
                onClick={() => handleSuggestionClick(label.trim())}
                disabled={usedSuggestions.includes(label)}
                className={`px-3 py-1 text-sm rounded-full border ${
                  usedSuggestions.includes(label)
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
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
