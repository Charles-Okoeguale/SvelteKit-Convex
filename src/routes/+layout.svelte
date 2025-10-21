<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { setContext } from 'svelte';
  import { ConvexClient } from 'convex/browser';
  import { PUBLIC_CONVEX_URL } from '$env/static/public';

  const convex = new ConvexClient(PUBLIC_CONVEX_URL);
  setContext('convex', convex);

  $: currentPath = $page.url.pathname;
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<div class="min-h-screen bg-gray-50">
  <nav class="bg-white shadow-lg border-b border-gray-200 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center space-x-8">
          <div class="flex-shrink-0">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LoyaltyHub
            </h1>
          </div>

          <div class="hidden md:flex space-x-8">
            <a href="/" class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 {currentPath === '/' ? 'border-b-2 border-blue-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}">
              Home
            </a>
            <a href="/customers" class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 {currentPath === '/customers' ? 'border-b-2 border-blue-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}">
              Customers
            </a>
            <a href="/dashboard" class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 {currentPath === '/dashboard' ? 'border-b-2 border-blue-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}">
              Dashboard
            </a>
            <a href="/rewards" class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 {currentPath === '/rewards' ? 'border-b-2 border-blue-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}">
              Rewards
            </a>
          </div>
        </div>

        <div class="md:hidden flex items-center">
          <button
            class="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
            on:click={toggleMenu}
          >
            {#if isMenuOpen}
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            {:else}
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            {/if}
          </button>
        </div>
      </div>
    </div>

    {#if isMenuOpen}
      <div class="absolute top-full left-0 right-0 md:hidden bg-white shadow-lg border-t border-gray-200 z-50">
        <div class="space-y-1 px-4 py-4">
          <a href="/" class="block text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2 {currentPath === '/' ? 'bg-gray-100' : ''}">
            Home
          </a>
          <a href="/customers" class="block text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2 {currentPath === '/customers' ? 'bg-gray-100' : ''}">
            Customers
          </a>
          <a href="/dashboard" class="block text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2 {currentPath === '/dashboard' ? 'bg-gray-100' : ''}">
            Dashboard
          </a>
          <a href="/rewards" class="block text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2 {currentPath === '/rewards' ? 'bg-gray-100' : ''}">
            Rewards
          </a>
        </div>
      </div>
    {/if}
  </nav>

  <main>
    <slot />
  </main>
</div>