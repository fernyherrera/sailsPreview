// All any authenticated user

module.exports = function (req, res, ok) {

	var sessionUserMatchId = req.session.User.id === req.param('id');
	var isAdmin = req.session.User.admin;
	
	// User is not allowed
	if(!(sessionUserMatchId || isAdmin)) {
		var noRightsError = [{name:'noRights',message:'You must be an admin.'}];
		req.session.flash = {
			err: noRightsError
		}
		res.redirect('/session/new');
		return;
	}
	
	ok();
};