# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

#Dump existing default user
@user = User.default
if !@user.blank?
  @user.destroy
end
#Begin creation of fresh default user
@user = User.create({username: "default"})
@tag_tutorial = Tag.create({user: @user, name: "Tutorial"})
@tag_example = Tag.create({user: @user, name: "Example"})
@tag_latin = Tag.create({user: @user, name: "Latin", parent_tag: @tag_example})
@tag_done = Tag.create({user: @user, name: "Done", parent_tag: @tag_example})
@tag_delete_me = Tag.create({user: @user, name: "Delete Me", parent_tag: @tag_example})
@tag_formatting = Tag.create({user: @user, name: "Formatting", parent_tag: @tag_tutorial})
@tag_stress_test = Tag.create({user: @user, name: "Valid_Special chars are \".-~?!@#$%^&*()/\{}'<>,`\"", parent_tag: @tag_example})
@tag_tag_system = Tag.create({user: @user, name: "Tag System", parent_tag: @tag_tutorial})
longFillerText = 
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
    "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. " +
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. " +
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
Item.create([
    {user: @user, done: false, task: "Welcome to my TODO app!", tags: [@tag_tutorial]},
    {user: @user, done: false, task: "Take a look at the tasks and get to know this project", tags: [@tag_tutorial]},

    {user: @user, done: false, task: longFillerText, tags: [@tag_latin]},

    {user: @user, done: false, task: "Try deleting tags from me, and deleting tags from the tag clound above", 
        tags:[@tag_example, @tag_delete_me]},
    {user: @user, done: true,  task: "Now try deleting the task itself. Don't worry. I'm done.", 
            tags:[@tag_example, @tag_delete_me]},
    
    {user: @user, done: false, task: "Some text fields have restricted character sets.",
            tags:[@tag_formatting]},
    {user: @user, done: false, task: "You cannot have newline in task descriptions",
        tags:[@tag_formatting]},
    {user: @user, done: false, task: "The only avalaible characters for Usernames and Tabs are the letters from A to Z and underscore(_).",
        tags:[@tag_formatting]},
    {user: @user, done: false, task: "See the Valid_Special tag for avaliable characters for tags.",
        tags:[@tag_formatting, @tag_stress_test]},
    
    {user: @user, done: false, task: "You can create tags, and for each of those tags, you can rename them, delete them, or create subtags.",
        tags:[@tag_tag_system]},
    {user: @user, done: false, task: "When you filter tags in a tab, you will only see tasks that have either that tag exactly, or subtags.",
        tags:[@tag_tag_system]},
])
Tab.create([
    {user: @user, tab_order: 0, name: "All_Items"             , tags: []},
    {user: @user, tab_order: 1, name: "Examples"              , tags: [@tag_example]},
    {user: @user, tab_order: 2, name: "Click_Me_For_Tutorials", tags: [@tag_tutorial]},
    {user: @user, tab_order: 3, name: "Tab_System", tags: [@tag_tutorial, @tag_tag_system]},
    {user: @user, tab_order: 4, name: "Formatting_101", tags: [@tag_formatting]},
])