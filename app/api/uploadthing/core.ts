import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthorized");
  return { userId: user.id };
};

export const ourFileRouter = {
  image: f({ 
    image: { maxFileCount: 6 }, 
    video: { maxFileCount: 3 } 
  })
    .middleware(async () => {
      return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete", metadata, file);
    }),

  file: f(["image", "video", "audio", "pdf"])
    .middleware(async () => {
      return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete", metadata, file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;