<template>
    <main class="relative overflow-hidden">
        <div class="flex items-center justify-between px-6 py-5 text-6xl">
            <div class="flex flex-col gap-1 text-xl font-semibold">
                <span>Buoni utilizzabili: {{ totBuoni }}</span>
                <span :class="coloreSpreco"> Al prossimo buono: {{ convertToCurrency(spreco) }} </span>
            </div>
            <div class="flex flex-col items-end justify-between gap-4">
                <Icon icon="mdi:gear" role="button" class="z-50 text-3xl" @click="toggleMenu()" />
                <span>{{ convertToCurrency(result) }}</span>
            </div>
        </div>

        <Transition enter-from-class="translate-x-96" leave-to-class="translate-x-96">
            <div
                v-if="isMenuOpen"
                class="absolute bottom-8 left-8 right-0 top-20 z-40 rounded-l-3xl border-4 border-r-0 border-gray-50 bg-neutral-300 p-4 transition-transform duration-300 ease-out dark:bg-neutral-800">
                <div class="flex items-center justify-between">
                    <span class="text-lg">Seleziona valore buono: </span>
                    <select
                        name="valore"
                        id="valore"
                        class="w-20 rounded-lg text-black"
                        @change="isMenuOpen = false"
                        v-model.number="valoreBuono">
                        <option value="8">8 €</option>
                        <option value="7">7 €</option>
                    </select>
                </div>
            </div>
        </Transition>

        <form @submit.prevent="addItem" @reset.prevent="reset" class="flex w-full flex-col justify-center px-10">
            <template v-if="nameInserted">
                <input
                    v-model.number="newItem.price"
                    ref="priceInput"
                    id="prezzo"
                    placeholder="Inserisci prezzo"
                    class="rounded-lg border-2 p-4 text-end text-2xl text-neutral-950 shadow-inner"
                    required />
            </template>
            <template v-else>
                <input
                    v-model="newItem.name"
                    ref="nameInput"
                    id="articolo"
                    placeholder="Inserisci nome articolo"
                    class="rounded-lg border-2 p-4 text-2xl text-neutral-950 shadow-inner" />
            </template>

            <div class="mt-5 flex w-full justify-evenly text-2xl font-semibold text-white">
                <BaseButton type="button" class="bg-yellow-400" @click="undo">Annulla</BaseButton>
                <BaseButton type="reset" class="bg-red-600">Reset</BaseButton>
            </div>
        </form>

        <template v-if="articoliInseriti.length">
            <ul
                class="relative mx-10 my-5 flex max-h-64 flex-col gap-3 overflow-y-auto rounded-xl border bg-neutral-100 px-2 py-5 text-2xl shadow-inner transition-all duration-300 ease-out dark:bg-neutral-800">
                <TransitionGroup
                    enter-from-class="opacity-0 -translate-y-10"
                    leave-to-class="opacity-0 -translate-x-20"
                    enter-active-class="transition-all duration-300 ease-out"
                    leave-active-class="absolute left-10 right-10 transition-all duration-300 ease-out">
                    <li v-for="articolo in articoliInseriti" :key="articolo.id" class="flex justify-between">
                        <div class="flex gap-2.5 truncate">
                            <span class="w-20 text-right">{{ convertToCurrency(articolo.price) }}</span>
                            <span>-</span>
                            <span>{{ articolo.name }}</span>
                        </div>
                        <Icon
                            role="button"
                            @click="removeItem(articolo.id)"
                            icon="tabler:circle-x-filled"
                            class="flex-none text-4xl text-red-500" />
                    </li>
                </TransitionGroup>
            </ul>
            <span class="my-5 flex justify-center text-xl">Numero articoli: {{ articoliInseriti.length }}</span>
        </template>
    </main>
</template>

<script setup>
import { ref, onMounted, computed, reactive, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import { useLocalStorage, useRefHistory, useToggle } from "@vueuse/core";

import BaseButton from "./components/BaseButton.vue";

const newItem = reactive({
    name: "",
    price: null,
});
const articoliInseriti = useLocalStorage("array-articoli", []);
const counter = useLocalStorage("counter", 0);
const valoreBuono = useLocalStorage("valore-buono", 8);

const result = computed(() => articoliInseriti.value.reduce((acc, object) => acc + object.price, 0));
const totBuoni = computed(() => Math.floor(result.value / valoreBuono.value));
const spreco = computed(() => valoreBuono.value - (result.value % valoreBuono.value));

const nameInserted = ref(false);

const isMenuOpen = ref(false);
const toggleMenu = useToggle(isMenuOpen);

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

const priceInput = ref();
const nameInput = ref();
onMounted(() => nameInputFocus());

const addItem = async () => {
    if (!nameInserted.value) {
        if (newItem.name.length > 0) {
            nameInserted.value = true;
            await nextTick();
            priceInputFocus();
        }
    }
    if (newItem.price > 0) {
        articoliInseriti.value.unshift({ id: counter.value, price: newItem.price, name: newItem.name });
        counter.value++;
        newItem.name = "";
        newItem.price = null;
        nameInserted.value = false;
        await nextTick();
        nameInputFocus();
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
        nameInputFocus();
    }
};

const nameInputFocus = () => nameInput.value.focus();
const priceInputFocus = () => priceInput.value.focus();

const convertToCurrency = number =>
    number.toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
</script>
