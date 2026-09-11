<template>
    <section class="mx-auto max-w-7xl px-5 py-10">
        <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
                <p class="text-sm font-semibold tracking-wide text-emerald-700">ADMIN PANEL</p>
                <h1 class="mt-1 text-4xl font-black text-slate-900">Events</h1>
            </div>
            <RouterLink to="/admin" class="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-600 transition hover:bg-slate-50">
                Back to dashboard
            </RouterLink>
        </div>

        <!-- Create form -->
        <form @submit.prevent="createEvent" class="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 class="text-lg font-bold text-slate-900">Add a new event</h2>

            <div class="mt-5 grid gap-4 md:grid-cols-2">
                <label class="block">
                    <span class="mb-1 block text-sm font-medium text-slate-600">Title</span>
                    <input v-model="form.title" placeholder="Event title" required
                        class="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
                </label>

                <label class="block">
                    <span class="mb-1 block text-sm font-medium text-slate-600">Date</span>
                    <input v-model="form.date" type="date"
                        class="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
                </label>

                <label class="block">
                    <span class="mb-1 block text-sm font-medium text-slate-600">Time</span>
                    <input v-model="form.time" placeholder="e.g. 10:00 AM"
                        class="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
                </label>

                <label class="block">
                    <span class="mb-1 block text-sm font-medium text-slate-600">Venue</span>
                    <input v-model="form.venue" placeholder="Venue"
                        class="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
                </label>

                <label class="block md:col-span-2">
                    <span class="mb-1 block text-sm font-medium text-slate-600">Description</span>
                    <textarea v-model="form.description" placeholder="Description" rows="3"
                        class="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"></textarea>
                </label>

                <label class="block md:col-span-2">
                    <span class="mb-1 block text-sm font-medium text-slate-600">Image link</span>
                    <input v-model="form.imageUrl" type="url" placeholder="https://example.com/event-image.jpg"
                        class="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
                </label>

                <!-- Photo upload -->
                <div class="md:col-span-2">
                    <span class="mb-1 block text-sm font-medium text-slate-600">Cover photo</span>
                    <div
                        class="flex items-center gap-4 rounded-xl border-2 border-dashed border-slate-300 p-4 transition hover:border-emerald-400"
                        @dragover.prevent @drop.prevent="onDrop">
                        <div v-if="preview || form.imageUrl" class="h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <img :src="preview || form.imageUrl" alt="Preview" class="h-full w-full object-cover">
                        </div>
                        <div v-else class="flex h-20 w-32 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 8.25 12 3.75m0 0L7.5 8.25M12 3.75v12" />
                            </svg>
                        </div>
                        <div class="text-sm">
                            <label class="cursor-pointer font-semibold text-emerald-700 hover:underline">
                                {{ preview ? 'Change photo' : 'Upload a photo' }}
                                <input type="file" accept="image/*" class="hidden" @change="onFileChange">
                            </label>
                            <p class="mt-1 text-slate-400">PNG or JPG, drag & drop supported</p>
                            <button v-if="preview" type="button" @click="clearPhoto" class="mt-1 text-red-600 hover:underline">Remove</button>
                        </div>
                    </div>
                </div>

                <button :disabled="submitting"
                    class="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60 md:col-span-2">
                    {{ submitting ? 'Adding…' : 'Add event' }}
                </button>
                <p v-if="message" :class="isError ? 'text-red-600' : 'text-emerald-700'" class="text-sm font-medium md:col-span-2">
                    {{ message }}
                </p>
            </div>
        </form>

        <!-- Events grid -->
        <div class="mt-8 grid gap-5 md:grid-cols-2">
            <article v-for="event in events" :key="event._id"
                class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
                <div class="h-40 w-full bg-slate-100">
                    <img v-if="event.image" :src="event.image" :alt="event.title" class="h-full w-full object-cover">
                    <div v-else class="flex h-full items-center justify-center text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 4.5h18M3.75 4.5v15a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-15" />
                        </svg>
                    </div>
                </div>
                <div class="p-5">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h2 class="font-bold text-slate-900">{{ event.title }}</h2>
                            <p class="mt-1 text-sm font-medium text-emerald-700">{{ formatDate(event.date) }}</p>
                        </div>
                        <button @click="removeEvent(event._id)" class="shrink-0 text-sm font-semibold text-red-600 hover:underline">
                            Delete
                        </button>
                    </div>
                    <p class="mt-2 text-sm text-slate-500">
                        {{ event.venue || 'Venue TBA' }}<span v-if="event.time"> · {{ event.time }}</span>
                    </p>
                    <p class="mt-3 text-slate-600">{{ event.description }}</p>
                </div>
            </article>
        </div>
        <p v-if="!events.length" class="mt-8 text-center text-slate-500">No events yet.</p>
    </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api';

const router = useRouter();
const events = ref([]);
const message = ref('');
const isError = ref(false);
const submitting = ref(false);
const preview = ref(null);
const photoFile = ref(null);

const form = reactive({ title: '', date: '', time: '', venue: '', description: '', imageUrl: '' });
const config = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

async function load() {
    try {
        events.value = (await api.get('/events', { ...config(), params: { status: 'all' } })).data;
    } catch {
        router.push('/admin/login');
    }
}

function onFileChange(e) {
    const file = e.target.files[0];
    if (file) setPhoto(file);
}

function onDrop(e) {
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) setPhoto(file);
}

function setPhoto(file) {
    photoFile.value = file;
    preview.value = URL.createObjectURL(file);
}

function clearPhoto() {
    photoFile.value = null;
    preview.value = null;
}

async function createEvent() {
    submitting.value = true;
    isError.value = false;
    try {
        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => data.append(key, value));
        if (photoFile.value) data.append('image', photoFile.value);

        await api.post('/events', data, {
            headers: { ...config().headers, 'Content-Type': 'multipart/form-data' },
        });

        Object.assign(form, { title: '', date: '', time: '', venue: '', description: '', imageUrl: '' });
        clearPhoto();
        message.value = 'Event added.';
        await load();
    } catch (error) {
        isError.value = true;
        message.value = error.response?.data?.message || 'Unable to add event.';
    } finally {
        submitting.value = false;
    }
}

async function removeEvent(id) {
    if (confirm('Delete this event?')) {
        await api.delete(`/events/${id}`, config());
        await load();
    }
}

function formatDate(date) {
    return date ? new Date(date).toLocaleDateString() : 'Date TBA';
}

onMounted(load);
</script>