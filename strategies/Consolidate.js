define(['altair/facades/declare',
        './_Base',
        'lodash',
        'altair/Lifecycle'
], function (declare,
             _Base,
             _,
             Lifecycle) {

    var consolidate, ejs;

    return declare([_Base, Lifecycle], {

        startup: function () {

            return this.inherited(arguments);

        },

        canRender: function (ext) {
            return _.has(consolidate, ext);
        },

        render: function (path, context, options) {

            if (!consolidate) {

                require(['altair/plugins/node!consolidate',
                    'altair/plugins/node!ejs'], function (c, e) {

                    consolidate = c;
                    ejs = e;

                });
            }

            var dfd         = new this.Deferred(),
                _options    = options || {},
                ext         = path.split('.').pop();

            if(!consolidate[ext]) {
                dfd.reject(new Error('Could not find valid renderer for extension ' + ext + ' in consolidate. Make sure to run npm install {{render-library}}'));
                return dfd;
            }

            //pass caching settings through
            if (_.has(_options, 'cache')) {
                context.cache = _options.cache;
            }

            consolidate[ext](path, context, function (err, results) {
                if(err) {
                    dfd.reject(err);
                } else {
                    dfd.resolve(results);
                }
            });

            return dfd;

        }
    });

});