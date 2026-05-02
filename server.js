const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const logFile = path.join(__dirname, "visitors.log");
const backupFile = path.join(__dirname, "backup.log");
const server = http.createServer((req, res) => {
    const { url, method } = req;

    if (url === "/updateUser" && method === "GET") {
        const data = `Visitor at ${new Date().toISOString()}\n`;

        fs.appendFile(logFile, data, (err) => {
            if (err) console.log(err);
        });

        res.writeHead(200, { "Content-Type": "text/plain" });
        return res.end("Visitor added");
    }
    if (url === "/saveLog" && method === "GET") {
        if (!fs.existsSync(logFile)) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            return res.end("No log found");
        }
        const data = fs.readFileSync(logFile, "utf-8");
        res.writeHead(200, { "Content-Type": "text/plain" });
        return res.end(data);
    }

    if (url === "/backup" && method === "POST") {
        if (!fs.existsSync(logFile)) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            return res.end("No log to backup");
        }

        const data = fs.readFileSync(logFile);
        fs.writeFileSync(backupFile, data);

        res.writeHead(200, { "Content-Type": "text/plain" });
        return res.end("Backup created");
    }
    if (url === "/clearLog" && method === "GET") {
        fs.writeFileSync(logFile, "");
        res.writeHead(200, { "Content-Type": "text/plain" });
        return res.end("Log cleared");
    }
    if (url === "/serverInfo" && method === "GET") {
        const info = {
            platform: os.platform(),
            uptime: os.uptime(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem()
        };
        
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(info));
    }

    res.writeHead(404);
    res.end("Route not found");
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});