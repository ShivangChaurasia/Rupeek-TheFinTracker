const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
export async function getChatResponse(chatHistory, transactions, userProfile) {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
        console.error("DEBUG: VITE_GROQ_API_KEY is missing from environment.");
        throw new Error("Groq API key is missing. Please ensure VITE_GROQ_API_KEY is set in Vercel and you have redeployed without cache.");
    }


    const transactionSummary = transactions.map(t => ({
        category: t.category,
        amount: t.amount,
        type: t.type,
        date: t.date ? new Date(t.date).toLocaleDateString() : 'N/A'
    }));

    const systemPrompt = `
    You are a professional financial advisor AI for "Rupeek Fin Tracker". 
    
    User Profile:
    - Monthly Income: ${userProfile?.currency || '₹'}${userProfile?.monthlyIncome || 'Not Set'}
    - Current Currency: ${userProfile?.currency || '₹'}
    
    Current Transaction Context:
    ${JSON.stringify(transactionSummary, null, 2)}
    
    Your goals:
    1. Provide clear, understandable, and actionable financial advice.
    2. Use professional yet friendly language.
    3. EXCLUSIVELY use Markdown for formatting (bolding, lists, headers, and tables where appropriate).
    4. If the user asks for a summary, provide:
       - **Expense Breakdown**
       - **Top Spending Categories**
       - **Savings Opportunities**
    5. Always be honest but encouraging.
    6. Ensure your formatting is clean and easy to read on a mobile-responsive web page.
    `;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    ...chatHistory
                ],
                temperature: 0.7,
                max_tokens: 1536
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch insights from Groq');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
}

/**
 * OLD FUNCTION - kept for backward compatibility if needed, but updated to use the new logic internally.
 */
export async function getAIInsights(transactions, userProfile) {
    return getChatResponse([{ role: 'user', content: 'Give me a summary and insights based on my data.' }], transactions, userProfile);
}
