interface Document {
  title: string;
  body: string;
  author: string;
}

class DocumentExporter {
  export(doc: Document, format: "pdf" | "html" | "markdown"): string {
    switch (format) {
      case "pdf": {
        const header = `%PDF-1.4\n/Title (${doc.title})`;
        const meta = `/Author (${doc.author})`;
        const content = `stream\n${doc.body}\nendstream`;
        const result = [header, meta, content, "%%EOF"].join("\n");
        console.log(`[PDF] Created ${result.length}-byte document`);
        return result;
      }
      case "html": {
        const head = `<head><title>${doc.title}</title><meta name="author" content="${doc.author}"></head>`;
        const body = `<body><h1>${doc.title}</h1><p>${doc.body}</p></body>`;
        const result = `<!DOCTYPE html><html>${head}${body}</html>`;
        console.log(`[HTML] Created ${result.length}-char document`);
        return result;
      }
      case "markdown": {
        const frontMatter = `---\ntitle: ${doc.title}\nauthor: ${doc.author}\n---`;
        const content = `# ${doc.title}\n\n${doc.body}`;
        const result = `${frontMatter}\n\n${content}`;
        console.log(`[Markdown] Created ${result.length}-char document`);
        return result;
      }
    }
  }
}

// --- run ---
const exporter = new DocumentExporter();
const doc = { title: "Quarterly Report", body: "Revenue grew 15% this quarter.", author: "Alice" };
exporter.export(doc, "pdf");
exporter.export(doc, "html");
exporter.export(doc, "markdown");
