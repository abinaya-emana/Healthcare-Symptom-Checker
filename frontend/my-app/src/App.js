import React, { useState, useCallback } from 'react';
import SymptomForm from './components/SymptomForm';
import ResultCard from './components/ResultCard';
import HistoryList from './components/HistoryList';
import { submitSymptoms } from './api';

// Simple in-memory history counter for unique IDs
let historyIdCounter = 0; 

export default function App() {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    
    // --- History Management ---
    const addToHistory = useCallback((symptomText, resultData) => {
        const newEntry = {
            id: historyIdCounter++,
            symptoms: symptomText,
            timestamp: new Date().toISOString(),
            result: resultData, // Store the response for potential future use
        };
        // Prepend new entry to the history list
        setHistory(prevHistory => [newEntry, ...prevHistory]);
    }, []);

    const handleReplay = (historySymptomText) => {
        // 1. Set the form input with the historical symptom text
        setSymptoms(historySymptomText);
        // 2. Automatically re-run the analysis
        handleSymptomCheck(historySymptomText);
    };

    const handleClear = () => {
        setSymptoms('');
        setResult(null);
        setError('');
    };

    // --- API and Main Logic ---
    const handleSymptomCheck = async (symptomText) => {
        if (!symptomText || symptomText.trim().length < 5) {
            setError('Please enter a detailed symptom description.');
            return;
        }

        setSymptoms(symptomText);
        setLoading(true);
        setResult(null);
        setError('');

        try {
            // Call the API function from src/api.js
            const data = await submitSymptoms(symptomText);
            
            // The data structure returned is { result: { response: "JSON string" } }
            const finalResult = data.result; 
            setResult(finalResult);
            
            // Save successful check to history
            addToHistory(symptomText, finalResult);

        } catch (err) {
            console.error('API Error:', err);
            setError(`Error: ${err.message}. Ensure your backend server is running at http://localhost:4000.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Healthcare Symptom Checker 🤖</h1>
            <p className="disclaimer">⚠️ This is for educational purposes only and not a substitute for professional medical advice.</p>
            
            <SymptomForm 
                onSubmit={handleSymptomCheck} 
                loading={loading} 
                initialSymptoms={symptoms} 
                onClear={handleClear}
            />

            {loading && <div className="message" style={{backgroundColor: '#e3f2fd', color: '#007bff'}}>Analyzing symptoms...</div>}
            
            {error && <div className="message error-message">{error}</div>}

            {result && <ResultCard result={result} />}

            <HistoryList 
                items={history} 
                onReplay={handleReplay} 
            />
        </div>
    );
}
