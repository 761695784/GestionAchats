import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getDatabase, ref, set, push, onValue, remove, get, update } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js';
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

const productForm = document.getElementById('productForm');
const productNameInput = document.getElementById('productName');
const quantityInput = document.getElementById('quantity');
const unitPriceInput = document.getElementById('unitPrice');
const totalInput = document.getElementById('total');
const productCards = document.getElementById('productCards');
const plannedDate = localStorage.getItem('plannedDate');
const alertContainer = document.getElementById('alert-container');
const alertMessage = document.getElementById('alert-message');
const alertCloseBtn = document.querySelector('.close');

const calculateTotal = () => {
    const quantity = parseFloat(quantityInput.value) || 0;
    const unitPrice = parseFloat(unitPriceInput.value) || 0;
    totalInput.value = quantity * unitPrice;
};

const editProduct = (userId, key) => {
    const productsRef = ref(database, `users/${userId}/products/${plannedDate}/${key}`);
    get(productsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const product = snapshot.val();
                productNameInput.value = product.name;
                quantityInput.value = product.quantity;
                unitPriceInput.value = product.unitPrice;
                calculateTotal();
            }
        })
        .catch(error => {
            showAlert("Erreur lors de la récupération du produit : " + error.message);
        });
};

const saveProductToFirebase = (product, key, userId) => {
    const productsRef = ref(database, `users/${userId}/products/${product.date}`);
    if (key) {
        const productRef = ref(productsRef, key);
        update(productRef, product)
            .then(() => {
                showAlert("Produit mis à jour avec succès !");
                renderProductCards(userId);
            })
            .catch((error) => {
                showAlert("Erreur lors de la mise à jour du produit : " + error.message);
            });
    } else {
        const newProductRef = push(productsRef);
        set(newProductRef, product)
            .then(() => {
                showAlert("Produit ajouté avec succès !");
                renderProductCards(userId);
            })
            .catch((error) => {
                showAlert("Erreur lors de l'ajout du produit : " + error.message);
            });
    }
};

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
                    productCard.innerHTML = `
                        <div class="card-body">
                            <p><strong>${product.name}</strong></p>
                            <p>Prix Unitaire = ${product.unitPrice} FCFA</p>
                            <p>Quantité = ${product.quantity}</p>
                            <p>Total = ${product.total} FCFA</p>
                            <div class="btn-group">
                                <button class="btn btn-warning btn-sm btn-edit"><i class="fas fa-edit"></i> </button>
                                <button class="btn btn-danger btn-sm btn-delete"><i class="fas fa-trash"></i> </button>
                            </div>
                        </div>
                    `;
                    productCard.querySelector('.btn-edit').addEventListener('click', function () {
                        editProduct(userId, key);
                    });
                    productCard.querySelector('.btn-delete').addEventListener('click', function () {
                        deleteProduct(userId, key);
                    });
                    productCards.appendChild(productCard);
                });
            }
        });
};

productForm.addEventListener('input', calculateTotal);

productForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const productName = productNameInput.value;
    const quantity = parseFloat(quantityInput.value);
    const unitPrice = parseFloat(unitPriceInput.value);
    const total = parseFloat(totalInput.value);

    const product = {
        name: productName,
        quantity,
        unitPrice,
        total,
        date: plannedDate
    };

    const userId = auth.currentUser.uid;
    saveProductToFirebase(product, null, userId);

    productNameInput.value = '';
    quantityInput.value = '';
    unitPriceInput.value = '';
    totalInput.value = '';
});

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('open-sidebar')) {
        sidebar.classList.remove('open-sidebar');
    } else {
        sidebar.classList.add('open-sidebar');
    }
}

document.querySelector('.navbar-toggler').addEventListener('click', function () {
    toggleSidebar();
});

document.getElementById('close-btn').addEventListener('click', toggleSidebar);

const deleteProduct = (userId, key) => {
    const productRef = ref(database, `users/${userId}/products/${plannedDate}/${key}`);
    remove(productRef)
        .then(() => {
            showAlert("Produit supprimé avec succès !");
            renderProductCards(userId);
        })
        .catch((error) => {
            showAlert("Erreur lors de la suppression du produit : " + error.message);
        });
};

document.getElementById('plannedDateTime').textContent = `Liste du ${plannedDate}`;

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;
        renderProductCards(userId);
    } else {
        console.log("User is not authenticated");
    }
});

// Function to show alert
function showAlert(message) {
    alertMessage.textContent = message;
    alertContainer.classList.add('show');
    setTimeout(() => {
        alertContainer.classList.remove('show');
    }, 3000); // Hide alert after 3 seconds
}

// Close alert when close button is clicked
alertCloseBtn.addEventListener('click', function () {
    alertContainer.classList.remove('show');
});