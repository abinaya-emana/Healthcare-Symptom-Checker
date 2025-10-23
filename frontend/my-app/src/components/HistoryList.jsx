import React from 'react';

export default function HistoryList({ items, onReplay }) {
  
  const sortedItems = [...items].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return (
    <div className="history">
      <h4>Recent Checks</h4>
      {items.length === 0 && <p>No history yet.</p>}
      <ul>
        {sortedItems.map(item => (
          <li key={item.id}>
            <div className="hist-top">
              <small>{new Date(item.timestamp).toLocaleString()}</small>
              <button onClick={() => onReplay(item.symptoms)}>Use</button>
            </div>
            <div className="hist-body">
              {item.symptoms.slice(0, 120)}
              {item.symptoms.length > 120 && '...'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
