define(['altair/facades/declare',
        'altair/cartridges/extension/extensions/_Base',
        'altair/Deferred',
        'altair/facades/hitch'],

    function (declare,
              _Base,
              Deferred,
              hitch) {

        return declare([_Base], {

            name: 'render',
            extend: function (Module) {

                Module.extendOnce({
                    render: function (path, context, options) {

                        var _p = this.resolvePath(path);
                        return this.nexus('liquidfire:Onyx').render(_p, context, options);

                    }
                });

                return this.inherited(arguments);
            }

        });


    });