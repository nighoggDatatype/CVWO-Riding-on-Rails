class User < ApplicationRecord
    has_many :items, dependent: :destroy  #TODO: Check if :item needs to be :items
    has_many :tags, dependent: :destroy   #TODO: Ditto as above
    validates :username, presence: true
    validates :username, uniqueness: true
end
