<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { ConvexClient } from 'convex/browser';
  import { api } from '../../../convex/_generated/api';
  import Chart from 'chart.js/auto';
  
  const convex = getContext<ConvexClient>('convex');
  const stats = writable<any>(null);
  
  let pointsChart: Chart | null = null;
  let modalChart: Chart | null = null;
  let chartCanvas: HTMLCanvasElement;
  let thumbnailCanvas: HTMLCanvasElement;
  let modalCanvas: HTMLCanvasElement;
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
    setTimeout(() => {
      if (!$stats || !modalCanvas) return;
      
      const ctx = modalCanvas.getContext('2d');
      modalChart = new Chart(ctx!, {
        type: 'bar',
        data: {
          labels: $stats.allCustomers.map((c: any) => c.name),
          datasets: [{
            label: 'Points',
            data: $stats.allCustomers.map((c: any) => c.points),
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
    }, 100);
  }

  function closeModal() {
    showModal = false;
    if (modalChart) {
      modalChart.destroy();
      modalChart = null;
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
  <div class="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Analytics Dashboard</h1>
      <p class="text-sm sm:text-base text-gray-600">Real-time insights into your customer loyalty program</p>
    </div>
    
    {#if $stats}
      <!-- Stats Cards -->
      <div class="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Total Customers</h3>
              <p class="text-2xl sm:text-3xl font-bold text-gray-900">{$stats.totalCustomers}</p>
            </div>
            <div class="p-2 sm:p-3 bg-blue-100 rounded-full">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Total Points</h3>
              <p class="text-2xl sm:text-3xl font-bold text-blue-600">{$stats.totalPoints}</p>
            </div>
            <div class="p-2 sm:p-3 bg-green-100 rounded-full">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Avg Points/Customer</h3>
              <p class="text-2xl sm:text-3xl font-bold text-green-600">
                {$stats.totalCustomers > 0 ? Math.round($stats.totalPoints / $stats.totalCustomers) : 0}
              </p>
            </div>
            <div class="p-2 sm:p-3 bg-purple-100 rounded-full">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Charts Section -->
      <div class="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <!-- Bar Chart -->
        <div class="bg-white rounded-xl shadow-lg p-3 sm:p-6 border border-gray-100">
          <h2 class="text-base sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Customer Points Distribution</h2>
          
          <!-- Desktop/Tablet View -->
          <div class="hidden min-[401px]:block relative h-64 sm:h-80">
            <canvas bind:this={chartCanvas} class="w-full h-full"></canvas>
          </div>
          
          <!-- Mobile View (400px and below) -->
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
        
        <!-- Top Customers -->
        <div class="bg-white rounded-xl shadow-lg p-3 sm:p-6 border border-gray-100">
          <h2 class="text-base sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Top 5 Customers</h2>
          <div class="space-y-2 sm:space-y-3">
            {#each $stats.topCustomers as customer, i}
              <div class="flex items-center justify-between p-2.5 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100">
                <div class="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                  <span class="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full font-bold text-xs sm:text-sm flex-shrink-0">
                    {i + 1}
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="font-semibold text-gray-900 text-xs sm:text-base truncate">{customer.name}</p>
                    {#if customer.email}
                      <p class="text-xs sm:text-sm text-gray-600 truncate">{customer.email}</p>
                    {/if}
                  </div>
                </div>
                <div class="text-right flex-shrink-0 ml-2">
                  <span class="text-lg sm:text-2xl font-bold text-blue-600">{customer.points}</span>
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
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    {/if}
  </div>
</div>

{#if showModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div class="relative w-full h-full bg-white p-6 flex flex-col">
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button 
        on:click={closeModal}
        class="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition z-10"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <div class="mb-4 text-center">
        <!-- <p class="text-sm text-gray-600 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Rotate your phone for better viewing
        </p> -->
      </div>
      
      <div class="flex-1 relative">
        <canvas bind:this={modalCanvas} class="w-full h-full"></canvas>
      </div>
    </div>
  </div>
{/if}

<style>
  @media (max-width: 400px) {
    :global(body) {
      overflow-x: hidden;
    }
  }
</style>