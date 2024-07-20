// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHPaYRAkOE1VTo9hv3tkseUFnGfJkvtUo",
  authDomain: "gestionachats-1112.firebaseapp.com",
  projectId: "gestionachats-1112",
  storageBucket: "gestionachats-1112.appspot.com",
  messagingSenderId: "1014952416832",
  appId: "1:1014952416832:web:33fdda900d4ff03e9db1a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Validate input fields
function validateFields() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if(validate_field(name) && validate_field(email) && validate_field(password) && validate_email(email) && validate_password(password)){
    register(name, email, password);
  } else {
    alert('Please fill all fields correctly');
  }
}

// Register function
function register(name, email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const user_data = {
        name: name,
        email: email
      };
      set(ref(database, 'users/' + user.uid), user_data)
        .then(() => {
          alert("User account created successfully!");
          // window.location.href = "index.html";
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Utility functions to validate fields
function validate_field(field) {
  return field && field.trim() !== '';
}

function validate_email(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validate_password(password) {
  return password.length >= 6;  // Example password validation rule
}

// Expose validateFields to the global scope
window.validateFields = validateFields;
