require 'test_helper'

class TagsControllerTest < ActionDispatch::IntegrationTest
  # TODO: Go through this and make it good for pure json retrivial
  
  setup do
    @tag = tags(:one)
  end
  
  test "should get index" do
    get user_tags_url
    assert_response :success
  end
    
  test "should create tag" do
    assert_difference('Tag.count') do
      post user_tags_url, params: { tag: {  } }
    end
  
    assert_redirected_to tag_url(Tag.last)
  end
  
  test "should show tag" do
    get user_tag_url(@tag)
    assert_response :success
  end

  test "should update tag" do
    patch user_tag_url(@tag), params: { tag: {  } }
    assert_redirected_to user_tag_url(@tag)
  end
  
  test "should destroy tag" do
    assert_difference('Tag.count', -1) do
      delete tag_url(@tag)
    end
  
    assert_redirected_to tags_url
  end
end
