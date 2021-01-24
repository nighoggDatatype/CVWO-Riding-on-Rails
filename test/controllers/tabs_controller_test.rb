require 'test_helper'

class TabsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:three)
    @tab = tabs(:one)
    @tab_2 = tabs(:two)
    @badUser = users(:one)
    @tag_one = tags(:one)
    @tag_two = tags(:two)
    @tag_three = tags(:three)

    @bad_id = 1234
    assert_nil Tab.find_by id: @bad_id
    @bad_user_id = 1234
    assert_nil User.find_by id: @bad_user_id
    @bad_tag_id = 1234
    assert_nil Tag.find_by id: @bad_tag_id
  end
  
  test "should get index" do
    get user_tabs_url(@user)
    assert_response :success
    assert_equal 2, json_response.length
    assert_equal "Tab_1", json_response[0]["name"]
  end
    
  test "should create tab" do
    assert_difference('Tab.count') do #TODO: Check this works later
      post user_tabs_url(@user), params: { tab: {name: "Hello_World", tag_ids: [@tag_one.id, @tag_two.id]} }
    end
  
    assert_response :created

    assert_equal "Hello_World", json_response["name"]
    assert_equal 2, json_response["tag_ids"].length
    tag_data_one = {}
    tag_data_two = {}
    if json_response["tag_ids"][0]["id"] == @tag_one.id
      tag_data_one = json_response["tag_ids"][0]
      tag_data_two = json_response["tag_ids"][1]
    else
      tag_data_one = json_response["tag_ids"][1]
      tag_data_two = json_response["tag_ids"][0]
    end
    assert_equal @tag_one.id, tag_data_one["id"]
    assert_equal @tag_two.id, tag_data_two["id"]
    assert_equal @tag_one.name, tag_data_one["name"]
    assert_equal @tag_two.name, tag_data_two["name"]

    updated_tab = Tab.find(json_response["id"])
    assert_equal @user, updated_tab.user
    assert_equal json_response["name"], updated_tab.name
    assert_equal 2, TabTag.where(tab_id: json_response["id"]).where(tag: [@tag_one, @tag_two]).count
  end

  test "should not create tab for non-existant user" do
    post user_tabs_url(@bad_user_id), params: { tab: {name: "Hello_World", tag_ids: [@tag_one.id, @tag_two.id]} }
    assert_response :forbidden
  end

  test "should not create bad tab" do
    post user_tabs_url(@user), params: { tab: {name: "Hello???", tag_ids: [@tag_one.id, @tag_two.id]} }
    assert_response :unprocessable_entity
    
    post user_tabs_url(@user), params: { tab: {tag_ids: [@bad_tag_id]} }
    assert_response :not_found
    
    patch user_tab_url(@user, @tab), params: { tab: {tag_ids: [tags("mismatch").id]} }
    assert_response :unprocessable_entity
  end
  
  test "should show tab" do
    get user_tab_url(@user, @tab)
    assert_response :success

    assert_equal "Tab_1", json_response["name"]
    assert_equal 2, json_response["tag_ids"].length
    tag_data_two = {}
    tag_data_three = {}
    if json_response["tag_ids"][0]["id"] == @tag_two.id
      tag_data_two = json_response["tag_ids"][0]
      tag_data_three = json_response["tag_ids"][1]
    else
      tag_data_two = json_response["tag_ids"][1]
      tag_data_three = json_response["tag_ids"][0]
    end
    assert_equal @tag_two.id, tag_data_two["id"]
    assert_equal @tag_three.id, tag_data_three["id"]
    assert_equal @tag_two.name, tag_data_two["name"]
    assert_equal @tag_three.name, tag_data_three["name"]
    assert_nil tag_data_two["tags_id"]
    assert_equal @tag_one.id, tag_data_three["tags_id"]
  end

  test "should not show tab to bad user" do
    get user_tab_url(@badUser, @tab)
    assert_response :forbidden
  end

  test "should not show tab to non-existant user" do
    get user_tab_url(@bad_user_id, @tab)
    assert_response :forbidden 
  end

  test "should not show non-existant tab" do
    get user_tab_url(@user, @bad_id)
    assert_response :not_found
  end

  test "should update tab" do
    patch user_tab_url(@user, @tab), params: { tab: {tag_ids: []} }
    assert_response :ok

    assert_equal "Tab_1", json_response["name"]
    assert_equal 0, json_response["tag_ids"].length

    updated_tab = Tab.find(json_response["id"])
    assert_equal "Tab_1", updated_tab.name
    assert_equal @user.id, updated_tab.user_id
    assert_equal 0, TabTag.where(tab_id: json_response["id"]).count
  end

  test "should not update tab for bad user" do
    patch user_tab_url(@badUser, @tab), params: { tab: {tag_ids: []} }
    assert_response :forbidden
  end

  test "should not update tab with bad tag" do
    patch user_tab_url(@user, @tab), params: { tab: {tag_ids: [@bad_tag_id]} }
    assert_response :not_found
  end

  test "should not update tab with bad data" do
    patch user_tab_url(@user, @tab), params: { tab: {tag_ids: [tags("mismatch").id]} }
    assert_response :unprocessable_entity
  end

  test "should not update non-existant tab" do
    patch user_tab_url(@user, @bad_id), params: { tag: {name: "EEEEEEEEEE"} }
    assert_response :not_found
  end

  test "should swap tabs" do
    src_loc = @tab.tab_order
    dst_loc = @tab_2.tab_order
    patch user_tab_url(@user, @tab), params: { swap: {target: @tab_2.id }, is_swap: true}
    assert_response :ok

    assert_equal 2, json_response.length
    #Asserting specific ordering cause swap
    assert_equal @tab.id, json_response[1]["id"]
    assert_equal @tab_2.id, json_response[0]["id"]
    assert_equal @tab.name, json_response[1]["name"]
    assert_equal @tab_2.name, json_response[0]["name"]

    updated_tab_one = Tab.find(@tab.id)
    updated_tab_two = Tab.find(@tab_2.id)
    assert_equal @user, updated_tab_one.user
    assert_equal @user, updated_tab_two.user
    assert_equal src_loc, updated_tab_two.tab_order
    assert_equal dst_loc, updated_tab_one.tab_order
  end

  test "should not swap tab for bad user" do
    tab_3 = tabs(:three)
    #Making sure that bad user due to tab_3 overrides non-existant tab from @bad_id
    patch user_tab_url(@user, @bad_id), params: { swap: {target: tab_3.id }, is_swap: true}
    assert_response :forbidden
  end

  test "should not swap non-existant tab" do
    patch user_tab_url(@user, @tab), params: { swap: {target: @bad_id }, is_swap: true}
    assert_response :not_found
  end

  test "should not swap same tab" do
    patch user_tab_url(@user, @tab), params: { swap: {target: @tab.id }, is_swap: true}
    assert_response :unprocessable_entity
  end
  
  test "should destroy tab" do
    assert_difference('Tab.count', -1) do
      assert_difference('TabTag.count', -2) do
        delete user_tab_url(@user, @tab)
      end
    end
  
    assert_response :no_content
  end

  test "should not destroy non-existant tab" do
    delete user_tab_url(@user, @bad_id)
    
    assert_response :not_found
  end
end
