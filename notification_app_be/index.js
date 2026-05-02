require('dotenv').config({ path: '../.env' });
const express = require('express');
const { Log } = require('logging_middleware');

const app = express();
app.use(express.json());

const NOTIFICATIONS_API_URL = process.env.NOTIF_API_URL;
const AUTH_TOKEN = process.env.TOKEN;

const getWeight = (type) => {
    const t = type ? String(type).toLowerCase() : "";
    if (t.includes('placement')) return 3;
    if (t.includes('result')) return 2;
    if (t.includes('event')) return 1;
    return 0;
};

app.get('/api/priority-inbox', async (req, res) => {
    try {

        const n = parseInt(req.query.n) || 10;

        await Log("backend", "info", "handler", `Fetching top ${n} priority notifications`);

        const response = await fetch(NOTIFICATIONS_API_URL, {
            headers: {
                "Authorization": `Bearer ${AUTH_TOKEN}`
            }
        });

        if (!response.ok) {
            await Log("backend", "error", "service", `Failed to fetch from test server: ${response.status}`);
            return res.status(response.status).json({ error: "Failed to fetch notifications from evaluation server" });
        }

        const data = await response.json();

        const notifications = Array.isArray(data) ? data : (data.notifications || []);

        notifications.sort((a, b) => {
            //api will return Type
            const weightA = getWeight(a.Type || a.type);
            const weightB = getWeight(b.Type || b.type);

            if (weightA !== weightB) {
                return weightB - weightA; //so basically in descending order
            }

            // for equal weights, im sorting by recency
            //& the api returns the Timestamp
            const dateA = new Date(a.Timestamp || a.timestamp || 0).getTime();
            const dateB = new Date(b.Timestamp || b.timestamp || 0).getTime();
            return dateB - dateA;
        });

        //acc to question im slicing to get top n
        const priorityInbox = notifications.slice(0, n);

        res.json({
            message: `Priority Inbox - Top ${n}`,
            count: priorityInbox.length,
            data: priorityInbox
        });

    } catch (error) {
        await Log("backend", "fatal", "handler", `Internal server error: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Notification Priority Service is running on http://localhost:${process.env.PORT}`);
    Log("backend", "info", "handler", `Server started on port ${process.env.PORT}`);
});
