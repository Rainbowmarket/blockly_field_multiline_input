import * as Blockly from 'blockly/core';
import {phpGenerator, Order} from 'blockly/php';

if(phpGenerator.forBlock){
    phpGenerator.forBlock['multiple_line_input_in'] = function (block) {
        const text = block.getFieldValue('TEXT');
        return [`'${text.replace(/\n/g, '\\n')}'`, Order.ATOMIC];
    };
    phpGenerator.forBlock['multiple_line_input_out'] = function (block) {
        const text = block.getFieldValue('TEXT');
        return `'${text.replace(/\n/g, '\\n')}'`;
    };
}else{
    phpGenerator.forBlock['multiple_line_input_in'] = function (block) {
        const text = block.getFieldValue('TEXT');
        return [`'${text.replace(/\n/g, '\\n')}'`, Order.ATOMIC];
    };
    phpGenerator.forBlock['multiple_line_input_out'] = function (block) {
        const text = block.getFieldValue('TEXT');
        return `'${text.replace(/\n/g, '\\n')}'`;
    };
}


