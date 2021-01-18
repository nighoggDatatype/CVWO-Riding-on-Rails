json.ignore_nil! false
json.extract! item, :id, :done, :task
json.tags do
  json.array! item.tags, partial: "tags/tag", as: :tag
end