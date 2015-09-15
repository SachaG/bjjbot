Template.category_menu_item.events({
  "click .js-custom-category-toggle": function (event, instance) {
    
    event.preventDefault();

    var slug = instance.data.item.data.slug;
    var input = instance.$(":checkbox");
    var currentSlugs = Router.current().params.query.cat;
    var slugsToRemove = [];
    var slugsToAdd = [];

    input.prop("checked", !input.prop("checked"))    
    
    if (Router.current().route.getName() !== "posts_categories") {

      Router.go("posts_categories", {}, {query: 'cat[]='+slug});
    
    } else {

      if (input.prop("checked")) {

        // uncheck and remove slug for all other categories in the same subgroup
        input.parents(".menu-level-0").find(".category-checkbox").not("[name="+instance.data.item._id+"]").each(function () {
          $(this).prop("checked", false);
          slugsToRemove.push(Categories.findOne($(this).attr("name")).slug);
        });
        
        slugsToAdd.push(slug);

      } else {
        
        slugsToRemove.push(slug);
      
      }
      
      // console.log(currentSlugs)
      // console.log(slugsToRemove)
      // console.log(slugsToAdd)

      var query = _.difference(currentSlugs, slugsToRemove).concat(slugsToAdd).map(function (slug) {
        return "cat[]="+slug;
      }).join("&");

      Router.go("posts_categories", {}, {query: query});

    }
  }
});
