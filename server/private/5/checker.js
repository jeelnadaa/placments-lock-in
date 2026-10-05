exports.check = function(inputs, actual) {
    if (typeof actual !== 'string') return false;
    const s = inputs.s;
    if (!s.includes(actual)) return false;
    // Check if actual is a palindrome
    let i = 0, j = actual.length - 1;
    while (i < j) {
        if (actual.charAt(i) !== actual.charAt(j)) return false;
        i++;
        j--;
    }
    // Check if it achieves maximum length
    // Compute max palindrome length in s
    let maxLen = 0;
    for (let c = 0; c < s.length; c++) {
        // odd
        let l = c, r = c;
        while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
        if (r - l - 1 > maxLen) maxLen = r - l - 1;
        // even
        l = c; r = c + 1;
        while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
        if (r - l - 1 > maxLen) maxLen = r - l - 1;
    }
    return actual.length === maxLen;
};
