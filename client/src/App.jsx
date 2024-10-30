import { userService } from './services/userService.js';
import { Formik, Form, Field } from 'formik';
import { useContext, useEffect } from 'react';
import { Context } from './context/context.jsx';
import { ChatBlock } from './pages/ChatsBlock.jsx';

function nicknameValidation(nickname) {
  if (!nickname || nickname.trim().length === 0) {
    return 'Nickname required';
  }

  if (nickname.trim().length < 2) {
    return 'Nickname is too short';
  }

  if (nickname.trim().includes(' ')) {
    return 'One word reqiured';
  }
}

export const App = () => {
  const { user, setUser, setAnyError, setAllChats } = useContext(Context);

  useEffect(() => {
    const storedUser = localStorage.getItem('nickname');
    setUser(storedUser);
  }, []);

  useEffect(() => {
    userService
      .getAllChats()
      .then(setAllChats)
      .catch((error) => {
        if (error.message) {
          setAnyError(error.message);
        }

        if (!error.response?.data) {
          return;
        }

        const { message } = error.response.data;

        if (message) {
          setAnyError(message);
        }
      });
  }, []);

  return (
    <>
      <div className='flex flex-col items-center'>
        <h1>Welcome to Node Chat</h1>

        <div className='mb-4'>
          <Formik
            initialValues={{ nickname: '' }}
            validateOnMount={true}
            onSubmit={({ nickname }, formikHelpers) => {
              formikHelpers.setSubmitting(true);
              formikHelpers.resetForm();
              localStorage.setItem('nickname', nickname);
              setUser(nickname);

              userService
                .login({ nickname })
                .catch((error) => {
                  if (error.message) {
                    setAnyError(error.message);
                  }

                  if (!error.response?.data) {
                    return;
                  }

                  const { errors, message } = error.response.data;

                  formikHelpers.setFieldError('nickname', errors?.nickname);

                  if (message) {
                    setAnyError(message);
                  }
                })
                .finally(() => formikHelpers.setSubmitting(false));
            }}
          >
            {({ touched, errors, isSubmitting, resetForm, values }) => (
              <Form className='flex flex-col items-center'>
                <h4>Enter yout nickname for start</h4>

                <div className='h-8 mb-1'>
                  <div className='h-full'>
                    <Field
                      className='h-full rounded-xl p-2 mb-1'
                      validate={nicknameValidation}
                      name='nickname'
                      type='text'
                      id='nickname'
                      placeholder='userX'
                    />
                  </div>

                  {touched.nickname &&
                    errors.nickname &&
                    setAnyError(errors.nickname)}
                </div>

                <div className='h-8'>
                  <button
                    className='w-20 h-full mr-4 bg-green-500'
                    type='submit'
                    disabled={
                      isSubmitting || errors.nickname || !values.nickname
                    }
                  >
                    Save
                  </button>

                  <button
                    className='w-20 h-full bg-blue-500'
                    onClick={() => resetForm()}
                    type='button'
                    disabled={isSubmitting || !values.nickname}
                  >
                    Clear
                  </button>
                </div>

                {user ? (
                  <p>{`Active user is "${user}"`}</p>
                ) : (
                  <p>{'No active user'}</p>
                )}
              </Form>
            )}
          </Formik>
        </div>

        <div className='w-3/4'>
          <ChatBlock />
        </div>
      </div>
    </>
  );
};
