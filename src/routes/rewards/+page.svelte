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
              color: '#e5e7eb',
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

<div class="min-h-screen bg-gray-900 relative overflow-hidden">
  <!-- Background stars -->
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

  <!-- Floating circles -->
  <div class="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
  <div class="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-50" style="animation-delay: 1s;"></div>
  <div class="absolute bottom-40 left-20 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-70" style="animation-delay: 2s;"></div>

  <div class="relative z-10">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-light text-white mb-2" style="text-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);">Rewards Center</h1>
        <p class="text-gray-300" style="text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);">Manage customer rewards and redemptions</p>
      </div>
      
      {#if $rewardsData}
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8 shadow-lg">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-900 rounded-lg">
              <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 class="font-light text-lg text-white">Reward Eligibility</h3>
              <p class="text-gray-300">Customers with 100+ points are eligible for rewards</p>
            </div>
          </div>
        </div>
        
        <div class="grid gap-8 lg:grid-cols-2 mb-8">
          <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-light text-white mb-4">Eligibility Overview</h2>
            <div class="relative h-64 sm:h-80">
              <canvas bind:this={pieCanvas} class="w-full h-full"></canvas>
            </div>
          </div>
          
          <div class="space-y-6">
            <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-400 mb-2">Eligible Customers</h3>
                  <p class="text-3xl font-light text-green-400">{$rewardsData.eligibleCount}</p>
                </div>
                <div class="p-3 bg-green-900 rounded-lg">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                {((($rewardsData.eligibleCount / $rewardsData.totalCount) * 100).toFixed(1))}% of total customers
              </p>
            </div>
            
            <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:border-red-400 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-400 mb-2">Not Eligible</h3>
                  <p class="text-3xl font-light text-red-400">{$rewardsData.nonEligibleCount}</p>
                </div>
                <div class="p-3 bg-red-900 rounded-lg">
                  <div class="w-2 h-2 bg-red-400 rounded-full"></div>
                </div>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                {((($rewardsData.nonEligibleCount / $rewardsData.totalCount) * 100).toFixed(1))}% of total customers
              </p>
            </div>
          </div>
        </div>
        
        {#if $rewardsData.eligible.length > 0}
          <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-light text-white mb-6">Eligible Customers</h2>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {#each $rewardsData.eligible as customer}
                <div class="bg-gray-700 border border-gray-600 rounded-xl p-6 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 transform hover:scale-105">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="font-light text-lg text-white">{customer.name}</h3>
                    <span class="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full shadow-sm">
                      ELIGIBLE
                    </span>
                  </div>
                  {#if customer.email}
                    <p class="text-sm text-gray-400 mb-3 font-mono">{customer.email}</p>
                  {/if}
                  <p class="text-3xl font-light text-green-400 mb-4 font-mono">
                    {customer.points} pts
                  </p>
                  <button 
                    on:click={() => handleRedeem(customer._id)}
                    class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Redeem Reward
                  </button>
                </div>
              {/each}
            </div>
          </div>
        {:else}
          <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-12 text-center">
            <div class="p-4 bg-gray-700 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-light text-white mb-2">No Eligible Customers</h3>
            <p class="text-gray-300">No customers have reached the 100 point threshold yet</p>
          </div>
        {/if}
      {:else}
        <div class="flex items-center justify-center h-64">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p class="text-gray-300">Loading rewards data...</p>
          </div>
        </div>
      {/if}
    </div>
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
</style>