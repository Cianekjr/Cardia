import { setLocale } from 'yup'

interface namesInterface {
  [key: string]: string[]
}

const names: namesInterface = {
  znak: ['znak', 'znaki', 'znaków']
}

const plural = (key: string, count: number) => {
  switch (true) {
    case (count === 1):
      return names[key][0]
    case (count < 5):
      return names[key][1]
    default:
      return names[key][2]
  }
}

setLocale({
  mixed: {
    default: 'To pole jest wymagane',
    required: 'To pole jest wymagane'
  },
  number: {},
  string: {
    min: ({ min }: { min: number }) => `Wpisz minimum ${min} ${plural('znak', min)}`,
    max: ({ max }: { max: number }) => `Maksymalna długość to ${max} ${plural('znak', max)}`,
    email: 'Nieprawidłowy format'
  }
})
