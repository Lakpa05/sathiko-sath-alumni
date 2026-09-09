<template>
    <section class="mx-auto max-w-7xl px-5 py-10">
        <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
                <p class="font-semibold text-emerald-700">MANAGEMENT</p>
                <h1 class="mt-1 text-4xl font-black">Alumni</h1>
                <p class="mt-2 text-sm text-slate-500">Review every registration, including duplicates and rejected entries.</p>
            </div>
            <div class="flex flex-wrap gap-3">
                <button @click="exportAlumni" class="rounded-xl bg-emerald-700 px-4 py-2 font-semibold text-white">Export Excel</button>
                <RouterLink to="/join" class="rounded-xl border px-4 py-2">Public Registration</RouterLink>
            </div>
        </div>
        <div class="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <table class="w-full min-w-[1600px] text-center text-sm">
                <thead class="bg-slate-50">
                    <tr>
                        <th v-for="heading in headings" :key="heading" class="p-4">{{ heading }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="a in alumni" :key="a._id" class="border-t">
                        <td class="p-4 font-semibold">{{ display(a.firstName) }} {{ display(a.lastName) }}</td>
                        <td class="p-4"><img v-if="a.photo" :src="a.photo" alt="" class="mx-auto h-10 w-10 rounded-full object-cover" /><span v-else>—</span></td>
                        <td class="p-4">{{ display(a.email) }}</td>
                        <td class="p-4">{{ display(a.phone) }}</td>
                        <td class="p-4">{{ display(a.batch) }}</td>
                        <td class="p-4">{{ display(a.profession) }}</td>
                        <td class="p-4">{{ display(a.organization) }}</td>
                        <td class="p-4">{{ display(a.city) }}, {{ display(a.country) }}</td>
                        <td class="max-w-xs whitespace-normal p-4">
                            <span>{{ textPreview(a.bio, `${a._id}-bio`) }}</span>
                            <button v-if="hasMore(a.bio)" @click="toggleText(`${a._id}-bio`)" class="ml-2 font-semibold text-emerald-700">
                                {{ isExpanded(`${a._id}-bio`) ? 'Show less' : 'Read more' }}
                            </button>
                        </td>
                       <td class="p-4"><span class="rounded-full bg-slate-100 px-3 py-1">{{ a.status }}</span></td>
                        <td class="p-4">{{ formatDate(a.createdAt) }}</td>
                        <td class="p-4"><div class="flex justify-center gap-3 whitespace-nowrap">
                            <button v-if="a.status !== 'approved'" @click="changeStatus(a._id, 'approved')" class="font-bold text-emerald-700">Approve</button>
                            <button v-if="a.status !== 'rejected'" @click="changeStatus(a._id, 'rejected')" class="font-bold text-amber-700">Reject</button>
                            <button @click="remove(a._id)" class="text-red-600">Delete</button>
                        </div></td>
                    </tr>
                    <tr v-if="!alumni.length"><td colspan="14" class="p-8 text-slate-500">No alumni registrations found.</td></tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api';
import { useRouter } from 'vue-router';
import * as XLSX from 'xlsx';

const router = useRouter();
const alumni = ref([]);
const expandedText = ref(new Set());
const headings = ['Name', 'Photo', 'Email', 'Phone', 'Batch', 'Profession', 'Organization', 'Location', 'Bio', 'Social Links', 'Privacy', 'Status', 'Registered', 'Action'];
const config = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

function display(value) { return value || '—'; }
function formatDate(value) { return value ? new Date(value).toLocaleString() : '—'; }
function hasMore(value) { return Boolean(value && value.length > 90); }
function isExpanded(key) { return expandedText.value.has(key); }
function toggleText(key) {
    const next = new Set(expandedText.value);
    next.has(key) ? next.delete(key) : next.add(key);
    expandedText.value = next;
}
function textPreview(value, key) {
    const text = display(value);
    return !isExpanded(key) && text.length > 90 ? `${text.slice(0, 90)}…` : text;
}
function socialLinks(alumnus) {
    return Object.entries(alumnus.socialLinks || {}).filter(([, value]) => value).map(([key, value]) => `${key}: ${value}`).join(' | ') || '—';
}
function privacyDetails(alumnus) {
    const privacy = alumnus.privacy || {};
    return `Email: ${privacy.showEmail ? 'shown' : 'hidden'} | Phone: ${privacy.showPhone ? 'shown' : 'hidden'} | Location: ${privacy.showLocation ? 'shown' : 'hidden'}`;
}
async function load() {
    try { alumni.value = (await api.get('/alumni/admin/all', config())).data; }
    catch { router.push('/admin/login'); }
}
async function changeStatus(id, status) {
    await api.patch(`/alumni/${id}/status`, { status }, config());
    await load();
}
async function remove(id) {
    if (confirm('Delete this alumni?')) { await api.delete(`/alumni/${id}`, config()); await load(); }
}
function exportAlumni() {
    const columns = ['First Name', 'Last Name', 'Photo URL', 'Email', 'Phone', 'Batch', 'Profession', 'Organization', 'City', 'Country', 'Bio', 'Facebook', 'LinkedIn', 'Instagram', 'Email Visible', 'Phone Visible', 'Location Visible', 'Status', 'Registered At'];
    const rows = alumni.value.map((a) => [a.firstName, a.lastName, a.photo, a.email, a.phone, a.batch, a.profession, a.organization, a.city, a.country, a.bio, a.socialLinks?.facebook, a.socialLinks?.linkedin, a.socialLinks?.instagram, a.privacy?.showEmail ? 'Yes' : 'No', a.privacy?.showPhone ? 'Yes' : 'No', a.privacy?.showLocation ? 'Yes' : 'No', a.status, formatDate(a.createdAt)]);
    const worksheet = XLSX.utils.aoa_to_sheet([columns, ...rows]);
    worksheet['!cols'] = columns.map((column, index) => ({ wch: index === 10 ? 45 : Math.min(Math.max(column.length + 2, 14), 28) }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alumni');
    XLSX.writeFile(workbook, `alumni-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
onMounted(load);
</script>