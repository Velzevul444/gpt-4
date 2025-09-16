import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
	try {
		const { message } = req.body;

		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${OPENAI_API_KEY}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: "gpt-4o-mini", // исправлено на gpt-4o-mini
				messages: [{ role: "user", content: message }]
			})
		});

		const data = await response.json();

		// Добавляем проверку ошибок от OpenAI
		if (data.error) {
			console.error("OpenAI error:", data.error);
			return res.status(500).json({ error: "Ошибка OpenAI: " + data.error.message });
		}

		if (!data.choices || !data.choices[0]) {
			return res.status(500).json({ error: "Неверный формат ответа от OpenAI" });
		}

		res.json({ reply: data.choices[0].message.content });
	} catch (error) {
		console.error("Server error:", error);
		res.status(500).json({ error: "Ошибка при запросе к OpenAI" });
	}
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));