/**
 *
 * @author:     Taylor Romero
 * @copyright:  Taylor Romero, Inc - 2014
 * @license:    MIT
 * @vendor:     liquidfire
 * @module:     Onyx
 * @nexus:      this.nexus("liquidfire:Onyx")
 *
 */

define(['altair/facades/declare', //take a look at terms.md
        'lodash',
        'altair/facades/all',
        'altair/facades/hitch',
        './extensions/Render',
        './mixins/_HasRenderStrategiesMixin'
], function (declare,
             _,
             all,
             hitch,
             RenderExtension,
             _HasRenderStrategiesMixin) {


    return declare([_HasRenderStrategiesMixin], {

        _strategies: null,

        /**
         * Startup render extension
         *
         * @param options
         * @returns {altair.Deferred}
         */
        startup: function (options) {

            var _options            = options || this.options || { installExtension: true },
                extensionCartridge  = this.nexus('cartridges/Extension'),
                extensions          = [];

            //did someone pass strategies?
            if(_options.strategies) {
                this._strategies = _options.strategies;
            }

            //should we install the extension?
            if(_options.installExtension !== false) {

                //instantiate extension
                extensions.push(new RenderExtension(extensionCartridge));

                //forge the render extension (make sure it is not started up)
                this.deferred = extensionCartridge.addExtensions(extensions).then(this.hitch(function (render) {
                    //startup always returns this
                    return this;

                }));

            }

            return this.inherited(arguments);

        },

        /**
         * When we are executed, lets refresh our server strategies. than way when someone tries to start a server, we
         * have what everyone registered during startup.
         *
         * @returns {*}
         */
        execute: function () {

            this.deferred = this.refreshStrategies().then(this.hitch(function () {
                return this;
            }));

            return this.inherited(arguments);

        },

        /**
         * Renders a script with the available strategies. Call refreshStrategies to load them fresh (old ones will be destroyed).
         *
         * @param path
         * @param context
         * @param options
         * @returns {*}
         */
        render: function (path, context, options) {

            var d,
                extension = path.split('.').pop();

            _.each(this._strategies, function (strategy) {

                if(strategy.canRender(extension)) {

                    d = strategy.render(path, context, options);

                    //stop iterating
                    return false;
                }

            }, this);

            //no strategy found
            if(!d) {
                d = new this.Deferred();
                d.reject(new Error('no strategy found for file with extension ' + extension));
            }

            return d;

        },

        /**
         * All the render strategies we have available. use mixins/_HasRenderStrategiesMixin
         *
         * @returns {altair.Deferred}
         */
        refreshStrategies: function () {

            return this.emit('register-render-strategies').then(this.hitch(function (e) {

                var strategies = e.results();

                this.log(strategies.length, 'total render strategy registrants');
                this.log(Object.keys(strategies).length, 'total render strategies');

                //save strategies back locally
                this._strategies = strategies;

                return strategies;
            }));

        }


    });
});