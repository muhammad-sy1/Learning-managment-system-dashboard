import DOMPurify from "isomorphic-dompurify";

export const renderSafeHTML = (
  htmlString: string | null | undefined
): { __html: string } => {
  if (!htmlString) return { __html: "" };
  const cleanHTML = DOMPurify.sanitize(htmlString, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "span",
      "div",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
    ALLOW_DATA_ATTR: false,
  });
  return { __html: cleanHTML };
};
