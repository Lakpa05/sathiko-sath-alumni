<template>
<div>
<header class="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
  <nav class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
    <RouterLink to="/" class="flex items-center gap-3"><div class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 font-bold text-white">SS</div><div><b class="block">SathiKo Sath</b><span class="text-xs text-slate-500">Alumni</span></div></RouterLink>
    <div class="hidden gap-6 md:flex text-sm font-medium"><RouterLink to="/">Home</RouterLink><RouterLink to="/alumni">Alumni</RouterLink><RouterLink to="/events">Events</RouterLink><RouterLink to="/join">Join Us</RouterLink><RouterLink to="/admin/login">Admin</RouterLink></div>
    <RouterLink to="/join" class="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Join Alumni</RouterLink>
  </nav>
</header>
<main><RouterView/></main>
<footer class="mt-20 bg-slate-950 px-5 py-12 text-slate-300"><div class="mx-auto max-w-7xl"><b class="text-white">SathiKo Sath Alumni</b><p class="mt-2 max-w-xl text-sm">Reconnect • Remember • Inspire • Give Back</p><p class="mt-8 text-xs text-slate-500">© 2026 SathiKo Sath Alumni. All rights reserved.</p></div></footer>
</div>
</template>