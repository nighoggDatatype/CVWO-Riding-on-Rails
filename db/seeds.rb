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
])