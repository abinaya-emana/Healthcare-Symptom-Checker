import React, { useState, useEffect } from 'react';

export default function SymptomForm({ onSubmit, loading, initialSymptoms, onClear }) {
  const [text, setText] = useState(initialSymptoms || '');
  
  // Update local state when initialSymptoms prop changes (used for replaying history)
  useEffect(() => {
      setText(initialSymptoms || '');
  }, [initialSymptoms]);

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if (text.trim()) onSubmit(text); 
  };
  
  const handleClear = () => {
      setText('');
      if (onClear) onClear();
  };

  return (
    <form className="symptom-form" onSubmit={handleSubmit}>
      <label htmlFor="symptoms">Describe your symptoms (age, duration, severity):</label>
      <textarea 
          id="symptoms" 
          value={text} 
          onChange={e => setText(e.target.value)} 
          rows="6" 
          disabled={loading}
          placeholder="E.g., 35-year-old male with a fever of 101°F for 3 days, body aches, and persistent dry cough."
      />
      <div className="form-actions">
        <button 
            type="button" 
            onClick={handleClear}
            disabled={loading}
        >
            Clear
        </button>
        <button 
            type="submit" 
            disabled={loading || !text.trim()}
        >
            {loading ? 'Checking...' : 'Check Symptoms'}
        </button>
      </div>
    </form>
  );
}
