import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
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
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// const storage = getStorage(app);

const sectionNameRef = ref(db, "sectionNames");
const currentClass = JSON.parse(sessionStorage.getItem("currentClass"));
const currentCourseId = currentClass.course_id;
const currentCourseClass = currentClass.course_class;

let classContent = document.getElementById("body-table");
async function load_course_content(classContent) {
  get(
    ref(db, `Courses/${currentCourseId}/Classes/${currentCourseClass}/sections`)
  )
    .then((snapshot) => {
      if (snapshot.exists()) {
        Object.entries(snapshot.val()).forEach((section) => {
          if (section[0] != "sectionCount") {
            let currentSection = section[0];
            let contents = section[1];

            let sectionDiv = document.createElement("div");

            let headDiv = document.createElement("div");
            headDiv.classList.add("sectionTitle")

            let sectionTitle = document.createElement("h2");
            sectionTitle.setAttribute("class", "section-title");
            sectionTitle.innerText = contents.sectionName;
            // sectionDiv.appendChild(sectionTitle);

            let editSection = document.createElement('button');
            editSection.innerText = "Edit/Delete Section"
            editSection.setAttribute('onclick', `showEditSectionPanel(${currentSection},"${contents.sectionName}")`)

            headDiv.appendChild(sectionTitle);
            headDiv.appendChild(editSection);

            sectionDiv.appendChild(headDiv);

            let divider = document.createElement("div");
            divider.setAttribute("class", "divider");
            sectionDiv.appendChild(divider);

            Object.entries(contents).forEach((content) => {
              if (content[0] != "contentCount" && content[0] != "sectionName") {
                let contentDiv = document.createElement("div");
                contentDiv.setAttribute("class", "content-item");

                let thumbnail = document.createElement("div");
                thumbnail.setAttribute("class", "content-thumbnail");
                contentDiv.appendChild(thumbnail);

                console.log(content[1]);

                let content_name = document.createElement("a");
                content_name.classList.add("content-title");
                content_name.id = `${section[0]}-${content[0]}`;
                content_name.innerText = content[1].contentName;
                content_name.setAttribute("href", content[1].link);
                contentDiv.appendChild(content_name);

                let editSection = document.createElement('button');
                editSection.innerText = "Edit/Delete Content";
                editSection.setAttribute("onclick", `showEditContentPanel(${currentSection},${content[0]})`);
                contentDiv.appendChild(editSection);

                sectionDiv.appendChild(contentDiv);
              }
            });
            let content_create = document.createElement("div");
            content_create.classList.add("content-create");
            content_create.innerHTML = `
            <div class="content-thumbnail">
            <img src="./img/add_button.png">
            </div>
            <button type="button" class="create-content-btn" id="${currentSection}" onclick="showCreateContentPanel(${currentSection})" >Create Content</button>
          `;
            sectionDiv.appendChild(content_create);
            classContent.appendChild(sectionDiv);
          }
        });
      }
    //   let section_create = document.createElement("div");
    //   section_create.classList.add("new-section");
    //   section_create.innerHTML = `
    //     <div class="create-section-btn">
    //     <button id='showSectionPanel' onclick="showCreateSectionPanel()">Create new section</button>
    //     </div>
    //     <input type="text" id="section-name-input" style="display: none;" placeholder="Enter a name for the new section">
    //     <div class="divider"></div>
    // `;
    //   classContent.appendChild(section_create);
    })
    .catch((error) => {
      console.log(error);
    });
}

let createContent = (event) => {
  event.preventDefault();
  let contentName = document.getElementById('name-input').value;
  let contentLink = document.getElementById('link-input').value;
  let currentSection = sessionStorage.getItem('currentSection');
  get(ref(db, `Courses/${currentCourseId}/Classes/${currentCourseClass}/sections/${currentSection}`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      let newContentIndex = Number(snapshot.val().contentCount) + 1;
      console.log(`Courses/${currentCourseId}/Classes/${currentCourseClass}/sections/${currentSection}`);
      update(ref(db, `Courses/${currentCourseId}/Classes/${currentCourseClass}/sections/${currentSection}`), {
        'contentCount': String(newContentIndex)
      });
      set(ref(db, `Courses/${currentCourseId}/Classes/${currentCourseClass}/sections/${currentSection}/${newContentIndex}`), {
        link: contentLink,
        'contentName': contentName,
      })
    }
  })
  alert("Tạo nội dung mới thành công")
  window.location.reload();
}

let deleteContent = (event) => {
  event.preventDefault();
  let currentEdit = JSON.parse(sessionStorage.getItem('currentSection'));
  remove(ref(db, `Courses/${currentCourseId}/Classes/${currentCourseClass}/sections/${currentEdit.sectionIndex}/${currentEdit.contentIndex}`));
  alert("Xoá nội dung thành công")
  window.location.reload();
}

