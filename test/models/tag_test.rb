require 'test_helper'

class TagTest < ActiveSupport::TestCase
  test "Test Generation of Tag Levels" do
    flunk "TBC"
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
