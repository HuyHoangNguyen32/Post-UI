import { setFieldValue, setBackgroundImage, setTextContent, randomNumber } from './common';
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
    image: yup
      .mixed()
      .test('required', 'please select an image to upload', (file) => Boolean(file?.name))
      .test('max-1mb', 'the image is too large (max 1mb)', (file) => {
        const fileSize = file?.size || 0;
        const MAX_SIZE = 5 * 1024 * 1024;
        return fileSize <= MAX_SIZE;
      }),
    // imageUrl: yup
    //   .string()
    //   .required('please random a background image')
    //   .url('please enter a valid URL'),
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
    ['title', 'author', 'image'].forEach((name) => setFieldError(form, name, ''));

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
  // ['title', 'description', 'author', 'image'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`);
  //   if (field) formValues[name] = field.value;
  // });

  // S2 : using form data
  const data = new FormData(form);

  for (const [key, value] of data) {
    formValues[key] = value;
  }

  // console.log('Form data', formValues);

  return formValues;
}

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="description"]', formValues?.description);
  setFieldValue(form, '[name="author"]', formValues?.author);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl);
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function showLoading(form) {
  const btn = form.querySelector('[name="submit"');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Saving...';
  }
}

function hideLoading(form) {
  const btn = form.querySelector('[name="submit"');
  if (btn) {
    btn.disabled = false;
    btn.textContent = 'Save';
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage');
  if (!randomButton) return;

  randomButton.addEventListener('click', () => {
    // random ID
    // build URL
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`;

    // set image url input + background
    setFieldValue(form, '[name="imageUrl"]', imageUrl); // hidden field
    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"');
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue;
  });
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]');
  radioList.forEach((radio) => {
    radio.addEventListener('change', (e) => renderImageSourceControl(form, e.target.value));
  });
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image');
  if (!uploadImage) return;

  uploadImage.addEventListener('change', (e) => {
    console.log('selected image: ', e.target.files[0]);
    const imageUrl = URL.createObjectURL(e.target.files[0]);
    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  let submitting = false;
  setFormValues(form, defaultValues);

  // init events
  initRandomImage(form);
  initRadioImageSource(form);
  initUploadImage(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitting) {
      console.log('one is submitting');
      return;
    }

    // show loading / disabled button
    showLoading(form);
    submitting = true;

    // get form values
    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;
    // validation

    // if valid trigger submit callback

    // otherwise, show validation errors
    const idValid = await validatePostForm(form, formValues);
    if (idValid) await onSubmit?.(formValues);

    hideLoading(form);
    submitting = false;
  });
}
