module.exports = function(router) {
  router.get('/', function(req, res, next) {
    res.render('index',{messages:"aaa"});
  });
};