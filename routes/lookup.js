/**
 * Created by ys2n on 6/30/14.
 */


/*
 * Perform kmap id lookup
 */

exports.lookup = function (req, res) {
    var validator = require('validator');

    if (validator.isNumeric(req.params.id)) {
        res.send("looky looky:" + req.params.id);
    }
    else {
        res.status(500);
        res.send("500: booky booky: " + req.params.id);
    }
};

