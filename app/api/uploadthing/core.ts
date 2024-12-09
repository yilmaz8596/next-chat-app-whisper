import { createUploadthing, type FileRouter } from "uploadthing/next";
import { useAuth } from "@clerk/nextjs";

const f = createUploadthing();

const { userId } = useAuth();
const handleAuth = () => {
  if (!userId) throw new Error("Unauthorized");

  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  image: f({ image: { maxFileCount: 6 }, video: { maxFileCount: 3 } })
    // Set permissions and file types for this FileRoute
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  file: f(["image", "video", "audio", "pdf"])
    // Set permissions and file types for this FileRoute
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
