<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      statusClasses
    ]"
  >
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

const props = defineProps<Props>()

const statusText = computed(() => {
  const texts = {
    pending: '待处理',
    processing: '处理中',
    shipped: '已发货',
    delivered: '已送达',
    cancelled: '已取消'
  }
  return texts[props.status]
})

const statusClasses = computed(() => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[props.status]
})
</script> 