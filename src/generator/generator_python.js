import * as Blockly from 'blockly/core';
import {pythonGenerator, Order} from 'blockly/python';

pythonGenerator.forBlock['multiple_line_input_in'] = function (block) {
    const text = block.getFieldValue('TEXT');
    return [`'''${text.replace(/'''/g, "\\'''")}'''`, Order.ATOMIC];
};
pythonGenerator.forBlock['multiple_line_input_out'] = function (block) {
    const text = block.getFieldValue('TEXT');
    return `'''${text.replace(/'''/g, "\\'''")}'''`;
};
