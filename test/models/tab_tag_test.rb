require 'test_helper'

class TabTagTest < ActiveSupport::TestCase
  test "Foreign Key Restrictions in Schema" do
    user = users("three")
    tab = tabs("one")
    tag = tags("filler")

    #Checking tag validation
    relation = TabTag.new
    relation.tab_id = tab.id
    relation.tag_id = 888
    assert_raise(Exception) {relation.save(validate: false)}

    #Checking tab validation
    relation.tab_id = 888
    relation.tag_id = tag.id
    assert_raise(Exception) {relation.save(validate: false)}

    #Checking null hypothesis
    relation.tab_id = tab.id
    assert relation.save!
  end

  test "Relationships must be unique" do
    user = users("three")
    tag = tags("filler")

    #Checking Model Validation
    tab = tabs("two")
    assert_raise(Exception) {tab.tags << tag}

    #Checking DB Constraints
    relation = TabTag.new
    relation.tab = tab
    relation.tag = tag
    assert_raise(Exception) {relation.save(validate: false)}

    #Checking null hypothesis
    tab = tabs("one")
    tab.tags << tag
    assert tab.save!
  end
  
  test "Tab and Tags must have same User" do
    tab = tabs("one")
    tag = tags("mismatch")
    relation = TabTag.new
    relation.tab = tab
    relation.tag = tag
    assert_not relation.save
    assert_raise(Exception) {tab.tags << tag}
  end
end
