import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import {
    getDatabase,
    get,
    ref,
    child,
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
const auth = getAuth(app); // Lay dc auth
const db = getDatabase(app); // lay db
const dbRef = ref(db); //tham chieu toi database

// lay input cua email va password, cac element tu html
const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const loginButton = document.querySelector('#login-button');

// ham login
//da lang nghe duoc su kien click o login button
let login = async (e) => { //async de su dung await
    e.preventDefault();
    try {
        setPersistence(auth, browserSessionPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);//doi hoan thanh dang nhap
        const snapshot = await get(child(dbRef, `Users/${userCredential.user.uid}`));//doi lay user role
        let user_role;
        if(snapshot.exists()){
            sessionStorage.setItem(//luu role vao session storage
                "user-role",
                JSON.stringify({role: snapshot.val().role})
            );
            user_role = snapshot.val().role;
        }
        const roleSnapshot = await get(child(dbRef, `Roles/${user_role}/${userCredential.user.uid}`));//doi lay thong tin user
        if(roleSnapshot.exists()){
            sessionStorage.setItem(//luu thong tin user vao session storage
                "user-info",
                JSON.stringify({
                    firstname: roleSnapshot.val().firstname,
                    lastname: roleSnapshot.val().lastname,
                    email: roleSnapshot.val().email,
                    birthday: roleSnapshot.val().birthday,
                    user_id: userCredential.user.uid,
                    certificate: roleSnapshot.val().certificate,
                    expertise: roleSnapshot.val().expertise
                })
            );
        }
        alert('Đăng nhập thành công');
        window.location.href = "./index.html";
    } catch (error) {
        alert('Sai email hoặc mật khẩu');
    }
}

//lang nghe su kien click o submit button, nhấn phím enter
loginButton.addEventListener('click', login);
document.querySelector('body').addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        loginButton.click();
    }

})





