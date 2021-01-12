class Item < ApplicationRecord
  belongs_to :user
  validates :task, :list_order, presence: true
  validates :done, inclusion: [true, false]
  validates :done, exclusion: [nil] 
  validates :list_order, uniqueness: { scope: :user_id,
    message: "should be a unique list order id for any particular user" }
  has_many :item_tag, dependent: :destroy #TODO: Test this
  has_and_belongs_to_many :tags #TODO: Test this
  before_validation :assign_list_order, on: :create
  #TODO: Add clean up function to trigger when there are alot of gaps,
  #      say max_order_num/row_count >= 1.5 for any user after create
  #      Also, see about making negative numbers invalid 
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
