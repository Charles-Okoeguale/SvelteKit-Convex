import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addCustomer = mutation({
  args: { 
    name: v.string(), 
    email: v.optional(v.string()) 
  },
  handler: async (ctx, args) => {
    const customerId = await ctx.db.insert("customers", {
      name: args.name,
      email: args.email,
      points: 0,
      createdAt: Date.now(),
    });
    return customerId;
  },
});

export const bulkAddCustomers = mutation({
  args: { 
    customers: v.array(v.object({
      name: v.string(),
      email: v.optional(v.string()),
      points: v.number()
    }))
  },
  handler: async (ctx, args) => {
    const customerIds = [];
    
    for (const customer of args.customers) {
      const existing = await ctx.db
        .query("customers")
        .filter((q) => q.eq(q.field("name"), customer.name))
        .first();
      
      if (!existing) {
        const id = await ctx.db.insert("customers", {
          name: customer.name,
          email: customer.email,
          points: customer.points,
          createdAt: Date.now(),
        });
        customerIds.push(id);
      }
    }
    
    return customerIds;
  },
});

export const listCustomers = query({
  handler: async (ctx) => {
    return await ctx.db.query("customers").order("desc").collect();
  },
});

export const addPoints = mutation({
  args: { 
    id: v.id("customers"), 
    amount: v.number() 
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.id);
    if (!customer) throw new Error("Customer not found");
    
    await ctx.db.patch(args.id, {
      points: customer.points + args.amount,
    });
  },
});

export const deductPoints = mutation({
  args: { 
    id: v.id("customers"), 
    amount: v.number() 
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.id);
    if (!customer) throw new Error("Customer not found");
    
    const newPoints = Math.max(0, customer.points - args.amount);
    await ctx.db.patch(args.id, {
      points: newPoints,
    });
  },
});

export const redeemReward = mutation({
  args: { id: v.id("customers") },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.id);
    if (!customer) throw new Error("Customer not found");
    
    await ctx.db.patch(args.id, {
      points: 0,
    });
  },
});

export const getRandomCustomers = query({
  handler: async (ctx) => {
    const customers = await ctx.db.query("customers").collect();
    return customers;
  },
});

export const updateCustomerPoints = mutation({
  args: { 
    id: v.id("customers"), 
    points: v.number() 
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      points: args.points,
    });
  },
});