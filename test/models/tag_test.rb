require 'test_helper'

class TagTest < ActiveSupport::TestCase
  test "Test Generation of Tag Levels" do
    user_id = users('three').id
    tag_base_id = tags('one').id
    tag_level_one_id = tags('three').id

    #Testing Base Case
    tag = Tag.new
    tag.user_id = user_id
    tag.name = "PlaceHolder"
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    assert tag.valid?
    assert_equal 0, tag.tag_level, "Base assignment doesn't work"
    assert tag.save!, "Saving Doesn't work for base case"
    tag_created_id = tag.id

    #Testing 1 to 2
    tag = Tag.new
    tag.user_id = user_id
    tag.name = "PlaceHolder"
    tag.tags_id = tag_level_one_id
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    assert tag.valid?
    assert_equal 2, tag.tag_level, "Assignment from one doesn't work"
    assert tag.save!, "Saving Doesn't work fron level one"

    #Testing from base
    tag = Tag.new
    tag.user_id = user_id
    tag.name = "PlaceHolder"
    tag.tags_id = tag_base_id
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    assert tag.valid?
    assert_equal 1, tag.tag_level, "Assignment from base doesn't work"
    assert tag.save!, "Saving Doesn't work fron level one"

    #Testing from created tag
    tag = Tag.new
    tag.user_id = user_id
    tag.name = "PlaceHolder"
    tag.tags_id = tag_created_id
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    assert tag.valid?
    assert_equal 1, tag.tag_level, "Assignment from created base doesn't work"
    assert tag.save!, "Saving Doesn't work fron level one"
  end
  test "Tags cannot have Null User or Name" do
    user_id = users('one').id
    tag = Tag.new
    tag.tag_level = 0 #TODO: Remove this at a later date
    tag.valid? #OLD: Perform generation of list_order. TODO: Maybe see about doing the same with level

    #Test nil name and user is bad
    assert_raise(Exception) {tag.save(validate: false)} #Database validation
    assert_not tag.save, "Model validation failed" #Model validation

    #Test nil user is bad
    tag.name = "Dab Dab Dab"
    assert_raise(Exception) {tag.save(validate: false)} #Database validation
    assert_not tag.save, "Model validation failed" #Model validation

    #Test nil user_id is bad
    tag.user_id = user_id
    tag.name = nil
    assert_raise(Exception) {tag.save(validate: false)} #Database validation
    assert_not tag.save, "Model validation failed" #Model validation

    #Test that assignment works
    tag.name = "Dab Dab Dab"
    assert tag.save!
    flunk "Not finished converting from item to tag"
    flunk "Waiting for Tag Level testing"
  end
  test "Acceptable Usernames" do
    flunk "Still need to decide on good character sets and preprocessing"
  end
end
