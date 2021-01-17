require 'test_helper'

class TabsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @tab = tabs(:one)
  end
  #TODO: Set up test for failure

  test "should get index" do
    flunk "Incomplete"
    get tabs_url
    assert_response :success
  end

  test "should create tab" do
    flunk "Incomplete"
    assert_difference('Tab.count') do
      post tabs_url, params: { tab: {  } }
    end

    assert_redirected_to tab_url(Tab.last)
  end

  test "should show tab" do
    flunk "Incomplete"
    get tab_url(@tab)
    assert_response :success
  end

  test "should update tab" do
    flunk "Incomplete"
    patch tab_url(@tab), params: { tab: {  } }
    assert_redirected_to tab_url(@tab)
  end

  test "should destroy tab" do
    flunk "Incomplete"
    assert_difference('Tab.count', -1) do
      delete tab_url(@tab)
    end

    assert_redirected_to tabs_url
  end
end
