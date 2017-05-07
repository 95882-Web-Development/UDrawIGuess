module.exports = function(router) {
  router.get('/', function(req, res, next) {
    res.render('index',{messages:"aaa"});
  });
  router.get('/test', function(req, res, next) {
    res.render('signup',{messages:"aaa"});
  });
};