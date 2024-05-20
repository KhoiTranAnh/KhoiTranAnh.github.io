import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
    getDatabase,
    ref as dbRef,
    get
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
const db = getDatabase(app);
const contentRecordRef = dbRef(db, 'contentRecords');
const sectionNameRef = dbRef(db, 'sectionNames');
get(sectionNameRef).then((snapshot) => {
    if(snapshot.exists()){
        snapshot.forEach((sectionSnapshot) => {
            var sectionName = sectionSnapshot.val().sectionName;
            let newSectionElement = document.createElement('div');
            newSectionElement.className = `${sectionName.toLowerCase()}-info`;
            newSectionElement.innerHTML = 
            `<h2 class="section-title">${sectionName}</h2>
            <div class="divider"></div>
            <div class="content-item">
              <div class="content-thumbnail"></div>
              <h3 class="content-title">Content name</h3>
            </div>
            <div class="content-item">
              <div class="content-thumbnail"></div>
              <h3 class="content-title">Content name</h3>
            </div>
          </div>`
            let bodyTable = document.querySelector(".body-table");
            bodyTable.appendChild(newSectionElement);
        })
}})


get(contentRecordRef).then((snapshot) => {
    if(snapshot.exists()){
        snapshot.forEach((sectionSnapshot) => {
            var sectionName = sectionSnapshot.key;
            var sectionElement = document.querySelector(`.${sectionName.toLowerCase()}-info`);
            var contentItems=sectionElement.querySelectorAll('.content-item');
            var i=0;
            sectionSnapshot.forEach((nameSnapshot) => {
                if(i+1>contentItems.length) {
                    var newContentItem = document.createElement('div');
                    newContentItem.className = 'content-item';
                    newContentItem.innerHTML = `<div class="content-thumbnail"></div>
                    <h3 class="content-title">Content name</h3>`;
                    sectionElement.appendChild(newContentItem);
                    contentItems = sectionElement.querySelectorAll('.content-item');
                }
                var contentName = nameSnapshot.key;
                var text = nameSnapshot.val().text;
                var downloadURL = nameSnapshot.val().downloadURL;

                contentItems[i].querySelector('.content-title').innerHTML = contentName;

                var p=document.createElement('p');
                if(text) p.innerHTML=text+'<br>';
                if(downloadURL){
                    p.innerHTML+=`<a href="${downloadURL}">Download</a>`;
                }
                contentItems[i].appendChild(p);
                i++;
            });
        });
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error(error);
});