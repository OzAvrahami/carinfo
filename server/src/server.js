import app from "./app.js";

const PORT = 3001;

app.listen(PORT, (error) => {
    if (error) {
        console.error("Failed to start server:", error.message);
        process.exitCode = 1;
        return;
    }

    console.log("CarInfo API is running at https://localhost:" + PORT);
});