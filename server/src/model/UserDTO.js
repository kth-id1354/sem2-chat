'use strict';

/**
 * A user of the chat application.
 */
class UserDTO {
  /**
   * Creates a new instance.
   *
   * @param {number} id The id of the newly created user. This property will be
   *                    automatically generated when a new user is created. Any
   *                    value specified when creating a new user will be
   *                    ignored.
   * @param {string} username The username of the newly craeted user.
   * @param {string} loggedInUntil Zero or null if the user is not logged in.
   *                               A nonzero value means the user is logged in
   *                               until the specified time.
   */
  constructor(id, username, loggedInUntil) {
    this.id = id;
    this.username = username;
    this.loggedInUntil = loggedInUntil;
  }
}

module.exports = UserDTO;
