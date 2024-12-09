"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import Header from "./_components/Header";
import Body from "./_components/body/Body";
import ChatInput from "./_components/input/ChatInput";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import RemoveFriendDialog from "./_components/dialogs/RemoveFriendDialog";
import DeleteGroupDialog from "./_components/dialogs/DeleteGroupDialog";
import LeaveGroupDialog from "./_components/dialogs/LeaveGroupDialog";

const ConversationPage = () => {
  const { conversationId } = useParams();

  const conversation = useQuery(api.conversation.getConversation, {
    conversationId: conversationId as Id<"conversations">,
  });

  const members = useQuery(api.conversation.getMembersByConversationId, {
    conversationId: conversationId as Id<"conversations">,
  });

  const clerkId = useAuth().userId as string;
  const user = useQuery(api.user.getUser, { clerkId });
  const sender = members?.find((member) => member._id !== user?._id);

  console.log(sender);

  console.log(conversationId);
  console.log(conversation);
  console.log(members);
  console.log(user);

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);

  if (!conversationId) {
    return <div>Loading...</div>; // Gracefully handle missing ID
  }

  if (!conversation) {
    return <div>Conversation not found</div>;
  }

  return (
    <ConversationContainer>
      <RemoveFriendDialog
        conversationId={conversationId as Id<"conversations">}
        open={removeFriendDialogOpen}
        setOpen={setRemoveFriendDialogOpen}
      />
      <DeleteGroupDialog
        conversationId={conversationId as Id<"conversations">}
        open={deleteGroupDialogOpen}
        setOpen={setDeleteGroupDialogOpen}
      />
      <LeaveGroupDialog
        conversationId={conversationId as Id<"conversations">}
        open={leaveGroupDialogOpen}
        setOpen={setLeaveGroupDialogOpen}
      />
      <Header
        name={
          (conversation.isGroup
            ? conversation.name
            : sender?.username !== "null null"
              ? sender?.username
              : "Anonymous") || "Anonymous"
        }
        imageUrl={
          conversation.isGroup
            ? undefined
            : members?.filter((member) => member._id !== user?._id)[0]
                ?.imageUrl || undefined
        }
        options={
          conversation.isGroup
            ? [
                {
                  label: "Leave group",
                  destructive: false,
                  onClick: () => setLeaveGroupDialogOpen(true),
                },
                {
                  label: "Delete group",
                  destructive: true,
                  onClick: () => setDeleteGroupDialogOpen(true),
                },
              ]
            : [
                {
                  label: "Remove friend",
                  destructive: true,
                  onClick: () => setRemoveFriendDialogOpen(true),
                },
              ]
        }
        setCallType={setCallType}
      />
      <Body
        members={
          members?.map((member) => ({
            id: member._id,
            username: member.username ?? "Anonymous",
            imageUrl: member.imageUrl,
          })) || []
        }
        callType={callType}
        setCallType={setCallType}
      />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationPage;
