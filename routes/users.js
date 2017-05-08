var User = require('../controller/user');

// API Server Endpoints
module.exports = function(router){
      router.post('/signup', User.signup),
      router.post('/login', User.login),
          router.get('/user_logout', User.logout)
      router.get('/user/:user_id', User.get_user),
      router.get('/follow/:user_id', User.do_follow),
      router.get('/unfollow/:user_id', User.do_unfollow),
      router.get('/followlist', User.show_followlist),
      router.get('/like/:picture_id', User.do_like),
      router.get('/unlike/:picture_id', User.do_dislike),
      router.get('/show_bookmarks',User.show_bookmarks),
          router.get('/add_bookmarks/:picture_id',User.add_bookmarks),
          router.post('/user_update/:user_id', User.update),
      router.get('/user_logout', User.logout),
          router.post('/invite', User.invite)
};
