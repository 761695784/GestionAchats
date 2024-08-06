import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getDatabase, ref, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyBHPaYRAkOE1VTo9hv3tkseUFnGfJkvtUo",
    authDomain: "gestionachats-1112.firebaseapp.com",
    projectId: "gestionachats-1112",
    storageBucket: "gestionachats-1112.appspot.com",
    messagingSenderId: "1014952416832",
    appId: "1:1014952416832:web:33fdda900d4ff03e9db1a5"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const planningTableBody = document.getElementById('planningTableBody');
const cartesContainer = document.getElementById('cartes-container');
const carteAchetes = document.getElementById('carte-achetes');
const carteNonAchetes = document.getElementById('carte-non-achetes');
const carteTousProduits = document.getElementById('carte-tous-produits');

let sommeAchetes = 0;
let sommeNonAchetes = 0;
let sommeTousProduits = 0;

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;
        fetchPlanningsFromFirebase(userId);
    } else {
        console.log("User is not authenticated");
    }
});

window.fetchPlanningsFromFirebase = (userId) => {
    const productsRef = ref(database, `users/${userId}/products`);
    onValue(productsRef, (snapshot) => {
        const plannings = snapshot.val();
        planningTableBody.innerHTML = '';
        if (plannings) {
            Object.keys(plannings).forEach(date => {
                const products = plannings[date];
                const productsList = Object.keys(products).map(key => products[key].name).join(', ');
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${date}</td>
                    <td>
                        <div class="btn-group" role="group">
                            <button class="btn btn-primary" onclick="viewPlanning('${date}')"><i class="fas fa-eye" id="viewProducts" title="Voir tous les produits"></i></button>
                            <button class="btn btn-danger" onclick="deleteDate('${date}')"><i class="fas fa-trash" title="Supprimer la date"></i></button>
                        </div>
                    </td>
                `;
                planningTableBody.appendChild(row);

                // Calculer les sommes pour cette date
                Object.keys(products).forEach(key => {
                    const product = products[key];
                    console.log('Product:', product); // Debug log
                    if (product.purchased) {
                        sommeAchetes += product.total;
                    } else {
                        sommeNonAchetes += product.total;
                    }
                    sommeTousProduits += product.total;
                });
            });

            // Mettre à jour les cartes
            carteAchetes.querySelector('p').textContent = `${sommeAchetes} FCFA`;
            carteNonAchetes.querySelector('p').textContent = `${sommeNonAchetes} FCFA`;
            carteTousProduits.querySelector('p').textContent = `${sommeTousProduits} FCFA`;

            console.log('Somme achetés:', sommeAchetes); // Debug log
            console.log('Somme non achetés:', sommeNonAchetes); // Debug log
            console.log('Somme tous produits:', sommeTousProduits); // Debug log

            // Afficher les cartes
            carteAchetes.style.display = 'block';
            carteNonAchetes.style.display = 'block';
            carteTousProduits.style.display = 'block';
        }

        // Animer les cartes
        animateCartes();
    });
};

window.deleteDate = (date) => {
    console.log(`Trying to delete date: ${date}`); // Debug log
    const userId = auth.currentUser.uid;
    const productsRef = ref(database, `users/${userId}/products/${date}`);
    remove(productsRef)
        .then(() => {
            console.log(`Date ${date} supprimée avec succès.`);
            // Mettre à jour le DOM
            fetchPlanningsFromFirebase(userId);
        })
        .catch((error) => {
            console.error("Erreur lors de la suppression de la date:", error);
        });
};

const animateCartes = () => {
    const cartesContainer = document.getElementById('cartes-container');
    const cartes = cartesContainer.children;
    let currentIndex = 0;

    setInterval(() => {
        const nextIndex = (currentIndex + 1) % cartes.length;
        const scrollAmount = cartes[nextIndex].offsetLeft;
        cartesContainer.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        currentIndex = nextIndex;
    }, 3000); // Change card every 3 seconds
};

window.viewPlanning = (date) => {
    console.log("viewPlanning called with date:", date);
    localStorage.setItem('plannedDate', date);
    window.location.href = 'Produit.html';
};

// Sidebar Toggle
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open-sidebar");
    document.getElementById("cartes-container").classList.toggle("hidden");
}

document.querySelector('.navbar-toggler').addEventListener('click', function () {
    toggleSidebar();
});

// Call animateCartes when DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    animateCartes();
});

document.getElementById('close-btn').addEventListener('click', toggleSidebar);
