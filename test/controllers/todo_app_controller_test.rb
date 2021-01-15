require 'test_helper'

class TodoAppControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get todo_app_index_url
    assert_response :success
  end

end
