<template>
    <main class="h-[100dvh] bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-50">
        <div class="flex items-center justify-between px-6 py-10 text-6xl">
            <div class="flex flex-col gap-1 text-xl font-semibold">
                <span>Buoni: {{ totBuoni }}</span>
                <span :class="coloreSpreco">Al prossimo buono: {{ spreco }}€</span>
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

            <div class="mt-5 flex w-full justify-evenly text-2xl font-semibold text-white">
                <button type="button" class="rounded-lg bg-yellow-400 px-4 py-2 shadow-md" @click="undo">Annulla</button>
                <button class="rounded-lg bg-red-600 px-4 py-2 shadow-md" type="reset">Reset</button>
            </div>
        </form>
    </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { computedEager, useRefHistory } from "@vueuse/core";

const newItem = ref();
const result = ref(0);
const totBuoni = computedEager(() => Math.floor(result.value / 8));
const spreco = computed(() => (8 - (result.value % 8)).toFixed(2));

const coloreSpreco = computed(() => {
    if (spreco.value > 7 && spreco.value <= 8) return "text-green-500";
    if (spreco.value > 6 && spreco.value <= 7) return "text-lime-500";
    if (spreco.value > 5 && spreco.value <= 6) return "text-yellow-300";
    if (spreco.value > 4 && spreco.value <= 5) return "text-amber-400";
    if (spreco.value > 3 && spreco.value <= 4) return "text-orange-400";
    if (spreco.value > 2 && spreco.value <= 3) return "text-orange-500";
    if (spreco.value > 1 && spreco.value <= 2) return "text-orange-600";
    if (spreco.value > 0 && spreco.value <= 1) return "text-red-500";
});

const { undo } = useRefHistory(result);

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
