import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  update,
  get,
  child,
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
const dbRef = ref(db);

const container = document.getElementById("content-container");

let course_link = "";
let user_info = JSON.parse(sessionStorage.getItem("user-info"));
let user_role = JSON.parse(sessionStorage.getItem("user-role")).role;
if (user_role == "Teachers") course_link = "./teacher_course.html";
else if (user_role == "Students") course_link = "./course-student.html";
// console.log( `Roles/${user_role}/${user_info.user_id}/Courses`);


async function load_teacher_course() {
  let i = 0;
  await get(
    child(dbRef, `Roles/${user_role}/${user_info.user_id}/Courses`)
  ).then((snapshot) => {
    if (snapshot.exists()) {
      let courses = snapshot.val();
      Object.entries(courses).forEach((course) => {
        // console.log(course);
        let course_id = course[0];
        let course_class = ""
        if (user_role == 'Teachers')
        {
          course_class = course[1].class;
        }
        else if (user_role == 'Students')
        {
          course_class = Object.entries(course[1])[0][0];
        }






        Object.entries(course_class).forEach((courseClass) => {
          console.log(courseClass[0]);
          const borderdiv = document.createElement("div");
          borderdiv.className = "content-border";

          const div = document.createElement("div");
          div.className = "content-item";
          div.id = `course${i}`;
          const thumbnailDiv = document.createElement("div");
          thumbnailDiv.className = "content-thumbnail";

          // Tạo tiêu đề
          const title = document.createElement("h3");
          title.className = "content-title";
          // Tạo một thẻ a bên trong tiêu đề
          const link = document.createElement("a");
          link.href = course_link; //link tới trang điểm của course
          link.setAttribute('onClick', `saveClassInfo("${course_id}", "${courseClass[0]}")`)
          let course_name = "";
          get(child(dbRef, `Courses/${course_id}/name`)).then((snapshot) => {
            if (snapshot.exists()) {
              link.textContent = `${course_id} - ${snapshot.val()} - ${courseClass[0]}`;
            } else {
              console.log("fail");
            }
          });
          title.appendChild(link);

          // Tạo một thẻ br để xuống dòng
          const br = document.createElement("br");
          title.appendChild(br);
          // Tạo một thẻ p bên trong tiêu đề
          const teacher = document.createElement("a");
          teacher.href = course_link; //link tới trang khóa học chính

          let teacher_name = "";
          let teacherId = "";
          get(
            child(dbRef, `Courses/${course_id}/Classes/${courseClass[0]}/teacherId`)
          ).then((snapshot) => {
            if (snapshot.exists()) {
              get(child(dbRef, `Roles/Teachers/${snapshot.val()}`)).then(
                (snapshot) => {
                  if (snapshot.exists()) {
                    teacher.textContent =
                      snapshot.val().firstname + " " + snapshot.val().lastname;
                  }
                }
              );
            }
          });

          title.appendChild(teacher);

          // Thêm div thumbnail và tiêu đề vào div cha
          div.appendChild(thumbnailDiv);
          div.appendChild(title);

          // Thêm div cha vào thẻ cha
          container.appendChild(borderdiv);
          container.appendChild(div);

          i++;
          })
      });
    }
  });
}

async function load_student_course() {
  let i = 0;
  await get(
    child(dbRef, `Roles/${user_role}/${user_info.user_id}/Courses`)
  ).then((snapshot) => {
    if (snapshot.exists()) {
      let courses = snapshot.val();
      Object.entries(courses).forEach((course) => {
        // console.log(course);
        let course_id = course[0];
        let course_class = ""
        if (user_role == 'Teachers')
        {
          course_class = course[1].class;
        }
        else if (user_role == 'Students')
        {
          course_class = Object.entries(course[1])[0][0];
        }

        const borderdiv = document.createElement("div");
        borderdiv.className = "content-border";

        const div = document.createElement("div");
        div.className = "content-item";
        div.id = `course${i}`;
        const thumbnailDiv = document.createElement("div");
        thumbnailDiv.className = "content-thumbnail";

        // Tạo tiêu đề
        const title = document.createElement("h3");
        title.className = "content-title";
        // Tạo một thẻ a bên trong tiêu đề
        const link = document.createElement("a");
        link.href = course_link; //link tới trang điểm của course
        link.setAttribute('onClick', `saveClassInfo("${course_id}", "${course_class}")`)
        let course_name = "";
        get(child(dbRef, `Courses/${course_id}/name`)).then((snapshot) => {
          if (snapshot.exists()) {
            link.textContent = `${course_id} - ${snapshot.val()} - ${course_class}`;
          } else {
            console.log("fail");
          }
        });
        title.appendChild(link);

        // Tạo một thẻ br để xuống dòng
        const br = document.createElement("br");
        title.appendChild(br);
        // Tạo một thẻ p bên trong tiêu đề
        const teacher = document.createElement("a");
        teacher.href = course_link; //link tới trang khóa học chính

        let teacher_name = "";
        let teacherId = "";
        get(
          child(dbRef, `Courses/${course_id}/Classes/${course_class}/teacherId`)
        ).then((snapshot) => {
          if (snapshot.exists()) {
            get(child(dbRef, `Roles/Teachers/${snapshot.val()}`)).then(
              (snapshot) => {
                if (snapshot.exists()) {
                  teacher.textContent =
                    snapshot.val().firstname + " " + snapshot.val().lastname;
                }
              }
            );
          }
        });

        title.appendChild(teacher);

        // Thêm div thumbnail và tiêu đề vào div cha
        div.appendChild(thumbnailDiv);
        div.appendChild(title);

        // Thêm div cha vào thẻ cha
        container.appendChild(borderdiv);
        container.appendChild(div);

        i++;
      });
    }
  });
}

if(user_role == 'Students')  load_student_course();
if(user_role == 'Teachers') load_teacher_course();
