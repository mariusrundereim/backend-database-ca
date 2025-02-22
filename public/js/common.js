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

/*

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
    const response = await fetch("/animals/popular-names");
    const data = await response.json();
    console.log("Popular names:", data);
    updateTable(data);
  } catch (error) {
    alert("Error fetching popular animal names");
  }
}

// Adoption details
async function sqlQuery2() {
  try {
    const response = await fetch("/animals/adoption-details");
    const data = await response.json();
    updateTable(data);
  } catch (error) {
    alert("Error fetching adoption details");
  }
}

// Animal by age

async function sqlQuery3() {
  try {
    const response = await fetch("/animals/by-age");
    const data = await response.json();
    updateTable(data);
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
    const response = await fetch(
      `/animals/in-date-range?startDate=${startDate}&endDate=${endDate}`
    );
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    updateTable(data);
  } catch (error) {
    alert("Error fetching animals in date range");
  }
}

// Animals by size

async function sqlQuery5() {
  try {
    const response = await fetch("/animals/by-size");
    const data = await response.json();
    alert(JSON.stringify(data, null, 2));
  } catch (error) {
    alert("Error fetching animals by size");
  }
}

// All animals

async function allAnimals() {
  location.reload();
}

function updateTable(data) {
  // Get table content area
  const tableContent = document.querySelector(".list-group");
  console.log("data:", data);

  // Keep the buttons and header rows
  const headerRows = Array.from(tableContent.children).slice(0, 2);

  // Clear current content
  tableContent.innerHTML = "";

  // Add back buttons and headers
  headerRows.forEach((row) => tableContent.appendChild(row));

  // Add data rows using the same EJS structure
  data.forEach((animal) => {
    const row = document.createElement("div");
    row.className = "row px-3 py-1 w-100";
    row.innerHTML = `
          <span class="col py-1 bg-light"> ${animal.Id} </span>
          <span class="col py-1 bg-light"> ${animal.Name} </span>
          <span class="col py-1 bg-light"> ${animal.Species} </span>
          <span class="col py-1 bg-light"> ${animal.Birthday} </span>
          <span class="col py-1 bg-light"> ${animal.Temperament} </span>
          <span class="col py-1 bg-light"> ${animal.Size} </span>
          <span class="col py-1 bg-light"> ${animal.Age} </span>
          <span class="col py-1 bg-light"> ${animal.Adopted} </span>
          <span class="col py-1 bg-light text-center">
              <button class="btn-sm btn-warning" onclick="adoptAnimal('${animal.Id}')">
                  Adopt
              </button>
              <button class="btn-sm btn-danger" onclick="deleteAnimal('${animal.Id}')">
                  Cancel Adoption
              </button>
          </span>
      `;
    tableContent.appendChild(row);
  });

  // Add horizontal line
  const hr = document.createElement("hr");
  tableContent.appendChild(hr);
}


*/
