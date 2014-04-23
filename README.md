# liquidfire:Onyx
A view engine. It is a simple promise based wrapper for [visionmedia/consolidate.js](https://github.com/visionmedia/consolidate.js).
It also introduces some helpful extensions to your module and sub components as well as auto-picks template engine based
on the template extension.

## Extensions

- **render(path, context, options)**: render any view script with the passed context. You can also pass additional options.

## Examples
``` js
define(['altair/facades/declare',
        'altair/Lifecycle'
], function (declare,
             Lifecycle) {

    return declare([Lifecycle], {

        onDoingSomethingImportant: function (e) {

            return this.render('views/view.ejs').then(this.hitch(function (markup) {
                this.log(markup);
                return markup;
            }));

        }

    });

});
```

