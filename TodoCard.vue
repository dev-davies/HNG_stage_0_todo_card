<template>
  <article
    data-testid="test-todo-card"
    :class="[
      'w-full max-w-[450px] bg-white rounded-2xl border border-gray-100 shadow-md',
      'flex flex-col gap-5 p-6 box-border overflow-hidden break-words',
      'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl',
      { 'opacity-80': isCompleted },
    ]"
  >

    <header class="flex items-start justify-between gap-3">
      <h2
        data-testid="test-todo-title"
        :class="[
          'm-0 text-[1.125rem] font-bold leading-snug tracking-tight text-gray-900',
          'transition-all duration-300',
          { 'line-through text-gray-400': isCompleted },
        ]"
      >
        {{ title }}
      </h2>

      <span
        data-testid="test-todo-priority"
        :class="[
          'shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full',
          'text-[0.6875rem] font-semibold tracking-widest whitespace-nowrap',
          {
            'bg-red-50   text-red-700':    priority === 'high',
            'bg-amber-50 text-amber-800':  priority === 'medium',
            'bg-green-50 text-green-800':  priority === 'low',
          },
        ]"
        :aria-label="`Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`"
      >
        {{ priority.charAt(0).toUpperCase() + priority.slice(1) }}
      </span>
    </header>

    <section class="flex flex-col gap-4">
      <p
        data-testid="test-todo-description"
        :class="[
          'm-0 text-[0.9375rem] leading-relaxed text-gray-600',
          'transition-opacity duration-300',
          { 'opacity-60': isCompleted },
        ]"
      >
        {{ description }}
      </p>

      <footer class="flex flex-wrap items-center gap-x-4 gap-y-2">
        <time
          data-testid="test-todo-due-date"
          :datetime="dueDateIso"
          class="text-[0.8125rem] font-medium text-gray-500 whitespace-nowrap"
        >
          Due: {{ formattedDueDate }}
        </time>

        <time
          data-testid="test-todo-time-remaining"
          :datetime="timeRemainingIso"
          aria-live="polite"
          class="text-[0.8125rem] font-medium text-gray-500 whitespace-nowrap"
        >
          {{ timeRemaining }}
        </time>

        <span
          data-testid="test-todo-status"
          role="status"
          :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
            'transition-all duration-300',
            {
              'bg-emerald-50 text-emerald-800': isCompleted,
              'bg-blue-50    text-blue-700':    !isCompleted,
            },
          ]"
        >
          {{ status }}
        </span>
      </footer>
    </section>

    <ul
      data-testid="test-todo-tags"
      role="list"
      aria-label="Tags"
      class="flex flex-wrap gap-1.5 list-none m-0 p-0"
    >
      <li
        v-for="tag in tags"
        :key="tag"
        :data-testid="`test-todo-tag-${tag}`"
        :class="[
          'inline-flex items-center px-3 py-1 rounded-full',
          'text-xs font-medium tracking-wide',
          'transition-all duration-150 cursor-default hover:scale-105',
          {
            'bg-blue-50 text-blue-700':      tag === 'work',
            'bg-rose-50 text-rose-700':      tag === 'urgent',
            'bg-gray-100 text-gray-700':     tag !== 'work' && tag !== 'urgent',
          },
        ]"
      >
        {{ tag }}
      </li>
    </ul>

    <div class="flex items-center gap-2.5 pt-1 border-t border-gray-100">

      <label
        :for="`todo-complete-${id}`"
        class="text-[0.8125rem] font-medium text-gray-500 cursor-pointer select-none
               transition-colors duration-150 hover:text-gray-900"
      >
        Mark as complete
      </label>

      <input
        :id="`todo-complete-${id}`"
        data-testid="test-todo-complete-toggle"
        type="checkbox"
        :checked="isCompleted"
        :aria-label="`Mark '${title}' as complete`"
        class="w-[18px] h-[18px] shrink-0 cursor-pointer accent-indigo-600 rounded
               focus-visible:outline-none focus-visible:ring-2
               focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        @change="isCompleted = !isCompleted"
      />

      <div class="ml-auto flex gap-2">
        <button
          data-testid="test-todo-edit-button"
          type="button"
          :aria-label="`Edit todo: ${title}`"
          class="inline-flex items-center justify-center px-4 py-1.5 rounded-[10px]
                 bg-gray-100 text-gray-700 text-[0.8125rem] font-semibold
                 transition-all duration-150
                 hover:bg-gray-200 hover:text-gray-900 active:scale-95
                 focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          @click="handleEdit"
        >
          Edit
        </button>

        <button
          data-testid="test-todo-delete-button"
          type="button"
          :aria-label="`Delete todo: ${title}`"
          class="inline-flex items-center justify-center px-4 py-1.5 rounded-[10px]
                 bg-red-50 text-red-700 text-[0.8125rem] font-semibold
                 transition-all duration-150
                 hover:bg-red-100 hover:text-red-800 active:scale-95
                 focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          @click="handleDelete"
        >
          Delete
        </button>
      </div>
    </div>

  </article>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  id:          { type: [String, Number], required: true },
  title:       { type: String,          required: true },
  description: { type: String,          default: '' },
  priority:    { type: String,          default: 'medium' }, 
  tags:        { type: Array,           default: () => ['work', 'urgent'] },
})


