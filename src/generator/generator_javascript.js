import * as Blockly from 'blockly/core';

Blockly.JavaScript.forBlock['multiple_line_input_in'] = function(block) {
    const text = block.getFieldValue('TEXT');
    return [`'${text.replace(/\n/g, '\\n').replace(/'/g, "\\'")}'`, Blockly.JavaScript.ORDER_ATOMIC];
}

Blockly.JavaScript.forBlock['multiple_line_input_out'] = function(block) {
    const text = block.getFieldValue('TEXT');
    return `'${text.replace(/\n/g, '\\n').replace(/'/g, "\\'")}'`;
}