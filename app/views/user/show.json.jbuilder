json.extract! @user, :id, :username
json.tags do
    json.array! @tagsWithIds, partial: "tags/tag", as: :tag
end
json.items do
    json.array! @itemsWithIds, partial: "items/item", as: :item
end
json.tabs do
    json.array! @tabsWithIds, partial: "tabs/tab", as: :tab
end