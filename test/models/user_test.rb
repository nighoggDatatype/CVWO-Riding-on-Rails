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
  
  test "Cascade Delete" do
    flunk "TBC"
  end
end
