require 'test_helper'

class ItemTagTest < ActiveSupport::TestCase
  test "Foreign Key Restrictions" do
    flunk "TBC" #TODO: See about doing this for all instances of foriegn keys in schemas
  end
  test "Relationships must be unique" do
    user = users("three")
    relationship = Item_tag.new
    flunk "TBC"
  end
end
