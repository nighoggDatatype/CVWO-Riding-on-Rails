require 'test_helper'

class TagTest < ActiveSupport::TestCase
  test "Test Generation of Tag Levels" do
    user = users('three')
    tag_base = tags('one')
    tag_level_one = tags('three')

    #Testing Base Case
    tag = Tag.new
    tag.user = user
    tag.name = "PlaceHolder"
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    tag.valid? #Not checking here, tag.save! will provide better error logging
    assert_equal 0, tag.tag_level, "Base assignment doesn't work"
    assert tag.save!, "Saving Doesn't work for base case"
    created_tag = tag

    #Testing 1 to 2
    tag = Tag.new
    tag.user = user
    tag.name = "PlaceHolder"
    tag.parent_tag = tag_level_one
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    tag.valid? #Not checking here, tag.save! will provide better error logging
    assert_equal 2, tag.tag_level, "Assignment from one doesn't work"
    assert tag.save!, "Saving Doesn't work fron level one"

    #Testing from base
    tag = Tag.new
    tag.user = user
    tag.name = "PlaceHolder"
    tag.parent_tag = tag_base
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    tag.valid? #Not checking here, tag.save! will provide better error logging
    assert_equal 1, tag.tag_level, "Assignment from base doesn't work"
    assert tag.save!, "Saving Doesn't work fron level one"

    #Testing from created tag
    tag = Tag.new
    tag.user = user
    tag.name = "PlaceHolder"
    tag.parent_tag = created_tag
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    tag.valid? #Not checking here, tag.save! will provide better error logging
    assert_equal 1, tag.tag_level, "Assignment from created base doesn't work"
    assert tag.save!, "Saving Doesn't work fron level one"
  end

  test "Tags cannot have Null User, Name, or Level" do
    user = users('one')
    tag = Tag.new
    tag.valid?

    #Test nil name and user is bad
    assert_raise(Exception) {tag.save(validate: false)} #Database validation
    assert_not tag.save, "Model validation failed" #Model validation

    #Test nil user is bad
    tag.name = "Dab Dab Dab"
    assert_raise(Exception) {tag.save(validate: false)} #Database validation
    assert_not tag.save, "Model validation failed" #Model validation

    #Test nil name is bad
    tag.user = user
    tag.name = nil
    assert_raise(Exception) {tag.save(validate: false)} #Database validation
    assert_not tag.save, "Model validation failed" #Model validation

    #Test nil tag level works
    tag.name = "Dab Dab Dab"
    tag.tag_level = nil
    assert_raise(Exception) {tag.save(validate: false)} #Database validation

    #Test that assignment works
    assert tag.save!
  end
  test "Acceptable Tag Names" do
    flunk "Still need to decide on good character sets and preprocessing"
  end
end
