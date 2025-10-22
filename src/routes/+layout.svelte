<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { setContext } from 'svelte';
  import { ConvexClient } from 'convex/browser';
  import { PUBLIC_CONVEX_URL } from '$env/static/public';
  import Navigation from '$lib/components/Navigation.svelte';
  import { afterNavigate } from '$app/navigation';
  import { writable } from 'svelte/store';

  const routeOrder = ['/', '/customers', '/dashboard', '/rewards'];
  let animationClass = writable('');
  let previousPath = '/';
  const convex = new ConvexClient(PUBLIC_CONVEX_URL);
  setContext('convex', convex);

  afterNavigate(({ from, to }) => {
    if (!from || !to) return;

    animationClass.set('fade-in');

    setTimeout(() => {
      animationClass.set('');
    }, 600);

    previousPath = from.url.pathname;
  });

  $: currentPath = $page.url.pathname;
</script>

<div class="min-h-screen bg-gray-900">
  <Navigation {currentPath} />

  <main class="page-transition {$animationClass}">
    <slot />
  </main>
</div>

<style>
  .page-transition {
    animation-duration: 0.6s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: both;
  }

  .fade-in {
    animation-name: fadeIn;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>