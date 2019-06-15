'use strict';
/* global api, store, bookmarks */


/**
 * Attach handlers on DOM load.
 */
document.addEventListener('DOMContentLoaded', () => {
  api.getBookmarks()
    .then(res => {
      res.forEach(bookmark => {
        store.addBookmark(bookmark);
      });
      bookmarks.attachEventListeners();
      bookmarks.render();
    });
});