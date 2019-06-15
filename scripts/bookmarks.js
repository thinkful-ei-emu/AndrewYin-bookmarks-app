/* eslint-disable no-unused-vars */
'use strict';
/* global api, store */

const bookmarks = (function(){

  function serializeJSON(form) {
    const formData  = new FormData(form);
    const formJSON = {};
    formData.forEach((value, name) => formJSON[name] = value);

    return formJSON;
  }

  function generateRatingStars(rating) {
    let stars = '';
    for(let i = 0; i < 5 - rating; i++) {
      stars += '<span class="fa fa-star"></span>';
    }
    for (let i = 0; i < rating; i++) {
      stars += '<span class="fa fa-star star"></span>';
    }

    return `
    <section class="siteRating">    
    ${stars}
    </section>
    `;
  }

  function generateBookmarkElement(bookmark) {
    const isEditing = bookmark.isEditing;
    const expanded = bookmark.expanded;

    const bookmarkTitle = isEditing ?
      `<input name="title" value="${bookmark.title}" />`:
      `<p>${bookmark.title}</p>`;
    const bookmarkRating = isEditing ?
      `<section class="siteRating">
        <input type="radio" class="rating" id="editRating5" value=5 name="rating" ${(bookmark.rating === 5) ? 'checked' : ''} />
        <label class="fa fa-star checked" for="editRating5"></label>
        <input type="radio" class="rating" id="editRating4" value=4 name="rating" ${(bookmark.rating === 4) ? 'checked' : ''} />
        <label class="fa fa-star checked" for="editRating4"></label>
        <input type="radio" class="rating" id="editRating3" value=3 name="rating" ${(bookmark.rating === 3) ? 'checked' : ''} />
        <label class="fa fa-star checked" for="editRating3"></label>
        <input type="radio" class="rating" id="editRating2" value=2 name="rating" ${(bookmark.rating === 2) ? 'checked' : ''} />
        <label class="fa fa-star checked" for="editRating2"></label>
        <input type="radio" class="rating" id="editRating1" value=1 name="rating" ${(bookmark.rating === 1) ? 'checked' : ''} />
        <label class="fa fa-star checked" for="editRating1"></label>
      </section>` :
      `${generateRatingStars(bookmark.rating)}`;
    const bookmarkDesc = isEditing ?
      `<textarea name="desc">${bookmark.desc !== null ? bookmark.desc : ''}</textarea>` :
      `<p>${bookmark.desc !== null ? bookmark.desc : ''}</p>` ;
    const bookmarkUrl = isEditing ?
      `<input name="url" value="${bookmark.url}" />`:
      `<p>${bookmark.url}</p>`;
    const editButton = isEditing ?
      `<input id="${bookmark.id}submitEditButton" type="submit" value="submit">` :
      `<button id="${bookmark.id}editButton" type="button">Edit</button>`;
    const deleteButton = isEditing ?
      `<button id="${bookmark.id}cancelEditButton" type="button">Cancel</button>` :
      `<button id="${bookmark.id}deleteButton" type="button">Delete</button>`;

    const bookmarkHTML = 
      `<li id=${bookmark.id} class="bookmark-list-item">
      ${isEditing ? `<form class="${bookmark.id}editForm">`: ''}
      ${bookmarkTitle}
      ${bookmarkRating}
      <section id="${bookmark.id}expand" class="${expanded ? '' : 'hidden'}">
      ${bookmarkDesc}
      ${bookmarkUrl}
      ${editButton} ${deleteButton}
      </section>
      ${isEditing ? '</form>': ''}
      `;
    
    return bookmarkHTML; 
  }

  /**
   * 
   * @param {array} bookmarks 
   * @returns {object}
   */
  function generateBookmarksString(bookmarksList) {
    const bookmarks = bookmarksList.map(bookmark => generateBookmarkElement(bookmark));
    return bookmarks.join('');
  }  

  function render() {
    let bookmarks = [ ...store.bookmarks ].filter(bookmark => bookmark.rating >= store.filteredBy);
    const bookmarksString = generateBookmarksString(bookmarks);

    document.getElementById('bookmark-list').innerHTML = bookmarksString;
  }

  function handleAddBookmarkSubmit() {
    document.getElementById('addBookmarkForm').addEventListener('submit', event => {
      event.preventDefault();
      
      const newBookmark = serializeJSON(event.target);
      api.createBookmark(newBookmark)
        .then(res => {
          store.addBookmark(res);
          document.getElementById('resetButton').click();
          render();
        });
    });
  }

  function handleEditButtonClicked() {
    document.getElementById('bookmark-list').addEventListener('click', event => {
      let bookmark = event.target.closest('.bookmark-list-item');

      if (!bookmark) return;
      if (event.target.id !== `${bookmark.id}editButton`) return;

      console.log('Edit Button Clicked.');
      store.setIsEditingState(bookmark.id, true);
      render();
    });
  }
  
  function handleDeleteButtonClicked() {
    document.getElementById('bookmark-list').addEventListener('click', event => {
      let bookmark = event.target.closest('.bookmark-list-item');

      if (!bookmark) return;
      if (event.target.id !== `${bookmark.id}deleteButton`) return;
      
      api.deleteBookmark(bookmark.id)
        .then(() => {
          store.deleteBookmark(bookmark.id);
          render();
        });
    });
  }

  function handleEditBookmarkSubmit() {
    document.getElementById('bookmark-list').addEventListener('submit', event => {
      event.preventDefault();

      let bookmark = event.target.closest('.bookmark-list-item');
      if (!bookmark) return;

      const editBookmark = serializeJSON(event.target);
      api.updateBookmark(bookmark.id, editBookmark)
        .then(() => {
          store.editBookmark(bookmark.id, editBookmark);
          store.setIsEditingState(bookmark.id, false);
          render();
        });
    });
  }

  function handleEditCancelClicked() {
    document.getElementById('bookmark-list').addEventListener('click', event => {
      let bookmark = event.target.closest('.bookmark-list-item');
      if (!bookmark) return;
      if (event.target.id !== `${bookmark.id}cancelEditButton`) return;

      store.setIsEditingState(bookmark.id, false);
      render();
    });
  }

  function handleBookmarkExpand() {
    document.getElementById('bookmark-list').addEventListener('click', event => {
      let bookmark = event.target.closest('.bookmark-list-item');
      if (!bookmark) return;
      if (store.findBookmark(bookmark.id).isEditing) return;

      let expand = !bookmark.querySelector(`#${bookmark.id}expand`).classList.contains('hidden');

      store.setExpandState(bookmark.id, !expand);
      render();
    });
  }

  function handleBookmarkFilter() {
    document.getElementById('filterByRating').addEventListener('change', () => {
      store.setFilter(event.target.value);
      render();
    });
  }

  function attachEventListeners() {
    handleAddBookmarkSubmit();
    handleEditButtonClicked();
    handleEditBookmarkSubmit();
    handleEditCancelClicked();
    handleDeleteButtonClicked();
    handleBookmarkExpand();
    handleBookmarkFilter();
  }

  return {
    render,
    attachEventListeners,
  };
})();