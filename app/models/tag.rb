class Tag < ApplicationRecord
  belongs_to :user
  belongs_to :parent_tag, :class_name => "Tag" #TODO: make sure this works
  #TODO: Add constraint on parent_tags being from the same user and that infinite loops don't occur.
  #      I think for the latter, checking whether we hit null before we hit the original tag should work
  #      Unless we only verify after every tag edit, otherwise we can wind up in infinite loops, in which case
  #      We can have helper data like level information
  #      Then we only need to check that level is always decreasing from child to parent

  #      Also, while I'm at it, for the Item-Tag model, which we need to add, we need to verify that they come
  #      from the same user. 
  #      Also, despite first impressions, I should not allow Item-Tag trees to reflect the fact that parent tags
  #      technically belong to whatever their child tags are on, the Item-Tag reflects what the user added, not
  #      what tag search an item should show up on. The latter behavour should be client side.
end
