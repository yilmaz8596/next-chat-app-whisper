"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  id: Id<"conversations">;
  imageUrl: string;
  lastMessageSender?: string;
  lastMessageContent?: string;
  unseenCount: number;
};

const DMConversationItem = ({
  id,
  imageUrl,
  lastMessageSender,
  lastMessageContent,
  unseenCount,
}: Props) => {
  const conversation = useQuery(api.conversation.getConversation, {
    conversationId: id,
  });

  return (
    <Link href={`/conversations/${conversation?._id}`} className="w-full">
      <Card className="p-2 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4 truncate">
          <Avatar>
            <AvatarImage src={imageUrl} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            {lastMessageSender && lastMessageContent ? (
              <span className="text-sm text-muted-foreground flex truncate overflow-ellipsis">
                <p className="truncate overflow-ellipsis">
                  {lastMessageContent}
                </p>
              </span>
            ) : (
              <p className="text-sm text-muted-foreground truncate">
                Start the conversation!
              </p>
            )}
          </div>
        </div>

        {unseenCount ? <Badge>{unseenCount}</Badge> : null}
      </Card>
    </Link>
  );
};

export default DMConversationItem;
