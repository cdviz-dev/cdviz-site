<script setup lang="ts">
// Replaces ✅ / ❌ / ⚠️ emoji in docs tables: Lucide icon + visible text label.
// Registered globally as <Yes />, <No />, <Partial /> (.vitepress/theme/index.ts).
// The default slot overrides the label: <Yes>native</Yes>.
const props = defineProps<{ status: "yes" | "no" | "partial" }>();
const variants = {
  yes: { icon: "icon-[lucide--check]", color: "text-[var(--vp-c-success-1)]", label: "Yes" },
  no: { icon: "icon-[lucide--x]", color: "text-[var(--vp-c-danger-1)]", label: "No" },
  partial: {
    icon: "icon-[lucide--triangle-alert]",
    color: "text-[var(--vp-c-warning-1)]",
    label: "Partial",
  },
};
const v = variants[props.status];
</script>

<template>
  <span class="inline-flex items-baseline gap-1">
    <span :class='[v.icon, v.color, "h-3.5 w-3.5 shrink-0 self-center"]' aria-hidden="true"></span>
    <span><slot>{{ v.label }}</slot></span>
  </span>
</template>
