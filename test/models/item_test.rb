require 'test_helper'

class ItemTest < ActiveSupport::TestCase
  test "Items correctly auto assign" do 
    user = users('one')
    #Testing Default Assignment
    item = Item.new
    item.user = user
    item.done = false
    item.task = "Example Task"
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    item.valid? #Run before_validation scripts
    assert_equal 0, item.list_order, "Default Assignment Not Working"
    assert item.save! #Database validation

    #New item, testing Auto Increment
    item = Item.new
    item.user = user
    item.done = false
    item.task = "Example Thing"
    item.valid? #Run before_validation scripts
    assert_equal 1, item.list_order, "Auto Increment Not Working"
    assert item.save! #Database validation

    #Testing overriding auto assignment
    item = Item.new
    item.user = user
    item.done = false
    item.task = "Example Thing"
    item.list_order = 3
    item.valid? #Run before_validation scripts
    assert_equal 0, Item.where(user_id: user.id).where(list_order: 2).count, "Test setup invalid"
    assert_equal 3, item.list_order, "Auto Increment Occurring anyways"
    assert item.save! #Database validation

    #Testing whether assignment is indepedent between users
    user = users('two')
    item = Item.new
    item.user = user
    item.done = false
    item.task = "Example Task"
    item.valid? #Run before_validation scripts
    assert_equal 0, item.list_order, "Default Assignment for Second user Not Working"
    assert item.save! #Database validation

  end
  test "Items cannot have null fields" do
    user = users('one')
    item = Item.new
    item.user = user
    item.done = false
    item.valid? #Perform generation of list_order

    #Test nil task is bad
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    assert_not item.save, "Model validation failed" #Model validation

    #Test nil done is bad
    item.task = "Example Task"
    item.done = nil
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    assert_not item.save, "Model validation failed" #Model validation

    #Test nil user is bad
    item.done = true
    item.user = nil
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    assert_not item.save, "Model validation failed" #Model validation

    #Test that assignment works
    item.user = user
    assert item.save!
  end

  test "Task description has no newlines" do
    flunk "TBC"
  end

  test "List order is unique per user" do
    user = users('three')
    item = Item.new
    item.user = user
    item.done = false
    item.task = "Example Thing"
    item.list_order = 0
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    assert_not item.save, "Model validation failed" #Model validation
    item.list_order = 1
    assert_raise(Exception) {item.save(validate: false)} #Database validation
    assert_not item.save, "Model validation failed" #Model validation

    #Test it works normally
    item.list_order = 2
    assert item.save!
  end

  test "Foreign Key Restrictions in Schema" do
    user = users('one')
    item = Item.new
    item.done = false
    item.task = "Example Task"
    item.valid?

    #Testing Bad Assignment
    item.user_id = 888
    assert_raise(Exception) {item.save(validate: false)} #Database validation

    #Testing Good Assignment
    item.user_id = user.id
    assert item.save! #Database validation
  end

  test "Cascade Delete" do
    flunk "TBC"
  end

  test "Automatic Consolidation of List Order" do
    flunk "TBC"
  end
end
