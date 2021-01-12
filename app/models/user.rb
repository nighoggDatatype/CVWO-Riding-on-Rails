class User < ApplicationRecord
    has_many :items, dependent: :destroy  #TODO: Check if :item needs to be :items
    has_many :tags, dependent: :destroy   #TODO: Ditto as above, also check if cascade works later
    validates :username, presence: true
    validates :username, uniqueness: true
    validates :name, format: {with: /\A [0-9a-zA-Z]+\Z/} #Expected format: CamelCase #TODO: Test this
    #TODO: Consider whether to put in a minimum length for usernames
end
