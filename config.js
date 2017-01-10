exports.DATABASE_URL = process.env.DATABASE_URL ||
					   global.DATABASE_URL ||
					   (process.env.NODE_ENV === 'production' ?
							'mongodb://joshatron:bluefive63@ds161008.mlab.com:61008/shoppingcart':
							'mongodb://joshatron:bluefive63@ds161008.mlab.com:61008/shoppingcart-dev');
exports.PORT = (process.env.PORT || 8080);