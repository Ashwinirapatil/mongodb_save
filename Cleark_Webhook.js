const express = require("express");
const bodyParser = require("body-parser");
const { Webhook } = require("@clerk/clerk-sdk-node");
const { saveUserToDatabase, updateUserInDatabase, deleteUserFromDatabase } = require("./databaseHelpers");

const app = express();
const PORT = 3000;

// Your Clerk Webhook secret
const WEBHOOK_SECRET = "your-clerk-webhook-secret";

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Webhook endpoint
app.post("/webhook/clerk", async (req, res) => {
    const signature = req.headers["clerk-signature"];

    try {
        // Verify the webhook payload
        const event = Webhook.verify(req.body, signature, WEBHOOK_SECRET);

        // Handle the event
        switch (event.type) {
            case "user.created":
                console.log("User created:", event.data);
                await saveUserToDatabase(event.data); // Save to MongoDB
                break;
            case "user.updated":
                console.log("User updated:", event.data);
                await updateUserInDatabase(event.data); // Update MongoDB record
                break;
            case "user.deleted":
                console.log("User deleted:", event.data);
                await deleteUserFromDatabase(event.data.id); // Delete from MongoDB
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).send("Webhook received");
    } catch (error) {
        console.error("Webhook verification failed:", error);
        res.status(400).send("Invalid signature");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
