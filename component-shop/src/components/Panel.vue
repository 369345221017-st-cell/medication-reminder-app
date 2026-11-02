<template>
  <section class="panel">
    <header class="panel-head">
      <slot name="header"></slot>
    </header>
    <div class="panel-body">
      <slot></slot>
    </div>
    <footer v-if="$slots.footer" class="panel-foot">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>

<style scoped>
.panel {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  background-color: #FFFFFF;
}

.panel-head {
  background-color: #008577;
  color: #FFFFFF;
  padding: 10px 16px;
  font-weight: bold;
  font-size: 0.95em;
  text-align: center;
}

.panel-body {
  padding: 16px;
  text-align: center;
  background-color: #FFFCF7;
  color: #4B5563;
  font-size: 0.9em;
}

.panel-foot {
  border-top: 1px solid #E5E7EB;
  padding: 8px 16px;
  background-color: #FFFCF7;
  font-size: 0.8em;
  color: #6B7280;
  text-align: center;
}
</style>