document.addEventListener('DOMContentLoaded', () => {
    // Achievement data
    const achievements = [
        {
            id: 1,
            type: 'bronze',
            icon: 'fa-medal',
            title: '5% Energy Saver',
            description: 'Reduced energy consumption by 5% this month',
            date: '2025-01-10'
        },
        {
            id: 2,
            type: 'silver',
            icon: 'fa-award',
            title: 'Conservation Champion',
            description: 'Maintained below average usage for 3 months',
            date: '2025-01-15'
        },
        {
            id: 3,
            type: 'gold',
            icon: 'fa-trophy',
            title: 'Master Conservator',
            description: 'Achieved 20% reduction in annual consumption',
            date: '2025-01-16'
        }
    ];

    // Room data with consumption metrics
    const roomsData = [
        {
            name: 'Living Room',
            icon: 'fa-couch',
            devices: [
                { name: 'Smart TV', status: 'active', consumption: 120 },
                { name: 'AC', status: 'inactive', consumption: 0 },
                { name: 'Smart Lights', status: 'active', consumption: 30 }
            ]
        },
        {
            name: 'Kitchen',
            icon: 'fa-kitchen-set',
            devices: [
                { name: 'Refrigerator', status: 'active', consumption: 150 },
                { name: 'Microwave', status: 'inactive', consumption: 0 },
                { name: 'Smart Lights', status: 'active', consumption: 25 }
            ]
        },
        {
            name: 'Bedroom',
            icon: 'fa-bed',
            devices: [
                { name: 'AC', status: 'active', consumption: 200 },
                { name: 'Smart Lights', status: 'active', consumption: 20 },
                { name: 'Air Purifier', status: 'inactive', consumption: 0 }
            ]
        }
    ];

    // Bill data with 6-month history and predictions
    const billData = {
        water: {
            current: 45.20,
            estimated: 48.50,
            history: [
                { month: 'Aug', amount: 42.30 },
                { month: 'Sep', amount: 43.80 },
                { month: 'Oct', amount: 44.50 },
                { month: 'Nov', amount: 45.20 },
                { month: 'Dec', amount: 45.90 },
                { month: 'Jan', amount: 46.50 }
            ],
            prediction: [
                { month: 'Feb', amount: 48.50 },
                { month: 'Mar', amount: 47.80 }
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
                { month: 'Dec', amount: 119.90 },
                { month: 'Jan', amount: 118.50 }
            ],
            prediction: [
                { month: 'Feb', amount: 115.30 },
                { month: 'Mar', amount: 114.50 }
            ]
        }
    };

    let currentBillChart = null;

    // Initialize all components
    initializeRooms();
    setupBillModals();
    initializeNotifications();
    initializeAchievements();

    // Achievement Functions
    function initializeAchievements() {
        const achievementsGrid = document.getElementById('achievementsGrid');
        achievementsGrid.innerHTML = '';
        
        achievements.forEach(achievement => {
            const achievementElement = createAchievementElement(achievement);
            achievementsGrid.appendChild(achievementElement);
        });
    }

    function createAchievementElement(achievement) {
        const achievementDiv = document.createElement('div');
        achievementDiv.className = `achievement-card ${achievement.type}`;
        
        achievementDiv.innerHTML = `
            <div class="achievement-icon">
                <i class="fas ${achievement.icon}"></i>
            </div>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-date">Earned on ${achievement.date}</div>
        `;
        
        achievementDiv.onclick = () => showAchievementModal(achievement);
        return achievementDiv;
    }

    function showAchievementModal(achievement) {
        const modal = document.getElementById('achievementModal');
        const title = document.getElementById('achievementTitle');
        const description = document.getElementById('achievementDescription');
        const date = document.getElementById('achievementDate');
        const icon = document.querySelector('.achievement-modal .achievement-icon');
        
        title.textContent = achievement.title;
        description.textContent = achievement.description;
        date.textContent = `Earned on ${achievement.date}`;
        icon.innerHTML = `<i class="fas ${achievement.icon}"></i>`;
        icon.className = `achievement-icon ${achievement.type}`;
        
        modal.style.display = 'block';
    }

    // Room Management Functions
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
                        <div>
                            <span>${device.name}</span>
                            <div class="device-status ${device.status}">
                                ${device.status === 'active' ? '● Online' : '○ Offline'}
                            </div>
                            ${device.status === 'active' ? 
                                `<div class="device-consumption">Current usage: ${device.consumption}W</div>` 
                                : ''} 
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
        
        return roomDiv;
    }

    // Bill Modal Functions
    function setupBillModals() {
        const modal = document.getElementById('billModal');
        const waterBillBtn = document.getElementById('showWaterBill');
        const electricityBillBtn = document.getElementById('showElectricityBill');
        const closeBtn = document.querySelector('.close-modal');
        const achievementModalClose = document.querySelector('#achievementModal .close-modal');

        waterBillBtn.onclick = () => showBillModal('water');
        electricityBillBtn.onclick = () => showBillModal('electricity');
        closeBtn.onclick = () => modal.style.display = 'none';
        achievementModalClose.onclick = () => {
            document.getElementById('achievementModal').style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
            if (event.target === document.getElementById('achievementModal')) {
                document.getElementById('achievementModal').style.display = 'none';
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
        
        modalTitle.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Bill Details`;
        currentAmount.textContent = `$${data.current.toFixed(2)}`;
        estimatedAmount.textContent = `$${data.estimated.toFixed(2)}`;
        currentPeriod.textContent = 'January 2025';
        estimatedPeriod.textContent = 'February 2025';

        createBillGraph(data.history, data.prediction, type);

        modal.style.display = 'block';
    }

    function createBillGraph(history, prediction, type) {
        const ctx = document.getElementById('billGraph').getContext('2d');
        
        if (currentBillChart) {
            currentBillChart.destroy();
        }

        const labels = [...history.map(item => item.month), ...prediction.map(item => item.month)];
        const historicalData = history.map(item => item.amount);
        const predictionData = Array(history.length).fill(null).concat(prediction.map(item => item.amount));

        const gradientHistorical = ctx.createLinearGradient(0, 0, 0, 300);
        gradientHistorical.addColorStop(0, 'rgba(51, 102, 204, 0.2)');
        gradientHistorical.addColorStop(1, 'rgba(51, 102, 204, 0)');

        const gradientPrediction = ctx.createLinearGradient(0, 0, 0, 300);
        gradientPrediction.addColorStop(0, 'rgba(255, 107, 107, 0.2)');
        gradientPrediction.addColorStop(1, 'rgba(255, 107, 107, 0)');

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
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
                            }
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Amount ($)'
                        }
                    }
                }
            }
        });
    }

    // Notification System
    function initializeNotifications() {
        const notificationBar = document.getElementById('notificationBar');
        const notificationText = document.getElementById('notificationText');

        const notifications = [
            'Living Room AC has been running for 8 hours',
            'Kitchen Coffee Maker was left on',
            'Bedroom Air Purifier needs filter replacement',
            'Water usage is 15% higher than usual',
            'Energy saving mode activated in Living Room',
            'New achievement unlocked: Energy Saver!'
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

        setTimeout(showNextNotification, 1000);
        setInterval(showNextNotification, 6000);
    }

    // Profile Picture Upload
    const uploadProfilePic = document.getElementById('uploadProfilePic');
    if (uploadProfilePic) {
        uploadProfilePic.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('profilePic').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
