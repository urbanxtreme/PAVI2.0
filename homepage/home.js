// Chart initialization
const ctx = document.getElementById("waterChart").getContext("2d");
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, "rgba(37, 99, 235, 0.5)");
gradient.addColorStop(1, "rgba(37, 99, 235, 0.0)");

const data = {
  labels: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  datasets: [
    {
      label: "Water Usage (Liters)",
      data: [45, 59, 40, 55, 48, 65, 43],
      borderColor: "#2563eb",
      backgroundColor: gradient,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#ffffff",
      pointBorderColor: "#2563eb",
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: "#2563eb",
      pointHoverBorderColor: "#ffffff",
      pointHoverBorderWidth: 2,
    },
  ],
};

const waterChart = new Chart(ctx, {
  type: "line",
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value) {
            return value + " L";
          },
        },
      },
    },
  },
});

// Leak Report Functions
function showLeakReportModal() {
  document.getElementById("leakReportModal").style.display = "block";
}

function closeLeakReportModal() {
  document.getElementById("leakReportModal").style.display = "none";
  document.getElementById("leakReportForm").reset();
  document.getElementById("plumbersList").innerHTML = "";
}

function submitLeakReport(event) {
  event.preventDefault();

  const location = document.getElementById("location").value;
  const leakType = document.getElementById("leakType").value;
  const severity = document.getElementById("severity").value;
  const description = document.getElementById("description").value;

  // In a real application, you would send this data to your backend
  console.log("Leak Report:", {
    location,
    leakType,
    severity,
    description,
  });

  if (severity === "emergency") {
    findNearbyPlumbers(location);
  } else {
    alert(
      "Your leak report has been submitted successfully. We will process it and contact you shortly."
    );
    closeLeakReportModal();
  }
}

function findNearbyPlumbers(location) {
  // Simulate API call to find plumbers
  const mockPlumbers = [
    {
      id: 1,
      name: "Emergency Plumbing Services",
      rating: "4.9/5",
      distance: "0.8 miles",
      phone: "(555) 123-4567",
      available: true,
    },
    {
      id: 2,
      name: "Quick Fix Plumbing",
      rating: "4.8/5",
      distance: "1.2 miles",
      phone: "(555) 234-5678",
      available: true,
    },
    {
      id: 3,
      name: "24/7 Plumbers Co.",
      rating: "4.7/5",
      distance: "1.5 miles",
      phone: "(555) 345-6789",
      available: true,
    },
  ];

  displayPlumbers(mockPlumbers);
}

function displayPlumbers(plumbers) {
  const plumbersList = document.getElementById("plumbersList");
  plumbersList.innerHTML = "<h3>Available Emergency Plumbers:</h3>";

  plumbers.forEach((plumber) => {
    plumbersList.innerHTML += `
              <div class="plumber-card">
                  <div>
                      <h4>${plumber.name}</h4>
                      <p>Rating: ${plumber.rating}</p>
                      <p>Distance: ${plumber.distance}</p>
                      <p>Phone: ${plumber.phone}</p>
                  </div>
                  <button onclick="contactPlumber(${plumber.id})">Contact Now</button>
              </div>
          `;
  });
}

function contactPlumber(plumberId) {
  alert(
    `Connecting you to the plumber... They will contact you shortly.`
  );
}

// Tips Carousel Functions
let currentTipIndex = 0;
const tips = document.querySelectorAll(".tip-card");

function showTip(index) {
  tips.forEach((tip) => tip.classList.remove("active"));
  tips[index].classList.add("active");
}

function nextTip() {
  currentTipIndex = (currentTipIndex + 1) % tips.length;
  showTip(currentTipIndex);
}

function prevTip() {
  currentTipIndex = (currentTipIndex - 1 + tips.length) % tips.length;
  showTip(currentTipIndex);
}

// Utility Functions
function showSettings() {
  alert("Settings feature coming soon!");
}

function showFeedback() {
  const feedbackFormHtml = `
          <div class="feedback-modal">
              <div class="feedback-content">
                  <span class="close-btn" onclick="closeFeedbackForm()">&times;</span>
                  <h2>Feedback Form</h2>
                  <textarea id="feedback-text" rows="4" placeholder="Your feedback..."></textarea>
                  <button onclick="submitFeedback()">Submit</button>
              </div>
          </div>
      `;
  document.body.insertAdjacentHTML("beforeend", feedbackFormHtml);
  document.querySelector(".feedback-modal").style.display = "block";

  function closeFeedbackForm() {
    document.querySelector(".feedback-modal").remove();
  }

  function submitFeedback() {
    const feedback = document.getElementById("feedback-text").value;
    if (feedback.trim()) {
      alert("Thank you for your feedback!");
      closeFeedbackForm();
    } else {
      alert("Please enter your feedback before submitting.");
    }
  }
}

function downloadReport() {
  alert(
    "Preparing your water usage report...\nThis feature will be available soon!"
  );
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "../loginsignup/index.html";
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("leakReportModal");
  if (event.target == modal) {
    closeLeakReportModal();
  }
};

// Initialize tips carousel
setInterval(nextTip, 5000);