document.getElementById('deleteContentBtn').addEventListener('click', deleteContent);

let updateContent = (event) => {
  event.preventDefault();
  let currentEdit = JSON.parse(sessionStorage.getItem('currentSection'));
  let newContentName = document.getElementById('edit-content-name-input').value;
  if (newContentName != null && newContentName != "") {
    update(ref(db, `Courses/${currentCourseId}/Classes/${currentCourseClass}/sections/${currentEdit.sectionIndex}/${currentEdit.contentIndex}`), {
      'contentName': newContentName
    })
  }
  let newContentLink = document.getElementById('edit-content-link-input').value;
  if (newContentLink != null && newContentLink != "") {
    update(ref(db, `Courses/${currentCourseId}/Classes/${currentCourseClass}/sections/${currentEdit.sectionIndex}/${currentEdit.contentIndex}`), {
      'link': newContentLink
    })
  }
  alert("Cập nhật nội dung thành công")
  window.location.reload();
}

document.getElementById('updateContentBtn').addEventListener('click', updateContent);

if (classContent != null) load_course_content(classContent);

let createSection = (event) => {
  event.preventDefault();
  let sectionName = document.getElementById('section-name-input').value;
  get(ref(db, `Courses/${currentCourseId}/Classes/${currentCourseClass}/sections/sectionCount`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      let newSectionCount = Number(snapshot.val()) + 1;
      update(ref(db, `Courses/${currentCourseId}/Classes/${currentCourseClass}/sections`), {
        'sectionCount': String(newSectionCount)
      })
      set(ref(db, `Courses/${currentCourseId}/Classes/${currentCourseClass}/sections/${newSectionCount}`), {
        'contentCount': 0,
        'sectionName' : sectionName,
      })
      alert("Tạo mục mới thành công");
      window.location.reload();
    }
    else {
      console.log("BUG")
    }
  })
}

let updateSection = (event) => {
  event.preventDefault();
  let currentEdit = JSON.parse(sessionStorage.getItem('currentSection'));
  let sectionIndex = currentEdit.sectionIndex;
  let newSectionName = document.getElementById('edit-section-name-input').value;
  if (newSectionName != null && newSectionName != "") {
    update(ref(db, `Courses/${currentCourseId}/Classes/${currentCourseClass}/sections/${sectionIndex}`), {
      'sectionName' : newSectionName,
    })
  }
  alert("Cập nhật mục thành công")
  window.location.reload();
}

let deleteSection = (event) => {
  event.preventDefault();
  let currentEdit = JSON.parse(sessionStorage.getItem('currentSection'));
  let sectionIndex = currentEdit.sectionIndex;
  remove(ref(db, `Courses/${currentCourseId}/Classes/${currentCourseClass}/sections/${sectionIndex}`))
  alert("Xóa mục thành công")
  window.location.reload();
}

document.getElementById('deleteSectionBtn').addEventListener('click', deleteSection);

document.getElementById('updateSectionBtn').addEventListener('click', updateSection);

document.getElementById('section-name-btn').addEventListener('click', createSection);

document.getElementById('createContentBtn').addEventListener('click', createContent);



// get(sectionNameRef).then((snapshot) => {
//     if(snapshot.exists()){
//         snapshot.forEach((sectionSnapshot) => {
//             var sectionName = sectionSnapshot.val().sectionName;
//             let newSectionElement = document.createElement('div');
//             newSectionElement.className = `${sectionName.toLowerCase()}-info`;
//             newSectionElement.innerHTML =
//             `<h2 class="section-title">${sectionName}</h2>
//             <div class="divider"></div>

//             <div class="content-item">
//               <div class="content-thumbnail"></div>
//               <h3 class="content-title">Content name</h3>
//             </div>

//             <div class="content-create">
//               <div class="content-thumbnail">
//                 <img src="./img/add_button.png" alt="">
//               </div>
//               <button type="button" id="create-content-btn">Create Content</button>
//             </div>`
//             let bodyTable = document.querySelector(".body-table");
//             let newSection = document.querySelector(".new-section");
//             bodyTable.insertBefore(newSectionElement, newSection);
//             //bodyTable.appendChild(newSectionElement);
//         })
// }   let createContent = document.querySelectorAll('.content-create');
//     console.log(createContent);
//     createContent.forEach(content => {
//         let button = content.querySelector('#create-content-btn');
//         let go_back_btn = document.getElementById('go-back');
//         let body_table = document.getElementById('body-table');
//         let create_content_panel = document.getElementById('create-content-panel')
//         button.addEventListener('click', function() {
//             let sectionElement = this.parentNode.parentNode;
//             let sectionTitleElement = sectionElement.querySelector('.section-title');
//             let sectionName = sectionTitleElement.textContent;

//             body_table.style.display = "none";
//             create_content_panel.style.display = "block";

//             go_back_btn.onclick = function() {
//                 body_table.style.display = "block";
//                 create_content_panel.style.display = "none";
//             }

