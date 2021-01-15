class User < ApplicationRecord
    has_many :items, dependent: :destroy
    has_many :tags, dependent: :destroy
    validates :username, presence: true
    validates :username, uniqueness: true
    validates :username, format: {with: /\A\w+\Z/} #Expected format: CamelCase
    validates :username, length: { minimum: 10 } #Note: Only care about minimum to prevent wardialing
end
