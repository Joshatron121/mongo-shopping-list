exports.DATABASE_URL = process.env.DATABASE_URL ||
					   global.DATABASE_URL ||
					   (process.env.NODE_ENV === 'production' ?
							'mongodb://localhost/shopping-list':
							'mongodb://localhost/shopping-list-dev');
exports.PORT = 8080;