import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  update,
  get,
  child,
  remove,
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

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

if (!sessionStorage.getItem('user-info')) {
  window.location.href = '../login.html'
}

let user_info = JSON.parse(sessionStorage.getItem('user-info'));

let usernameContainer = document.getElementById('user-name-a');
usernameContainer.innerText = `${user_info.firstname} ${user_info.lastname}`;
let statement1 = document.getElementById('statement1');
statement1.innerText = `${user_info.firstname} ${user_info.lastname}'s current enrolled courses`;

let current_courses = document.getElementById('student-current-courses');

get(child(dbRef, `Roles/Students/${user_info.user_id}/Courses`))
.then ((snapshot) => {
  if (snapshot.exists()) {
    let courses_info = snapshot.val();
    // console.log(courses_info);
    Object.entries(courses_info).forEach((courses) => {
      // console.log(courses);
      let course_id = courses[0];
      let course_class = Object.entries(courses[1])[0][0];
      console.log(course_class);

      let row = document.createElement('tr');
      
      let course_id_td = document.createElement('td');
      course_id_td.innerText = course_id;

      let course_class_td = document.createElement('td');
      course_class_td.innerText = course_class;

      let course_name_td = document.createElement('td');
      get(child(dbRef, `Courses/${course_id}/name`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          course_name_td.innerText = snapshot.val();
        }
      })

      let schedule_td = document.createElement('td');
      let room_td = document.createElement('td');
      get(child(dbRef, `Courses/${course_id}/Classes/${course_class}/schedule`))
      .then((snapshot) => {
        if (snapshot.exists()) {

          schedule_td.innerText = `${snapshot.val().course_date}, ${snapshot.val().time_start} - ${snapshot.val().time_end}`;
          room_td.innerText = snapshot.val().room;
        }
      })

      row.appendChild(course_id_td);
      row.appendChild(course_class_td);
      row.appendChild(course_name_td);
      row.appendChild(schedule_td);
      row.appendChild(room_td);

      current_courses.appendChild(row);
    })

  }
})

