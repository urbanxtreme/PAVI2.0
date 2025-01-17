document.addEventListener("DOMContentLoaded", () => {
  const seasonalTips = {
    spring: [
      "Collect rainwater for garden use",
      "Check and repair winter pipe damage",
      "Install water-efficient irrigation systems",
    ],
    summer: [
      "Water lawn early morning or late evening",
      "Use drought-resistant plants",
      "Cover pool when not in use",
    ],
    fall: [
      "Insulate water pipes before winter",
      "Clean gutters to manage water flow",
      "Adjust watering schedule for cooler weather",
    ],
    winter: [
      "Prevent pipe freezing",
      "Fix indoor leaks",
      "Collect melted snow for indoor plants",
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
        <br><h3>${season.charAt(0).toUpperCase() + season.slice(1)} Tips</h3>
        <ul>
            ${seasonalTips[season].map((tip) => `<li>${tip}</li>`).join("")}
        </ul>
    `;
});

function logout() {
  localStorage.removeItem("user");
  window.location.href = "../loginsignup/index.html";
}
