import { visualizer } from 'rollup-plugin-visualizer'

export function createVisualizerConfig() {
  return visualizer({
    filename: 'dist/stats.html',
    open: true,
    gzipSize: true,
    brotliSize: true,
  })
} 