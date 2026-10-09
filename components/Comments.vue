<!-- see https://aiktb.dev/blog/giscus-with-vitepress -- for more details -->
<script setup lang="ts">
import { useData } from "vitepress";

const { frontmatter, title } = useData();
</script>

<!-- setup made with https://giscus.app/ -->
<template>
  <div :key="title" class="giscus" v-if="frontmatter.comments !== false">
    <component
      :is='"script"'
      src="https://giscus.app/client.js"
      data-repo="cdviz-dev/cdviz-site"
      data-repo-id="R_kgDOVCDSKQ"
      data-category="Announcements"
      data-category-id="DIC_kwDOVCDSKc4DHZNS"
      data-mapping="pathname"
      data-strict="0"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="top"
      data-lang="en"
      data-theme="transparent_dark"
      data-loading="lazy"
      async
    />
  </div>
</template>
