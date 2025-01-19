document.addEventListener("DOMContentLoaded", () => {
  // Seasonal tips data
  const seasonalTips = {
    spring: [
      "Collect rainwater for garden use",
      "Check and repair winter pipe damage",
      "Install water-efficient irrigation systems",
      "Plant drought-resistant spring flowers",
      "Clean and maintain gutters for proper water flow",
    ],
    summer: [
      "Water lawn early morning or late evening",
      "Use drought-resistant plants",
      "Cover pool when not in use",
      "Use mulch in gardens to retain moisture",
      "Set up a rain barrel system",
    ],
    fall: [
      "Insulate water pipes before winter",
      "Clean gutters to manage water flow",
      "Adjust watering schedule for cooler weather",
      "Check for leaks before winter",
      "Drain and store garden hoses properly",
    ],
    winter: [
      "Prevent pipe freezing",
      "Fix indoor leaks promptly",
      "Collect melted snow for indoor plants",
      "Maintain optimal heating temperature",
      "Install pipe insulation where needed",
    ],
  };

  // Get current season
  const month = new Date().getMonth();
  let season;
  if (month >= 2 && month <= 4) season = "spring";
  else if (month >= 5 && month <= 7) season = "summer";
  else if (month >= 8 && month <= 10) season = "fall";
  else season = "winter";

  // Display seasonal tips
  const seasonalTipsList = document.getElementById("seasonalTipsList");
  seasonalTipsList.innerHTML = `
          <h3>${season.charAt(0).toUpperCase() + season.slice(1)} Tips</h3>
          <br><ul>
              ${seasonalTips[season].map((tip) => `<li>${tip}</li>`).join("")}
          </ul>
      `;

  // Initialize fact counter animation
  animateFactCounters();
});

// Animate fact counters
function animateFactCounters() {
  const factNumbers = document.querySelectorAll(".fact-number");

  factNumbers.forEach((number) => {
    const target = parseInt(number.getAttribute("data-target"));
    const increment = target / 50;
    let current = 0;

    const updateNumber = () => {
      if (current < target) {
        current += increment;
        number.textContent = Math.round(current);
        requestAnimationFrame(updateNumber);
      } else {
        number.textContent = target;
      }
    };

    updateNumber();
  });
}

// Water usage calculator
function calculateWaterUsage() {
  const showerTime = document.getElementById("showerTime").value;
  const showersPerWeek = document.getElementById("showersPerWeek").value;
  const waterPerMinute = 10; // Average shower uses 10 liters per minute

  const weeklyUsage = showerTime * showersPerWeek * waterPerMinute;
  const monthlyUsage = weeklyUsage * 4;
  const yearlyUsage = weeklyUsage * 52;

  const result = document.getElementById("calculationResult");
  result.style.display = "block";
  result.innerHTML = `
          <h3>Your Water Usage from Showers:</h3>
          <p>Weekly: ${weeklyUsage.toLocaleString()} liters</p>
          <p>Monthly: ${monthlyUsage.toLocaleString()} liters</p>
          <p>Yearly: ${yearlyUsage.toLocaleString()} liters</p>
          <p>By reducing your shower time by 2 minutes, you could save ${(
            2 *
            showersPerWeek *
            waterPerMinute *
            52
          ).toLocaleString()} liters per year!</p>
      `;
}

// Fact carousel
let currentSlide = 0;
const slides = document.querySelectorAll(".fact-slide");

function showSlide(index) {
  slides.forEach((slide) => slide.classList.remove("active"));
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

// Auto advance slides every 5 seconds
setInterval(nextSlide, 5000);

// Pledge functionality
function takePledge() {
  const modal = document.getElementById("pledgeModal");
  const pledgeText = document.getElementById("pledgeText");
  const confirmBtn = document.getElementById("confirmPledgeBtn");

  // Show modal
  modal.style.display = "flex";

  // Reset the animation
  pledgeText.style.animation = "none";
  pledgeText.offsetHeight; // Trigger reflow
  pledgeText.style.animation = "typing 4s steps(200) forwards";

  // Show confirm button after animation
  setTimeout(() => {
    confirmBtn.style.display = "block";
    confirmBtn.style.opacity = "0";
    confirmBtn.style.transform = "translateY(20px)";
    setTimeout(() => {
      confirmBtn.style.transition = "all 0.5s ease";
      confirmBtn.style.opacity = "1";
      confirmBtn.style.transform = "translateY(0)";
    }, 100);
  }, 4000);

  // Add event listener to confirm button
  confirmBtn.onclick = function () {
    const pledgeCount = localStorage.getItem("waterPledgeCount") || 0;
    localStorage.setItem("waterPledgeCount", parseInt(pledgeCount) + 1);

    // Hide modal with fade effect
    modal.style.transition = "opacity 0.3s ease";
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.style.display = "none";
      modal.style.opacity = "1";
      confirmBtn.style.display = "none";
      alert(
        "Thank you for taking the water conservation pledge! Together we can make a difference."
      );
    }, 300);
  };
}

// Logout functionality
function logout() {
  localStorage.removeItem("user");
  window.location.href = "../loginsignup/index.html";
}

// Placeholder functions for footer links
function showSettings() {
  alert("Settings page coming soon!");
}

function showFeedback() {
  alert("Feedback form coming soon!");
}
