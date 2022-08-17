const addBtn = document.getElementById('add-button');
const todoInput = document.getElementById('todoInput');
class Todos {
  TodoList = [];

  constructor() {

    this.todoList = document.getElementById('todoList');
    console.log(this.todoList);
    this.getTodo()
    }

 
  getTodo(){
    fetch('http://localhost:3000/api/todo')
    .then(res => res.json())
    .then(data => {
        console.log(data.todos);
      this.TodoList = data.todos;
      this.constructHTML();
    });
  }
  
  constructHTML() {
    console.log(this.TodoList);
    const todos = this.TodoList.map((todo) => {

      if (todo.done == true){
        return `<li id="li-${todo.id}" class="list-group-item d-flex justify-content-between p-3">
              <span>
                    <input type="checkbox" checked id="done-${todo.id}" value="${todo.done}"/>
                    <div class="edit-input d-inline d-none">
                    <input type="text" placeholder="Updated value" id="updatetitle-${todo.id}" />
                     <button class="btn btn-sm btn-primary" id="update-${todo.id}" onclick=updateTodo(id)>Update</button>
                     <button class="btn btn-sm btn-danger" id="cancel-${todo.id}" onclick=cancelTodo(id)>Cancel</button>
                     </div>
                    <p class="todo-input d-inline" id="todo-title-${todo.id}">${todo.todo}</p>
              </span>
              <div>
               <i class="bi bi-pencil-square" id="edit-${todo.id}" onclick=editTodo(id) ></i>
               <i class="bi bi-trash" id="del-${todo.id}" onclick=delTodo(id) ></i>
              </div>
              </li>`;
      }
      else{
        return `<li  id="li-${todo.id}"class="list-group-item d-flex justify-content-between p-3">
              <span>
                    <input type="checkbox" id="done-${todo.id}" value="${todo.done}" />
                    <div class="edit-input d-inline d-none">
                     <input type="text" placeholder="Updated value" id="updatetitle-${todo.id}" />
                     <button class="btn btn-sm btn-primary" id="update-${todo.id}" onclick=updateTodo(id)>Update</button>
                     <button class="btn btn-sm btn-danger"  id="cancel-${todo.id}" onclick=cancelTodo(id)>Cancel</button>
                     </div>
                    <p class="todo-input d-inline">${todo.todo}</p>
              </span>
              <div>
               <i class="bi bi-pencil-square"  id="edit-${todo.id}" onclick=editTodo(id) ></i>
               <i class="bi bi-trash" id="del-${todo.id}"  onclick=delTodo(id)></i>
              </div>
              </li>`;

      }
      
      
    }).join('');
    this.todoList.innerHTML += todos;
  }
 
}
 
const p = new Todos();

function cancelTodo(id){
  cancle_ele = document.getElementById(id);
  const todo_li= cancle_ele.parentElement.classList.toggle('d-none');
}
function delTodo(id){
  console.log(id);
  del_ele = document.getElementById(id);
  console.dir(del_ele);
  const todo_li= del_ele.parentElement.parentElement;
  let id_td = id.split("-");
  let todo_id = id_td[1];
  console.log(todo_id);
  fetch('http://localhost:3000/api/todo/'+todo_id,{
    method: "DELETE",
  })
    .then(()=>{
      console.log("delete done");
      todo_li.remove();
    });

  }
function editTodo(id){
  edit_ele = document.getElementById(id);
  const todo_li= edit_ele.parentElement.previousElementSibling.querySelector('div').classList.toggle('d-none');
  
}

function updateTodo(id){
  let title = id.split("-");
  let title_id = title[1];
  let done;
  console.log(title_id);
  if (document.getElementById("done-"+title_id).checked == true){
    done=true;
  }
  else if (document.getElementById("done-"+title_id).checked == false){
    done=false;
  }
  let Title= document.getElementById("updatetitle-"+title_id).value.trim();

  let todo_id = parseInt(title_id);
  if (Title === '') {
    alert('Enter something to update');
  } 
  else {
  const data ={ "todoId": todo_id, "todoTitle": Title, "updateddone": done}

    fetch('http://localhost:3000/api/update_todo/', {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
      .then((response) => response.json())
      .then((data) => {
        update_ele = document.getElementById(id);
        update_ele.parentElement.classList.toggle('d-none');
        document.getElementById('todo-title-'+title_id).innerHTML=Title;
        document.getElementById("done-"+title_id).checked=done;

        console.log('Success:', data);
      }).catch((error) => {
        console.error('Error:', error);
      });
    }
}

addBtn.addEventListener('click', (e) => {
  let inputValue = todoInput.value.trim();
  if (inputValue === '') {
    alert('Enter some todo item before adding');
  } 
  else {
  const data ={ "todo": inputValue, "done": false}

    fetch('http://localhost:3000/api/add_todo/', {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      });

  }
});