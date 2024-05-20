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

let user_info = JSON.parse(sessionStorage.getItem("user-info"));
let searchInput = document.getElementById("searchInput");
let course_info = document.getElementById("course-info");
let courseTable = document.getElementById("courseTableBody");
let selected_class = document.getElementById("selected-class");
let confirm_button = document.getElementById("confirm-btn");

let searchCourse = (event) => {
  get(child(dbRef, `Courses/${searchInput.value}`)).then((snapshot) => {
    if (snapshot.exists()) {
      let course = snapshot.val();
      course_info.innerText = `${searchInput.value} - ${course.name} - ${course.credit} credits`;

      let childs = document.getElementsByClassName("courseTableBody-Child");
      while (childs.length > 0) {
        courseTable.removeChild(childs[0]);
      }
      
      Object.entries(course.Classes).forEach((courseClass) => {
        let row = document.createElement("tr");
        row.classList.add("courseTableBody-Child");

        let checkbox = document.createElement("td");

        let checkbox_child = document.createElement("input");
        checkbox_child.type = "checkbox";
        checkbox_child.id = courseClass[0];
        checkbox_child.value = courseClass[0];
        checkbox_child.classList.add("checkbox");
        checkbox_child.setAttribute(
          "onclick",
          `checkOnlyOneBox('${courseClass[0]}')`
        );
        checkbox.appendChild(checkbox_child);

        let className = document.createElement("td");
        className.innerText = courseClass[0];

        let schedule = document.createElement("td");
        schedule.innerText = `${courseClass[1].schedule.course_date}, ${courseClass[1].schedule.time_start} - ${courseClass[1].schedule.time_end}`;

        let room = document.createElement("td");
        room.innerText = courseClass[1].schedule.room;

        let currentCapacity = document.createElement("td");
        currentCapacity.innerText = courseClass[1].capacity;

        row.appendChild(checkbox);
        row.appendChild(className);
        row.appendChild(schedule);
        row.appendChild(room);
        row.appendChild(currentCapacity);

        courseTable.appendChild(row);
      });
    } else {
      course_info.innerText = "Not found";
    }
  });
};

searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchCourse();
  }
});

let registerCourse = (event) => {
  if (selected_class.innerText != "") {
    get(child(dbRef, `Roles/Students/${user_info.user_id}/Courses`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          Object.entries(snapshot.val()).forEach((obj) => {
            let course_id = obj[0];
            let course_class = Object.entries(obj[1])[0][0];
            remove(
              ref(
                db,
                `Courses/${course_id}/Classes/${course_class}/studentIds/${user_info.user_id}`
              )
            );
          });
        }
      })
    get(child(dbRef, `Courses/${searchInput.value}/GradeFrame`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("break");
          let grade = snapshot.val();
          if (grade["activityRatio"] != null) grade["activityGrade"] = "";
          if (grade["labsRatio"] != null) grade["labsGrade"] = "";
          if (grade["projectsAssignmentRatio"] != null)
            grade["projectsAssignmentGrade"] = "";
          if (grade["midtermRatio"] != null) grade["midtermGrade"] = "";
          if (grade["finalRatio"] != null) grade["finalGrade"] = "";
          update(
            ref(
              db,
              `Courses/${searchInput.value}/Classes/${selected_class.innerText}/studentIds`
            ),
            {
              [user_info.user_id]: { ["grades"]: grade },
            }
          ).catch((error) => {
            alert(error.message);
          });
          update(ref(db, `Roles/Students/${user_info.user_id}/Courses`), {
            [searchInput.value]: {
              [selected_class.innerText]: {
                ["grades"]: grade,
              },
            },
          })
            .then(() => {
              alert("Đăng ký thành công");
            })
            .catch((error) => {
              alert(error.message);
            });
        }
        else {
          console.log("BUG");
        }
      }
    );
  } else {
    alert("Hãy chọn một lớp");
  }
};

confirm_button.addEventListener("click", registerCourse);
