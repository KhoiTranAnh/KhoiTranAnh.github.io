import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import {
    getDatabase,
    ref,
    set,
    get,
    child
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAn4qlccbAWPFI9xwl7oe2nYJYk3MG1mWo",
  authDomain: "btl-ltnc-hk232.firebaseapp.com",
  databaseURL: "https://btl-ltnc-hk232-default-rtdb.firebaseio.com",
  projectId: "btl-ltnc-hk232",
  storageBucket: "btl-ltnc-hk232.appspot.com",
  messagingSenderId: "912822160722",
  appId: "1:912822160722:web:01a3228b49c25871f17e8b",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbref = ref(db);
let select_teacher = document.getElementById('teacher');

function import_teacher(db, select_teacher) {
  get(child(dbref, `Roles/Teachers`)).then((snapshot) => {
    if (snapshot.exists()) {
      Object.entries(snapshot.val()).forEach((teacher) => {
        let teacher_name = teacher[0].substring(teacher[0].length - 6, teacher[0].length) + " " + teacher[1].firstname + " " + teacher[1].lastname;
        let option = document.createElement('option');
        option.value = teacher[0];
        option.innerText = teacher_name;
        select_teacher.appendChild(option);
      })
    }
    else {
      console.log("error");
    }
  }).catch((error) => {
    console.log(error);
  });
}

import_teacher(db, select_teacher);

let select_course = document.getElementById('courseid');

function import_courseID(db, select_course) {
  get(child(dbref, `Courses/`))
  .then((snapshot) => {
    if (snapshot.exists) {
      // console.log(snapshot.val());
      Object.entries(snapshot.val()).forEach((courseID) => {
        // console.log(courseID[0]);
        let option = document.createElement('option');
        option.value = courseID[0];
        option.innerText = courseID[0];
        select_course.appendChild(option);
      })
    }
  })
  .catch((error) => {
    console.log(error);
  })
}

import_courseID(db, select_course);

