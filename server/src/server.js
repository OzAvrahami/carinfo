import app from "./app.js";

const PORT = Number(process.env.PORT || 3001);

app.listen(PORT, "0.0.0.0", (error) => {
    if (error) {
        console.error("Failed to start server:", error.message);
        process.exitCode = 1;
        return;
    }

    console.log(`CarInfo server is listening on port ${PORT}`);
});