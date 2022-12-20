export const WATCH_STATUS_OPTIONS = ['plan_to_watch', 'watching', 'dropped', 'completed', 'on_hold']

export const WATCH_STATUS_DISPLAY_NAME: Record<string, string> = {
  plan_to_watch: '待看',
  watching: '追梗',
  dropped: '棄番',
  completed: '看完',
  on_hold: '暫停',
}

export const WATCH_STATUS_COLOR: Record<string, string> = {
  plan_to_watch: 'green',
  watching: 'green',
  dropped: 'red.500',
  completed: 'blue.500',
  on_hold: 'yellow.300',
}