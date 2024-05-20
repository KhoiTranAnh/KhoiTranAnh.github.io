import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { createUserWithEmailAndPassword, getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
  
  const firebaseConfig = {
    apiKey: "AIzaSyAn4qlccbAWPFI9xwl7oe2nYJYk3MG1mWo",
    authDomain: "btl-ltnc-hk232.firebaseapp.com",
    databaseURL: "https://btl-ltnc-hk232-default-rtdb.firebaseio.com",
    projectId: "btl-ltnc-hk232",
    storageBucket: "btl-ltnc-hk232.appspot.com",
    messagingSenderId: "912822160722",
    appId: "1:912822160722:web:01a3228b49c25871f17e8b"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);

  let firstname = document.getElementById('fname-input');
  let lastname = document.getElementById('lname-input');
  let email = document.getElementById('email-input');
  let password = document.getElementById('password-input');
  let birthday = document.getElementById('birthday-input')
  let mainform = document.getElementById('mainform');

  let signUp = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      let promises=[
      set(ref(db, 'Users/' + userCredential.user.uid), {
        role: "Students"
      }),
      set(ref(db, 'Roles/Students/' + userCredential.user.uid), {
        email: email.value,
        firstname: firstname.value,
        lastname: lastname.value,
        birthday: birthday.value,
      })
      ];
      sessionStorage.setItem(
        //luu role vao session storage
        "user-role",
        JSON.stringify({ role: "Students" })
      );
      sessionStorage.setItem(
        //luu thong tin user vao session storage
        "user-info",
        JSON.stringify({
          firstname: firstname.value,
          lastname: lastname.value,
          email: email.value,
          birthday: birthday.value,
          user_id: userCredential.user.uid
        })
      );
      return Promise.all(promises);
    })
    .then(() => {
      window.location.href = "./index.html"; 
    })
    .catch((error) => {
      alert(error.message);
      console.log(error.code);
      console.log(error.message);
    })
  }
  mainform.addEventListener('submit', signUp);
  document.querySelector('body').addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
      signUp();
    }
  })
