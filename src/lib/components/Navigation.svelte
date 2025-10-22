<script lang="ts">
  export let currentPath: string;
  
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<nav class="bg-gray-900 shadow-lg border-gray-700 relative">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex items-center space-x-8">
        <div class="flex-shrink-0">
          <h1 class="text-2xl font-bold text-white tracking-tight">
            LoyaltyHub
          </h1>
        </div>

        <div class="hidden md:flex space-x-8">
          <a href="/" class="inline-flex items-center px-3 py-2 text-sm font-medium bg-gray-800 bg-opacity-70 rounded-lg transition-all duration-300 {currentPath === '/' ? 'border-b-2 border-blue-400 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}">
            Home
          </a>
          <a href="/customers" class="inline-flex items-center px-3 py-2 text-sm font-medium bg-gray-800 bg-opacity-70 rounded-lg transition-all duration-300 {currentPath === '/customers' ? 'border-b-2 border-blue-400 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}">
            Customers
          </a>
          <a href="/dashboard" class="inline-flex items-center px-3 py-2 text-sm font-medium bg-gray-800 bg-opacity-70 rounded-lg transition-all duration-300 {currentPath === '/dashboard' ? 'border-b-2 border-blue-400 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}">
            Dashboard
          </a>
          <a href="/rewards" class="inline-flex items-center px-3 py-2 text-sm font-medium bg-gray-800 bg-opacity-70 rounded-lg transition-all duration-300 {currentPath === '/rewards' ? 'border-b-2 border-blue-400 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}">
            Rewards
          </a>
        </div>
      </div>

      <div class="md:hidden flex items-center">
        <button
          class="text-gray-300 hover:text-white focus:outline-none focus:text-white transition-all duration-300 transform hover:scale-110"
          on:click={toggleMenu}
        >
          {#if isMenuOpen}
            <svg class="w-6 h-6 transform rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          {:else}
            <svg class="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          {/if}
        </button>
      </div>
    </div>
  </div>

  {#if isMenuOpen}
    <div class="absolute top-full left-0 right-0 md:hidden bg-gray-800 bg-opacity-80 shadow-lg border-t border-gray-700 z-50 animate-slideDown">
      <div class="space-y-1 px-4 py-4">
        <a href="/" class="block text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg px-3 py-2 transition-all duration-200 transform hover:scale-105 {currentPath === '/' ? 'bg-gray-700 text-white' : ''}">
          Home
        </a>
        <a href="/customers" class="block text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg px-3 py-2 transition-all duration-200 transform hover:scale-105 {currentPath === '/customers' ? 'bg-gray-700 text-white' : ''}">
          Customers
        </a>
        <a href="/dashboard" class="block text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg px-3 py-2 transition-all duration-200 transform hover:scale-105 {currentPath === '/dashboard' ? 'bg-gray-700 text-white' : ''}">
          Dashboard
        </a>
        <a href="/rewards" class="block text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg px-3 py-2 transition-all duration-200 transform hover:scale-105 {currentPath === '/rewards' ? 'bg-gray-700 text-white' : ''}">
          Rewards
        </a>
      </div>
    </div>
  {/if}
</nav>

<style>
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slideDown {
    animation: slideDown 0.9s ease-out;
  }
</style>