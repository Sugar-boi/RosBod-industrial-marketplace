export const getFavorites = (): number[] => {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem("favorites");

  return saved ? JSON.parse(saved) : [];
};

export const saveFavorites = (favorites: number[]) => {
  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );
};

export const isFavorite = (listingId: number) => {
  return getFavorites().includes(listingId);
};

export const toggleFavorite = (listingId: number) => {

  const favorites = getFavorites();

  if (favorites.includes(listingId)) {

    saveFavorites(
      favorites.filter(id => id !== listingId)
    );

    return false;

  }

  saveFavorites([
    ...favorites,
    listingId,
  ]);

  return true;
};