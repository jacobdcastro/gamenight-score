// Router Errors
type ErrorFn = (res: any, err: any) => void;

export const sendServerError: ErrorFn = (res, err) => {
  console.log('Server error:', err);
  res.status(500).send('Error with the server. Big oops.');
};

export const sendUnauthError: ErrorFn = (res, err) => {
  console.log('Invalid token');
  res.status(403).send('Unauthorized, invalid token');
};

// Mongoose Errors
export const docSaveError = (err: any) => {
  if (err) console.error('Error saving document');
  else console.log('Document saved successfully');
};
