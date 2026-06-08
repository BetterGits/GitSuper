import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Readme({ content }: { content: string }) {
  return (
    <div className="gh-box mt-4">
      <div className="gh-box-header">README</div>
      <div className="p-6 markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
