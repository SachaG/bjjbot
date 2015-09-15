Template.category_menu_item.events({
  "click .js-custom-category-toggle": function (event, instance) {
    
    event.preventDefault();

    var slug = instance.data.item.data.slug;
    var input = instance.$(":checkbox");
    input.prop("checked", !input.prop("checked"))    
    
    if (Router.current().route.getName() !== "posts_categories") {

      Router.go("posts_categories", {}, {query: 'cat[]='+slug});
    
    } else {

      if (input.prop("checked")) {

        // uncheck and remove slug for all other categories in the same subgroup
        input.parents(".menu-level-0").find(".category-checkbox:checked").not("[name="+instance.data.item._id+"]").each(function () {
          $(this).prop("checked", false);
          Router.query.remove('cat', Categories.findOne($(this).attr("name")).slug);
        });

        Router.query.add('cat', slug);
      } else {
        Router.query.remove('cat', slug);
      }
      
    }
  }
});
