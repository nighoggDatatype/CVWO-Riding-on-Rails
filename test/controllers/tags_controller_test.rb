require 'test_helper'

class TagsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:three)
    @tag = tags(:one)
    @badUser = users(:one)

    @bad_id = 1234
    assert_nil Tag.find_by id: @bad_id
    @bad_user_id = 1234
    assert_nil User.find_by id: @bad_user_id
  end
  
  test "should get index" do
    get user_tags_url(@user)
    assert_response :success
    assert_equal 4, json_response.length
    assert_equal "Cringe", json_response[2]["name"]
  end
    
  test "should create tag" do
    assert_difference('Tag.count') do
      post user_tags_url(@user), params: { tag: {name: "Tutorial", tags_id: @tag.id}}
    end
  
    assert_response :created

    assert_equal @tag.id, json_response["tags_id"]
    assert_equal "Tutorial", json_response["name"]

    updated_tag = Tag.find(json_response["id"])
    assert_equal @user, updated_tag.user
    assert_equal json_response["name"], updated_tag.name
  end

  test "should not create tag for non-existant user" do
    post user_tags_url(@bad_user_id), params: { tag: {name: "Tutorial"} }
    assert_response :forbidden
  end

  test "should not create bad tag" do
    post user_tags_url(@user), params: { tag: {name: "Dab Time"} }
    assert_response :unprocessable_entity
  end
  
  test "should show tag" do
    get user_tag_url(@user, @tag)
    assert_response :success
    assert_nil json_response["tags_id"]
    assert_equal "Dab Time", json_response["name"]

    updated_tag = Tag.find(json_response["id"])
    assert_equal "Dab Time", updated_tag.name
    assert_equal @user.id, updated_tag.user_id
  end

  test "should not show tag to bad user" do
    get user_tag_url(@badUser, @tag)
    assert_response :forbidden
  end

  test "should not show tag to non-existant user" do
    get user_tag_url(@bad_user_id, @tag)
    assert_response :forbidden 
  end

  test "should not show non-existant tag" do
    get user_tag_url(@user, @bad_id)
    assert_response :not_found
  end

  test "should update tag" do
    patch user_tag_url(@user, @tag), params: { tag: {name: "Tutorial"} }
    assert_response :ok
    assert_nil json_response["tags_id"]
    assert_equal "Tutorial", json_response["name"]

    updated_tag = Tag.find(json_response["id"])
    assert_equal "Tutorial", updated_tag.name
    assert_equal @user.id, updated_tag.user_id
  end

  test "should not update tag for bad user" do
    patch user_tag_url(@badUser, @tag), params: { tag: {name: "Tutorial"} }
    assert_response :forbidden
  end

  test "should not update tag with bad data" do
    patch user_tag_url(@user, @tag), params: { tag: {name: "Latin"} }
    assert_response :unprocessable_entity
  end

  test "should not update non-existant tag" do
    patch user_tag_url(@user, @bad_id), params: { tag: {name: "EEEEEEEEEE"} }
    assert_response :not_found
  end
  
  test "should destroy tag" do
    assert_difference('Tag.count', -2) do
      delete user_tag_url(@user, @tag)
    end
  
    assert_response :no_content
  end

  test "should not destroy non-existant tag" do
    delete user_tag_url(@user, @bad_id)
    
    assert_response :not_found
  end
end
