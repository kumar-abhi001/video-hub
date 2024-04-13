const asyncHandler = (fnc) => async () => {
  try {
    await fnc(req, res, next);
  } catch (error) {
    res.status(error.status || 400).json({
      sucess: false,
      message: error.message,
    });
  }
};

export { asyncHandler };
//advance syntax
/*
const asyncHandler = (fnc) => {
    (req, res, next) => {
        Promise.resolve(fnc(req, res, next))
            .catch((error) => {
                res.status(error.status || 400).json({
                    sucess: false,
                    message: error.message,
            })
        })
    }
}

*/
