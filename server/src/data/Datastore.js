'use strict';

/**
 * This is a very simple in-memory database.
 */
class Datastore {
  /**
   * Creates a new, empty, instance.
   */
  constructor() {
    this.users = [];
    this.msgs = [];
    this.nextMsgId = 1;
  }

  /**
   * @return{number} The msg id to use for a newly created message.
   */
  getNextMsgId() {
    return this.nextMsgId++;
  }
}

module.exports = Datastore;
