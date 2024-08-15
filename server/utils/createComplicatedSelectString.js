'use strict';

/**
 * Generate long query string for optional parameters.
 * @params {object} paramsCommand - object with string for commands
 * @params {object} params - object of optional parameters
 */
const createCompicatedQuerySelectString = (paramsCommands, params) => {
  let queryString = "";
  let i = 0;
  let paramsLength = 0;
  for (const f of Object.entries(params)) {
    if (f[1] != undefined && f[1] != null && f[1] != '') {
      paramsLength++
    }
  }
  if (paramsLength !== 0) {
    queryString += "where ";
  }
  for (const f of Object.entries(params)) {
    if (f[1] == undefined || f[1] == null || f[1] == '') {
      delete params[f[0]]
    }
  }
  for (const f of Object.entries(params)) {
    if (i === paramsLength - 1) {
      queryString += paramsCommands[f[0]];
      break
    }
    queryString += paramsCommands[f[0]] + " and ";
    i++;
  }
  return queryString
}

module.exports = createCompicatedQuerySelectString
