import { query } from "./_generated/server";

export const getDashboardStats = query({
  handler: async (ctx) => {
    const customers = await ctx.db.query("customers").collect();
    
    const totalCustomers = customers.length;
    const totalPoints = customers.reduce((sum, c) => sum + c.points, 0);
    const topCustomers = customers
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);
    
    // All customers for the bar chart
    const allCustomers = customers.sort((a, b) => b.points - a.points);
    
    return {
      totalCustomers,
      totalPoints,
      topCustomers,
      allCustomers,
    };
  },
});

export const getEligibleForRewards = query({
  handler: async (ctx) => {
    const allCustomers = await ctx.db.query("customers").collect();
    const eligibleCustomers = allCustomers.filter(c => c.points >= 100);
    const nonEligibleCustomers = allCustomers.filter(c => c.points < 100);
    
    return {
      eligible: eligibleCustomers,
      nonEligible: nonEligibleCustomers,
      eligibleCount: eligibleCustomers.length,
      nonEligibleCount: nonEligibleCustomers.length,
      totalCount: allCustomers.length,
    };
  },
});