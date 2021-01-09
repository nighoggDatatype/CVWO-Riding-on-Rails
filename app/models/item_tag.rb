class Item_Tag < ApplicationRecord
  belongs_to :item
  belongs_to :tag

  def item_and_tag_have_same_user
    if item.user_id != tag.user_id
        errors.add()#TODO: Add correct error
end
