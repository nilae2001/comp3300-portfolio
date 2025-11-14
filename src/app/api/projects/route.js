// GET /api/projects
export async function GET() {
  const projects = [
  {
    title: "Project One",
    desc: "Short blurb.",
    img: "",
    link: "#",
  },
  {
    title: "Project Two",
    desc: "Short blurb.",
    img: "",
    link: "#",
  },
  {
    title: "Project Three",
    desc: "Short blurb.",
    img: "",
    link: "#",
  },
];

  return Response.json({ projects });
}
