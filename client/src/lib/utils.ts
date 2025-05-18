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
    const date = new Date(convo.created_at);
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
