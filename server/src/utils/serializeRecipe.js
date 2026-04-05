export const serializeRecipe = (recipe, currentUserId) => {
  const data = recipe.toJSON ? recipe.toJSON() : recipe;
  const currentUser = currentUserId?.toString();

  return {
    ...data,
    isFavorited: Boolean(currentUser && data.author?.favorites?.includes?.(currentUser)),
    isLiked: Boolean(currentUser && data.likes?.some((id) => id.toString() === currentUser)),
    ratingCount: data.ratings?.length || 0,
    commentCount: data.comments?.length || 0
  };
};
