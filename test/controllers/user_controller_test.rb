require 'test_helper'

class UserControllerTest < ActionDispatch::IntegrationTest
  def setup
    Rails.application.load_seed
  end

  test "should get index" do
    get user_index_url(params: {username: "default"})
    assert_response :conflict
    get user_index_url(params: {username: "RandomInvalidUsername"})
    assert_response :no_content
  end
end
