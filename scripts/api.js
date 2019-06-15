/* eslint-disable no-unused-vars */
'use strict';

/**
 * IIFE for api object
 */
let api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/andrewyin';

  /**
   * DRY's fetch  calls and checks for potential errors
   * 
   * @param  {...any} args 
   */
  function apiFetch(...args) {
    let error;
    return fetch(...args)
      .then(res => {
        if (!res.ok) error = { code: res.status };

        return res.json();
      })
      .then(resJson => {
        if (error) {
          console.log(resJson.message)
          error.message = resJson.message;
          return Promise.reject(error);
        }

        return resJson;
      });
  }

  /**
   * Verifies if the given URL is headed by ftp, http, or https
   * and prepends http:// if it is not
   * Solution taken from https://stackoverflow.com/questions/24657463/how-to-add-http-to-url-if-no-protocol-is-defined-in-javascript
   * 
   * @param {string} url 
   * @returns {string}
   */
  function verifyHTTPS(url) {
    if (!/^(f|ht)tps?:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  function createBookmark(newBookmark) {
    // console.log(...args);
    let bookmark = {
      // title: newBookmark.title,
      // url: verifyHTTPS(newBookmark.url),
    };

    if(newBookmark.title) bookmark.title = newBookmark.title.trim();
    if(newBookmark.url) bookmark.url = verifyHTTPS(newBookmark.url);


    (newBookmark.desc && newBookmark.desc !== null) ? Object.assign(bookmark, { desc: newBookmark.desc }) : bookmark;
    newBookmark.rating ? Object.assign(bookmark, { rating: newBookmark.rating }) : bookmark;

    return apiFetch(`${BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookmark)
    });
  }

  function getBookmarks() {
    return apiFetch(`${BASE_URL}/bookmarks`);
  }

  function updateBookmark(id, updateData) {
    return apiFetch(`${BASE_URL}/bookmarks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
  }

  function deleteBookmark(id) {
    return apiFetch(`${BASE_URL}/bookmarks/${id}`, {
      method: 'DELETE',
    });
  }

  return {
    createBookmark,
    getBookmarks,
    updateBookmark,
    deleteBookmark
  };
})();