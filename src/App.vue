<template>
    <main class="h-[100dvh]">
        <div class="my-10 flex items-center justify-between px-6 text-6xl">
            <span class="text-xl font-semibold">Buoni: {{ totBuoni }}</span>
            <span>{{ result.toFixed(2) }}</span>
            <span>€</span>
        </div>

        <form @submit.prevent="addItem" @reset.prevent="reset" class="flex w-full flex-col justify-center px-10">
            <input
                v-model.number="newItem"
                ref="input"
                name="prezzo"
                id="prezzo"
                placeholder="0.00 €"
                class="rounded-xl border-2 p-4 text-4xl shadow-inner" />

            <button class="mt-5 w-1/2 self-center rounded-lg bg-red-600 py-2 text-2xl text-white" type="reset">Reset</button>
        </form>
    </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { computedEager } from "@vueuse/core";

const newItem = ref();
const result = ref(0);
const totBuoni = computedEager(() => Math.floor(result.value / 8));
const spreco = computedEager(() => result.value - totBuoni.value);

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
