import { useQuery } from "convex/react";
import { useMemo } from "react";
import { MessageSquare, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { api } from "@/convex/_generated/api";

export default function useNavigation() {
  const pathname = usePathname();

  const requestsCount = useQuery(api.requests.count);

  const conversations = useQuery(api.conversations.get);

  const unseenMessagesCount = useMemo(() => {
    return conversations?.reduce((acc, curr) => {
      return acc + curr.unseenCount;
    }, 0);
  }, [conversations]);

  const paths = useMemo(() => {
    return [
      {
        name: "Conversations",
        href: "/conversations",
        icon: <MessageSquare />,
        active: pathname.startsWith("/conversations"),
        count: unseenMessagesCount,
      },
      {
        name: "Friends",
        href: "/friends",
        icon: <Users />,
        active: pathname.startsWith("/friends"),
        count: requestsCount,
      },
    ];
  }, [pathname, requestsCount, unseenMessagesCount]);
  return { paths };
}
