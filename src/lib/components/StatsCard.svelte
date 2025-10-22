<script lang="ts">
  export let label: string;
  export let value: string | number;
  export let color: 'blue' | 'green' | 'purple' = 'blue';
  export let animated: boolean = false;

  const colorMap = {
    blue: {
      border: 'hover:border-blue-400 hover:shadow-blue-500/20',
      bg: 'bg-blue-900',
      dot: 'bg-blue-400',
      text: 'text-white'
    },
    green: {
      border: 'hover:border-green-400 hover:shadow-green-500/20',
      bg: 'bg-green-900',
      dot: 'bg-green-400',
      text: 'text-green-400'
    },
    purple: {
      border: 'hover:border-purple-400 hover:shadow-purple-500/20',
      bg: 'bg-purple-900',
      dot: 'bg-purple-400',
      text: 'text-purple-400'
    }
  };

  const colors = colorMap[color];
</script>

<div class="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-4 sm:p-6 {colors.border} transition-all duration-300 hover:shadow-lg">
  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">
        {label}
      </h3>
      <p class="text-2xl sm:text-3xl font-light {colors.text}">
        {value}
      </p>
    </div>
    <div class="p-2 sm:p-3 {colors.bg} rounded-lg">
      <div class="w-2 h-2 {colors.dot} rounded-full {animated ? 'animate-pulse' : ''}"></div>
    </div>
  </div>
</div>

<style>
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>