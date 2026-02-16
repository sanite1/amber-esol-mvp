// Recursively remove empty, null, undefined, and "" values
export const removeEmptyFields = (obj: any): any => {
  if (obj === null || obj === undefined) return undefined;

  if (Array.isArray(obj)) {
    return obj.map(removeEmptyFields).filter((x) => x !== undefined);
  }

  if (typeof obj === "object") {
    const cleaned = Object.entries(obj)
      .map(([key, value]) => [key, removeEmptyFields(value)])
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    return Object.keys(cleaned).length ? cleaned : undefined;
  }

  if (obj === "") return undefined; // remove empty strings

  return obj;
};

export const ConvertPriceRangeToLocale = (priceRange: string | undefined) => {
  if (priceRange && priceRange.includes("-")) {
    const [min, max] = priceRange
      .split("-")
      .map((v) => Number(v.trim()))
      .filter((v) => !isNaN(v));

    if (min && max) {
      return `₦${min.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} - ₦${max.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  }

  // ✅ Handle SINGLE value string: "15000"
  const single = Number(priceRange && priceRange.trim());
  if (!isNaN(single)) {
    return `₦${single.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
};

export const isLightColor = (hex: string) => {
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(hex)) return true;

  let c = hex.substring(1);

  if (c.length === 3) {
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  }

  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  // ✅ Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 155; // true = light, false = dark
};

export const convertUrlToFile = async (
  url: string,
  filename?: string,
): Promise<File> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${url}`);
  }

  const blob = await response.blob();

  const finalName =
    filename || url.split("/").pop() || `image-${Date.now()}.jpg`;

  return new File([blob], finalName, {
    type: blob.type || "image/jpeg",
  });
};

export const toDateInputValue = (date?: string | Date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};
