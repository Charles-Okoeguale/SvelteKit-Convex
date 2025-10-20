import { cronJobs } from "convex/server";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run every 10 minutes
crons.interval(
  "random-points-scheduler",
  { minutes: 10 },
  internal.scheduler.randomPointsUpdate
);

export const randomPointsUpdate = internalMutation({
  handler: async (ctx) => {
    const customers = await ctx.db.query("customers").collect();
    
    if (customers.length < 2) {
      // Need at least 2 customers for this to work
      return;
    }
    
    // Get two random customers
    const randomIndex1 = Math.floor(Math.random() * customers.length);
    let randomIndex2 = Math.floor(Math.random() * customers.length);
    
    // Ensure we have different customers (but allow same customer if there's only one)
    while (randomIndex2 === randomIndex1 && customers.length > 1) {
      randomIndex2 = Math.floor(Math.random() * customers.length);
    }
    
    const customerToDeduct = customers[randomIndex1];
    const customerToAdd = customers[randomIndex2];
    
    // Deduct points (minimum 0)
    const newDeductedPoints = Math.max(0, customerToDeduct.points - 10);
    await ctx.db.patch(customerToDeduct._id, {
      points: newDeductedPoints
    });
    
    // Add 20 points
    await ctx.db.patch(customerToAdd._id, {
      points: customerToAdd.points + 20
    });
    
    console.log(`Scheduled update: Deducted 10 points from ${customerToDeduct.name}, added 20 points to ${customerToAdd.name}`);
  },
});

export default crons;