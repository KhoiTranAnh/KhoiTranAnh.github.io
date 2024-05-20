import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
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
  appId: "1:912822160722:web:01a3228b49c25871f17e8b",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let student_grade_table = document.getElementById("student-list-table");
let current_course = JSON.parse(sessionStorage.getItem("currentClass"));
let current_course_id = current_course.course_id;
let current_course_class = current_course.course_class;

function calculateOverallGrade(grades) {
  let overall = 0;
  if (grades.activityRatio != null) {
    if (grades.activityGrade == "") return "Not found";
    overall +=
      (Number(grades.activityGrade) * Number(grades.activityRatio)) / 100;
  }
  if (grades.labsRatio != null) {
    if (grades.labsGrade == "") return "Not found";
    overall += (Number(grades.labsGrade) * Number(grades.labsRatio)) / 100;
  }
  if (grades.projectsAssignmentRatio != null) {
    if (grades.projectsAssignmentGrade == "") return "Not found";
    overall +=
      (Number(grades.projectsAssignmentGrade) *
        Number(grades.projectsAssignmentRatio)) /
      100;
  }
  if (grades.midtermRatio != null) {
    if (grades.midtermGrade == "") return "Not found";
    overall +=
      (Number(grades.midtermGrade) * Number(grades.midtermRatio)) / 100;
  }
  if (grades.finalRatio != null) {
    if (grades.finalGrade == "") return "Not found";
    overall += (Number(grades.finalGrade) * Number(grades.finalRatio)) / 100;
  }
  return overall;
}

console.log(`Courses/${current_course_id}/Classes/${current_course_class}/studentIds`)

function load_grade_table(student_grade_table) {
  get(
    ref(
      db,
      `Courses/${current_course_id}/Classes/${current_course_class}/studentIds`
    )
  ).then((snapshot) => {
    if (snapshot.exists()) {
      // console.log(snapshot.val());
      Object.entries(snapshot.val()).forEach((student) => {
        let studentID = student[0];
        let studentGrades = student[1].grades;

        let overallGrade = calculateOverallGrade(studentGrades);
        get(ref(db, `Roles/Students/${studentID}`)).then((snapshot) => {
          // console.log(snapshot.val());
          let firstname = snapshot.val().firstname;
          let lastname = snapshot.val().lastname;
          let shortenID = studentID.substring(studentID.length - 6);

          let row = document.createElement("tr");
          let td_studentID = document.createElement("td");
          let a_studentID = document.createElement("a");
          a_studentID.href = "./teacher_grading_individual.html";
          a_studentID.id = "student-id";
          a_studentID.setAttribute(
            "onclick",
            `saveCurrent("${studentID}", "${firstname} ${lastname}")`
          );
          a_studentID.innerText = shortenID;
          td_studentID.appendChild(a_studentID);
          let td_firstname = document.createElement("td");
          td_firstname.innerText = firstname;
          let td_lastname = document.createElement("td");
          td_lastname.innerText = lastname;
          let td_overall_grade = document.createElement("td");
          td_overall_grade.innerText = String(overallGrade);

          row.appendChild(td_studentID);
          row.appendChild(td_firstname);
          row.appendChild(td_lastname);
          row.appendChild(td_overall_grade);

          student_grade_table.appendChild(row);
        });
        // console.log(student[0]);
        // console.log(student[1].grades);
      });
    }
    else {console.log("BUG")}
  });
}

