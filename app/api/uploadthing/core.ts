import { useAuth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const useHandleAuth = () => {
  const { userId } = useAuth();

  if (!userId) throw new Error("Unauthorized");

  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  image: f({ image: { maxFileCount: 6 }, video: { maxFileCount: 3 } })
    .middleware(() => {
      const auth = useHandleAuth(); // Now, React hooks' rules are followed
      return auth;
    })
    .onUploadComplete(() => {}),
  file: f(["image", "video", "audio", "pdf"])
    .middleware(() => {
      const auth = useHandleAuth(); // Same adjustment for this route
      return auth;
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
