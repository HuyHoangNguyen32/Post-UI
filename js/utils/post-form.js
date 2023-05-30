import { setFieldValue, setBackgroundImage } from './common';

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="description"]', formValues?.description);
  setFieldValue(form, '[name="author"]', formValues?.author);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl);
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
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

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  setFormValues(form, defaultValues);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // get form values
    const formValues = getFormValues(form);
    console.log('formValues', formValues);
    // validation

    // if valid trigger submit callback

    // otherwise, show validation errors
  });
}
