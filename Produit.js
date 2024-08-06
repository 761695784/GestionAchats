import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getDatabase, ref, get, remove, set } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js';
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

const productCards = document.getElementById('productCards');
const plannedDate = localStorage.getItem('plannedDate');

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;
        renderProductCards(userId);
    } else {
        console.log("User is not authenticated");
    }
});

const renderProductCards = (userId) => {
    const productsRef = ref(database, `users/${userId}/products/${plannedDate}`);
    get(productsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const products = snapshot.val();
                productCards.innerHTML = '';
                Object.keys(products).forEach(key => {
                    const product = products[key];
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card card m-2';
                    productCard.dataset.key = key;
                    if (product.purchased) {
                        productCard.classList.add('purchased');
                    }
                    productCard.innerHTML = `
                        <div class="card-body">
                            <p><strong>${product.name}</strong></p>
                            <p>Prix Unitaire = ${product.unitPrice} FCFA</p>
                            <p>Quantité = ${product.quantity}</p>
                            <p>Total = ${product.total} FCFA</p>
                            <p><input type="checkbox" class="purchase-checkbox" ${product.purchased ? 'checked' : ''}> Déjà acheté</p><br>
                            <div class="btn-group">
                                <button class="btn btn-warning btn-sm btn-edit"><i class="fas fa-edit"></i> </button>
                                <button class="btn btn-danger btn-sm btn-delete"><i class="fas fa-trash"></i> </button>
                             </div>
                        </div>
                    `;
                    productCard.querySelector('.purchase-checkbox').addEventListener('change', function () {
                        productCard.classList.toggle('purchased', this.checked);
                        updateProductPurchaseStatus(userId, key, this.checked);
                    });
                    productCard.querySelector('.btn-edit').addEventListener('click', function () {
                        editProduct(userId, key);
                    });
                    productCard.querySelector('.btn-delete').addEventListener('click', function () {
                        deleteProduct(userId, key);
                    });
                    productCards.appendChild(productCard);
                });
                updateSommes(snapshot);
            }
        });
};

const editProduct = (userId, key) => {
    const productsRef = ref(database, `users/${userId}/products/${plannedDate}/${key}`);
    get(productsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const product = snapshot.val();
                localStorage.setItem('productKey', key);
                localStorage.setItem('productData', JSON.stringify(product));
                window.location.href = 'ajout.html';
            }
        });
};

const deleteProduct = (userId, key) => {
    const productRef = ref(database, `users/${userId}/products/${plannedDate}/${key}`);
    remove(productRef)
        .then(() => {
            alert("Produit supprimé avec succès !");
            renderProductCards(userId);
        })
        .catch((error) => {
            alert("Erreur lors de la suppression du produit : " + error.message);
        });
};

const updateProductPurchaseStatus = (userId, key, purchased) => {
    const productRef = ref(database, `users/${userId}/products/${plannedDate}/${key}`);
    get(productRef).then((snapshot) => {
        if (snapshot.exists()) {
            const product = snapshot.val();
            product.purchased = purchased;
            product.total = product.unitPrice * product.quantity;
            set(productRef, product);
        }
    }).then(() => {
        const productsRef = ref(database, `users/${userId}/products/${plannedDate}`);
        get(productsRef).then((snapshot) => {
            updateSommes(snapshot);
        });
    });
};

const cartesContainer = document.getElementById('cartes-container');
const carteAchetes = document.getElementById('carte-achetes');
const carteNonAchetes = document.getElementById('carte-non-achetes');
const carteTousProduits = document.getElementById('carte-tous-produits');

let sommeAchetes = 0;
let sommeNonAchetes = 0;
let sommeTousProduits = 0;

// Mettre à jour les sommes
function updateSommes(snapshot) {
    sommeAchetes = 0;
    sommeNonAchetes = 0;
    sommeTousProduits = 0;

    // Calculer les sommes
    const products = snapshot.val();
    Object.keys(products).forEach(key => {
        const product = products[key];
        if (product.purchased) {
            sommeAchetes += product.total;
        } else {
            sommeNonAchetes += product.total;
        }
        sommeTousProduits += product.total;
    });

    // Mettre à jour les cartes
    carteAchetes.querySelector('p').textContent = `${sommeAchetes} FCFA`;
    carteNonAchetes.querySelector('p').textContent = `${sommeNonAchetes} FCFA`;
    carteTousProduits.querySelector('p').textContent = `${sommeTousProduits} FCFA`;
}

// Animer les cartes
function animateCartes() {
    const cartes = cartesContainer.children;
    let currentCarte = 0;

    setInterval(() => {
        cartes[currentCarte].classList.remove('show');
        currentCarte = (currentCarte + 1) % cartes.length;
        cartes[currentCarte].classList.add('show');
    }, 3000);
}

animateCartes();

document.getElementById('plannedDateTime').textContent = `Courses du ${plannedDate}`;

// Sidebar Toggle
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open-sidebar");
}

document.querySelector('.navbar-toggler').addEventListener('click', function() {
    toggleSidebar();
});