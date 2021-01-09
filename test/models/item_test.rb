require 'test_helper'

class ItemTest < ActiveSupport::TestCase
  test "Items correctly auto assign" do 
    user_id = users('one').id
    #Testing Default Assignment
    item = Item.new
    item.user_id = user_id
    item.done = false
    item.task = "Example Task"
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    assert item.valid? #Model validation
    assert_equal 0, item.list_order, "Default Assignment Not Working"
    assert item.save #Database validation

    #New item, testing Auto Increment
    item = Item.new
    item.user_id = user_id
    item.done = false
    item.task = "Example Thing"
    assert item.valid? #Model validation
    assert_equal 1, item.list_order, "Auto Increment Not Working"
    assert item.save #Database validation

    #Testing overriding auto assignment
    item = Item.new
    item.user_id = user_id
    item.done = false
    item.task = "Example Thing"
    item.list_order = 3
    assert item.valid? #Model validation
    assert_equal 0, Item.where(user_id: user_id).where(list_order: 2).count, "Test setup invalid"
    assert_equal 3, item.list_order, "Auto Increment Occurring anyways"
    assert item.save #Database validation

  end
  test "Items cannot have null fields" do
    user_id = users('one').id
    item = Item.new
    item.user_id = user_id
    item.done = false
    item.list_order = 0 #Go around auto assignment to force testing of item validation
    #Test nil task is bad
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    assert_not item.save, "Model validation failed" #Model validation
    #Test nil done is bad
    item.task = "Example Task"
    item.done = nil
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    assert_not item.save, "Model validation failed" #Model validation
    #Test nil user_id is bad
    item.done = true
    item.user_id = nil
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    assert_not item.save, "Model validation failed" #Model validation

    flunk "Need to do auto assign first"
  end
end
