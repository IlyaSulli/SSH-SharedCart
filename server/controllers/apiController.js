const API = require(`${__dirname}/../models/apiModel`);

exports.getInfo = async (req, res) => {
    try {
        const apiCalls = API.find();
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            data: {
                apiCalls,
            },
        });
    } catch (err) {
       console.log(err);
       res.status(404).json({
          status: 'fail',
          message: err,
       });
    }
 };