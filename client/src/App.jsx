import { useState } from 'react';
import AddTemplateCard from './components/AddTemplateCard';
import SourceInput from './components/SourceInput';
import ResultsDisplay from './components/ResultsDisplay';


function App() {
  const [labels, setLabels] = useState([]);
  const [urls, setUrls] = useState([]);
  const [cards, setCards] = useState([]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="text-3xl font-bold text-blue-600">Tailwind is working!</h1>

      <h1>Course Comparison Dashboard</h1>
      <AddTemplateCard setLabels={setLabels} />
      <SourceInput urls={urls} setUrls={setUrls} labels={labels} setCards={setCards} />
      <ResultsDisplay cards={cards} />
    </div>
  );
}

export default App;
