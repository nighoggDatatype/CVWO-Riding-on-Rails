require 'test_helper'

class UserTest < ActiveSupport::TestCase #TODO: Run the test cases
  test "must have username" do
    user = User.new
    assert_raise(Exception) {user.save(validate: false)} #Testing Database constraints
    assert_not user.save, "Saved a user without generating a username" #Testing validation
  end

  test "unique username" do
    userA = User.new
    userA.username = "A"
    userA.save
    userB = User.new
    userB.username = "A"
    assert_raise(Exception) {userB.save(validate: false)} #Testing Database constraints
    assert_not userB.save, "Saved a user without a unique username"
    userB.username = "B"
    assert userB.save, "Unable to save a user that has a unique username"
  end
end
