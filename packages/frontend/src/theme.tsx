import { createSystem, defaultBaseConfig, defineConfig} from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
      colors: {
        brand: {
          brown: { value: "#35544f"}
        },
      },
    },
  },
})

export const system = createSystem(defaultBaseConfig, customConfig);