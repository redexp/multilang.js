(function($){

    $.fn.multilang = function(options){
        if (typeof options === 'number') {
            applyTranslation(this, options);
            return this;
        }

        if (typeof options === 'string') {
            return utils[options].apply(this, arguments);
        }

        options = $.extend(true, {
            autoTranslateTo: false,
            skipClass: 'skip',
            dictionary: {}
        }, options || {});

        prepareTranslation(this, options);

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
    function toDomTranslation(trans){
        var cache = toDomTranslation.cache || (toDomTranslation.cache = {});

        if (cache[trans]) return cache[trans];

        var div = $('<div>'+ trans +'</div>')[0];

        return cache[trans] = div.childNodes;
    }

    function prepareTranslation(list, options){
        list.each(function(i, node){
            var main = generateKey(node, options.skipClass),
                translations = options.dictionary[main];

            if (translations) {
                if (!translations.main_added) {
                    translations.unshift(main);
                    translations.main_added = true;
                }

                $(node).data('translations', $.map(translations, toDomTranslation));
            }
        });
    }

    function applyTranslation(list, num){
        var errors = [];

        list.each(function(i, node){
            var translation = $(node).data('translations');

            if (! translation) {
                errors.push(node);
                return;
            }

            translate(node, translation[num]);
        });

        if (errors.length) {
            console.error('No translations for');
            console.log(errors);
        }
    }

    var utils = {
        "dictionary-sample": function(options){
            var dictionary = {};
            this.each(function(i, node){
                var main = generateKey(node, options.skipClass);

                dictionary[main] = [""];
            });

            return JSON.stringify(dictionary);
        }
    };

    $.multilang = function(dictionary){
        var translator = function(word){
            if (!dictionary[word]) {
                translator.errors[word] = true;
                return word;
            }

            if (translator.lang == 0) return word;

            return dictionary[word][translator.lang - 1];
        };

        translator.errors = {};
        translator.lang = 0;

        return translator;
    };

})(jQuery);
