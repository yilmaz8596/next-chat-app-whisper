"use client";

import useConversation from "@/hooks/useConversation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = React.PropsWithChildren<{
  title: string;
  action?: React.ReactNode;
}>;

export default function ItemList({ title, action: Action, children }: Props) {
  const { isActive } = useConversation();

  return (
    <Card
      className={cn(
        "hidden h-full w-full lg:flex-none lg:w-80 p-2",
        isActive ? "lg:block" : "block"
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {Action ? Action : null}
      </div>
      <div className="w-full flex flex-col items-center justify-start gap-2">
        {children}
      </div>
    </Card>
  );
}
