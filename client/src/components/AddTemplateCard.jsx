import { useState } from 'react';

function AddTemplateCard({ onSave }) {
  const [tempLabels, setTempLabels] = useState(['']);

  const updateLabel = (index, value) => {
    const updated = [...tempLabels];
    updated[index] = value;
    setTempLabels(updated);
  };

  const addField = () => setTempLabels([...tempLabels, '']);

  const saveTemplate = () => {
    const cleaned = tempLabels.map((l) => l.trim()).filter(Boolean);
    onSave(cleaned);
  };

  return (
    <div className="backdrop-blur-sm bg-white/80 shadow-inner p-6 rounded-2xl border border-gray-200 space-y-4" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-2xl font-semibold text-gray-900">1️⃣ Create Template</h2>

      <div className="space-y-2">
        {tempLabels.map((label, i) => (
          <input
            key={i}
            value={label}
            onChange={(e) => updateLabel(i, e.target.value)}
            placeholder={`Label ${i + 1}`}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white/60 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={addField}
          className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-gray-700 font-medium transition"
        >
          + Add Label
        </button>
        <button
          onClick={saveTemplate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default AddTemplateCard;
