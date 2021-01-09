class Item < ApplicationRecord
  belongs_to :user
  validates :task, :list_order, presence: true
  validates :done, inclusion: [true, false]
  validates :done, exclusion: [nil] 
  validates :list_order, uniqueness: { scope: :user_id,
    message: "should be a unique list order id for any particular user" }
  before_validation :assign_list_order, on: :create
  private
    def assign_list_order
      if list_order == nil
        user_list = Item.where(user_id: user_id)
        if user_list.count() > 0
            self.list_order = user_list.maximum(:list_order) + 1
        else
            self.list_order = 0
        end
      end
    end
end
