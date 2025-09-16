const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender) {
	const message = document.createElement("div");
	message.classList.add("message", sender);
	message.textContent = text;
	chatWindow.appendChild(message);
	chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function botResponse(userText) {
	addMessage("...", "bot"); // индикатор загрузки

	try {
		const response = await fetch("http://localhost:3000/chat", {			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: userText })
		});

		const data = await response.json();

		chatWindow.lastChild.remove();
		addMessage(data.reply, "bot");
	} catch (error) {
		chatWindow.lastChild.remove();
		addMessage("Ошибка: не удалось получить ответ", "bot");
	}
}

sendBtn.addEventListener("click", () => {
	const text = userInput.value.trim();
	if (text !== "") {
		addMessage(text, "user");
		botResponse(text);
		userInput.value = "";
	}
});

userInput.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		sendBtn.click();
	}
});