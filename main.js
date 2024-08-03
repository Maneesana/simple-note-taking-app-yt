// DOM - Document Object Model

const createNewButton = document.querySelector("#create-new-note-btn");

createNewButton.addEventListener("click", createNewNoteHandler);

function createNewNoteHandler() {
  const html = `<form id="create-new-note-form" class="form-group">
      <h3 class="note-heading">Create New Note</h3>
      <div>
        <div>
          <label>Note Title: </label>
          <input name="title" type="text" />
        </div>
        <div>
          <label>Note Description: </label>
          <input name="description" type="text" />
        </div>
      </div>
      <button type="submit"  class="btn btn-secondary">Create Note</button>
    </form>`;

  document.querySelector("#app").insertAdjacentHTML("beforeend", html);
  document
    .querySelector("#create-new-note-form")
    .addEventListener("submit", createNewNoteSubmitHandler);
}

// update note form

// create-new-note-form

function createNewNoteSubmitHandler(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const newNoteData = Object.fromEntries(formData);
  newNoteData.id = crypto.randomUUID();

  if (
    newNoteData.title.trim() === "" ||
    newNoteData.description.trim() === ""
  ) {
    return;
  }
  saveNoteToLocalStorage(newNoteData);
  e.target.reset();

  renderNoteCards();
}

// setting key on localStorage for note taking app
if (!window.localStorage.getItem("notes")) {
  window.localStorage.setItem("notes", JSON.stringify([]));
}

// save note to localstorage

function saveNoteToLocalStorage(note) {
  // { title:"" ,description:""}
  console.log("Note", note);
  const currentNotes = JSON.parse(window.localStorage.getItem("notes"));

  currentNotes.push(note);
  window.localStorage.setItem("notes", JSON.stringify(currentNotes));
  console.log("Current Notes", currentNotes);
  console.log("Current Notes", currentNotes.length);
}

function deleteNoteFromLocalStorage() {}
// rendering notes cards
renderNoteCards();

function deleteNoteHandler(e) {
  const toBeDeletedNoteId = e.target.dataset.noteId;
  const notes = JSON.parse(window.localStorage.getItem("notes"));

  const updatedNotes = notes.filter((note) => note.id !== toBeDeletedNoteId); // []

  window.localStorage.setItem("notes", JSON.stringify(updatedNotes));
  renderNoteCards();
}

function updateNoteHandler(e) {
  console.log("Update Note Handler");
  renderUpdateNoteForm(e.target.dataset.noteId);
}

function renderNoteCards() {
  let html = ``;

  const notes = JSON.parse(window.localStorage.getItem("notes"));

  if (notes.length === 0) {
    html += `<p class="empty-notes">There is no notes. Please create a new note.</p>`;
    document
      .querySelector("#note-card-placholder")
      .insertAdjacentHTML("beforeend", html);
    return;
  }

  for (let i = 0; i < notes.length; i++) {
    html += `
    
    <div class="card ${i % 2 === 0 ? "card-primary" : "card-secondary"}">
      <div>
        <h4 class="note-title">${notes[i].title}</h4>
      </div>
      <div>
        <p>
          ${notes[i].description}
        </p>
      </div>
      <div class="card-actions">
        <button id="delete-note-btn" data-note-id="${
          notes[i].id
        }" class="btn btn-danger">Delete Note</button>
        <button id="update-note-btn"   data-note-id="${
          notes[i].id
        }" class="btn btn-secondary">Update Note</button>
      </div>
    </div>
    `;
  }
  // remove child element before rendering new notes
  const tempEle = document.querySelector("#note-card-placholder");
  while (tempEle.hasChildNodes()) {
    tempEle.removeChild(tempEle.firstChild);
  }

  document
    .querySelector("#note-card-placholder")
    .insertAdjacentHTML("beforeend", html);

  // adding listeners to delete and update note buttons
  document
    .querySelector("#note-card-placholder")
    .addEventListener("click", function (e) {
      console.log("Event Target", e.target.id);
      if (e.target.id === "delete-note-btn") {
        deleteNoteHandler(e);
      } else if (e.target.id === "update-note-btn") {
        updateNoteHandler(e);
      }
    });
}

function renderUpdateNoteForm(noteId) {
  const notes = JSON.parse(window.localStorage.getItem("notes"));

  const note = notes.find((note) => note.id === noteId);
  const html = `<form id="update-note-form" class="form-group">
      <h3 class="note-heading">Update New Note</h3>
      <div>
        <div>
          <label>Note Title: </label>
          <input name="title" value="${note.title}" type="text" />
        </div>
        <div>
          <label>Note Description: </label>
          <input name="description" value="${note.description}" type="text" />
        </div>
      </div>
      <button type="submit"  class="btn btn-secondary">Update Note</button>
    </form>`;

  const tempEle = document.querySelector("#app");
  while (tempEle.hasChildNodes()) {
    tempEle.removeChild(tempEle.firstChild);
  }
  tempEle.insertAdjacentHTML("beforeend", html);
  document
    .querySelector("#update-note-form")
    .addEventListener("submit", (e) => {
      updateNoteSubmitHandler(e, noteId);
    });
}

function updateNoteSubmitHandler(e, updateNoteId) {
  e.preventDefault();

  const formEle = e.target;
  const formData = Object.fromEntries(new FormData(formEle));
  formData.id = updateNoteId;
  console.log("Form Data", formData);
  updateNoteInLocalStorage(formData);
  renderNoteCards();
}

function updateNoteInLocalStorage(toUpdateNote) {
  const notes = JSON.parse(window.localStorage.getItem("notes"));
  for (const note of notes) {
    if (note.id === toUpdateNote.id) {
      note.title = toUpdateNote.title;
      note.description = toUpdateNote.description;
    }
  }
  window.localStorage.setItem("notes", JSON.stringify(notes));
}
