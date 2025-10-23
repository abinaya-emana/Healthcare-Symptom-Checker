// Set the API URL to match the mock backend server
const API_URL = 'http://localhost:4000/api/symptoms'; 

/**
 * Submits symptoms to the backend for analysis.
 * @param {string} symptoms - The user's symptom description.
 * @returns {Promise<object>} The analysis result from the server.
 */
export async function submitSymptoms(symptoms) {
    // Note: The 'save' parameter from the original file is removed 
    // since we are using in-memory history for simplicity in this non-Canvas React app.
    
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
        // Attempt to read error details from the server response
        const errorData = await response.json().catch(() => ({})); 
        throw new Error(errorData.error?.message || `Failed to fetch results from server. HTTP Status: ${response.status}`);
    }

    // The server returns { result: { response: "JSON string..." } }
    return response.json(); 
}

// NOTE: fetchHistory is not implemented here as we are using in-memory state for history 
// in App.jsx to keep the complexity down for this isolated example.
