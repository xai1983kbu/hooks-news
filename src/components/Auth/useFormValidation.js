import React from 'react'

function useFormValidation (initialState, validate, authenticate) {
  const [values, setValues] = React.useState(initialState)
  const [errors, setErrors] = React.useState({})
  const [isSubmitting, setSubmitting] = React.useState(false)

  React.useEffect(
    () => {
      console.log('in useEffect')
      if (isSubmitting) {
        const noErrors = Object.keys(errors).length === 0
        if (noErrors) {
          authenticate()
          setSubmitting(false)
        } else {
          setSubmitting(false)
        }
      }
    },
    [errors]
  )

  function handleChange (event) {
    event.persist()
    setValues(previousValues => ({
      ...previousValues,
      [event.target.name]: event.target.value
    }))
    console.log(event.target.name, event.target.value)
  }

  function handleBlur () {
    const validationErrors = validate(values)
    setErrors(validationErrors)
    console.log(validationErrors)
  }

  function handleSubmit (event) {
    event.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    setSubmitting(true)
  }

  return {
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    errors,
    isSubmitting
  }
}

export default useFormValidation
