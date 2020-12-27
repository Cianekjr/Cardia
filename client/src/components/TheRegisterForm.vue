<template>
  <Card class="p-col-10 p-sm-8 p-lg-6 p-xl-4">
    <template #title>
      <h1 class="login-title p-text-center p-d-block">Zarejestruj się!</h1>
    </template>
    <template #content>
      <form @submit.prevent="onSubmit">
        <div class="p-field p-mb-2 p-fluid">
          <label for="email">Nazwa stacji</label>
          <InputText
            v-model="name"
            id="name"
            aria-describedby="name-help"
            :class="nameError ? 'p-invalid' : ''"
            class="p-d-block"
          />
          <small v-if="nameError" id="name-help" class="p-invalid">{{ nameError }}</small>
        </div>
        <div class="p-field p-mb-4 p-fluid">
          <label for="email">Adres email</label>
          <InputText
            v-model="email"
            id="email"
            aria-describedby="email-help"
            :class="emailError ? 'p-invalid' : ''"
            class="p-d-block"
          />
          <small v-if="emailError" id="email-help" class="p-invalid">{{ emailError }}</small>
        </div>
        <div class="p-field p-mb-4 p-fluid">
          <label for="email">Hasło</label>
          <Password
            v-model="password"
            id="password"
            aria-describedby="password-help"
            :class="passwordError ? 'p-invalid' : ''"
            class="p-d-block"
            :feedback="false"
          />
          <small v-if="passwordError" id="password-help" class="p-invalid">{{ passwordError }}</small>
        </div>
        <Message v-if="messageText" severity="error" :closable="false">{{ messageText }}</Message>
        <Button label="Zarejestruj" :disabled="!meta.valid" type="submit" :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'" iconPos="right" />
      </form>
    </template>
    <template #footer>
      <router-link :to="{ name: 'Login' }" class="p-button p-button-text p-button-plain p-mx-auto p-d-block">
        Masz już konto? <span class="p-text-bold">Zaloguj się!</span>
      </router-link>
    </template>
  </Card>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'

export default ({
  setup () {
    const { push } = useRouter()
    const { handleSubmit, meta } = useForm({
      initialValues: {
        name: '',
        email: '',
        password: ''
      }
    })
    const toast = useToast()
    const messageText = ref('')
    const { value: name, errorMessage: nameError } = useField('name', yup.string().required())
    const { value: email, errorMessage: emailError } = useField('email', yup.string().required().email())
    const { value: password, errorMessage: passwordError } = useField('password', yup.string().required().min(6))

    const { mutate: signIn, loading } = useMutation(gql`
      mutation signUp ($input: SignUpInput!) {
        signUp (input: $input) {
          id
          email
          name
        }
      }
    `)

    const onSubmit = handleSubmit(async (values) => {
      try {
        const user = await signIn({ input: values })
        const name = user?.data?.signUp?.name
        await push({ name: 'Home' })
        toast.add({ severity: 'success', summary: 'Witaj!', detail: name, life: 4000 })
      } catch (e) {
        if (e.message === 'Email already in use') {
          messageText.value = 'Stacja z podanym adresem email już istnieje'
        } else if (e.message === 'Name already in use') {
          messageText.value = 'Stacja z podaną nazwą już istnieje'
        } else if (e.message) {
          toast.add({ severity: 'error', summary: 'Błąd!', detail: 'Nieoczekiwany błąd! Skontaktuj się z administratorem', life: 4000 })
        } else {
          messageText.value = ''
        }
      }
    })

    return {
      name,
      nameError,
      email,
      emailError,
      password,
      passwordError,
      onSubmit,
      meta,
      loading,
      messageText
    }
  }
})

</script>

<style scoped lang="scss">
.login-title {
  font-size: 1.2em;
}
</style>
