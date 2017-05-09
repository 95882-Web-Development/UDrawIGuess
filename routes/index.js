module.exports = function(router) {
  router.get('/', function(req, res, next) {
    return res.redirect('/frontend/noSignUpGlobalStream.html');
  });
  router.get('/test', function(req, res, next) {
    res.render('signup',{messages:"aaa"});
  });
};