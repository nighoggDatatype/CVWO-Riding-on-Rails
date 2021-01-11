class Item_Tag < ApplicationRecord
  belongs_to :item
  belongs_to :tag
  validates :tag_id, uniqueness: { scope: [:item_id],
    message: "Cannot assign the same tag to an item more than once" } #TODO: Test this and schema

  def item_and_tag_have_same_user
    if item.user != tag.user #TODO: Make sure that direct user comparison works vs user_id
      errors.add(:item, :tag, "Item and Tag have different users")#TODO: Check that this error message works
    end
  end
end
