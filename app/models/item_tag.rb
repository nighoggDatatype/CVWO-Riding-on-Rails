class ItemTag < ApplicationRecord
  self.table_name = "items_tags"
  belongs_to :item
  belongs_to :tag
  validates :tag_id, uniqueness: { scope: [:item_id],
    message: "Cannot assign the same tag to an item more than once" }
  validate :item_and_tag_have_same_user
  def item_and_tag_have_same_user
    if item.user != tag.user
      errors.add(:tag, "Tag does not belong to user of Item")
    end
  end
end
