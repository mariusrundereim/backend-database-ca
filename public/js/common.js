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

// Popular names
async function sqlQuery1() {
  try {
    window.location.href = "/animals?query=popular-names";
  } catch (error) {
    alert("Error fetching popular animal names");
  }
}

// Adoption details
async function sqlQuery2() {
  try {
    window.location.href = "/animals?query=adoption-details";
  } catch (error) {
    alert("Error fetching adoption details");
  }
}

// Animals by age
async function sqlQuery3() {
  try {
    window.location.href = "/animals?query=by-age";
  } catch (error) {
    alert("Error fetching animals by age");
  }
}

// Animals in date range
async function sqlQuery4() {
  const startDate = prompt("Enter start date (YYYY-MM-DD):", "2020-01-01");
  if (!startDate) return;

  const endDate = prompt("Enter end date (YYYY-MM-DD):", "2025-12-31");
  if (!endDate) return;

  try {
    window.location.href = `/animals?query=date-range&startDate=${startDate}&endDate=${endDate}`;
  } catch (error) {
    alert("Error fetching animals in date range");
  }
}

// Animals by size
async function sqlQuery5() {
  try {
    window.location.href = "/animals?query=by-size";
  } catch (error) {
    alert("Error fetching animals by size");
  }
}

// All animals
function allAnimals() {
  window.location.href = "/animals";
}
