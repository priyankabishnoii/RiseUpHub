"use client";
import ReactMarkdown from "react-markdown";

export default function MarkdownContent({ content }) {
  if (!content) return null;

  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-xl font-black text-white mt-6 mb-3 pb-2 border-b border-white/10">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-bold text-indigo-300 mt-5 mb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-bold text-white mt-4 mb-2">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-sm font-bold text-gray-200 mt-3 mb-1">{children}</h4>
        ),
        p: ({ children }) => (
          <p className="text-sm text-gray-300 leading-relaxed mb-3">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-white">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-indigo-300">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className="space-y-2 mb-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-2 mb-4">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-2.5 text-sm text-gray-300 leading-relaxed">
            <span className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 block" />
            <span className="flex-1">{children}</span>
          </li>
        ),
        code: ({ inline, children }) =>
          inline ? (
            <code className="px-1.5 py-0.5 rounded-md bg-indigo-600/20 text-indigo-300 text-xs font-mono">{children}</code>
          ) : (
            <pre className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto mb-4">
              <code className="text-xs font-mono text-gray-300">{children}</code>
            </pre>
          ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-indigo-500 pl-4 my-3 italic text-gray-400 text-sm">{children}</blockquote>
        ),
        hr: () => <hr className="border-white/10 my-4" />,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-indigo-600/10 border-b border-white/10">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2.5 text-gray-300 border-b border-white/5 text-sm">{children}</td>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}