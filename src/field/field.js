import * as Blockly from 'blockly/core';

export class FieldMultilineInput extends Blockly.FieldTextInput {
  constructor(value, validator, config) {
    super(Blockly.Field.SKIP_SETUP);

    if (value === Blockly.Field.SKIP_SETUP) return;
    if (config) {
      this.configure_(config);
    }
    this.setValue(value);
    if (validator) {
      this.setValidator(validator);
    }

    this.textGroup = null;
    this.maxLines_ = Infinity;
    this.isOverflowedY_ = false;
  }

  configure_(config) {
    super.configure_(config);
    if (config.maxLines) this.setMaxLines(config.maxLines);
  }

  toXml(fieldElement) {
    console.log("toXml.fieldElement: ", this.getValue());
    fieldElement.textContent = this.getValue().replace(/\n/g, '&#10;');
    return fieldElement;
  }

  fromXml(fieldElement) {
    this.setValue(fieldElement.textContent.replace(/&#10;/g, '\n'));
    console.log("fromXml.fieldElement: ", this.getValue());
  }

  saveState() {
    const legacyState = this.saveLegacyState(FieldMultilineInput);
    if (legacyState !== null) {
      console.log("saveState.legacyState: ", legacyState);
      return legacyState;
    }
    return this.getValue();
  }

  loadState(state) {
    console.log("loadState.state: ", state)
    if (this.loadLegacyState(Blockly.Field, state)) {
      return;
    }
    this.setValue(state);
  }

  initView() {
    this.createBorderRect_();
    this.textGroup = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.G,
      { class: 'blocklyEditableText' },
      this.fieldGroup_
    );
  }

  getDisplayText_() {
    const block = this.getSourceBlock();
    if (!block) {
      throw new Error('The field has not yet been attached to its input. Call appendField to attach it.');
    }
    let textLines = this.getText();
    console.log("getDisplayText_.textLines: ", textLines);
    if (!textLines) {
      return Blockly.Field.NBSP;
    }
    const lines = textLines.split('\n');
    textLines = '';
    const displayLinesNumber = this.isOverflowedY_ ? this.maxLines_ : lines.length;
    for (let i = 0; i < displayLinesNumber; i++) {
      let text = lines[i];
      if (text.length > this.maxDisplayLength) {
        text = text.substring(0, this.maxDisplayLength - 4) + '...';
      } else if (this.isOverflowedY_ && i === displayLinesNumber - 1) {
        text = text.substring(0, text.length - 3) + '...';
      }
      text = text.replace(/\s/g, Blockly.Field.NBSP);
      textLines += text;
      if (i !== displayLinesNumber - 1) {
        textLines += '\n';
      }
    }
    if (block.RTL) {
      textLines += '\u200F';
    }
    return textLines;
  }

  doValueUpdate_(newValue) {
    super.doValueUpdate_(newValue);
    if (this.value_ !== null) {
      this.isOverflowedY_ = this.value_.split('\n').length > this.maxLines_;
    }
  }

  render_() {
    const block = this.getSourceBlock();
    if (!block) {
      throw new Error('The field has not yet been attached to its input. Call appendField to attach it.');
    }
    let currentChild;
    const textGroup = this.textGroup;
    while ((currentChild = textGroup.firstChild)) {
      textGroup.removeChild(currentChild);
    }

    const constants = this.getConstants();
    if (!constants) throw Error('Constants not found');
    const lines = this.getDisplayText_().split('\n');
    let y = 0;
    for (let i = 0; i < lines.length; i++) {
      const lineHeight = constants.FIELD_TEXT_HEIGHT + constants.FIELD_BORDER_RECT_Y_PADDING;
      const span = Blockly.utils.dom.createSvgElement(
        Blockly.utils.Svg.TEXT,
        {
          class: 'blocklyText blocklyMultilineText',
          x: constants.FIELD_BORDER_RECT_X_PADDING,
          y: y + constants.FIELD_BORDER_RECT_Y_PADDING,
          dy: constants.FIELD_TEXT_BASELINE,
        },
        textGroup
      );
      span.appendChild(document.createTextNode(lines[i]));
      y += lineHeight;
    }

    if (this.isBeingEdited_) {
      const htmlInput = this.htmlInput_;
      if (this.isOverflowedY_) {
        Blockly.utils.dom.addClass(htmlInput, 'blocklyHtmlTextAreaInputOverflowedY');
      } else {
        Blockly.utils.dom.removeClass(htmlInput, 'blocklyHtmlTextAreaInputOverflowedY');
      }
    }

    this.updateSize_();

    if (this.isBeingEdited_) {
      if (block.RTL) {
        setTimeout(this.resizeEditor_.bind(this), 0);
      } else {
        this.resizeEditor_();
      }
      const htmlInput = this.htmlInput_;
      if (!this.isTextValid_) {
        Blockly.utils.dom.addClass(htmlInput, 'blocklyInvalidInput');
        Blockly.utils.aria.setState(htmlInput, Blockly.utils.aria.State.INVALID, true);
      } else {
        Blockly.utils.dom.removeClass(htmlInput, 'blocklyInvalidInput');
        Blockly.utils.aria.setState(htmlInput, Blockly.utils.aria.State.INVALID, false);
      }
    }
  }

  updateSize_() {
    const constants = this.getConstants();
    if (!constants) throw Error('Constants not found');
    const nodes = this.textGroup.childNodes;
    const fontSize = constants.FIELD_TEXT_FONTSIZE;
    const fontWeight = constants.FIELD_TEXT_FONTWEIGHT;
    const fontFamily = constants.FIELD_TEXT_FONTFAMILY;
    let totalWidth = 0;
    let totalHeight = 0;
    for (let i = 0; i < nodes.length; i++) {
      const tspan = nodes[i];
      const textWidth = Blockly.utils.dom.getFastTextWidth(tspan, fontSize, fontWeight, fontFamily);
      if (textWidth > totalWidth) {
        totalWidth = textWidth;
      }
      totalHeight += constants.FIELD_TEXT_HEIGHT + (i > 0 ? constants.FIELD_BORDER_RECT_Y_PADDING : 0);
    }
    if (this.isBeingEdited_) {
      const actualEditorLines = String(this.value_).split('\n');
      const dummyTextElement = Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.TEXT, { class: 'blocklyText blocklyMultilineText' });
      for (let i = 0; i < actualEditorLines.length; i++) {
        if (actualEditorLines[i].length > this.maxDisplayLength) {
          actualEditorLines[i] = actualEditorLines[i].substring(0, this.maxDisplayLength);
        }
        dummyTextElement.textContent = actualEditorLines[i];
        const lineWidth = Blockly.utils.dom.getFastTextWidth(dummyTextElement, fontSize, fontWeight, fontFamily);
        if (lineWidth > totalWidth) {
          totalWidth = lineWidth;
        }
      }

      const htmlInput = this.htmlInput_;
      const scrollbarWidth = htmlInput.offsetWidth - htmlInput.clientWidth;
      totalWidth += scrollbarWidth;
    }
    if (this.borderRect_) {
      totalHeight += constants.FIELD_BORDER_RECT_Y_PADDING * 2;
      totalWidth += constants.FIELD_BORDER_RECT_X_PADDING * 2 + 1;
      this.borderRect_.setAttribute('width', `${totalWidth}`);
      this.borderRect_.setAttribute('height', `${totalHeight}`);
    }
    this.size_ = { width: totalWidth, height: totalHeight };
    this.positionBorderRect_();
  }

