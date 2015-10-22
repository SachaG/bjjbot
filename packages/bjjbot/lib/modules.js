Telescope.modules.remove("primaryNav", "pages_menu");
Telescope.modules.add("footer", {
  template: "pages_menu",
  order: 10
});

Telescope.modules.add("contentTop", [
{
  template: "playlists",
  order: 1,
  only: function () {
    FlowRouter.watchPathChange();
    return FlowRouter.current().path === "/";
  }
}
]);

Telescope.modules.remove("primaryNav", "views_menu");
// Telescope.modules.add("postsListTop", {
//   template: "views_menu",
//   order: 100
// });

Telescope.modules.add("postsListTop", {
  template: "post_list_title",
  order: 100,
  only: function () {
    FlowRouter.watchPathChange();
    return FlowRouter.current().path === "/";
  }
});