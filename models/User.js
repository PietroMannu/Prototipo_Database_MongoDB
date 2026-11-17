const mongoose = require("mongoose");

// Lo schema descrive com'è fatto un utente e valida i dati prima di salvarli
const userSchema = new mongoose.Schema(
    {
        googleId:    { type: String, required: true, unique: true, trim: true },
        displayName: { type: String, default: "", trim: true },
        email:       { type: String, required: true, trim: true, lowercase: true },
        lastLogin:   { type: Date, default: Date.now }
    },
    { timestamps: true } // aggiunge in automatico createdAt e updatedAt
);

// Mongoose crea da solo la collezione "users" (nome del modello al plurale)
module.exports = mongoose.model("User", userSchema);