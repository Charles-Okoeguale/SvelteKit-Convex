<script lang="ts">
  export let customer: any;
  export let onAddPoints: (id: any) => void;
  export let onDeductPoints: (id: any) => void;
</script>

<div class="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50">
  <h3 class="font-bold text-lg text-gray-900 mb-1">{customer.name}</h3>
  {#if customer.email}
    <p class="text-sm text-gray-600 mb-3">{customer.email}</p>
  {/if}
  <p class="text-3xl font-bold text-blue-600 mb-4">
    {customer.points} pts
  </p>
  <div class="flex gap-2">
    <button 
      on:click={() => onAddPoints(customer._id)}
      class="flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
    >
      +10
    </button>
    <button 
      on:click={() => onDeductPoints(customer._id)}
      class="flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
    >
      -10
    </button>
  </div>
</div>