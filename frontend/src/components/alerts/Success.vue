<template>
  <div
    class="absolute top-0 right-0 w-screen h-screen z-50 flex items-center justify-center"
  >
    <div class="bg-slate-800 h-screen opacity-50 flex-1 relative"></div>
    <div
      class="bg-slate-800 h-auto w-4/12 absolute rounded-md shadow-xl border border-solid border-slate-600"
    >
      <!-- Logo -->
      <div class="flex items-center justify-start mx-2 my-2">
        <span class="material-symbols-outlined text-xl text-green-500 animate-spin">
          toys_fan
        </span>
      </div>

      <div class="flex justify-center my-5">
        <span class="material-symbols-outlined text-green-500 border-4 border-solid rounded-full border-green-900" style="font-size: 100px;" > done </span>
      </div>
      <span class="flex justify-center text-xl mb-5 text-slate-300">Successful</span>
      <div class="flex justify-between mr-2 mb-2">
        <div class="flex items-center">
            <input type="checkbox" name="" id="" class="mx-2 w-4 h-4">
            <label for="" class="flex items-center text-slate-300 mt-1 ml-2">Do not ask me again</label>
        </div>
        <button type="submit" class="border border-solid px-6 py-1.5 text-slate-600 rounded-md hover:text-slate-300">
            Ok
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>
