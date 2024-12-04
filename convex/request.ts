import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByClerkId } from "./_utils";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    if (args.email === identity.email) {
      throw new ConvexError("Cannot send request to yourself");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const receiver = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!receiver) {
      throw new ConvexError("Receiver not found");
    }

    // Get all requests that match the criteria
    const existingSentRequests = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", receiver._id).eq("sender", currentUser._id)
      )
      .collect(); // Use collect() to get all results

    if (existingSentRequests.length > 0) {
      throw new ConvexError("Request already sent");
    }

    const friends1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
      .collect();

    const friends2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (q) => q.eq("user2", currentUser._id))
      .collect();

    if (
      friends1.some((friend) => friend.user2 === receiver._id) ||
      friends2.some((friend) => friend.user1 === receiver._id)
    ) {
      throw new ConvexError("Already friends");
    }

    const existingReceivedRequests = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", currentUser._id).eq("sender", receiver._id)
      )
      .collect(); // Use collect() to get all results

    if (existingReceivedRequests.length > 0) {
      throw new ConvexError("Request already received");
    }

    const request = await ctx.db.insert("requests", {
      sender: currentUser._id,
      receiver: receiver._id,
    });

    return request;
  },
});

export const deny = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const request = await ctx.db.get(args.id as Id<"requests">);

    if (!request) {
      throw new ConvexError("Request not found");
    }

    if (request.receiver !== currentUser._id) {
      throw new ConvexError("Not authorized");
    }

    await ctx.db.delete(request._id);
  },
});

export const accept = mutation({
  args: {
    id: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const request = await ctx.db.get(args.id as Id<"requests">);

    if (!request) {
      throw new ConvexError("Request not found");
    }

    if (!request || request.receiver !== currentUser._id) {
      throw new ConvexError("Not authorized");
    }

    const conversationId = await ctx.db.insert("conversations", {
      isGroup: false,
    });

    await ctx.db.insert("friends", {
      user1: currentUser._id,
      user2: request.sender,
      conversationId,
    });

    await ctx.db.insert("conversationMembers", {
      memberId: currentUser._id,
      conversationId,
    });
    await ctx.db.insert("conversationMembers", {
      memberId: request.sender,
      conversationId,
    });

    await ctx.db.delete(request._id);
  },
});
