import * as Blockly from 'blockly/core';
import {luaGenerator, Order} from 'blockly/lua';

luaGenerator.forBlock['multiple_line_input_in'] = function (block) {
    const text = block.getFieldValue('TEXT');
    return [`'${text.replace(/\n/g, '\\n')}'`, Order.ATOMIC];
};
luaGenerator.forBlock['multiple_line_input_out'] = function (block) {
    const text = block.getFieldValue('TEXT');
    return `'${text.replace(/\n/g, '\\n')}'`;
};



