const addButton = document.querySelector("#add-task");
const modal = document.querySelector(".modal");
const cancelButton = document.querySelector(".cancel");
const createTaskButton = document.querySelector("#create");

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

let dragElement = null;
let taskData={};
const columns=[todo, progress, done];

function addTask(title, desc,column){
  const div = document.createElement("div");
  div.classList.add("task");  
  div.setAttribute("draggable", "true");
  div.innerHTML = `
    <h4>${title}</h4>
    <p>${desc}</p>
    <button class="btn delete">Delete</button>
  `;

  column.appendChild(div);
  div.addEventListener("drag", (e) => {
    dragElement = div;
  });
  const deleteButton = div.querySelector(".delete");
  deleteButton.addEventListener("click", (e) => {
    div.remove();
    count();
  });
  return div;
}

function count(){
  columns.forEach((col) => {
      const tasks = col.querySelectorAll(".task");
      const count = col.querySelector(".count");
      count.innerText = tasks.length;
      taskData[col.id]=Array.from(tasks).map(t=>{
        return{
          title:t.querySelector("h4").innerText,
          desc:t.querySelector("p").innerText
        }
      })

      localStorage.setItem("taskData",JSON.stringify(taskData));
    })
}

if(localStorage.getItem("taskData")){
  const data=JSON.parse(localStorage.getItem("taskData"));
  for (const col in data){
    const column = document.querySelector(`#${col}`);
    data[col].forEach(task=>{
      addTask(task.title,task.desc,column);
      count();
    });
  }
}

const tasks = document.querySelectorAll(".task");

tasks.forEach((task) => {
  task.addEventListener("dragstart", (e) => {
    dragElement = task;
  });
});

function dragHover(col) {
  col.addEventListener("dragenter", (e) => {
    e.preventDefault();
    col.classList.add("hover-over");
  });
  col.addEventListener("dragleave", (e) => {
    e.preventDefault();
    col.classList.remove("hover-over");
  });
  col.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  col.addEventListener("drop", (e) => {
    e.preventDefault();

    col.appendChild(dragElement);
    col.classList.remove("hover-over");

    count();  
  });
}

function createTask() {
  addButton.addEventListener("click", (e) => {
    modal.classList.add("active");
  });

  cancelButton.addEventListener("click", (e) => {
    modal.classList.remove("active");
  });

  createTaskButton.addEventListener("click", (e) => {
    let taskTitle = document.querySelector("#title").value;
    let taskdesc = document.querySelector("#desc").value;
    addTask(taskTitle, taskdesc, todo);
    count();
    
    modal.classList.remove("active");

    document.querySelector("#title").value = "Title";
    document.querySelector("#desc").value = "Description"; 
  });
}
// createTaskButton.addEventListener('click',(e)=>{
//   let taskTitle= document.querySelector("#title").value;
//   let taskdesc= document.querySelector("#desc").value;
// })

createTask();
dragHover(todo);
dragHover(progress);
dragHover(done);