let grade_report = document.getElementById("grade-report");
function load_individual_grade(grade_table) {
  let currentStudent = JSON.parse(sessionStorage.getItem("currentStudent"));
  let user_id = currentStudent.studentID;
  let student_name = currentStudent.studentName;
  document.getElementById("student-info").innerText = `${user_id.substring(
    user_id.length - 6
  )} - ${student_name} - Grade Report`;
  get(
    ref(
      db,
      `Roles/Students/${user_id}/Courses/${current_course_id}/${current_course_class}/grades`
    )
  ).then((snapshot) => {
    if (snapshot.exists()) {
      if (snapshot.val().activityRatio != null) {
        let row = document.createElement("tr");
        let gradeName = document.createElement("td");
        gradeName.innerText = "Activity/Quiz";
        let gradeWeight = document.createElement("td");
        gradeWeight.innerText = snapshot.val().activityRatio + "%";
        let grade = document.createElement("td");
        let grade_input = document.createElement("input");
        grade_input.placeholder =
          snapshot.val().activityGrade == ""
            ? "Not found"
            : snapshot.val().activityGrade;
        grade_input.id = "activity";
        grade_input.type = "number";
        grade_input.step = "0.1";
        grade_input.autocomplete = "off";
        grade.appendChild(grade_input);
        row.appendChild(gradeName);
        row.appendChild(gradeWeight);
        row.appendChild(grade);
        grade_table.appendChild(row);
      }
      if (snapshot.val().labsRatio != null) {
        let row = document.createElement("tr");
        let gradeName = document.createElement("td");
        gradeName.innerText = "Labs";
        let gradeWeight = document.createElement("td");
        gradeWeight.innerText = snapshot.val().labsRatio + "%";
        let grade = document.createElement("td");
        let grade_input = document.createElement("input");
        grade_input.placeholder =
          snapshot.val().labsGrade == ""
            ? "Not found"
            : snapshot.val().labsGrade;
        grade_input.id = "labs";
        grade_input.type = "number";
        grade_input.step = "0.1";
        grade_input.autocomplete = "off";
        grade.appendChild(grade_input);
        row.appendChild(gradeName);
        row.appendChild(gradeWeight);
        row.appendChild(grade);
        grade_table.appendChild(row);
      }
      if (snapshot.val().projectsAssignmentRatio != null) {
        let row = document.createElement("tr");
        let gradeName = document.createElement("td");
        gradeName.innerText = "Assignment";
        let gradeWeight = document.createElement("td");
        gradeWeight.innerText = snapshot.val().projectsAssignmentRatio + "%";
        let grade = document.createElement("td");
        let grade_input = document.createElement("input");
        grade_input.placeholder =
          snapshot.val().projectsAssignmentGrade == ""
            ? "Not found"
            : snapshot.val().projectsAssignmentGrade;
        grade_input.id = "projectsAssignment";
        grade_input.type = "number";
        grade_input.step = "0.1";
        grade_input.autocomplete = "off";
        grade.appendChild(grade_input);
        row.appendChild(gradeName);
        row.appendChild(gradeWeight);
        row.appendChild(grade);
        grade_table.appendChild(row);
      }
      if (snapshot.val().midtermRatio != null) {
        let row = document.createElement("tr");
        let gradeName = document.createElement("td");
        gradeName.innerText = "Midterm Exam";
        let gradeWeight = document.createElement("td");
        gradeWeight.innerText = snapshot.val().midtermRatio + "%";
        let grade = document.createElement("td");
        let grade_input = document.createElement("input");
        grade_input.placeholder =
          snapshot.val().midtermGrade == ""
            ? "Not found"
            : snapshot.val().midtermGrade;
        grade_input.id = "midterm";
        grade_input.type = "number";
        grade_input.step = "0.1";
        grade_input.autocomplete = "off";
        grade.appendChild(grade_input);
        row.appendChild(gradeName);
        row.appendChild(gradeWeight);
        row.appendChild(grade);
        grade_table.appendChild(row);
      }
      if (snapshot.val().finalRatio != null) {
        let row = document.createElement("tr");
        let gradeName = document.createElement("td");
        gradeName.innerText = "Final Exam";
        let gradeWeight = document.createElement("td");
        gradeWeight.innerText = snapshot.val().finalRatio + "%";
        let grade = document.createElement("td");
        let grade_input = document.createElement("input");
        grade_input.placeholder =
          snapshot.val().finalGrade == ""
            ? "Not found"
            : snapshot.val().finalGrade;
        grade_input.id = "final";
        grade_input.type = "number";
        grade_input.step = "0.1";
        grade_input.autocomplete = "off";
        grade.appendChild(grade_input);
        row.appendChild(gradeName);
        row.appendChild(gradeWeight);
        row.appendChild(grade);
        grade_table.appendChild(row);
      }
    }
  });
}

