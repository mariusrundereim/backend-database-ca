async function populateDatabase() {
  try {
    const response = await fetch("/api/populate-database", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.ok) {
      alert("Database populated successfully!");
    } else {
      alert("Error populating database: " + result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error populating database. Check console for details.");
  }
}
