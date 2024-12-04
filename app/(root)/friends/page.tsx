"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ItemList from "@/components/shared/item-list/ItemList";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import AddFriendDialog from "./_components/AddFriendDialog";
import { Loader2 } from "lucide-react";
import Request from "./_components/Request";

export default function FriendsPage() {
  const requests = useQuery(api.requests.get);
  console.log(requests);

  return (
    <>
      <ItemList title="Friends" action={<AddFriendDialog />}>
        {requests ? (
          requests.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No friends requests found
            </p>
          ) : (
            requests.map((request) => (
              <Request
                key={request.request._id}
                id={request.request._id}
                imageUrl={request.sender.imageUrl}
                username={request.sender.username}
                email={request.sender.email}
              />
            ))
          )
        ) : (
          <Loader2 className="w-8 h-8 text-primary animate" />
        )}
      </ItemList>
      <ConversationFallback />
    </>
  );
}
