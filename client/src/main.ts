import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from '@/plugins/ApolloClient'
import '@/plugins/yupLocales'
import PrimeVue from 'primevue/config'
import locale from '@/modules/primeLocales'
import 'primevue/resources/themes/vela-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import TabMenu from 'primevue/tabmenu'
import ToastService from 'primevue/toastservice'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Password from 'primevue/password'
import Message from 'primevue/message'
import Toast from 'primevue/toast'

const app = createApp(App as never)
app.component('InputText', InputText)
app.component('Card', Card)
app.component('Button', Button)
app.component('Password', Password)
app.component('Message', Message)
app.component('Toast', Toast)
app.component('TabMenu', TabMenu)

app
  .provide(DefaultApolloClient, apolloClient)
  .use(store)
  .use(router)
  .use(PrimeVue, { locale })
  .use(ToastService)
  .mount('#app')
app.config.globalProperties.$primevue = { ripple: true }
