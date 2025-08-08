import { ref, computed } from 'vue'

interface UseModalOptions {
  defaultOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
}

interface UseModalReturn {
  isOpen: Ref<boolean>
  open: () => void
  close: () => void
  toggle: () => void
}

export function useModal(options: UseModalOptions = {}): UseModalReturn {
  const isOpen = ref(options.defaultOpen || false)

  const open = () => {
    isOpen.value = true
    options.onOpen?.()
  }

  const close = () => {
    isOpen.value = false
    options.onClose?.()
  }

  const toggle = () => {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  return {
    isOpen,
    open,
    close,
    toggle,
  }
} 