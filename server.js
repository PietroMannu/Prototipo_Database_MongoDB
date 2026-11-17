require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const PORT = process.env.PORT || 5001;

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Salva (o aggiorna) un utente
app.post("/users", async (req, res) => {
    const { googleId, displayName, email } = req.body || {};

    // typeof string: blocca oggetti tipo {"$ne": null} (NoSQL injection)
    if (typeof googleId !== "string" || typeof email !== "string" || !googleId || !email) {
        return res.status(400).json({ message: "googleId ed email sono obbligatori." });
    }

    try {
        await User.findOneAndUpdate(
            { googleId },
            { displayName: String(displayName || ""), email, lastLogin: new Date() },
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        );
        res.json({ message: "Utente salvato." });
    } catch (err) {
        console.error("Errore salvataggio:", err.message);
        res.status(500).json({ message: "Errore interno del server." });
    }
});

// Legge tutti gli utenti
app.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-_id -__v").lean();
        res.json(users);
    } catch (err) {
        console.error("Errore lettura:", err.message);
        res.status(500).json({ message: "Errore interno del server." });
    }
});

mongoose
    .connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME || "prototipo" })
    .then(() => {
        console.log("Connesso a MongoDB (Mongoose)");
        app.listen(PORT, () => console.log(`Apri http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error("Errore di connessione:", err.message);
        process.exit(1);
    });
