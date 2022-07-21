import { createConfig, createPlugin } from "sanity";
import { deskTool } from "sanity/desk";
import { schemaTypes } from "./schemas";

const sharedConfig = createPlugin({
  name: "shareConfig",
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
});

export default createConfig([
  {
    name: "default",
    title: "Music quiz",
    projectId: "0q6ju337",
    dataset: "production",
    plugins: [sharedConfig()],
    basePath: "/",
  },
  {
    name: "dev",
    title: "Music quiz dev",
    projectId: "0q6ju337",
    dataset: "test",
    basePath: "/",
  },
]);
