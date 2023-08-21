const sanitizeUserDefinedInput = (_inputString) => {
    return _inputString.replace(/'/g, "’").replace(/"/g, '’’');
}

export default sanitizeUserDefinedInput;