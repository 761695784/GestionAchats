document.addEventListener('DOMContentLoaded', (event) => {
    const planningForm = document.getElementById('planningForm');
    const datePicker = document.getElementById('datePicker');

    // Set the minimum date to today
    const today = new Date().toISOString().split('T')[0];
    datePicker.setAttribute('min', today);

    planningForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le rechargement de la page

        const selectedDate = new Date(datePicker.value);
        const todayDate = new Date();

        // Check if the selected date is today or in the future
        if (selectedDate >= todayDate) {
            const date = datePicker.value;

            if (date) {
                // Enregistrer les informations dans localStorage ou dans la base de données Firebase
                localStorage.setItem('plannedDate', date);

                // Rediriger vers la page ajout.html
                window.location.href = 'ajout.html';
            }
        } else {
            alert('Veuillez choisir une date d\'aujourd\'hui ou une date à venir.');
        }
    });
});

// Sidebar Toggle
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open-sidebar");
}

document.querySelector('.navbar-toggler').addEventListener('click', function() {
    toggleSidebar();
});