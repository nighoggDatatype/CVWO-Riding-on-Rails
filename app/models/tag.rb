class Tag < ApplicationRecord
  belongs_to :user
  belongs_to :parent_tag, :class_name => "Tag" #TODO: make sure this works
  has_many  :child_tags, :class_name => "Tag", dependent: :destroy #For cascade
  validates_associated :parent_tag

  #TODO: Test this one below to see if it works or breaks. Also, see about checking this on the schema level as well
  validates :tag_level, inclusion: {in: [0], message: "Tag level %{value} is not for a base tag"},
      unless: -> { parent_tag.blank? }

  #TODO: Test the two functions below soon
  def parent_tag_is_one_level_lower
    if parent_tag.present? && tag_level - parent_tag.tag_level != 1
      errors.add(:tag_level, "is not one level higher than parent tag")
  
  def parent_tag_from_same_user
    if parent_tag.present? && user_id != parent_tag.user_id
      errors.add
  #TODO: Add constraint on parent_tags being from the same user and that infinite loops don't occur.
  #      The functions, once added properly, should be sufficent to guarantee correctness 
  
  #      Also, while I'm at it, for the Item-Tag model, which we need to add, we need to verify that they come
  #      from the same user. 
  #      Also, despite first impressions, I should not allow Item-Tag trees to reflect the fact that parent tags
  #      technically belong to whatever their child tags are on, the Item-Tag reflects what the user added, not
  #      what tag search an item should show up on. The latter behavour should be client side.
end

