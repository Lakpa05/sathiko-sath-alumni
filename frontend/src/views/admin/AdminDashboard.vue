<template>
    <section class="mx-auto max-w-7xl px-5 py-10">
        <div class="flex items-center justify-between">
            <div>
                <p class="font-semibold text-emerald-700">ADMIN PANEL</p>
                <h1 class="mt-1 text-4xl font-black">Dashboard</h1>
            </div><button @click="logout" class="rounded-xl border px-4 py-2">Logout</button>
        </div>
        <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="s in statsCards" :key="s.label"
                class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div class="text-3xl font-black">{{ s.value }}</div>
                <div class="mt-1 text-sm text-slate-500">{{ s.label }}</div>
            </div>
        </div>
        <div class="mt-10 grid gap-5 md:grid-cols-2">
            <RouterLink to="/admin/alumni" class="rounded-2xl bg-emerald-700 p-7 text-white"><b class="text-xl">Manage
                    Alumni →</b>
                <p class="mt-2 text-emerald-50">Approve registrations, edit profiles and manage directory members.</p>
            </RouterLink>
            <div class="rounded-2xl bg-white p-7 ring-1 ring-slate-200"><b class="text-xl">Next modules</b>
                <p class="mt-2 text-slate-600">Events, news, gallery, stories, messages and website settings.</p>
            </div>
        </div>
    </section>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'; import api from '../../api'; import { useRouter } from 'vue-router'; const router = useRouter(); const stats = ref({}); const statsCards = computed(() => [{ label: 'Approved Alumni', value: stats.value.totalAlumni || 0 }, { label: 'Pending Registrations', value: stats.value.pendingAlumni || 0 }, { label: 'Events', value: stats.value.totalEvents || 0 }, { label: 'News', value: stats.value.totalNews || 0 }]);
onMounted(async () => { try { const { data } = await api.get('/dashboard/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }); stats.value = data } catch { router.push('/admin/login') } }); function logout() { localStorage.removeItem('token'); router.push('/admin/login') }
</script>