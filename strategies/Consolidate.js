define(['altair/facades/declare',
        './_Base',
        'lodash',
        'altair/plugins/node!consolidate'
], function (declare,
             _Base,
             _,
             consolidate) {

    return declare([_Base], {

        canRender: function (ext) {
            return _.has(consolidate, ext);
        },

        render: function (path, context, options) {

            var d = new this.Deferred(),
                ext = path.split('.').pop();

            if(!consolidate[ext]) {
                d.reject(new Error('Could not find valid renderer for extension ' + ext + ' in consolidate. Make sure to run npm install {{render-library}}'));
                return d;
            }

            consolidate[ext](path, context, function (err, results) {
                if(err) {
                    d.reject(err);
                } else {
                    d.resolve(results);
                }
            });

            return d;

        }
    });

});