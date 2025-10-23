import React from 'react';
import './ResultCard.css';

export default function ResultCard({ result }) {
  if (!result || !result.response) return null;

  let data;
  let isJsonValid = true;

  try {
    data = JSON.parse(result.response);
  } catch (e) {
    isJsonValid = false;
  }

  // Fallback for plain text output
  if (!isJsonValid || (!data.conditions && !data.red_flags)) {
    const text = result.response;

    // Split by known section headers for structure
    const parts = text.split(/(?=Next Steps|Possible Conditions|Disclaimer)/gi);

    return (
      <div className="result-card clean-output">
        {parts.map((section, index) => {
          if (section.toLowerCase().includes("possible conditions")) {
            return (
              <div key={index} className="result-section conditions">
                <h2>Possible Conditions and Reasoning</h2>
                <pre>{section.replace(/Possible Conditions and Reasoning/gi, '').trim()}</pre>
              </div>
            );
          } else if (section.toLowerCase().includes("next steps")) {
            return (
              <div key={index} className="result-section next-steps">
                <h2>Next Steps</h2>
                <pre>{section.replace(/Next Steps/gi, '').trim()}</pre>
              </div>
            );
          } else if (section.toLowerCase().includes("disclaimer")) {
            return (
              <div key={index} className="disclaimer">
                {section.replace(/Disclaimer/gi, 'Disclaimer:').trim()}
              </div>
            );
          } else {
            return <pre key={index}>{section.trim()}</pre>;
          }
        })}
      </div>
    );
  }

  
  return (
    <div className="result-card">
      {data.conditions?.length > 0 && (
        <div className="result-section conditions">
          <h2>Possible Conditions and Reasoning</h2>
          <ul>
            {data.conditions.map((c, i) => (
              <li key={i}>
                <strong>{c.name}</strong> — {c.reasoning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.recommended_next_steps?.length > 0 && (
        <div className="result-section next-steps">
          <h2>Next Steps</h2>
          <ol>
            {data.recommended_next_steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}

      {data.red_flags?.length > 0 && (
        <div className="result-section red-flags">
          <h2>When to Seek Medical Attention</h2>
          <ul>
            {data.red_flags.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {data.disclaimer && (
        <div className="disclaimer">
          Disclaimer: {data.disclaimer}
        </div>
      )}
    </div>
  );
}
