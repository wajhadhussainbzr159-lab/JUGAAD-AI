import React from 'react';
import { CodeBlock } from './CodeBlock';

interface MarkdownViewProps {
  content: string;
  onExplainCode?: (code: string) => void;
  onOptimizeCode?: (code: string) => void;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({
  content,
  onExplainCode,
  onOptimizeCode
}) => {
  // Simple, resilient parser for markdown code blocks, tables, headings, and formatting
  const renderFormattedText = () => {
    // Split by code blocks ```lang ... ```
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    let keyIdx = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const matchIndex = match.index;
      // Text before code block
      if (matchIndex > lastIndex) {
        const textSegment = content.substring(lastIndex, matchIndex);
        elements.push(
          <div key={`text-${keyIdx++}`} className="space-y-3 leading-relaxed text-slate-200">
            {renderTextBlocks(textSegment)}
          </div>
        );
      }

      const lang = match[1] || 'text';
      const code = match[2];
      elements.push(
        <CodeBlock
          key={`code-${keyIdx++}`}
          code={code.trim()}
          language={lang}
          onExplain={onExplainCode}
          onOptimize={onOptimizeCode}
        />
      );

      lastIndex = matchIndex + match[0].length;
    }

    // Remaining text after last code block
    if (lastIndex < content.length) {
      const remainingText = content.substring(lastIndex);
      elements.push(
        <div key={`text-${keyIdx++}`} className="space-y-3 leading-relaxed text-slate-200">
          {renderTextBlocks(remainingText)}
        </div>
      );
    }

    return elements;
  };

  const renderTextBlocks = (text: string) => {
    const lines = text.split('\n');
    const nodes: React.ReactNode[] = [];
    let tableBuffer: string[] = [];

    const flushTable = (index: number) => {
      if (tableBuffer.length > 0) {
        nodes.push(renderTable(tableBuffer, `tbl-${index}`));
        tableBuffer = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Check if line is part of a markdown table
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        tableBuffer.push(trimmed);
        return;
      } else {
        flushTable(index);
      }

      if (!trimmed) {
        // empty line
        return;
      }

      // Headers
      if (trimmed.startsWith('### ')) {
        nodes.push(
          <h3 key={index} className="text-base sm:text-lg font-bold text-amber-300 mt-4 mb-2">
            {formatInline(trimmed.substring(4))}
          </h3>
        );
      } else if (trimmed.startsWith('## ')) {
        nodes.push(
          <h2 key={index} className="text-lg sm:text-xl font-bold text-slate-100 mt-5 mb-2.5 pb-1 border-b border-slate-800">
            {formatInline(trimmed.substring(3))}
          </h2>
        );
      } else if (trimmed.startsWith('# ')) {
        nodes.push(
          <h1 key={index} className="text-xl sm:text-2xl font-black text-amber-400 mt-6 mb-3">
            {formatInline(trimmed.substring(2))}
          </h1>
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        nodes.push(
          <li key={index} className="ml-4 list-disc list-outside text-slate-300 my-1">
            {formatInline(trimmed.substring(2))}
          </li>
        );
      } else if (/^\d+\.\s/.test(trimmed)) {
        const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          nodes.push(
            <li key={index} className="ml-4 list-decimal list-outside text-slate-300 my-1">
              {formatInline(numMatch[2])}
            </li>
          );
        }
      } else if (trimmed.startsWith('> ')) {
        nodes.push(
          <blockquote key={index} className="border-l-4 border-amber-500/80 bg-amber-500/10 px-3.5 py-2 my-2 rounded-r-lg text-slate-200 text-sm italic">
            {formatInline(trimmed.substring(2))}
          </blockquote>
        );
      } else {
        nodes.push(
          <p key={index} className="my-1.5 leading-relaxed text-slate-300">
            {formatInline(trimmed)}
          </p>
        );
      }
    });

    flushTable(lines.length);
    return nodes;
  };

  const renderTable = (rows: string[], key: string) => {
    if (rows.length < 2) return null;
    const parseRow = (r: string) => r.split('|').slice(1, -1).map(c => c.trim());

    const headers = parseRow(rows[0]);
    // Skip separator row (e.g. |---|---|)
    const bodyRows = rows.slice(2).map(parseRow);

    return (
      <div key={key} className="overflow-x-auto my-3 rounded-lg border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs md:text-sm">
          <thead className="bg-slate-800/80 text-amber-300 font-semibold border-b border-slate-700">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="p-2.5 px-3">{formatInline(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {bodyRows.map((cols, ri) => (
              <tr key={ri} className="hover:bg-slate-800/30 transition">
                {cols.map((col, ci) => (
                  <td key={ci} className="p-2.5 px-3 text-slate-300">{formatInline(col)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const formatInline = (text: string): React.ReactNode => {
    // Handle inline code `code`
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} className="bg-slate-800 text-amber-300 font-mono text-xs px-1.5 py-0.5 rounded border border-slate-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-slate-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={idx} className="italic text-slate-300">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return <div className="markdown-content">{renderFormattedText()}</div>;
};
