const genAI = require('../config/gemini');

exports.chatWithYogi = async (req, res) => {
    try {
        const { message, history } = req.body;
        
        const systemInstruction = `
        You are Yogi, a friendly and concise career coach chatbot.
        Your primary function is to answer basic questions related to different job roles, skills required, and career paths.
        Keep answers concise (under 3 sentences) unless asked for a detailed explanation.
        If the user greets you, be warm and motivating.
        Never break character. You are an AI mentor, not a general assistant.
        `;

        const chatHistory = [
            {
                role: "user",
                parts: [{ text: systemInstruction }],
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am Yogi, ready to help." }],
            }
        ];

        if (history && Array.isArray(history)) {
            history.forEach(msg => {
                const mappedRole = msg.role === 'yogi' ? 'model' : 'user';
                const lastMessage = chatHistory[chatHistory.length - 1];
                
                if (lastMessage.role === mappedRole) {
                    lastMessage.parts[0].text += "\n" + msg.content;
                } else {
                    chatHistory.push({
                        role: mappedRole,
                        parts: [{ text: msg.content }]
                    });
                }
            });
        }

        let result;
        let attempt = 0;
        const maxAttempts = 3;
        
        while (attempt < maxAttempts) {
            try {
                // Trying a fallback sequence for the model
                const modelName = attempt < 2 ? "gemini-2.5-flash" : "gemini-2.0-flash";
                const currentModel = genAI.getGenerativeModel({ model: modelName });
                const chat = currentModel.startChat({ history: chatHistory });
                result = await chat.sendMessage(message);
                break;
            } catch (err) {
                attempt++;
                console.log(`⚠️ Gemini API Error on attempt ${attempt}:`, err.status || err.message);
                if (attempt >= maxAttempts) throw err;
                await new Promise(res => setTimeout(res, 2000));
            }
        }

        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ reply: "I'm having trouble connecting right now. Please try again later." });
    }
};
