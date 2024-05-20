
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import {
    get,
    getDatabase,
    ref
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



//Lay Element tu HTML
const numbersOfStudentOutput = document.getElementById('numst')
const numbersOfTeachertOutput = document.getElementById('numteacher')
const numbersOfCourseOutput = document.getElementById('numcourse')
const numbersOfClassOutput = document.getElementById('numclass')

//----------------------------------------------------------------

// Lấy dữ liệu từ một nút cụ thể
//Output Student
const dataStudentRef = ref(db, '/Roles/Students');
get(dataStudentRef).then((snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        //doi Object qua Array 
        const num = Object.keys(data).length;
        numbersOfStudentOutput.textContent = `${num} Students`;
        //Kiem tra thong tin lay duoc
        // console.log(num);
        // console.log(typeof(data));
        // console.log(data);
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error('Error fetching data:', error);
});
//output Teacher
const dataTeacherRef = ref(db, '/Roles/Teachers');
get(dataTeacherRef).then((snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        //doi Object qua Array 
        const num = Object.keys(data).length;
        numbersOfTeachertOutput.textContent = `${num} Teachers`;
        //Kiem tra thong tin lay duoc
        // console.log(num);
        // console.log(typeof(data));
        // console.log(data);
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error('Error fetching data:', error);
});
//output Course, class vi Class = Course
const dataCourseRef = ref(db, '/Courses');
get(dataCourseRef).then((snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        //doi Object qua Array 
        const courseNum = Object.keys(data).length;
        let classNum = 0;
        numbersOfCourseOutput.textContent = `${courseNum} Courses`;
        Object.entries(data).forEach((obj) => {
            // console.log(Object.keys(obj[1].Classes))
            if (obj[1].Classes != null) classNum += Object.keys(obj[1].Classes).length
        })
        numbersOfClassOutput.textContent = `${classNum} Classes`;
        //Kiem tra thong tin lay duoc
        // console.log(num);
        // console.log(typeof(data));
        // console.log(data);
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error('Error fetching data:', error);
});
