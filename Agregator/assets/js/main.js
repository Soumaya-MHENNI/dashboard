// add hovered class to selected list item
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};
//Add Activity
let NewActivity=document.querySelector(".activity")
let BoxInputEvent=document.getElementById("BoxInputEvent")
let addActivityBtn1=document.querySelector(".iconBx-addEvent1")
addActivityBtn1.style.display="none"
let addActivityBtn=document.querySelector(".iconBx-addEvent")
let EmptyEvent=document.getElementById("EmptyEvent")
let inPutActivity = document.createElement("input")

addActivityBtn.addEventListener('click',()=>{
  inPutActivity.value="";
addActivityBtn.style.display="none";
inPutActivity.setAttribute("type","text");
inPutActivity.style.display ="block"
addActivityBtn1.style.display="block";
BoxInputEvent.insertBefore(inPutActivity,BoxInputEvent.children[0])
NewActivity.removeChild(EmptyEvent)



})

addActivityBtn1.addEventListener('click',()=>{
  let inPutActivityValue=inPutActivity.value;
if(inPutActivity.value.trim() !== ""){
  let insertActivity = document.createElement("p")
 insertActivity.innerText= inPutActivityValue;

NewActivity.appendChild(insertActivity)

addActivityBtn.style.display="block";
addActivityBtn1.style.display="none";
inPutActivity.style.display ="none"

}

})  