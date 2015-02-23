'use strict';

module.exports = errHandler;

function errHandler(handler, cb){
  return function(){
    var args = [].slice.call(arguments);
    var err = args.shift();
    if(err)return handler(err);
    cb.apply(null, args);
  };
}
