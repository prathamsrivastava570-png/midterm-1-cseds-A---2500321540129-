const express=require("express");
const path=require("path");

const app=express();
const PORT=3000;

app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

let books=[
    {
        id:1,
        title:"The Alchemist",
        author:"Paulo Coelho",
        category:"Fiction",
    },
    {
        id:2,
        title:"Igniting minds",
        author:"Dr A.P.J Abdul kalam",
        category:"Non Fiction",

    },
    {
        id:3,
        title:"A brief history of time",
        author:"Stephen Hawking",
        category:"Science",


    }
]
let nextId=4;
function cleanBookData(body) {
  const { title, author, category } = body;
  const fields = [title, author, category];
  if (!fields.every((f) => typeof f === "string" && f.trim() !== "")) {
    return null;
  }
  return {
    title: title.trim(),
    author: author.trim(),
    category: category.trim(),
  };
}

app.get("/api/books", (req, res) => {
  res.json(books);
});

app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

app.post("/api/books", (req, res) => {
  const data = cleanBookData(req.body);
  if (!data) {
    return res.status(400).json({ error: "title, author and category must be non-empty text" });
  }
  const book = { id: nextId++, ...data };
  books.push(book);
  res.status(201).json(book);
});

app.put("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });

  const data = cleanBookData(req.body);
  if (!data) {
    return res.status(400).json({ error: "title, author and category must be non-empty text" });
  }
  book.title = data.title;
  book.author = data.author;
  book.category = data.category;
  res.json(book);
});

app.delete("/api/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Book not found" });
  books.splice(index, 1);
  res.json({ message: "Book deleted" });
});
// "/" kh
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "practical.html"));
});

app.listen(PORT, () => {
  console.log(`Library running at http://localhost:${PORT}`);
});




