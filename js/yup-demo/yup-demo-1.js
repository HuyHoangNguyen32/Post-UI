import * as yup from 'yup';

/* #################################
  ! 267 - Yup basics
################################# */

(async () => {
  const schema = yup.object().shape({
    title: yup.string().required('please enter title'),
    age: yup.number().required('please enter age').min(10, 'min is 10'),
    email: yup.string().required().email('please enter a valid email'),
  });

  try {
    await schema.validate(
      {
        title: 'easy',
        age: 10,
        email: 'abc@gmail.com',
      },
      {
        abortEarly: false,
      }
    );
    console.log('data is valid');
  } catch (error) {
    console.log(error.errors);

    for (const e of error.inner) {
      console.log(e.path);
      console.log(e.message);
    }
  }
})();
