export type BrandColors = {
  primary: string;
  secondary: string;
};

export const defaultColors: BrandColors = {
  primary: "#3b82f6", // tailwind-blue-500
  secondary: "#1e293b", // tailwind-slate-800
};

/**
 * Helper to apply dynamic brand colors to CSS variables
 */
export function applyBrandTheme(colors: BrandColors) {
  if (typeof document === "undefined") return;
  
  const root = document.documentElement;
  root.style.setProperty("--brand-primary", colors.primary);
  root.style.setProperty("--brand-secondary", colors.secondary);
}
