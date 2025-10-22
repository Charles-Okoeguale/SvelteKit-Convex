<script lang="ts">
  import Chart from 'chart.js/auto';
  import { onMount } from 'svelte';
  
  export let showModal: boolean;
  export let stats: any;
  export let closeModal: () => void;
  
  let modalCanvas: HTMLCanvasElement;
  let modalChart: Chart | null = null;
  
  $: if (showModal && stats && modalCanvas) {
    createChart();
  }
  
  function createChart() {
    setTimeout(() => {
      if (!stats || !modalCanvas) return;
      
      if (modalChart) {
        modalChart.destroy();
      }
      
      const ctx = modalCanvas.getContext('2d');
      modalChart = new Chart(ctx!, {
        type: 'bar',
        data: {
          labels: stats.allCustomers.map((c: any) => c.name),
          datasets: [{
            label: 'Points',
            data: stats.allCustomers.map((c: any) => c.points),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: { size: 14, weight: 'bold' },
                color: '#374151'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#f3f4f6' },
              ticks: { color: '#6b7280', font: { size: 12 } }
            },
            x: {
              grid: { display: false },
              ticks: { 
                color: '#6b7280', 
                font: { size: 12 },
                maxRotation: 45
              }
            }
          }
        }
      });
    }, 100);
  }
  
  function handleClose() {
    if (modalChart) {
      modalChart.destroy();
      modalChart = null;
    }
    closeModal();
  }
</script>

{#if showModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div class="relative w-full h-full bg-gray-900 p-6 flex flex-col">
      <button 
        on:click={handleClose}
        class="absolute top-4 right-4 p-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 hover:text-white transition z-10"
        aria-label="Close chart"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <div class="flex-1 relative">
        <canvas bind:this={modalCanvas} class="w-full h-full"></canvas>
      </div>
    </div>
  </div>
{/if}