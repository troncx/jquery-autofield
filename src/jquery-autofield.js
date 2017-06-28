//! jquery-automaticfield
//! version : 0.0.1b
//! authors : @charlex

(function($) {
    'use strict';

    $.fn.automaticField = function(initialize_settings) {

        return this.each(function() {
            var $this = $(this),
            $input = $this;

            /* If if it's not an input field, throw an error. */
            if(!$this.is("input")) {
                throw "automaticField error: must be applied to input element. " + $this.prop('tagName') + "#" + $this.attr("id");
                return false;
            }

            /* Combine the default settings, with existing settings, and any new settings */
            var default_settings = {
                iconset: "emoji",
                automatic: true,
                showButton: true,
                manualLabel: "",
                automaticLabel: "",
                onChange: function(){}
            };

            var settings = $.extend(default_settings, initialize_settings);

            /* Wrap the input in a container */
            $input.wrap("<div class='af-container' style='position:relative;'></div>");
            var $container = $this.parent(".af-container");

            $container.data("manual-label", settings["manualLabel"]);
            $container.data("automatic-label", settings["automaticLabel"]);

            if(settings["automatic"]){
                $this.automatic();
            } else {
                $this.manual();
            }

            if(settings["iconset"] == "fontawesome"){
                $container.removeClass("af-iconset-emoji").addClass("af-iconset-fontawesome");
            } else {
                $container.addClass("af-iconset-emoji").removeClass("af-iconset-fontawesome");
            }

            /* By default automaticFields have override buttons, but this conditional allows the script user to change that per field */
            if(settings["showButton"]) {
                /* Prepend the button to the container */
                $container.prepend("<div class='af-btn'></div>");
                var $btn = $container.find(".af-btn");

                /* Listen for button clicks to make the field automatic/manual */
                $btn.on("click", function (event) {
                    event.preventDefault();
                    if($container.hasClass("af-disabled")) { return false; }
                    if($this.isAutomatic()) {
                        $this.manual();
                    } else {
                        $this.automatic();
                    }
                    settings.onChange();
                });
            }

            /* Listen for input clicks to make the field automatic/manual */
            $input.on("click focus", function (event) {
                event.preventDefault();
                if($this.isAutomatic()) {
                    if($container.hasClass("af-disabled")) { return false; }
                    $this.manual();
                    settings.onChange();
                }
            });
        });
    };

    $.fn.isAutomatic = function() {
        /* Returns whether or not the automaticField is automatic */
        var $container = $(this).parent(".af-container");
        if($container.hasClass("af-automatic")) {
            return true;
        } else {
            return false;
        }
    };

    $.fn.isManual = function() {
        /* Returns whether or not the automaticField is manual */
        var $container = $(this).parent(".af-container");
        if($container.hasClass("af-manual")) {
            return true;
        } else {
            return false;
        }
    };

    $.fn.automatic = function() {
        /* Sets the automaticField to be automatically filled in */
        var $container = $(this).parent(".af-container");
        $container.addClass("af-automatic").removeClass("af-manual");

        /* Sets the title label to the automatic label */
        var $btn = $container.find(".af-btn");
        if($container.data("automatic-label") != "") {
            $btn.attr("title", $container.data("automatic-label"));
        } else {
            $btn.removeAttr("title");
        }

        return this;
    };

    $.fn.manual = function() {
        /* Sets the automaticField to be manually editable by user */
        var $container = $(this).parent(".af-container");
        $container.removeClass("af-automatic").addClass("af-manual");

        /* Sets the title label to the manuel label */
        var $btn = $container.find(".af-btn");
        if($container.data("manual-label") != "") {
            $btn.attr("title", $container.data("manual-label"));
        } else {
            $btn.removeAttr("title");
        }


        return this;
    };

    $.fn.disable = function() {
        /* Disallows the user from being able to change the field to manual/automatic */
        var $container = $(this).parent(".af-container");
        $container.addClass("af-disabled");

        $container.find("input").prop('disabled', true);
        return this;
    };

    $.fn.enable = function() {
        /* Allows the user to be able to change the field to manual/automatic */
        var $container = $(this).parent(".af-container");
        $container.removeClass("af-disabled");

        $container.find("input").removeProp('disabled');
        return this;
    };


})(jQuery);
