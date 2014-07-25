var util = {
    extractText: function(html) {
        if (!html)
            return "";
        var div = document.createElement("div");
        div.innerHTML = html;
        var text = div.textContent || div.innerText || "";
        return text;
    },
    cropText: function(text, maxLength) {
        if (!maxLength)
            maxLength = 250;
        if (text.length > maxLength)
            return text.substring(0, maxLength) + " [...]";
        return text;
    },
    extractAndCropText: function(html) {
        var text = util.extractText(html);
        return util.cropText(text);
    }
};