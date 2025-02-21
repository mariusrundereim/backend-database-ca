async function adoptAnimal(id) {
  try {
    const response = await fetch(`/animals/adopt/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    alert("Animal adopted successfully!");
    location.reload();
  } catch (error) {
    alert(error.message);
  }
}

async function deleteAnimal(id) {
  try {
    const response = await fetch(`/animals/cancel-adoption/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    alert("Adoption cancelled successfully!");
    location.reload();
  } catch (error) {
    alert(error.message);
  }
}

async function sqlQuery1() {
  try {
    const response = await fetch("/animals/popular-names");
    const data = await response.json();
    updateTable(data);
  } catch (error) {
    alert("Error fetching popular animal names");
  }
}

async function sqlQuery2() {
  try {
    const response = await fetch("/animals/adoption-details");
    const data = await response.json();
    updateTable(data);
  } catch (error) {
    alert("Error fetching adoption details");
  }
}

async function sqlQuery3() {
  try {
    const response = await fetch("/animals/by-age");
    const data = await response.json();
    updateTable(data);
  } catch (error) {
    alert("Error fetching animals by age");
  }
}

async function sqlQuery4() {
  const startDate = prompt("Enter start date (YYYY-MM-DD):");
  const endDate = prompt("Enter end date (YYYY-MM-DD):");

  if (!startDate || !endDate) return;

  try {
    const response = await fetch(
      `/animals/in-date-range?startDate=${startDate}&endDate=${endDate}`
    );
    const data = await response.json();
    updateTable(data);
  } catch (error) {
    alert("Error fetching animals in date range");
  }
}

async function sqlQuery5() {
  try {
    const response = await fetch("/animals/by-size");
    const data = await response.json();
    alert(JSON.stringify(data, null, 2));
  } catch (error) {
    alert("Error fetching animals by size");
  }
}

async function allAnimals() {
  location.reload();
}

function updateTable(data) {
  // Implementation will depend on your table structure
  // This is a placeholder for the table update logic
  console.log("Table data updated:", data);
  // You'll need to implement the actual DOM manipulation here
}
