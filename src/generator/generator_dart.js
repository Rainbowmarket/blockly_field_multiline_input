import * as Blockly from 'blockly/core';

Blockly.Dart['multiple_line_input_in'] = function (block) {
    const text = block.getFieldValue('TEXT');
    return [`'${text.replace(/\n/g, '\\n')}'`, Blockly.Dart.ORDER_ATOMIC];
};

Blockly.Dart['multiple_line_input_out'] = function (block) {
    const text = block.getFieldValue('TEXT');
    return `'${text.replace(/\n/g, '\\n')}'`;
};



