<script lang="ts">
  export let customer: any;
  export let rank: number;
</script>

<div class="flex items-center justify-between p-2.5 sm:p-4 bg-gray-700 rounded-lg border border-gray-600 transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1">
  <div class="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
    <span class="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full font-bold text-xs sm:text-sm flex-shrink-0">
      {rank}
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