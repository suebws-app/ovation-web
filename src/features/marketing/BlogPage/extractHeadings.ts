export const extractHeadings = (markdown: string): string[] => {
  const headings: string[] = [];
  let insideCodeFence = false;

  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      insideCodeFence = !insideCodeFence;
      continue;
    }
    if (!insideCodeFence && line.startsWith("## ")) {
      headings.push(line.slice(3).trim());
    }
  }

  return headings;
};
