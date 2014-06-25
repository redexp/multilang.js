(function($){

    $.fn.multilang = function(options){
        if (typeof options !== 'object') {
            applyTranslation(this, options);
            return this;
        }

        options = $.extend(true, {
            skipClass: 'skip',
            dictionary: {}
        }, options || {});

        this.each(function(i, node){
            var key = generateKey(node, options.skipClass),
                langs = options.dictionary[key];

            if (langs) {
                langs.unshift(key);
                $(node).data('translations', $.map(langs, toTranslation));
            }
        });

        if (options.autoTranslateTo) {
            this.multilang(options.autoTranslateTo);
        }

        return this;
    };

    /**
     * @param {HTMLElement} node
     * @param {NodeList} translation
     */
    function translate(node, translation){
        $.each(translation, function(i, item){
            switch (item.nodeName) {
                case '#text':
                    node.childNodes[i].textContent = item.textContent;
                    break;
                case 'TAG':
                    translate(node.childNodes[i], item.childNodes);
                    break;
                case 'SKIP':
                    break;
            }
        });
    }

    /**
     * @param {HTMLElement} node
     * @param {string} skipClass
     * @returns {string}
     */
    function generateKey(node, skipClass){
        var key = '';

        $.each(node.childNodes, function(i, item){
            if (item.nodeName === '#text') {
                key += item.textContent;
            }
            else if($(item).hasClass(skipClass)) {
                key += '<skip/>';
            }
            else {
                key += '<tag>';
                key += generateKey(item, skipClass);
                key += '</tag>';
            }
        });

        return key;
    }

    /**
     * @param {string} trans
     * @returns {NodeList}
     */
    function toTranslation(trans){
        var cache = toTranslation.cache || (toTranslation.cache = {});

        if (cache[trans]) return cache[trans];

        var div = $('<div>'+ trans +'</div>')[0];

        return cache[trans] = div.childNodes;
    }

    function applyTranslation(node, num){
        var errors = [];

        node.each(function(i, item){
            var translation = $(item).data('translations');

            if (! translation) {
                errors.push(item);
                return;
            }

            translate(item, translation[num]);
        });

        if (errors.length) {
            console.error('No translation for');
            console.log(errors);
        }
    }

})(jQuery);
