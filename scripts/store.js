/* eslint-disable no-unused-vars */
'use strict';

const store = (function() {

  /**
   * Adds a bookmark object to bookmarks array
   * 
   * @param {object} bookmark 
   */
  function addBookmark(bookmark) {
    this.bookmarks.push(bookmark);
  }

  /**
   * Returns a bookmark object based on given id string
   * 
   * @param {string} id 
   * @returns {object}
   */
  function findBookmark(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  }

  /**
   * 
   * @param {string} id 
   * @param {object} newData 
   */
  function editBookmark(id, newData) {
    const updateBookmark = this.findBookmark(id);
    Object.assign(updateBookmark, newData);
  }

  /**
   * 
   * @param {string} id 
   */
  function deleteBookmark(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  }

  /**
   * Sets filter to display bookmarks with rating greater than
   * or equal to the given filter
   * 
   * @param {string} filter 
   */
  function setFilter(filter) {
    this.filteredBy = filter;
  }

  /**
   * 
   * @param {string} id 
   * @param {boolean} isExpanded 
   */
  function setExpandState(id, isExpanded) {
    const bookmark = this.findBookmark(id);
    bookmark.expanded = isExpanded;
  }

  /**
   * Sets isEditing property of bookmark object with matching id
   * to value of isEditing
   * 
   * @param {string} id 
   * @param {boolean} isEditing 
   */
  function setIsEditingState(id, isEditing) {
    const bookmark = this.findBookmark(id);
    bookmark.isEditing = isEditing;
  }

  /**
   * Sets addingBookmark property to isAdding
   * 
   * @param {boolean} isAdding 
   */
  function setAddingBookmarkState(isAdding) {
    this.addingBookmark = isAdding;
  }

  return {
    bookmarks: [],
    filteredBy: 0,
    addingBookmark: false,
    showError: false,
    errorMessage: '',
    addBookmark,
    findBookmark,
    editBookmark,
    deleteBookmark,
    setFilter,
    setIsEditingState,
    setAddingBookmarkState,
    setExpandState,
  };
})();