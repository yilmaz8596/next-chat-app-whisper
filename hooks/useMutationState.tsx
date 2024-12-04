import { useMutation } from "convex/react";
import { useState } from "react";

export default function useMutationState({
  mutationToRun,
}: {
  mutationToRun: any;
}) {
  const [pending, setPending] = useState(false);

  const mutationFn = useMutation(mutationToRun);

  const mutate = (payload: any) => {
    setPending(true);

    return mutationFn(payload)
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {
        throw error;
      })
      .finally(() => {
        setPending(false);
      });
  };
  return { mutate, pending };
}
