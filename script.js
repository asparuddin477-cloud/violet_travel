document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add Icon Change functionality
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navbar.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
            // Make icon dark when menu is open on mobile
            icon.style.color = 'var(--primary-dark)';
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
            // Revert icon color based on scroll state
            if (window.scrollY > 50) {
                icon.style.color = 'var(--primary-dark)';
            } else {
                icon.style.color = 'var(--text-light)';
            }
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
            
            if (window.scrollY > 50) {
                icon.style.color = 'var(--primary-dark)';
            } else {
                icon.style.color = 'var(--text-light)';
            }
            
            // Set active class
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Sticky Header
    const header = document.getElementById('header');
    const menuIcon = menuToggle.querySelector('i');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            if(!navbar.classList.contains('active')) {
                menuIcon.style.color = 'var(--primary-dark)';
            }
        } else {
            header.classList.remove('scrolled');
            if(!navbar.classList.contains('active')) {
                menuIcon.style.color = 'var(--text-light)';
            }
        }
    });

    // Mock Flight Data for Kaltim
    const mockFlights = [
        { airline: 'Garuda Indonesia', flightCode: 'GA-502', from: 'CGK', to: 'BPN', depart: '08:00', arrive: '11:15', price: 'Rp 2.150.000' },
        { airline: 'Citilink', flightCode: 'QG-420', from: 'CGK', to: 'BPN', depart: '10:30', arrive: '13:45', price: 'Rp 1.450.000' },
        { airline: 'Batik Air', flightCode: 'ID-625', from: 'CGK', to: 'AAP', depart: '14:00', arrive: '17:20', price: 'Rp 1.850.000' },
        { airline: 'Lion Air', flightCode: 'JT-714', from: 'SUB', to: 'BPN', depart: '09:15', arrive: '11:45', price: 'Rp 1.150.000' },
        { airline: 'Garuda Indonesia', flightCode: 'GA-505', from: 'BPN', to: 'CGK', depart: '12:30', arrive: '13:45', price: 'Rp 2.250.000' },
        { airline: 'Citilink', flightCode: 'QG-421', from: 'BPN', to: 'CGK', depart: '15:00', arrive: '16:15', price: 'Rp 1.550.000' }
    ];

    const flightModal = document.getElementById('flight-modal');
    const closeModal = document.getElementById('close-modal');
    const flightList = document.getElementById('flight-list');
    const bookingForm = document.querySelector('.booking-form');

    // Handle Form Submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Generate HTML for flights
            flightList.innerHTML = '';
            mockFlights.forEach(flight => {
                const card = document.createElement('div');
                card.className = 'flight-card';
                card.innerHTML = `
                    <div class="flight-airline">
                        <strong>${flight.airline}</strong>
                        <span>${flight.flightCode}</span>
                    </div>
                    <div class="flight-time">
                        <div class="time">${flight.depart}</div>
                        <div class="route">
                            <span>${flight.from}</span>
                            <i class="fa-solid fa-plane"></i>
                            <span>${flight.to}</span>
                        </div>
                        <div class="time">${flight.arrive}</div>
                    </div>
                    <div class="flight-price-action">
                        <div class="price">${flight.price}</div>
                        <button type="button" class="btn btn-sm btn-primary">Pilih</button>
                    </div>
                `;
                flightList.appendChild(card);
            });

            // Show Modal
            flightModal.classList.add('active');
        });
    }

    // Close Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            flightModal.classList.remove('active');
        });
    }

    // Close Modal on Outside Click
    if (flightModal) {
        flightModal.addEventListener('click', (e) => {
            if (e.target === flightModal) {
                flightModal.classList.remove('active');
            }
        });
    }
});
