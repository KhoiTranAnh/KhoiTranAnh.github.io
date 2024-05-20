import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import {
    get,
    getDatabase,
    ref,
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

const currentClass = JSON.parse(sessionStorage.getItem("currentClass"))
const currentCourseId = currentClass.course_id
const currentCourseClass = currentClass.course_class
// console.log(currentCourseClass + " " + currentCourseId);
const userInfo = JSON.parse(sessionStorage.getItem("user-info"));
const user_id = userInfo.user_id;

let currentCourseInfo = document.getElementById('course-info')

async function load_course_info() {
  await get(ref(db, `Courses/${currentCourseId}/`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      let course_name = snapshot.val().name;
      // console.log(snapshot.val());
      get(ref(db, `Courses/${currentCourseId}/Classes/${currentCourseClass}`))
      .then((snapshot) => {
        if (snapshot.exists()){
          let teacherId = snapshot.val().teacherId;
          get(ref(db, `Roles/Teachers/${teacherId}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              let teacher_name = snapshot.val().firstname + " " + snapshot.val().lastname;
              currentCourseInfo.innerText = `${course_name} - ${teacher_name} - ${currentCourseClass}`;
              // console.log(`${course_name} - ${teacher_name} - ${currentCourseClass}`);
            }
          })
        }
        // else {console.log("BUG")}
      })
    }
  })
}

let grade_table = document.getElementById('grade_table')

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

function load_student_grade(grade_table) {
  get(ref(db, `Roles/Students/${user_id}/Courses/${currentCourseId}/${currentCourseClass}/grades`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      if (snapshot.val().activityRatio != null) {
        let row = document.createElement('tr');
        let gradeName = document.createElement('td');
        gradeName.innerText = "Activity/Quiz";
        let gradeWeight = document.createElement('td');
        gradeWeight.innerText = snapshot.val().activityRatio + '%';
        let grade = document.createElement('td');
        grade.innerText = snapshot.val().activityGrade == "" ? "Not found" : snapshot.val().activityGrade;
        row.appendChild(gradeName);
        row.appendChild(gradeWeight);
        row.appendChild(grade);
        grade_table.appendChild(row);
      }
      if (snapshot.val().labsRatio != null) {
        let row = document.createElement('tr');
        let gradeName = document.createElement('td');
        gradeName.innerText = "Labs";
        let gradeWeight = document.createElement('td');
        gradeWeight.innerText = snapshot.val().labsRatio + '%';
        let grade = document.createElement('td');
        grade.innerText = snapshot.val().labsGrade == "" ? "Not found" : snapshot.val().labsGrade;
        row.appendChild(gradeName);
        row.appendChild(gradeWeight);
        row.appendChild(grade);
        grade_table.appendChild(row);
      }
      if (snapshot.val().projectsAssignmentRatio != null) {
        let row = document.createElement('tr');
        let gradeName = document.createElement('td');
        gradeName.innerText = "Assignment";
        let gradeWeight = document.createElement('td');
        gradeWeight.innerText = snapshot.val().projectsAssignmentRatio + '%';
        let grade = document.createElement('td');
        grade.innerText = snapshot.val().projectsAssignmentGrade == "" ? "Not found" : snapshot.val().projectsAssignmentGrade;
        row.appendChild(gradeName);
        row.appendChild(gradeWeight);
        row.appendChild(grade);
        grade_table.appendChild(row);
      }
      if (snapshot.val().midtermRatio != null) {
        let row = document.createElement('tr');
        let gradeName = document.createElement('td');
        gradeName.innerText = "Midterm Exam";
        let gradeWeight = document.createElement('td');
        gradeWeight.innerText = snapshot.val().midtermRatio + '%';
        let grade = document.createElement('td');
        grade.innerText = snapshot.val().midtermGrade == "" ? "Not found" : snapshot.val().midtermGrade;
        row.appendChild(gradeName);
        row.appendChild(gradeWeight);
        row.appendChild(grade);
        grade_table.appendChild(row);
      }
      if (snapshot.val().finalRatio != null) {
        let row = document.createElement('tr');
        let gradeName = document.createElement('td');
        gradeName.innerText = "Final Exam";
        let gradeWeight = document.createElement('td');
        gradeWeight.innerText = snapshot.val().finalRatio + '%';
        let grade = document.createElement('td');
        grade.innerText = snapshot.val().finalGrade == "" ? "Not found" : snapshot.val().finalGrade;
        row.appendChild(gradeName);
        row.appendChild(gradeWeight);
        row.appendChild(grade);
        grade_table.appendChild(row);
      }
      let row = document.createElement('tr')
      let gradeName = document.createElement('td');
      gradeName.setAttribute('class', 'no-border course-total');
      gradeName.innerText = "Course total";
      let gradeWeight = document.createElement('td');
      gradeWeight.setAttribute('class', 'no-border course-total');
      let grade = document.createElement('td');
      grade.setAttribute('class', 'no-border course-total');
      grade.innerText = calculateOverallGrade(snapshot.val());
      row.appendChild(gradeName);
      row.appendChild(gradeWeight);
      row.appendChild(grade);
      grade_table.appendChild(row);
    }
  })
}

let classContent = document.getElementById('classContent');
function load_course_content(classContent) {
  get(ref(db, `Courses/${currentCourseId}/Classes/${currentCourseClass}/sections`))
  .then((snapshot) => {
    if(snapshot.exists()) {
      Object.entries(snapshot.val()).forEach((section) => {
        if (section[0] != "sectionCount") {
          let contents = section[1];

          let sectionDiv = document.createElement('div');

          let sectionTitle = document.createElement('h2');
          sectionTitle.setAttribute('class', "section-title");
          sectionTitle.innerText = contents.sectionName;
          sectionDiv.appendChild(sectionTitle);

          let divider = document.createElement('div');
          divider.setAttribute('class', 'divider');
          sectionDiv.appendChild(divider);

          Object.entries(contents).forEach((content) => {
            if (content[0] != 'contentCount' && content[0] != 'sectionName') {
              console.log(content[1]);
              let contentDiv = document.createElement('div');
              contentDiv.setAttribute('class', 'content-item')
              
              let thumbnail = document.createElement('div');
              thumbnail.setAttribute('class', 'content-thumbnail');
              contentDiv.appendChild(thumbnail);

              let content_name = document.createElement('a');
              content_name.classList.add('content-title');
              content_name.innerText = content[1].contentName;
              content_name.setAttribute('href', content[1].link);
              contentDiv.appendChild(content_name);

              sectionDiv.appendChild(contentDiv);
            }
          })

          classContent.appendChild(sectionDiv);
        }
      })
    }
  })
}

if (currentCourseInfo != null) load_course_info();
if (grade_table != null) load_student_grade(grade_table);
if (classContent != null) load_course_content(classContent);