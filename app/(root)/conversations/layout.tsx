"use client";

import { useQuery } from "convex/react";
import ItemList from "@/components/shared/item-list/ItemList";
import { api } from "@/convex/_generated/api";
import DMConversationItem from "@/app/(root)/conversations/_components/DMConversationItem";
import GroupConversationItem from "@/app/(root)/conversations/_components/GroupConversationItem";
import { Loader2 } from "lucide-react";
import CreateGroupDialog from "@/app/(root)/conversations/_components/CreateGroupDialog";

export default function ConversationsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const conversations = useQuery(api.conversations.get);

  return (
    <>
      <ItemList title="Conversations" action={<CreateGroupDialog />}>
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No conversations found
            </p>
          ) : (
            conversations.map((conversation) => {
              return conversation.conversation.isGroup ? (
                <GroupConversationItem
                  key={conversation.conversation._id}
                  id={conversation.conversation._id}
                  name={conversation.conversation.name || ""}
                  lastMessageSender={conversation.lastMessage?.sender}
                  lastMessageContent={conversation.lastMessage?.content}
                  unseenCount={conversation.unseenCount}
                />
              ) : (
                <DMConversationItem
                  key={conversation.conversation._id}
                  id={conversation.conversation._id}
                  imageUrl={conversation.otherMember?.imageUrl || ""}
                  lastMessageSender={conversation.lastMessage?.sender}
                  lastMessageContent={conversation.lastMessage?.content}
                  unseenCount={conversation.unseenCount}
                />
              );
            })
          )
        ) : (
          <Loader2 className="h-8 w-8" />
        )}
      </ItemList>
      {children}
    </>
  );
}
