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

<div class="min-h-screen bg-gray-900 relative overflow-hidden">
  <div class="absolute inset-0 overflow-hidden">
    {#each Array(50) as _, i}
      <div 
        class="absolute w-1 h-1 bg-gray-400 rounded-full animate-float"
        style="
          left: {Math.random() * 100}%; 
          top: {Math.random() * 100}%; 
          animation-delay: {Math.random() * 5}s;
          animation-duration: {3 + Math.random() * 4}s;
        "
      ></div>
    {/each}
  </div>

  <div class="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
  <div class="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-50" style="animation-delay: 1s;"></div>
  <div class="absolute bottom-40 left-20 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-70" style="animation-delay: 2s;"></div>
  <div class="absolute bottom-20 right-40 w-2 h-2 bg-indigo-400 rounded-full animate-pulse opacity-60" style="animation-delay: 3s;"></div>

  <div class="relative z-10">
    <div class="max-w-6xl mx-auto px-6 py-24">
      <div class="text-center space-y-6">    
        <h1 class="text-4xl md:text-5xl font-bold text-white tracking-tight" style="text-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);">
          LoyaltyHub
        </h1>
        
        <p class="text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed" style="text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);">
          Advanced customer engagement platform powered by real-time analytics and intelligent reward distribution.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <a 
            href="/dashboard" 
            class="group px-8 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium hover:border-gray-500 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden animate-light-border"
            style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);"
          >
            <span class="relative z-10">View Dashboard</span>
            <div class="absolute inset-0 bg-gray-700 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          </a>
        </div>
      </div>
    </div>
  </div>
  
  <div class="relative z-10">
    <StatsOverview stats={$stats} />
  </div>
</div>

<style>
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) translateX(0px); 
      opacity: 0.3;
    }
    50% { 
      transform: translateY(-20px) translateX(10px); 
      opacity: 0.8;
    }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  @keyframes light-border {
    0% {
      box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.5);
    }
    50% {
      box-shadow: 0 0 20px 4px rgba(255, 255, 255, 0.7);
    }
    100% {
      box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.5);
    }
  }

  .animate-light-border {
    animation: light-border 2s infinite;
  }
</style>