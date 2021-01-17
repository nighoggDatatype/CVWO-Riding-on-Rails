require 'test_helper'

class TodoAppControllerTest < ActionDispatch::IntegrationTest
  def setup
    Rails.application.load_seed #TODO: When I write test code for user controller, add this there
  end

  test "should get index" do
    get todo_app_index_url
    assert_response :success
  end

end
