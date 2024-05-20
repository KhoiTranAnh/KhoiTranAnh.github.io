import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  updatePassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
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
const auth = getAuth();
const db = getDatabase();

let student_info = JSON.parse(sessionStorage.getItem("user-info"));

let firstname = document.getElementById("fname");
let lastname = document.getElementById("lname");
let student_id = document.getElementById("student-id");
let mail = document.getElementById("student-mail");
let dob = document.getElementById("student-dob");


firstname.innerText = student_info.firstname;
lastname.innerText = student_info.lastname;
mail.innerText = student_info.email;
dob.innerText = student_info.birthday;
student_id.innerText = student_info.user_id.substring(
  student_info.user_id.length - 6
);

let cur_pass = document.getElementById('cur-password-inp');
let new_pass = document.getElementById('password-inp');
let confirm_pass = document.getElementById('confirm-password');
let updateBtn = document.getElementById('updateBtn');

let updateInfo = (event) => {
  if (cur_pass.value != "") {
    signInWithEmailAndPassword(auth, student_info.email, cur_pass.value)
    .then(() => {
      if (new_pass.value != "" && confirm_pass.value != "") {
        if (new_pass.value == confirm_pass.value) {
          updatePassword(auth.currentUser, new_pass.value);
          alert("Update password successfully, please log in again");
          sessionStorage.clear();
          window.location.href = "../login.html";
        }
      }
    })
    .catch((error) => {
      alert(error.message);
    })
  }
}

updateBtn.addEventListener('click', updateInfo);

function calculateOverallGrade(grades) {
  let overall = 0;
  if (grades.activityRatio != null) {
    if (grades.activityGrade == "") return "Not found";
    overall += Number(grades.activityGrade) * Number(grades.activityRatio) / 100;
  }
  if (grades.labsRatio != null) {
    if (grades.labsGrade == "") return "Not found";
    overall += Number(grades.labsGrade) * Number(grades.labsRatio) / 100;
  }
  if (grades.projectsAssignmentRatio != null) {
    if (grades.projectsAssignmentGrade == "") return "Not found";
    overall += Number(grades.projectsAssignmentGrade) * Number(grades.projectsAssignmentRatio) / 100;
  }
  if (grades.midtermRatio != null) {
    if (grades.midtermGrade == "") return "Not found";
    overall += Number(grades.midtermGrade) * Number(grades.midtermRatio) / 100;
  }
  if (grades.finalRatio != null) {
    if (grades.finalGrade == "") return "Not found";
    overall += Number(grades.finalGrade) * Number(grades.finalRatio) / 100;
  }
  return overall;
}

function createGradeTableRow(courseID, courseName, courseCredit, grades) {
  let row = document.createElement('tr');

  let td_courseId = document.createElement('td');
  td_courseId.classList.add('element');
  td_courseId.innerText = courseID;

  let td_courseName = document.createElement('td');
  td_courseName.classList.add('element');
  td_courseName.innerText = courseName;

  let td_courseCredit = document.createElement('td');
  td_courseCredit.classList.add('element');
  td_courseCredit.innerText = courseCredit;

  let td_grades = document.createElement('td');
  td_grades.classList.add('element');
  if (grades.activityGrade != null) {
    let grade = grades.activityGrade == "" ? "Not found" : Number(grades.activityGrade);
    let p = document.createElement('p');
    p.innerText = `Activity/Quiz: ${grade}`
    td_grades.appendChild(p);
  }
  if (grades.labsGrade != null){
    let grade = grades.labsGrade == "" ? "Not found" : Number(grades.labsGrade);
    let p = document.createElement('p');
    p.innerText = `Labs: ${grade}`
    td_grades.appendChild(p);
  }
  if (grades.projectsAssignmentGrade != null) {
    let grade = grades.projectsAssignmentGrade == "" ? "Not found" : Number(grades.projectsAssignmentGrade);
    let p = document.createElement('p');
    p.innerText = `Assignment: ${grade}`
    td_grades.appendChild(p);
  }
  if (grades.midtermGrade != null){
    let grade = grades.midtermGrade == "" ? "Not found" : Number(grades.midtermGrade);
    let p = document.createElement('p');
    p.innerText = `Midterm: ${grade}`
    td_grades.appendChild(p);
  }
  if (grades.finalGrade != null) {
    let grade = grades.finalGrade == "" ? "Not found" : Number(grades.finalGrade);
    let p = document.createElement('p');
    p.innerText = `Final: ${grade}`
    td_grades.appendChild(p);
  }
  
  let td_overallGrade = document.createElement('td');
  td_overallGrade.classList.add('element');
  td_overallGrade.innerText = calculateOverallGrade(grades);

  row.appendChild(td_courseId);
  row.appendChild(td_courseName);
  row.appendChild(td_courseCredit);
  row.appendChild(td_grades);
  row.appendChild(td_overallGrade);

  return row;
}

