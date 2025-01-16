document.addEventListener('DOMContentLoaded', () => {
    // Sample data - In real application, this would come from your backend
    const roomsData = [
        {
            name: 'Living Room',
            icon: 'fa-couch',
            devices: [
                { name: 'Smart TV', status: 'active' },
                { name: 'AC', status: 'inactive' },
                { name: 'Smart Lights', status: 'active' }
            ]
        },
        {
            name: 'Kitchen',
            icon: 'fa-kitchen-set',
            devices: [
                { name: 'Refrigerator', status: 'active' },
                { name: 'Microwave', status: 'inactive' },
                { name: 'Coffee Maker', status: 'active' }
            ]
        },
        {
            name: 'Bedroom',
            icon: 'fa-bed',
            devices: [
                { name: 'AC', status: 'active' },
                { name: 'Smart Lights', status: 'active' },
                { name: 'Air Purifier', status: 'inactive' }
            ]
        }
    ];

    // Bill data - In real application, this would come from your backend
    const billData = {
        water: {
            current: 45.20,
            estimated: 48.50,
            history: [
                { month: 'Aug', amount: 42.30 },
                { month: 'Sep', amount: 43.80 },
                { month: 'Oct', amount: 44.50 },
                { month: 'Nov', amount: 45.20 },
                { month: 'Dec', amount: 45.90 }
            ],
            prediction: [
                { month: 'Jan', amount: 48.50 },
                { month: 'Feb', amount: 47.80 }
            ]
        },
        electricity: {
            current: 120.80,
            estimated: 115.30,
            history: [
                { month: 'Aug', amount: 118.20 },
                { month: 'Sep', amount: 119.40 },
                { month: 'Oct', amount: 120.10 },
                { month: 'Nov', amount: 120.80 },
                { month: 'Dec', amount: 119.90 }
            ],
            prediction: [
                { month: 'Jan', amount: 115.30 },
                { month: 'Feb', amount: 114.50 }
            ]
        }
    };

    let currentBillChart = null;

    // Initialize rooms
    initializeRooms();

    // Setup bill modals
    setupBillModals();

    // Start notification system
    initializeNotifications();

    function initializeRooms() {
        const roomsGrid = document.getElementById('roomsGrid');
        roomsGrid.innerHTML = '';
        roomsData.forEach(room => {
            const roomElement = createRoomElement(room);
            roomsGrid.appendChild(roomElement);
        });
    }

    function createRoomElement(room) {
        const roomDiv = document.createElement('div');
        roomDiv.className = 'room-card';
        
        roomDiv.innerHTML = `
            <h3><i class="fas ${room.icon}"></i> ${room.name}</h3>
            <ul class="device-list">
                ${room.devices.map(device => `
                    <li>
                        <span>${device.name}</span>
                        <span class="device-status ${device.status}">
                            ${device.status === 'active' ? '● Online' : '○ Offline'}
                        </span>
                    </li>
                `).join('')}
            </ul>
        `;
        
        return roomDiv;
    }
    function previewImage(event) {
        const input = event.target;
        const previewImageElement = document.getElementById('previewImage');
    
        if (input.files && input.files[0]) {
            const fileReader = new FileReader();
    
            fileReader.onload = function (e) {
                previewImageElement.src = e.target.result;
                previewImageElement.style.display = 'block'; // Show the image
            };
    
            fileReader.readAsDataURL(input.files[0]);
        } else {
            previewImageElement.src = '';
            previewImageElement.style.display = 'none'; // Hide the image if no file is selected
        }
    }
    

    // Initialize image preview functionality
    previewImage();
    function setupBillModals() {
        const modal = document.getElementById('billModal');
        const waterBillBtn = document.getElementById('showWaterBill');
        const electricityBillBtn = document.getElementById('showElectricityBill');
        const closeBtn = document.querySelector('.close-modal');

        waterBillBtn.onclick = () => showBillModal('water');
        electricityBillBtn.onclick = () => showBillModal('electricity');
        closeBtn.onclick = () => modal.style.display = 'none';

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    function showBillModal(type) {
        const modal = document.getElementById('billModal');
        const modalTitle = document.getElementById('modalTitle');
        const currentAmount = document.getElementById('currentBillAmount');
        const estimatedAmount = document.getElementById('estimatedBillAmount');
        const currentPeriod = document.getElementById('currentBillPeriod');
        const estimatedPeriod = document.getElementById('estimatedBillPeriod');

        const data = billData[type];
        
        // Update modal content
        modalTitle.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Bill Details`;
        currentAmount.textContent = `$${data.current.toFixed(2)}`;
        estimatedAmount.textContent = `$${data.estimated.toFixed(2)}`;
        currentPeriod.textContent = 'December 2024';
        estimatedPeriod.textContent = 'January 2025';

        // Create or update the graph
        createBillGraph(data.history, data.prediction, type);

        modal.style.display = 'block';
    }

    function createBillGraph(history, prediction, type) {
        const ctx = document.getElementById('billGraph').getContext('2d');
        
        // Destroy existing chart if it exists
        if (currentBillChart) {
            currentBillChart.destroy();
        }

        // Prepare data for the chart
        const labels = [...history.map(item => item.month), ...prediction.map(item => item.month)];
        const historicalData = history.map(item => item.amount);
        const predictionData = Array(history.length).fill(null).concat(prediction.map(item => item.amount));

        // Create gradient for historical data
        const gradientHistorical = ctx.createLinearGradient(0, 0, 0, 300);
        gradientHistorical.addColorStop(0, 'rgba(51, 102, 204, 0.2)');
        gradientHistorical.addColorStop(1, 'rgba(51, 102, 204, 0)');

        // Create gradient for prediction data
        const gradientPrediction = ctx.createLinearGradient(0, 0, 0, 300);
        gradientPrediction.addColorStop(0, 'rgba(255, 107, 107, 0.2)');
        gradientPrediction.addColorStop(1, 'rgba(255, 107, 107, 0)');

        // Create new chart
        currentBillChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Historical',
                        data: historicalData,
                        borderColor: '#3366CC',
                        backgroundColor: gradientHistorical,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Predicted',
                        data: predictionData,
                        borderColor: '#FF6B6B',
                        backgroundColor: gradientPrediction,
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${type.charAt(0).toUpperCase() + type.slice(1)} Usage Trend`,
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
                            }
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: '#ddd',
                        borderWidth: 1
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Amount ($)',
                            font: {
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                },
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear'
                    }
                }
            }
        });
    }

    function initializeNotifications() {
        const notificationBar = document.getElementById('notificationBar');
        const notificationText = document.getElementById('notificationText');

        // Sample notifications - would come from backend in real application
        const notifications = [
            'Living Room AC has been running for 8 hours',
            'Kitchen Coffee Maker was left on',
            'Bedroom Air Purifier needs filter replacement',
            'Water usage is 15% higher than usual',
            'Energy saving mode activated in Living Room'
        ];

        let currentNotification = 0;

        function showNextNotification() {
            notificationText.textContent = notifications[currentNotification];
            notificationBar.classList.add('show');

            setTimeout(() => {
                notificationBar.classList.remove('show');
            }, 5000);

            currentNotification = (currentNotification + 1) % notifications.length;
        }

        // Show first notification after a short delay
        setTimeout(showNextNotification, 1000);

        // Rotate notifications every 6 seconds
        setInterval(showNextNotification, 6000);
    }
});