/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	

	getAllAuthenticated : function(req, res) {
		AuthenticatedUser.find(function(err, users){
			users.forEach(function(user){
				delete user.id;
				delete user.createdAt;
				delete user.updatedAt;
			});
			res.json(users);
		});
	},

	getAuthenticated : function(req, res){
		if (!req.body.userId) res.json({ error: 'Invalid user id' }, 400);
	    AuthenticatedUser.findOneByUserId(req.body.userId, function(err, object){
	      if (err) res.json({ error: 'DB error' }, 500);
	      if (object) res.json({authenticated: 'yes'});
	      else res.json({authenticated: 'no'});
	    })
	},

	login: function(req, res){
		if (!req.body.email) res.json({ error: 'Invalid email' }, 400);
    	if (!req.body.password) res.json({ error: 'Invalid password' }, 400);
		var bcrypt = require('bcrypt');
		Users.findOneByEmail(req.body.email, function(err, user){
			if(err) res.json({error: 'BD error'}, 500);
			if(user){
				bcrypt.compare(req.body.password, user.password, function(err, match){
					if(err) res.json({error: 'Server error'}, 500);
					if(match){
						AuthenticatedUser.create({userId: user.id}, function(err, object){
							if(err) res.json(err);
							if(object){
								req.session.authenticated = true;
								req.session.user = user.id;
								res.json(user);
							}else{
								res.json({error: 'Unexpected system behavior'}, 500);
							}
						});
					}else{
						if(req.session.user) req.session.user = null;
						res.json({error: 'Invalid password'}, 400);
					}
				})
			}else{
				res.json({error: 'User not found'}, 404);
			}
		});
	},

	logout : function(req, res){
//		AuthenticatedUser.destroy();
		console.log(req.session.user);
		AuthenticatedUser.destroy({userId: req.session.user}, function(err){
			if(err) res.json({error: 'Unexpected system behavior'}, 500);
			else {
				req.session.authenticated = null;
				req.session.user = null;
				res.json('Logout socess!');
			}
		});
	},

	getUserInfo : function(req, res){
		userId = req.param("userId");
		if(!userId) res.json({error:  'Invalid user id'}, 400);
		Users.findOneById(userId, function(err, user){
			if(err) res.json({error: 'BD error'}, 500);
			if(user){
				delete user.password;
				delete user.createdAt;
				delete user.updatedAt;
				res.json(user);
			}else{
				res.json({error: 'User not found'}, 404);
			}
		});
	},



};

