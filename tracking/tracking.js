document.addEventListener("DOMContentLoaded", () => {
  const trackingForm = document.getElementById("waterTrackingForm");
  const entriesList = document.getElementById("entriesList");

  // Load existing entries
  loadEntries();

  trackingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const entry = {
      activity: e.target[0].value,
      amount: parseFloat(e.target[1].value),
      date: e.target[2].value,
      id: Date.now(),
    };

    saveEntry(entry);
    trackingForm.reset();
    loadEntries();
  });
});

function saveEntry(entry) {
  const entries = JSON.parse(localStorage.getItem("waterEntries") || "[]");
  entries.push(entry);
  localStorage.setItem("waterEntries", JSON.stringify(entries));
}

function loadEntries() {
  const entries = JSON.parse(localStorage.getItem("waterEntries") || "[]");
  const entriesList = document.getElementById("entriesList");

  entriesList.innerHTML = entries
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(
      (entry) => `
            <div class="entry-card">
                <h3>${entry.activity}</h3>
                <p>${entry.amount} Liters</p>
                <p>${new Date(entry.date).toLocaleDateString()}</p>
                <button onclick="deleteEntry(${entry.id})">Delete</button>
            </div>
        `
    )
    .join("");
}

function deleteEntry(id) {
  const entries = JSON.parse(localStorage.getItem("waterEntries") || "[]");
  const updatedEntries = entries.filter((entry) => entry.id !== id);
  localStorage.setItem("waterEntries", JSON.stringify(updatedEntries));
  loadEntries();
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "../loginsignup/index.html";
}
