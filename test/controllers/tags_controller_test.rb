require 'test_helper'

class TagsControllerTest < ActionDispatch::IntegrationTest
  # TODO: Verify content retrived
  
  setup do
    @user = users(:three)
    @tag = tags(:one)
  end
  
  test "should get index" do
    get user_tags_url(@user)
    assert_response :success
    assert_equal 4, json_response.length
    assert_equal "Cringe", json_response[2]["name"]
  end
    
  test "should create tag" do
    assert_difference('Tag.count') do
      post user_tags_url(@user), params: { tag: {user_id: @user.id, name: "Tutorial"} }
    end
  
    assert_response :created
    flunk "TBC, need to check content"
  end
  
  test "should show tag" do
    get user_tag_url(@user, @tag)
    assert_response :success
    flunk "TBC, need to check content"
    flunk "TBC, need to check for failure"
  end

  test "should update tag" do
    patch user_tag_url(@user, @tag), params: { tag: {user_id: @user.id, name: "Tutorial"} }
    assert_response :ok
    assert_equal nil, json_response["tags_id"]
    assert_equal "Tutorial", json_response["name"]

    created_tag = Tag.find(json_response["id"])
    assert_equal "Tutorial", created_tag.name
    assert_equal @user.id, created_tag.user_id
  end
  
  test "should destroy tag" do
    assert_difference('Tag.count', -2) do
      delete user_tag_url(@user, @tag)
    end
  
    assert_redirected_to user_tags_url(@user) #TODO: Figure out the correct response code testing
    flunk "TBC, need to check content"
  end
end
