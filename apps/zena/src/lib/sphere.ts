export type Sphere = "family" | "company";

const STORAGE_KEY = "zena:sphere";

export const getStoredSphere = (): Sphere | null => {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "family" || value === "company" ? value : null;
};

export const setStoredSphere = (sphere: Sphere) => {
  localStorage.setItem(STORAGE_KEY, sphere);
};
