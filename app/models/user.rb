class User < ApplicationRecord
    has_many :item, dependent: :destroy  #TODO: Check if :item needs to be :items
    has_many :tag, dependent: :destroy   #TODO: Ditto as above
    validates :username, presence: true
    validates :username, uniqueness: true
end
