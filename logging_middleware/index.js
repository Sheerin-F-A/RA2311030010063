async function Log(stack, level, packageName, message) {
    const LOG_API_URL = process.env.URL;
    const AUTH_TOKEN = process.env.TOKEN;
    try {
        const response = await fetch(LOG_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${AUTH_TOKEN}`
            },
            body: JSON.stringify({
                "stack": stack,
                "level": level,
                "package": packageName,
                "message": message
            })
        });

        if (!response.ok) {
            console.error("Failed to have sent log to the evaluation server", response.status);
        }
    } catch (error) {
        console.error("There's been an error sending log:", error);
    }
}

module.exports = { Log };
