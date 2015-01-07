/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

//require bcrypt

var bcrypt = require('bcrypt');

module.exports = {
	
	'new': function(req,res) {
		res.view('session/new');
	},
	
	'create': function(req,res,next) {
		
		//check for email and password in params, if none redirect user back to login with error message
		if(!req.param('email') || !req.param('password')) {
			
			var emailPasswordRequired = [{name:'emailPasswordRequired',message:'You must enter a valid email and password'}];
			
			req.session.flash = {
				err: emailPasswordRequired
			}
			
			res.redirect('/session/new');
			return;			
		}
		
		// Try to find the user by their email address
		// findOneByEmail() is a dynamic finder, it searches the modal by an attribute
		User.findOneByEmail(req.param('email'), function (err, user) {
		
			//if error register it
			if(err) next(err);
			
			//if no user is found create an error
			if(!user) {
				var noAccountError = [{name:'noAccount',message:'The email address ' + req.param('email') + ' not found.'}];
				req.session.flash = {
					err:noAccountError
				}
				res.redirect('/session/new');
				return;
			}
			
			// Compare the password from the params to the encrypted password in the user model
			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err,valid) {
				if(err) return next(err);
				
				// If password doesn't match create error and redirect user
				if(!valid) {
					var usernamePasswordMismatchError = [{name:'usernamePasswordMismatchError',message:'Invalid email and password combination'}];
					
					// register flash error
					req.session.flash = {
						err:usernamePasswordMismatchError
					}
					
					// redirect user
					res.redirect('/session/new');
					return;
				}
				
				// Login user since it's valid
				req.session.authenticated = true;
				req.session.User = user;
				
				if(req.session.User.admin) {
					res.redirect('/user/');
					return;
				}
				
				res.redirect('/user/show/'+ user.id);
				
			});
		});
		
	},
	
	'destroy':function(req,res,next){
	
		// wipe out the session (logout)
		req.session.destroy();
		
		//redirect back to sign include
		res.redirect('/session/new');
		
	}
	
};

