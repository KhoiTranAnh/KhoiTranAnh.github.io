// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
// import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
// import {
//     getDatabase,
//     get,
//     ref,
//     child,
//   } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyAn4qlccbAWPFI9xwl7oe2nYJYk3MG1mWo",
//     authDomain: "btl-ltnc-hk232.firebaseapp.com",
//     databaseURL: "https://btl-ltnc-hk232-default-rtdb.firebaseio.com",
//     projectId: "btl-ltnc-hk232",
//     storageBucket: "btl-ltnc-hk232.appspot.com",
//     messagingSenderId: "912822160722",
//     appId: "1:912822160722:web:01a3228b49c25871f17e8b"
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);
// const dbref = ref(db);
// const auth = getAuth(app); // Lay dc auth


let courses = document.querySelector(".a-container.courses");
let dashboard = document.querySelector(".a-container.dashboard");
let course_regis = document.querySelector(".a-container.course-regis");
let login_but = document.querySelector(".a-container.login");
let logout_but = document.getElementById("logout-div");

if(sessionStorage.getItem("user-info") == null){
    login_but.style.display = 'initial';
} else {
  logout_but.style.display = 'block';
}
let user_role = JSON.parse(sessionStorage.getItem("user-role"));
let info = JSON.parse(sessionStorage.getItem("user-info"));

if(user_role.role == 'Admin'){
  dashboard.style.display = 'initial';
  login_but.innerHTML =  "<a href='./ad_dboard.html'>Admin</a>"; 
}else if(user_role.role == 'Students'){
  course_regis.style.display = 'initial';
  courses.style.display = 'initial';
  login_but.innerHTML =  "<a href='./student_profile.html' id='user-name-a'>" + info.lastname + ' ' + info.firstname + "</a>";

}else if(user_role.role == 'Teachers'){
  courses.style.display = 'initial';
  login_but.innerHTML =  "<a href='./teacher_profile.html' id='user-name-a'>" + info.lastname + ' ' + info.firstname + "</a>"; 
}

// let logout = async (e) => { //async de su dung await
//   sessionStorage.clear();
//   window.location.href = "./index.html";
// }

// logout_but.addEventListener('click', logout);
