import { useState } from 'react';
import AddTemplateCard from './components/AddTemplateCard';
import SourceInput from './components/SourceInput';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  const [labels, setLabels] = useState([]);
  const [urls, setUrls] = useState([]);
  const [cards, setCards] = useState([]);
  const [activePanel, setActivePanel] = useState('labels');

  const handleSaveLabels = (newLabels) => {
    setLabels(newLabels);
    setActivePanel('links');
  };

  const handleAnalyze = async () => {
    try {
      const res = await fetch('http://localhost:3001/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls, labels }),
      });
      const data = await res.json();
      setCards(data.cards);
    } catch (err) {
      alert('❌ Failed to analyze');
    }
  };

  // ✅ RETURN STARTS HERE — INSIDE THE FUNCTION
  return (
    <div style={{ padding: '2rem' }}>
      {/* Top Control Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => setActivePanel((p) => (p === 'labels' ? null : 'labels'))}
            className={`px-4 py-2 rounded-xl font-medium ${
              activePanel === 'labels'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            1️⃣ Labels
          </button>
          <button
            onClick={() => setActivePanel((p) => (p === 'links' ? null : 'links'))}
            className={`px-4 py-2 rounded-xl font-medium ${
              activePanel === 'links'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            2️⃣ Links
          </button>
        </div>

        <button
          onClick={handleAnalyze}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold"
        >
          🔍 Analyze
        </button>
      </div>

      <div
  onClick={() => activePanel && setActivePanel(null)}
  className="space-y-6 px-2 py-4 min-h-screen flex flex-col"
  style={{ minHeight: '100vh' }}
>
        <div className="max-w-2xl" onClick={(e) => e.stopPropagation()}>
          {activePanel === 'labels' && (
            <AddTemplateCard onSave={handleSaveLabels} />
          )}
          {activePanel === 'links' && (
            <SourceInput
              urls={urls}
              setUrls={setUrls}
              labels={labels}
              setCards={setCards}
            />
          )}
        </div>

        <ResultsDisplay cards={cards} setCards={setCards} setUrls={setUrls} />
      </div>

    </div>
  );
}

export default App;
