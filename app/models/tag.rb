class Tag < ApplicationRecord
  belongs_to :user
  has_many :items_tags, :class_name => 'ItemTag', dependent: :destroy
  has_many :items, through: :items_tags, :source => :item
  validates :name, :tag_level, presence: true
  belongs_to :parent_tag, :optional => true,
    :class_name => "Tag", foreign_key: "tags_id"
  has_many  :child_tags, :class_name => "Tag",
    foreign_key: "tags_id", dependent: :destroy #For cascade
  validates_associated :parent_tag, unless: -> {parent_tag.blank?}
  validates :name, uniqueness: { scope: [:tags_id, :user_id],
    message: "Cannot have collision in the same namespace" }
  validates :name, format: {with: /\A[\w \.\-~?!@#$%^&*()\/\\{}"'<>,\.`]+\Z/}
  validates :name, format: {without: /\A\s+\Z/}
  
  has_many :item_tag, dependent: :destroy 

  validates :tag_level, numericality: {equal_to: 0},
      if: -> { parent_tag.blank? }
  validates :tag_level, numericality: {greater_than_or_equal_to: 0} 
  validate :parent_tag_is_one_level_lower, :parent_tag_from_same_user
  def parent_tag_is_one_level_lower
    if parent_tag.present? && tag_level - parent_tag.tag_level != 1
      errors.add(:tag_level, "Parent tag must be exactly one level lower")
    end
  end
  
  def parent_tag_from_same_user
    if parent_tag.present? && user_id != parent_tag.user_id
      errors.add(:user_id, "parent tag does not have matching user")
    end
  end

  before_validation :assign_tag_level, on: :create 
  private
  def assign_tag_level
    if tag_level.blank?
      if parent_tag.blank?
          self.tag_level = 0
      else
          self.tag_level = 1 + parent_tag.tag_level
      end
    end
  end
end

