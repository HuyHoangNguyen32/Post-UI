import * as yup from 'yup';

/* ############################################
  ! 271 - handle sai kiểu dữ liệu với typeError()
############################################ */

(async () => {
  const schema = yup.object().shape({
    title: yup
      .string()
      .required('please enter title')
      .test('at-least-two-words', 'please enter at least two words', (value) => {
        // write your custom validation logic
        return !value.split(' ').filter((x) => !!x && x.length >= 3).length < 2;
      })
      .test('should-not-spam', 'please not use "spam" in title', (value) => {
        // write your custom validation logic
        return !value.includes('spam');
      }),
    age: yup.number().required('please enter age').min(10, 'min is 10').typeError('please enter a valid age'),
    email: yup.string().required().email('please enter a valid email'),
    password: yup
      .string()
      .required('please enter password')
      .min(6, 'password should be at least 6 characters long'),
    retypePassword: yup
      .string()
      .required('please enter retype password')
      .oneOf([yup.ref('password')], 'password not match'),
  });

  try {
    await schema.validate(
      {
        title: 'easy frontend',
        age: '31ddd',
        email: 'abc@gmail.com',
        password: 'hoangnguyen',
        retypePassword: 'hoangnguyen',
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
