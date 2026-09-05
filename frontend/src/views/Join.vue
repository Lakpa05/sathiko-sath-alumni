<template>
    <section class="mx-auto max-w-3xl px-5 py-16">
        <div class="text-center">
            <p class="font-semibold text-emerald-700">JOIN THE COMMUNITY</p>
            <h1 class="mt-2 text-4xl font-black">Become a SathiKo Sath Alumni</h1>
            <p class="mt-3 text-slate-600">Submit your details. Your profile will appear after administrator approval.
            </p>
        </div>
        <form @submit.prevent="submit" class="mt-10 space-y-5 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div class="grid gap-5 md:grid-cols-2"><label>First Name<input v-model="form.firstName"
                        required></label><label>Last Name<input v-model="form.lastName"></label><label>Email<input
                        type="email" v-model="form.email"></label><label>Phone<input
                        v-model="form.phone"></label><label>Batch / Year<input
                        v-model="form.batch"></label><label>Profession<input
                        v-model="form.profession"></label><label>Organization<input
                        v-model="form.organization"></label><label>Country<input
                        v-model="form.country"></label><label>City<input v-model="form.city"></label></div><label>Short
                Bio<textarea v-model="form.bio" rows="4"></textarea></label><label
                class="flex items-center gap-2"><input type="checkbox" v-model="form.privacy.showLocation"> Show my
                location in the public directory</label>
                <button
                type="submit"
                :disabled="loading"
                class="w-full rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white disabled:opacity-50"
                >
                {{ loading ? "Submitting..." : sent ? "Submitted ✓" : "Submit Registration" }}
                </button>
            <p v-if="error" class="rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {{ error }}
            </p>
        </form>
    </section>
</template>
<script setup>
import { reactive, ref } from 'vue'; import api from '../api';
const sent = ref(false); const form = reactive({ privacy: { showLocation: true } });
const error = ref("");
const loading = ref(false);

async function submit() {
  error.value = "";
  loading.value = true;

  try {
    await api.post("/api/alumni", form);
    sent.value = true;
  } catch (e) {
    console.error(e);
    error.value =
      e.response?.data?.message ||
      "Unable to submit registration. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>
<style scoped>
label {
    display: block;
    font-size: .875rem;
    font-weight: 600;
    color: #334155
}

input,
textarea {
    margin-top: .45rem;
    width: 100%;
    border: 1px solid #cbd5e1;
    border-radius: .75rem;
    padding: .75rem;
    font-weight: 400
}

input[type=checkbox] {
    margin: 0;
    width: auto
}
</style>