let updateGrade = (event) => {
  event.preventDefault();
  let currentStudent = JSON.parse(sessionStorage.getItem("currentStudent"));
  let user_id = currentStudent.studentID;
  let activityGrade = document.getElementById("activity");
  if (activityGrade != null && activityGrade.value != "") {
    update(
      ref(
        db,
        `Roles/Students/${user_id}/Courses/${current_course_id}/${current_course_class}/grades`
      ),
      {
        activityGrade: activityGrade.value,
      }
    ).catch((error) => {
      console.log(error);
    });
    update(
      ref(
        db,
        `Courses/${current_course_id}/Classes/${current_course_class}/studentIds/${user_id}/grades`
      ),
      {
        activityGrade: activityGrade.value,
      }
    ).catch((error) => {
      console.log(error);
    });
  }
  let labsGrade = document.getElementById("labs");
  if (labsGrade != null && labsGrade.value != "") {
    update(
      ref(
        db,
        `Roles/Students/${user_id}/Courses/${current_course_id}/${current_course_class}/grades`
      ),
      {
        labsGrade: labsGrade.value,
      }
    ).catch((error) => {
      console.log(error);
    });
    update(
      ref(
        db,
        `Courses/${current_course_id}/Classes/${current_course_class}/studentIds/${user_id}/grades`
      ),
      {
        labsGrade: labsGrade.value,
      }
    ).catch((error) => {
      console.log(error);
    });
  }
  let projectsAssignmentGrade = document.getElementById("projectsAssignment");
  if (projectsAssignmentGrade != null && projectsAssignmentGrade.value != "") {
    update(
      ref(
        db,
        `Roles/Students/${user_id}/Courses/${current_course_id}/${current_course_class}/grades`
      ),
      {
        projectsAssignmentGrade: projectsAssignmentGrade.value,
      }
    ).catch((error) => {
      console.log(error);
    });
    update(
      ref(
        db,
        `Courses/${current_course_id}/Classes/${current_course_class}/studentIds/${user_id}/grades`
      ),
      {
        projectsAssignmentGrade: projectsAssignmentGrade.value,
      }
    ).catch((error) => {
      console.log(error);
    });
  }
  let midtermGrade = document.getElementById("midterm");
  if (midtermGrade != null && midtermGrade != "") {
    update(
      ref(
        db,
        `Roles/Students/${user_id}/Courses/${current_course_id}/${current_course_class}/grades`
      ),
      {
        midtermGrade: midtermGrade.value,
      }
    ).catch((error) => {
      console.log(error);
    });
    update(
      ref(
        db,
        `Courses/${current_course_id}/Classes/${current_course_class}/studentIds/${user_id}/grades`
      ),
      {
        midtermGrade: midtermGrade.value,
      }
    ).catch((error) => {
      console.log(error);
    });
  }
  let finalGrade = document.getElementById("final");
  if (finalGrade != null && finalGrade.value != "") {
    update(
      ref(
        db,
        `Roles/Students/${user_id}/Courses/${current_course_id}/${current_course_class}/grades`
      ),
      {
        finalGrade: finalGrade.value,
      }
    ).catch((error) => {
      console.log(error);
    });
    update(
      ref(
        db,
        `Courses/${current_course_id}/Classes/${current_course_class}/studentIds/${user_id}/grades`
      ),
      {
        finalGrade: finalGrade.value,
      }
    ).catch((error) => {
      console.log(error);
    });
  }
  alert("Cập nhật điểm thành công");
  window.location.reload();
}

if (grade_report != null) load_individual_grade(grade_report);
if (student_grade_table != null) load_grade_table(student_grade_table);
if (document.getElementById('updateBtn') != null) {
  document.getElementById('updateBtn').addEventListener('click', updateGrade);
}

