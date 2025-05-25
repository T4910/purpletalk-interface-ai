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
    console.log(convo?.messages[convo.messages.length - 1]?.timestamp, convo.created_at, 89765);
    if (convo?.messages[convo.messages.length - 1]?.timestamp === undefined) continue;

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

export function extractHouseJson(text: string) {
  const housePattern = /house:\s*(\[\s*[\s\S]*?\s*\])\s*house:/i;

  const match = text.match(housePattern);
  if (!match || match.length < 2) return null;

  try {
    const jsonText = match[1];
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Failed to parse house JSON:", error);
    return null;
  }
}
