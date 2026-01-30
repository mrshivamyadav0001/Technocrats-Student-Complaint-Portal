// RESET DATA (FIRST LOAD)
if(!localStorage.getItem("init")){
 localStorage.clear();
 localStorage.setItem("init","yes");
}

// REGISTER
function registerUser(){
 let users = JSON.parse(localStorage.getItem("users")) || [];
 users.push({
  name:rname.value,
  email:remail.value,
  password:rpassword.value,
  role:rrole.value
 });
 localStorage.setItem("users",JSON.stringify(users));
 location.href="login.html";
}

// LOGIN
function loginUser(){
 let users = JSON.parse(localStorage.getItem("users")) || [];
 let user = users.find(u=>u.email===lemail.value && u.password===lpassword.value);
 if(!user) return alert("Invalid Login");

 localStorage.setItem("currentUser",JSON.stringify(user));
 user.role==="student" ? location.href="student.html" : location.href="faculty.html";
}

// SCROLL
function scrollToSection(id){
 document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

// STUDENT DASHBOARD
function studentDashboard(){
 let user = JSON.parse(localStorage.getItem("currentUser"));
 if(!user) location.href="login.html";

 let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
 let box = document.getElementById("studentData");
 box.innerHTML="";

 complaints.filter(c=>c.student===user.name).forEach(c=>{
  box.innerHTML+=`
   <div>
    <b>Complaint:</b> ${c.complaint}<br>
    <img src="${c.image}" class="preview"><br>
    <b>Status:</b> <span class="status-${c.status}">${c.status}</span><br>
    <b>Solution:</b> ${c.solution || "Pending"}<br>
    ${c.solutionImage ? `<img src="${c.solutionImage}" class="preview">` : ""}
    <hr>
   </div>`;
 });
}

// SUBMIT COMPLAINT
function submitComplaint(){
 let file = document.getElementById("complaintImg").files[0];
 let reader = new FileReader();

 reader.onload = function(){
  let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
  let user = JSON.parse(localStorage.getItem("currentUser"));

  complaints.push({
   student:user.name,
   complaint:complaint.value,
   suggestion:suggestion.value,
   image:reader.result,
   status:"Pending",
   solution:"",
   solutionImage:""
  });

  localStorage.setItem("complaints",JSON.stringify(complaints));
  location.href="thankyou.html";
 };

 if(file) reader.readAsDataURL(file);
}

// FACULTY
function facultyDashboard(){
 let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
 let table = document.getElementById("facultyData");
 table.innerHTML="";

 complaints.forEach((c,i)=>{
  table.innerHTML+=`
   <tr>
    <td>${c.student}</td>
    <td>${c.complaint}</td>
    <td><img src="${c.image}" class="preview"></td>
    <td class="status-${c.status}">${c.status}</td>
    <td><button onclick="solve(${i})">Resolve</button></td>
   </tr>`;
 });
}

// SOLVE WITH IMAGE
function solve(i){
 let sol = prompt("Enter solution text");
 let imgInput = document.createElement("input");
 imgInput.type="file";
 imgInput.accept="image/*";

 imgInput.onchange = function(){
  let reader = new FileReader();
  reader.onload = function(){
   let complaints = JSON.parse(localStorage.getItem("complaints"));
   complaints[i].solution = sol;
   complaints[i].solutionImage = reader.result;
   complaints[i].status = "Resolved";
   localStorage.setItem("complaints",JSON.stringify(complaints));
   location.reload();
  };
  reader.readAsDataURL(imgInput.files[0]);
 };
 imgInput.click();
}

// LOGOUT
function logout(){
 localStorage.removeItem("currentUser");
}
