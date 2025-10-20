<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { setContext } from 'svelte';
  import { ConvexClient } from 'convex/browser';
  import { PUBLIC_CONVEX_URL } from '$env/static/public';
  
  const convex = new ConvexClient(PUBLIC_CONVEX_URL);
  setContext('convex', convex);
  
  $: currentPath = $page.url.pathname;
</script>

<div class="min-h-screen bg-gray-50">
  <nav class="bg-white shadow-lg border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center space-x-8">
          <div class="flex-shrink-0">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LoyaltyHub
            </h1>
          </div>
          
          <div class="hidden md:flex space-x-8">
            <a 
              href="/" 
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 {currentPath === '/' ? 'border-b-2 border-blue-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Home
            </a>
            <a 
              href="/customers" 
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 {currentPath === '/customers' ? 'border-b-2 border-blue-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
              </svg>
              Customers
            </a>
            <a 
              href="/dashboard" 
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 {currentPath === '/dashboard' ? 'border-b-2 border-blue-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Dashboard
            </a>
            <a 
              href="/rewards" 
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 {currentPath === '/rewards' ? 'border-b-2 border-blue-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2v13M9 19l3-3m0 0l3 3M9 7v12"></path>
              </svg>
              Rewards
            </a>
          </div>
        </div>
        
        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <!-- svelte-ignore a11y_consider_explicit_label -->
          <button class="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
  
  <main>
    <slot />
  </main>
</div>