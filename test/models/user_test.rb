require 'test_helper'

class UserTest < ActiveSupport::TestCase #TODO: Run the test cases
  test "must have username" do
    user = User.new
    assert_not user.save, "Saved a user without generating a username"
  end

  test "unique username" do
    userA = User.new
    userA.username = "A"
    userA.save
    userB = User.new
    userB.username = "A"
    assert_not userB.save, "Saved a user without a unique username"
    userB.username = "B"
    assert userB.save, "Unable to save a user that has a unique username"
  end
end
