import * as Blockly from 'blockly/core';

import { FieldMultilineInput } from './field/field.js'
import { registerBlocks } from './block/blocks.js'
// import './generator/index.js'

if (!Blockly.registry.hasItem(Blockly.registry.Type.FIELD, 'field_multiline_input')) {
  Blockly.registry.register(
    Blockly.registry.Type.FIELD,
    'field_multiline_input',
    FieldMultilineInput
  );
}
registerBlocks();
export { FieldMultilineInput }