require 'test_helper'

class ItemsControllerTest < ActionDispatch::IntegrationTest
  #TODO: Set up for items
  setup do
    @user = users(:three)
    @item = items(:one)
    @badUser = users(:one)
    @tag_one = tags(:one)
    @tag_two = tags(:two)
    @tag_three = tags(:three)

    @bad_id = 1234
    assert_nil Item.find_by id: @bad_id
    @bad_user_id = 1234
    assert_nil User.find_by id: @bad_user_id
  end
  
  test "should get index" do
    get user_items_url(@user)
    assert_response :success
    assert_equal 2, json_response.length
    assert_equal "Kill_kill_kill", json_response[0]["task"]
  end
    
  test "should create item" do
    assert_difference('Item.count') do #TODO: Check this works later
      post user_items_url(@user), params: { item: {done: false, task: "Hello World", tags: [@tag_one.id, @tag_two.id]} }
    end
  
    assert_response :created

    assert_equal "Hello World", json_response["task"]
    assert_not json_response["done"]
    assert_equal 2, json_response["tags"].length
    tag_data_one = {}
    tag_data_two = {}
    if json_response["tags"][0]["id"] == @tag_one.id
      tag_data_one = json_response["tags"][0]
      tag_data_two = json_response["tags"][1]
    else
      tag_data_one = json_response["tags"][1]
      tag_data_two = json_response["tags"][0]
    end
    assert_equal @tag_one.id, tag_data_one["id"]
    assert_equal @tag_two.id, tag_data_two["id"]
    assert_equal @tag_one.name, tag_data_one["name"]
    assert_equal @tag_two.name, tag_data_two["name"]

    updated_item = Item.find(json_response["id"])
    assert_equal @user, updated_item.user
    assert_equal json_response["task"], updated_item.task
    assert_equal 2, ItemTag.where(item_id: json_response["id"]).where(tag: [@tag_one, @tag_two]).count
  end

  test "should not create item for non-existant user" do
    post user_items_url(@bad_user_id), params: { item: {done: false, task: "Hello World", tags: [@tag_one.id, @tag_two.id]} }
    assert_response :forbidden
  end

  test "should not create bad item" do
    post user_items_url(@user), params: { item: {done: false, tags: [@tag_one.id, @tag_two.id]} }
    assert_response :unprocessable_entity
  end
  
  test "should show item" do
    get user_item_url(@user, @item)
    assert_response :success

    assert_equal "Kill_kill_kill", json_response["task"]
    assert_equal @item.done, json_response["done"]
    assert_equal 2, json_response["tags"].length
    tag_data_two = {}
    tag_data_three = {}
    if json_response["tags"][0]["id"] == @tag_two.id
      tag_data_two = json_response["tags"][0]
      tag_data_three = json_response["tags"][1]
    else
      tag_data_two = json_response["tags"][1]
      tag_data_three = json_response["tags"][0]
    end
    assert_equal @tag_two.id, tag_data_two["id"]
    assert_equal @tag_three.id, tag_data_three["id"]
    assert_equal @tag_two.name, tag_data_two["name"]
    assert_equal @tag_three.name, tag_data_three["name"]
    assert_nil tag_data_two["tags_id"]
    assert_equal @tag_one.id, tag_data_three["tags_id"]
  end

  test "should not show item to bad user" do
    get user_item_url(@badUser, @item)
    assert_response :forbidden
  end

  test "should not show item to non-existant user" do
    get user_item_url(@bad_user_id, @item)
    assert_response :forbidden 
  end

  test "should not show non-existant item" do
    get user_item_url(@user, @bad_id)
    assert_response :not_found
  end

  test "should update item" do
    flunk "Not adjusted"
    patch user_tag_url(@user, @tag), params: { tag: {name: "Tutorial"} }
    assert_response :ok
    assert_nil json_response["tags_id"]
    assert_equal "Tutorial", json_response["name"]

    updated_tag = Tag.find(json_response["id"])
    assert_equal "Tutorial", updated_tag.name
    assert_equal @user.id, updated_tag.user_id
  end

  test "should not update item for bad user" do
    flunk "Not adjusted"
    patch user_tag_url(@badUser, @tag), params: { tag: {name: "Tutorial"} }
    assert_response :forbidden
  end

  test "should not update item with bad data" do
    flunk "Not adjusted"
    patch user_tag_url(@user, @tag), params: { tag: {name: "Latin"} }
    assert_response :unprocessable_entity
  end

  test "should not update non-existant item" do
    flunk "Not adjusted"
    assert_nil Tag.find_by id: @bad_id
    patch user_tag_url(@user, 1234), params: { tag: {name: "EEEEEEEEEE"} }
    assert_response :not_found
  end

  test "should swap items" do
    flunk "Not adjusted"
    patch user_tag_url(@user, @tag), params: { tag: {name: "Tutorial"} }
    assert_response :ok
    assert_nil json_response["tags_id"]
    assert_equal "Tutorial", json_response["name"]

    updated_tag = Tag.find(json_response["id"])
    assert_equal "Tutorial", updated_tag.name
    assert_equal @user.id, updated_tag.user_id
  end

  test "should not swap item for bad user" do
    flunk "Not adjusted"
    patch user_tag_url(@badUser, @tag), params: { tag: {name: "Tutorial"} }
    assert_response :forbidden
  end

  test "should not swap non-existant item" do
    flunk "Not adjusted"
    assert_nil Tag.find_by id: @bad_id
    patch user_tag_url(@user, 1234), params: { tag: {name: "EEEEEEEEEE"} }
    assert_response :not_found
  end
  
  test "should destroy item" do
    assert_difference('Item.count', -1) do
      assert_difference('ItemTag.count', -2) do
        delete user_item_url(@user, @item)
      end
    end
  
    assert_response :no_content
  end

  test "should not destroy non-existant item" do
    delete user_item_url(@user, @bad_id)
    
    assert_response :not_found
  end
end
