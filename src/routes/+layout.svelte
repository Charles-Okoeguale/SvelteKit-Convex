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

    const fromIndex = routeOrder.indexOf(from.url.pathname);
    const toIndex = routeOrder.indexOf(to.url.pathname);

    if (toIndex > fromIndex) {
      animationClass.set('slide-in-right');
    } else {
      animationClass.set('slide-in-left');
    }

    setTimeout(() => {
      animationClass.set('');
    }, 400);

    previousPath = from.url.pathname;
  });

  $: currentPath = $page.url.pathname;
</script>

<div class="min-h-screen bg-gray-50">
  <Navigation {currentPath} />

  <main class="page-transition {$animationClass}">
    <slot />
  </main>
</div>



<style>
  .page-transition {
    animation-duration: 0.35s;
    animation-timing-function: ease-out;
    animation-fill-mode: both;
  }

  .slide-in-right {
    animation-name: slideInRight;
  }

  .slide-in-left {
    animation-name: slideInLeft;
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>