require 'test_helper'

class ItemTagTest < ActiveSupport::TestCase
  test "Foreign Key Restrictions in Schema" do
    flunk "TBC" #TODO: See about doing this for all instances of foriegn keys in schemas
  end
  test "Relationships must be unique" do
    user = users("three")
    item = items("one")
    tag = tags("filler")
    item.tags << tag
    flunk "TBC"
  end
end
