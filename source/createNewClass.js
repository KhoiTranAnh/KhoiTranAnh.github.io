import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  update,
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
const auth = getAuth(app);
const db = getDatabase(app);
//Lay HTML Element
const course_id_input = document.querySelector("#courseid");
const class_input = document.querySelector("#class");
const teacher_name_input = document.querySelector("#teacher");
const capacity_input = document.querySelector("#capacity");
const course_length_input = document.querySelector("#course_length");
const dateInWeek_input = document.querySelector("#dayOfWeek");
const time_start_input = document.querySelector("#time_start");
const time_end_input = document.querySelector("#time_end");
const room_input = document.querySelector("#room");

const create_button = document.getElementById('createCourseBtn');

function insertData(e) {
  e.preventDefault();
  console.log("web update");
  
  get(ref(db, `Courses/${course_id_input.value}/syllabus_link`)).then((snapshot) => {
    console.log(snapshot.val());
    update(ref(db, `Courses/${course_id_input.value}/Classes`), {
      [class_input.value]: {
        capacity: capacity_input.value,
        teacherId: teacher_name_input.value,
        // TODO: Add content 
        ['sections'] : {
          sectionCount : 1,
          ['1'] : {
            contentCount : 1,
            sectionName: "General",
            ['1'] : {
              contentName: "Course Syllabus",
              link: snapshot.val(),
            }
          }
        },
        schedule: {
          courseLength: course_length_input.value,
          course_date: dateInWeek_input.value,
          room: room_input.value,
          time_start: time_start_input.value,
          time_end: time_end_input.value,
        },
      },
    })
    .catch((error) => {
      alert(error.message);
    });
  })
  
  update(ref(db, `Roles/Teachers/${teacher_name_input.value}/Courses/${course_id_input.value}/class`), {
    [class_input.value] : "",
  })

  alert("Tạo lớp mới thành công")
  window.location.reload();
}

//Lang nghe su kien click o createButton va goi ham de them Data
create_button.addEventListener("click", function (e) {
  insertData(e);
});
// document.querySelector("body").addEventListener("keydown", function (e) {
//   if (e.keyCode === 13) {
//     insertData(e);
//   }
// });
