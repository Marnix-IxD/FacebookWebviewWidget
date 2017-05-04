define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/window",
    "dojo/_base/event",

    "dojo/text!FacebookWebviewWidget/widget/template/FacebookWebviewWidget.html"
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoWindow, dojoEvent, widgetTemplate) {
    "use strict";

    return declare("FacebookWebviewWidget.widget.FacebookWebviewWidget", [ _WidgetBase, _TemplatedMixin ], {

        templateString: widgetTemplate,
        facebookUsers: [],
        loadedScriptSuccessfully: false,
        autoLoad: false,
        timeout: 1000,

        widgetBase: null,

        // Internal variables.
        _handles: null,

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(webview.id + ".postCreate");
            //Load external Facebook Messenger Webview Extention script
            var webview = this;
            var webviewScript = document.createElement("script");
            webviewScript.setAttribute("type","text/javascript");
            webviewScript.setAttribute("src","js/FacebookMessengerExtentions.js");
            //Place it as first child
            dojoConstruct.create(webviewScript, null, dojoWindow.body(),first);
            //Wait for Async load of Facebook Messenger Webview Extention script
            setTimeout(function () {
                window.extAsyncInit(){
                    //Script loaded
                    this.loadedScriptSuccessfully = true;
                    //Try retrieve userID
                    MessengerExtensions.getUserID(function success(uids) {
                        // User ID was successfully obtained.
                        var psid = uids.psid;
                        mx.data.get({
                            xpath: "//FacebookMessenger.FacebookUser/pageScopedFacebookID ="+psid,
                            filter: {
                                amount: 1,
                                filter: distinct
                            },
                            callback: function(objs) {
                                logger.debug(this.id + "loaded Facebook User by pageScopedUserID");
                                this.facebookUsers = objs;
                                webview.set("loaded",true);
                            }
                        });

                    }, function error(err, errorMessage) {
                        // Error handling code
                    });
                    webview.set("loaded",true);
                }
            }, timeout);
        },

        update: function ( callback) {
            logger.debug(this.id + ".update");

            this._updateRendering(callback);
        },

        resize: function (box) {
          logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
          logger.debug(this.id + ".uninitialize");
          MessengerExtensions.requestCloseBrowser(function success() {

          }, function error(err) {

          });
        },

        _setupEvents: function(){

        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            mendix.lang.nullExec(callback);
        }
    });
});

require(["FacebookWebviewWidget/widget/FacebookWebviewWidget"]);
