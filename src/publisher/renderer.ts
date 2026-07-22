export function markdownToHtml(markdown: string): string {
  const lines = markdown.split('\n');
  const output: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (inList && !/^[-*]\s/.test(line)) {
      output.push('</ul>');
      inList = false;
    }

    if (/^#{1,6}\s+(.+)$/.test(line)) {
      const match = line.match(/^#{1,6}\s+(.+)$/);
      if (match) {
        const level = line.match(/^(#{1,6})/)?.[1].length || 1;
        output.push(`<h${Math.min(level, 6)}>${inlineFormat(match[1])}</h${Math.min(level, 6)}>`);
        continue;
      }
    }

    if (/^[-*]\s+(.+)$/.test(line)) {
      if (!inList) {
        output.push('<ul>');
        inList = true;
      }
      const match = line.match(/^[-*]\s+(.+)$/);
      if (match) {
        output.push(`<li>${inlineFormat(match[1])}</li>`);
      }
      continue;
    }

    if (/^---$/.test(line)) {
      output.push('<hr>');
      continue;
    }

    if (line.trim() === '') {
      if (output.length > 0 && output[output.length - 1] !== '<br>') {
        if (!inList) {
          output.push('<br>');
        }
      }
      continue;
    }

    if (/^\[(.*?)\]\((.*?)\)$/.test(line.trim())) {
      const match = line.trim().match(/^\[(.*?)\]\((.*?)\)$/);
      if (match) {
        output.push(`<p><a href="${escapeHtml(match[2])}">${escapeHtml(match[1])}</a></p>`);
        continue;
      }
    }

    output.push(`<p>${inlineFormat(line)}</p>`);
  }

  if (inList) {
    output.push('</ul>');
  }

  return output.join('\n');
}

function inlineFormat(text: string): string {
  let result = escapeHtml(text);

  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  result = result.replace(/`(.+?)`/g, '<code>$1</code>');
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  return result;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