//             let file_checkbox = document.getElementById('file-checkbox');
//             let text_checkbox = document.getElementById('text-checkbox');
//             let file_upload_panel = document.getElementById('file-upload-panel');
//             let text_input_panel = document.getElementById('text-input-panel')

//             file_checkbox.onclick = function() {
//               if (file_checkbox.checked) {
//                 file_upload_panel.style.display = "block";
//               }
//               else {
//                 file_upload_panel.style.display = "none";
//               }
//             }

//             text_checkbox.onclick = function() {
//               if (text_checkbox.checked) {
//                 text_input_panel.style.display = "block";
//               }
//               else {
//                 text_input_panel.style.display = "none";
//               }
//             }

//             function uploadFile(){
//                 let fileInput=document.getElementById("file-upload");
//                 let file=fileInput.files[0];
//                 let contentNameInput=document.getElementById("name-input");
//                 let contentName=contentNameInput.value;
//                 if (!contentName || !file) {
//                     console.log("Content name or file is empty.");
//                     return;
//                 }
//                 let storageRef=ref(storage, 'fileList/'+ file.name);
//                 let uploadTask = uploadBytesResumable(storageRef, file);
//                 uploadTask.on('state_changed',function(snapshot){
//                     let progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
//                     console.log('Upload is '+progress+'% done');
//                 },function(error){
//                     console.log(error);
//                 },function(){
//                     getDownloadURL(uploadTask.snapshot.ref).then(function(downloadURL){
//                         console.log('File available at',downloadURL);
//                         let contentRecordRef = dbRef(db, 'contentRecords/'+ sectionName + '/' + contentName);
//                         update(contentRecordRef, {
//                             downloadURL: downloadURL
//                         }).catch((error) => {
//                             console.log(error);
//                         });
//                     });
//                 });
//             }
//             function uploadText(){
//                 let textInput=document.getElementById("text-input");
//                 let contentNameInput=document.getElementById("name-input");
//                 let contentName=contentNameInput.value;
//                 let text=textInput.value;
//                 if (!contentName || !text) {
//                     console.log("Content name or text is empty.");
//                     return;
//                 }
//                 let contentRecordRef = dbRef(db, 'contentRecords/'+ sectionName + '/' + contentName);
//                 update(contentRecordRef, {
//                     text: text
//                 })
//                 .catch((error) => {
//                     console.log(error);
//                 });
//             }
//             let submitButton=document.querySelector("button[type='submit']");
//             submitButton.addEventListener("click",function(event){
//                 event.preventDefault();
//                 let fileCheckbox=document.getElementById("file-checkbox");
//                 let textCheckbox=document.getElementById("text-checkbox");
//                 if(fileCheckbox.checked){
//                     uploadFile();
//                 }
//                 if(textCheckbox.checked){
//                     uploadText();
//                 }
//                 alert("Content created successfully!");
//             });

//         });
//     });
// })
// let CreateSectionButton=document.querySelector(".create-section-btn");
// CreateSectionButton.addEventListener("click", async function(event){
//     event.preventDefault();
//     let sectionNameInput=document.getElementById("section-name-input");
//     sectionNameInput.style.display = 'block';
//     sectionNameInput.addEventListener('keydown', async function(event) {
//     if (event.key === 'Enter') {
//     event.preventDefault();
//     sectionNameInput.style.display = 'none';
//     let sectionName=sectionNameInput.value;
//     let snapshot = await get(sectionNameRef);
//     let match = false;
//     if(snapshot.exists()){
//         snapshot.forEach((sectionSnapshot) => {
//             var sectionNamedb = sectionSnapshot.val().sectionName;
//             if(sectionNamedb === sectionName){
//                 console.log("Input section name matches with a section name in the database");
//                 match = true;
//             }
//         })
//     }
//     if(match){
//         return;
//     }
//     let courseRef=dbRef(db,'sectionNames/' + sectionName);
//     set(courseRef, {
//         sectionName: sectionName
//     }).catch((error) => {
//         console.log(error);
//     });
//     let newSectionElement = document.createElement('div');
//     newSectionElement.className = `${sectionName.toLowerCase()}-info`;
//     newSectionElement.innerHTML = `<h2 class="section-title">${sectionName}</h2>
//     <div class="divider"></div>

//     <div class="content-item">
//       <div class="content-thumbnail"></div>
//       <h3 class="content-title">Content name</h3>
//     </div>

//     <div class="content-create">
//       <div class="content-thumbnail">
//         <img src="./img/add_button.png" alt="">
//       </div>
//       <button type="button" id="create-content-btn">Create Content</button>
//     </div>`
//     let bodyTable = document.getElementById("body-table");
//     let newSection = document.querySelector(".new-section");
//     bodyTable.insertBefore(newSectionElement, newSection);
//     }})
// });
