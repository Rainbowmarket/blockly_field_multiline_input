import * as Blockly from 'blockly/core';
import { FieldMultilineInput } from '../field/field.js'

const multiple_line_input_in = {
  init: function () {
    this.appendDummyInput('NAME')
      .appendField(new FieldMultilineInput('Enter \n new text here'), 'NAME');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(300);
  }
};

const multiple_line_input_out = {
  init: function () {
    this.appendDummyInput('NAME')
      .appendField(new FieldMultilineInput('Enter \n new text here'), 'NAME');
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(300);
  }
};

function registerBlocks() {
  Blockly.common.defineBlocks({
    multiple_line_input_in: multiple_line_input_in,
    multiple_line_input_out: multiple_line_input_out
  })
}
export { registerBlocks };