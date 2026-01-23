'use client'

import { Provider } from 'react-redux'
import store from './store'
import { PopupProvider } from './popupContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
    <PopupProvider>

      {children}

    </PopupProvider>
    </Provider>
}
