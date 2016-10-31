'use strict';

const fs   = require('fs-extra');
const path = require('path');

/**
 * helper will create new and unique names
 * (require(rcs)).helper
 *
 * @module helper
 */
const helper = module.exports = {};

/**
 * saves any file and creates the folder if it does not exist
 *
 * @param  {String}   destinationPath   the destination path including the filename
 * @param  {String}   data              the data to write into the file
 * @param  {Function} cb
 *
 * @return {Function} cb
 */
helper.save = (destinationPath, data, cb) => {
    // @todo check if the filepath has an .ext
    // @todo check if the new filename is the same .ext
    // @todo do not overwrite file! use for that an flag
    fs.mkdirs(path.dirname(destinationPath), (err) => {
        fs.writeFile(destinationPath, data, (err, data) => {
            if (err) return cb(err);

            return cb(null, "Successfully wrote " + destinationPath);
        });
    });
}; // /save

/**
 * gets a json object and compiles it into a readable json string
 *
 * @param  {Object} object              the json object
 * @param  {String} [indentation='\t']  the indentation of the json string
 *
 * @return {String} the readable json string
 */
helper.objectToJson = (object, indentation) => {
    let beautifiedString;

    indentation      = indentation || '\t';
    beautifiedString = JSON.stringify(object, null, indentation);

    return beautifiedString;
}; // /objectToJson

/**
 * Read the file in the path and convert it into an Javascript Object
 *
 * @param {String} path
 *
 * @return {Objects} strToObj
 */
helper.readJsonToObjSync = (path) => {
    // search for file. Fail fast if there is no json File
    if (!fs.existsSync(path)) return false;
    if (!fs.statSync(path).isFile()) return false;

    return JSON.parse(fs.readFileSync(path, 'utf8'));
}; // /readJsonToObjSync
