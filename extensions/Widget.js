define(['altair/facades/declare',
        'altair/cartridges/extension/extensions/_Base',
        'altair/Deferred',
        'altair/plugins/node!path',
        'altair/facades/mixin'],

    function (declare,
              _Base,
              Deferred,
              pathUtil,
              mixin) {

        return declare([_Base], {

            name: 'widget',
            _foundry: null,

            extend: function (Module, type) {

                Module.extendOnce({
                    widgetPath: './widgets',
                    widget: function (name, options, config) {

                        var _p = this.resolvePath(pathUtil.resolve(this.widgetPath, name.toLowerCase(), name)),
                            d,
                            _c = mixin({
                                type: 'widget',
                                name: this.name.split('/')[0] + '/widgets/' + name
                            }, config || {});

                        return this.forge(_p, options, _c);

                    }
                });

                return this.inherited(arguments);
            }

        });


    });