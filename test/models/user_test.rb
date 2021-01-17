require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "must have username" do
    user = User.new
    assert_raise(Exception) {user.save(validate: false)} #Testing Database constraints
    assert_not user.save, "Saved a user without generating a username" #Testing validation
  end

  test "unique username" do 
    userA = User.new
    userA.username = "Apples1234"
    userA.save
    userB = User.new
    userB.username = "Apples1234"
    assert_raise(Exception) {userB.save(validate: false)} #Testing Database constraints
    assert_not userB.save, "Saved a user without a unique username" #Testing validation
    userB.username = "Banananana"
    assert userB.save!, "Unable to save a user that has a unique username"
  end

  test "Good username length and Format" do
    user = User.new

    #Test shortness
    user.username = "A"
    assert_not user.valid?
    user.username = "123456789"
    assert_not user.valid?
    user.username = "1234567"
    assert_not user.valid?
    user.username = "1234567890"
    assert user.save

    #Test character set
    user.username = "!@#$00000000"
    assert_not user.valid?
    user.username = "User Name 234"
    assert_not user.valid?
    user.username = "User-Name-234"
    assert_not user.save
    user.username = "User_Name_234"
    assert user.valid?
    user.username = "UserName234"
    assert user.valid?
    user.username = "uSERnAME234"
    assert user.valid?
  end
  
  test "Cascade Delete Model" do
    user = users("three")
    user_id = user.id

    assert_equal 4, TabTag.count
    assert_equal 4, ItemTag.count
    assert_equal 3, Tab.count
    assert_equal 3, Item.count
    assert_equal 5, Tag.count
    assert_equal 4, Tag.where(user_id: user_id).count

    user.destroy
    assert_equal 0, TabTag.count
    assert_equal 0, ItemTag.count
    assert_equal 1, Tab.count
    assert_equal 1, Item.count
    assert_equal 1, Tag.count
    assert_equal 0, Tag.where(user_id: user_id).count
  end

  test "Cascade Delete Schema" do
    user = users("three")
    user_id = user.id

    assert_equal 4, TabTag.count
    assert_equal 4, ItemTag.count
    assert_equal 3, Tab.count
    assert_equal 3, Item.count
    assert_equal 5, Tag.count
    assert_equal 4, Tag.where(user_id: user_id).count

    user.delete
    assert_equal 0, TabTag.count
    assert_equal 0, ItemTag.count
    assert_equal 1, Tab.count
    assert_equal 1, Item.count
    assert_equal 1, Tag.count
    assert_equal 0, Tag.where(user_id: user_id).count
  end
end
