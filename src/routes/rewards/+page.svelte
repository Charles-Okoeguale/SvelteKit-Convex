<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { ConvexClient } from 'convex/browser';
  import { api } from '../../../convex/_generated/api';
  import Chart from 'chart.js/auto';
  
  const convex = getContext<ConvexClient>('convex');
  const rewardsData = writable<any>(null);
  
  let pieChart: Chart | null = null;
  let pieCanvas: HTMLCanvasElement;
  
  onMount(() => {
  const unsubscribe = convex.onUpdate(
    api.dashboard.getEligibleForRewards,
    {}, 
    (latestData) => {
      rewardsData.set(latestData);
      updatePieChart(latestData); 
    }
  );

  convex.query(api.dashboard.getEligibleForRewards, {}).then(data => {
    rewardsData.set(data);
    updatePieChart(data);
  });

  return unsubscribe;
});
  
  function updatePieChart(data: any) {
    if (!data || !pieCanvas) return;
    
    if (pieChart) {
      pieChart.destroy();
    }
    
    const ctx = pieCanvas.getContext('2d');
    pieChart = new Chart(ctx!, {
      type: 'pie',
      data: {
        labels: ['Eligible (100+ points)', 'Not Eligible'],
        datasets: [{
          data: [data.eligibleCount, data.nonEligibleCount],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 14, weight: 'bold' },
              color: '#374151',
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const percentage = ((context.parsed / data.totalCount) * 100).toFixed(1);
                return `${context.label}: ${context.parsed} customers (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
  
  async function handleRedeem(id: any) {
    if (confirm('Are you sure you want to redeem this reward? Points will be reset to 0.')) {
      await convex.mutation(api.customers.redeemReward, { id });
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Rewards Center</h1>
      <p class="text-gray-600">Manage customer rewards and redemptions</p>
    </div>
    
    {#if $rewardsData}
      <!-- Info Banner -->
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 mb-8 text-white shadow-lg">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-white/20 rounded-full">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-lg">Reward Eligibility</h3>
            <p class="opacity-90">Customers with 100+ points are eligible for rewards</p>
          </div>
        </div>
      </div>
      
      <!-- Analytics Section -->
      <div class="grid gap-8 lg:grid-cols-2 mb-8">
        <!-- Pie Chart -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Eligibility Overview</h2>
          <div class="relative h-64 sm:h-80">
            <canvas bind:this={pieCanvas} class="w-full h-full"></canvas>
          </div>
        </div>
        
        <!-- Stats -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Eligible Customers</h3>
                <p class="text-3xl font-bold text-green-600">{$rewardsData.eligibleCount}</p>
              </div>
              <div class="p-3 bg-green-100 rounded-full">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <p class="text-sm text-gray-600 mt-2">
              {((($rewardsData.eligibleCount / $rewardsData.totalCount) * 100).toFixed(1))}% of total customers
            </p>
          </div>
          
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Not Eligible</h3>
                <p class="text-3xl font-bold text-red-600">{$rewardsData.nonEligibleCount}</p>
              </div>
              <div class="p-3 bg-red-100 rounded-full">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <p class="text-sm text-gray-600 mt-2">
              {((($rewardsData.nonEligibleCount / $rewardsData.totalCount) * 100).toFixed(1))}% of total customers
            </p>
          </div>
        </div>
      </div>
      
      <!-- Eligible Customers -->
      {#if $rewardsData.eligible.length > 0}
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Eligible Customers</h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {#each $rewardsData.eligible as customer}
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-bold text-lg text-gray-900">{customer.name}</h3>
                  <span class="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm">
                    ELIGIBLE
                  </span>
                </div>
                {#if customer.email}
                  <p class="text-sm text-gray-600 mb-3">{customer.email}</p>
                {/if}
                <p class="text-3xl font-bold text-green-600 mb-4">
                  {customer.points} pts
                </p>
                <button 
                  on:click={() => handleRedeem(customer._id)}
                  class="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Redeem Reward
                </button>
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <div class="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
          <div class="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Eligible Customers</h3>
          <p class="text-gray-600">No customers have reached the 100 point threshold yet</p>
        </div>
      {/if}
    {:else}
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p class="text-gray-500">Loading rewards data...</p>
        </div>
      </div>
    {/if}
  </div>
</div>