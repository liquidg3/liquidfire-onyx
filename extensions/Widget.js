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
                    widget: function (named, options, config) {

                        var _name = named,
                            dfd,
                            path,
                            parts,
                            instanceId,
                            _config;


                        //if it's a nexus name, pass it off
                        if(named.search(':') > 0) {
                            return this.nexus(named, options, config);
                        }

                        if(named.search(/\./) === -1) {
                            dfd = new this.Deferred();
                            dfd.reject('You need to give your widget an instance id: this.widget(\'Name.instanceId\') -> this.widget(\'liquidfire:Forms/widgets/Form.create-user\')');
                        } else {

                            //break out instance id
                            parts = named.split('.');
                            _name = parts[0];
                            instanceId = parts[1];

                            path =  this.resolvePath(pathUtil.join(this.widgetPath, _name.toLowerCase(), _name));


                            _config = mixin({
                                type: 'widget',
                                name: this.name.split('/')[0] + '/widgets/' + _name
                            }, config || {});


                            dfd = this.forge(path, options, _config).then(function (widget) {
                                widget.instanceId = instanceId;
                                return widget;
                            });
                        }

                        return dfd;

                    }
                });

                return this.inherited(arguments);
            }

        });


    });