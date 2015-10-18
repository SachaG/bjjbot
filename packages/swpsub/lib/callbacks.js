function detectCategories (data) {
  var title = data.title.toLowerCase();
  var categories = Categories.find().fetch();
  var categoriesWithNoChildren = _.reject(categories, function (category) {
    return category.hasChildren;
  });
  var addedCategories = [];

  categoriesWithNoChildren.forEach(function (category) {

    var name = category.name.toLowerCase();
    var nameInTitle = title.indexOf(name) !== -1;
    var aliasArray = category.alias && category.alias.split(",");
    var siblingCategories = _.where(addedCategories, {parentId: category.parentId});

    var aliasInTitle = _.some(aliasArray, function (alias) {
      return title.indexOf(alias.toLowerCase()) !== -1;
    });

    // console.log(name)
    // console.log(nameInTitle)
    // console.log(aliasArray)
    // console.log(aliasInTitle)

    // if category name or one of its aliases is contained within post title
    if (nameInTitle || aliasInTitle) {

      // NOTE: do not loop through parents after all
      // loop through parents and add them too, unless they're excluded or already in the array
      // category.getParents().reverse().forEach(function (category) {
      //   if (!_.contains(excludedCategories, category.name) && !_.findWhere(addedCategories, {_id: category._id}) ) {
      //     addedCategories.push(category);
      //   }
      // });

      // only add if this is *not* an "other" category (i.e. catchall), 
      // except if no other sibling categories have been previously added
      if (name.indexOf("other") === -1 || siblingCategories.length === 0) {
        // add current category to addedCategories
        addedCategories.push(category);
      }

    }
  });


  if (addedCategories.length > 0) {

    // if any categories have been auto-detected, add the "Techniques" category
    addedCategories.push(Categories.findOne({name: "Techniques"}));

    // loop over all added categories
    addedCategories.forEach(function (category) {

      // check box
      $("[value="+category._id+"]").prop("checked", true);

      // loop over all parents (except root categories, who are already expanded) and expand their menu tree
      _.reject(category.getParents(), function(parentCategory){
        return typeof parentCategory.parentId === "undefined";
      }).forEach(function (parentCategory) {
        $("#"+parentCategory._id).closest(".menu-item-wrapper").find(".js-menu-toggle").not(".toggle-expanded").first().click();
      });

    });

    var $controls = $("[name=url").parents(".controls");
    var categoriesMarkup = addedCategories.map(function (category) {
      return "<li>"+category.name+"</li>";
    });
    $(".detected-categories").remove();
    $controls.append('<div class="detected-categories"><h4>Auto-detected the following categories:</h4><ul>'+categoriesMarkup.join("")+'</ul><p>(Scroll down to edit categories)</p></div>');

  }
}
Telescope.callbacks.add("afterEmbedlyPrefill", detectCategories);

