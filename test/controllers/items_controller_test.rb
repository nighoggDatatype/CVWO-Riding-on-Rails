require 'test_helper'

class ItemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:three)
    @item = items(:one)
    @item_2 = items(:two)
    @badUser = users(:one)
    @tag_one = tags(:one)
    @tag_two = tags(:two)
    @tag_three = tags(:three)

    @bad_id = 1234
    assert_nil Item.find_by id: @bad_id
    @bad_user_id = 1234
    assert_nil User.find_by id: @bad_user_id
    @bad_tag_id = 1234
    assert_nil Tag.find_by id: @bad_tag_id
  end
  
  test "should get index" do
    get user_items_url(@user)
    assert_response :success
    assert_equal 2, json_response.length
    assert_equal "Kill_kill_kill", json_response[0]["task"]
  end
    
  test "should create item" do
    assert_difference('Item.count') do #TODO: Check this works later
      post user_items_url(@user), params: { item: {done: false, task: "Hello World", tag_ids: [@tag_one.id, @tag_two.id]} }
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
    post user_items_url(@bad_user_id), params: { item: {done: false, task: "Hello World", tag_ids: [@tag_one.id, @tag_two.id]} }
    assert_response :forbidden
  end

  test "should not create bad item" do
    post user_items_url(@user), params: { item: {done: false, tag_ids: [@tag_one.id, @tag_two.id]} }
    assert_response :unprocessable_entity
    
    post user_items_url(@user), params: { item: {done: false, tag_ids: [@bad_tag_id]} }
    assert_response :not_found
    
    patch user_item_url(@user, @item), params: { item: {tag_ids: [tags("mismatch").id]} }
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
    patch user_item_url(@user, @item), params: { item: {tag_ids: []} }
    assert_response :ok

    assert_equal "Kill_kill_kill", json_response["task"]
    assert_equal @item.done, json_response["done"]
    assert_equal 0, json_response["tags"].length

    updated_item = Item.find(json_response["id"])
    assert_equal "Kill_kill_kill", updated_item.task
    assert_equal @user.id, updated_item.user_id
    assert_equal 0, ItemTag.where(item_id: json_response["id"]).count
  end

  test "should not update item for bad user" do
    patch user_item_url(@badUser, @item), params: { item: {tag_ids: []} }
    assert_response :forbidden
  end

  test "should not update item with bad tag" do
    patch user_item_url(@user, @item), params: { item: {tag_ids: [@bad_tag_id]} }
    assert_response :not_found
  end

  test "should not update item with bad data" do
    patch user_item_url(@user, @item), params: { item: {tag_ids: [tags("mismatch").id]} }
    assert_response :unprocessable_entity
  end

  test "should not update non-existant item" do
    patch user_item_url(@user, @bad_id), params: { tag: {name: "EEEEEEEEEE"} }
    assert_response :not_found
  end

  test "should swap items" do
    src_loc = @item.list_order
    dst_loc = @item_2.list_order
    patch user_item_url(@user, @item), params: { swap: {target: @item_2.id }, is_swap: true}
    assert_response :ok

    assert_equal 2, json_response.length
    #Asserting specific ordering cause swap
    assert_equal @item.id, json_response[1]["id"]
    assert_equal @item_2.id, json_response[0]["id"]
    assert_equal @item.task, json_response[1]["task"]
    assert_equal @item_2.task, json_response[0]["task"]

    updated_item_one = Item.find(@item.id)
    updated_item_two = Item.find(@item_2.id)
    assert_equal @user, updated_item_one.user
    assert_equal @user, updated_item_two.user
    assert_equal src_loc, updated_item_two.list_order
    assert_equal dst_loc, updated_item_one.list_order
  end

  test "should not swap item for bad user" do
    item_3 = items(:three)
    #Making sure that bad user due to item_3 overrides non-existant item from @bad_id
    patch user_item_url(@user, @bad_id), params: { swap: {target: item_3.id }, is_swap: true}
    assert_response :forbidden
  end

  test "should not swap non-existant item" do
    patch user_item_url(@user, @item), params: { swap: {target: @bad_id }, is_swap: true}
    assert_response :not_found
  end

  test "should not swap same item" do
    patch user_item_url(@user, @item), params: { swap: {target: @item.id }, is_swap: true}
    assert_response :unprocessable_entity
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
