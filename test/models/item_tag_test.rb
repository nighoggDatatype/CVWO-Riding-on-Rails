require 'test_helper'

class ItemTagTest < ActiveSupport::TestCase
  test "Foreign Key Restrictions in Schema" do
    user = users("three")
    item = items("one")
    tag = tags("filler")

    #Checking tag validation
    relation = ItemTag.new
    relation.item_id = item.id
    relation.tag_id = 888
    assert_raise(Exception) {relation.save(validate: false)}

    #Checking item validation
    relation.item_id = 888
    relation.tag_id = tag.id
    assert_raise(Exception) {relation.save(validate: false)}

    #Checking null hypothesis
    relation.item_id = item.id
    assert relation.save!
  end
  test "Relationships must be unique" do
    user = users("three")
    tag = tags("filler")

    #Checking Model Validation
    item = items("two")
    assert_raise(Exception) {item.tags << tag}

    #Checking DB Constraints
    relation = ItemTag.new
    relation.item = item
    relation.tag = tag
    assert_raise(Exception) {relation.save(validate: false)}

    #Checking null hypothesis
    item = items("one")
    item.tags << tag
    assert item.save!
  end
  test "Item and Tags must have same User" do
    item = items("one")
    tag = tags("mismatch")
    relation = ItemTag.new
    relation.item = item
    relation.tag = tag
    assert_not relation.save
    assert_raise(Exception) {item.tags << tag}
  end
end
