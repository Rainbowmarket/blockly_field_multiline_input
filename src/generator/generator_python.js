import * as Blockly from 'blockly/core';

Blockly.Python['multiple_line_input_in'] = function (block) {
    const text = block.getFieldValue('TEXT');
    return [`'''${text.replace(/'''/g, "\\'''")}'''`, Blockly.Python.ORDER_ATOMIC];
};
Blockly.Python['multiple_line_input_out'] = function (block) {
    const text = block.getFieldValue('TEXT');
    return `'''${text.replace(/'''/g, "\\'''")}'''`;
};
