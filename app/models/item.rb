class Item < ApplicationRecord
  belongs_to :user
  validates :task, :list_order, presence: true
  validates :task, format: {without: /\n/}
  validates :done, inclusion: [true, false]
  validates :done, exclusion: [nil] 
  validates :list_order, uniqueness: { scope: :user_id,
    message: "should be a unique list order id for any particular user" }
  has_many :items_tags, :class_name => 'ItemTag', dependent: :destroy
  has_many :tags, through: :items_tags, :source => :tag
  before_validation :assign_list_order, on: :create
  validates :list_order, numericality: { greater_than_or_equal_to: 0 } #TODO: Test this
  #TODO: Add clean up function to trigger when there are alot of gaps,
  #      say max_order_num/row_count >= 1.5 for any user after create
  private
    def assign_list_order
      if list_order.blank?
        user_list = Item.where(user_id: user_id)
        if user_list.count() > 0
            self.list_order = user_list.maximum(:list_order) + 1
        else
            self.list_order = 0
        end
      end
    end
end
