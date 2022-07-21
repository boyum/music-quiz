export default {
  widgets: [
    { name: "structure-menu" },
    {
      name: "project-info",
      options: {
        data: [
          {
            title: "GitHub repo",
            value: "https://github.com/boyum/music-quiz",
            category: "Code",
          },
          { title: "Frontend", value: "https://jinglebell.rocks/", category: "apps" },
        ],
      },
    },
    { name: "project-users", layout: { height: "auto" } },
  ],
};
