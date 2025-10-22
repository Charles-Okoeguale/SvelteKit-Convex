<script lang="ts">
  export let isOpen: boolean;
  export let customerName: string;
  export let onConfirm: () => void;
  export let onCancel: () => void;
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 max-w-sm mx-4">
      <h3 class="text-xl font-light text-white mb-4">Confirm Redemption</h3>
      
      <p class="text-gray-300 mb-6">
        Are you sure you want to redeem the reward for <span class="text-green-400 font-semibold">{customerName}</span>? 
        <span class="block mt-2">Their points will be reset to 0.</span>
      </p>
      
      <div class="flex gap-3">
        <button 
          on:click={onCancel}
          class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all font-medium"
        >
          Cancel
        </button>
        <button 
          on:click={onConfirm}
          class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all font-medium"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
{/if}