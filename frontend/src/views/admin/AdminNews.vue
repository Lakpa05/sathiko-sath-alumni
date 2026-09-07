<template>
    <section class="mx-auto max-w-7xl px-5 py-10">
        <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
                <p class="font-semibold text-emerald-700">ADMIN PANEL</p>
                <h1 class="mt-1 text-4xl font-black">News</h1>
            </div>
            <RouterLink to="/admin" class="rounded-xl border px-4 py-2">Back to dashboard</RouterLink>
        </div>
        <form @submit.prevent="createNews" class="mt-8 grid gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <input v-model="form.title" placeholder="News title" required>
            <input v-model="form.category" placeholder="Category">
            <textarea v-model="form.content" placeholder="News content" rows="5" required></textarea>
            <input v-model="form.author" placeholder="Author">
            <button class="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white">Publish news</button>
            <p v-if="message" class="text-sm text-emerald-700">{{ message }}</p>
        </form>
        <div class="mt-8 grid gap-4 md:grid-cols-2">
            <article v-for="item in news" :key="item._id" class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div class="flex items-start justify-between gap-4"><div><h2 class="font-bold">{{ item.title }}</h2><p class="mt-1 text-sm text-emerald-700">{{ item.category || 'Community news' }}</p></div><button @click="removeNews(item._id)" class="text-sm font-semibold text-red-600">Delete</button></div>
                <p class="mt-3 whitespace-pre-line text-slate-600">{{ item.content }}</p>
                <p v-if="item.author" class="mt-3 text-sm text-slate-500">By {{ item.author }}</p>
            </article>
        </div>
        <p v-if="!news.length" class="mt-8 text-slate-500">No news yet.</p>
    </section>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api';

const router = useRouter();
const news = ref([]);
const message = ref('');
const form = reactive({ title: '', category: '', content: '', author: '' });
const config = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

async function load() {
    try { news.value = (await api.get('/news', config())).data; }
    catch { router.push('/admin/login'); }
}
async function createNews() {
    try { await api.post('/news', form, config()); Object.assign(form, { title: '', category: '', content: '', author: '' }); message.value = 'News published.'; await load(); }
    catch (error) { message.value = error.response?.data?.message || 'Unable to publish news.'; }
}
async function removeNews(id) { if (confirm('Delete this news item?')) { await api.delete(`/news/${id}`, config()); await load(); } }
onMounted(load);
</script>
<style scoped>
input, textarea { width: 100%; border: 1px solid #cbd5e1; border-radius: .75rem; padding: .75rem; }
</style>
