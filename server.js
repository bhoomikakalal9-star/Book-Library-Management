const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Book = require("./models/Book");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/booklibrary")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

app.get("/", (req, res) => {
  res.send("Book Library Management System Backend is running!");
});

app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

app.post("/api/books", async (req, res) => {
  try {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      status: "Available",
    });

    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: "Error adding book" });
  }
});

app.put("/api/books/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating book" });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book" });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});