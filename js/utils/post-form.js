import { setFieldValue, setBackgroundImage, setTextContent } from './common';
import * as yup from 'yup';

// function getTitleError(form) {
//   const titleElement = form.querySelector('[name="title"]');
//   if (!titleElement) return;

//   // required
//   if (titleElement.validity.valueMissing) return 'Please enter title';

//   // at least two words
//   if (titleElement.value.split(' ').filter((x) => !!x && x.length >= 3).length < 2) {
//     return 'Please enter at least two words of 3 characters';
//   }

//   return '';
// }

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('please enter title'),
    author: yup
      .string()
      .required('please enter author')
      .test(
        'at-least-two-words',
        'please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

async function validatePostForm(form, formValues) {
  // get errors
  // const errors = {
  //   title: getTitleError(form),
  // };

  // // set errors
  // for (const key in errors) {
  //   const element = form.querySelector(`[name="${key}"]`);
  //   if (element) {
  //     element.setCustomValidity(errors[key]);
  //     setTextContent(element.parentElement, '.invalid-feedback', errors[key]);
  //   }
  // }

  try {
    // reset previous errors
    ['title', 'author'].forEach((name) => setFieldError(form, name, ''));

    // start validation
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    console.log(error.name);
    console.log(error.inner);

    const errorLog = {};

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        // ignore if the field is already logged
        if (errorLog[name]) continue;

        // set field error and mark as logged
        setFieldError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');

  return isValid;
}

function getFormValues(form) {
  const formValues = {};

  // S1 : query each input and add to values object
  // ['title', 'description', 'author', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`);
  //   if (field) formValues[name] = field.value;
  // });

  // S2 : using form data
  const data = new FormData(form);

  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="description"]', formValues?.description);
  setFieldValue(form, '[name="author"]', formValues?.author);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl);
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  setFormValues(form, defaultValues);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // get form values
    const formValues = getFormValues(form);
    // validation

    // if valid trigger submit callback

    // otherwise, show validation errors
    if (!validatePostForm(form, formValues)) return;
  });
}