/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	migrate: process.env.MIGRATE || 'alter',
  attributes: {
    firstName: 'string',
    lastName: 'string',
    birthDate: 'date',
    
    email: {
      type: 'email', // Email type will get validated by the ORM
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      minLength: 6,
      required: true
    },

    is_admin: {
      type : 'boolean',
    }
	},

	beforeCreate: function (attrs, next) {
    var bcrypt = require('bcrypt');
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(attrs.password, salt, function(err, hash) {
            // Store hash in your password DB.
          if(err) return next(err);
          attrs.password = hash;
          attrs.is_admin = false;
          next();
        });
    });
  },

  create_admin: function(user) {
      user.is_admin = true;
      user.save(function(err){});
  }

};

