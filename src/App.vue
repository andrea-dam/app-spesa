<template>
    <main class="h-[100dvh]">
        <div class="relative my-10 flex items-center justify-center text-6xl">
            <span>{{ result.toFixed(2) }}</span
            ><span class="absolute right-6">€</span>
        </div>
        <form @submit.prevent="addItem" @reset.prevent="reset" class="flex w-full flex-col justify-center px-10">
            <input
                v-model.number="newItem"
                ref="input"
                name="prezzo"
                id="prezzo"
                placeholder="0.00 €"
                class="rounded-xl p-4 text-4xl"
            />

            <button class="mt-5 w-1/2 self-center rounded bg-red-600 py-2 text-2xl text-white" type="reset">
                Reset
            </button>
        </form>
    </main>
</template>

<script setup>
import { ref, onMounted } from "vue";

const newItem = ref();
const result = ref(0);

const addItem = () => {
    result.value += newItem.value;
    newItem.value = null;
};

const input = ref();
onMounted(() => input.value.focus());

const reset = () => {
    if (confirm("Sei sicuro di voler resettare la spesa?")) {
        result.value = 0;
    }
};
</script>
