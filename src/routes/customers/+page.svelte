<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { ConvexClient } from 'convex/browser';
  import { api } from '../../../convex/_generated/api';
  import * as XLSX from 'xlsx';
  import CustomerCard from '$lib/components/CustomerCard.svelte';
  
  const convex = getContext<ConvexClient>('convex');
  
  let name = '';
  let email = '';
  let isFileUpload = false;
  let fileInput: HTMLInputElement;
  let isUploading = false;
  let uploadMessage = '';
  
  const customers = writable<any[]>([]);
  
  onMount(() => {
    const unsubscribe = convex.onUpdate(
      api.customers.listCustomers,
      {}, 
      (latestData) => {
        customers.set(latestData || []);
      }
    );

    convex.query(api.customers.listCustomers, {}).then(data => {
      customers.set(data || []);
    });

    return unsubscribe;
  });
  
  async function handleAddCustomer() {
    if (!name) return;
    await convex.mutation(api.customers.addCustomer, { 
      name, 
      email: email || undefined 
    });
    name = '';
    email = '';
  }
  
  async function handleFileUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      uploadMessage = 'Please upload an Excel file (.xlsx or .xls)';
      return;
    }
    
    isUploading = true;
    uploadMessage = 'Processing file...';
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      const validCustomers = [];
      const errors = [];
      
      for (let i = 0; i < data.length; i++) {
        const row = data[i] as any;
        
        if (!row.name || typeof row.name !== 'string') {
          errors.push(`Row ${i + 1}: Missing or invalid name`);
          continue;
        }
        
        if (row.points !== undefined && (typeof row.points !== 'number' || row.points < 0)) {
          errors.push(`Row ${i + 1}: Invalid points value`);
          continue;
        }
        
        if (row.email && typeof row.email !== 'string') {
          errors.push(`Row ${i + 1}: Invalid email format`);
          continue;
        }
        
        validCustomers.push({
          name: row.name.toString().trim(),
          email: row.email ? row.email.toString().trim() : undefined,
          points: row.points || 0
        });
      }
      
      if (errors.length > 0) {
        uploadMessage = `Validation errors:\n${errors.join('\n')}`;
        isUploading = false;
        return;
      }
      
      await convex.mutation(api.customers.bulkAddCustomers, { customers: validCustomers });
      
      uploadMessage = `Successfully uploaded ${validCustomers.length} customers!`;
      fileInput.value = '';
      
    } catch (error) {
      uploadMessage = 'Error processing file. Please check the format.';
    }
    
    isUploading = false;
  }
  
  async function handleAddPoints(id: any) {
    await convex.mutation(api.customers.addPoints, { id, amount: 10 });
  }
  
  async function handleDeductPoints(id: any) {
    await convex.mutation(api.customers.deductPoints, { id, amount: 10 });
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Customer Management</h1>
      <p class="text-gray-600">Add and manage your customer loyalty program members</p>
    </div>
    
    <div class="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Add Customers</h2>
        
        <!-- Toggle Buttons -->
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button 
            on:click={() => isFileUpload = false}
            class="px-4 py-2 rounded-md text-sm font-medium transition-all {!isFileUpload ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          >
            Manual Entry
          </button>
          <button 
            on:click={() => isFileUpload = true}
            class="px-4 py-2 rounded-md text-sm font-medium transition-all {isFileUpload ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          >
            File Upload
          </button>
        </div>
      </div>
      
      {#if !isFileUpload}
        <form on:submit|preventDefault={handleAddCustomer} class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <!-- svelte-ignore a11y_label_has_associated_control -->
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input 
                type="text" 
                bind:value={name}
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <!-- svelte-ignore a11y_label_has_associated_control -->
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email (optional)
              </label>
              <input 
                type="email" 
                bind:value={email}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <button 
            type="submit"
            class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Add Customer
          </button>
        </form>
      {:else}
        <div class="space-y-4">
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="mb-4">
              <label for="file-upload" class="cursor-pointer">
                <span class="text-blue-600 font-medium hover:text-blue-500">Click to upload</span>
                <span class="text-gray-600"> or drag and drop</span>
              </label>
              <input 
                id="file-upload" 
                bind:this={fileInput}
                type="file" 
                accept=".xlsx,.xls"
                on:change={handleFileUpload}
                class="sr-only"
              />
            </div>
            <p class="text-sm text-gray-500">Excel files only (.xlsx, .xls)</p>
          </div>
          
          {#if isUploading}
            <div class="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span class="text-blue-700">Processing file...</span>
            </div>
          {/if}
          
          {#if uploadMessage}
            <div class="p-4 rounded-lg {uploadMessage.includes('error') || uploadMessage.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}">
              <pre class="whitespace-pre-wrap text-sm">{uploadMessage}</pre>
            </div>
          {/if}
          
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-2">Excel File Format:</h4>
            <p class="text-sm text-gray-600 mb-2">Your Excel file should have these columns:</p>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• <strong>name</strong> (required) - Customer name</li>
              <li>• <strong>email</strong> (optional) - Customer email</li>
              <li>• <strong>points</strong> (optional) - Initial points (defaults to 0)</li>
            </ul>
          </div>
        </div>
      {/if}
    </div>
    
    <!-- Customers List -->
    <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 class="text-xl font-bold text-gray-900 mb-6">All Customers</h2>
      {#if $customers.length > 0}
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each $customers as customer}
            <CustomerCard 
              {customer}
              onAddPoints={handleAddPoints}
              onDeductPoints={handleDeductPoints}
            />
          {/each}
        </div>
      {:else}
        <div class="text-center py-12">
          <div class="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No customers yet</h3>
          <p class="text-gray-600">Add your first customer to get started</p>
        </div>
      {/if}
    </div>
  </div>
</div>