var Picture= require('../controller/picture');

// API Server Endpoints
module.exports = function(router){
	router.get('/global',Picture.get_global),
		router.get('/me',Picture.get_mine),
		router.post('/picture_submit', Picture.picture_submit),
		router.get('/get_keyword', Picture.get_keyword),
		router.post('/check_answer', Picture.check_answer),
	router.get('/picture/:picture_id', Picture.get_picture),
	router.post('/picture_update/:id', Picture.update),
	router.get('/picture_delete/:id', Picture.delete)
};
