var Picture= require('../controller/picture');

// API Server Endpoints
module.exports = function(router){
	router.get('/picture/',Picture.getAll),
	router.post('/picture_submit', Picture.create),
	router.get('/picture/:id', Picture.get),
	router.post('/picture_update/:id', Picture.update),
	router.get('/picture_delete/:id', Picture.delete)
};
