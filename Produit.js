// const cartesContainer = document.getElementById('cartes-container');
// const carteAchetes = document.getElementById('carte-achetes');
// const carteNonAchetes = document.getElementById('carte-non-achetes');
// const carteTousProduits = document.getElementById('carte-tous-produits');

// let sommeAchetes = 0;
// let sommeNonAchetes = 0;
// let sommeTousProduits = 0;

// // Mettre à jour les sommes
// function updateSommes(snapshot) {
//   sommeAchetes = 0;
//   sommeNonAchetes = 0;
//   sommeTousProduits = 0;

//   // Calculer les sommes
//   const products = snapshot.val();
//   Object.keys(products).forEach(key => {
//     const product = products[key];
//     if (product.purchased) {
//       sommeAchetes += product.total;
//     } else {
//       sommeNonAchetes += product.total;
//     }
//     sommeTousProduits += product.total;
//   });

//   // Mettre à jour les cartes
//   carteAchetes.querySelector('p').textContent = `${sommeAchetes} FCFA`;
//   carteNonAchetes.querySelector('p').textContent = `${sommeNonAchetes} FCFA`;
//   carteTousProduits.querySelector('p').textContent = `${sommeTousProduits} FCFA`;
// }

// // Animer les cartes
// function animateCartes() {
//   const cartes = cartesContainer.children;
//   let currentCarte = 0;

//   setInterval(() => {
//     cartes[currentCarte].style.transform = 'translateX(-100%)';
//     currentCarte = (currentCarte + 1) % cartes.length;
//     cartes[currentCarte].style.transform = 'translateX(0)';
//   }, 2000);
// }

// animateCartes();

// // Mettre à jour les sommes lorsqu'un produit est marqué comme acheté
// document.addEventListener('change', event => {
//   if (event.target.classList.contains('purchase-checkbox')) {
//     const productsRef = ref(database, `products/${plannedDate}`);
//     get(productsRef).then(snapshot => {
//       updateSommes(snapshot);
//     });
//   }
// });