defineEmits(['toggle-complete', 'edit', 'delete'])


const isCompleted = ref(false)


const status = computed(() => (isCompleted.value ? 'Done' : 'In Progress'))


const DEADLINE = new Date('2026-04-16T18:00:00Z')

const dueDateIso       = DEADLINE.toISOString()
const formattedDueDate = DEADLINE.toLocaleDateString(undefined, {
  year:  'numeric',
  month: 'long',
  day:   'numeric',
})


const timeRemaining    = ref('')
const timeRemainingIso = ref('')


function updateTimeRemaining() {
  const nowMs       = Date.now()
  const diffMs      = DEADLINE.getTime() - nowMs
  const isOverdue   = diffMs < 0
  const absDiffMs   = Math.abs(diffMs)
  
  const diffMinutes = Math.floor(absDiffMs / 1_000 / 60)
  const diffHours   = Math.floor(diffMinutes / 60)
  const diffDays    = Math.floor(diffHours / 24)

  
  if (isOverdue) {
    timeRemainingIso.value = 'PT0S'
  } else {
    const isoHours   = diffHours   % 24
    const isoMinutes = diffMinutes % 60
    timeRemainingIso.value = `P${diffDays}DT${isoHours}H${isoMinutes}M`
  }

  if (diffMinutes < 1) {
    timeRemaining.value = 'Due now!'
  } else if (isOverdue) {
    if (diffHours < 1) {
      timeRemaining.value = `Overdue by ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`
    } else if (diffDays < 1) {
      timeRemaining.value = `Overdue by ${diffHours} hour${diffHours === 1 ? '' : 's'}`
    } else {
      timeRemaining.value = `Overdue by ${diffDays} day${diffDays === 1 ? '' : 's'}`
    }
  } else {
    if (diffHours < 1) {
      timeRemaining.value = `Due in ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`
    } else if (diffDays < 1) {
      timeRemaining.value = `Due in ${diffHours} hour${diffHours === 1 ? '' : 's'}`
    } else if (diffDays === 1) {
      timeRemaining.value = 'Due tomorrow'
    } else {
      timeRemaining.value = `Due in ${diffDays} days`
    }
  }
}

let intervalId = null

onMounted(() => {
  updateTimeRemaining()                                    
  intervalId = setInterval(updateTimeRemaining, 60_000)  
})

onUnmounted(() => {
  clearInterval(intervalId)   
})

function handleEdit() {
  console.log('Edit clicked')
}

function handleDelete() {
  alert('Delete clicked')
}
</script>
