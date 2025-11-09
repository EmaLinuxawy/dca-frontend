import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { strategiesApi } from '@/api/strategies'
import type { Strategy, StrategyCreate, StrategyUpdate } from '@/api/types'
import { storeAction } from './utils'

export const useStrategiesStore = defineStore('strategies', () => {
  const strategies = ref<Strategy[]>([])
  const currentStrategy = ref<Strategy | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const enabledStrategies = computed(() =>
    strategies.value.filter((s) => s.enabled)
  )

  const disabledStrategies = computed(() =>
    strategies.value.filter((s) => !s.enabled)
  )

  const fetchAll = () => storeAction(isLoading, error, async () => {
    strategies.value = await strategiesApi.getAll()
  }, 'Failed to fetch strategies')

  const fetchById = (id: number) => storeAction(isLoading, error, async () => {
    currentStrategy.value = await strategiesApi.getById(id)
    return currentStrategy.value
  }, 'Failed to fetch strategy')

  const create = (data: StrategyCreate) => storeAction(isLoading, error, async () => {
    const strategy = await strategiesApi.create(data)
    strategies.value.push(strategy)
    return strategy
  }, 'Failed to create strategy')

  const update = (id: number, data: StrategyUpdate) => storeAction(isLoading, error, async () => {
    const updated = await strategiesApi.update(id, data)
    const index = strategies.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      strategies.value[index] = updated
    }
    if (currentStrategy.value?.id === id) {
      currentStrategy.value = updated
    }
    return updated
  }, 'Failed to update strategy')

  const remove = (id: number) => storeAction(isLoading, error, async () => {
    await strategiesApi.delete(id)
    strategies.value = strategies.value.filter((s) => s.id !== id)
    if (currentStrategy.value?.id === id) {
      currentStrategy.value = null
    }
  }, 'Failed to delete strategy')

  const pause = (id: number) => storeAction(isLoading, error, async () => {
    const updated = await strategiesApi.pause(id)
    const index = strategies.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      strategies.value[index] = updated
    }
    return updated
  }, 'Failed to pause strategy')

  const resume = (id: number) => storeAction(isLoading, error, async () => {
    const updated = await strategiesApi.resume(id)
    const index = strategies.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      strategies.value[index] = updated
    }
    return updated
  }, 'Failed to resume strategy')

  const runNow = (id: number) => storeAction(isLoading, error, async () => {
    const result = await strategiesApi.runNow(id)
    // Refresh strategy after running
    await fetchById(id)
    return result
  }, 'Failed to run strategy')

  return {
    strategies,
    currentStrategy,
    isLoading,
    error,
    enabledStrategies,
    disabledStrategies,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    pause,
    resume,
    runNow,
  }
})

