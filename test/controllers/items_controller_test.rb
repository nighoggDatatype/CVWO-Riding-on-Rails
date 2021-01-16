require 'test_helper'

class ItemsControllerTest < ActionDispatch::IntegrationTest
  #TODO: Set up for items
  setup do
    @user = users(:three)
    @item = items(:one)
    @badUser = users(:one)

    @bad_id = 1234
    assert_nil Item.find_by id: @bad_id
    @bad_user_id = 1234
    assert_nil User.find_by id: @bad_user_id
  end
  
  test "should get index" do
    get user_items_url(@user)
    assert_response :success
    assert_equal 2, json_response.length
    assert_equal 0, json_response[0]["list_order"]
  end
    
  test "should create item" do
    assert_difference('Item.count') do #TODO: Figure out how to pass tags in params
      post user_items_url(@user), params: { item: {done: false, task: "Hello World", tags: [""]} }
    end
  
    assert_response :created

    assert_equal "Tutorial", json_response["name"]

    updated_tag = Tag.find(json_response["id"])
    assert_equal @user, updated_tag.user
    assert_equal json_response["name"], updated_tag.name
    flunk "Not adjusted"
  end

  test "should not create tag for non-existant user" do
    post user_tags_url(@bad_user_id), params: { tag: {name: "Tutorial"} }
    assert_response :forbidden
    flunk "Not adjusted"
  end

  test "should not create bad tag" do
    post user_tags_url(@user), params: { tag: {name: "Dab Time"} }
    assert_response :unprocessable_entity
    flunk "Not adjusted"
  end
  
  test "should show tag" do
    get user_tag_url(@user, @tag)
    assert_response :success
    assert_nil json_response["tags_id"]
    assert_equal "Dab Time", json_response["name"]

    updated_tag = Tag.find(json_response["id"])
    assert_equal "Dab Time", updated_tag.name
    assert_equal @user.id, updated_tag.user_id
    flunk "Not adjusted"
  end

  test "should not show tag to bad user" do
    get user_tag_url(@badUser, @tag)
    assert_response :forbidden
    flunk "Not adjusted"
  end

  test "should not show tag to non-existant user" do
    get user_tag_url(@bad_user_id, @tag)
    assert_response :forbidden 
    flunk "Not adjusted"
  end

  test "should not show non-existant tag" do
    get user_tag_url(@user, @bad_id)
    assert_response :not_found
    flunk "Not adjusted"
  end

  test "should update tag" do
    patch user_tag_url(@user, @tag), params: { tag: {name: "Tutorial"} }
    assert_response :ok
    assert_nil json_response["tags_id"]
    assert_equal "Tutorial", json_response["name"]

    updated_tag = Tag.find(json_response["id"])
    assert_equal "Tutorial", updated_tag.name
    assert_equal @user.id, updated_tag.user_id
    flunk "Not adjusted"
  end

  test "should not update tag for bad user" do
    patch user_tag_url(@badUser, @tag), params: { tag: {name: "Tutorial"} }
    assert_response :forbidden
    flunk "Not adjusted"
  end

  test "should not update tag with bad data" do
    patch user_tag_url(@user, @tag), params: { tag: {name: "Latin"} }
    assert_response :unprocessable_entity
    flunk "Not adjusted"
  end

  test "should not update non-existant tag" do
    assert_nil Tag.find_by id: @bad_id
    patch user_tag_url(@user, 1234), params: { tag: {name: "EEEEEEEEEE"} }
    assert_response :not_found
    flunk "Not adjusted"
  end
  
  test "should destroy tag" do
    assert_difference('Tag.count', -2) do
      delete user_tag_url(@user, @tag)
    end
  
    assert_response :no_content
    flunk "Not adjusted"
  end

  test "should not destroy non-existant tag" do
    delete user_tag_url(@user, @bad_id)
    
    assert_response :not_found
    flunk "Not adjusted"
  end
end
