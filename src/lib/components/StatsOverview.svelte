<script lang="ts">
  export let stats: any;
</script>

{#if stats}
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Quick Overview</h2>
      <p class="text-gray-600">Here's what's happening in your loyalty program</p>
    </div>
    
    <div class="grid gap-8 md:grid-cols-3">
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 hover:shadow-2xl transition-shadow">
        <div class="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <h3 class="text-4xl font-bold text-gray-900 mb-2">{stats.totalCustomers}</h3>
        <p class="text-gray-600 font-medium">Total Customers</p>
      </div>
      
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 hover:shadow-2xl transition-shadow">
        <div class="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
        </div>
        <h3 class="text-4xl font-bold text-green-600 mb-2">{stats.totalPoints}</h3>
        <p class="text-gray-600 font-medium">Total Points</p>
      </div>
      
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 hover:shadow-2xl transition-shadow">
        <div class="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <h3 class="text-4xl font-bold text-purple-600 mb-2">
          {stats.totalCustomers > 0 ? Math.round(stats.totalPoints / stats.totalCustomers) : 0}
        </h3>
        <p class="text-gray-600 font-medium">Avg Points</p>
      </div>
    </div>
  </div>
{/if}