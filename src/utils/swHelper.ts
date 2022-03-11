function base64ToUint8Array(base64: any) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(b64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export async function register() {
  if ('serviceWorker' in navigator) {
    try {
      window.addEventListener('load', async function () {
        await navigator.serviceWorker.register('/sw.js')
      })
    } catch (err) {
      console.error(err)
    }
  }
}

// todo not implemented yet
export async function unregister() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.unregister()
    } catch (err) {
      console.error(err)
    }
  }
}

export async function subscribe(): Promise<PushSubscription | null> {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY),
      })
      console.log('web push subscribed')
      return subscription
    } catch (err) {
      console.error(err)
      return null
    }
  }
  return null
}

export async function unsubscribe() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        console.log('web push unsubscribed')
      }
    } catch (err) {
      console.error(err)
    }
  }
}

// todo delete?
export async function checkSubscription(): Promise<PushSubscription | null> {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      return subscription
    } catch (err) {
      console.error(err)
      return null
    }
  }
  return null
}
