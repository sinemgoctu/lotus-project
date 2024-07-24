function convertMarkdownToHtml(content) {
  let formattedContent = content.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  formattedContent = formattedContent.replace(
    /(\n|^)(\d+)\. (.*?)(\n|$)/g,
    (match, p1, p2, p3, p4) => {
      return `${p1}<ol start="${p2}"><li>${p3}</li></ol>${p4}`;
    }
  );

  formattedContent = formattedContent.replace(/<\/ol>\s*<ol start="\d+">/g, "");

  formattedContent = formattedContent.replace(/\n/g, "<br>");

  return formattedContent;
}
