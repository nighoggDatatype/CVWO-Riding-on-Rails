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

  test "Test parent tag tag_level and user restrictions" do
    tag = Tag.new
    #Test base tag must have level 0
    tag.user = users('one')
    tag.name = "Dab Dab Dab"
    tag.tag_level = 2
    assert_not tag.save

    #Test parent tag must have same parent
    parent = tags('three')
    tag.parent_tag = parent
    assert_not tag.save

    #Test tag_level must be non-negative
    #NOTE: Cannot test, either recursive validation, or base tag != 0 will mask this.

    #Test tag_level must be exactly one greater than parent
    tag.user = users('three')
    tag.parent_tag = parent
    tag.tag_level = 3
    assert_not tag.save
    tag.tag_level = 1
    assert_not tag.save
    tag.tag_level = 0
    assert_not tag.save

    #Test valid case
    tag.tag_level = 2
    assert tag.save
  end
 
  test "Acceptable Tag Names" do
    tag = Tag.new
    tag.user = users('one')
    tag.name = ":"
    assert_not tag.valid?
    tag.name = ":Normal tag"
    assert_not tag.valid?
    tag.name = "><\"\""
    assert tag.valid?
    tag.name = " - ~~~ Grand Opening ~~~ - "
    assert tag.valid?
    tag.name = "      "
    assert_not tag.valid?
    tag.name = "\t"
    assert_not tag.valid?
    tag.name = "`~1234567890()*7%64##2{''"
    assert tag.valid?
  end

  test "Foreign Key Restrictions in Schema" do
    user = users('one')
    tag = Tag.new
    tag.name = "Generic Tag"

    #Checking user validation
    tag.tag_level = 0
    tag.user_id = 888
    assert_raise(Exception) {tag.save(validate: false)}

    #Checking good user validation
    tag.user_id = user.id
    assert tag.save!
    parent = tag

    #Checking tag validation
    tag = Tag.new
    tag.name = "Derived"
    tag.user_id = user.id
    tag.tag_level = 1
    tag.tags_id = 888
    assert_raise(Exception) {tag.save(validate: false)}

    #Checking good tag validation
    tag.tags_id = parent.id
    assert tag.save!
  end

  test "Cascade Delete Model" do
    tag = tags("one")
    derivedTag = tags("three")
    assert_equal tag, derivedTag.parent_tag

    tag_id = tag.id
    derivedTag_id = derivedTag.id

    assert_equal 4, ItemTag.count
    assert_equal 2, ItemTag.where(tag_id: derivedTag_id).count
    assert_equal 1, Tag.where(id: derivedTag_id).count

    tag.destroy
    assert_equal 2, ItemTag.count
    assert_equal 0, ItemTag.where(tag_id: derivedTag_id).count
    assert_equal 0, Tag.where(id: derivedTag_id).count
  end

  test "Cascade Delete Schema" do
    tag = tags("one")
    derivedTag = tags("three")
    assert_equal tag, derivedTag.parent_tag

    tag_id = tag.id
    derivedTag_id = derivedTag.id

    assert_equal 4, ItemTag.count
    assert_equal 2, ItemTag.where(tag_id: derivedTag_id).count
    assert_equal 1, Tag.where(id: derivedTag_id).count

    tag.delete
    assert_equal 2, ItemTag.count
    assert_equal 0, ItemTag.where(tag_id: derivedTag_id).count
    assert_equal 0, Tag.where(id: derivedTag_id).count
  end

  test "Accessing Tagged items" do
    tag = tags("three")
    assert_equal 2, tag.items.count
    assert tag.items.exists? items("two").id
    assert tag.items.exists? items("one").id

    tag = tags("one")
    assert_equal 0, tag.items.count
    
    tag = tags("filler")
    assert_equal 1, tag.items.count
    assert tag.items.exists? items("two").id
    assert_not tag.items.exists? items("one").id
  end
end
