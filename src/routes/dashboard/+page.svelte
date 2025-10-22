<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { ConvexClient } from 'convex/browser';
  import { api } from '../../../convex/_generated/api';
  import Chart from 'chart.js/auto';
  import ChartModal from '$lib/components/ChartModal.svelte';
  
  const convex = getContext<ConvexClient>('convex');
  const stats = writable<any>(null);
  
  let pointsChart: Chart | null = null;
  let chartCanvas: HTMLCanvasElement;
  let thumbnailCanvas: HTMLCanvasElement;
  let showModal = false;
  
  onMount(() => {
    const unsubscribe = convex.onUpdate(
      api.dashboard.getDashboardStats,
      {},
      (latestData) => {
        stats.set(latestData);
        updateChart(latestData);
        updateThumbnail(latestData);
      }
    );

    convex.query(api.dashboard.getDashboardStats, {}).then(data => {
      stats.set(data);
      updateChart(data);
      updateThumbnail(data);
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

  function updateThumbnail(data: any) {
    if (!data || !thumbnailCanvas) return;
    
    const ctx = thumbnailCanvas.getContext('2d');
    new Chart(ctx!, {
      type: 'bar',
      data: {
        labels: data.allCustomers.slice(0, 5).map((c: any) => c.name.split(' ')[0]),
        datasets: [{
          label: 'Points',
          data: data.allCustomers.slice(0, 5).map((c: any) => c.points),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { display: false },
            ticks: { display: false }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 8 } }
          }
        }
      }
    });
  }

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }
</script>

<div class="min-h-screen bg-gray-900 relative overflow-hidden">
  <div class="absolute inset-0 overflow-hidden">
    {#each Array(30) as _, i}
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

  <div class="relative z-10">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-4xl font-light text-white mb-1 sm:mb-2" style="text-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);">Analytics Dashboard</h1>
        <p class="text-sm sm:text-base text-gray-300" style="text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);">Real-time insights into your customer loyalty program</p>
      </div>
      
      {#if $stats}
        <div class="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
          <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-4 sm:p-6 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Total Customers</h3>
                <p class="text-2xl sm:text-3xl font-light text-white">{$stats.totalCustomers}</p>
              </div>
              <div class="p-2 sm:p-3 bg-blue-900 rounded-lg">
                <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-4 sm:p-6 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Total Points</h3>
                <p class="text-2xl sm:text-3xl font-light text-green-400">{$stats.totalPoints}</p>
              </div>
              <div class="p-2 sm:p-3 bg-green-900 rounded-lg">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-4 sm:p-6 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 sm:col-span-2 lg:col-span-1">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Avg Points/Customer</h3>
                <p class="text-2xl sm:text-3xl font-light text-purple-400">
                  {$stats.totalCustomers > 0 ? Math.round($stats.totalPoints / $stats.totalCustomers) : 0}
                </p>
              </div>
              <div class="p-2 sm:p-3 bg-purple-900 rounded-lg">
                <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="grid gap-6 sm:gap-8 lg:grid-cols-2">
          <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-3 sm:p-6">
            <h2 class="text-base sm:text-xl font-light text-white mb-3 sm:mb-4">Customer Points Distribution</h2>
            <div class="hidden min-[401px]:block relative h-64 sm:h-80">
              <canvas bind:this={chartCanvas} class="w-full h-full"></canvas>
            </div>
            
  
            <div class="block min-[401px]:hidden">
              <div class="relative h-32 mb-3 opacity-70">
                <canvas bind:this={thumbnailCanvas} class="w-full h-full"></canvas>
              </div>
              <button 
                on:click={openModal}
                class="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                </svg>
                View Full Chart
              </button>
            </div>
          </div>
          
          <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-3 sm:p-6">
            <h2 class="text-base sm:text-xl font-light text-white mb-3 sm:mb-4">Top 5 Customers</h2>
            <div class="space-y-2 sm:space-y-3">
              {#each $stats.topCustomers as customer, i}
                <div class="flex items-center justify-between p-2.5 sm:p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div class="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                    <span class="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full font-bold text-xs sm:text-sm flex-shrink-0">
                      {i + 1}
                    </span>
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-white text-xs sm:text-base truncate">{customer.name}</p>
                      {#if customer.email}
                        <p class="text-xs sm:text-sm text-gray-400 truncate">{customer.email}</p>
                      {/if}
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0 ml-2">
                    <span class="text-lg sm:text-2xl font-light text-blue-400">{customer.points}</span>
                    <p class="text-[10px] sm:text-xs text-gray-500">points</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {:else}
        <div class="flex items-center justify-center h-64">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p class="text-gray-300">Loading dashboard...</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<ChartModal 
  {showModal} 
  stats={$stats} 
  {closeModal}
/>

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

  @media (max-width: 400px) {
    :global(body) {
      overflow-x: hidden;
    }
  }
</style>