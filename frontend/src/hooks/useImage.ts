export const useImage = (checkElement: any) => {
  if (!checkElement?.images[0].url) return [];

  return checkElement.images.map((img: any) => {
    if (img?.url?.includes("http")) return img.url;

    return `${import.meta.env.VITE_API_URL}${img.url}`;
  });
};
