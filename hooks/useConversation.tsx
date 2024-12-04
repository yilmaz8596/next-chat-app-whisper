import { Params } from "next/dist/server/request/params";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function useConversation() {
  const params = useParams();

  const conversationId = useMemo(() => {
    return (params as Params)?.conversationId || "";
  }, [params?.conversationId]);

  const isActive = useMemo(() => {
    return !!conversationId;
  }, [conversationId]);
  return { conversationId, isActive };
}
