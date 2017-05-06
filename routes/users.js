var User= require('../controller/user');

// API Server Endpoints
module.exports = function(router){
      router.post('/signup', User.signup),
      router.get('/login/', User.login),
          router.get('/user_logout', User.logout)
      router.get('/user/:id', User.get),
      router.get('/follow/:id', User.do_follow),
      router.get('/unfollow/:id', User.do_unfollow),
      router.get('/followlist', User.show_followlist),
      router.get('/like/:id', User.do_like),
      router.get('/dislike/:id', User.do_dislike),
      router.get('/show_bookmarks',User.show_bookmarks),
      router.post('/user_update/:id', User.update),
      router.get('/user_logout/:id', User.logout)
};
