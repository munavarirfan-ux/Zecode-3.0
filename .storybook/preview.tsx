import type { Preview } from "@storybook/nextjs";
import { Fragment, useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    themeMode: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "system",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
          { value: "system", title: "System" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const mode = context.globals.themeMode as string | undefined;
      useEffect(() => {
        if (!mode || mode === "system") return;
        document.documentElement.setAttribute("data-theme", mode);
        document.documentElement.classList.toggle("dark", mode === "dark");
      }, [mode]);
      return (
        <ThemeProvider>
          <Fragment>
            <Story />
            <Toaster position="top-center" richColors />
          </Fragment>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
