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
import InputNumber from 'primevue/inputnumber'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Password from 'primevue/password'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import Menu from 'primevue/menu'
import Calendar from 'primevue/calendar'
import CascadeSelect from 'primevue/cascadeselect'

const app = createApp(App as never)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('Card', Card)
app.component('Button', Button)
app.component('Password', Password)
app.component('Message', Message)
app.component('Toast', Toast)
app.component('TabMenu', TabMenu)
app.component('Menu', Menu)
app.component('Calendar', Calendar)
app.component('CascadeSelect', CascadeSelect)

app
  .provide(DefaultApolloClient, apolloClient)
  .use(store)
  .use(router)
  .use(PrimeVue)
  .use(ToastService)
  .mount('#app')
app.config.globalProperties.$primevue = { ripple: true, config: { locale } }
