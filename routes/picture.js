var Picture= require('../controller/picture');

// API Server Endpoints
module.exports = function(router){
	router.get('/global',Picture.get_global),
		router.get('/me',Picture.get_mine),
		router.post('/picture_submit', Picture.create),
	router.get('/picture/:picture_id', Picture.get),
	router.post('/picture_update/:id', Picture.update),
	router.get('/picture_delete/:id', Picture.delete)
};
