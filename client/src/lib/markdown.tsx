// Utility function to parse simple markdown elements
export interface ParsedElement {
  type: 'text' | 'link' | 'bold' | 'header';
  content: string;
  url?: string;
  level?: number; // For headers (1-6)
}

export function parseMarkdown(text: string): ParsedElement[] {
  const elements: ParsedElement[] = [];
  
  // Handle the case where the entire text is empty or whitespace
  if (!text || !text.trim()) {
    return [{
      type: 'text',
      content: text || ''
    }];
  }

  let remainingText = text;
  
  while (remainingText.length > 0) {
    let foundMatch = false;

    // Check for headers (**text**)
    const headerMatch = remainingText.match(/^\*\*(.*?)\*\*/);
    if (headerMatch) {
      elements.push({
        type: 'header',
        content: headerMatch[1],
        level: 2
      });
      remainingText = remainingText.slice(headerMatch[0].length);
      foundMatch = true;
      continue;
    }

    // Check for links [text](url)
    const linkMatch = remainingText.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      elements.push({
        type: 'link',
        content: linkMatch[1],
        url: linkMatch[2]
      });
      remainingText = remainingText.slice(linkMatch[0].length);
      foundMatch = true;
      continue;
    }

    // If no markdown found, find the next potential markdown syntax
    const nextMarkdownIndex = remainingText.search(/[\[\*]/);
    
    if (nextMarkdownIndex === -1) {
      // No more markdown, add the rest as text
      if (remainingText.trim()) {
        elements.push({
          type: 'text',
          content: remainingText
        });
      }
      break;
    } else if (nextMarkdownIndex > 0) {
      // Add text before the next markdown syntax
      const textPart = remainingText.slice(0, nextMarkdownIndex);
      if (textPart.trim()) {
        elements.push({
          type: 'text',
          content: textPart
        });
      }
      remainingText = remainingText.slice(nextMarkdownIndex);
    } else {
      // We're at a potential markdown character but it didn't match
      // Add the character as text and continue
      elements.push({
        type: 'text',
        content: remainingText[0]
      });
      remainingText = remainingText.slice(1);
    }
  }

  return elements;
}

export function renderParsedElements(elements: ParsedElement[]): React.ReactNode[] {
  return elements.map((element, index) => {
    switch (element.type) {
      case 'header':
        return (
          <strong 
            key={index} 
            className="text-lg font-bold text-purple-300 block my-2"
          >
            {element.content}
          </strong>
        );
      
      case 'link':
        return (
          <a
            key={index}
            href={element.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors inline"
          >
            {element.content}
          </a>
        );
      
      case 'text':
      default:
        return <span key={index}>{element.content}</span>;
    }
  });
}
