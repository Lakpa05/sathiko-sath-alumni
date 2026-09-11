<template>
    <section class="mx-auto max-w-7xl px-5 py-16">
        <p class="font-semibold text-emerald-700">CONNECT & PARTICIPATE</p>
        <h1 class="mt-2 text-4xl font-black">Upcoming Events</h1>
        <p v-if="loading" class="mt-10 text-center text-slate-500">Loading events...</p>
        <div v-else class="mt-10 grid gap-6 md:grid-cols-3">
            <article v-for="e in events" :key="e._id" class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div class="text-sm font-bold text-emerald-700">{{ format(e.date) }}</div>
                <h2 class="mt-3 text-xl font-bold">{{ e.title }}</h2>
                <p class="mt-2 text-sm text-slate-500">{{ e.venue }}</p>
                <p class="mt-4 text-slate-600">{{ e.description }}</p>
            </article>
        </div>
        <p v-if="!loading && !events.length" class="mt-10 text-slate-500">No upcoming events yet.</p>
    </section>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
const events = ref([]), loading = ref(true);
const format = d => d ? new Date(d).toLocaleDateString() : 'Date TBA';

onMounted(async () => {
    try {
        events.value = (await api.get('/events')).data;
    } finally {
        loading.value = false;
    }
});
</script>