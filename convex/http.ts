import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
const http = httpRouter();

const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET! || "");

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event;
  } catch (error) {
    console.error("Error validating webhook payload", error);
    return;
  }
};

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);
  if (!event) {
    return new Response("Invalid webhook payload", {
      status: 400,
    });
  }
  switch (event.type) {
    case "user.created":
      console.log("Processing user.created event:", event.data);
      await ctx.runMutation(internal.user.create, {
        username: `${event.data.first_name} ${event.data.last_name}`,
        imageUrl: event.data.image_url || "",
        clerkId: event.data.id,
        email: event.data.email_addresses[0]?.email_address || "",
      });
      console.log("User created in Convex");
      break;
    case "user.updated":
      console.log(
        `Updating user with clerkId ${event.data.id} with ${event.data}`
      );
      await ctx.runMutation(internal.user.create, {
        username: `${event.data.first_name} ${event.data.last_name}`,
        imageUrl: event.data.image_url,
        clerkId: event.data.id,
        email: event.data.email_addresses[0].email_address,
      });

      break;
    case "user.deleted":
      console.log(`Deleting user with clerkId ${event.data.id}`);

      // Ensure `event.data.id` is defined
      if (!event.data.id) {
        console.error("Error: Clerk user ID is undefined in the event data");
        return new Response("Invalid user ID", { status: 400 });
      }

      const user = await ctx.runQuery(internal.user.get, {
        clerkId: event.data.id, // Safely use `event.data.id` here
      });

      if (user) {
        await ctx.runMutation(internal.user.del, {
          id: user._id, // Use the Convex ID for deletion
        });
        console.log(`User with ID ${user._id} deleted`);
      } else {
        console.error(`User with clerkId ${event.data.id} not found in Convex`);
      }
      break;
    default:
      console.log(`Unhandled webhook event type: ${event.type}`);
  }
  return new Response(null, { status: 200 });
});

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
