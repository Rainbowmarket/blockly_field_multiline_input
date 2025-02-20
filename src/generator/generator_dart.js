import * as Blockly from 'blockly/core';
import {dartGenerator, Order} from 'blockly/dart';

dartGenerator.forBlock['multiple_line_input_in'] = function (block) {
    const text = block.getFieldValue('TEXT');
    return [`'${text.replace(/\n/g, '\\n')}'`, Order.ATOMIC];
};

dartGenerator.forBlock['multiple_line_input_out'] = function (block) {
    const text = block.getFieldValue('TEXT');
    return `'${text.replace(/\n/g, '\\n')}'`;
};



