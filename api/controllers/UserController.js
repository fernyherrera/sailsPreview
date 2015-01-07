/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	hello: function (req,res){
		return res.send("Your user has been created");
	},
	
	new: function(req,res) {
		res.view();
	},
	
	create: function(req,res) {
		console.log(req.params.all());
		//create user
		User.create(req.params.all(), function userCreate(err,user){
		
			if(err) {
				console.log(err);
				req.session.flash = {
					err: err
				}
				
				return res.redirect('/user/new');
			}
			
			//res.json(user);
			
			res.redirect('/user/show/'+user.id);
			
		});
		
	},
	
	//render
	show: function(req, res, next) {
		User.findOne(req.param('id'), function(err,user){
			if(err) return next(err);
			if(!user) return next();
			res.view({
				user: user
			});
		});
	},
	
	index: function(req, res, next) {
		
		//console.log(req.session.User);
		
		User.find(function foundUsers (err,users){
			if(err) return next(err);
			res.view({
			users: users
		});
	});
},
	
	edit: function (req,res,next) {
		User.findOne(req.param('id'), function(err,user) {
			if(err) return next(err);
			if(!user) return next();
			
			res.view({
				user:user
			});
		});
	},
	
	update: function(req,res,next) {
		
		if(req.session.User.admin) {
			var userObj = {
				name: req.param('name'),
				title: req.param('title'),
				email: req.param('email'),
				admin: req.param('admin')
			}
		} 		
		else {
			var userObj = {
				name: req.param('name'),
				title: req.param('title'),
				email: req.param('email')
			}	
		}
		
		// set if admin is checked
		if(typeof userObj.admin !== 'undefined'){
			if (userObj.admin[1] === 'on') {
				userObj.admin = true;
			}
		}
		
		User.update(req.param('id'), userObj, function userUpdate(err, user){
			if (err) {
				return res.redirect('/user/edit/'+req.param('id'));
			}
			
			res.redirect('/user/show/' + req.param('id'));
		});
	},
	
	destroy: function(req,res,next){
		User.findOne(req.param('id'), function foundUser(err,user) {
			if (err) return next(err);
			if (!user) return next('User doesn\'t exit.');
			
			User.destroy(req.param('id'), function userDestroyed(err) {
				if (err) return next(err)
			});
			
			res.redirect('/user');
			
		});
		
	}


};

