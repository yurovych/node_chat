import { useContext, useState } from 'react';
import { Context } from '../context/context.jsx';
import { Formik, Form, Field } from 'formik';
import { userService } from '../services/userService.js';
import { useNavigate } from 'react-router-dom';
import { ChatBlock } from './ChatsBlock.jsx';

function messageValidation(newMessage) {
  if (!newMessage || newMessage.trim().length === 0) {
    return 'Message required';
  }

  if (newMessage.trim().length > 3000) {
    return 'Message is to long';
  }
}

export const Room = () => {
  const { currentRoom, setCurrentRoom, setUser, user } = useContext(Context);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  function handleLogOut() {
    localStorage.setItem('nickname', '');
    setUser('');
    navigate('/');
  }

  return (
    <div className='flex justify-between gap-10 w-screen px-5 mt-5'>
      <div className='flex flex-col items-center text-center w-4/12 mb-10'>
        <div className='flex justify-between items-center h-8 w-full'>
          <h4>{`${user} in a "${currentRoom.name}" room`} </h4>

          <button
            className=' w-20 rounded-xl bg-red-600 h-full'
            onClick={handleLogOut}
            type='button'
          >
            Log out
          </button>
        </div>

        <div className='w-full'>
          <Formik
            initialValues={{ newMessage: '' }}
            validateOnMount={true}
            onSubmit={({ newMessage }, formikHelpers) => {
              formikHelpers.setSubmitting(true);

              userService
                .newMessage(newMessage, currentRoom.id)
                .then((res) => {
                  setCurrentRoom(res);
                  formikHelpers.resetForm();
                })
                .catch((error) => {
                  if (error.message) {
                    setError(error.message);
                  }

                  if (!error.response?.data) {
                    return;
                  }

                  const { errors, message } = error.response.data;

                  formikHelpers.setFieldError('newMessage', errors?.newMessage);

                  if (message) {
                    setError(message);
                  }
                })
                .finally(() => {
                  formikHelpers.setSubmitting(false);
                  formikHelpers.setFieldValue('newMessage', '');
                });
            }}
          >
            {({
              touched,
              errors,
              isSubmitting,
              values,
              setFieldValue,
              resetForm,
            }) => (
              <div className='flex flex-col items-center'>
                <div className='flex overflow-y-scroll items-start flex-col-reverse border-solid border-gray-300 rounded-xl h-70vh w-full px-4 py-2'>
                  <div className='flex flex-col items-start w-full'>
                    {currentRoom.history.map((mes) => {
                      return (
                        <div
                          key={mes.id}
                          className='bg-slate-100 p-2 mb-2 rounded-xl w-full'
                        >
                          <p className='text-start text-sm text-stone-500'>
                            {mes.user}
                          </p>
                          <p
                            className='flex max-w-full p-2 rounded-xl bg-slate-200 w-full text-start'
                            style={{
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                            }}
                          >
                            {mes.message}
                            <br />
                          </p>
                          <p className='text-end text-xs text-stone-400'>
                            {mes.time}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Form className='w-full'>
                  <div className='flex h-8'>
                    <div className='w-full h-full'>
                      <Field
                        className='w-full border-1 border-gray-300 rounded-l-xl px-4 h-8'
                        validate={messageValidation}
                        name='newMessage'
                        type='text'
                        id='newMessage'
                        placeholder='Message'
                      />
                    </div>

                    <button
                      className='w-20 h-full bg-green-600'
                      type='submit'
                      disabled={
                        isSubmitting || errors.newMessage || !values.newMessage
                      }
                    >
                      Send
                    </button>

                    <button
                      className='w-20 rounded-r-xl h-full bg-blue-600'
                      onClick={() => {
                        resetForm();
                        setFieldValue('newMessage', '');
                      }}
                      type='button'
                      disabled={isSubmitting || !values.newMessage}
                    >
                      Clear
                    </button>
                  </div>

                  {touched.newMessage && errors.newMessage && (
                    <p style={{ color: 'red', marginTop: '5px' }}>
                      {errors.newMessage}
                    </p>
                  )}
                </Form>
              </div>
            )}
          </Formik>

          {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
        </div>
      </div>

      <div className='w-8/12'>
        <ChatBlock />
      </div>
    </div>
  );
};
