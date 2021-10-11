const { ensureNotPxRem, ensureNotPxEm } = require('empxrem');

const reg = /([\d.]+)px(\s*\/\*\s*force\s*\*\/)?/g;

function nonForcedNumericRegex(number) {
  // finds pixel values not followed by `/* force */`
  return new RegExp(number + 'px(?!\\s*\\/\\*\\s*force\\s*\\*\\/)', 'g');
}

function convert(context, { base = 16, em = false }) {
  const replaceable = context.match(reg);

  if (replaceable) {
    replaceable.forEach(function(value) {
      const matches = reg.exec(value);
      reg.lastIndex = 0;

      if (!matches[2]) {
        const match1 = matches[1];
        const newVal = em
          ? ensureNotPxEm(match1, base)
          : ensureNotPxRem(match1, base);
        context = context.replace(nonForcedNumericRegex(match1), newVal);
      }
    });
  }
  return context;
}

module.exports = (opts = { }) => {

  // Work with options here

  return {
    postcssPlugin: 'empxrem',
    Declaration (decl) {
      const { _value: { raw } = {}, value } = decl;
      decl.value = convert(raw ? raw : value, opts);
    }
  }
}
module.exports.postcss = true
