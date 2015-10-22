Template.post_categories.helpers({
  categoriesItems: function(){

    var menuItems = _.map(this.categories, function (categoryId) { // note: this.categories maybe be undefined
      var category = Categories.findOne(categoryId);
      return {
        route: function () {
          return Categories.getUrl(category);
        },
        label: category.name,
        description: category.description,
        _id: category._id,
        parentId: category.parentId
      };
    });
    return menuItems;

  }
});
