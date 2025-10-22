<script lang="ts">
  export let customer: any;
  export let onRedeem: (id: any) => void;
</script>

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
    on:click={() => onRedeem(customer._id)}
    class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105"
  >
    Redeem Reward
  </button>
</div>