class Tag < ApplicationRecord
  belongs_to :user
  validates :name, :tag_level, presence: true
  belongs_to :parent_tag, :optional => true, :class_name => "Tag" #TODO: Double check everything to see what needs :optional
  has_many  :child_tags, :class_name => "Tag", dependent: :destroy #For cascade, TODO: make sure this works
  validates_associated :parent_tag, unless: -> {parent_tag.blank?}
  validates :name, uniqueness: { scope: [:tags_id, :user_id],
    message: "Cannot have collision in the same namespace" }

  #TODO: Test this one below to see if it works or breaks. Also, see about checking this on the schema level as well
  validates :tag_level, inclusion: {in: [0], message: "Tag level %{value} is not for a base tag"},
      unless: -> { parent_tag.blank? }

  #TODO: Test the two functions below soon
  def parent_tag_is_one_level_lower
    if parent_tag.present? && tag_level - parent_tag.tag_level != 1
      errors.add(:tag_level, " is not one level higher than parent tag")
    end
  end
  
  def parent_tag_from_same_user
    if parent_tag.present? && user_id != parent_tag.user_id
      errors.add(:user_id, " is not the same as the parent tag")
    end
  end
  #TODO: Add constraint on parent_tags being from the same user and that infinite loops don't occur.
  #      The functions, once added properly, should be sufficent to guarantee correctness 
  #TODO: Also add constraint on tag_level >= 0, both here and in schema

  before_validation :assign_tag_level, on: :create 
  private
  def assign_tag_level
    if tag_level == nil
      if parent_tag == nil
          self.tag_level = 0
      else
          self.tag_level = 1 + parent_tag.tag_level
      end
    end
  end
end

