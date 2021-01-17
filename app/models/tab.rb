class Tab < ApplicationRecord
  belongs_to :user
  validates :name, :tab_order, presence: true
  validates :name, format: {with: /\A\w+\Z/}
  validates :tab_order, uniqueness: { scope: :user_id,
    message: "should be a unique tab order for any particular user" }
  has_many :tabs_tags, class_name: 'TabTag', dependent: :destroy
  has_many :tags, through: :tabs_tags, source: :tag
  before_validation :assign_tab_order, on: :create
  before_validation :assign_tab_name, on: :create
  #TODO: Add clean up function to trigger when there are alot of gaps,
  #      say max_order_num/row_count >= 1.5 for any user after create
  #Also make sure the only negative number allowed is -1 for swapping purposes
  private
    def assign_tab_order
      if tab_order.blank?
        user_list = Item.where(user_id: user_id)
        if user_list.count() > 0
            self.tab_order = user_list.maximum(:tab_order) + 1
        else
            self.tab_order = 0
        end
      end
    end

    def assign_tab_name #TODO: In need of testing
        if name.blank?
          name_candiate = "New_Tab"
          i = 0
          while Item.where(user_id: user_id).where(name: name_candiate).count > 0 do
            i += 1
            name_candiate = "New_Tab_#{i}"
          end
          self.name = name_candiate
        end
      end
end
