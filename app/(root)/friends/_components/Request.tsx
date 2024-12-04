import useMutationState from "@/hooks/useMutationState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { Check, User, X } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export interface Request {
  id: Id<"requests">;
  imageUrl: string;
  username: string;
  email: string;
}
export default function Request({ id, imageUrl, username, email }: Request) {
  const { mutate: denyRequest, pending: denyPending } = useMutationState({
    mutationToRun: api.request.deny,
  });

  const { mutate: acceptRequest, pending: acceptPending } = useMutationState({
    mutationToRun: api.request.accept,
  });
  return (
    <Card className="w-full p-2 flex flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-4 truncate">
        <Avatar>
          <AvatarImage src={imageUrl} alt={username} />
          <AvatarFallback>
            <User className="w-8 h-8" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate">{username}</h4>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          onClick={() => {
            acceptRequest({ id })
              .then(() => {
                console.log("Request accepted");
                toast.success("Request accepted");
              })
              .catch((error) => {
                console.error(error);
                toast.error("An error occurred", error.data);
              });
          }}
          disabled={denyPending || acceptPending}
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={() => {
            denyRequest({ id })
              .then(() => {
                console.log("Request denied");
                toast.success("Request denied");
              })
              .catch((error) => {
                console.error(error);
                toast.error("An error occurred", error.data);
              });
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
