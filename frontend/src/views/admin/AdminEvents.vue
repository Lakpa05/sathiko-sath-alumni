<template>
    <section class="mx-auto max-w-7xl px-5 py-10">
        <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
                <p class="font-semibold text-emerald-700">ADMIN PANEL</p>
                <h1 class="mt-1 text-4xl font-black">Events</h1>
            </div>
            <RouterLink to="/admin" class="rounded-xl border px-4 py-2">Back to dashboard</RouterLink>
        </div>
        <form @submit.prevent="createEvent" class="mt-8 grid gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
            <input v-model="form.title" placeholder="Event title" required>
            <input v-model="form.date" type="date">
            <input v-model="form.time" placeholder="Time">
            <input v-model="form.venue" placeholder="Venue">
            <textarea v-model="form.description" placeholder="Description" rows="3" class="md:col-span-2"></textarea>
            <button class="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white md:col-span-2">Add event</button>
            <p v-if="message" class="text-sm text-emerald-700 md:col-span-2">{{ message }}</p>
        </form>
        <div class="mt-8 grid gap-4 md:grid-cols-2">
            <article v-for="event in events" :key="event._id" class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div class="flex items-start justify-between gap-4"><div><h2 class="font-bold">{{ event.title }}</h2><p class="mt-1 text-sm text-emerald-700">{{ formatDate(event.date) }}</p></div><button @click="removeEvent(event._id)" class="text-sm font-semibold text-red-600">Delete</button></div>
                <p class="mt-2 text-sm text-slate-500">{{ event.venue || 'Venue TBA' }}<span v-if="event.time"> · {{ event.time }}</span></p>
                <p class="mt-3 text-slate-600">{{ event.description }}</p>
            </article>
        </div>
        <p v-if="!events.length" class="mt-8 text-slate-500">No events yet.</p>
    </section>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api';

const router = useRouter();
const events = ref([]);
const message = ref('');
const form = reactive({ title: '', date: '', time: '', venue: '', description: '' });
const config = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

async function load() {
    try { events.value = (await api.get('/events', { ...config(), params: { status: 'all' } })).data; }
    catch { router.push('/admin/login'); }
}
async function createEvent() {
    try { await api.post('/events', form, config()); Object.assign(form, { title: '', date: '', time: '', venue: '', description: '' }); message.value = 'Event added.'; await load(); }
    catch (error) { message.value = error.response?.data?.message || 'Unable to add event.'; }
}
async function removeEvent(id) { if (confirm('Delete this event?')) { await api.delete(`/events/${id}`, config()); await load(); } }
function formatDate(date) { return date ? new Date(date).toLocaleDateString() : 'Date TBA'; }
onMounted(load);
</script>
<style scoped>
input, textarea { width: 100%; border: 1px solid #cbd5e1; border-radius: .75rem; padding: .75rem; }
</style>
