Template.categories_menu_item.events({
  "change .js-custom-category-toggle": function (event, instance) {

    var slug = instance.data.item.data.slug;
    var input = instance.$(":checkbox");
    var currentSlugs = FlowRouter.getQueryParam("cat");
    var slugsToRemove = [];
    var slugsToAdd = [];

    Meteor.defer(function () {

      if (FlowRouter.getRouteName() !== "postsDefault") {

        FlowRouter.go("postsDefault", {}, {cat: [slug]});
      
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

        var slugsArray = _.difference(currentSlugs, slugsToRemove).concat(slugsToAdd);

        FlowRouter.go("postsDefault", {}, {cat: slugsArray});

      }

    });
  }
});
