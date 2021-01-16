require 'test_helper'

class ItemsControllerTest < ActionDispatch::IntegrationTest
  #TODO: Set up for items
  setup do
    @user = users(:three)
    @item = items(:one)
    @badUser = users(:one)
    @tag_one = tags(:one)
    @tag_two = tags(:two)

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
    assert_difference('Item.count') do #TODO: Check this works later
      post user_items_url(@user), params: { item: {done: false, task: "Hello World", tags: [@tag_one.id, @tag_two.id]} }
    end
  
    assert_response :created

    assert_equal "Hello World", json_response["task"]
    assert_not json_response["done"]
    assert_equal 2 json_response["tags"]
    flunk "TODO: Check contents of tags"

    updated_tag = Tag.find(json_response["id"])
    assert_equal @user, updated_tag.user
    assert_equal json_response["task"], updated_tag.task
    flunk "TODO: Figure out how to check contents of task"
  end

  test "should not create tag for non-existant user" do
    flunk "Not adjusted"
    post user_tags_url(@bad_user_id), params: { tag: {name: "Tutorial"} }
    assert_response :forbidden
  end

  test "should not create bad tag" do
    flunk "Not adjusted"
    post user_tags_url(@user), params: { tag: {name: "Dab Time"} }
    assert_response :unprocessable_entity
  end
  
  test "should show tag" do
    flunk "Not adjusted"
    get user_tag_url(@user, @tag)
    assert_response :success
    assert_nil json_response["tags_id"]
    assert_equal "Dab Time", json_response["name"]

    updated_tag = Tag.find(json_response["id"])
    assert_equal "Dab Time", updated_tag.name
    assert_equal @user.id, updated_tag.user_id
  end

  test "should not show tag to bad user" do
    flunk "Not adjusted"
    get user_tag_url(@badUser, @tag)
    assert_response :forbidden
  end

  test "should not show tag to non-existant user" do
    flunk "Not adjusted"
    get user_tag_url(@bad_user_id, @tag)
    assert_response :forbidden 
  end

  test "should not show non-existant tag" do
    flunk "Not adjusted"
    get user_tag_url(@user, @bad_id)
    assert_response :not_found
  end

  test "should update tag" do
    flunk "Not adjusted"
    patch user_tag_url(@user, @tag), params: { tag: {name: "Tutorial"} }
    assert_response :ok
    assert_nil json_response["tags_id"]
    assert_equal "Tutorial", json_response["name"]

    updated_tag = Tag.find(json_response["id"])
    assert_equal "Tutorial", updated_tag.name
    assert_equal @user.id, updated_tag.user_id
  end

  test "should not update tag for bad user" do
    flunk "Not adjusted"
    patch user_tag_url(@badUser, @tag), params: { tag: {name: "Tutorial"} }
    assert_response :forbidden
  end

  test "should not update tag with bad data" do
    flunk "Not adjusted"
    patch user_tag_url(@user, @tag), params: { tag: {name: "Latin"} }
    assert_response :unprocessable_entity
  end

  test "should not update non-existant tag" do
    flunk "Not adjusted"
    assert_nil Tag.find_by id: @bad_id
    patch user_tag_url(@user, 1234), params: { tag: {name: "EEEEEEEEEE"} }
    assert_response :not_found
  end

  test "should swap tags" do
    flunk "Not adjusted"
    patch user_tag_url(@user, @tag), params: { tag: {name: "Tutorial"} }
    assert_response :ok
    assert_nil json_response["tags_id"]
    assert_equal "Tutorial", json_response["name"]

    updated_tag = Tag.find(json_response["id"])
    assert_equal "Tutorial", updated_tag.name
    assert_equal @user.id, updated_tag.user_id
  end

  test "should not swap tag for bad user" do
    flunk "Not adjusted"
    patch user_tag_url(@badUser, @tag), params: { tag: {name: "Tutorial"} }
    assert_response :forbidden
  end

  test "should not swap non-existant tag" do
    flunk "Not adjusted"
    assert_nil Tag.find_by id: @bad_id
    patch user_tag_url(@user, 1234), params: { tag: {name: "EEEEEEEEEE"} }
    assert_response :not_found
  end
  
  test "should destroy tag" do
    assert_difference('Item.count', -1) do
      assert_difference('ItemTag.count', -2)
        delete user_item_url(@user, @item)
      end
    end
  
    assert_response :no_content
  end

  test "should not destroy non-existant tag" do
    delete user_item_url(@user, @bad_id)
    
    assert_response :not_found
  end
end
