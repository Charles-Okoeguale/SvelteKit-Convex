<script lang="ts">
  export let customer: any;
  export let onAddPoints: (id: any) => void;
  export let onDeductPoints: (id: any) => void;
</script>

<div class="group bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-105">
  <div class="flex items-center justify-between mb-4">
    <div class="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center group-hover:bg-blue-800 transition-colors duration-300">
      <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
    </div>
    <div class="text-xs text-gray-400 font-mono">CUSTOMER</div>
  </div>

  <h3 class="font-light text-xl text-white mb-1" style="text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);">
    {customer.name}
  </h3>
  
  {#if customer.email}
    <p class="text-sm text-gray-400 mb-4 font-mono">{customer.email}</p>
  {:else}
    <div class="mb-4"></div>
  {/if}
  
  <div class="mb-6">
    <p class="text-3xl font-light text-blue-400 font-mono">
      {customer.points}
    </p>
    <p class="text-xs text-gray-500 font-mono">POINTS</p>
  </div>
  
  <div class="flex gap-3">
    <button 
      on:click={() => onAddPoints(customer._id)}
      class="group flex-1 px-4 py-2 text-gray-300 text-sm rounded-lg hover:text-white transition-all duration-200 font-medium shadow-sm"
      style="background: linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));"
    >
      +10
    </button>
    <button 
      on:click={() => onDeductPoints(customer._id)}
      class="group flex-1 px-4 py-2 text-gray-300 text-sm rounded-lg hover:text-white transition-all duration-200 font-medium shadow-sm"
      style="background: linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));"
    >
      -10
    </button>
  </div>
</div>