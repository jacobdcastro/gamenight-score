const sendError = (res: any, err: any): void => {
  console.log('Server error');
  res.status(500).send('Error with the server. Big oops.');
};

export default sendError;
