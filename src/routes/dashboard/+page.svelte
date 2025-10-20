<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { ConvexClient } from 'convex/browser';
  import { api } from '../../../convex/_generated/api';
  import Chart from 'chart.js/auto';
  
  const convex = getContext<ConvexClient>('convex');
  const stats = writable<any>(null);
  
  let pointsChart: Chart | null = null;
  let chartCanvas: HTMLCanvasElement;
  
  onMount(() => {
  const unsubscribe = convex.onUpdate(
    api.dashboard.getDashboardStats,
    {},
    (latestData) => {
      stats.set(latestData);
      updateChart(latestData); 
    }
  );

  convex.query(api.dashboard.getDashboardStats, {}).then(data => {
    stats.set(data);
    updateChart(data); 
  });
  return unsubscribe;
});
  
  function updateChart(data: any) {
    if (!data || !chartCanvas) return;
    
    if (pointsChart) {
      pointsChart.destroy();
    }
    
    const ctx = chartCanvas.getContext('2d');
    pointsChart = new Chart(ctx!, {
      type: 'bar',
      data: {
        labels: data.allCustomers.map((c: any) => c.name),
        datasets: [{
          label: 'Points',
          data: data.allCustomers.map((c: any) => c.points),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 14, weight: 'bold' },
              color: '#374151'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f3f4f6' },
            ticks: { color: '#6b7280', font: { size: 12 } }
          },
          x: {
            grid: { display: false },
            ticks: { 
              color: '#6b7280', 
              font: { size: 12 },
              maxRotation: 45
            }
          }
        }
      }
    });
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
      <p class="text-gray-600">Real-time insights into your customer loyalty program</p>
    </div>
    
    {#if $stats}
      <!-- Stats Cards -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Total Customers</h3>
              <p class="text-3xl font-bold text-gray-900">{$stats.totalCustomers}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Total Points</h3>
              <p class="text-3xl font-bold text-blue-600">{$stats.totalPoints}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Avg Points/Customer</h3>
              <p class="text-3xl font-bold text-green-600">
                {$stats.totalCustomers > 0 ? Math.round($stats.totalPoints / $stats.totalCustomers) : 0}
              </p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Charts Section -->
      <div class="grid gap-8 lg:grid-cols-2">
        <!-- Bar Chart -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Customer Points Distribution</h2>
          <div class="relative h-64 sm:h-80">
            <canvas bind:this={chartCanvas} class="w-full h-full"></canvas>
          </div>
        </div>
        
        <!-- Top Customers -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Top 5 Customers</h2>
          <div class="space-y-3">
            {#each $stats.topCustomers as customer, i}
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100">
                <div class="flex items-center gap-4">
                  <span class="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                    {i + 1}
                  </span>
                  <div>
                    <p class="font-semibold text-gray-900">{customer.name}</p>
                    {#if customer.email}
                      <p class="text-sm text-gray-600">{customer.email}</p>
                    {/if}
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-2xl font-bold text-blue-600">{customer.points}</span>
                  <p class="text-xs text-gray-500">points</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {:else}
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    {/if}
  </div>
</div>