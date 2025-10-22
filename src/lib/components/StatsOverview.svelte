<script lang="ts">
  export let stats: any;
</script>

{#if stats}
  <div class="max-w-6xl mx-auto px-6 py-20">
    <div class="inline-flex items-center space-x-2 text-blue-400 text-sm font-mono font-extrabold mb-4" style="text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);">
      <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      <span class="font-extrabold">LOYALTY SYSTEM OVERVIEW</span>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
      <div class="group bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-400 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center group-hover:bg-blue-800 transition-colors duration-300">
            <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
          <div class="text-xs text-gray-400 font-mono">USERS</div>
        </div>
        <div class="space-y-1">
          <div class="text-2xl font-light text-gray-100 font-mono">{stats.totalCustomers.toLocaleString()}</div>
          <div class="text-sm text-gray-400">Active customers</div>
        </div>
      </div>
      
      <div class="group bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-green-400 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-green-900 rounded-lg flex items-center justify-center group-hover:bg-green-800 transition-colors duration-300">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div class="text-xs text-gray-400 font-mono">POINTS</div>
        </div>
        <div class="space-y-1">
          <div class="text-2xl font-light text-gray-100 font-mono">{stats.totalPoints.toLocaleString()}</div>
          <div class="text-sm text-gray-400">Total accumulated</div>
        </div>
      </div>
      
      <div class="group bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-purple-400 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-purple-900 rounded-lg flex items-center justify-center group-hover:bg-purple-800 transition-colors duration-300">
            <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
          </div>
          <div class="text-xs text-gray-400 font-mono">AVG</div>
        </div>
        <div class="space-y-1">
          <div class="text-2xl font-light text-gray-100 font-mono">
            {stats.totalCustomers > 0 ? Math.round(stats.totalPoints / stats.totalCustomers).toLocaleString() : 0}
          </div>
          <div class="text-sm text-gray-400">Points per user</div>
        </div>
      </div>
    </div>
    
    <div class="flex items-center justify-center mt-12 space-x-2">
      <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      <span class="text-xs text-gray-400 font-mono">SYSTEM ACTIVE</span>
    </div>
  </div>
{/if}