<template>
  <div class="flex items-center justify-center h-screen flex-col">
    <div class="border border-grey-50 p-4 w-4/6">
      <div class="text-2xl">
        Contact Me
      </div>
      <form v-if="!successMessage" @submit.prevent="submitForm">
        <div class="mb-2">
          <label for="name">Name</label>
          <br>
          <input
            id="name"
            v-model="name"
            class="text-black"
            type="text"
            name="name"
            required
          >
        </div>

        <div class="mb-2">
          <label for="email">Email</label>
          <br>
          <input
            id="email"
            v-model="email"
            class="text-black"
            type="email"
            name="email"
            required
          >
        </div>

        <div class="mb-2">
          <label for="message">Message</label>
          <br>
          <textarea
            id="message"
            v-model="message"
            class="text-black min-w-full"
            name="message"
            required
          />
        </div>

        <button class="border border-grey-50 link" type="submit">
          Submit
        </button>
      </form>

      <div v-if="successMessage">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const name = ref('')
const email = ref('')
const message = ref('')
const successMessage = ref('')

function submitForm () {
  fetch('https://www.formbackend.com/f/f78470c54045bb90', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: name.value, email: email.value, message: message.value })
  })
    .then((response: { status: any, json: () => any}) => {
      if (!response.status === 422) {
        throw new Error('Validation error')
      } else if (!response.ok) {
        throw new Error('Something went wrong')
      }
      return response.json()
    })
    .then((data) => {
      // You can even use `data` here. Access `data.submission_text`, `data.values` etc.
      successMessage.value = 'Thank you for your message!'
    })
    .catch((error) => {
      throw new Error(`Something went wrong: ${error}`)
    })
}
</script>
