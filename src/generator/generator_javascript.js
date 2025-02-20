

Blockly.JavaScript.forBlock['multiple_line_input_out'] = function(block) {
    var multilineText = block.getFieldValue('multiple_line_input_in') || '';
    return [`'${multilineText}'`, Blockly.JavaScript.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['multiple_line_input_in'] = function(block) {
    const text = block.getFieldValue('TEXT')|| '';
    return `'${text.replace(/\n/g, '\\n').replace(/'/g, "\\'")}'`;
}