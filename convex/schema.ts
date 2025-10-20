import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  customers: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    points: v.number(),
    createdAt: v.number(),
  }).index("by_points", ["points"]),

  uploadedFiles: defineTable({
    filename: v.string(),
    storageId: v.string(),
    uploadedAt: v.number(),
    processedCount: v.number(),
  }),
});