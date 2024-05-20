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
//----------------------------------------------------------------
// console.log("connect adminGrade.js");
//----------------------------------------------------------------
//Lay Element tu HTML va console.log ra Element
const container = document.getElementById("content-container");
//Lay thong tin cua Course
const dataCourseRef = ref(db, "/Courses");
if (container != null) {
  get(dataCourseRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      // console.log(snapshot.val());
      const data = snapshot.val();
      //doi Object qua Array
      const dataLength = Object.keys(data).length;
      const dataArray = Object.entries(data);
      //thong tin can them vao Frontend
      // console.log(dataArray[0][1].Classes);
      for (let i = 0; i < dataLength; i++) {
        let courseCode = dataArray[i][0];
        // console.log(courseCode);
        // console.log(courseCode.Classes);
        // if (dataArray[i][0].Classes == null) continue;
        const div = document.createElement("div");
        div.className = "content-item show";
        div.id = `course${i}`;

        const thumbnailDiv = document.createElement("div");
        // Thêm class "content-thumbnail" cho div thumbnail
        thumbnailDiv.className = "content-thumbnail";

        const title = document.createElement("h3");
        const courseName = `${dataArray[i][1].name} (${courseCode})`; //Course Name
        title.className = "content-title";
        // Tạo một thẻ a bên trong tiêu đề

        const link = document.createElement("a");
        link.href = "./ad_grade.html";
        link.setAttribute('onclick',`saveCurrentCourse("${courseCode}")`);
        link.id = `${courseCode}`;
        link.textContent = courseName;
        title.appendChild(link);

        div.appendChild(thumbnailDiv);
        div.appendChild(title);

        // Thêm div cha vào thẻ cha
        container.appendChild(div);
        // if (dataArray[i][1].Classes != null) 
        // {
        //   console.log(dataArray[i][1].Classes);
        //   Object.entries(dataArray[i][1].Classes).forEach((courseClass) => {
        //   });
        // }
      }
      //Kiem tra thong tin lay duoc
      // console.log(typeof(data));
      // console.log(typeof(dataLength));
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
}

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

function Grade_4(gradeItems){
  let sum = calculateOverallGrade(gradeItems);
  if (sum == "Not found") return sum;
  if (sum >= 0 && sum < 4) {
    return "F";
  } else if (sum >= 4 && sum < 5) {
    return "D";
  } else if (sum >= 5 && sum < 5.5) {
    return "D+";
  } else if (sum >= 5.5 && sum < 6.5) {
    return "C";
  } else if (sum >= 6.5 && sum < 7) {
    return 'C+';
  } else if (sum >= 7 && sum < 8) {
    return 'B';
  } else if (sum >= 8 && sum < 8.5) {
    return 'B+';
  } else if (sum >= 8.5 && sum < 10) {
    return 'A';
  } 
}

function Grade_10(gradeItems){
  let sum = calculateOverallGrade(gradeItems);
  if (sum == "Not found") return sum;
  return Math.round(sum * 100) / 100;
}

function create_grade_table_row(studentName, studentID, courseClassId, studentGrade) {
  let row = document.createElement('tr');

  let td_studentName = document.createElement('td');
  td_studentName.innerText = studentName;
  
  let td_studentID = document.createElement('td');
  td_studentID.innerText = studentID.substring(studentID.length - 6);

  let td_courseClassId = document.createElement('td');
  td_courseClassId.innerText = courseClassId;

  let td_GPA_4 = document.createElement('td');
  td_GPA_4.innerText = Grade_4(studentGrade);

  let td_GPA_10 = document.createElement('td');
  td_GPA_10.innerText = Grade_10(studentGrade);

  row.appendChild(td_studentName);
  row.appendChild(td_studentID);
  row.appendChild(td_courseClassId);
  row.appendChild(td_GPA_4);
  row.appendChild(td_GPA_10);

  return row;
}

function load_grade_table() {
  let courseID = sessionStorage.getItem('currentCourseID');
  // console.log(courseID);
  get(ref(db, `Courses/${courseID}/Classes`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      // console.log(snapshot.val());
      Object.entries(snapshot.val()).forEach((courseClass) => {
        // console.log(courseClass[0]);
        // console.log(courseClass[1]);
        let courseClassId = courseClass[0];
        if (courseClass[1].studentIds != null) {
          Object.entries(courseClass[1].studentIds).forEach((student) => {
            let studentID = student[0];
            let studentGrade = student[1].grades;
            // console.log(studentID);
            // console.log(studentGrade);
            get(ref(db, `Roles/Students/${studentID}`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                let studentName = snapshot.val().firstname + " " + snapshot.val().lastname
                // console.log(studentName);
                // console.log(studentID);
                // console.log(courseClassId);
                // console.log(studentGrade);
                document.getElementById('grade-table').appendChild(create_grade_table_row(studentName, studentID, courseClassId, studentGrade));
              }
            })
          })
        }
      })
    }
  })
}

if (document.getElementById('grade-table') != null) load_grade_table();
// else {console.log("BUG")}

// // let courseClasses = document.getElementsByClassName('courseClass');
// get(dataCourseRef).then((snapshot) => {
//   if (snapshot.exists()) {
//     // console.log(snapshot.val());
//     let grades = {};
//     const data = snapshot.val();
//     const dataLength = Object.keys(data).length;
//     const dataArray = Object.entries(data);
//     for (let i = 0; i < dataLength; i++) {
//       let courseCode = dataArray[i][0];
//       grades[courseCode] = {};
//       Object.entries(dataArray[i][1].Classes).forEach((courseClass) => {
//         let classCode = courseClass[0];
//         // console.log(classCode);
//         grades[courseCode][classCode] = {};
//         // console.log(grades);
//         if (courseClass[1]['studentIds'] == null) {
//           console.log("empty")
//         }
//         else {
//           Object.entries(courseClass[1]['studentIds']).forEach((student) => {
//             let student_id = student[0].substring(student[0].length - 6);
//             let grade_4 = Grade_4(student[1].Grades);
//             let grade_10 = Grade_10(student[1].Grades);
            
//             get(ref(db, `Roles/Students/${student[0]}`)).then((snapshot) => {
//               if (snapshot.exists()) {
//                 let student_name = snapshot.val().firstname + " " + snapshot.val().lastname;
//                 grades[courseCode][classCode][student[0]] = {
//                   student_id: student_id,
//                   student_name: student_name,
//                   grade_4: grade_4,
//                   grade_10: grade_10
//                 };
//                 // console.log(courseCode);
//                 // // console.logo(classCode);
//                 // console.log(student_id);
//                 // console.log(student_name);
//                 // console.log(grade_4);
//                 // console.log(grade_10);
//               }
//             })

//           }) 
//         }
        
//         // console.log(courseClass[1]['studentIds']);
//       })
//       // grades[courseCode] = "1";
//     }
//     // console.log(grades);
//     // console.log(JSON.parse(JSON.stringify(grades)));
//     // localStorage.setItem('gradeItems', grades);
//     // sessionStorage.setItem('gradeItems', JSON.stringify(grades));
//   }

// })