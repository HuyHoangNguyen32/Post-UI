import * as yup from 'yup';

/* #################################
  ! 268 - Custom logic with test()
################################# */
(async () => {
  const schema = yup.object().shape({
    title: yup
      .string()
      .required('please enter title')
      .test('at-least-two-words', 'please enter at least two words', (value) => {
        // write your custom validation logic
        return value.split(' ').filter((x) => !!x && x.length >= 3).length < 2;
      })
      .test('should-not-spam', 'please not use "spam" in title', (value) => {
        // write your custom validation logic
        return !value.includes('spam');
      }),
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