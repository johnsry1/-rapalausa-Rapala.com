'use strict';

module.exports = function (gb) {

    gb.createSystemObjectsReport = function(filename) {

        var xml2js = require('xml2js'),

            // read arguments
            fileIn = filename,

            // create output file
            fileOut = gb.workingPath + "/artifacts/system-objecttype-extensions.txt",

            outputStream = gb.fileSystem.createWriteStream(fileOut),
            SYSTEM_OBJ_TABLE_HEADER = "<tr><th>ID</th><th>Name</th><th>Type</th>" +
                                      "<th>Description</th><th>Mandatory</th>" +
                                      "<th>Externally managed</th><th>Group</th>" +
                                      "<th>System/Custom</th></tr>",

            // set up parser and convert XML file to JS
            parser = new xml2js.Parser();

        gb.fileSystem.readFile(fileIn, {encoding : "utf8"}, function(err, data) {

            parser.parseString(data, function (err, result) {

                //outputStream.write("<!DOCTYPE html><head></head><body>");
                outputStream.write('<h1>Note:</h1>');
                outputStream.write('<p>This page is auto-generated by the build. Do not edit manually.</p>');

                // iterate over each system object type extension
                var systemObjects = result.metadata['type-extension'];

                systemObjects.forEach(function (systemObject) {

                    // output system object ID
                    var systemObjectTypeID = systemObject.$['type-id'];
                    outputStream.write('<h1>' + systemObjectTypeID + '</h1>');

                    // iterate over attribute groups and create mapping of attribute to group
                    var attributeToGroupMap = {};

                    if(systemObject['group-definitions']) {
                        var groups = systemObject['group-definitions'][0]['attribute-group'];

                        groups.forEach(function (group) {

                            //output group name
                            var groupName = group.$['group-id'],

                                // iterate over attributes in group
                                groupAttributes = group.attribute;

                            if (groupAttributes) {

                                groupAttributes.forEach(function (groupAttribute) {

                                    if (groupAttribute) {
                                        var attributeID = groupAttribute.$['attribute-id'];
                                        attributeToGroupMap[attributeID] = groupName;
                                    }

                                });

                            }

                        });

                    }

                    // iterate over attribute definitions and output
                    var customAttributes = null,
                        systemAttributes = null;

                    // write table headers
                    outputStream.write("<table>");
                    outputStream.write(SYSTEM_OBJ_TABLE_HEADER);

                    if(systemObject['custom-attribute-definitions'] && systemObject['custom-attribute-definitions'][0]) {
                        customAttributes = systemObject['custom-attribute-definitions'][0]['attribute-definition'];
                        gb.attributesRow(outputStream, "Custom", customAttributes, attributeToGroupMap);
                    }

                    if(systemObject['system-attribute-definitions'] && systemObject['system-attribute-definitions'][0]) {
                        systemAttributes = systemObject['system-attribute-definitions'][0]['attribute-definition'];
                        gb.attributesRow(outputStream, "System", systemAttributes, attributeToGroupMap);
                    }

                    outputStream.write("</table>");

                });

                outputStream.end(function () {

                    console.log("file written: " + fileOut);

                });

            });

        });

    };

};
