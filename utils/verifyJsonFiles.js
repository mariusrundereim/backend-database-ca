const fs = require("fs").promises;
const path = require("path");

async function verifyJsonFiles() {
  const jsonFiles = [
    "species.json",
    "temperaments.json",
    "users.json",
    "animals.json",
    "animal_temperaments.json",
  ];

  const jsonDir = path.join(__dirname, "../public/json");

  for (const file of jsonFiles) {
    try {
      const filePath = path.join(jsonDir, file);
      console.log(`\nChecking ${file} at path: ${filePath}`);

      // Check if file exists
      try {
        await fs.access(filePath);
        console.log(`✓ File exists`);
      } catch {
        console.error(`✗ File does not exist`);
        continue;
      }

      // Read and parse content
      const content = await fs.readFile(filePath, "utf8");
      console.log("Content:", content);
      const parsed = JSON.parse(content.trim());
      console.log("Parsed successfully:", parsed);

      if (!parsed.query) {
        console.error(`✗ Missing 'query' property`);
      } else {
        console.log(`✓ Has 'query' property`);
      }
    } catch (error) {
      console.error(`Error with ${file}:`, error.message);
    }
  }
}

module.exports = verifyJsonFiles;