function load_user_grade() {
  get(ref(db, `Roles/Students/${student_info.user_id}/Courses`))
  .then ((snapshot) => {
    Object.entries(snapshot.val()).forEach((course) => {
      let courseID = course[0];
      get(ref(db, `Courses/${courseID}`))
      .then((snapshot) => {
        let courseName = snapshot.val().name;
        let courseCredit = snapshot.val().credit;
        Object.entries(course[1]).forEach((courseClass) => {
          let grades = courseClass[1].grades;
          // console.log(courseID);
          // console.log(courseName);
          // console.log(courseCredit);
          // console.log(grades);
          document.getElementById('grade-table').appendChild(createGradeTableRow(courseID, courseName, courseCredit, grades));
        })
      })
    })
  })
}

load_user_grade();

function createScheduleTableRow(courseId, courseName, courseClassId, courseSchedule) {
  let row = document.createElement('tr');

  let td_courseId = document.createElement('td');
  td_courseId.classList.add('element');
  td_courseId.innerText = courseId;

  let td_courseName = document.createElement('td');
  td_courseName.classList.add('element');
  td_courseName.innerText = courseName;

  let td_courseClassId = document.createElement('td');
  td_courseClassId.classList.add('element');
  td_courseClassId.innerText = courseClassId;

  let td_courseDate = document.createElement('td');
  td_courseDate.classList.add('element');
  td_courseDate.innerText = courseSchedule.course_date;

  let td_courseTime = document.createElement('td');
  td_courseTime.classList.add('element');
  td_courseTime.innerText = `${courseSchedule.time_start} - ${courseSchedule.time_end}`

  let td_courseRoom = document.createElement('td');
  td_courseRoom.classList.add('element');
  td_courseRoom.innerText = courseSchedule.room;

  row.appendChild(td_courseId);
  row.appendChild(td_courseName);
  row.appendChild(td_courseClassId);
  row.appendChild(td_courseDate);
  row.appendChild(td_courseTime);
  row.appendChild(td_courseRoom);

  return row;
}

function load_user_timetable() {
  get(ref(db, `Roles/Students/${student_info.user_id}/Courses`))
  .then ((snapshot) => {
    Object.entries(snapshot.val()).forEach((course) => {
      let courseID = course[0];
      Object.entries(course[1]).forEach((courseClass) => {
        let courseClassId = courseClass[0];
        get(ref(db, `Courses/${courseID}`))
        .then((snapshot) => {
          let courseName = snapshot.val().name;
          let courseSchedule = snapshot.val().Classes[courseClassId].schedule
          // console.log(courseName);
          // console.log(courseClassId);
          // console.log(courseID);
          // console.log(courseSchedule);
          document.getElementById('time-table').appendChild(createScheduleTableRow(courseID, courseName, courseClassId, courseSchedule));
        })
      }) 
    })
  })
}

load_user_timetable();
