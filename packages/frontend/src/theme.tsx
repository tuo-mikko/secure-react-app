import { createSystem, defaultBaseConfig, defineConfig} from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
      spacing: {
        "0": { value: "0rem" },
        "1": { value: "0.25rem" },
        "2": { value: "0.5rem" },
        "3": { value: "0.75rem" },
        "4": { value: "1rem" },
        "5": { value: "1.25rem" },
        "6": { value: "1.5rem" },
        "8": { value: "2rem" },
        "10": { value: "2.5rem" },
        "12": { value: "3rem" },
        "16": { value: "4rem" },
      },
      colors: {
        brand: {
          brown: { value: "#35544f" },
        },
        gray: {
          100: { value: "#f7fafc" },
          200: { value: "#edf2f7" },
          900: { value: "#171923" },
        },
      },
      fontSizes: {
        sm: { value: "0.875rem" },
        md: { value: "1rem" },
        lg: { value: "1.125rem" },
        xl: { value: "1.25rem" },
      },
      radii: {
        sm: { value: "0.125rem" },
        md: { value: "0.375rem" },
        lg: { value: "0.5rem" },
        xl: { value: "0.75rem" },
      },
    },
  },
});

export const system = createSystem(defaultBaseConfig, customConfig);
export const theme = system._config.theme;