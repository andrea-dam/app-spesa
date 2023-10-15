<template>
    <main>
        <div class="flex items-center justify-between px-6 py-5 text-6xl">
            <div class="flex flex-col gap-1 text-xl font-semibold">
                <span>Buoni utilizzabili: {{ totBuoni }}</span>
                <span :class="coloreSpreco">Al prossimo buono: {{ spreco.toLocaleString("it-IT", currencyOptions) }}</span>
            </div>
            <span>{{ result.toLocaleString("it-IT", currencyOptions) }}</span>
        </div>

        <form @submit.prevent="addItem" @reset.prevent="reset" class="flex w-full flex-col justify-center px-10">
            <input
                v-model.number="newItem"
                ref="input"
                id="prezzo"
                placeholder="0.00 €"
                class="rounded-xl border-2 p-4 text-end text-4xl text-neutral-950 shadow-inner"
                required />

            <div class="mt-5 flex w-full justify-evenly text-2xl font-semibold text-white">
                <BaseButton type="button" class="bg-yellow-400" @click="undo">Annulla</BaseButton>
                <BaseButton type="reset" class="bg-red-600">Reset</BaseButton>
            </div>
        </form>

        <template v-if="articoliInseriti.length">
            <span class="my-5 flex justify-center text-xl">Articoli inseriti: {{ articoliInseriti.length }}</span>
            <ul
                class="relative mx-10 flex max-h-64 flex-col gap-3 overflow-y-auto rounded-xl border bg-neutral-100 px-10 py-5 text-3xl shadow-inner transition-all duration-300 ease-out dark:bg-neutral-800">
                <TransitionGroup
                    enter-from-class="opacity-0 -translate-y-10"
                    leave-to-class="opacity-0 -translate-x-20"
                    leave-active-class="absolute left-10 right-10">
                    <li
                        v-for="articolo in articoliInseriti"
                        :key="articolo.id"
                        class="flex justify-between transition-all duration-300 ease-out">
                        <div class="w-24 text-right">{{ articolo.quantity.toLocaleString("it-IT", currencyOptions) }}</div>
                        <Icon role="button" @click="removeItem(articolo.id)" icon="tabler:circle-x-filled" class="text-4xl text-red-500" />
                    </li>
                </TransitionGroup>
            </ul>
        </template>
    </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Icon } from "@iconify/vue";
import { computedEager, useLocalStorage, useRefHistory } from "@vueuse/core";

import BaseButton from "./components/BaseButton.vue";

const newItem = ref();
const articoliInseriti = useLocalStorage("array-articoli", []);
const counter = useLocalStorage("counter", 0);
const result = computed(() => articoliInseriti.value.reduce((acc, object) => acc + object.quantity, 0));
const totBuoni = computedEager(() => Math.floor(result.value / 8));
const spreco = computed(() => 8 - (result.value % 8));

const coloreSpreco = computedEager(() => {
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
onMounted(() => inputFocus());

const addItem = () => {
    if (newItem.value > 0) {
        articoliInseriti.value.unshift({ id: counter.value, quantity: newItem.value });
        counter.value++;
        newItem.value = null;
    }
};

const removeItem = id => {
    counter.value--;
    articoliInseriti.value = articoliInseriti.value.filter(object => object.id !== id);
};

const { undo } = useRefHistory(articoliInseriti, { deep: true });

const reset = () => {
    if (confirm("Sei sicuro di voler resettare la spesa?")) {
        articoliInseriti.value = [];
        counter.value = 0;
        inputFocus();
    }
};

const inputFocus = () => input.value.focus();

const currencyOptions = { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 };
</script>
