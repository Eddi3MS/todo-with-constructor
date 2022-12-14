(function () {
  "use strict";

  function Task(name, completed = false, createdAt = Date.now(), updatedAt = null) {
    if (!name) {
      throw new Error("Name is required.");
    }

    let _name = name;
    //this.name = name;
    this.completed = completed;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.toggleDone = function () {
      this.completed = !this.completed;
    };
    this.getName = function () {
      return _name;
    };
    this.setName = function (name) {
      _name = name;
      this.updatedAt = Date.now();
    };
  }

  let arrTasks = [
    {
      name: "task 1",
      completed: true,
      createdAt: 1592667375012,
      updatedAt: null,
    },
    {
      name: "task 2",
      createdAt: 1581667345723,
      updatedAt: 1592667325018,
    },
    {
      name: "task 3",
      completed: true,
      createdAt: 1592667355018,
      updatedAt: 1593677457010,
    },
  ];

  const arrInstancesTasks = arrTasks.map((task) => {
    const { name, completed, createdAt, updatedAt } = task;
    return new Task(name, completed, createdAt, updatedAt);
  });

  //ARMAZENAR O DOM EM VARIAVEIS
  const itemInput = document.getElementById("item-input");
  const todoAddForm = document.getElementById("todo-add");
  const ul = document.getElementById("todo-list");
  const lis = ul.getElementsByTagName("li");

  function generateLiTask(obj) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    const checkButton = document.createElement("button");
    const editButton = document.createElement("i");
    const deleteButton = document.createElement("i");

    li.className = `todo-item ${obj.completed && "task-completed"}`;

    checkButton.className = "button-check";
    checkButton.innerHTML = `
            <i class="fas fa-check ${
              obj.completed ? "" : "displayNone"
            }" data-action="checkButton"></i>`;
    checkButton.setAttribute("data-action", "checkButton");

    li.appendChild(checkButton);

    p.className = "task-name";
    p.textContent = obj.getName();
    li.appendChild(p);

    editButton.className = "fas fa-edit";
    editButton.setAttribute("data-action", "editButton");
    li.appendChild(editButton);

    const containerEdit = document.createElement("div");
    containerEdit.className = "editContainer";
    const inputEdit = document.createElement("input");
    inputEdit.setAttribute("type", "text");
    inputEdit.className = "editInput";
    inputEdit.value = obj.getName();

    containerEdit.appendChild(inputEdit);
    const containerEditButton = document.createElement("button");
    containerEditButton.className = "editButton";
    containerEditButton.textContent = "Edit";
    containerEditButton.setAttribute("data-action", "containerEditButton");
    containerEdit.appendChild(containerEditButton);
    const containerCancelButton = document.createElement("button");
    containerCancelButton.className = "cancelButton";
    containerCancelButton.textContent = "Cancel";
    containerCancelButton.setAttribute("data-action", "containerCancelButton");
    containerEdit.appendChild(containerCancelButton);

    li.appendChild(containerEdit);

    deleteButton.className = "fas fa-trash-alt";
    deleteButton.setAttribute("data-action", "deleteButton");
    li.appendChild(deleteButton);

    return li;
  }

  function renderTasks() {
    ul.innerHTML = "";
    arrInstancesTasks.forEach((taskObj) => {
      ul.appendChild(generateLiTask(taskObj));
    });
  }

  function addTask(taskName) {
    arrInstancesTasks.push(new Task(taskName));
    renderTasks();
  }

  function clickedUl(e) {
    const dataAction = e.target.getAttribute("data-action");
    console.log(e.target);
    if (!dataAction) return;

    let currentLi = e.target;
    while (currentLi.nodeName !== "LI") {
      currentLi = currentLi.parentElement;
    }
    const currentLiIndex = [...lis].indexOf(currentLi);

    const actions = {
      editButton: function () {
        const editContainer = currentLi.querySelector(".editContainer");

        [...ul.querySelectorAll(".editContainer")].forEach((container) => {
          container.removeAttribute("style");
        });

        editContainer.style.display = "flex";
      },
      deleteButton: function () {
        arrInstancesTasks.splice(currentLiIndex, 1);
        renderTasks();
      },
      containerEditButton: function () {
        const val = currentLi.querySelector(".editInput").value;
        arrInstancesTasks[currentLiIndex].setName(val);
        renderTasks();
      },
      containerCancelButton: function () {
        currentLi.querySelector(".editContainer").removeAttribute("style");
        currentLi.querySelector(".editInput").value =
          arrInstancesTasks[currentLiIndex].getName();
      },
      checkButton: function () {
        arrInstancesTasks[currentLiIndex].toggleDone();
        renderTasks();
      },
    };

    if (actions[dataAction]) {
      actions[dataAction]();
    }
  }

  todoAddForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log(itemInput.value);
    addTask(itemInput.value);
    renderTasks();

    itemInput.value = "";
    itemInput.focus();
  });

  ul.addEventListener("click", clickedUl);

  renderTasks();
})();
