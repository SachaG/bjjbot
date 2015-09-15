Posts.views.category = function (terms) {

  var categoriesIds = [];
  
  // get all categories passed in terms
  var categories = Categories.find({slug: {$in: terms.categorySlugs}}).fetch();

  return {
    find: {'categories': {$all: _.pluck(categories, "_id")}}
  };

};