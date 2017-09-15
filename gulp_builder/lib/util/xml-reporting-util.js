'use strict';

module.exports = function (gb) {

    var TABLE_NONE = "--none--";

    // ID Name Type Description Mandatory Externally-managed group system/custom
    gb.systemObjectTableHeader = function() {

        return;

    };

    gb.attributesRow = function(outputStream, classification, attributes, attributeToGroupMap) {

        attributes.forEach(function (attribute) {

            if (attribute) {

                var attributeID = attribute.$['attribute-id'];

                var attributeName = TABLE_NONE;
                if (attribute['display-name']) {
                    attributeName = attribute['display-name'][0]._;
                }

                var attributeType = TABLE_NONE;
                if (attribute['type']) {
                    attributeType = attribute['type'];
                }

                var attributeDescription = TABLE_NONE;
                if (attribute['description']) {
                    attributeDescription = attribute['description'][0]._;
                }

                var attributeMandatory = TABLE_NONE;
                if (attribute['mandatory-flag']) {
                    attributeMandatory = attribute['mandatory-flag'];
                }

                var attributeExternal = TABLE_NONE;
                if (attribute['externally-managed-flag']) {
                    attributeExternal = attribute['externally-managed-flag'];
                }

                var attributeGroup = attributeToGroupMap[attributeID];
                if (!attributeGroup) {
                    attributeGroup = TABLE_NONE;
                }

                outputStream.write("<tr>");
                outputStream.write("<td>" + attributeID + "</td>");
                outputStream.write("<td><![CDATA[" + attributeName + "]]></td>");
                outputStream.write("<td>" + attributeType + "</td>");
                outputStream.write("<td><![CDATA[" + attributeDescription + "]]></td>");
                outputStream.write("<td>" + attributeMandatory + "</td>");
                outputStream.write("<td>" + attributeExternal + "</td>");
                outputStream.write("<td><![CDATA[" + attributeGroup + "]]></td>");
                outputStream.write("<td>" + classification + "</td>");
                outputStream.write("</tr>");

            }

        });

    };

};
