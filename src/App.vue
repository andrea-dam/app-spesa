<template>
    <main class="h-[100dvh] bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-50">
        <div class="flex items-center justify-between px-6 py-10 text-6xl">
            <div class="flex flex-col gap-1 text-xl font-semibold">
                <span>Buoni: {{ totBuoni }}</span>
                <span>Al prossimo buono: {{ spreco }}€</span>
            </div>
            <span>{{ result.toFixed(2) }}</span>
            <span>€</span>
        </div>

        <form @submit.prevent="addItem" @reset.prevent="reset" class="flex w-full flex-col justify-center px-10">
            <input
                v-model.number="newItem"
                ref="input"
                id="prezzo"
                placeholder="0.00 €"
                class="rounded-xl border-2 p-4 text-end text-4xl text-neutral-950 shadow-inner" />

            <button class="mt-5 w-1/2 self-center rounded-lg bg-red-600 py-2 text-2xl text-white shadow-md" type="reset">Reset</button>
        </form>
    </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { computedEager } from "@vueuse/core";

const newItem = ref();
const result = ref(0);
const totBuoni = computedEager(() => Math.floor(result.value / 8));
const spreco = computed(() => (8 - (result.value % 8)).toFixed(2));

// const { history, undo, redo } = useRefHistory(result);
// console.log(history.value);
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
