export function buildContextString(project) {
  if (!project) return "";
  const lines = [];
  lines.push(`Project: ${project.name}`);
  if (project.tagline) lines.push(`Description: ${project.tagline}`);
  if (project.stack) {
    for (const [key, vals] of Object.entries(project.stack)) {
      if (vals.length > 0) lines.push(`${key}: ${vals.join(", ")}`);
    }
  }
  lines.push(`Files: ${project.stats?.files || 0} | LOC: ${project.stats?.loc || 0}`);
  if (project.entryPoints?.length) {
    lines.push(`Entry points:`);
    for (const ep of project.entryPoints.slice(0, 5)) {
      lines.push(`  - ${ep.file}: ${ep.purpose}`);
    }
  }
  return lines.join("\n");
}

export function buildFileList(project) {
  if (!project?.fileTree) return [];
  const result = [];
  function walk(node, prefix = "") {
    const p = prefix ? `${prefix}/${node.name}` : node.name;
    if (node.type === "file") result.push(p);
    else for (const c of node.children || []) walk(c, p);
  }
  walk(project.fileTree);
  return result;
}
