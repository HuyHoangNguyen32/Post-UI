import { setFieldValue, setBackgroundImage } from './common';

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="description"]', formValues?.description);
  setFieldValue(form, '[name="author"]', formValues?.author);
  
  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl);
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);

  // const title = form.querySelector('[name="title"]');
  // title.value = formValues.title;

  // const description = form.querySelector('[name="description"]');
  // description.value = formValues.description;
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  setFormValues(form, defaultValues);
}
