jQuery(function($){

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

});
