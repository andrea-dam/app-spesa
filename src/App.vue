<template>
    <main class="h-[100dvh]">
        <div class="flex items-center justify-between px-6 py-10 text-6xl">
            <div class="flex flex-col gap-1 text-xl font-semibold">
                <span>Buoni utilizzabili: {{ totBuoni }}</span>
                <span :class="coloreSpreco">Al prossimo buono: {{ spreco }}€</span>
            </div>
            <span>{{ result }}</span>
            <span>€</span>
        </div>

        <form @submit.prevent="addItem(counter)" @reset.prevent="reset" class="flex w-full flex-col justify-center px-10">
            <input
                v-model.number="newItem"
                ref="input"
                id="prezzo"
                placeholder="0.00 €"
                class="rounded-xl border-2 p-4 text-end text-4xl text-neutral-950 shadow-inner"
                required />

            <div class="mt-5 flex w-full justify-evenly text-2xl font-semibold text-white">
                <button type="button" class="rounded-lg bg-yellow-400 px-4 py-2 shadow-md" @click="undo">Annulla</button>
                <button class="rounded-lg bg-red-600 px-4 py-2 shadow-md" type="reset">Reset</button>
            </div>
        </form>

        <ul
            v-if="articoliInseriti.length"
            class="relative mx-10 mt-5 flex max-h-64 flex-col gap-3 overflow-y-auto rounded-xl border bg-neutral-100 px-10 py-5 text-3xl shadow-inner transition-all duration-300 ease-out dark:bg-neutral-800">
            <TransitionGroup
                enter-from-class="opacity-0 transform-translate-y-10"
                leave-to-class="opacity-0 transform-x-20"
                leave-active-class="absolute">
                <li
                    v-for="(articolo, index) in articoliInseriti"
                    :key="articolo"
                    class="flex justify-between transition-all duration-300 ease-out">
                    <span>{{ articolo.toFixed(2) }} €</span>
                    <Icon role="button" @click="removeItem(index)" icon="tabler:circle-x-filled" class="text-4xl text-red-500" />
                </li>
            </TransitionGroup>
        </ul>
    </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Icon } from "@iconify/vue";
import { computedEager, useLocalStorage, useRefHistory } from "@vueuse/core";

const newItem = ref();
const articoliInseriti = useLocalStorage("array-articoli", []);
const initialValue = 0;
const result = computed(() =>
    articoliInseriti.value.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue).toFixed(2)
);
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

const input = ref();
onMounted(() => input.value.focus());

const addItem = () => {
    articoliInseriti.value.unshift(newItem.value);
    newItem.value = null;
};

const removeItem = (indice) => (articoliInseriti.value = articoliInseriti.value.filter((_, index) => index !== indice));

const { undo } = useRefHistory(articoliInseriti, { deep: true });

const reset = () => {
    if (confirm("Sei sicuro di voler resettare la spesa?")) {
        articoliInseriti.value = [];
    }
};
</script>
