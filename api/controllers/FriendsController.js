/**
 * FriendsController
 *
 * @description :: Server-side logic for managing friends
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `FriendsController.add()`
   */
  add: function (req, res) {
    if(!req.param('id')) {
      res.badRequest('Please include friend id');
    } else {
      res.send('Friend with ID:' + req.param('id') + ' has been added!');
    }
  },


  /**
   * `FriendsController.delete()`
   */
  delete: function (req, res) {
    return res.json({
      todo: 'delete() is not implemented yet!'
    });
  }
};

