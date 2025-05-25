import { TConversation, TChatsByDate } from "@/services/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday } from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupConversationsByDate(
  conversations: TConversation[]
): TChatsByDate {
  const result: TChatsByDate = {};

  for (const convo of conversations) {
    console.log(
      convo?.messages[convo.messages.length - 1]?.timestamp,
      convo.created_at,
      89765
    );
    if (convo?.messages[convo.messages.length - 1]?.timestamp === undefined)
      continue;

    // const date = new Date(convo.created_at);
    const date = new Date(
      convo?.messages[convo.messages.length - 1]?.timestamp
    );
    let dateLabel: string;

    if (isToday(date)) {
      dateLabel = "Today";
    } else if (isYesterday(date)) {
      dateLabel = "Yesterday";
    } else {
      dateLabel = format(date, "MMMM d, yyyy"); // e.g., March 1, 2025
    }

    const title = convo.messages?.[0]?.content?.slice(0, 40) || "Untitled Chat";

    if (!result[dateLabel]) {
      result[dateLabel] = [];
    }

    result[dateLabel].push({
      id: convo.session_id,
      title,
    });
  }

  return result;
}

export function extractJsonBetweenMarkers(text: string) {
  const pattern = /~!J\s*(\[\s*[\s\S]*?\s*\])\s*~!J/;

  const match = text.match(pattern);
  if (!match || match.length < 2) return null;

  try {
    const jsonText = match[1];
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Failed to parse JSON between ~!J markers:", error);
    return null;
  }
}

type ExtractedParts = {
  jsonBlocks: any[]; // array of parsed JSON blocks
  textBlocks: string[]; // array of plain text between or outside JSON blocks
};

export function extractJsonAndTextParts(input: string): ExtractedParts {
  const regex = /~!J\s*(\[\s*[\s\S]*?\s*\])\s*~!J/g;

  const jsonBlocks: any[] = [];
  const textBlocks: string[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    const [fullMatch, jsonString] = match;
    const matchStart = match.index;
    const matchEnd = regex.lastIndex;

    // Extract and store text between last match and this one
    if (matchStart > lastIndex) {
      const textPart = input.slice(lastIndex, matchStart).trim();
      if (textPart) textBlocks.push(textPart);
    }

    // Parse and store JSON block
    try {
      const parsed = JSON.parse(jsonString);
      jsonBlocks.push(parsed);
    } catch (err) {
      console.error("JSON parse error:", err);
    }

    lastIndex = matchEnd;
  }

  // Capture trailing text after last JSON block
  const remainingText = input.slice(lastIndex).trim();
  if (remainingText) textBlocks.push(remainingText);

  return { jsonBlocks, textBlocks };
}