  showEditor_(e, quietInput) {
    super.showEditor_(e, quietInput);
    this.forceRerender();
  }

  widgetCreate_() {
    const div = Blockly.WidgetDiv.getDiv();
    const scale = this.workspace_.getScale();
    const constants = this.getConstants();
    if (!constants) throw Error('Constants not found');

    const htmlInput = document.createElement('textarea');
    htmlInput.className = 'blocklyHtmlInput blocklyHtmlTextAreaInput';
    htmlInput.setAttribute('spellcheck', String(this.spellcheck_));
    const fontSize = constants.FIELD_TEXT_FONTSIZE * scale + 'pt';
    div.style.fontSize = fontSize;
    htmlInput.style.fontSize = fontSize;
    const borderRadius = Blockly.FieldTextInput.BORDERRADIUS * scale + 'px';
    htmlInput.style.borderRadius = borderRadius;
    const paddingX = constants.FIELD_BORDER_RECT_X_PADDING * scale;
    const paddingY = (constants.FIELD_BORDER_RECT_Y_PADDING * scale) / 2;
    htmlInput.style.padding = `${paddingY}px ${paddingX}px ${paddingY}px ${paddingX}px`;
    const lineHeight = constants.FIELD_TEXT_HEIGHT + constants.FIELD_BORDER_RECT_Y_PADDING;
    htmlInput.style.lineHeight = lineHeight * scale + 'px';

    div.appendChild(htmlInput);
    htmlInput.value = htmlInput.defaultValue = this.getEditorText_(this.value_);
    htmlInput.setAttribute('data-untyped-default-value', String(this.value_));
    htmlInput.setAttribute('data-old-value', '');
    if (Blockly.utils.userAgent.GECKO) {
      setTimeout(this.resizeEditor_.bind(this), 0);
    } else {
      this.resizeEditor_();
    }

    this.bindInputEvents_(htmlInput);
    return htmlInput;
  }

  setMaxLines(maxLines) {
    if (typeof maxLines === 'number' && maxLines > 0 && maxLines !== this.maxLines_) {
      this.maxLines_ = maxLines;
      this.forceRerender();
    }
  }

  getMaxLines() {
    return this.maxLines_;
  }

  onHtmlInputKeyDown_(e) {
    if (e.key !== 'Enter') {
      super.onHtmlInputKeyDown_(e);
    }
  }

  static fromJson(options) {
    const text = Blockly.utils.parsing.replaceMessageReferences(options.text);
    return new this(text, undefined, options);
  }
}

export function registerFieldMultilineInput() {
  Blockly.fieldRegistry.register('field_multilinetext', FieldMultilineInput);
}

Blockly.Css.register(`
  .blocklyHtmlTextAreaInput {
    font-family: monospace;
    resize: none;
    overflow: hidden;
    height: 100%;
    text-align: left;
  }

  .blocklyHtmlTextAreaInputOverflowedY {
    overflow-y: scroll;
  }
`);