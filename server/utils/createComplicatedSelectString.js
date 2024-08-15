'use strict';

/**
 * Generate long query string for optional parameters.
 * @params {object} paramsCommand - object with string for commands
 * @params {object} params - object of optional parameters
 */
const createCompicatedQuerySelectString = (paramsCommands, params) => {
  let queryString = "";

  for (const f of Object.entries(params)) {
    if (f[1] == undefined || f[1] == null || f[1] == '' || paramsCommands[f[0]] === undefined) {
      delete params[f[0]]
    }
  }
  const paramsLength = Object.entries(params).length;

  if (paramsLength === 0) {
    return queryString
  }
  queryString += " where "

  let i = 0;
  for (const f of Object.entries(params)) {
    i++;
    if (i === paramsLength) {
      queryString += paramsCommands[f[0]];
      break
    }
    queryString += paramsCommands[f[0]] + " and ";
  }
  return queryString
}

module.exports = createCompicatedQuerySelectString
