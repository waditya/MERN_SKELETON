import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
	name : {
		type: String,
		trim: true,
		required: 'Name is a mandory field'
	},
	email: {
		type: String,
		trim: true,
		unique: 'Email already exists',
		match: [/.+\@.+\..+/, 'Please enter a valid email address'],
		required: 'Email is a mandatory field'
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: Date,
	hashed_password :{
		type: String,
		required: 'Password is required'
	},
	salt: String,
	UserSchema
		.virtual('password')
		.set(function(password){
			this._password = password
			this.salt = this.makeSalt()
			this.hashed_password = this.encryptPassword(password)
		})
		.get(function(){
			return this._password
		})
	
})
UserSchema.methods = {
	authenticate: function(plainText){
		return this.encryptPassword(plainText) == this.hashed_password
	},
	encryptPassword: function(password){
		
	},
	makeSalt: function(){
		return Math.round((new Date().valueOf() * Math.random())) + ''
	}
}

UserSchema.path('hashed_password').validate(function(v){
	if (this._password && this._password.length < 6){
		this.invalidate('password', 'Password must be minimum 6 characters.')
	}
	if(this.isNew && !this._password){
		this.invalidate('password', 'Password is required')
	}
}, null )

export default mongoose.model('User', UserSchema)
