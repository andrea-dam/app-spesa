<template>
    <main class="h-[100dvh]">
        <div class="relative my-10 flex items-center justify-center text-6xl">
            <span>{{ result.toFixed(2) }}</span
            ><span class="absolute right-6">€</span>
        </div>
        <form @submit.prevent="addItem" @reset.prevent="result = 0" class="flex flex-col w-full justify-center">
            <input
                v-model.number="newItem"
                ref="input"
                type="tel"
                name="prezzo"
                id="prezzo"
                placeholder="0.00 €"
                class="py-4 text-4xl"
            />

            <button type="reset">Reset</button>
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
</script>
