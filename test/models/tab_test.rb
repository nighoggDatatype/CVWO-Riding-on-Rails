require 'test_helper'

class TabTest < ActiveSupport::TestCase
  test "Tabs correctly auto assign" do 
    user = users('one')
    #Testing Default Assignment
    tab = Tab.new
    tab.user = user
    assert_raise(Exception) {tab.save(validate: false)} #Database validation
    tab.valid? #Run before_validation scripts
    assert_equal 0, tab.tab_order, "Default Assignment Not Working"
    assert_equal "New Tab", tab.name, "Default Assignment Not Working"
    assert tab.save! #Database validation

    #New tab, testing Auto Increment
    tab = Tab.new
    tab.user = user
    tab.valid? #Run before_validation scripts
    assert_equal 1, tab.tab_order, "Auto Increment Not Working"
    assert_equal "New Tab_1", tab.name, "Default Assignment Not Working"
    assert tab.save! #Database validation

    #Testing overriding auto assignment
    tab = Tab.new
    tab.user = user
    tab.name = "Generic_search"
    tab.tab_order = 3
    tab.valid? #Run before_validation scripts
    assert_equal 0, Tab.where(user_id: user.id).where(tab_order: 2).count, "Test setup invalid"
    assert_equal 0, Tab.where(user_id: user.id).where(name: "Generic_search").count, "Test setup invalid"
    assert_equal 3, tab.tab_order, "Auto Increment Occurring anyways"
    assert_equal "Generic_search", tab.name, "Auto Assignment Occurring anyways"
    assert tab.save! #Database validation

    #Testing whether assignment is indepedent between users
    user = users('two')
    tab = Tab.new
    tab.user = user
    tab.valid? #Run before_validation scripts
    assert_equal 0, tab.tab_order, "Default Assignment for Second user Not Working"
    assert tab.save! #Database validation

  end
  
  test "Tabs cannot have null fields" do
    user = users('one')
    tab = Tab.new
    tab.user = user
    tab.tab_order = 0

    #Test nil name is bad
    assert_raise(Exception) {tab.save(validate: false)} #Database validation

    #Test nil tab_order is bad
    tab.name = "Example_Tab"
    tab.tab_order = nil
    assert_raise(Exception) {tab.save(validate: false)} #Database validation

    #Test nil user is bad
    tab.valid? #Run generation
    tab.user = nil
    assert_raise(Exception) {tab.save(validate: false)} #Database validation
    assert_not tab.save, "Model validation failed" #Model validation

    #Test that assignment works
    tab.user = user
    assert tab.save!
  end

  test "Tab name formatting" do
    user = users('one')
    tab = Tab.new
    tab.user = user
    tab.name = "Example\n Tab\n"
    assert_not tab.save
    tab.name = "Example Tab_1234"
    assert_not tab.save
    tab.name = "Example_Tab_1234"
    assert tab.save!
  end

  test "List order is unique per user" do
    user = users('three')
    tab = Tab.new
    tab.user = user
    tab.tab_order = 0
    assert_raise(Exception) {tab.save(validate: false)} #Database validation
    assert_not tab.save, "Model validation failed" #Model validation
    tab.tab_order = 1
    assert_raise(Exception) {tab.save(validate: false)} #Database validation
    assert_not tab.save, "Model validation failed" #Model validation

    #Test it works normally
    tab.tab_order = 2
    assert tab.save!
  end

  test "Foreign Key Restrictions in Schema" do
    user = users('one')
    tab = Tab.new 
    tab.user = user
    tab.valid? #TODO: Fix potential bug in items, by doing this temp user for assignment
    tab.user = nil

    #Testing Bad Assignment
    tab.user_id = 888
    assert_raise(Exception) {tab.save(validate: false)} #Database validation

    #Testing Good Assignment
    tab.user_id = user.id
    assert tab.save! #Database validation
  end

  test "Cascade Delete Model" do
    tab = tabs("two")
    tab_id = tab.id

    assert_equal 4, TabTag.count
    assert_equal 2, TabTag.where(tab_id: tab_id).count

    tab.destroy
    assert_equal 2, TabTag.count
    assert_equal 0, TabTag.where(tab_id: tab_id).count
  end

  test "Cascade Delete Schema" do
    tab = tabs("two")
    tab_id = tab.id

    assert_equal 4, TabTag.count
    assert_equal 2, TabTag.where(tab_id: tab_id).count

    tab.delete
    assert_equal 2, TabTag.count
    assert_equal 0, TabTag.where(tab_id: tab_id).count
  end

  test "Automatic Consolidation of Tab Order" do
    flunk "TBC"
  end
end
