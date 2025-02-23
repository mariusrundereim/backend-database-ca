const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Get day, month and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
  const year = date.getFullYear();

  // Return formatted date string
  return `${day}.${month}.${year}`;
};

module.exports = {
  formatDate,
};
