<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { ConvexClient } from 'convex/browser';
  import { api } from '../../convex/_generated/api';
  import StatsOverview from '$lib/components/StatsOverview.svelte';
  
  const convex = getContext<ConvexClient>('convex');
  const stats = writable<any>(null);
  
  onMount(() => {
    const unsubscribe = convex.onUpdate(
      api.dashboard.getDashboardStats,
      {}, 
      (latestData) => {
        stats.set(latestData);
      }
    );

    convex.query(api.dashboard.getDashboardStats, {}).then(data => {
      stats.set(data);
    });

    return unsubscribe;
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
  <div class="relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to 
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LoyaltyHub
          </span>
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Your comprehensive customer loyalty management platform. Track points, manage rewards, and grow your business with powerful analytics.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/customers" 
            class="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Manage Customers
          </a>
          <a 
            href="/dashboard" 
            class="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all border border-gray-200"
          >
            View Analytics
          </a>
        </div>
      </div>
    </div>
  </div>
  
  <StatsOverview stats={$stats} />
</div>