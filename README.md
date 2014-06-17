multilang.js
============

lib for multi-language support

## Installation

```
bower install multilang
```

## Dependencies

 * jQuery

## Usage

```html
<body>

<div>
    <div lang>Some text <span>number <b class="skip">text</b></span> end</div>
    <div lang>Some text <span class="skip">number</span> end</div>
</div>

<script src="jquery.min.js"></script>
<script src="multilang.js"></script>
<script src="test.js"></script>

</body>
```

*test.js*
```javascript
$('body [lang]').multilang({
    autoTranslateTo: 1,
    dictionary: {
        'Some text <skip/> end': [
            'Какой-то текст <skip/> конец'
        ],

        'Some text <tag>number <skip/></tag> end': [
            'Какой-то текст <tag>число <skip/></tag> конец'
        ]
    }
});
```

[Look on result](http://redexp.github.io/multilang.js/test/index.html)

## How it works

All selected nodes (`<div lang>` in my example) will be converted to special key string where tags with
class `skip` (configurable) will be presented as `<skip/>` and all other tags as `<tag></tag>`. This key
string should be as field name in our `dictionary:`. Array of this field should be translations strings
in same format, only with translated words.

`autoTranslateTo:` means - to which language automatically translate selected nodes. Number is index of
translation. `0` will be means - returns to default text; `1` - first translation from array and so on.
If you will not set any number, it will not translate to any language.

## Options

 * `dictionary:` - hash, where key is source text to compare with destination nodes key strings and values
   is array of translations
 * `autoTranslateTo:` - optional `Number`, means - to which language automatically translate selected
   nodes
 * `skipClass:` - name of class which will be indicate node as `<skip/>` tag in translation