var User= require('../controller/user');

// API Server Endpoints
module.exports = function(router){
  router.get('/user/',User.getAll),
      router.post('/user_signup', User.signup),
      router.get('/user/:id', User.get),
      router.get('/user_follow/:id', User.do_follow),
      router.get('/user_unfollow/:id', User.do_unfollow),
      router.get('/user_followlist', User.show_followlist),
      router.get('/user_like/:id', User.do_like),
      router.get('/user_dislike/:id', User.do_dislike),
      router.get('/user_likelist',User.show_likelist),
      router.post('/user_update/:id', User.update),
      router.get('/user_login/:id', User.login),
      router.get('/user_logout/:id', User.logout)
};
