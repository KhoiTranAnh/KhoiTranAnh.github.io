import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
import { getStorage, uploadBytes } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js";


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
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage()
//Lay HTML Element
const course_id_input = document.querySelector("#newCourseID");
const course_name_input = document.querySelector("#course-name");
const course_credit_input = document.getElementById("course-credit");
const course_syllabus = document.getElementById('course-syllabus');

const gradeRatio_activity = document.getElementById('activity');
const gradeRatio_labs = document.getElementById('labs');
const gradeRatio_projects_assignment = document.getElementById('projects-assignment');
const gradeRatio_midterm = document.getElementById('midterm');
const gradeRatio_final = document.getElementById('final');

const create_button = document.getElementById('createNewCourseBtn');
const form = document.getElementById('createCourseForm');



let insertData = (event) => {
  event.preventDefault();
  console.log("web update");
  set(ref(db, `Courses/${course_id_input.value}`), {
    name: course_name_input.value,
    credit: course_credit_input.value,
    syllabus_link: course_syllabus.value
  })
  .then(() => {
    console.log("success");
  })
  .catch((error) => {
    alert(error.message);
  });
  let gradeFrame = {};
  if (gradeRatio_activity.value != 0) {
    gradeFrame['activityRatio'] = gradeRatio_activity.value;
  }
  if (gradeRatio_labs.value != 0) {
    gradeFrame['labsRatio'] = gradeRatio_labs.value;
  }
  if (gradeRatio_projects_assignment.value != 0) {
    gradeFrame['projectsAssignmentRatio'] = gradeRatio_projects_assignment.value;
  }
  if (gradeRatio_midterm.value != 0) {
    gradeFrame['midtermRatio'] = gradeRatio_midterm.value;
  }
  if (gradeRatio_final.value != 0) {
    gradeFrame['finalRatio'] = gradeRatio_final.value;
  }
  set(ref(db, `Courses/${course_id_input.value}/GradeFrame`), gradeFrame);
  // window.location.reload();
}

form.addEventListener('submit', insertData);
//Lang nghe su kien click o createButton va goi ham de them Data
// create_button.addEventListener("click", insertData);
// document.querySelector("body").addEventListener("keydown", function (e) {
//   if (e.keyCode === 13) {
//     insertData(e);
//   }
// });
