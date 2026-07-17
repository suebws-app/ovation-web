import { themeInitScript } from "@/lib/utils/themeInitScript";

export const ThemeInitScript = () => (
  <script
    id="theme-init"
    dangerouslySetInnerHTML={{ __html: themeInitScript }}
  />
);
