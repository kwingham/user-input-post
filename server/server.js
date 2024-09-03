import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "facts.json");

app.get("/", (request, response) => {
  response.json("You are looking at my root route. How roude.");
});

app.post("/fact", (request, response) => {
  const newFact = request.body;

  // Read existing file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Failed to read file:", err);
      return response.status(500).json({ message: "Failed to read file" });
    }

    let facts = [];

    if (data) {
      facts = JSON.parse(data);
    }

    facts.push(newFact);

    // Write updated data back to the file
    fs.writeFile(filePath, JSON.stringify(facts, null, 2), (err) => {
      if (err) {
        console.error("Failed to write file:", err);
        return response.status(500).json({ message: "Failed to save fact" });
      }

      console.log("Successfully saved to facts.json");
      response.json(newFact);
    });
  });
});

app.listen(8080, () => {
  console.log("App running on port 8080");
});
