document.addEventListener('DOMContentLoaded', () => {
    // Sample data - in a real app, this would come from a backend
    const weeklyData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Water Usage (Liters)',
            data: [45, 52, 38, 41, 44, 38, 40],
            backgroundColor: 'rgba(33, 150, 243, 0.2)',
            borderColor: 'rgba(33, 150, 243, 1)',
            borderWidth: 2,
            tension: 0.4
        }]
    };

    const ctx = document.getElementById('waterChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: weeklyData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Weekly Water Usage'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

function logout() {
    localStorage.removeItem('user');
    window.location.href = '../loginsignup/index.html';
}