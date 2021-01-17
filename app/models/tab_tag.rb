class TabTag < ApplicationRecord
  self.table_name = "tabs_tags"
  belongs_to :tab
  belongs_to :tag
  validates :tag_id, uniqueness: { scope: [:tab_id],
    message: "Cannot assign the same tag to an tab more than once" }
  validate :tab_and_tag_have_same_user
  def tab_and_tag_have_same_user
    if tab.user != tag.user
      errors.add(:tag, "Tag does not belong to user of Item")
    end
  end
end
