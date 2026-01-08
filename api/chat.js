export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: 'OpenAI API Key not configured on Vercel. Please add it to Environment Variables.'
        });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('Error in proxy:', error);
        return res.status(500).json({ error: 'Failed to communicate with OpenAI' });
    }
}
