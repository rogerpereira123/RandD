/*!
 * jQuery UI Core 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */ (function ($, undefined) {
    var uuid = 0,
        runiqueId = /^ui-id-\d+$/;
    $.ui = $.ui || {};
    $.extend($.ui, {
        version: "1.10.3",
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    });
    $.fn.extend({
        focus: (function (orig) {
            return function (delay, fn) {
                return typeof delay === "number" ? this.each(function () {
                    var elem = this;
                    setTimeout(function () {
                        $(elem).focus();
                        if (fn) {
                            fn.call(elem);
                        }
                    }, delay);
                }) : orig.apply(this, arguments);
            };
        })($.fn.focus),
        scrollParent: function () {
            var scrollParent;
            if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
                scrollParent = this.parents().filter(function () {
                    return (/(relative|absolute|fixed)/).test($.css(this, "position")) && (/(auto|scroll)/).test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
                }).eq(0);
            } else {
                scrollParent = this.parents().filter(function () {
                    return (/(auto|scroll)/).test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
                }).eq(0);
            }
            return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
        },
        zIndex: function (zIndex) {
            if (zIndex !== undefined) {
                return this.css("zIndex", zIndex);
            }
            if (this.length) {
                var elem = $(this[0]),
                    position, value;
                while (elem.length && elem[0] !== document) {
                    position = elem.css("position");
                    if (position === "absolute" || position === "relative" || position === "fixed") {
                        value = parseInt(elem.css("zIndex"), 10);
                        if (!isNaN(value) && value !== 0) {
                            return value;
                        }
                    }
                    elem = elem.parent();
                }
            }
            return 0;
        },
        uniqueId: function () {
            return this.each(function () {
                if (!this.id) {
                    this.id = "ui-id-" + (++uuid);
                }
            });
        },
        removeUniqueId: function () {
            return this.each(function () {
                if (runiqueId.test(this.id)) {
                    $(this).removeAttr("id");
                }
            });
        }
    });

    function focusable(element, isTabIndexNotNaN) {
        var map, mapName, img, nodeName = element.nodeName.toLowerCase();
        if ("area" === nodeName) {
            map = element.parentNode;
            mapName = map.name;
            if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
                return false;
            }
            img = $("img[usemap=#" + mapName + "]")[0];
            return !!img && visible(img);
        }
        return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : "a" === nodeName ? element.href || isTabIndexNotNaN : isTabIndexNotNaN) && visible(element);
    }

    function visible(element) {
        return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function () {
            return $.css(this, "visibility") === "hidden";
        }).length;
    }
    $.extend($.expr[":"], {
        data: $.expr.createPseudo ? $.expr.createPseudo(function (dataName) {
            return function (elem) {
                return !!$.data(elem, dataName);
            };
        }) : function (elem, i, match) {
            return !!$.data(elem, match[3]);
        },
        focusable: function (element) {
            return focusable(element, !isNaN($.attr(element, "tabindex")));
        },
        tabbable: function (element) {
            var tabIndex = $.attr(element, "tabindex"),
                isTabIndexNaN = isNaN(tabIndex);
            return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
        }
    });
    if (!$("<a>").outerWidth(1).jquery) {
        $.each(["Width", "Height"], function (i, name) {
            var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
                type = name.toLowerCase(),
                orig = {
                    innerWidth: $.fn.innerWidth,
                    innerHeight: $.fn.innerHeight,
                    outerWidth: $.fn.outerWidth,
                    outerHeight: $.fn.outerHeight
                };

            function reduce(elem, size, border, margin) {
                $.each(side, function () {
                    size -= parseFloat($.css(elem, "padding" + this)) || 0;
                    if (border) {
                        size -= parseFloat($.css(elem, "border" + this + "Width")) || 0;
                    }
                    if (margin) {
                        size -= parseFloat($.css(elem, "margin" + this)) || 0;
                    }
                });
                return size;
            }
            $.fn["inner" + name] = function (size) {
                if (size === undefined) {
                    return orig["inner" + name].call(this);
                }
                return this.each(function () {
                    $(this).css(type, reduce(this, size) + "px");
                });
            };
            $.fn["outer" + name] = function (size, margin) {
                if (typeof size !== "number") {
                    return orig["outer" + name].call(this, size);
                }
                return this.each(function () {
                    $(this).css(type, reduce(this, size, true, margin) + "px");
                });
            };
        });
    }
    if (!$.fn.addBack) {
        $.fn.addBack = function (selector) {
            return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
        };
    }
    if ($("<a>").data("a-b", "a").removeData("a-b").data("a-b")) {
        $.fn.removeData = (function (removeData) {
            return function (key) {
                if (arguments.length) {
                    return removeData.call(this, $.camelCase(key));
                } else {
                    return removeData.call(this);
                }
            };
        })($.fn.removeData);
    }
    $.ui.ie = !! /msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
    $.support.selectstart = "onselectstart" in document.createElement("div");
    $.fn.extend({
        disableSelection: function () {
            return this.bind(($.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (event) {
                event.preventDefault();
            });
        },
        enableSelection: function () {
            return this.unbind(".ui-disableSelection");
        }
    });
    $.extend($.ui, {
        plugin: {
            add: function (module, option, set) {
                var i, proto = $.ui[module].prototype;
                for (i in set) {
                    proto.plugins[i] = proto.plugins[i] || [];
                    proto.plugins[i].push([option, set[i]]);
                }
            },
            call: function (instance, name, args) {
                var i, set = instance.plugins[name];
                if (!set || !instance.element[0].parentNode || instance.element[0].parentNode.nodeType === 11) {
                    return;
                }
                for (i = 0; i < set.length; i++) {
                    if (instance.options[set[i][0]]) {
                        set[i][1].apply(instance.element, args);
                    }
                }
            }
        },
        hasScroll: function (el, a) {
            if ($(el).css("overflow") === "hidden") {
                return false;
            }
            var scroll = (a && a === "left") ? "scrollLeft" : "scrollTop",
                has = false;
            if (el[scroll] > 0) {
                return true;
            }
            el[scroll] = 1;
            has = (el[scroll] > 0);
            el[scroll] = 0;
            return has;
        }
    });
})(jQuery);;
/*!
 * jQuery UI Widget 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */ (function ($, undefined) {
    var uuid = 0,
        slice = Array.prototype.slice,
        _cleanData = $.cleanData;
    $.cleanData = function (elems) {
        for (var i = 0, elem;
        (elem = elems[i]) != null; i++) {
            try {
                $(elem).triggerHandler("remove");
            } catch (e) {}
        }
        _cleanData(elems);
    };
    $.widget = function (name, base, prototype) {
        var fullName, existingConstructor, constructor, basePrototype, proxiedPrototype = {}, namespace = name.split(".")[0];
        name = name.split(".")[1];
        fullName = namespace + "-" + name;
        if (!prototype) {
            prototype = base;
            base = $.Widget;
        }
        $.expr[":"][fullName.toLowerCase()] = function (elem) {
            return !!$.data(elem, fullName);
        };
        $[namespace] = $[namespace] || {};
        existingConstructor = $[namespace][name];
        constructor = $[namespace][name] = function (options, element) {
            if (!this._createWidget) {
                return new constructor(options, element);
            }
            if (arguments.length) {
                this._createWidget(options, element);
            }
        };
        $.extend(constructor, existingConstructor, {
            version: prototype.version,
            _proto: $.extend({}, prototype),
            _childConstructors: []
        });
        basePrototype = new base();
        basePrototype.options = $.widget.extend({}, basePrototype.options);
        $.each(prototype, function (prop, value) {
            if (!$.isFunction(value)) {
                proxiedPrototype[prop] = value;
                return;
            }
            proxiedPrototype[prop] = (function () {
                var _super = function () {
                    return base.prototype[prop].apply(this, arguments);
                }, _superApply = function (args) {
                    return base.prototype[prop].apply(this, args);
                };
                return function () {
                    var __super = this._super,
                        __superApply = this._superApply,
                        returnValue;
                    this._super = _super;
                    this._superApply = _superApply;
                    returnValue = value.apply(this, arguments);
                    this._super = __super;
                    this._superApply = __superApply;
                    return returnValue;
                };
            })();
        });
        constructor.prototype = $.widget.extend(basePrototype, {
            widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
        }, proxiedPrototype, {
            constructor: constructor,
            namespace: namespace,
            widgetName: name,
            widgetFullName: fullName
        });
        if (existingConstructor) {
            $.each(existingConstructor._childConstructors, function (i, child) {
                var childPrototype = child.prototype;
                $.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
            });
            delete existingConstructor._childConstructors;
        } else {
            base._childConstructors.push(constructor);
        }
        $.widget.bridge(name, constructor);
    };
    $.widget.extend = function (target) {
        var input = slice.call(arguments, 1),
            inputIndex = 0,
            inputLength = input.length,
            key, value;
        for (; inputIndex < inputLength; inputIndex++) {
            for (key in input[inputIndex]) {
                value = input[inputIndex][key];
                if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {
                    if ($.isPlainObject(value)) {
                        target[key] = $.isPlainObject(target[key]) ? $.widget.extend({}, target[key], value) : $.widget.extend({}, value);
                    } else {
                        target[key] = value;
                    }
                }
            }
        }
        return target;
    };
    $.widget.bridge = function (name, object) {
        var fullName = object.prototype.widgetFullName || name;
        $.fn[name] = function (options) {
            var isMethodCall = typeof options === "string",
                args = slice.call(arguments, 1),
                returnValue = this;
            options = !isMethodCall && args.length ? $.widget.extend.apply(null, [options].concat(args)) : options;
            if (isMethodCall) {
                this.each(function () {
                    var methodValue, instance = $.data(this, fullName);
                    if (!instance) {
                        return $.error("cannot call methods on " + name + " prior to initialization; " + "attempted to call method '" + options + "'");
                    }
                    if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                        return $.error("no such method '" + options + "' for " + name + " widget instance");
                    }
                    methodValue = instance[options].apply(instance, args);
                    if (methodValue !== instance && methodValue !== undefined) {
                        returnValue = methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function () {
                    var instance = $.data(this, fullName);
                    if (instance) {
                        instance.option(options || {})._init();
                    } else {
                        $.data(this, fullName, new object(options, this));
                    }
                });
            }
            return returnValue;
        };
    };
    $.Widget = function () {};
    $.Widget._childConstructors = [];
    $.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            disabled: false,
            create: null
        },
        _createWidget: function (options, element) {
            element = $(element || this.defaultElement || this)[0];
            this.element = $(element);
            this.uuid = uuid++;
            this.eventNamespace = "." + this.widgetName + this.uuid;
            this.options = $.widget.extend({}, this.options, this._getCreateOptions(), options);
            this.bindings = $();
            this.hoverable = $();
            this.focusable = $();
            if (element !== this) {
                $.data(element, this.widgetFullName, this);
                this._on(true, this.element, {
                    remove: function (event) {
                        if (event.target === element) {
                            this.destroy();
                        }
                    }
                });
                this.document = $(element.style ? element.ownerDocument : element.document || element);
                this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
            }
            this._create();
            this._trigger("create", null, this._getCreateEventData());
            this._init();
        },
        _getCreateOptions: $.noop,
        _getCreateEventData: $.noop,
        _create: $.noop,
        _init: $.noop,
        destroy: function () {
            this._destroy();
            this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData($.camelCase(this.widgetFullName));
            this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled");
            this.bindings.unbind(this.eventNamespace);
            this.hoverable.removeClass("ui-state-hover");
            this.focusable.removeClass("ui-state-focus");
        },
        _destroy: $.noop,
        widget: function () {
            return this.element;
        },
        option: function (key, value) {
            var options = key,
                parts, curOption, i;
            if (arguments.length === 0) {
                return $.widget.extend({}, this.options);
            }
            if (typeof key === "string") {
                options = {};
                parts = key.split(".");
                key = parts.shift();
                if (parts.length) {
                    curOption = options[key] = $.widget.extend({}, this.options[key]);
                    for (i = 0; i < parts.length - 1; i++) {
                        curOption[parts[i]] = curOption[parts[i]] || {};
                        curOption = curOption[parts[i]];
                    }
                    key = parts.pop();
                    if (value === undefined) {
                        return curOption[key] === undefined ? null : curOption[key];
                    }
                    curOption[key] = value;
                } else {
                    if (value === undefined) {
                        return this.options[key] === undefined ? null : this.options[key];
                    }
                    options[key] = value;
                }
            }
            this._setOptions(options);
            return this;
        },
        _setOptions: function (options) {
            var key;
            for (key in options) {
                this._setOption(key, options[key]);
            }
            return this;
        },
        _setOption: function (key, value) {
            this.options[key] = value;
            if (key === "disabled") {
                this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !! value).attr("aria-disabled", value);
                this.hoverable.removeClass("ui-state-hover");
                this.focusable.removeClass("ui-state-focus");
            }
            return this;
        },
        enable: function () {
            return this._setOption("disabled", false);
        },
        disable: function () {
            return this._setOption("disabled", true);
        },
        _on: function (suppressDisabledCheck, element, handlers) {
            var delegateElement, instance = this;
            if (typeof suppressDisabledCheck !== "boolean") {
                handlers = element;
                element = suppressDisabledCheck;
                suppressDisabledCheck = false;
            }
            if (!handlers) {
                handlers = element;
                element = this.element;
                delegateElement = this.widget();
            } else {
                element = delegateElement = $(element);
                this.bindings = this.bindings.add(element);
            }
            $.each(handlers, function (event, handler) {
                function handlerProxy() {
                    if (!suppressDisabledCheck && (instance.options.disabled === true || $(this).hasClass("ui-state-disabled"))) {
                        return;
                    }
                    return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
                }
                if (typeof handler !== "string") {
                    handlerProxy.guid = handler.guid = handler.guid || handlerProxy.guid || $.guid++;
                }
                var match = event.match(/^(\w+)\s*(.*)$/),
                    eventName = match[1] + instance.eventNamespace,
                    selector = match[2];
                if (selector) {
                    delegateElement.delegate(selector, eventName, handlerProxy);
                } else {
                    element.bind(eventName, handlerProxy);
                }
            });
        },
        _off: function (element, eventName) {
            eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
            element.unbind(eventName).undelegate(eventName);
        },
        _delay: function (handler, delay) {
            function handlerProxy() {
                return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
            }
            var instance = this;
            return setTimeout(handlerProxy, delay || 0);
        },
        _hoverable: function (element) {
            this.hoverable = this.hoverable.add(element);
            this._on(element, {
                mouseenter: function (event) {
                    $(event.currentTarget).addClass("ui-state-hover");
                },
                mouseleave: function (event) {
                    $(event.currentTarget).removeClass("ui-state-hover");
                }
            });
        },
        _focusable: function (element) {
            this.focusable = this.focusable.add(element);
            this._on(element, {
                focusin: function (event) {
                    $(event.currentTarget).addClass("ui-state-focus");
                },
                focusout: function (event) {
                    $(event.currentTarget).removeClass("ui-state-focus");
                }
            });
        },
        _trigger: function (type, event, data) {
            var prop, orig, callback = this.options[type];
            data = data || {};
            event = $.Event(event);
            event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase();
            event.target = this.element[0];
            orig = event.originalEvent;
            if (orig) {
                for (prop in orig) {
                    if (!(prop in event)) {
                        event[prop] = orig[prop];
                    }
                }
            }
            this.element.trigger(event, data);
            return !($.isFunction(callback) && callback.apply(this.element[0], [event].concat(data)) === false || event.isDefaultPrevented());
        }
    };
    $.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function (method, defaultEffect) {
        $.Widget.prototype["_" + method] = function (element, options, callback) {
            if (typeof options === "string") {
                options = {
                    effect: options
                };
            }
            var hasOptions, effectName = !options ? method : options === true || typeof options === "number" ? defaultEffect : options.effect || defaultEffect;
            options = options || {};
            if (typeof options === "number") {
                options = {
                    duration: options
                };
            }
            hasOptions = !$.isEmptyObject(options);
            options.complete = callback;
            if (options.delay) {
                element.delay(options.delay);
            }
            if (hasOptions && $.effects && $.effects.effect[effectName]) {
                element[method](options);
            } else if (effectName !== method && element[effectName]) {
                element[effectName](options.duration, options.easing, callback);
            } else {
                element.queue(function (next) {
                    $(this)[method]();
                    if (callback) {
                        callback.call(element[0]);
                    }
                    next();
                });
            }
        };
    });
})(jQuery);;
/*!
 * jQuery UI Position 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */ (function ($, undefined) {
    $.ui = $.ui || {};
    var cachedScrollbarWidth, max = Math.max,
        abs = Math.abs,
        round = Math.round,
        rhorizontal = /left|center|right/,
        rvertical = /top|center|bottom/,
        roffset = /[\+\-]\d+(\.[\d]+)?%?/,
        rposition = /^\w+/,
        rpercent = /%$/,
        _position = $.fn.position;

    function getOffsets(offsets, width, height) {
        return [parseFloat(offsets[0]) * (rpercent.test(offsets[0]) ? width / 100 : 1), parseFloat(offsets[1]) * (rpercent.test(offsets[1]) ? height / 100 : 1)];
    }

    function parseCss(element, property) {
        return parseInt($.css(element, property), 10) || 0;
    }

    function getDimensions(elem) {
        var raw = elem[0];
        if (raw.nodeType === 9) {
            return {
                width: elem.width(),
                height: elem.height(),
                offset: {
                    top: 0,
                    left: 0
                }
            };
        }
        if ($.isWindow(raw)) {
            return {
                width: elem.width(),
                height: elem.height(),
                offset: {
                    top: elem.scrollTop(),
                    left: elem.scrollLeft()
                }
            };
        }
        if (raw.preventDefault) {
            return {
                width: 0,
                height: 0,
                offset: {
                    top: raw.pageY,
                    left: raw.pageX
                }
            };
        }
        return {
            width: elem.outerWidth(),
            height: elem.outerHeight(),
            offset: elem.offset()
        };
    }
    $.position = {
        scrollbarWidth: function () {
            if (cachedScrollbarWidth !== undefined) {
                return cachedScrollbarWidth;
            }
            var w1, w2, div = $("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
                innerDiv = div.children()[0];
            $("body").append(div);
            w1 = innerDiv.offsetWidth;
            div.css("overflow", "scroll");
            w2 = innerDiv.offsetWidth;
            if (w1 === w2) {
                w2 = div[0].clientWidth;
            }
            div.remove();
            return (cachedScrollbarWidth = w1 - w2);
        },
        getScrollInfo: function (within) {
            var overflowX = within.isWindow ? "" : within.element.css("overflow-x"),
                overflowY = within.isWindow ? "" : within.element.css("overflow-y"),
                hasOverflowX = overflowX === "scroll" || (overflowX === "auto" && within.width < within.element[0].scrollWidth),
                hasOverflowY = overflowY === "scroll" || (overflowY === "auto" && within.height < within.element[0].scrollHeight);
            return {
                width: hasOverflowY ? $.position.scrollbarWidth() : 0,
                height: hasOverflowX ? $.position.scrollbarWidth() : 0
            };
        },
        getWithinInfo: function (element) {
            var withinElement = $(element || window),
                isWindow = $.isWindow(withinElement[0]);
            return {
                element: withinElement,
                isWindow: isWindow,
                offset: withinElement.offset() || {
                    left: 0,
                    top: 0
                },
                scrollLeft: withinElement.scrollLeft(),
                scrollTop: withinElement.scrollTop(),
                width: isWindow ? withinElement.width() : withinElement.outerWidth(),
                height: isWindow ? withinElement.height() : withinElement.outerHeight()
            };
        }
    };
    $.fn.position = function (options) {
        if (!options || !options.of) {
            return _position.apply(this, arguments);
        }
        options = $.extend({}, options);
        var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions, target = $(options.of),
            within = $.position.getWithinInfo(options.within),
            scrollInfo = $.position.getScrollInfo(within),
            collision = (options.collision || "flip").split(" "),
            offsets = {};
        dimensions = getDimensions(target);
        if (target[0].preventDefault) {
            options.at = "left top";
        }
        targetWidth = dimensions.width;
        targetHeight = dimensions.height;
        targetOffset = dimensions.offset;
        basePosition = $.extend({}, targetOffset);
        $.each(["my", "at"], function () {
            var pos = (options[this] || "").split(" "),
                horizontalOffset, verticalOffset;
            if (pos.length === 1) {
                pos = rhorizontal.test(pos[0]) ? pos.concat(["center"]) : rvertical.test(pos[0]) ? ["center"].concat(pos) : ["center", "center"];
            }
            pos[0] = rhorizontal.test(pos[0]) ? pos[0] : "center";
            pos[1] = rvertical.test(pos[1]) ? pos[1] : "center";
            horizontalOffset = roffset.exec(pos[0]);
            verticalOffset = roffset.exec(pos[1]);
            offsets[this] = [horizontalOffset ? horizontalOffset[0] : 0, verticalOffset ? verticalOffset[0] : 0];
            options[this] = [rposition.exec(pos[0])[0], rposition.exec(pos[1])[0]];
        });
        if (collision.length === 1) {
            collision[1] = collision[0];
        }
        if (options.at[0] === "right") {
            basePosition.left += targetWidth;
        } else if (options.at[0] === "center") {
            basePosition.left += targetWidth / 2;
        }
        if (options.at[1] === "bottom") {
            basePosition.top += targetHeight;
        } else if (options.at[1] === "center") {
            basePosition.top += targetHeight / 2;
        }
        atOffset = getOffsets(offsets.at, targetWidth, targetHeight);
        basePosition.left += atOffset[0];
        basePosition.top += atOffset[1];
        return this.each(function () {
            var collisionPosition, using, elem = $(this),
                elemWidth = elem.outerWidth(),
                elemHeight = elem.outerHeight(),
                marginLeft = parseCss(this, "marginLeft"),
                marginTop = parseCss(this, "marginTop"),
                collisionWidth = elemWidth + marginLeft + parseCss(this, "marginRight") + scrollInfo.width,
                collisionHeight = elemHeight + marginTop + parseCss(this, "marginBottom") + scrollInfo.height,
                position = $.extend({}, basePosition),
                myOffset = getOffsets(offsets.my, elem.outerWidth(), elem.outerHeight());
            if (options.my[0] === "right") {
                position.left -= elemWidth;
            } else if (options.my[0] === "center") {
                position.left -= elemWidth / 2;
            }
            if (options.my[1] === "bottom") {
                position.top -= elemHeight;
            } else if (options.my[1] === "center") {
                position.top -= elemHeight / 2;
            }
            position.left += myOffset[0];
            position.top += myOffset[1];
            if (!$.support.offsetFractions) {
                position.left = round(position.left);
                position.top = round(position.top);
            }
            collisionPosition = {
                marginLeft: marginLeft,
                marginTop: marginTop
            };
            $.each(["left", "top"], function (i, dir) {
                if ($.ui.position[collision[i]]) {
                    $.ui.position[collision[i]][dir](position, {
                        targetWidth: targetWidth,
                        targetHeight: targetHeight,
                        elemWidth: elemWidth,
                        elemHeight: elemHeight,
                        collisionPosition: collisionPosition,
                        collisionWidth: collisionWidth,
                        collisionHeight: collisionHeight,
                        offset: [atOffset[0] + myOffset[0], atOffset[1] + myOffset[1]],
                        my: options.my,
                        at: options.at,
                        within: within,
                        elem: elem
                    });
                }
            });
            if (options.using) {
                using = function (props) {
                    var left = targetOffset.left - position.left,
                        right = left + targetWidth - elemWidth,
                        top = targetOffset.top - position.top,
                        bottom = top + targetHeight - elemHeight,
                        feedback = {
                            target: {
                                element: target,
                                left: targetOffset.left,
                                top: targetOffset.top,
                                width: targetWidth,
                                height: targetHeight
                            },
                            element: {
                                element: elem,
                                left: position.left,
                                top: position.top,
                                width: elemWidth,
                                height: elemHeight
                            },
                            horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
                            vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
                        };
                    if (targetWidth < elemWidth && abs(left + right) < targetWidth) {
                        feedback.horizontal = "center";
                    }
                    if (targetHeight < elemHeight && abs(top + bottom) < targetHeight) {
                        feedback.vertical = "middle";
                    }
                    if (max(abs(left), abs(right)) > max(abs(top), abs(bottom))) {
                        feedback.important = "horizontal";
                    } else {
                        feedback.important = "vertical";
                    }
                    options.using.call(this, props, feedback);
                };
            }
            elem.offset($.extend(position, {
                using: using
            }));
        });
    };
    $.ui.position = {
        fit: {
            left: function (position, data) {
                var within = data.within,
                    withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
                    outerWidth = within.width,
                    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                    overLeft = withinOffset - collisionPosLeft,
                    overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
                    newOverRight;
                if (data.collisionWidth > outerWidth) {
                    if (overLeft > 0 && overRight <= 0) {
                        newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
                        position.left += overLeft - newOverRight;
                    } else if (overRight > 0 && overLeft <= 0) {
                        position.left = withinOffset;
                    } else {
                        if (overLeft > overRight) {
                            position.left = withinOffset + outerWidth - data.collisionWidth;
                        } else {
                            position.left = withinOffset;
                        }
                    }
                } else if (overLeft > 0) {
                    position.left += overLeft;
                } else if (overRight > 0) {
                    position.left -= overRight;
                } else {
                    position.left = max(position.left - collisionPosLeft, position.left);
                }
            },
            top: function (position, data) {
                var within = data.within,
                    withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
                    outerHeight = data.within.height,
                    collisionPosTop = position.top - data.collisionPosition.marginTop,
                    overTop = withinOffset - collisionPosTop,
                    overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
                    newOverBottom;
                if (data.collisionHeight > outerHeight) {
                    if (overTop > 0 && overBottom <= 0) {
                        newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
                        position.top += overTop - newOverBottom;
                    } else if (overBottom > 0 && overTop <= 0) {
                        position.top = withinOffset;
                    } else {
                        if (overTop > overBottom) {
                            position.top = withinOffset + outerHeight - data.collisionHeight;
                        } else {
                            position.top = withinOffset;
                        }
                    }
                } else if (overTop > 0) {
                    position.top += overTop;
                } else if (overBottom > 0) {
                    position.top -= overBottom;
                } else {
                    position.top = max(position.top - collisionPosTop, position.top);
                }
            }
        },
        flip: {
            left: function (position, data) {
                var within = data.within,
                    withinOffset = within.offset.left + within.scrollLeft,
                    outerWidth = within.width,
                    offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
                    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                    overLeft = collisionPosLeft - offsetLeft,
                    overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
                    myOffset = data.my[0] === "left" ? -data.elemWidth : data.my[0] === "right" ? data.elemWidth : 0,
                    atOffset = data.at[0] === "left" ? data.targetWidth : data.at[0] === "right" ? -data.targetWidth : 0,
                    offset = -2 * data.offset[0],
                    newOverRight, newOverLeft;
                if (overLeft < 0) {
                    newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
                    if (newOverRight < 0 || newOverRight < abs(overLeft)) {
                        position.left += myOffset + atOffset + offset;
                    }
                } else if (overRight > 0) {
                    newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
                    if (newOverLeft > 0 || abs(newOverLeft) < overRight) {
                        position.left += myOffset + atOffset + offset;
                    }
                }
            },
            top: function (position, data) {
                var within = data.within,
                    withinOffset = within.offset.top + within.scrollTop,
                    outerHeight = within.height,
                    offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
                    collisionPosTop = position.top - data.collisionPosition.marginTop,
                    overTop = collisionPosTop - offsetTop,
                    overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
                    top = data.my[1] === "top",
                    myOffset = top ? -data.elemHeight : data.my[1] === "bottom" ? data.elemHeight : 0,
                    atOffset = data.at[1] === "top" ? data.targetHeight : data.at[1] === "bottom" ? -data.targetHeight : 0,
                    offset = -2 * data.offset[1],
                    newOverTop, newOverBottom;
                if (overTop < 0) {
                    newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
                    if ((position.top + myOffset + atOffset + offset) > overTop && (newOverBottom < 0 || newOverBottom < abs(overTop))) {
                        position.top += myOffset + atOffset + offset;
                    }
                } else if (overBottom > 0) {
                    newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
                    if ((position.top + myOffset + atOffset + offset) > overBottom && (newOverTop > 0 || abs(newOverTop) < overBottom)) {
                        position.top += myOffset + atOffset + offset;
                    }
                }
            }
        },
        flipfit: {
            left: function () {
                $.ui.position.flip.left.apply(this, arguments);
                $.ui.position.fit.left.apply(this, arguments);
            },
            top: function () {
                $.ui.position.flip.top.apply(this, arguments);
                $.ui.position.fit.top.apply(this, arguments);
            }
        }
    };
    (function () {
        var testElement, testElementParent, testElementStyle, offsetLeft, i, body = document.getElementsByTagName("body")[0],
            div = document.createElement("div");
        testElement = document.createElement(body ? "div" : "body");
        testElementStyle = {
            visibility: "hidden",
            width: 0,
            height: 0,
            border: 0,
            margin: 0,
            background: "none"
        };
        if (body) {
            $.extend(testElementStyle, {
                position: "absolute",
                left: "-1000px",
                top: "-1000px"
            });
        }
        for (i in testElementStyle) {
            testElement.style[i] = testElementStyle[i];
        }
        testElement.appendChild(div);
        testElementParent = body || document.documentElement;
        testElementParent.insertBefore(testElement, testElementParent.firstChild);
        div.style.cssText = "position: absolute; left: 10.7432222px;";
        offsetLeft = $(div).offset().left;
        $.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;
        testElement.innerHTML = "";
        testElementParent.removeChild(testElement);
    })();
}(jQuery));;
/*!
 * jQuery UI Mouse 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 *
 * Depends:
 * jquery.ui.widget.js
 */ (function ($, undefined) {
    var mouseHandled = false;
    $(document).mouseup(function () {
        mouseHandled = false;
    });
    $.widget("ui.mouse", {
        version: "1.10.3",
        options: {
            cancel: "input,textarea,button,select,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function () {
            var that = this;
            this.element.bind("mousedown." + this.widgetName, function (event) {
                return that._mouseDown(event);
            }).bind("click." + this.widgetName, function (event) {
                if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
                    $.removeData(event.target, that.widgetName + ".preventClickEvent");
                    event.stopImmediatePropagation();
                    return false;
                }
            });
            this.started = false;
        },
        _mouseDestroy: function () {
            this.element.unbind("." + this.widgetName);
            if (this._mouseMoveDelegate) {
                $(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            }
        },
        _mouseDown: function (event) {
            if (mouseHandled) {
                return;
            }
            (this._mouseStarted && this._mouseUp(event));
            this._mouseDownEvent = event;
            var that = this,
                btnIsLeft = (event.which === 1),
                elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
            if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
                return true;
            }
            this.mouseDelayMet = !this.options.delay;
            if (!this.mouseDelayMet) {
                this._mouseDelayTimer = setTimeout(function () {
                    that.mouseDelayMet = true;
                }, this.options.delay);
            }
            if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                this._mouseStarted = (this._mouseStart(event) !== false);
                if (!this._mouseStarted) {
                    event.preventDefault();
                    return true;
                }
            }
            if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
                $.removeData(event.target, this.widgetName + ".preventClickEvent");
            }
            this._mouseMoveDelegate = function (event) {
                return that._mouseMove(event);
            };
            this._mouseUpDelegate = function (event) {
                return that._mouseUp(event);
            };
            $(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
            event.preventDefault();
            mouseHandled = true;
            return true;
        },
        _mouseMove: function (event) {
            if ($.ui.ie && (!document.documentMode || document.documentMode < 9) && !event.button) {
                return this._mouseUp(event);
            }
            if (this._mouseStarted) {
                this._mouseDrag(event);
                return event.preventDefault();
            }
            if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                this._mouseStarted = (this._mouseStart(this._mouseDownEvent, event) !== false);
                (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
            }
            return !this._mouseStarted;
        },
        _mouseUp: function (event) {
            $(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            if (this._mouseStarted) {
                this._mouseStarted = false;
                if (event.target === this._mouseDownEvent.target) {
                    $.data(event.target, this.widgetName + ".preventClickEvent", true);
                }
                this._mouseStop(event);
            }
            return false;
        },
        _mouseDistanceMet: function (event) {
            return (Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance);
        },
        _mouseDelayMet: function () {
            return this.mouseDelayMet;
        },
        _mouseStart: function () {},
        _mouseDrag: function () {},
        _mouseStop: function () {},
        _mouseCapture: function () {
            return true;
        }
    });
})(jQuery);;
/*!
 * jQuery UI Button 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/button/
 *
 * Depends:
 * jquery.ui.core.js
 * jquery.ui.widget.js
 */ (function ($, undefined) {
    var lastActive, startXPos, startYPos, clickDragged, baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
        stateClasses = "ui-state-hover ui-state-active ",
        typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
        formResetHandler = function () {
            var form = $(this);
            setTimeout(function () {
                form.find(":ui-button").button("refresh");
            }, 1);
        }, radioGroup = function (radio) {
            var name = radio.name,
                form = radio.form,
                radios = $([]);
            if (name) {
                name = name.replace(/'/g, "\\'");
                if (form) {
                    radios = $(form).find("[name='" + name + "']");
                } else {
                    radios = $("[name='" + name + "']", radio.ownerDocument).filter(function () {
                        return !this.form;
                    });
                }
            }
            return radios;
        };
    $.widget("ui.button", {
        version: "1.10.3",
        defaultElement: "<button>",
        options: {
            disabled: null,
            text: true,
            label: null,
            icons: {
                primary: null,
                secondary: null
            }
        },
        _create: function () {
            this.element.closest("form").unbind("reset" + this.eventNamespace).bind("reset" + this.eventNamespace, formResetHandler);
            if (typeof this.options.disabled !== "boolean") {
                this.options.disabled = !! this.element.prop("disabled");
            } else {
                this.element.prop("disabled", this.options.disabled);
            }
            this._determineButtonType();
            this.hasTitle = !! this.buttonElement.attr("title");
            var that = this,
                options = this.options,
                toggleButton = this.type === "checkbox" || this.type === "radio",
                activeClass = !toggleButton ? "ui-state-active" : "",
                focusClass = "ui-state-focus";
            if (options.label === null) {
                options.label = (this.type === "input" ? this.buttonElement.val() : this.buttonElement.html());
            }
            this._hoverable(this.buttonElement);
            this.buttonElement.addClass(baseClasses).attr("role", "button").bind("mouseenter" + this.eventNamespace, function () {
                if (options.disabled) {
                    return;
                }
                if (this === lastActive) {
                    $(this).addClass("ui-state-active");
                }
            }).bind("mouseleave" + this.eventNamespace, function () {
                if (options.disabled) {
                    return;
                }
                $(this).removeClass(activeClass);
            }).bind("click" + this.eventNamespace, function (event) {
                if (options.disabled) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
            });
            this.element.bind("focus" + this.eventNamespace, function () {
                that.buttonElement.addClass(focusClass);
            }).bind("blur" + this.eventNamespace, function () {
                that.buttonElement.removeClass(focusClass);
            });
            if (toggleButton) {
                this.element.bind("change" + this.eventNamespace, function () {
                    if (clickDragged) {
                        return;
                    }
                    that.refresh();
                });
                this.buttonElement.bind("mousedown" + this.eventNamespace, function (event) {
                    if (options.disabled) {
                        return;
                    }
                    clickDragged = false;
                    startXPos = event.pageX;
                    startYPos = event.pageY;
                }).bind("mouseup" + this.eventNamespace, function (event) {
                    if (options.disabled) {
                        return;
                    }
                    if (startXPos !== event.pageX || startYPos !== event.pageY) {
                        clickDragged = true;
                    }
                });
            }
            if (this.type === "checkbox") {
                this.buttonElement.bind("click" + this.eventNamespace, function () {
                    if (options.disabled || clickDragged) {
                        return false;
                    }
                });
            } else if (this.type === "radio") {
                this.buttonElement.bind("click" + this.eventNamespace, function () {
                    if (options.disabled || clickDragged) {
                        return false;
                    }
                    $(this).addClass("ui-state-active");
                    that.buttonElement.attr("aria-pressed", "true");
                    var radio = that.element[0];
                    radioGroup(radio).not(radio).map(function () {
                        return $(this).button("widget")[0];
                    }).removeClass("ui-state-active").attr("aria-pressed", "false");
                });
            } else {
                this.buttonElement.bind("mousedown" + this.eventNamespace, function () {
                    if (options.disabled) {
                        return false;
                    }
                    $(this).addClass("ui-state-active");
                    lastActive = this;
                    that.document.one("mouseup", function () {
                        lastActive = null;
                    });
                }).bind("mouseup" + this.eventNamespace, function () {
                    if (options.disabled) {
                        return false;
                    }
                    $(this).removeClass("ui-state-active");
                }).bind("keydown" + this.eventNamespace, function (event) {
                    if (options.disabled) {
                        return false;
                    }
                    if (event.keyCode === $.ui.keyCode.SPACE || event.keyCode === $.ui.keyCode.ENTER) {
                        $(this).addClass("ui-state-active");
                    }
                }).bind("keyup" + this.eventNamespace + " blur" + this.eventNamespace, function () {
                    $(this).removeClass("ui-state-active");
                });
                if (this.buttonElement.is("a")) {
                    this.buttonElement.keyup(function (event) {
                        if (event.keyCode === $.ui.keyCode.SPACE) {
                            $(this).click();
                        }
                    });
                }
            }
            this._setOption("disabled", options.disabled);
            this._resetButton();
        },
        _determineButtonType: function () {
            var ancestor, labelSelector, checked;
            if (this.element.is("[type=checkbox]")) {
                this.type = "checkbox";
            } else if (this.element.is("[type=radio]")) {
                this.type = "radio";
            } else if (this.element.is("input")) {
                this.type = "input";
            } else {
                this.type = "button";
            }
            if (this.type === "checkbox" || this.type === "radio") {
                ancestor = this.element.parents().last();
                labelSelector = "label[for='" + this.element.attr("id") + "']";
                this.buttonElement = ancestor.find(labelSelector);
                if (!this.buttonElement.length) {
                    ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();
                    this.buttonElement = ancestor.filter(labelSelector);
                    if (!this.buttonElement.length) {
                        this.buttonElement = ancestor.find(labelSelector);
                    }
                }
                this.element.addClass("ui-helper-hidden-accessible");
                checked = this.element.is(":checked");
                if (checked) {
                    this.buttonElement.addClass("ui-state-active");
                }
                this.buttonElement.prop("aria-pressed", checked);
            } else {
                this.buttonElement = this.element;
            }
        },
        widget: function () {
            return this.buttonElement;
        },
        _destroy: function () {
            this.element.removeClass("ui-helper-hidden-accessible");
            this.buttonElement.removeClass(baseClasses + " " + stateClasses + " " + typeClasses).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());
            if (!this.hasTitle) {
                this.buttonElement.removeAttr("title");
            }
        },
        _setOption: function (key, value) {
            this._super(key, value);
            if (key === "disabled") {
                if (value) {
                    this.element.prop("disabled", true);
                } else {
                    this.element.prop("disabled", false);
                }
                return;
            }
            this._resetButton();
        },
        refresh: function () {
            var isDisabled = this.element.is("input, button") ? this.element.is(":disabled") : this.element.hasClass("ui-button-disabled");
            if (isDisabled !== this.options.disabled) {
                this._setOption("disabled", isDisabled);
            }
            if (this.type === "radio") {
                radioGroup(this.element[0]).each(function () {
                    if ($(this).is(":checked")) {
                        $(this).button("widget").addClass("ui-state-active").attr("aria-pressed", "true");
                    } else {
                        $(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", "false");
                    }
                });
            } else if (this.type === "checkbox") {
                if (this.element.is(":checked")) {
                    this.buttonElement.addClass("ui-state-active").attr("aria-pressed", "true");
                } else {
                    this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", "false");
                }
            }
        },
        _resetButton: function () {
            if (this.type === "input") {
                if (this.options.label) {
                    this.element.val(this.options.label);
                }
                return;
            }
            var buttonElement = this.buttonElement.removeClass(typeClasses),
                buttonText = $("<span></span>", this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(buttonElement.empty()).text(),
                icons = this.options.icons,
                multipleIcons = icons.primary && icons.secondary,
                buttonClasses = [];
            if (icons.primary || icons.secondary) {
                if (this.options.text) {
                    buttonClasses.push("ui-button-text-icon" + (multipleIcons ? "s" : (icons.primary ? "-primary" : "-secondary")));
                }
                if (icons.primary) {
                    buttonElement.prepend("<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>");
                }
                if (icons.secondary) {
                    buttonElement.append("<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>");
                }
                if (!this.options.text) {
                    buttonClasses.push(multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only");
                    if (!this.hasTitle) {
                        buttonElement.attr("title", $.trim(buttonText));
                    }
                }
            } else {
                buttonClasses.push("ui-button-text-only");
            }
            buttonElement.addClass(buttonClasses.join(" "));
        }
    });
    $.widget("ui.buttonset", {
        version: "1.10.3",
        options: {
            items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"
        },
        _create: function () {
            this.element.addClass("ui-buttonset");
        },
        _init: function () {
            this.refresh();
        },
        _setOption: function (key, value) {
            if (key === "disabled") {
                this.buttons.button("option", key, value);
            }
            this._super(key, value);
        },
        refresh: function () {
            var rtl = this.element.css("direction") === "rtl";
            this.buttons = this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function () {
                return $(this).button("widget")[0];
            }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(rtl ? "ui-corner-right" : "ui-corner-left").end().filter(":last").addClass(rtl ? "ui-corner-left" : "ui-corner-right").end().end();
        },
        _destroy: function () {
            this.element.removeClass("ui-buttonset");
            this.buttons.map(function () {
                return $(this).button("widget")[0];
            }).removeClass("ui-corner-left ui-corner-right").end().button("destroy");
        }
    });
}(jQuery));;
/*!
 * jQuery UI Dialog 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/dialog/
 *
 * Depends:
 * jquery.ui.core.js
 * jquery.ui.widget.js
 *  jquery.ui.button.js
 * jquery.ui.draggable.js
 * jquery.ui.mouse.js
 * jquery.ui.position.js
 * jquery.ui.resizable.js
 */ (function ($, undefined) {
    var sizeRelatedOptions = {
        buttons: true,
        height: true,
        maxHeight: true,
        maxWidth: true,
        minHeight: true,
        minWidth: true,
        width: true
    }, resizableRelatedOptions = {
        maxHeight: true,
        maxWidth: true,
        minHeight: true,
        minWidth: true
    };
    $.widget("ui.dialog", {
        version: "1.10.3",
        options: {
            appendTo: "body",
            autoOpen: true,
            buttons: [],
            closeOnEscape: true,
            closeText: "close",
            dialogClass: "",
            draggable: true,
            hide: null,
            height: "auto",
            maxHeight: null,
            maxWidth: null,
            minHeight: 150,
            minWidth: 150,
            modal: false,
            position: {
                my: "center",
                at: "center",
                of: window,
                collision: "fit",
                using: function (pos) {
                    var topOffset = $(this).css(pos).offset().top;
                    if (topOffset < 0) {
                        $(this).css("top", pos.top - topOffset);
                    }
                }
            },
            resizable: false,
            show: null,
            title: null,
            width: 300,
            beforeClose: null,
            close: null,
            drag: null,
            dragStart: null,
            dragStop: null,
            focus: null,
            open: null,
            resize: null,
            resizeStart: null,
            resizeStop: null
        },
        _create: function () {
            this.originalCss = {
                display: this.element[0].style.display,
                width: this.element[0].style.width,
                minHeight: this.element[0].style.minHeight,
                maxHeight: this.element[0].style.maxHeight,
                height: this.element[0].style.height
            };
            this.originalPosition = {
                parent: this.element.parent(),
                index: this.element.parent().children().index(this.element)
            };
            this.originalTitle = this.element.attr("title");
            this.options.title = this.options.title || this.originalTitle;
            this._createWrapper();
            this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog);
            this._createTitlebar();
            this._createButtonPane();
            if (this.options.draggable && $.fn.draggable) {
                this._makeDraggable();
            }
            if (this.options.resizable && $.fn.resizable) {
                this._makeResizable();
            }
            this._isOpen = false;
        },
        _init: function () {
            if (this.options.autoOpen) {
                this.open();
            }
        },
        _appendTo: function () {
            var element = this.options.appendTo;
            if (element && (element.jquery || element.nodeType)) {
                return $(element);
            }
            return this.document.find(element || "body").eq(0);
        },
        _destroy: function () {
            var next, originalPosition = this.originalPosition;
            this._destroyOverlay();
            this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach();
            this.uiDialog.stop(true, true).remove();
            if (this.originalTitle) {
                this.element.attr("title", this.originalTitle);
            }
            next = originalPosition.parent.children().eq(originalPosition.index);
            if (next.length && next[0] !== this.element[0]) {
                next.before(this.element);
            } else {
                originalPosition.parent.append(this.element);
            }
        },
        widget: function () {
            return this.uiDialog;
        },
        disable: $.noop,
        enable: $.noop,
        close: function (event) {
            var that = this;
            if (!this._isOpen || this._trigger("beforeClose", event) === false) {
                return;
            }
            this._isOpen = false;
            this._destroyOverlay();
            if (!this.opener.filter(":focusable").focus().length) {
                $(this.document[0].activeElement).blur();
            }
            this._hide(this.uiDialog, this.options.hide, function () {
                that._trigger("close", event);
            });
        },
        isOpen: function () {
            return this._isOpen;
        },
        moveToTop: function () {
            this._moveToTop();
        },
        _moveToTop: function (event, silent) {
            var moved = !! this.uiDialog.nextAll(":visible").insertBefore(this.uiDialog).length;
            if (moved && !silent) {
                this._trigger("focus", event);
            }
            return moved;
        },
        open: function () {
            var that = this;
            if (this._isOpen) {
                if (this._moveToTop()) {
                    this._focusTabbable();
                }
                return;
            }
            this._isOpen = true;
            this.opener = $(this.document[0].activeElement);
            this._size();
            this._position();
            this._createOverlay();
            this._moveToTop(null, true);
            this._show(this.uiDialog, this.options.show, function () {
                that._focusTabbable();
                that._trigger("focus");
            });
            this._trigger("open");
        },
        _focusTabbable: function () {
            var hasFocus = this.element.find("[autofocus]");
            if (!hasFocus.length) {
                hasFocus = this.element.find(":tabbable");
            }
            if (!hasFocus.length) {
                hasFocus = this.uiDialogButtonPane.find(":tabbable");
            }
            if (!hasFocus.length) {
                hasFocus = this.uiDialogTitlebarClose.filter(":tabbable");
            }
            if (!hasFocus.length) {
                hasFocus = this.uiDialog;
            }
            hasFocus.eq(0).focus();
        },
        _keepFocus: function (event) {
            function checkFocus() {
                var activeElement = this.document[0].activeElement,
                    isActive = this.uiDialog[0] === activeElement || $.contains(this.uiDialog[0], activeElement);
                if (!isActive) {
                    this._focusTabbable();
                }
            }
            event.preventDefault();
            checkFocus.call(this);
            this._delay(checkFocus);
        },
        _createWrapper: function () {
            this.uiDialog = $("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front " + this.options.dialogClass).hide().attr({
                tabIndex: -1,
                role: "dialog"
            }).appendTo(this._appendTo());
            this._on(this.uiDialog, {
                keydown: function (event) {
                    if (this.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode && event.keyCode === $.ui.keyCode.ESCAPE) {
                        event.preventDefault();
                        this.close(event);
                        return;
                    }
                    if (event.keyCode !== $.ui.keyCode.TAB) {
                        return;
                    }
                    var tabbables = this.uiDialog.find(":tabbable"),
                        first = tabbables.filter(":first"),
                        last = tabbables.filter(":last");
                    if ((event.target === last[0] || event.target === this.uiDialog[0]) && !event.shiftKey) {
                        first.focus(1);
                        event.preventDefault();
                    } else if ((event.target === first[0] || event.target === this.uiDialog[0]) && event.shiftKey) {
                        last.focus(1);
                        event.preventDefault();
                    }
                },
                mousedown: function (event) {
                    if (this._moveToTop(event)) {
                        this._focusTabbable();
                    }
                }
            });
            if (!this.element.find("[aria-describedby]").length) {
                this.uiDialog.attr({
                    "aria-describedby": this.element.uniqueId().attr("id")
                });
            }
        },
        _createTitlebar: function () {
            var uiDialogTitle;
            this.uiDialogTitlebar = $("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog);
            this._on(this.uiDialogTitlebar, {
                mousedown: function (event) {
                    if (!$(event.target).closest(".ui-dialog-titlebar-close")) {
                        this.uiDialog.focus();
                    }
                }
            });
            this.uiDialogTitlebarClose = $("<button></button>").button({
                label: this.options.closeText,
                icons: {
                    primary: "ui-icon-closethick"
                },
                text: false
            }).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar);
            this._on(this.uiDialogTitlebarClose, {
                click: function (event) {
                    event.preventDefault();
                    this.close(event);
                }
            });
            uiDialogTitle = $("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar);
            this._title(uiDialogTitle);
            this.uiDialog.attr({
                "aria-labelledby": uiDialogTitle.attr("id")
            });
        },
        _title: function (title) {
            if (!this.options.title) {
                title.html("&#160;");
            }
            title.text(this.options.title);
        },
        _createButtonPane: function () {
            this.uiDialogButtonPane = $("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix");
            this.uiButtonSet = $("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane);
            this._createButtons();
        },
        _createButtons: function () {
            var that = this,
                buttons = this.options.buttons;
            this.uiDialogButtonPane.remove();
            this.uiButtonSet.empty();
            if ($.isEmptyObject(buttons) || ($.isArray(buttons) && !buttons.length)) {
                this.uiDialog.removeClass("ui-dialog-buttons");
                return;
            }
            $.each(buttons, function (name, props) {
                var click, buttonOptions;
                props = $.isFunction(props) ? {
                    click: props,
                    text: name
                } : props;
                props = $.extend({
                    type: "button"
                }, props);
                click = props.click;
                props.click = function () {
                    click.apply(that.element[0], arguments);
                };
                buttonOptions = {
                    icons: props.icons,
                    text: props.showText
                };
                delete props.icons;
                delete props.showText;
                $("<button></button>", props).button(buttonOptions).appendTo(that.uiButtonSet);
            });
            this.uiDialog.addClass("ui-dialog-buttons");
            this.uiDialogButtonPane.appendTo(this.uiDialog);
        },
        _makeDraggable: function () {
            var that = this,
                options = this.options;

            function filteredUi(ui) {
                return {
                    position: ui.position,
                    offset: ui.offset
                };
            }
            this.uiDialog.draggable({
                cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
                handle: ".ui-dialog-titlebar",
                containment: "document",
                start: function (event, ui) {
                    $(this).addClass("ui-dialog-dragging");
                    that._blockFrames();
                    that._trigger("dragStart", event, filteredUi(ui));
                },
                drag: function (event, ui) {
                    that._trigger("drag", event, filteredUi(ui));
                },
                stop: function (event, ui) {
                    options.position = [ui.position.left - that.document.scrollLeft(), ui.position.top - that.document.scrollTop()];
                    $(this).removeClass("ui-dialog-dragging");
                    that._unblockFrames();
                    that._trigger("dragStop", event, filteredUi(ui));
                }
            });
        },
        _makeResizable: function () {
            var that = this,
                options = this.options,
                handles = options.resizable,
                position = this.uiDialog.css("position"),
                resizeHandles = typeof handles === "string" ? handles : "n,e,s,w,se,sw,ne,nw";

            function filteredUi(ui) {
                return {
                    originalPosition: ui.originalPosition,
                    originalSize: ui.originalSize,
                    position: ui.position,
                    size: ui.size
                };
            }
            this.uiDialog.resizable({
                cancel: ".ui-dialog-content",
                containment: "document",
                alsoResize: this.element,
                maxWidth: options.maxWidth,
                maxHeight: options.maxHeight,
                minWidth: options.minWidth,
                minHeight: this._minHeight(),
                handles: resizeHandles,
                start: function (event, ui) {
                    $(this).addClass("ui-dialog-resizing");
                    that._blockFrames();
                    that._trigger("resizeStart", event, filteredUi(ui));
                },
                resize: function (event, ui) {
                    that._trigger("resize", event, filteredUi(ui));
                },
                stop: function (event, ui) {
                    options.height = $(this).height();
                    options.width = $(this).width();
                    $(this).removeClass("ui-dialog-resizing");
                    that._unblockFrames();
                    that._trigger("resizeStop", event, filteredUi(ui));
                }
            }).css("position", position);
        },
        _minHeight: function () {
            var options = this.options;
            return options.height === "auto" ? options.minHeight : Math.min(options.minHeight, options.height);
        },
        _position: function () {
            var isVisible = this.uiDialog.is(":visible");
            if (!isVisible) {
                this.uiDialog.show();
            }
            this.uiDialog.position(this.options.position);
            if (!isVisible) {
                this.uiDialog.hide();
            }
        },
        _setOptions: function (options) {
            var that = this,
                resize = false,
                resizableOptions = {};
            $.each(options, function (key, value) {
                that._setOption(key, value);
                if (key in sizeRelatedOptions) {
                    resize = true;
                }
                if (key in resizableRelatedOptions) {
                    resizableOptions[key] = value;
                }
            });
            if (resize) {
                this._size();
                this._position();
            }
            if (this.uiDialog.is(":data(ui-resizable)")) {
                this.uiDialog.resizable("option", resizableOptions);
            }
        },
        _setOption: function (key, value) {
            var isDraggable, isResizable, uiDialog = this.uiDialog;
            if (key === "dialogClass") {
                uiDialog.removeClass(this.options.dialogClass).addClass(value);
            }
            if (key === "disabled") {
                return;
            }
            this._super(key, value);
            if (key === "appendTo") {
                this.uiDialog.appendTo(this._appendTo());
            }
            if (key === "buttons") {
                this._createButtons();
            }
            if (key === "closeText") {
                this.uiDialogTitlebarClose.button({
                    label: "" + value
                });
            }
            if (key === "draggable") {
                isDraggable = uiDialog.is(":data(ui-draggable)");
                if (isDraggable && !value) {
                    uiDialog.draggable("destroy");
                }
                if (!isDraggable && value) {
                    this._makeDraggable();
                }
            }
            if (key === "position") {
                this._position();
            }
            if (key === "resizable") {
                isResizable = uiDialog.is(":data(ui-resizable)");
                if (isResizable && !value) {
                    uiDialog.resizable("destroy");
                }
                if (isResizable && typeof value === "string") {
                    uiDialog.resizable("option", "handles", value);
                }
                if (!isResizable && value !== false) {
                    this._makeResizable();
                }
            }
            if (key === "title") {
                this._title(this.uiDialogTitlebar.find(".ui-dialog-title"));
            }
        },
        _size: function () {
            var nonContentHeight, minContentHeight, maxContentHeight, options = this.options;
            this.element.show().css({
                width: "auto",
                minHeight: 0,
                maxHeight: "none",
                height: 0
            });
            if (options.minWidth > options.width) {
                options.width = options.minWidth;
            }
            nonContentHeight = this.uiDialog.css({
                height: "auto",
                width: options.width
            }).outerHeight();
            minContentHeight = Math.max(0, options.minHeight - nonContentHeight);
            maxContentHeight = typeof options.maxHeight === "number" ? Math.max(0, options.maxHeight - nonContentHeight) : "none";
            if (options.height === "auto") {
                this.element.css({
                    minHeight: minContentHeight,
                    maxHeight: maxContentHeight,
                    height: "auto"
                });
            } else {
                this.element.height(Math.max(0, options.height - nonContentHeight));
            }
            if (this.uiDialog.is(":data(ui-resizable)")) {
                this.uiDialog.resizable("option", "minHeight", this._minHeight());
            }
        },
        _blockFrames: function () {
            this.iframeBlocks = this.document.find("iframe").map(function () {
                var iframe = $(this);
                return $("<div>").css({
                    position: "absolute",
                    width: iframe.outerWidth(),
                    height: iframe.outerHeight()
                }).appendTo(iframe.parent()).offset(iframe.offset())[0];
            });
        },
        _unblockFrames: function () {
            if (this.iframeBlocks) {
                this.iframeBlocks.remove();
                delete this.iframeBlocks;
            }
        },
        _allowInteraction: function (event) {
            if ($(event.target).closest(".ui-dialog").length) {
                return true;
            }
            return !!$(event.target).closest(".ui-datepicker").length;
        },
        _createOverlay: function () {
            if (!this.options.modal) {
                return;
            }
            var that = this,
                widgetFullName = this.widgetFullName;
            if (!$.ui.dialog.overlayInstances) {
                this._delay(function () {
                    if ($.ui.dialog.overlayInstances) {
                        this.document.bind("focusin.dialog", function (event) {
                            if (!that._allowInteraction(event)) {
                                event.preventDefault();
                                $(".ui-dialog:visible:last .ui-dialog-content").data(widgetFullName)._focusTabbable();
                            }
                        });
                    }
                });
            }
            this.overlay = $("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo());
            this._on(this.overlay, {
                mousedown: "_keepFocus"
            });
            $.ui.dialog.overlayInstances++;
        },
        _destroyOverlay: function () {
            if (!this.options.modal) {
                return;
            }
            if (this.overlay) {
                $.ui.dialog.overlayInstances--;
                if (!$.ui.dialog.overlayInstances) {
                    this.document.unbind("focusin.dialog");
                }
                this.overlay.remove();
                this.overlay = null;
            }
        }
    });
    $.ui.dialog.overlayInstances = 0;
    if ($.uiBackCompat !== false) {
        $.widget("ui.dialog", $.ui.dialog, {
            _position: function () {
                var position = this.options.position,
                    myAt = [],
                    offset = [0, 0],
                    isVisible;
                if (position) {
                    if (typeof position === "string" || (typeof position === "object" && "0" in position)) {
                        myAt = position.split ? position.split(" ") : [position[0], position[1]];
                        if (myAt.length === 1) {
                            myAt[1] = myAt[0];
                        }
                        $.each(["left", "top"], function (i, offsetPosition) {
                            if (+myAt[i] === myAt[i]) {
                                offset[i] = myAt[i];
                                myAt[i] = offsetPosition;
                            }
                        });
                        position = {
                            my: myAt[0] + (offset[0] < 0 ? offset[0] : "+" + offset[0]) + " " + myAt[1] + (offset[1] < 0 ? offset[1] : "+" + offset[1]),
                            at: myAt.join(" ")
                        };
                    }
                    position = $.extend({}, $.ui.dialog.prototype.options.position, position);
                } else {
                    position = $.ui.dialog.prototype.options.position;
                }
                isVisible = this.uiDialog.is(":visible");
                if (!isVisible) {
                    this.uiDialog.show();
                }
                this.uiDialog.position(position);
                if (!isVisible) {
                    this.uiDialog.hide();
                }
            }
        });
    }
}(jQuery));;
/*!
 * jQuery UI Slider 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/slider/
 *
 * Depends:
 * jquery.ui.core.js
 * jquery.ui.mouse.js
 * jquery.ui.widget.js
 */ (function ($, undefined) {
    var numPages = 5;
    $.widget("ui.slider", $.ui.mouse, {
        version: "1.10.3",
        widgetEventPrefix: "slide",
        options: {
            animate: false,
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: false,
            step: 1,
            value: 0,
            values: null,
            change: null,
            slide: null,
            start: null,
            stop: null
        },
        _create: function () {
            this._keySliding = false;
            this._mouseSliding = false;
            this._animateOff = true;
            this._handleIndex = null;
            this._detectOrientation();
            this._mouseInit();
            this.element.addClass("ui-slider" + " ui-slider-" + this.orientation + " ui-widget" + " ui-widget-content" + " ui-corner-all");
            this._refresh();
            this._setOption("disabled", this.options.disabled);
            this._animateOff = false;
        },
        _refresh: function () {
            this._createRange();
            this._createHandles();
            this._setupEvents();
            this._refreshValue();
        },
        _createHandles: function () {
            var i, handleCount, options = this.options,
                existingHandles = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
                handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
                handles = [];
            handleCount = (options.values && options.values.length) || 1;
            if (existingHandles.length > handleCount) {
                existingHandles.slice(handleCount).remove();
                existingHandles = existingHandles.slice(0, handleCount);
            }
            for (i = existingHandles.length; i < handleCount; i++) {
                handles.push(handle);
            }
            this.handles = existingHandles.add($(handles.join("")).appendTo(this.element));
            this.handle = this.handles.eq(0);
            this.handles.each(function (i) {
                $(this).data("ui-slider-handle-index", i);
            });
        },
        _createRange: function () {
            var options = this.options,
                classes = "";
            if (options.range) {
                if (options.range === true) {
                    if (!options.values) {
                        options.values = [this._valueMin(), this._valueMin()];
                    } else if (options.values.length && options.values.length !== 2) {
                        options.values = [options.values[0], options.values[0]];
                    } else if ($.isArray(options.values)) {
                        options.values = options.values.slice(0);
                    }
                }
                if (!this.range || !this.range.length) {
                    this.range = $("<div></div>").appendTo(this.element);
                    classes = "ui-slider-range" + " ui-widget-header ui-corner-all";
                } else {
                    this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({
                        "left": "",
                        "bottom": ""
                    });
                }
                this.range.addClass(classes + ((options.range === "min" || options.range === "max") ? " ui-slider-range-" + options.range : ""));
            } else {
                this.range = $([]);
            }
        },
        _setupEvents: function () {
            var elements = this.handles.add(this.range).filter("a");
            this._off(elements);
            this._on(elements, this._handleEvents);
            this._hoverable(elements);
            this._focusable(elements);
        },
        _destroy: function () {
            this.handles.remove();
            this.range.remove();
            this.element.removeClass("ui-slider" + " ui-slider-horizontal" + " ui-slider-vertical" + " ui-widget" + " ui-widget-content" + " ui-corner-all");
            this._mouseDestroy();
        },
        _mouseCapture: function (event) {
            var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle, that = this,
                o = this.options;
            if (o.disabled) {
                return false;
            }
            this.elementSize = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            };
            this.elementOffset = this.element.offset();
            position = {
                x: event.pageX,
                y: event.pageY
            };
            normValue = this._normValueFromMouse(position);
            distance = this._valueMax() - this._valueMin() + 1;
            this.handles.each(function (i) {
                var thisDistance = Math.abs(normValue - that.values(i));
                if ((distance > thisDistance) || (distance === thisDistance && (i === that._lastChangedValue || that.values(i) === o.min))) {
                    distance = thisDistance;
                    closestHandle = $(this);
                    index = i;
                }
            });
            allowed = this._start(event, index);
            if (allowed === false) {
                return false;
            }
            this._mouseSliding = true;
            this._handleIndex = index;
            closestHandle.addClass("ui-state-active").focus();
            offset = closestHandle.offset();
            mouseOverHandle = !$(event.target).parents().addBack().is(".ui-slider-handle");
            this._clickOffset = mouseOverHandle ? {
                left: 0,
                top: 0
            } : {
                left: event.pageX - offset.left - (closestHandle.width() / 2),
                top: event.pageY - offset.top - (closestHandle.height() / 2) - (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) - (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) + (parseInt(closestHandle.css("marginTop"), 10) || 0)
            };
            if (!this.handles.hasClass("ui-state-hover")) {
                this._slide(event, index, normValue);
            }
            this._animateOff = true;
            return true;
        },
        _mouseStart: function () {
            return true;
        },
        _mouseDrag: function (event) {
            var position = {
                x: event.pageX,
                y: event.pageY
            }, normValue = this._normValueFromMouse(position);
            this._slide(event, this._handleIndex, normValue);
            return false;
        },
        _mouseStop: function (event) {
            this.handles.removeClass("ui-state-active");
            this._mouseSliding = false;
            this._stop(event, this._handleIndex);
            this._change(event, this._handleIndex);
            this._handleIndex = null;
            this._clickOffset = null;
            this._animateOff = false;
            return false;
        },
        _detectOrientation: function () {
            this.orientation = (this.options.orientation === "vertical") ? "vertical" : "horizontal";
        },
        _normValueFromMouse: function (position) {
            var pixelTotal, pixelMouse, percentMouse, valueTotal, valueMouse;
            if (this.orientation === "horizontal") {
                pixelTotal = this.elementSize.width;
                pixelMouse = position.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0);
            } else {
                pixelTotal = this.elementSize.height;
                pixelMouse = position.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0);
            }
            percentMouse = (pixelMouse / pixelTotal);
            if (percentMouse > 1) {
                percentMouse = 1;
            }
            if (percentMouse < 0) {
                percentMouse = 0;
            }
            if (this.orientation === "vertical") {
                percentMouse = 1 - percentMouse;
            }
            valueTotal = this._valueMax() - this._valueMin();
            valueMouse = this._valueMin() + percentMouse * valueTotal;
            return this._trimAlignValue(valueMouse);
        },
        _start: function (event, index) {
            var uiHash = {
                handle: this.handles[index],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                uiHash.value = this.values(index);
                uiHash.values = this.values();
            }
            return this._trigger("start", event, uiHash);
        },
        _slide: function (event, index, newVal) {
            var otherVal, newValues, allowed;
            if (this.options.values && this.options.values.length) {
                otherVal = this.values(index ? 0 : 1);
                if ((this.options.values.length === 2 && this.options.range === true) && ((index === 0 && newVal > otherVal) || (index === 1 && newVal < otherVal))) {
                    newVal = otherVal;
                }
                if (newVal !== this.values(index)) {
                    newValues = this.values();
                    newValues[index] = newVal;
                    allowed = this._trigger("slide", event, {
                        handle: this.handles[index],
                        value: newVal,
                        values: newValues
                    });
                    otherVal = this.values(index ? 0 : 1);
                    if (allowed !== false) {
                        this.values(index, newVal, true);
                    }
                }
            } else {
                if (newVal !== this.value()) {
                    allowed = this._trigger("slide", event, {
                        handle: this.handles[index],
                        value: newVal
                    });
                    if (allowed !== false) {
                        this.value(newVal);
                    }
                }
            }
        },
        _stop: function (event, index) {
            var uiHash = {
                handle: this.handles[index],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                uiHash.value = this.values(index);
                uiHash.values = this.values();
            }
            this._trigger("stop", event, uiHash);
        },
        _change: function (event, index) {
            if (!this._keySliding && !this._mouseSliding) {
                var uiHash = {
                    handle: this.handles[index],
                    value: this.value()
                };
                if (this.options.values && this.options.values.length) {
                    uiHash.value = this.values(index);
                    uiHash.values = this.values();
                }
                this._lastChangedValue = index;
                this._trigger("change", event, uiHash);
            }
        },
        value: function (newValue) {
            if (arguments.length) {
                this.options.value = this._trimAlignValue(newValue);
                this._refreshValue();
                this._change(null, 0);
                return;
            }
            return this._value();
        },
        values: function (index, newValue) {
            var vals, newValues, i;
            if (arguments.length > 1) {
                this.options.values[index] = this._trimAlignValue(newValue);
                this._refreshValue();
                this._change(null, index);
                return;
            }
            if (arguments.length) {
                if ($.isArray(arguments[0])) {
                    vals = this.options.values;
                    newValues = arguments[0];
                    for (i = 0; i < vals.length; i += 1) {
                        vals[i] = this._trimAlignValue(newValues[i]);
                        this._change(null, i);
                    }
                    this._refreshValue();
                } else {
                    if (this.options.values && this.options.values.length) {
                        return this._values(index);
                    } else {
                        return this.value();
                    }
                }
            } else {
                return this._values();
            }
        },
        _setOption: function (key, value) {
            var i, valsLength = 0;
            if (key === "range" && this.options.range === true) {
                if (value === "min") {
                    this.options.value = this._values(0);
                    this.options.values = null;
                } else if (value === "max") {
                    this.options.value = this._values(this.options.values.length - 1);
                    this.options.values = null;
                }
            }
            if ($.isArray(this.options.values)) {
                valsLength = this.options.values.length;
            }
            $.Widget.prototype._setOption.apply(this, arguments);
            switch (key) {
                case "orientation":
                    this._detectOrientation();
                    this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
                    this._refreshValue();
                    break;
                case "value":
                    this._animateOff = true;
                    this._refreshValue();
                    this._change(null, 0);
                    this._animateOff = false;
                    break;
                case "values":
                    this._animateOff = true;
                    this._refreshValue();
                    for (i = 0; i < valsLength; i += 1) {
                        this._change(null, i);
                    }
                    this._animateOff = false;
                    break;
                case "min":
                case "max":
                    this._animateOff = true;
                    this._refreshValue();
                    this._animateOff = false;
                    break;
                case "range":
                    this._animateOff = true;
                    this._refresh();
                    this._animateOff = false;
                    break;
            }
        },
        _value: function () {
            var val = this.options.value;
            val = this._trimAlignValue(val);
            return val;
        },
        _values: function (index) {
            var val, vals, i;
            if (arguments.length) {
                val = this.options.values[index];
                val = this._trimAlignValue(val);
                return val;
            } else if (this.options.values && this.options.values.length) {
                vals = this.options.values.slice();
                for (i = 0; i < vals.length; i += 1) {
                    vals[i] = this._trimAlignValue(vals[i]);
                }
                return vals;
            } else {
                return [];
            }
        },
        _trimAlignValue: function (val) {
            if (val <= this._valueMin()) {
                return this._valueMin();
            }
            if (val >= this._valueMax()) {
                return this._valueMax();
            }
            var step = (this.options.step > 0) ? this.options.step : 1,
                valModStep = (val - this._valueMin()) % step,
                alignValue = val - valModStep;
            if (Math.abs(valModStep) * 2 >= step) {
                alignValue += (valModStep > 0) ? step : (-step);
            }
            return parseFloat(alignValue.toFixed(5));
        },
        _valueMin: function () {
            return this.options.min;
        },
        _valueMax: function () {
            return this.options.max;
        },
        _refreshValue: function () {
            var lastValPercent, valPercent, value, valueMin, valueMax, oRange = this.options.range,
                o = this.options,
                that = this,
                animate = (!this._animateOff) ? o.animate : false,
                _set = {};
            if (this.options.values && this.options.values.length) {
                this.handles.each(function (i) {
                    valPercent = (that.values(i) - that._valueMin()) / (that._valueMax() - that._valueMin()) * 100;
                    _set[that.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
                    $(this).stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
                    if (that.options.range === true) {
                        if (that.orientation === "horizontal") {
                            if (i === 0) {
                                that.range.stop(1, 1)[animate ? "animate" : "css"]({
                                    left: valPercent + "%"
                                }, o.animate);
                            }
                            if (i === 1) {
                                that.range[animate ? "animate" : "css"]({
                                    width: (valPercent - lastValPercent) + "%"
                                }, {
                                    queue: false,
                                    duration: o.animate
                                });
                            }
                        } else {
                            if (i === 0) {
                                that.range.stop(1, 1)[animate ? "animate" : "css"]({
                                    bottom: (valPercent) + "%"
                                }, o.animate);
                            }
                            if (i === 1) {
                                that.range[animate ? "animate" : "css"]({
                                    height: (valPercent - lastValPercent) + "%"
                                }, {
                                    queue: false,
                                    duration: o.animate
                                });
                            }
                        }
                    }
                    lastValPercent = valPercent;
                });
            } else {
                value = this.value();
                valueMin = this._valueMin();
                valueMax = this._valueMax();
                valPercent = (valueMax !== valueMin) ? (value - valueMin) / (valueMax - valueMin) * 100 : 0;
                _set[this.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
                this.handle.stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
                if (oRange === "min" && this.orientation === "horizontal") {
                    this.range.stop(1, 1)[animate ? "animate" : "css"]({
                        width: valPercent + "%"
                    }, o.animate);
                }
                if (oRange === "max" && this.orientation === "horizontal") {
                    this.range[animate ? "animate" : "css"]({
                        width: (100 - valPercent) + "%"
                    }, {
                        queue: false,
                        duration: o.animate
                    });
                }
                if (oRange === "min" && this.orientation === "vertical") {
                    this.range.stop(1, 1)[animate ? "animate" : "css"]({
                        height: valPercent + "%"
                    }, o.animate);
                }
                if (oRange === "max" && this.orientation === "vertical") {
                    this.range[animate ? "animate" : "css"]({
                        height: (100 - valPercent) + "%"
                    }, {
                        queue: false,
                        duration: o.animate
                    });
                }
            }
        },
        _handleEvents: {
            keydown: function (event) {
                var allowed, curVal, newVal, step, index = $(event.target).data("ui-slider-handle-index");
                switch (event.keyCode) {
                    case $.ui.keyCode.HOME:
                    case $.ui.keyCode.END:
                    case $.ui.keyCode.PAGE_UP:
                    case $.ui.keyCode.PAGE_DOWN:
                    case $.ui.keyCode.UP:
                    case $.ui.keyCode.RIGHT:
                    case $.ui.keyCode.DOWN:
                    case $.ui.keyCode.LEFT:
                        event.preventDefault();
                        if (!this._keySliding) {
                            this._keySliding = true;
                            $(event.target).addClass("ui-state-active");
                            allowed = this._start(event, index);
                            if (allowed === false) {
                                return;
                            }
                        }
                        break;
                }
                step = this.options.step;
                if (this.options.values && this.options.values.length) {
                    curVal = newVal = this.values(index);
                } else {
                    curVal = newVal = this.value();
                }
                switch (event.keyCode) {
                    case $.ui.keyCode.HOME:
                        newVal = this._valueMin();
                        break;
                    case $.ui.keyCode.END:
                        newVal = this._valueMax();
                        break;
                    case $.ui.keyCode.PAGE_UP:
                        newVal = this._trimAlignValue(curVal + ((this._valueMax() - this._valueMin()) / numPages));
                        break;
                    case $.ui.keyCode.PAGE_DOWN:
                        newVal = this._trimAlignValue(curVal - ((this._valueMax() - this._valueMin()) / numPages));
                        break;
                    case $.ui.keyCode.UP:
                    case $.ui.keyCode.RIGHT:
                        if (curVal === this._valueMax()) {
                            return;
                        }
                        newVal = this._trimAlignValue(curVal + step);
                        break;
                    case $.ui.keyCode.DOWN:
                    case $.ui.keyCode.LEFT:
                        if (curVal === this._valueMin()) {
                            return;
                        }
                        newVal = this._trimAlignValue(curVal - step);
                        break;
                }
                this._slide(event, index, newVal);
            },
            click: function (event) {
                event.preventDefault();
            },
            keyup: function (event) {
                var index = $(event.target).data("ui-slider-handle-index");
                if (this._keySliding) {
                    this._keySliding = false;
                    this._stop(event, index);
                    this._change(event, index);
                    $(event.target).removeClass("ui-state-active");
                }
            }
        }
    });
}(jQuery));;
var message = new Array();
message['createplaylist'] = "Playlist #NAME# created successfully";
message['songadded_to_playlist'] = "#NAME# added to playlist.";
message['addedsong_to_queue'] = "Song added to queue.";
message['favorated'] = "#NAME# added to favorites.";
message['unfavorated'] = "#NAME# removed from favorites.";
message['setting_saved'] = "Setting  Updated";
message['email_share'] = "Link Shared";
message['songaddetoqueue'] = "#NAME# added to queue.";
message['gaana_radio_notavailable'] = "Radio Gaana is not available for this song";
message['forgot_password_message'] = "Please Login to Your Email Account to Reset Your Password.";
message['verified_message'] = "Verification Email sent please check your mail. If not found in inbox check your spam folder!";
message['feedback_message'] = "Thank You For Your Feedback!";
message['fbtimeline'] = "We know that you have a great music taste, why not let your friends know about it? ";
message['report_issue'] = "Thank You For Your Feedback!";
message['share_title'] = "Share your music you listen on Gaana with your friends";
message['appurl_sent'] = "The app url has been emailed to you!";
message['playsong'] = "Please play a song first";
message['deactivateProfile_msg'] = "Deactivation link sent on your email, please check your mail";
message['deactivateProfile_msg_fail'] = "Oops! some error in deactivating your profile, please try again.";
message['deactivatedProfile_msg'] = "This account is been deactivated. Please sign up on gaana.com for better personalized experience";
message['resetjunkemail'] = "Verified Sucessfully! Please wait for a moment...";
message['fbdisconnect_message'] = "You have switched off your Facebook connect. Gaana will not post your activity on Facebook";
message['signup_favorite_album'] = "<b>#COUNT#</b> users also love this album! Sign up and add <b>#NAME#</b> to your favorites!";
message['signup_favorite_album1'] = "You are the 1st one to favourite <b>#NAME#</b>! Sign up and add to your favorites!";
message['signup_favorite_track'] = "<b>#COUNT#</b> users also love this song! Sign up and add <b>#NAME#</b> to your favorites!";
message['signup_favorite_track1'] = "You are the 1st one to favourite <b>#NAME#</b>! Sign up and add to your favorites!";
message['signup_favorite_genreradio'] = "That's a great radio! Sign up to add <b>#NAME#</b> to your favorites!";
message['signup_favorite_playlist'] = "That's a great playlist! Sign up to add <b>#NAME#</b> to your favorites!";
message['signup_favorite_artist'] = "Great choice! Sign up to add <b>#NAME#</b> it to your favorites!";
message['addtoplaylist_album'] = "Sign up to add <b>#NAME#</b> album to your personal playlist!";
message['addtoplaylist_track'] = "Great choice! Sign up to add <b>#NAME#</b> to your personal playlist!";
message['addtoplaylist_playlist'] = "Awesome playlist! Sign up to add <b>#NAME#</b> to your personal playlist!";
message['createplaylist_signup'] = "Sign up to create your personal playlist with the songs you love!";
message['signup_share_album'] = "Want to share <b>#NAME#</b> with your friends? Sign up to do so!";
message['signup_share_track'] = "You've got great taste! Sign up to share <b>#NAME#</b> with your friends!";
message['signup_share_genreradio'] = "<b>#NAME#</b> is a great radio station! Sign up, share and ask your friends to tune in too!";
message['signup_share_playlist'] = "Sign up to share the <b>#NAME#</b> playlist with your friends!";
message['signup_share_artist'] = "<b>#NAME#</b> is a great artist! Sign up to share their music among your friends!";
message['skip_songs_msg'] = "You have skipped many songs.<br/> Log in to personalize your experience.";
message['twitterdisconnect_message'] = "You have switched off your Twitter connect. Gaana will not post your activity on Twitter";
message['googledisconnect_message'] = "You have switched off your Google connect. Gaana will not post your activity on Google";
message['noads_user_noads_message'] = 'You are already subscribed to this plan.<a class="goto_link_close a-d3 orange" href="javascript:void(0)"> Click here</a> to check your subscription plan details.';
message['noads_user_gaanaplus_message'] = 'You are already subscribed to Gaana+.<a class="goto_link_close a-d3 orange" href="javascript:void(0)"> Click here</a> to check your subscription plan details.';
message['gaanaplus_user_noads_message'] = 'You are already subscribed to the No Ads Plan.<a class="goto_link_close a-d3 orange" href="javascript:void(0)"> Click here</a> to check your subscription plan details or  or proceed to upgrade to Gaana+ for Android and iOS devices.';
message['gaanaplus_user_gaanaplus_message'] = 'You are already subscribed to this plan.<a class="goto_link_close a-d3 orange" href="javascript:void(0)"> Click here</a> to check your subscription plan details.';
var messagebox = {};
messagebox.open = function (msgobj, _isNotify) {
    if (typeof (_isNotify) != 'undefined' && _isNotify) {
        $('#popup').dialog('close');
        $('#popup').remove();
        $('#outercontainer').append('<div id="popup" class="messagebox">' + msgobj.msg + '</div>');
        $('#popup').dialog({
            autoOpen: true,
            closeText: '',
            dialogClass: 'paddingtop',
            width: 420,
            draggable: false,
            modal: true,
            title: msgobj.title,
            show: {
                effect: "blind",
                duration: 1000
            },
            create: function (event, ui) {
                $(event.target).parent().css('position', 'fixed');
            },
            position: {
                my: "center",
                at: "center",
                of: window,
                collision: "fit",
                using: function (pos) {
                    var topOffset = $(this).css(pos).offset().top;
                    $(this).css({
                        "top": "60px"
                    });
                }
            },
            open: function () {
                if (msgobj.autoclose == true) {
                    setTimeout(function () {
                        $('#popup').dialog('close');
                        $('#popup').remove();
                    }, msgobj.delay);
                }
            }
        });
        return;
    }
    var msgobj = $.extend({
        autoclose: false,
        delay: 5000,
        title: 'Confirmation',
        msg: null
    }, msgobj);
    $('#popup').dialog('close');
    $('#popup').remove();
    $('.bottom-popup').animate({
        bottom: '80px'
    }, {
        duration: 300
    }).delay(2000).animate({
        bottom: '-60px'
    }, 150);
    $('.notification_msg').html(msgobj.msg);
    return;
}
messagebox.fbTimeLine = function (obj, loginStatus) {
    var silent_mood = readCookie('silent_mood');
    if ($("#popup").length > 0) {
        return;
    }
    gAnalyticVirtualPageview('/virtual/fbTimeLine-popup');
    var template = $('#fbtimelinetpl').html();
    $('#popup').remove();
    var objbtn = {
        rmbtn: 'rmbtn',
        yesbtn: 'yesbtn',
        nobtn: 'nobtn'
    };
    var result = Mustache.render(template, objbtn);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $("#popup").dialog({
        resizable: false,
        dialogClass: 'fbreminder login_panel',
        width: 420,
        title: message['fbtimeline'],
        modal: true,
        open: function () {
            $(".ui-dialog .ui-dialog-titlebar-close").css('top', '20%');
            $(".ui-dialog-title").addClass("fbreminder_caption");
            $("#" + objbtn.rmbtn).on('click', function () {
                gAnalyticChannelClick("Facebook Autoshare Popup", "Remind Me Again", "share_popup");
                createCookie('fbpopup_check', 3, 24);
                $('#popup').dialog('close');
                $('#popup').remove();
            });
            $("#" + objbtn.yesbtn).on('click', function () {
                fbLoginCallback['arg'] = obj;
                gAnalyticChannelClick("Facebook Autoshare Popup", "Yes Button", "share_popup");
                if ($.trim(loginStatus) == '1') {
                    window.open(BASE_URL + 'openpopup?type=fbconnect', 'Facebook', "menubar=0,resizable=0,width=600,height=400");
                } else {
                    window.open(BASE_URL + 'openpopup?type=fbpublish', 'Facebook', "menubar=0,resizable=0,width=600,height=400");
                }
                $('#popup').dialog('close');
                $('#popup').remove();
            });
            $("#" + objbtn.nobtn).on('click', function () {
                gAnalyticChannelClick("Facebook Autoshare Popup", "No Button", "share_popup");
                createCookie('fbpopup_check', 3, 360);
                $('#popup').dialog('close');
                $('#popup').remove();
            });
        }
    });
}
messagebox.message = function (message_string, replace_string, count) {
    var str = message_string;
    if (typeof count != 'undefined' && count != '' && count != null) {
        str = str.replace("#COUNT#", count);
    }
    var message = str.replace("#NAME#", html_entity_decode(replace_string));
    return message;
}
messagebox.showMessage = function (options) {
    if (typeof options == 'undefined' || options == null || options == '') {
        return;
    }
    if (typeof options.virtualpage == 'undefined' || options.virtualpage == null || options.virtualpage == '') {
        options.virtualpage = "virtual-popup";
    }
    gAnalyticVirtualPageview('/virtual/' + options.virtualpage);
    $('#popup').remove();
    var template = $('#' + options.template_id).html();
    objbtn = {
        yesbtn: 'yesbtn',
        nobtn: 'nobtn'
    };
    var result = Mustache.render(template, objbtn);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    if (typeof options.width == 'undefined' || options.width == null) {
        options.width = 420;
    }
    $("#popup").dialog({
        resizable: false,
        dialogClass: options.popup_class,
        width: options.width,
        title: options.header_message,
        modal: true,
        show: {
            effect: "blind",
            duration: 1000
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                if (typeof options.position != 'undefined' || options.position != null || options.position == 'top') {
                    $(this).css({
                        "top": "59px"
                    });
                }
            }
        },
        open: function () {
            $('.condition_btnpanel').hide();
            if (options.is_prompt === true) {
                $('.condition_btnpanel').show();
            }
            $(".ui-dialog-title").addClass(options.popup_class);
            if (typeof options.header_message != 'undefined' && (options.header_message == '' || options.header_message == null)) {
                $(".ui-dialog-titlebar").hide();
            }
            if (typeof options.close_btn != 'undefined' && options.close_btn) {
                $(".ui-dialog-titlebar").show();
            }
            $('.disp_content').html(options.disp_message);
            $('body').on('click', '.goto_link_close', function () {
                var plus_url = BASE_URL + "myzone/gaana_plus/";
                $('#popup').remove();
                ajaxPageRequestHandler.invoke({
                    url: plus_url,
                    'container': 'main_middle_content'
                });
            });
            $("#" + objbtn.yesbtn).on('click', function () {
                gAnalyticChannelClick("Popup-show message", "yes", "gaanaplus");
                $('#popup').remove();
                if (typeof options.yesCallback != 'undefined') {
                    options.yesCallback();
                }
            });
            $("#" + objbtn.nobtn).on('click', function () {
                gAnalyticChannelClick("Popup-show message", "Cancel", "gaanaplus");
                $('#popup').remove();
            });
        }
    });
};
messagebox.deactivateProfile = function () {
    gAnalyticVirtualPageview('/virtual/deactivateProfile-popup');
    var template = $('#deactivateprofiletpl').html();
    $('#popup').remove();
    var objbtn = {
        yesbtn: 'yesbtn',
        nobtn: 'nobtn'
    };
    var result = Mustache.render(template, objbtn);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $("#popup").dialog({
        resizable: false,
        dialogClass: 'deativate_profile login_panel',
        width: 420,
        title: "Are you sure to Deactivate your account?",
        modal: true,
        open: function () {
            $(".ui-dialog .ui-dialog-titlebar-close").css('top', '20%');
            $(".ui-dialog-title").addClass("deativate_profile_caption");
            $("#" + objbtn.yesbtn).on('click', function () {
                gAnalyticChannelClick("Deactivate profile Popup", "yes", "deactivate_profile_popup");
                registration.sendDeactivateUrl();
                $('#popup').remove();
            });
            $("#" + objbtn.nobtn).on('click', function () {
                gAnalyticChannelClick("Deactivate profile Popup", "Cancel", "deactivate_profile_popup");
                $('#popup').remove();
            });
        }
    });
};;
var sticker = {
    tWidth: 0,
    tHeight: '25px',
    tcolour: null,
    moStop: true,
    tSpeed: 3,
    content: null,
    cps: this.tSpeed,
    aw: null,
    mq: null,
    fsz: parseInt(this.tHeight) - 4,
    lefttime: null,
    startticker: function () {
        try {
            this.tWidth = $('#trackInfo').width();
            this.cps = this.tSpeed;
            var tick = '<div style="position:relative;margin:0px;"';
            if (this.moStop) tick += ' onmouseover="sticker.cps=0" onmouseout="sticker.cps=sticker.tSpeed"';
            tick += '><div id="mq" style="position:absolute;left:0px;top:0px;"><\/div><\/div>';
            $('#trackInfo').html(tick);
            this.mq = document.getElementById("mq");
            this.mq.innerHTML = '<span id="tx">' + this.content + '<\/span>';
            this.aw = document.getElementById("tx").offsetWidth;
            if ($('#trackInfo').width() <= $('#mq').width()) {
                this.lefttime = setInterval("sticker.scrollticker()", 50);
            }
        } catch (e) {}
    },
    stopticker: function () {
        try {
            if (this.lefttime != 'null') {
                window.clearInterval(this.lefttime);
            }
        } catch (e) {}
    },
    scrollticker: function () {
        try {
            this.mq.style.left = (parseInt(this.mq.style.left) > (-10 - this.aw)) ? parseInt(this.mq.style.left) - this.cps + "px" : parseInt(this.tWidth) + 10 + "px";
        } catch (e) {}
    }
}
var Layout = {};
Layout.highlightRow = function (arg) {
    try {
        Layout.resetSelectedRow();
        var songId = gaanaMaster.getCurrentInfo().id;
        Layout.playSong();
        _activeSongID = songId;
    } catch (e) {}
}
Layout.playSong = function () {
    if (gaanaMaster.getCurrentInfo() == null) return;
    var songId = gaanaMaster.getCurrentInfo().id;
    var songInfo = gaanaMaster.getCurrentInfo()
    if (songId > 0) {
        var atitle = (typeof songInfo['atitle'] != 'undefined') ? songInfo['atitle'] : songInfo['albumtitle'];
        document_title = gaanaMaster.getCurrentInfo()['title'] + "-" + atitle;
        document.title = html_entity_decode(document_title);
    }
    $('.play_pause').removeClass('pause-icon');
    $('.rt_arw').removeClass('pause-icon');
    $('.playicon' + songId).addClass('pause-icon');
    $('.play-song-queue').removeClass('pause-song-queue');
    $('#qsong' + songId).addClass('pause-song-queue');
    isPlayingStatus = true;
}
Layout.pauseSong = function (arg) {
    if (gaanaMaster.getCurrentInfo() == null) return;
    var songId = gaanaMaster.getCurrentInfo().id;
    $('.play_pause').removeClass('pause-icon');
    $('.rt_arw').removeClass('pause-icon');
    $('.play-song-queue').removeClass('pause-song-queue');
    isPlayingStatus = false;
}
Layout.resetSelectedRow = function () {
    $(".playingNow").removeClass("playingNow");
}
Layout.recTimer = null;
Layout.cache = {};
Layout.enableRecommendation = false;
Layout.getRecommedationData = function (songId, cb, type, title) {
    gAnalyticChannelClick('Echonest Song Radio', 'Play', title);
    if (Layout.cache[songId + "_"]) {
        if (cb) {
            cb(Layout.cache[songId + "_"]);
        }
    } else {
        $.ajax({
            type: 'post',
            url: TMUrl + 'ajax/xmldata',
            data: {
                "action": 'relatedtrackdetail',
                "id": songId,
                "datatype": 'jsonobj'
            },
            success: function (data) {
                Layout.cache[songId + "_"] = data;
                if (cb) {
                    cb(data);
                    for (sources in _variables['source']) {
                        delete _variables['source'][sources];
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                try {} catch (e) {}
            }
        });
    }
}
Layout.showHideGaanaRadio = function (is) {
    var fn = (is == true) ? "show" : "hide";
    $(".mainPlayer .rgtSeprator")[fn]();
    $(".mainPlayer .song_quality")[fn]();
}
Layout.showHideGaanaIcon = function (is) {
    var fn = (is == true) ? "show" : "hide";
    $(".mainPlayer .radio")[fn]();
}
Layout.enableGaanaIcon = function (is) {
    $(".mainPlayer #radio").unbind('click');
    if (!is) {
        $(".mainPlayer #radio").unbind('click');
    } else {
        $("#radio").bind("click", function () {
            gaanaMaster.surprisePlay();
        })
    }
}
Layout.fav = function (row) {
    $('#' + row.id).parent().data('row').action = row.action
    if ($('.spritePlayer.fav').attr('data-value') != null) {
        try {
            if ($('.spritePlayer.fav').data('row').id == row.id) {
                $('.spritePlayer.fav').data('row').action = row.action;
                $('.spritePlayer.fav').removeClass('Active').addClass((row['action'] == 0) ? '' : 'Active')
            }
        } catch (e) {
            alert(e.message)
        }
    }
}
Layout.buildAlbumHtml = function (row, returnUrl) {
    if (typeof row.albumseokey == 'undefined') return [];
    return ['<a href="/album/', row.albumseokey, '" class="albumNamePl white pjax">', html_entity_decode(row.albumtitle), '</a>'];
};
Layout.nowPlayingbuildAlbumHtml = function (row, returnUrl) {
    if (typeof row.album == 'undefined') return [];
    var albumarr = row.album.split('_')
    var albumId = albumarr.slice(-1)[0]
    var albumName = albumarr.slice(0, -1).join(' ')
    var albumUrl = utility.getUrl(albumName, albumId, row.albumseokey);
    if (typeof returnUrl != 'undefined' && returnUrl == true) {
        return albumUrl;
    } else {
        return ['<a href="#!/albums/', albumUrl, '" class="albumNamePl NPalbumName">', albumName, '</a>'];
    }
};
Layout.buildArtistHtml = function (row) {
    try {
        if (typeof row.artist == 'undefined') return [];
        var artists = (row.artist != null) ? row.artist.split(",") : 'no';
        var artistobj = new Array();
        for (i = 0; i < artists.length; i++) {
            var arname_id = artists[i].split("###");
            var name = (typeof $.trim(arname_id[0]) != 'undefined' && $.trim(arname_id[0]) != '') ? $.trim(arname_id[0]) : '';
            var id = (typeof arname_id[1] != 'undefined' && arname_id[1] != '') ? arname_id[1] : '';
            var seokey = (typeof arname_id[2] != 'undefined' && arname_id[2] != '') ? arname_id[2] : '';
            if (typeof seokey != 'undefined' && seokey != null && seokey != '') {
                if (seokey.length > 0) {
                    Url = '/artist/' + seokey
                }
            } else {
                Url = '/artist/' + encodeURIComponent(name).replace(' ', '_') + "_" + id;
            }
            var artisHtml = ['<a class="pjax albumNamePl white" href="', Url, '">', html_entity_decode(name), '</a>'].join('');
            artistobj.push(artisHtml);
            artisHtml = null;
        }
        return artistobj;
    } catch (e) {}
}
Layout.resetCurrentSongInfo = function () {
    $('#trackThumb').html("");
}
Layout.renderCurrentSongInfo = function (data, index, playerMode) {
    try {
        var songInfo = data;
        if (typeof readCookie('video_url') != 'undefined' && readCookie('video_url') == 1) {
            $('#video_player_link').removeClass("act");
            $('#video_player_link').addClass("act");
        }
        if (typeof readCookie('lyrics_url') != 'undefined' && readCookie('lyrics_url') == 1) {
            $('#lyrics_player_link').removeClass('act')
            $('#lyrics_player_link').addClass('act')
        }
        if (typeof songInfo['video_url'] != 'undefined' && songInfo['video_url'] != '') {
            $('#video_player_link').show();
            $('#trackInfo').css('padding-right', '372px');
        } else {
            $('#video_player_link').hide();
            $('#trackInfo').css('padding-right', '255px');
        }
        if (typeof songInfo['lyrics_url'] != 'undefined' && songInfo['lyrics_url'] != '') {
            $('#lyrics_player_link').show();
            $('#trackInfo').css('padding-right', '372px');
        } else {
            $('#lyrics_player_link').hide();
            $('#trackInfo').css('padding-right', '255px');
        }
        $('#trackInfo').show();
        setListenedHistory(songInfo);
        var listened_history = getListenedHistory('stored_history');
        if (_globalPlayCounter > 2 && (jsuserdata.username == null && readCookie('skip_limit') == null && readCookie('consumption_limit') == null)) {
            var same_song_count = countMatchItemsInArray(listened_history.song_id, data.id);
            if (parseInt(same_song_count, 10) > 2) {
                registration.showSongFavoritePopup(data);
            } else {
                var artist_ids = setListenedArtistIdArray(data);
                if (artist_ids != null) {
                    for (var index in artist_ids.artist_id) {
                        var artist_count = countMatchItemsInArray(listened_history.artist_id, artist_ids.artist_id[index]);
                        if (parseInt(artist_count, 10) > 4) {
                            var artist_data = {};
                            artist_data.artist_name = artist_ids.artist_name[index];
                            artist_data.id = artist_ids.artist_id[index];
                            artist_data.object_type = 4;
                            artist_data.source = 4;
                            artist_data.source_id = artist_ids.artist_id[index];
                            artist_data.title = artist_ids.artist_name[index];
                            registration.showArtistFavoritePopup(artist_data);
                            artist_data = null;
                        }
                    }
                }
            }
        }
        index = (typeof (index) != 'undefined') ? index : 0;
        try {
            var html = [songInfo['title'], '<span> - ', Layout.buildAlbumHtml(songInfo).join(''), '</span><span>', Layout.buildArtistHtml(songInfo).join(', '), '</span>'].join('')
            if (typeof songInfo['radiotitle'] != 'undefined' && songInfo['radiotitle'] != '') {}
            dcoded_html = html_entity_decode(html)
            sticker.stopticker();
            sticker.content = dcoded_html;
            sticker.startticker();
            var atitle = (typeof songInfo['atitle'] != 'undefined') ? songInfo['atitle'] : songInfo['albumtitle'];
            var album_artwork = songInfo['albumartwork'];
            if (typeof (playerMode != 'undefined') && playerMode == 'genreRadio') {
                var mod = (parseInt(songInfo['source_id'], 10) % 100);
                var radio_artwork = "http://static.gaana.com/images/radiotheme/" + mod + "/" + songInfo['source_id'] + "/" + songInfo['source_id'] + ".jpg";
                album_artwork = songInfo['albumartwork_large'];
                if (album_artwork == 'http://static.gaana.com//media/images-v1/default-album-480x480.gif' || album_artwork == '') {
                    album_artwork = songInfo['albumartwork'];
                    if (album_artwork == 'http://static.gaana.com//media/images-v1/default-album-175x175.gif' || album_artwork == '') {
                        album_artwork = radio_artwork;
                    }
                }
                $('._thumb').css('display', 'none');
                $('#_thumb' + songInfo['id']).css('display', 'block');
                $('#f-a-s-' + songInfo['id']).css('display', 'none');
                $('#f-a-s-' + songInfo['id']).closest('li').nextAll('li').find('.f-a-s').css('display', 'none');
                $('#f-a-s-' + songInfo['id']).closest('li').prevAll('li').find('.f-a-s').show(1000);
                $('#f-a-s-' + songInfo['id']).closest('li').nextAll('li').find('#transparent1').css('display', 'none');
                $('#f-a-s-' + songInfo['id']).closest('li').prevAll('li').find('#transparent1').show(1000);
                superCookie.setItem('genre_radio_song_index', index);
                flag_song_index = true;
                var topic_id = "s_" + songInfo['id'];
                var container = "topicFollowers_" + songInfo['id'];
                slideGallery('right', 'radiogall', 200, 550, index);
                updateMyTimesTopicFollowers(topic_id, container)
                if (typeof songInfo['source_artwork'] == 'undefined') {
                    songInfo['source_artwork'] = radio_artwork;
                }
                if (typeof songInfo['source_url'] != 'undefined') {
                    _now_playing_url = songInfo['source_url'];
                    showNowPlaying(songInfo['source_url'], radio_artwork, 'Gaana Radio');
                } else {
                    hideNowPlaying();
                }
            } else if (songInfo['source'] == '3') {
                if (location.href.indexOf('nowplaying') != -1) {
                    Layout.setNowPlayingSongCard();
                    $('._thumb').css('display', 'none');
                    $('.f-a-s').css('display', 'block');
                    superCookie.setItem('genre_radio_song_index', index);
                    var topic_id = "s_" + songInfo['id'];
                    var container = "topicFollowers_" + songInfo['id'];
                    updateMyTimesTopicFollowers(topic_id, container);
                    setTimeout(dfpAdSlots, 2000);
                }
                flag_song_index = true;
                if (typeof songInfo['source_artwork'] == 'undefined') {
                    songInfo['source_artwork'] = album_artwork;
                }
                if (typeof songInfo['source_url'] != 'undefined' && songInfo['source_url'] != '' && songInfo['source_url'] != null) {
                    _now_playing_url = songInfo['source_url'];
                    showNowPlaying(songInfo['source_url'], songInfo['source_artwork'], 'Playlist');
                } else {
                    _now_playing_check = false;
                    hideNowPlaying();
                }
            }
            $('.thumbHolder').html(['<img src="', album_artwork, '" width="70" height="70" />'].join(''));
            if (typeof songInfo['albumseokey'] != 'undefined' && songInfo['albumseokey'] != '' && songInfo['albumseokey'] != null) {
                $('.thumbHolder').attr('href', '/album/' + songInfo['albumseokey'])
                $('.thumbHolder').attr('class', 'thumbHolder pjax')
            } else {
                $('.thumbHolder').attr('href', 'javascript:void(0)')
                $('.thumbHolder').attr('class', 'thumbHolder')
            }
            $('#mainPlayer #favorite').removeClass('unfavorite')
            if ($('#parent-row-song' + songInfo['id']).length > 0) {
                var row = $.parseJSON($('#parent-row-song' + songInfo['id']).html())
                if (row['status'] == 1) {
                    $('#mainPlayer #favorite').hide();
                    $('#mainPlayer #favorite').attr('title', 'Remove from favorite')
                } else if (row['status'] == 0) {
                    $('#mainPlayer #favorite').show();
                    $('#mainPlayer #favorite').attr('title', 'Add to favorites')
                }
            } else if (songInfo['status'] == 1) {
                $('#mainPlayer #favorite').hide();
                $('#mainPlayer #favorite').addClass('unfavorite')
            } else if (songInfo['status'] == 0) {
                $('#mainPlayer #favorite').show();
                $('#mainPlayer #favorite').attr('title', 'Add to favorites')
            }
        } catch (e) {
            alert(e.message)
        }
        songInfo = null;
        $(".queEmpty").hide();
    } catch (e) {
        utility.errorLog(e.message, 'Layout.renderCurrentSongInfo');
    }
}
Layout.showHideSocial = function (is) {
    var fn = (is == true) ? "show" : "hide";
    $(".mainPlayer .social")[fn]();
    $(".mainPlayer .player_activity")[fn]();
    $(".mainPlayer .songadded")[fn]();
}
Layout.showHideSongQueue = function (is) {
    var fn = (is == true) ? "show" : "hide";
    $(".mainPlayer .songadded")[fn]();
}
Layout.renderArtistPreInfo = function (info) {
    if (typeof info != 'undefined' && info != null) {
        var isPreroll = (typeof info.preroll != 'undefined' && info.preroll != '') ? info.preroll : false;
        if (isPreroll) _targetStr = " target='_blank'";
        $('#nextSongInfoId').html('')
        $('#trackInfo').html('<span class="songName">' + info.title + '</span>');
        if (typeof info.playerartwork != 'undefined' && info.playerartwork != '') {
            $('.thumbHolder').html(['<a href="', info['impression_tracking_url'], '" ', _targetStr, '><img src="', info['playerartwork'], '" width="70" height="70" /><a>'].join(''));
        }
        $(".nextSongChild").hide();
    }
}
Layout.renderSogPreInfo = function (info) {
    if (typeof info != 'undefined' && info != null) {
        $('#nextSongInfoId').html('')
        $('#trackInfo').html('<span class="songName">' + info.zoomArtistName + '</span>');
        $(".nextSongChild").hide();
    }
}
Layout.thumbsUpDown = function (target, lastid, feedbacktype) {
    if (login.checklogin()) {
        Layout.updateCataLog(lastid, feedbacktype);
        Layout.changeClass(target);
    } else {
        registration.openPopup();
    }
}
Layout.updateCataLog = function (lastid, feedbacktype) {
    $.ajax({
        url: "/ajax/echonestfeedback",
        data: {
            "id": lastid,
            'feedbacktype': feedbacktype
        },
        type: 'post',
        success: function (data) {}
    });
}
Layout.changeClass = function (object) {
    var class_change = $(object).attr('class');
    $('._thumb a').removeClass('like-thumb1');
    $('._thumb a').removeClass('unlike-thumb1');
    if ($(object).hasClass('like-thumb')) {
        gAnalyticChannelClick('GaanaRadios-' + _genre_radio_title, "Thumbsup", _genre_radio_title);
        $(object).addClass('like-thumb1');
    } else {
        gAnalyticChannelClick('GaanaRadios-' + _genre_radio_title, "ThumbsDown", _genre_radio_title);
        $(object).addClass('unlike-thumb1');
        gaanaMaster.playNext();
    }
}
Layout.setgenreRadioSongCards = function () {
    try {
        if (typeof gaanaMaster.getCurrentInfo() == 'undefined' || gaanaMaster.getCurrentInfo() == null) {
            return;
        }
        var current_index = gaanaMaster.getCurrentIndex();
        var songs_info = superCookie.getItem(_variables.CookiesLabel.que);
        if (typeof songs_info == 'undefined' || songs_info == null) {
            return;
        }
        var songs_array = JSON.parse(songs_info);
        if (typeof current_index == 'undefined' || current_index == null) {
            current_index = 0;
        }
        if (typeof songs_array == 'undefined' || songs_array == '' || songs_array == 0 || songs_array == null) {
            return;
        }
        var width = songs_array.length * 550;
        var html = '';
        for (i in songs_array) {
            var data_value = JSON.stringify(songs_array[i]);
            var favorite = songs_array[i].fav == 1 ? 'unfavorite' : 'favorite';
            var fav_title = songs_array[i].fav == 1 ? 'Remove from favorites' : 'Add to favorites';
            var str = songs_array[i].artist;
            var res = str.split(",");
            var artist_name = ' ';
            for (index = 0; index < res.length; ++index) {
                var artist_details = res[index].split("###");
                artist_name = artist_name + "<a class='pjax' href='/artist/" + artist_details[2] + "'>" + artist_details[0] + "</a>, ";
            }
            var id = parseInt(songs_array[i].source_id, 10);
            var mod = (id % 100);
            var album_artwork = songs_array[i].albumartwork_large;
            if (album_artwork == 'http://static.gaana.com//media/images-v1/default-album-480x480.gif' || songs_array[i].album_artwork == '') {
                album_artwork = songs_array[i].albumartwork
                if (album_artwork == 'http://static.gaana.com//media/images-v1/default-album-175x175.gif' || songs_array[i].album_artwork == '') {
                    album_artwork = 'http://static.gaana.com/images/radiotheme/' + mod + '/' + songs_array[i].source_id + '/' + songs_array[i].source_id + '.jpg';
                }
            }
            artist_name = artist_name.substring(0, artist_name.length - 2);
            html = html + '<li id="song_' + songs_array[i].id + '">\n\
            <div class="_radio_details clearfix">\n\
                <div class="_radio_art hover-class hover-class-big radio_img_dt">\n\
                 <div style="background:url(' + album_artwork + ') no-repeat center center #ffffff; background-size:contain; display:block; max-width:100%; min-height:100%; width:223px; height:223px;"></div>\n\
<div class="hover-suggestion">\n\
<span id="parent-row-song' + songs_array[i].id + '" style="display:none;">' + data_value + '</span>\n\
<!-- <a href="" class="pjax artlink"></a><a class="play-song-small" data-type="play" data-value="" href="javascript:void(0)"></a>-->\n\
<div class="_thumb" id="_thumb' + songs_array[i].id + '"><a class="like-thumb" href="javascript:void(0)" onclick="Layout.thumbsUpDown(this,\'' + songs_array[i].id + '\', \'favorite\');"></a><a class="unlike-thumb" href="javascript:void(0)" onclick="Layout.thumbsUpDown(this,\'' + songs_array[i].id + '\', \'ban\');"></a></div>\n\
<div class="f-a-s" id="f-a-s-' + songs_array[i].id + '">\n\
<a data-value="song' + songs_array[i].id + '" id="favorite_song' + songs_array[i].id + '" data-type="favorite" class="favorite-white ' + favorite + '" title="' + fav_title + '" href="javascript:void(0)"></a>\n\
<a data-value="song' + songs_array[i].id + '" data-type="addtoplaylist" class="add-white" title="Add to Playlist" href="javascript:void(0)"></a>\n\
<a data-value="song' + songs_array[i].id + '" data-type="share" class="share-white" title="Share" href="javascript:void(0)"></a></div>\n\
</div>\n\
<div id="transparent1"></div> </div>\n\
<div class="_radio_data"><h2 class="genre_radio_song_title">' + html_entity_decode(songs_array[i].title) + '</h2><div id="genre_radio_album_title"><a class="pjax" href="/album/' + songs_array[i].albumseokey + '">' + html_entity_decode(songs_array[i].albumtitle) + '</a></div>\n\
<p class="mar20"><strong>Artists:</strong><span id="genere_radio_artist"> ' + artist_name + '</span> </p>\n\
<input type="hidden" name="topicId" id="topicId_' + songs_array[i].id + '" value="s_' + songs_array[i].id + '"/><div id="topicFollowers_' + songs_array[i].id + '" class="_songlike"></div></div></div></li>';
        }
        $('.radiogall').css("width", width);
        $('.radiogall').html(html);
        $('._thumb').css('display', 'none');
        $('#f-a-s-' + songs_array[current_index].id).css('display', 'none');
        $('#_thumb' + songs_array[current_index].id).css('display', 'block');
        slideGallery('right', 'radiogall', 200, 550, current_index);
        $('#f-a-s-' + songs_array[current_index].id).closest('li').find('#transparent1').hide();
    } catch (e) {}
}
Layout.setNowPlayingSongsCards = function () {
    try {
        if (typeof gaanaMaster.getCurrentInfo() == 'undefined' || gaanaMaster.getCurrentInfo() == null) {
            return;
        }
        var current_index = gaanaMaster.getCurrentIndex();
        if (typeof current_index == 'undefined' || current_index == null) {
            current_index = 0;
        }
        var songs_info = superCookie.getItem(_variables.CookiesLabel.que);
        if (typeof songs_info == 'undefined' || songs_info == null) {
            return;
        }
        var now_playing_songs_array = JSON.parse(songs_info);
        if (typeof now_playing_songs_array == 'undefined' || now_playing_songs_array == '' || now_playing_songs_array == 0 || now_playing_songs_array == null) {
            now_playing_songs_array = [];
            return;
        }
        var width = now_playing_songs_array.length * 550;
        var html = '';
        var similar_html = '';
        for (i in now_playing_songs_array) {
            var data_value = JSON.stringify(now_playing_songs_array[i]);
            var favorite = now_playing_songs_array[i].fav == 1 ? 'unfavorite' : 'favorite';
            var fav_title = now_playing_songs_array[i].fav == 1 ? 'Remove from favorites' : 'Add to favorites';
            var str = now_playing_songs_array[i].artist;
            var res = str.split(",");
            var artist_name = ' ';
            for (index = 0; index < res.length; ++index) {
                var artist_details = res[index].split("###");
                artist_name = artist_name + "<a class='pjax' href='/artist/" + artist_details[2] + "'>" + artist_details[0] + "</a>, ";
            }
            var album_artwork = now_playing_songs_array[i].albumartwork_large;
            if (album_artwork == 'http://static.gaana.com//media/images-v1/default-album-480x480.gif' || album_artwork == '') {
                album_artwork = now_playing_songs_array[i].albumartwork;
                if (album_artwork == 'http://static.gaana.com//media/images-v1/default-album-175x175.gif' || album_artwork == '') {
                    album_artwork = 'http://static.gaana.com//media/images-v1/default-album-175x175.gif';
                }
            }
            artist_name = artist_name.substring(0, artist_name.length - 2);
            html = html + '<li id="song_' + now_playing_songs_array[i].id + '">\n\
            <div class="_radio_details clearfix">\n\
                <div class="_radio_art hover-class hover-class-big radio_img_dt">\n\
                    <img width="223" height="223" style="height:223px;" class="genre_radio_artwork" \n\
alt="artwork" src="' + album_artwork + '">\n\
<div class="hover-suggestion">\n\
<span id="parent-row-song' + now_playing_songs_array[i].id + '" style="display:none;">' + data_value + '</span>\n\
<!-- <a href="" class="pjax artlink"></a><a class="play-song-small" data-type="play" data-value="" href="javascript:void(0)"></a>-->\n\
<div class="_thumb" id="_thumb' + now_playing_songs_array[i].id + '"><a class="like-thumb" href="javascript:void(0)" onclick="Layout.thumbsUpDown(this,\'' + now_playing_songs_array[i].id + '\', \'favorite\');"></a><a class="unlike-thumb" href="javascript:void(0)" onclick="Layout.thumbsUpDown(this,\'' + now_playing_songs_array[i].id + '\', \'ban\');"></a></div>\n\
<div class="f-a-s" id="f-a-s-' + now_playing_songs_array[i].id + '">\n\
<a data-value="song' + now_playing_songs_array[i].id + '"  id="favorite_song' + now_playing_songs_array[i].id + '" data-type="favorite" class="favorite-white ' + favorite + '" title="' + fav_title + '" href="javascript:void(0)"></a>\n\
<a data-value="song' + now_playing_songs_array[i].id + '" data-type="addtoplaylist" class="add-white" title="Add to Playlist" href="javascript:void(0)"></a>\n\
<a data-value="song' + now_playing_songs_array[i].id + '" data-type="share" class="share-white" title="Share" href="javascript:void(0)"></a></div>\n\
</div>\n\
<div id="transparent1"></div> </div>\n\
<div class="_radio_data"><h2 class="genre_radio_song_title">' + html_entity_decode(now_playing_songs_array[i].title) + '</h2><div id="genre_radio_album_title"><a class="pjax" href="/album/' + now_playing_songs_array[i].albumseokey + '">' + html_entity_decode(now_playing_songs_array[i].albumtitle) + '</a></div>\n\
<p class="mar20"><strong>Artists:</strong><span id="genere_radio_artist"> ' + artist_name + '</span> </p>\n\
<input type="hidden" name="topicId" id="topicId_' + now_playing_songs_array[i].id + '" value="s_' + now_playing_songs_array[i].id + '"/><div id="topicFollowers_' + now_playing_songs_array[i].id + '" class="_songlike"></div></div></div></li>';
        }
        $('.radiogall').css("width", width);
        $('.radiogall').html(html);
        $('._thumb').css('display', 'none');
        $('#f-a-s-' + now_playing_songs_array[current_index].id).css('display', 'none');
        $('#_thumb' + now_playing_songs_array[current_index].id).css('display', 'block');
        slideGallery('right', 'radiogall', 200, 550, current_index);
        $('#f-a-s-' + now_playing_songs_array[current_index].id).closest('li').find('#transparent1').hide();
    } catch (e) {
        alert(e.message)
    }
}
Layout.setNowPlayingSongCard = function () {
    try {
        if (typeof gaanaMaster.getCurrentInfo() == 'undefined' || gaanaMaster.getCurrentInfo() == null) {
            return;
        }
        var songs_info = gaanaMaster.getCurrentInfo();
        if (typeof songs_info == 'undefined' || songs_info == null) {
            return;
        }
        var now_playing_song_array = songs_info;
        if (typeof now_playing_song_array == 'undefined' || now_playing_song_array == '' || now_playing_song_array == 0 || now_playing_song_array == null) {
            now_playing_song_array = [];
            return;
        }
        var html = '';
        var similar_html = '';
        if (_playlist_similar_song) {
            _playlist_similar_song = false;
            setTimeout(function () {
                var songs_infos = superCookie.getItem(_variables.CookiesLabel.que);
                if (typeof songs_infos == 'undefined' || songs_infos == null) {
                    return;
                }
                var now_playing_songs_array = JSON.parse(songs_infos);
                var width = now_playing_songs_array.length * 120;
                $('#similar_section').css("width", width);
                similar_html = Layout.setSimilarSongs(now_playing_songs_array);
                $('#similar_section').html(similar_html);
                activateScroller();
            }, 1000);
        }
        var data_value = JSON.stringify(now_playing_song_array);
        var favorite = now_playing_song_array.fav == 1 ? 'unfavorite' : 'favorite';
        var fav_title = now_playing_song_array.fav == 1 ? 'Remove from favorites' : 'Add to favorites';
        var str = now_playing_song_array.artist;
        var res = str.split(",");
        var artist_name = ' ';
        for (index = 0; index < res.length; ++index) {
            var artist_details = res[index].split("###");
            artist_name = artist_name + "<a class='pjax' href='/artist/" + artist_details[2] + "'>" + artist_details[0] + "</a>, ";
        }
        var album_artwork = now_playing_song_array.albumartwork_large;
        if (album_artwork == 'http://static.gaana.com//media/images-v1/default-album-480x480.gif' || album_artwork == '') {
            album_artwork = now_playing_song_array.albumartwork;
            if (album_artwork == 'http://static.gaana.com//media/images-v1/default-album-175x175.gif' || album_artwork == '') {
                album_artwork = 'http://static.gaana.com//media/images-v1/default-album-175x175.gif';
            }
        }
        artist_name = artist_name.substring(0, artist_name.length - 2);
        html = html + '<li id="song_' + now_playing_song_array.id + '">\n\
            <div class="_radio_details clearfix">\n\
                <div class="_radio_art hover-class hover-class-big radio_img_dt">\n\
                    <img width="223" height="223" style="height:223px;" class="genre_radio_artwork" \n\
alt="artwork" src="' + album_artwork + '">\n\
<div class="hover-suggestion">\n\
<span id="parent-row-song' + now_playing_song_array.id + '" style="display:none;">' + data_value + '</span>\n\
<!-- <a href="" class="pjax artlink"></a><a class="play-song-small" data-type="play" data-value="" href="javascript:void(0)"></a>-->\n\
<div class="_thumb" id="_thumb' + now_playing_song_array.id + '"><a class="like-thumb" href="javascript:void(0)" onclick="Layout.thumbsUpDown(this,\'' + now_playing_song_array.id + '\', \'favorite\');"></a><a class="unlike-thumb" href="javascript:void(0)" onclick="Layout.thumbsUpDown(this,\'' + now_playing_song_array.id + '\', \'ban\');"></a></div>\n\
<div class="f-a-s" id="f-a-s-' + now_playing_song_array.id + '">\n\
<a data-value="song' + now_playing_song_array.id + '"  id="favorite_song' + now_playing_song_array.id + '" data-type="favorite" class="favorite-white ' + favorite + '" title="' + fav_title + '" href="javascript:void(0)"></a>\n\
<a data-value="song' + now_playing_song_array.id + '" data-type="addtoplaylist" class="add-white" title="Add to Playlist" href="javascript:void(0)"></a>\n\
<a data-value="song' + now_playing_song_array.id + '" data-type="share" class="share-white" title="Share" href="javascript:void(0)"></a></div>\n\
</div>\n\
<div id="transparent1"></div> </div>\n\
<div class="_radio_data"><h2 class="genre_radio_song_title">' + html_entity_decode(now_playing_song_array.title) + '</h2><div id="genre_radio_album_title"><a class="pjax" href="/album/' + now_playing_song_array.albumseokey + '">' + html_entity_decode(now_playing_song_array.albumtitle) + '</a></div>\n\
<p class="mar20"><strong>Artists:</strong><span id="genere_radio_artist"> ' + artist_name + '</span> </p>\n\
<input type="hidden" name="topicId" id="topicId_' + now_playing_song_array.id + '" value="s_' + now_playing_song_array.id + '"/><div id="topicFollowers_' + now_playing_song_array.id + '" class="_songlike"></div></div></div></li>';
        $('.radiogall').html(html);
        $('._thumb').css('display', 'none');
        $('#f-a-s-' + now_playing_song_array.id).css('display', 'block');
    } catch (e) {}
}
Layout.setSimilarSongs = function (now_playing_songs_array) {
    var similar_html = '';
    for (i in now_playing_songs_array) {
        var data_value = JSON.stringify(now_playing_songs_array[i]);
        var favorite = now_playing_songs_array[i].fav == 1 ? 'unfavorite' : 'favorite';
        var fav_title = now_playing_songs_array[i].fav == 1 ? 'Remove from favorites' : 'Add to favorites';
        var str = now_playing_songs_array[i].artist;
        var res = str.split(",");
        var artist_name = ' ';
        for (index = 0; index < res.length; ++index) {
            var artist_details = res[index].split("###");
            artist_name = artist_name + "<a class='pjax' href='/artist/" + artist_details[2] + "'>" + artist_details[0] + "</a>, ";
        }
        var album_artwork = now_playing_songs_array[i].albumartwork_large;
        if (album_artwork == 'http://static.gaana.com//media/images-v1/default-album-480x480.gif' || album_artwork == '') {
            album_artwork = now_playing_songs_array[i].albumartwork;
            if (album_artwork == 'http://static.gaana.com//media/images-v1/default-album-175x175.gif' || album_artwork == '') {
                album_artwork = 'http://static.gaana.com//media/images-v1/default-album-175x175.gif';
            }
        }
        similar_html += '<li id="_item_row_' + now_playing_songs_array[i].id + '" class="list parentnode">\n\
<span id="parent-row-song' + now_playing_songs_array[i].id + '" style="display:none;" class="sourcelist_' + now_playing_songs_array[i].source_id + '">' + data_value + '</span>\n\
<div class="hover-class hover-class-big">\n\
<a data-value="/album/' + now_playing_songs_array[i].albumseokey + '" data-type="/album/' + now_playing_songs_array[i].albumseokey + '" href="/album/' + now_playing_songs_array[i].albumseokey + '" class="pjax art">\n\
<div class="artworkdiv"><img class="img" title="' + html_entity_decode(now_playing_songs_array[i].albumtitle) + '" alt="' + html_entity_decode(now_playing_songs_array[i].albumtitle) + '" data-src="' + album_artwork + '" src="http://static.gaana.com//media/images-v1/default-album-175x175.gif"></div>\n\
<div class="hover-suggestion">\n\
<a class="pjax artlink" href="/album/' + now_playing_songs_array[i].albumseokey + '"></a>\n\
<a href="javascript:void(0)" data-value="song' + now_playing_songs_array[i].id + '" data-type="playSong" class="play-song-small songlist" style="top: 37px;"></a>\n\
<div class="f-a-s">\n\
<a data-value="song' + now_playing_songs_array[i].id + '" id="favorite_song' + now_playing_songs_array[i].id + '" data-type="favorite" class="favorite-white ' + favorite + '" title="' + fav_title + '" href="javascript:void(0)"></a>\n\
<a data-value="song' + now_playing_songs_array[i].id + '" data-type="addtoplaylist" class="add-white" title="Add to Playlist" href="javascript:void(0)"></a>\n\
<a data-value="song' + now_playing_songs_array[i].id + '" data-type="share" class="share-white" title="Share" href="javascript:void(0)"></a></div>\n\
</div>\n\
<div id="transparent1"></div> </div>\n\
<div class="title" style="color:#FFFFFF;font-size:12px;">' + html_entity_decode(now_playing_songs_array[i].title) + '</div>\n\
</li>';
    }
    return similar_html;
}
var Ads = {};
Ads.ids = {
    "adPlayerRight": "adPlayerRight",
    "adPlayer_468x60": "adPlayer_468x60",
    'iframeiddiv': 'iframeiddiv',
    'centerZone': 'gaanaads'
};
Ads.getHolder = function (id) {
    return this.ids[id] || null;
};
Ads.showAd = function (adId, stay, arg) {
    var h = this.getHolder(adId);
    var songInfo = $.parseJSON(arg.songInfo);
    switch (adId) {
        case "adPlayerRight":
            $(".adPlayer").css({
                right: "-1000px"
            });
            $(".mainPlayer").animate({
                width: "75%"
            }, 1000);
            $("#" + h).animate({
                right: "7"
            }, 1000);
            break;
        case "adPlayer_468x60":
            $("#" + h).animate({
                bottom: "95px"
            }, 1000);
            break;
        case "iframeiddiv":
            getAirtelAd(songInfo.id, songInfo.title, songInfo.albumid, songInfo.albumname, 123)
            break;
        case "fantaModal":
            try {
                var title = songInfo.title.split(" ")
                title = title[0];
                var url = "http://gaana.com/share/";
                var id = songInfo.id
                url = url + 't' + title + 'I' + id;
                FB.ui({
                    link: url,
                    picture: 'http://static.gaana.com//images/channel/35//crop_110x110_35.jpg',
                    method: 'send',
                    message: 'Dedicate this song to .'
                }, function (response) {})
            } catch (e) {
                alert(e.message)
                utility.errorLog(e.message, 'Fanta');
            }
            break;
        case "centerZone":
            try {
                renderMirindaAd(arg.addinfo);
            } catch (e) {
                alert(e.message)
            }
            break;
        case "airtelAds":
            try {
                songInfo = gaanaMaster.getCurrentInfo();
                var _div = "";
                _div = '<div class="left-p"><img src="../images/strip_above_player_left.jpg" alt="promo"/></div><div class="right-p"><img src="../images/strip_above_player_right.jpg" alt="promo"/></div>';
                $("#strip_above_player").addClass("strip_above_player").html(_div).animate({
                    bottom: '60px'
                }, {
                    duration: 500
                });
            } catch (e) {
                alert(e.message)
            }
            return;
        case "formulaOne":
            try {
                songInfo = gaanaMaster.getCurrentInfo();
                var _div = "";
                _div = '<div class="strip_above_player_formulaone" style="bottom: 60px; width:100%"><div class="left-p"><img alt="promo" src="' + TMUrl + '/images/formulaOne/left_z.jpg"></div><div class="center-p"><a href="http://pubads.g.doubleclick.net/gampad/clk?id=64519059&iu=/7176/IndiatimesTracker/Parx_F1Strip_Gaana_22OCT" target="_blank"><img alt="promo" src="' + TMUrl + '/images/formulaOne/right_p.jpg"></a></div><div class="right-p"><a href="http://www.zigwheels.com/motorsports/formula1" target="_blank"><img alt="promo" src="' + TMUrl + '/images/formulaOne/right_zigwheel.jpg"></a></div></div>';
                $("#strip_above_player").addClass("strip_above_player_formula_one").html(_div).animate({
                    bottom: '60px'
                }, {
                    duration: 500
                });
            } catch (e) {
                alert(e.message)
            }
            break;
        default:
            $("#" + h).fadeIn("fast");
            break;
    }
    var timeout = (stay || 10000);
    if (timeout > 0) {
        timeoutid = setTimeout(function () {
            Ads.hideAd(adId);
        }, timeout);
        document.getElementById(h).timeoutid = timeoutid
    }
};
Ads.hideAd = function (adId) {
    var h = this.getHolder(adId);
    if (h) {
        switch (adId) {
            case "adPlayerRight":
                $(".mainPlayer").animate({
                    width: "100%"
                }, 1000);
                $("#" + h).animate({
                    right: "-1000px"
                }, 1000);
                break;
            case "adPlayer_468x60":
                $("#" + h).animate({
                    bottom: "-175px"
                }, 1000);
                break;
            case "iframeiddiv":
                break;
            default:
                $("#" + h).fadeOut("fast");
                break;
        }
        clearTimeout(document.getElementById(h).timeoutid);
    }
}
var Logs = {
    url: TMUrl + "ajax/log",
    track_id: null,
    _playedtime: "00:00",
    _currentSogId: null,
    _source_id: null,
    _source: null,
    _playingSong: null,
    _lastPlayedTime: '00:00',
    _last_track_id: null,
    addTrackLog: function (cb) {
        try {
            if (typeof Logs._playedtime != 'undefined' && Logs._playedtime != "00:00") {
                if (Logs._playingSong.source == 5) {
                    var duration = staticPlayer.formatTime(this.calculateMirchiTime());
                } else {
                    var duration = Logs._playedtime;
                }
                $.ajax({
                    type: 'post',
                    url: BASE_URL + "ajax/log",
                    data: {
                        duration: duration,
                        platform: 'web',
                        track_id: Logs._playingSong.id,
                        souce: Logs._playingSong.source,
                        source_id: Logs._playingSong.source_id,
                        last_track_id: this._last_track_id
                    },
                    dataType: 'json',
                    success: function (data) {},
                    error: function (data) {}
                });
            }
        } catch (e) {}
    },
    calculateMirchiTime: function () {
        try {
            var t = this._playedtime.split(':');
            var totaltime = (parseInt(t[0]) * 60) + parseInt(t[1]);
            var p_t = this._lastPlayedTime.split(':');
            var p_t_s = (parseInt(p_t[0]) * 60) + parseInt(p_t[1]);
            var actualtime = totaltime - p_t_s
            return actualtime;
        } catch (e) {
            trace(e.message)
        }
    },
    update: function (track_id, timePlayed) {
        var params = {
            'time_played': timePlayed,
            'last_track_id': track_id
        }
        this.add(params);
    },
    addRadioLogWithTrack: function (param) {}
};
$.widget("ui.seekbar", $.extend({
    buffer: true
}, $.ui.slider.prototype, {
    _init: function () {
        var o = this.options;
        if (o.buffer !== false) {
            this.element.prepend("<div class='buffer'></div>");
            this.element.find(".buffer").addClass("ui-slider" + " ui-slider-" + this.orientation + " ui-widget" + " ui-corner-all" + (o.disabled ? " ui-slider-disabled ui-disabled" : ""));
            this.updateBuffer(0);
        }
        this.element.addClass("seekbar");
        $(".ui-slider-handle").attr("href", "javascript:void(0)")
        this.element.data('slider', this.element.data('seekbar'));
        return $.ui.slider.prototype._init.apply(this, arguments);
    },
    destory: function () {
        $(this.element).html("");
    },
    update: function (val) {
        this.value(val);
    },
    updateBuffer: function (val, animate) {
        if (this.options.buffer !== false) {
            if (animate) {
                if (this.options.orientation == "vertical") {
                    this.element.find(".buffer").animate({
                        height: val + "%"
                    }, 1000);
                } else {
                    this.element.find(".buffer").animate({
                        width: val + "%"
                    }, 1000);
                };
            } else {
                if (this.options.orientation == "vertical") {
                    this.element.find(".buffer").css({
                        height: val + "%"
                    });
                } else {
                    this.element.find(".buffer").css({
                        width: val + "%"
                    });
                };
            }
        };
    },
    reset: function () {
        this.value(0);
        this.max = 0;
        this.updateBuffer(0);
    }
}));
$.ui.seekbar.defaults = $.extend({}, $.ui.slider.defaults);
$(document).ready(function (e) {
    if ($("#tunePlayer_SWF").length == 0) {
        $("body").prepend("<div id='tunePlayer_SWF'></div>");
    };
    $('#mainPlayer').load(BASE_URL + "media/statictpls/player.tpl", function () {
        $('.qualityvalue').click(function () {
            createCookie('songquality', this.getAttribute("data-value"));
            $('.bit_rate').hide();
        })
        var missingHtml = 'It seems you don\'t have latest flash player installed. <br />'
        missingHtml += '<div style="padding:10px 0 0 0">'
        missingHtml += '<div class="fl" style="padding:0 20px 0 0"><a target="_blank" title="http://www.adobe.com/go/getflashplayer" href="http://www.adobe.com/go/getflashplayer">'
        missingHtml += '<img src="http://static.gaana.com/media/images-v1/160x41_Get_Flash_Player.jpg" width="160" height="41" alt="Get Adobe Flash Player" border="0" /></a></div>'
        missingHtml += '<div class="fl">Adobe Flash Player download link:<br>'
        missingHtml += '<a target="_blank" title="http://www.adobe.com/go/getflashplayer" href="http://www.adobe.com/go/getflashplayer">www.adobe.com/go/getflashplayer</a></div></div>';
        $('#missingFlash').html(missingHtml);
        if (typeof readCookie('playerloaded') != 'undefined' && readCookie('playerloaded') == 1) {
            $('.hotbox').animate({
                bottom: '0px'
            }, {
                duration: 500
            });
        }
    })
});

function UIController(opt) {
    var getDefaultSettings = function () {
        var settings = {
            containers: {
                player: '.mainPlayer',
                play: '.playPause',
                next: '.next',
                previous: '.previous',
                songSeekbar: '.songseek',
                volumeSeekbar: '.volumeseek',
                time: '.time',
                total: '.total',
                mute: '.mute',
                shuffle: '.shuffle',
                repeat: '.repeat',
                loader: '.loader'
            },
            events: {
                play: null,
                next: null,
                previous: null,
                songSeekbar: {
                    start: null,
                    slide: null,
                    stop: null,
                    enabled: true
                },
                volumeSeekbar: {
                    start: null,
                    slide: null,
                    stop: null,
                    enabled: true
                },
                mute: null,
                shuffle: null,
                repeat: null
            },
            volumeSeekValue: 0.9,
            songSeekValue: 0
        };
        return settings;
    };
    var components = getDefaultSettings();
    this._components = $.extend(true, components, opt);
    this.owner = {};
    this.containers = components.containers;
    this.events = components.events;
    var last = {};
    var _this = this,
        currentOwner;
    var getComponent = function (id) {
        return _this._components.containers.player + " " + _this._components.containers[id];
    };
    var elementCache = {};
    var getElement = function (ele) {
        if (elementCache[ele]) {
            return elementCache[ele];
        };
        elementCache[ele] = $(ele);
        return elementCache[ele];
    };
    var _disabled = function (cp, is, fade) {
        if (getComponent(cp)) {
            var holder = getComponent(cp);
            if (is == true) {
                switch (holder) {
                    case "songSeekbar":
                    case "volumeSeekbar":
                        break;
                    default:
                        var opacity = (!fade) ? 0.5 : 1;
                        $(holder).removeClass("enabled").addClass("disabled").css({
                            opacity: opacity,
                            cursor: 'default'
                        });
                        break;
                }
                _this.unbindEvent(cp);
            } else {
                switch (holder) {
                    case "songSeekbar":
                    case "volumeSeekbar":
                        break;
                    default:
                        $(holder).removeClass("disabled").addClass("enabled").css({
                            opacity: 1,
                            cursor: 'pointer'
                        });
                        break;
                }
                _this.unbindEvent(cp);
                if (_this.events[cp]) {
                    _this.bindEvent(cp, _this.events[cp], true);
                };
            };
        };
    };
    var resetOld = function () {
        getElement(getComponent("play")).unbind("click");
        getElement(getComponent("next")).unbind("click");
        getElement(getComponent("previous")).unbind("click");
        getElement(getComponent("mute")).unbind("click");
        getElement(getComponent("shuffle")).unbind("click");
        getElement(getComponent("repeat")).unbind("click");
    }
    var initButtonEvents = function () {
        resetOld();
        if (_this._components.events.play != null) {
            getElement(getComponent("play")).bind("click", _this._components.events.play);
        };
        if (_this._components.events.next != null) {
            getElement(getComponent("next")).bind("click", _this._components.events.next);
        };
        if (_this._components.events.previous != null) {
            getElement(getComponent("previous")).bind("click", _this._components.events.previous);
        };
        if (_this._components.events.mute != null) {
            getElement(getComponent("mute")).bind("click", _this._components.events.mute);
        };
        if (_this._components.events.shuffle != null) {
            getElement(getComponent("shuffle")).bind("click", _this._components.events.shuffle);
        };
        if (_this._components.events.repeat != null) {
            getElement(getComponent("repeat")).bind("click", _this._components.events.repeat);
        };
    }
    var initLayout = function () {
        if (isinit === false) {
            getElement(getComponent("songSeekbar")).seekbar({
                max: 0,
                value: _this._components.songSeekValue,
                range: "min",
                step: 0.01,
                start: function (evt, ui) {
                    if (_this._components.events.songSeekbar.start != null && _this._components.events.songSeekbar.enabled == true && !AdsWrapper.destroyAds()) {
                        _this._components.events.songSeekbar.start(evt, ui);
                    };
                },
                slide: function (evt, ui) {
                    getElement(getComponent("songSeekbar")).seekbar("update", ui.value);
                    if (_this._components.events.songSeekbar.slide != null && _this._components.events.songSeekbar.enabled == true && !AdsWrapper.destroyAds()) {
                        _this._components.events.songSeekbar.slide(evt, ui);
                    };
                },
                stop: function (evt, ui) {
                    if (_this._components.events.songSeekbar.stop != null && _this._components.events.songSeekbar.enabled == true && !AdsWrapper.destroyAds()) {
                        _this._components.events.songSeekbar.stop(evt, ui);
                    };
                }
            });
            getElement(getComponent("volumeSeekbar")).seekbar({
                orientation: "vertical",
                value: _this._components.volumeSeekValue,
                buffer: false,
                max: 1,
                range: "min",
                step: 0.01,
                animate: true,
                start: function (evt, ui) {
                    if (_this._components.events.volumeSeekbar.start != null) {
                        _this._components.events.volumeSeekbar.start(evt, ui);
                    };
                },
                slide: function (evt, ui) {
                    if (_this._components.events.volumeSeekbar.slide != null) {
                        _this._components.events.volumeSeekbar.slide(evt, ui);
                    };
                },
                stop: function (evt, ui) {
                    if (_this._components.events.volumeSeekbar.stop != null) {
                        _this._components.events.volumeSeekbar.stop(evt, ui);
                    };
                }
            });
        }
        isinit = true;
    };
    var isinit = false;
    var initLayoutAndEvents = function () {
        initButtonEvents();
        initLayout();
    };
    var init = function () {
        initLayoutAndEvents();
    };
    init();
    this.setOwner = function (name, opt) {
        var ownerObj;
        if (!this.owner[name]) {
            this._components = ownerObj = $.extend(true, getDefaultSettings(), opt);
            this.owner[name] = {};
            this.owner[name]["name"] = name;
            this.owner[name]["components"] = this._components;
            ownerObj = this.owner[name];
        } else {
            ownerObj = this.owner[name];
        }
        currentOwner = name;
        this._components = ownerObj.components;
        this.owner[name]["name"] = ownerObj.name;
        this.owner[name]["components"] = ownerObj.components;
        this.events = ownerObj.components.events;
        this.containers = ownerObj.components.containers;
        _this._components = ownerObj.components;
        initButtonEvents();
        return this;
    };
    this.getCurrentOwner = function () {
        return currentOwner;
    };
    this.restoreLastOwner = function () {
        if (lastOwner) {
            this.setOwner(lastOwner);
        }
    };
    this.disabled = function (h, is, fade) {
        if (h.indexOf(",") > 0) {
            var holders = h.split(",");
            for (var i = 0; i < holders.length; i++) {
                var crnt = $.trim(holders[i]);
                _disabled(crnt, is, fade);
            };
        } else {
            _disabled(h, is, fade);
        };
    };
    this.isDisabled = function (h) {
        return getElement(getComponent(h)).hasClass("disabled");
    };
    this.bindEvent = function (h, fn, isNew) {
        if (getComponent(h)) {
            this.unbindEvent(h);
            _this._components.events[h] = fn;
            switch (h) {
                case "songSeekbar":
                case "volumeSeekbar":
                    if (isNew != false) {
                        this.events[h] = fn;
                    };
                    if (fn.start) {
                        _this._components.events[h].start = fn.start;
                    }
                    if (fn.slide) {
                        _this._components.events[h].slide = fn.slide;
                    }
                    if (fn.stop) {
                        _this._components.events[h].stop = fn.stop;
                    }
                    _this._components.events[h].enabled = true;
                    break;
                default:
                    getElement(getComponent(h)).bind("click", _this._components.events[h]);
            };
        };
    };
    this.unbindEvent = function (h) {
        if (_this._components.events[h]) {
            switch (h) {
                case "songSeekbar":
                case "volumeSeekbar":
                    _this._components.events[h].enabled = false;
                    break;
                default:
                    getElement(getComponent(h)).unbind("click", _this._components.events[h]);
            };
        };
    };
    this.updateMeta = function (time, total, reset) {
        if (time) {
            if (getComponent("time")) {
                getElement(getComponent("time")).html(time);
            };
            if (!reset) {
                last.time = time;
            }
        };
        if (total) {
            if (getComponent("total")) {
                getElement(getComponent("total")).html(total);
            };
            if (!reset) {
                last.length = total;
            }
        };
    };
    this.getLastTime = function () {
        if (typeof last.time != 'undefined') {
            var t = last.time.split(":", ".");
        } else {
            var t = "00:00";
        }
        return t;
    };
    this.updateBuffer = function (value, anim) {
        getElement(getComponent("songSeekbar")).seekbar("updateBuffer", value, anim);
    };
    this.getTime = function () {
        return last;
    }
    this.resetTime = function () {
        last = {
            time: "00:00",
            length: "00:00"
        };
    }
    this.setCSS = function (h, css) {
        if (getComponent(h)) {
            getElement(getComponent(h)).addClass(css);
        };
    };
    this.removeCSS = function (h, css) {
        if (getComponent(h)) {
            getElement(getComponent(h)).removeClass(css);
        };
    };
    this.title = function (h, sText) {
        if (getComponent(h) && sText) {
            getElement(getComponent(h)).attr("title", sText);
        } else {
            return getElement(getComponent(h)).attr("title");
        };
    };
    this.setSeekbarOption = function (h, key, value) {
        if (getComponent(h)) {
            getElement(getComponent(h)).seekbar("option", key, value);
        };
    };
    this.getSeekbarOption = function (h, key) {
        if (getComponent(h)) {
            return getElement(getComponent(h)).seekbar("option", key);
        };
    };
    this.updateSongSeek = function (value) {
        if (getComponent("songSeekbar")) {
            getElement(getComponent("songSeekbar")).seekbar("update", parseFloat(value));
        };
    };
    this.updateVolumeSeek = function (value) {
        if (getComponent("volumeSeekbar")) {
            getElement(getComponent("volumeSeekbar")).seekbar("update", value);
        };
    };
    this.reset = function (h) {
        var comp = h || "songSeekbar";
        getElement(getComponent(comp)).seekbar("reset");
    };
    this.show = function (h, text, isBuffer) {
        if (h.indexOf(",") > 0) {
            var holders = h.split(",");
            for (var i = 0; i < holders.length; i++) {
                getElement(getComponent($.trim(holders[i]))).show();
            }
        } else {
            getElement(getComponent(h)).show();
            if (h == 'loader') {
                getElement(getComponent(h)).html(text || "loading...");
                if (!isBuffer) {
                    if (!getElement(getComponent("play")).hasClass("loadingPlay")) {
                        getElement(getComponent("play")).addClass("loadingPlay");
                        this.disabled("play", true, 1);
                    }
                } else {
                    if (getElement(getComponent("play")).hasClass("loadingPlay")) {
                        getElement(getComponent("play")).removeClass("loadingPlay");
                        this.disabled("play", false, 1);
                    }
                }
            }
        }
    };
    this.hide = function (h) {
        if (h.indexOf(",") > 0) {
            var holders = h.split(",");
            for (var i = 0; i < holders.length; i++) {
                getElement(getComponent($.trim(holders[i]))).hide();
            }
        } else {
            getElement(getComponent(h)).hide();
            if (h == 'loader') {
                getElement(getComponent("play")).removeClass("loadingPlay");
                this.disabled("play", false);
            }
        }
    };
    this.ClearTime = function () {
        getElement(getComponent("total")).html('');
        getElement(getComponent("time")).html('');
    }
};

function GaanaMaster(settings, isRadio) {
    try {
        var _this = this;
        this.version = "1.5.2";
        var _sound = jsPlayer.getSound("msPlayer");
        var _settings = $.extend(true, {
            data: null,
            index: 0,
            repeat: 0,
            shuffle: false,
            autoPlay: true,
            loadAtStartUp: true,
            events: {}
        }, settings);
        var _data = _settings.data;
        var _uiCtrlr;
        var _songs_array, _songs_shuffle_array, _current_songs_array;
        var playerModeLabel = {
            player: "jsPlayer",
            radioGaana: "radioGaana",
            radio: "radio",
            karaoke: "karaoke",
            preroll: "preroll",
            genreRadio: 'genreRadio'
        };
        var uiRules = {
            jsPlayer: {
                play: {
                    enable: true,
                    visible: true
                },
                next: {
                    enable: true,
                    visible: true
                },
                previous: {
                    enable: true,
                    visible: true
                },
                songSeekbar: {
                    enable: true,
                    visible: true
                },
                volumeSeekbar: {
                    enable: true,
                    visible: true
                },
                shuffle: {
                    enable: true,
                    visible: true
                },
                repeat: {
                    enable: true,
                    visible: true
                },
                total: {
                    visible: true
                },
                fn: function () {
                    $('.volumesettings').unbind('mouseenter mouseleave')
                    $('.volumesettings').hover(function () {
                        $('#volum').animate({
                            top: '-130px'
                        }, {
                            duration: 800,
                            easing: 'easeInOutSine',
                            queue: false
                        });
                    }, function () {
                        $('#volum').animate({
                            top: '50px'
                        }, {
                            duration: 800,
                            easing: 'easeInOutSine',
                            queue: false
                        });
                    })
                    $('#radio').removeClass('pjax genreRadio');
                    $('#radio').removeAttr('href');
                    Layout.enableGaanaIcon(true);
                    $(".mainPlayer .song_quality").show();
                    $('#volum').hide();
                    $('.playPause').removeClass('radiopause')
                    $('.playPause').removeClass('radioplay')
                    $(".radioIcon").removeClass("active");
                    $('#radio').removeClass('actradio');
                    $('.echonest1').css({
                        display: 'none'
                    });
                    $('.radio_tool').css({
                        display: 'inline-block'
                    })
                    manageButtonsForSongCount('next');
                    $('.player_right').removeAttr('style');
                    $('.playercontrol').removeAttr('style');
                    $('.rgtSeprator #radio').removeAttr('style');
                }
            },
            radioGaana: {
                play: {
                    enable: true,
                    visible: true
                },
                next: {
                    enable: true,
                    visible: true
                },
                previous: {
                    enable: false,
                    visible: true
                },
                songSeekbar: {
                    enable: true,
                    visible: true
                },
                volumeSeekbar: {
                    enable: true,
                    visible: true
                },
                shuffle: {
                    enable: false,
                    visible: true
                },
                repeat: {
                    enable: false,
                    visible: true
                },
                total: {
                    visible: true
                },
                fn: function () {
                    $('.playPause').addClass('radiopause')
                    $(".radioIcon").addClass("active");
                    $('.songadded').css({
                        display: 'none'
                    });
                    $('.player_right').css('width', '90px');
                    $('.playercontrol').css({
                        padding: '0 90px 0 230px'
                    });
                    $('.rgtSeprator #radio').css('background-position', '-167px -39px');
                    $('.echonest1').css({
                        display: 'none'
                    });
                    $('.radio_tool').css({
                        display: 'inline-block'
                    })
                    _uiCtrlr.disabled("previous", true);
                    _setRepeat(undefined, 0);
                    if (_getSongsArray().length > 1) {
                        _uiCtrlr.disabled("next", false);
                    } else {
                        _uiCtrlr.disabled("next", true);
                    }
                }
            },
            radio: {
                play: {
                    enable: true,
                    visible: true
                },
                next: {
                    enable: true,
                    visible: false
                },
                previous: {
                    enable: true,
                    visible: false
                },
                songSeekbar: {
                    enable: true,
                    visible: false
                },
                volumeSeekbar: {
                    enable: true,
                    visible: true
                },
                shuffle: {
                    enable: true,
                    visible: false
                },
                repeat: {
                    enable: true,
                    visible: false
                },
                total: {
                    visible: false
                },
                fn: function () {
                    $('.volumesettings').unbind('mouseenter mouseleave')
                    $('.volumesettings').hover(function () {
                        $('#volum').animate({
                            top: '-130px'
                        }, {
                            duration: 800,
                            easing: 'easeInOutSine',
                            queue: false
                        });
                    }, function () {
                        $('#volum').animate({
                            top: '90px'
                        }, {
                            duration: 800,
                            easing: 'easeInOutSine',
                            queue: false
                        });
                    })
                    Layout.showHideSocial(false);
                    Layout.showHideGaanaRadio(false);
                    hideNowPlaying();
                    $(".radioIcon").removeClass("active");
                    superCookie.setItem('genre_radio_url', null);
                    $('#radio').removeClass('pjax genreRadio');
                    $('#radio').removeAttr('href');
                    _uiCtrlr.removeCSS("play", "play");
                    _uiCtrlr.setCSS("play", "pause");
                    _uiCtrlr.title("play", "Pause");
                    $('.echonest1').css({
                        display: 'none'
                    });
                    $('.radio_tool').css({
                        display: 'inline-block'
                    })
                }
            },
            karaoke: {
                play: {
                    enable: true,
                    visible: true
                },
                next: {
                    enable: false,
                    visible: true
                },
                previous: {
                    enable: false,
                    visible: true
                },
                songSeekbar: {
                    enable: false,
                    visible: true
                },
                volumeSeekbar: {
                    enable: true,
                    visible: true
                },
                shuffle: {
                    enable: false,
                    visible: true
                },
                repeat: {
                    enable: false,
                    visible: true
                },
                total: {
                    visible: true
                },
                fn: function () {
                    $('.playPause').removeClass('radiopause')
                    $('.playPause').removeClass('radioplay')
                    $('.volumesettings').unbind('mouseenter mouseleave')
                    $('.volumesettings').hover(function () {
                        $('#volum').animate({
                            top: '-130px'
                        }, {
                            duration: 800,
                            easing: 'easeInOutSine',
                            queue: false
                        });
                    }, function () {
                        $('#volum').animate({
                            top: '90px'
                        }, {
                            duration: 800,
                            easing: 'easeInOutSine',
                            queue: false
                        });
                    })
                    Layout.showHideSocial(false);
                    Layout.showHideGaanaIcon(false);
                    _uiCtrlr.removeCSS("play", "pause");
                    _uiCtrlr.removeCSS("play", "play");
                    _uiCtrlr.setCSS("play", "stop");
                    _uiCtrlr.title("play", "Stop");
                    $('#radio').removeClass('pjax genreRadio');
                    $('#radio').removeAttr('href');
                    _setRepeat(undefined, 0);
                    $('.echonest1').css({
                        display: 'none'
                    });
                    $('.radio_tool').css({
                        display: 'inline-block'
                    });
                }
            },
            genreRadio: {
                play: {
                    enable: true,
                    visible: true
                },
                next: {
                    enable: true,
                    visible: true
                },
                previous: {
                    enable: true,
                    visible: false
                },
                songSeekbar: {
                    enable: true,
                    visible: false
                },
                volumeSeekbar: {
                    enable: true,
                    visible: true
                },
                shuffle: {
                    enable: true,
                    visible: false
                },
                repeat: {
                    enable: true,
                    visible: false
                },
                total: {
                    visible: false
                },
                fn: function () {
                    $('.volumesettings').unbind('mouseenter mouseleave')
                    $('.volumesettings').hover(function () {
                        $('#volum').animate({
                            top: '-130px'
                        }, {
                            duration: 800,
                            easing: 'easeInOutSine',
                            queue: false
                        });
                    }, function () {
                        $('#volum').animate({
                            top: '90px'
                        }, {
                            duration: 800,
                            easing: 'easeInOutSine',
                            queue: false
                        });
                    })
                    Layout.showHideSongQueue(false);
                    Layout.enableGaanaIcon(false);
                    $(".radioIcon").removeClass("active");
                    $('.playPause').removeClass('radiopause')
                    $('.playPause').removeClass('radioplay')
                    $(".radioIcon").removeClass("active");
                    manageButtonsForSongCount('next');
                    _uiCtrlr.removeCSS("play", "play");
                    _uiCtrlr.setCSS("play", "pause");
                    _uiCtrlr.title("play", "Pause");
                    $('.echonest1').css({
                        display: 'none'
                    });
                    $('.radio_tool').css({
                        display: 'inline-block'
                    })
                }
            },
            preroll: {
                play: {
                    enable: false,
                    visible: true
                },
                next: {
                    enable: false,
                    visible: true
                },
                previous: {
                    enable: false,
                    visible: true
                },
                songSeekbar: {
                    enable: false,
                    visible: true
                },
                volumeSeekbar: {
                    enable: true,
                    visible: true
                },
                shuffle: {
                    enable: false,
                    visible: true
                },
                repeat: {
                    enable: false,
                    visible: true
                },
                total: {
                    visible: true
                },
                fn: function () {
                    $(".radioIcon").removeClass("active");
                    Layout.showHideGaanaIcon(false);
                    Layout.showHideSocial(false);
                    _setRepeat(undefined, 0);
                }
            }
        };
        var _isShuffleOn = false,
            currentPlayerMode = playerModeLabel.player,
            playerMode = playerModeLabel.player;
        var _currentIndex = _settings.index;
        var _nextIndex = '';
        var _radioId = (isRadio || false);
        var _isUI_Init = false,
            logsUpdated = false,
            firstPlay = true,
            reconnect = false,
            playmode = false;
        var prerollPlayed = {}, playingPreRoll = false;
        var playerLogTimer, logTime = 10;
        var currentVal, oldVal, currentVolume, oldVolume, isRadio = false,
            ignoreRepeat = false,
            ignoreShuffle = false,
            playingFromCache = false,
            hasCacheData = false;
        this._events = $.extend({}, _settings.events);
        var _radioThemeLevel = '';
        var _cursonginfo = '';
        var _radioThemeId = 0;
        var TimeChecker = {
            intervalid: 0,
            counter: 1,
            maxCheck: 60,
            start: function () {
                TimeChecker.intervalid = setInterval(function () {
                    TimeChecker.counter++;
                    if (TimeChecker.counter >= TimeChecker.maxCheck) {
                        TimeChecker.reset();
                    }
                }, 1000)
            },
            reset: function () {
                this.counter = 1;
                clearInterval(TimeChecker.intervalid);
            }
        };
        var addGA_Events = function (act, lbl) {
            var action = act
            var label = lbl;
            _gaq.push(['_trackEvent', "Player UI Interactions", "g3-" + action, label]);
        }
        var _saveList = function () {
            if (_data) {
                if ($.trim(playerMode) == 'genreRadio') {
                    superCookie.setItem(_variables.CookiesLabel.que, _data);
                    Layout.setgenreRadioSongCards();
                } else {
                    superCookie.setItem(_variables.CookiesLabel.que, _data);
                }
            };
        };
        var _makeData = function (s) {
            var str = s;
            _songs_array = new Array(), _songs_shuffle_array = new Array(), _current_songs_array = new Array();
            if (!str) return;
            if (typeof str != 'undefined') {
                _songs_array = DataParser.parseData(str.toString());
            } else {
                _songs_array = null;
            }
            _songs_shuffle_array = ArrayUtils.shuffleArray(ArrayUtils.copyArray(_songs_array));
            _current_songs_array = (_isShuffleOn === true) ? ArrayUtils.copyArray(_songs_shuffle_array) : ArrayUtils.copyArray(_songs_array);
        };
        var _initUI = function () {
            _uiCtrlr = uiController.setOwner("gaanaMaster", {
                events: {
                    play: _play,
                    next: _next,
                    previous: _previous,
                    songSeekbar: {
                        start: _setSongDragging,
                        stop: _dragSongSeek
                    },
                    volumeSeekbar: {
                        slide: _adjustVolume,
                        stop: afterMute
                    },
                    mute: _mute,
                    shuffle: _shufflePlay,
                    repeat: _setRepeat
                }
            });
            _isUI_Init = true;
            _setRepeat(undefined, "playlist");
        };
        var _updateMeta = function (arg) {
            staticPlayer.updateMeta(arg);
        };
        var _updateBuffer = function (arg) {
            staticPlayer.updateBuffer(arg);
        };
        var soundOnInit = function (arg) {
            try {
                $('.yt_video_close').trigger('click');
                playerMode = $.trim(playerMode);
                TimeChecker.reset();
                resetStartupSettings();
                _uiCtrlr = uiController.setOwner("gaanaMaster");
                staticPlayer.setSound_n_UI(_sound, _uiCtrlr, playerMode);
                staticPlayer.updatePlayButton(true);
                _uiCtrlr.hide("loader");
                oldVolume = arg.volume;
                _uiCtrlr.updateVolumeSeek(arg.volume);
                if ($.trim(playerMode) == "radio") {} else {
                    var songInfo = $.parseJSON(arg.songInfo);
                }
                var cacheData = superCookie.getItem(_variables.CookiesLabel.que);
                if (flagAdsOverThePlayer || flagAirtelAdsOverThePlayer) {
                    clearPromotionalLayerAbovePlayer();
                }
                _sound.onPosition(2, function () {
                    if (!isRadio) {
                        if ($.trim(playerMode) == "karaoke") {
                            var _s = 7;
                            var _s_id = $.parseJSON(arg.songInfo).id;
                        } else {
                            var _s = $.parseJSON(arg.songInfo).source;
                            var _s_id = $.parseJSON(arg.songInfo).source_id
                        }
                        $.ajax({
                            type: 'post',
                            url: BASE_URL + "ajax/get_radio_stream_data",
                            data: {
                                id: $.parseJSON(arg.songInfo).id,
                                source: _s,
                                source_id: _s_id,
                                songtime: uiController.getTime().length,
                                action: 'track'
                            },
                            success: function (data) {
                                if (typeof _s == 'undefined' || _s == '' || _s == null) {
                                    _s = 1;
                                }
                                var category = getKey(_s, requestDataSource);
                                gAnalyticChannelClick(category, 'Play', _s_id + '|' + $.parseJSON(arg.songInfo).id);
                                Logs._last_track_id = data;
                            }
                        });
                    }
                });
                _sound.onPosition(120, function () {
                    if (isGaanaPaidUserCheck() || _globalPlayCounter <= videoAdsCondition) {
                        return;
                    }
                    if ($.trim(playerMode) != "radio" && $.trim(playerMode) != "karaoke") {
                        AdsWrapper.updateAdsCounter('TwoMin');
                    }
                });
                _sound.onPosition(180, function () {
                    if (isGaanaPaidUserCheck() || _globalPlayCounter <= videoAdsCondition) {
                        return;
                    }
                    if ($.trim(playerMode) != "radio" && $.trim(playerMode) != "karaoke") {
                        AdsWrapper.updateAdsCounter('ThreeMin');
                    }
                });
                _sound.onPosition(30, function () {
                    if ($.trim(playerMode) == "radio") {
                        utility.postOnFacebook({
                            action: 'music.listens',
                            obj: 'radio_station',
                            url: TMUrl + "player/" + arg.radioInfo.stationId + "|||radiostation",
                            radioname: arg.radioInfo.feedId
                        })
                    }
                    if ($.trim(playerMode) != "karaoke" && playingPreRoll == false) {
                        var uriToPost = getUrl(songInfo.title, songInfo.id, songInfo.seokey);
                        if (typeof uriToPost != 'undefined') {
                            utility.postOnFacebook({
                                action: 'music.listens',
                                obj: 'song',
                                url: TMUrl + "song/" + uriToPost
                            })
                        }
                    }
                })
                _sound.onPosition(4, function () {
                    if (isGaanaPaidUserCheck()) {
                        return;
                    }
                    if (playingPreRoll == false && $.trim(playerMode) != "radio" && $.trim(playerMode) != "karaoke") {
                        songInfo = gaanaMaster.getCurrentInfo();
                        currentSongId = songInfo.id;
                        isAdsChanelSong = false;
                        if (typeof (playlistTrackIdsArray) != 'undefined' && playlistTrackIdsArray != null) {
                            isAdsChanelSong = (playlistTrackIdsArray.indexOf(currentSongId) != -1);
                        }
                        if (gridPlaySong && songInfo.channelId == 35) {
                            gridPlaySong = false
                        } else if (flagAirtelAdsOverThePlayer && isAdsChanelSong) {
                            gAnalyticChannelClick('Aitel song of the day', 'Play', 'Banner over Player');
                            Ads.showAd('airtelAds', 5000, arg);
                        } else if (flagAdsOverThePlayer) {
                            Ads.showAd('formulaOne', 5000, arg);
                        }
                    }
                });
                _sound.onPosition(10, function () {
                    if ($.trim(playerMode) != "karaoke" && playingPreRoll == false) {
                        if (typeof songInfo.singalong != 'undefined' && songInfo.singalong == 1) {
                            try {
                                var items = Array('singalong-icon.jpg', "singalong-icon1.png");
                                var item = items[Math.floor(Math.random() * items.length)];
                                $('.singalong_popup').html('<a href="javascript:void(0)" id="popup_singalong"><img  src="' + TMStaticUrl + 'images/' + item + '" width="220px" height="70" alt="Singalong"/></a>');
                                $('.singalong_popup').animate({
                                    left: '0px'
                                }, {
                                    duration: 1000,
                                    easing: 'easeOutBack'
                                });
                                $("#popup_singalong").unbind('click')
                                $("#popup_singalong").bind('click', function () {
                                    gAnalyticChannelClick('singalongpopup', 'Play', item);
                                    ajaxPageRequestHandler.invoke({
                                        url: '/singalong/inline/' + songInfo.seokey,
                                        'container': 'main_middle_content'
                                    });
                                })
                                setTimeout(function () {
                                    hide_singalong_popup()
                                }, 30000);
                            } catch (e) {}
                        }
                    }
                })
                logsUpdated = false;
            } catch (e) {}
            if (isRadio === true) {} else {
                staticPlayer.FB_Events.pause();
                RadioMetaData.stopUpdating();
                Logs._playingSong = $.parseJSON(arg.songInfo);
            }
            if ($.trim(playerMode) == "echonestplayer") {
                uiController.disabled("next", false);
            } else {
                manageButtonsForSongCount('next');
            }
        }
        var _initSoundCallback = function () {
            _sound.onMeta(_updateMeta);
            _sound.onStreamLoad(_updateBuffer);
            _sound.onPause(function (arg) {
                Layout.pauseSong(arg)
            });
            _sound.onInit(soundOnInit);
            _sound.onSoundComplete(function (arg) {
                logsUpdated = true;
                afterSoundCompleted(arg);
                staticPlayer.FB_Events.stop();
                setTimeout(dfpAdSlots('rightnav'), 2000);
            });
            _sound.onIO_Error(function (arg) {
                _uiCtrlr.hide("loader");
                _uiCtrlr.removeCSS('play', 'pause');
                _uiCtrlr.removeCSS('play', 'play')
                messagebox.open({
                    msg: "Please check your network connection.",
                    autoclose: true
                });
            })
            _sound.onError(function (arg) {
                trace(arg)
                gAnalyticChannelClick('Player Error', arg);
                if (arg == "Network IO error." || arg == 'Network has been changed. Please retry.') {
                    _uiCtrlr.hide("loader");
                    _uiCtrlr.removeCSS('play', 'pause');
                    _uiCtrlr.removeCSS('play', 'play')
                    messagebox.open({
                        msg: "Please check your network connection.",
                        autoclose: true
                    });
                } else if (arg == 'NetConnection.Connect.IdleTimeOut') {} else if (arg == 'Connection is closed. Please retry.') {
                    _uiCtrlr.hide("loader");
                    _uiCtrlr.removeCSS('play', 'pause');
                    _uiCtrlr.removeCSS('play', 'play')
                    reconnect = true;
                    messagebox.open({
                        msg: "Connection is closed. Please retry.",
                        autoclose: true
                    });
                } else {
                    if (typeof playerMode != 'undefined' && playerMode != 'radio') {
                        messagebox.open({
                            msg: "Oops... There is some error. Moving to next...",
                            autoclose: true
                        });
                        Logs._playedtime = "00:00";
                        _next();
                    }
                }
            });
            staticPlayer.setSound_n_UI(_sound, _uiCtrlr, playerMode);
        };
        var _init = function () {
            try {
                if (!_isUI_Init) {
                    _initUI();
                    _initSoundCallback();
                };
                if (_data != null) {
                    _makeData(_data);
                    if (_settings.loadAtStartUp == true) {
                        _nowplaying_start_up = false;
                        _moveToSongIndex(_currentIndex);
                    } else {
                        hasCacheData = true;
                        var obj = _songs_array;
                        _nowplaying_start_up = true;
                        if (_getSongsArray().length > 0) {
                            if (_getSongsArray().length > 1) {
                                $('.songcnt').html(_getSongsArray().length + " Songs")
                            } else {
                                $('.songcnt').html(_getSongsArray().length + " Song")
                            }
                        }
                        Layout.renderCurrentSongInfo(obj[0].data, 0);
                    }
                } else {
                    _makeData();
                };
                manageButtonsForSongCount();
                if (superCookie) {
                    if (superCookie.isReady) {
                        _saveList();
                    } else {
                        superCookie.onReady = function () {
                            _saveList();
                        }
                    }
                }
            } catch (e) {
                utility.errorLog(e.message, "init Error");
            }
        };
        var _inializeGaanaMaster = function () {
            if (!jsPlayer.canPlay) {
                jsPlayer.showSWF_Error();
                return false;
            }
            if (_sound.isReady) {
                _init();
            } else {
                _sound.onReady(function () {
                    _init();
                });
            };
        };
        var applyUIRules = function () {
            var rules = uiRules[playerMode];
            for (var i in rules) {
                if (i !== 'fn') {
                    if (rules[i].enable === undefined) {
                        _uiCtrlr.disabled(i, false);
                    } else {
                        _uiCtrlr.disabled(i, !rules[i].enable);
                    }
                    if (rules[i].visible) {
                        _uiCtrlr.show(i);
                    } else {
                        _uiCtrlr.hide(i);
                    }
                }
            }
            if (rules.fn !== undefined) {
                rules.fn.apply(this, arguments);
            }
        }
        var setUIForPlayer = function () {
            _uiCtrlr.show("next,previous,total,shuffle,repeat,songSeekbar");
            Layout.showHideGaanaIcon(true);
            _uiCtrlr.removeCSS("play", "stop");
            if (_settings.autoPlay == true) {
                $(".playPause").removeClass("play");
                $(".playPause").addClass("pause");
                _uiCtrlr.title("play", "Pause");
            } else {
                _uiCtrlr.removeCSS("play", "pause");
                _uiCtrlr.setCSS("play", "play");
                _uiCtrlr.title("play", "Play");
                _settings.autoPlay = true;
            }
            Layout.showHideSocial(true);
            Layout.showHideGaanaRadio(true);
            applyUIRules();
        }
        var setUIForRadio = function () {
            applyUIRules();
        }
        var _setSongDragging = function (evt, ui) {
            staticPlayer.isDragging = true;
        };
        var _dragSongSeek = function (evt, ui) {
            currentVal = ui.value;
            _sound.seekTo(currentVal);
            if (currentVal < oldVal) {
                addGA_Events("Seek Bar Back", "drag");
            } else {
                addGA_Events("Seek Bar Forward", "drag");
            }
            oldVal = currentVal;
            staticPlayer.isDragging = false;
        };
        var _adjustVolume = function (evt, ui) {
            staticPlayer.setVolume(evt, ui);
            currentVolume = ui.value;
        };
        var afterMute = function () {
            if (currentVolume > oldVolume) {
                addGA_Events("Volume Bar Forward", "drag");
            } else {
                addGA_Events("Volume Bar Back", "drag");
            }
            oldVolume = currentVolume;
            staticPlayer.afterMute();
        }
        var _mute = function (evt) {
            staticPlayer.mute();
        };
        var resetStartupSettings = function () {
            _settings.loadAtStartUp = true;
            hasCacheData = false;
            firstPlay = false;
            reconnect = false;
            playmode = false;
            _this.resetComp();
        }
        var _play = function (evt) {
            if (!jsPlayer.canPlay) {
                jsPlayer.showSWF_Error();
                return false;
            }
            if (_settings.loadAtStartUp == false && hasCacheData == true && firstPlay == true) {
                _moveToSongIndex(0);
                resetStartupSettings();
            } else if (firstPlay == true) {
                _this.playAutomatic();
                resetStartupSettings();
            } else if (playmode == true) {
                _currentIndex = 0;
                _moveToSongIndex(0);
                resetStartupSettings();
            } else if (reconnect == true) {
                if (playerMode == 'radio') {
                    gaanaMaster.playRadio(RadioMetaData.streamdata)
                } else {
                    _moveToSongIndex(_currentIndex);
                    resetStartupSettings();
                }
            }
            var playigStatus = _sound.isPlaying();
            if (playigStatus) {
                staticPlayer.FB_Events.pause();
                addGA_Events("Pause", playerMode);
            } else {
                staticPlayer.FB_Events.play();
                addGA_Events("Play", playerMode);
            }
            staticPlayer.playToggle();
        };

        function afterSoundCompleted(arg) {
            staticPlayer.updateMeta({
                time: _sound.length,
                length: _sound.length
            });
            _this.resetComp();
            if (playingPreRoll == true) {
                playingPreRoll = false;
                _prerolllog = true
                var arr = _getSongsArray();
                var songInfo = arr[_currentIndex];
                prerollPlayed["pre_" + songInfo.data.id] = true;
                _moveToSongIndex(_currentIndex);
            } else {
                _next();
            }
        }
        var _next = function (evt) {
            var arr = _getSongsArray();
            var songInfo = arr[_currentIndex];
            var incrCurrentIndex = false;
            if (!jsPlayer.canPlay) {
                jsPlayer.showSWF_Error();
                return false;
            }
            resetStartupSettings();
            var repeatType = _settings.repeat;
            if (evt) {
                if (!gaanaMaster.registrationLimitPopUp('Player Next')) return false;
                if ($(evt.target).hasClass("disabled")) {
                    return false;
                }
                ignoreRepeat = true;
                if (_currentIndex == _getSongsArray().length - 1) {
                    repeatType = "playlist";
                }
                addGA_Events("Next", playerMode);
            } else {
                if (playerMode == playerModeLabel.radioGaana) {
                    repeatType = "playlist";
                }
                addGA_Events("Next", "automatic");
                $('.addedsonglist').hide();
                $('.songadded').removeClass('whitebg');
                $('.songcnt').addClass('white')
            }
            clearTimeout(playerLogTimer);
            if (repeatType == "current" && ignoreRepeat == false) {
                _current_songs_array = ArrayUtils.copyArray(_songs_array);
                gaanaMaster.playById(_activeSongID)
                Logs.addTrackLog()
            } else {
                if (repeatType == "playlist" && _currentIndex >= _getSongsArray().length - 1) {
                    if (playerMode == playerModeLabel.radioGaana) {
                        gaanaMaster.radioGaana(true);
                    } else {
                        _currentIndex = -1;
                    }
                };
                if (_currentIndex < _getSongsArray().length - 1) {
                    _currentIndex++;
                    incrCurrentIndex = true;
                    if (_this._events["onNext"]) {
                        _this._events["onNext"](_currentIndex);
                    };
                    if (_nextIndex != '' && parseInt(_nextIndex) >= 0) {
                        _currentIndex = _nextIndex;
                        _nextIndex = '';
                    }
                    _moveToSongIndex(_currentIndex);
                };
            };
            if (_currentIndex == _getSongsArray().length - 1 && repeatType == 0) {
                _sound.stopMe();
                _this.resetComp();
                if (!evt) {
                    if (!incrCurrentIndex) {
                        playmode = true
                        _uiCtrlr.removeCSS('play', 'pause');
                        _uiCtrlr.setCSS('play', 'play')
                        _currentIndex = -1;
                        Layout.renderCurrentSongInfo(_getSongsArray()[0].data, 0);
                    }
                }
            }
            if (_getSongsArray().length == 0) {
                resetStartupSettings();
                $('#trackInfo').html('')
                $('.total').html('');
                $('.startime').html('')
                _uiCtrlr.removeCSS('play', 'pause');
                _uiCtrlr.removeCSS('play', 'play')
                _uiCtrlr.disabled('play', true);
                _uiCtrlr.disabled('songSeekbar', true);
                _uiCtrlr.disabled('next', true);
                _uiCtrlr.disabled('previous', true);
                _uiCtrlr.disabled('repeat', true);
            }
            ignoreRepeat = false;
        };
        var _previous = function (evt) {
            if (!jsPlayer.canPlay) {
                jsPlayer.showSWF_Error();
                return false;
            }
            resetStartupSettings();
            if (evt) {
                if (!gaanaMaster.registrationLimitPopUp('Player Previous')) return false;
                if ($(evt.target).hasClass("disabled")) {
                    return false;
                }
                ignoreRepeat = true;
                addGA_Events("Previous", playerMode);
            }
            if (_currentIndex > 0) {
                _currentIndex--;
                if (_this._events["onPrevious"]) {
                    _this._events["onPrevious"](_currentIndex);
                };
                _moveToSongIndex(_currentIndex);
            };
            ignoreRepeat = false;
        };
        var repeatButtonUI = function () {
            if (_settings.repeat == "playlist") {
                _uiCtrlr.removeCSS("repeat", "repeatOne");
                _uiCtrlr.setCSS("repeat", "repeatAll");
                _uiCtrlr.title("repeat", "Repeat All");
            } else if (_settings.repeat == "current") {
                _uiCtrlr.removeCSS("repeat", "repeatAll");
                _uiCtrlr.setCSS("repeat", "repeatOne");
                _uiCtrlr.title("repeat", "Repeat this song");
            } else {
                _uiCtrlr.removeCSS("repeat", "repeatAll");
                _uiCtrlr.removeCSS("repeat", "repeatOne");
                _uiCtrlr.title("repeat", "Repeat is off");
            }
        }
        var _setRepeat = function (evt, byvalue) {
            if (byvalue === undefined) {
                if ($(evt.target).hasClass("disabled")) {
                    return false;
                }
                if (_settings.repeat == 0) {
                    _settings.repeat = "current";
                    addGA_Events("Repeat this song", "manual");
                } else if (_settings.repeat == "current") {
                    if (_getSongsArray().length <= 1) {
                        _settings.repeat = 0;
                        addGA_Events("Repeat this song", "manual");
                    } else {
                        _settings.repeat = "playlist";
                        addGA_Events("Repeat all", "manual");
                    }
                } else if (_settings.repeat == "playlist") {
                    _settings.repeat = 0;
                    addGA_Events("Repeat unset", "manual");
                };
            } else {
                _settings.repeat = byvalue;
            }
            repeatButtonUI();
        };
        var _shuffleUI = function () {
            if (_isShuffleOn === true) {
                _uiCtrlr.removeCSS("shuffle", "off");
                _uiCtrlr.setCSS("shuffle", "on");
                _uiCtrlr.title("shuffle", "Shuffle is on");
            } else {
                _uiCtrlr.removeCSS("shuffle", "on");
                _uiCtrlr.setCSS("shuffle", "off");
                _uiCtrlr.title("shuffle", "Shuffle is off");
            };
        }
        var _shufflePlay = function (evt, byvalue) {
            if (!jsPlayer.canPlay) {
                jsPlayer.showSWF_Error();
                return false;
            }
            if (evt) {
                if ($(evt.target).hasClass("disabled")) {
                    return false;
                }
                if (_isShuffleOn) {
                    addGA_Events("Shuffle on", "manual");
                } else {
                    addGA_Events("Shuffle off", "manual");
                }
            }
            _isShuffleOn = !_isShuffleOn;
            if (byvalue !== undefined) {
                _isShuffleOn = byvalue;
            }
            if (_isShuffleOn === true) {
                _currentIndex = 0;
                ArrayUtils.shuffleArray(_songs_shuffle_array);
            } else {
                _currentIndex = _current_songs_array[_currentIndex].index;
            };
            _shuffleUI();
            _current_songs_array = (_isShuffleOn == true) ? ArrayUtils.copyArray(_songs_shuffle_array) : ArrayUtils.copyArray(_songs_array);
            if (_isShuffleOn === true && !_sound.isPlaying()) {
                _moveToSongIndex(_currentIndex);
            };
        };
        var _getSongsArray = function () {
            return _current_songs_array;
        };
        var _moveToSongIndex = function (index) {
            var arr = _getSongsArray();
            if (ignoreShuffle == true) {
                ignoreShuffle = false;
                arr = _songs_array;
            }
            if (index < arr.length) {
                var obj = arr[index];
                playNow(obj, 'show');
                _currentSogId = obj.data.id;
                _source_id = (typeof obj.data.source_id != 'undefined') ? obj.data.source_id : 1;
                _source = (typeof obj.data.source != 'undefined') ? obj.data.source : 1;
                if (currentPlayerMode == "karaoke") {
                    _source = 7;
                    _source_id = 1;
                }
                var source = (typeof obj.data.channelId != 'undfined') ? obj.data.channelId : 0
                if (typeof _uiCtrlr.getTime().time != 'undefined' && _uiCtrlr.getTime().time != "00:00") {
                    try {
                        Logs.addTrackLog();
                        _lastplayermode = currentPlayerMode;
                        _uiCtrlr.resetTime();
                        staticPlayer.updateMeta({
                            time: 0,
                            length: 0
                        });
                    } catch (e) {
                        alert(e.message)
                    }
                } else {
                    Logs._playedtime = "00:00"
                    Logs.addTrackLog();
                }
            };
        };
        var playTimer;
        var playNow = function (obj, shownextinfo) {
            $('#video_player_link').hide();
            $('#lyrics_player_link').hide();
            if (AdsWrapper.destroyAds()) {
                AdsWrapper.printCurrentSong();
                return;
            }
            _globalPlayCounterWithPreroll++;
            TimeChecker.start();
            isRadio = false;
            var filePath = (typeof (obj.data) == "string") ? (obj.data) : $.toJSON((obj.data));
            var songInfo = $.parseJSON(filePath);
            songInfo.albumid = (typeof songInfo.albumid != 'undefined' && songInfo.albumid > 0) ? songInfo.albumid : songInfo.source_id;
            if ($.inArray(songInfo.albumid, prerollOnAlbumBasis) >= 0 && !prerollFlagAlbumId) {
                Layout.renderArtistPreInfo({
                    title: prerollOnAlbumInfo.title,
                    playerartwork: prerollOnAlbumInfo.artwork,
                    impression_tracking_url: 'http://gaana.com',
                    'preroll': true
                });
                playerMode = playerModeLabel.preroll;
                applyUIRules();
                try {
                    playTimer = setTimeout(function () {
                        playingPreRoll = true;
                        Logs._playedtime = "00:00"
                        _sound.createSound('{"path":"' + prerollOnAlbumInfo.path + '","sType":"rtmp"}', true);
                        gAnalyticChannelClick('PreRoll', 'Play', 'Veeram');
                    }, 1);
                } catch (e) {
                    alert(e.message)
                }
                prerollFlagAlbumId = true;
            } else if (AdsWrapper.checkAdsCounter(playerMode) && !isGaanaPaidUserCheck()) {
                var _tmpAdsType = currentAdsInQueue;
                if (_tmpAdsType == 'video' || _tmpAdsType == 'song') {
                    try {
                        $('.radio_song_carousel').hide();
                        var soundId = jsPlayer.getSound('msPlayer');
                        soundId.stopMe();
                        if (_tmpAdsType == 'video') AdsWrapper.showAds('video');
                        else if (_tmpAdsType == 'song') AdsWrapper.showAds('audio');
                    } catch (e) {
                        alert(e.message)
                    }
                }
            } else if (utility.hasChannelPreRoll() != "") {
                utility.playChannelPreRoll();
            } else if ((songInfo.artistPreRoll !== undefined && songInfo.artistPreRoll != '') && prerollPlayed["pre_" + songInfo.id] === undefined) {
                playSongPreRoll();
            } else {
                _globalPlayCounter++;
                if (_globalPlayCounter == 3 && geoLocation != 'undefined' && geoLocation == "IN" && jsuserdata.isMobileUser == 'N') {
                    if (currentPlayerMode == 'jsPlayer') {
                        registration.popupAppsDownload();
                    }
                }
                playingPreRoll = false;
                playSong();
            }

            function playSong() {
                $('#playercontrol_transparent').remove();
                if (typeof player != 'undefined' && typeof YT != 'undefined' && YT.PlayerState.PLAYING == 1) {
                    $('.yt_video_close').trigger('click')
                }
                playerMode = currentPlayerMode;
                _uiCtrlr = uiController.setOwner("gaanaMaster");
                try {
                    if (typeof _uiCtrlr.getTime().time != 'undefined') {
                        if (gaanaMaster.getCurrentIndex() > 0) {
                            var lastsonginfo = gaanaMaster.getSongInfo(gaanaMaster.getCurrentIndex() - 1)
                            if (lastsonginfo.source == 14) {
                                globaltimer = 0;
                                var t = _uiCtrlr.getTime().time.split(':');
                                globaltimer = parseInt(globaltimer) + (parseInt(t[0]) * 60) + parseInt(t[1]);
                            }
                        }
                    }
                } catch (e) {
                    trace(e.message)
                }
                staticPlayer.setSound_n_UI(_sound, _uiCtrlr, playerMode);
                _uiCtrlr.show("loader");
                _this.resetComp();
                _sound.stopMe();
                if (playTimer) {
                    clearTimeout(playTimer);
                }
                if (typeof filePath == 'undefined' || filePath == null || filePath == '') {
                    messagebox.open({
                        msg: "mp3 path is missing",
                        autoclose: true
                    });
                    return false
                }
                playTimer = setTimeout(function () {
                    _sound.createSound(filePath, _settings.autoPlay);
                }, 1);
                setUIForPlayer();
                var obdata = obj.data
                Layout.renderCurrentSongInfo(obj.data, _currentIndex, playerMode);
            }

            function playChannelPreRoll() {
                Layout.renderArtistPreInfo({
                    title: "Tune In"
                });
                playTimer = setTimeout(function () {
                    playingPreRoll = true;
                    resetchannelsPreRoll();
                    _sound.createSound('{"path":"' + songInfo.artistPreRoll + '","sType":"rtmp"}', _settings.autoPlay);
                }, 500);
            }

            function playIdeaPreRoll() {
                Layout.renderArtistPreInfo({
                    title: "Honey Bunny"
                });
                try {
                    playTimer = setTimeout(function () {
                        playingPreRoll = true;
                        _playCounter = _playCounter + 1;
                        var artistPreRoll = "mp3/sales/honey_bunny_2";
                        _sound.createSound('{"path":"' + artistPreRoll + '","sType":"rtmp"}', _settings.autoPlay);
                    }, 9);
                } catch (e) {
                    alert(e.message)
                }
            }

            function playSongPreRoll() {
                Layout.renderSogPreInfo(songInfo);
                playTimer = setTimeout(function () {
                    playingPreRoll = true;
                    _sound.createSound('{"path":"' + songInfo.songPreRoll + '","sType":"rtmp"}', _settings.autoPlay);
                }, 500);
            }
            try {
                Layout.highlightRow(songInfo);
            } catch (e) {};
        }
        this.playById = function (id) {
            if (!jsPlayer.canPlay) {
                jsPlayer.showSWF_Error();
                return false;
            }
            if (_isShuffleOn == false) {
                ignoreShuffle = true;
                _uiCtrlr.removeCSS("shuffle", "on");
                _uiCtrlr.setCSS("shuffle", "off");
                _uiCtrlr.title("shuffle", "Shuffle is off");
            }
            var found = false;
            var arr = _getSongsArray();
            for (var i = 0; i < arr.length; i++) {
                var current = arr[i];
                if (current.data.id == id) {
                    _currentIndex = current.index;
                    _moveToSongIndex(_currentIndex);
                    found = true;
                    break;
                }
            }
            if (!found) {}
        }
        this.playAutomatic = function () {
            if (!jsPlayer.canPlay) {
                jsPlayer.showSWF_Error();
                return false;
            }
            if ($(".songGrid").length > 0) {
                resetStartupSettings();
                var img = $("#row0 td:first").find("img.Plybtn");
                if (img.length > 0) {
                    $(img).trigger("click");
                }
                addGA_Events("Play", "playAutomatic");
            } else {
                messagebox.open({
                    msg: "Please select a song",
                    autoclose: true
                });
            }
        }
        this.playNext = function () {
            _next();
        }
        this.playPrevious = function () {
            _previous();
        }
        this.playNextInQue = function (pos) {
            if ((_currentIndex < _getSongsArray().length - 1) && pos != _currentIndex && (pos < _getSongsArray().length)) {
                _nextIndex = pos
            };
        }
        var manageButtonsForSongCount = function (type) {
            if (_getSongsArray().length <= 1) {
                if (typeof type != 'undefined' && type == 'next') {
                    _uiCtrlr.disabled("previous,shuffle", true);
                } else {
                    _uiCtrlr.disabled("next,previous,shuffle", true);
                }
            }
        }
        this.getCurrentIndex = function () {
            return _currentIndex;
        };
        this.getSongsCount = function () {
            var arr = _getSongsArray();
            return arr.length;
        }
        this.getCurrentShuffle = function () {
            return _isShuffleOn;
        }
        this.setCurrentShuffle = function (flag) {
            _isShuffleOn = flag;
        }
        this.PlaySongsAfterVideo = function () {
            try {
                var arr = _getSongsArray();
                $('.radio_song_carousel').show();
                var songInfo = arr[_currentIndex];
                _moveToSongIndex(_currentIndex);
            } catch (e) {}
        }
        this.createSound = function (obj, autoPlay, loadAtStartUp, mode, source, ids) {
            globaltimer = 0;
            createCookie('playerloaded', 1)
            try {
                if (playingPreRoll == true) {}
                if (typeof intid != 'undefined') {
                    clearInterval(intid);
                }
                RadioMetaData.clearRadioHistory();
                if (!jsPlayer.canPlay) {
                    jsPlayer.showSWF_Error();
                    return false;
                }
                ignoreShuffle = true;
                _settings.autoPlay = (autoPlay || _settings.autoPlay);
                _settings.loadAtStartUp = loadAtStartUp || true;
                _settings.shuffle = (obj.shuffle !== undefined) ? obj.shuffle : _settings.shuffle;
                isRadio = false;
                playerMode = (mode || playerModeLabel.player);
                _radioThemeLevel = source;
                _radioThemeId = (typeof ids != 'undefined') ? ids : 0;
                if (playerModeLabel[playerMode] === undefined) {
                    playerMode = playerModeLabel.player;
                }
                currentPlayerMode = playerMode;
                _data = obj.data;
                _currentIndex = obj.index;
                _isShuffleOn = _settings.shuffle;
                if (_isShuffleOn === true) {
                    ignoreShuffle = false;
                }
                _shuffleUI();
                RadioMetaData.stopUpdating();
                _inializeGaanaMaster();
                setUIForPlayer();
                staticPlayer.updateMeta({
                    time: 0,
                    length: 0
                });
                if (gaanaMaster.getSongsCount() > 0) {
                    if (gaanaMaster.getSongsCount() > 1) {
                        $('.songcnt').html(gaanaMaster.getSongsCount() + " Songs");
                        $('.songcnt').show();
                    } else {
                        $('.songcnt').html(gaanaMaster.getSongsCount() + " Song");
                        $('.songcnt').show();
                    }
                }
            } catch (e) {
                utility.errorLog(e.message, "gaanaMaster.createSound");
            }
        };
        var checkRadioGaanaData = function (obj) {
            if (obj && obj.data) {
                Layout.getRecommedationData(eval(obj.data)[0].id, function (res) {
                    if ($.trim(res) == "null") {
                        $(".radio").css({
                            opacity: 0.5
                        });
                        $(".radio").attr("title", "Radio Gaana is not available for this song");
                        $(".radio").addClass("disabled")
                    } else {
                        $(".radio").attr("title", "Start your own radio with this song");
                        $(".radio").removeClass("disabled");
                    }
                }, "string");
            }
        }
        this.resetComp = function () {
            _uiCtrlr.reset("songSeekbar");
            staticPlayer.updateMeta({
                time: 0,
                length: 0
            }, true);
        }
        this.playByData = function (obj, type) {
            playNow(obj, type);
        }
        this.playPreRoll = function (row) {
            this.playByData(row, 'preroll');
            addGA_Events("Preroll", "automatic");
        }
        this.playPostRoll = function (row) {
            this.playByData(row, 'postroll');
            addGA_Events("Postroll", "automatic");
        }
        this.reOrderData = function (data, index) {
            _currentIndex = index;
            _makeData($.toJSON(data));
        }
        this.playWithoutClearData = function (row) {
            if (!jsPlayer.canPlay) {
                jsPlayer.showSWF_Error();
                return false;
            }
            if (!jsPlayer.canPlay) {
                jsPlayer.showSWF_Error();
                return false;
            }
            var data = new Array();
            var arr = new Array();
            var check = false;
            if (_data != null) {
                data = $.parseJSON(_data)
                for (i in data) {
                    arr.push($.toJSON(data[i]))
                    if (row.id == data[i].id) {
                        index = 0;
                        index = i;
                        check = true;
                    }
                }
                if (!check) {
                    arr.push($.toJSON(row));
                    index = arr.length - 1
                }
            } else {
                arr.push($.toJSON(row))
                index = 0;
            }
            var json_Data = '[' + arr.join(",") + ']';
            gaanaMaster.createSound({
                data: json_Data,
                index: index
            });
            data = null;
            arr = null;
            json_Data = null;
        }
        this.addToQueue = function (rows) {
            if (typeof readCookie('playerloaded') == 'undefined' || readCookie('playerloaded') != 1) {
                messagebox.open({
                    msg: message['playsong'],
                    autoclose: true
                })
                return false;
            }
            if (gaanaMaster.getPlayerMode() == 'radio') {
                return false;
            }
            var arr = new Array();
            if (_data != null) {
                var data = $.parseJSON(_data)
                for (i in data) {
                    if (typeof rows != 'undefined' && rows != null) {
                        var match = false;
                        for (r in rows) {
                            if (data[i].id == rows[r].id) {
                                match = true
                            }
                        }
                        if (!match) {
                            arr.push($.toJSON(data[i]))
                        }
                    }
                }
                if (typeof rows != 'undefined' && rows != null) {
                    for (r in rows) {
                        arr.push($.toJSON(rows[r]))
                    }
                }
            } else {
                if (typeof rows != 'undefined' && rows != null) {
                    for (r in rows) {
                        arr.push($.toJSON(rows[r]))
                    }
                }
            }
            var json_Data = '[' + arr.join(",") + ']';
            _data = json_Data
            _makeData(_data);
            _saveList();
            if (gaanaMaster.getSongsCount() > 0) {
                if (gaanaMaster.getSongsCount() > 1) {
                    $('.songcnt').html(gaanaMaster.getSongsCount() + " Songs")
                } else {
                    $('.songcnt').html(gaanaMaster.getSongsCount() + " Song")
                }
            }
            var song_title = rows[0].title;
            var show_message = messagebox.message(message['songaddetoqueue'], song_title);
            messagebox.open({
                msg: show_message,
                autoclose: true
            })
            $('.add-event').hide();
        };
        this.clearQueue = function () {
            _data = null;
            superCookie.removeItem('queue')
            _makeData(_data);
        }
        this.deleteById = function (id) {
            try {
                var found = false;
                var arr = _getSongsArray();
                var temparr = new Array();
                var currsong = gaanaMaster.getCurrentInfo();
                var currid = currsong.id;
                for (var i = 0; i < arr.length; i++) {
                    var current = arr[i];
                    if (current.data.id != id) {
                        temparr.push($.toJSON(current.data))
                        found = true;
                    } else {}
                }
                if (found) {
                    var json_Data = '[' + temparr.join(",") + ']';
                    _data = json_Data
                    _makeData(_data);
                    _saveList();
                    if (gaanaMaster.getSongsCount() > 0) {
                        if (gaanaMaster.getSongsCount() > 1) {
                            $('.songcnt').html(gaanaMaster.getSongsCount() + " Songs")
                        } else {
                            $('.songcnt').html(gaanaMaster.getSongsCount() + " Song")
                        }
                    }
                } else {
                    gaanaMaster.clearQueue();
                    $('.addedsonglist').hide();
                    $('.songadded').removeClass('whitebg');
                    $('.songcnt').html('')
                }
                var arr = _getSongsArray();
                if (id == currid && (arr.length - _currentIndex - 1) > 0) {
                    _currentIndex = _currentIndex - 1;
                } else {}
            } catch (e) {
                trace(e.message)
            }
        }
        this.playRadio = function (obj) {
            $('#video_player_link').hide();
            $('#lyrics_player_link').hide();
            if (Logs._playedtime != "00:00" && typeof Logs._playedtime != 'undefined' && Logs._playingSong != null) {
                Logs.addTrackLog();
            } else {}
            $('.hotbox').animate({
                bottom: '0px'
            }, {
                duration: 500
            });
            RadioMetaData.init(superCookie.getItem("stationid"));
            _uiCtrlr.removeCSS("play", "stop");
            _lastplayermode = "radio";
            globaltimer = 0;
            createCookie('playerloaded', 1)
            if (!jsPlayer.canPlay) {
                jsPlayer.showSWF_Error();
                return false;
            }
            RadioMetaData.streamdata = obj;
            playerMode = playerModeLabel.radio;
            Layout.resetCurrentSongInfo();
            _activeSongID = ''
            isRadio = true;
            var filePath = (typeof (obj.data) == "string") ? (obj.data) : $.toJSON((obj.data));
            try {
                _uiCtrlr.show("loader");
                _sound.stopMe();
                _sound.createSound(filePath, true);
                setUIForRadio();
                resetStartupSettings();
                addGA_Events("Play", playerMode);
            } catch (e) {}
        };
        this.getPlayerMode = function () {
            return playerMode;
        };
        this.playToggle = function () {
            _play();
        };
        this.play = function () {
            _play();
        };
        this.pause = function () {
            _play();
        };
        this.stopMe = function () {
            _sound.stopMe();
        };
        this.getUIController = function () {
            return _uiCtrlr;
        };
        this.updateMeta = function (arg) {
            _updateMeta(arg)
        };
        this.getCurrentInfo = function () {
            var arr = _getSongsArray();
            if (typeof arr == 'undefined' || arr == null || this.getCurrentIndex() == 'undefined' || this.getCurrentIndex() == null || this.getCurrentIndex() == '-1') {
                return null;
            }
            return (arr.length > 0 && arr[this.getCurrentIndex()].data) || null;
        };
        this.getSongInfo = function (index) {
            var arr = _getSongsArray();
            if (typeof arr == 'undefined' || arr == null) {
                return null;
            }
            return (arr.length > 0 && index > -1 && index < arr.length && arr[index].data) || null;
        };
        var getRandomNumber = function (maxRange) {
            return Math.floor((maxRange || 0) * Math.random());
        };
        this.radioGaana = function (force) {
            if (!jsPlayer.canPlay) {
                jsPlayer.showSWF_Error();
                return false;
            }
            if (_getSongsArray().length == 0) {
                messagebox.open({
                    msg: message['gaana_radio_notavailable'],
                    autoclose: true
                });
                return false;
            }
            if ($(".radio").hasClass("disabled") && force === undefined) {
                messagebox.open({
                    msg: message['gaana_radio_notavailable'],
                    autoclose: true
                });
                return false;
            }
            var ids, id;
            ids = superCookie.getItem(_variables.CookiesLabel.que);
            if (ids) {
                ids = eval(ids);
                id = ids[getRandomNumber(ids.length)].id;
                var title = ids[getRandomNumber(ids.length)].title;
            } else {
                ids = new Array("583554", "570325", "582161", "582528");
                id = ids[getRandomNumber(ids.length)];
            };
            if (playerMode != playerModeLabel.radioGaana || force) {
                Layout.getRecommedationData(id, function (res) {
                    if ($.trim(res) == "null") {
                        gaanaMaster.radioGaana(true);
                    } else if ($.trim(res) == "radio does not exists") {
                        messagebox.open({
                            msg: "Radio does not exists for this song",
                            autoclose: true
                        });
                    } else {
                        addGA_Events("Gaana Radio play", playerMode);
                        _this.createSound({
                            data: res,
                            index: 0
                        }, true, true, playerModeLabel.radioGaana);
                        $(".radio").css({
                            opacity: 1
                        });
                        $(".radio").attr("title", "Playing radio gaana");
                        $(".radio").removeClass("disabled")
                    }
                }, "string", title);
            };
        };
        this.surprisePlay = this.radioGaana;
        this.testPlay = function () {
            _sound.createSound('{"path":"INH101203890","sType":"https", "duration":"329", "id":"677057"}');
        };
        this.getSoundAndUI = function () {
            return {
                sound: _sound,
                ui: _uiCtrlr
            };
        };
        this.getMode = function () {
            return playerMode;
        };
        this.registrationLimitPopUp = function (_gaLabel) {
            if (_globalPlayCounter > 5 && jsuserdata.username == null) {
                if (currentPlayerMode != 'radio' && currentPlayerMode != 'karaoke') {
                    gAnalyticChannelClick("Skip Limit", _gaLabel, "");
                    createCookie('skip_limit', 1);
                    if (!$("#popup").dialog("isOpen") || $("#popup").length == 0) {
                        var skip_msg = message['skip_songs_msg'];
                        registration.openPopup('regSkipPromt', skip_msg);
                    }
                    return false;
                }
            }
            return true;
        };
        _inializeGaanaMaster();
    } catch (e) {
        alert(e.message)
    }
};
GaanaMaster.prototype.onNext = function (fn) {
    this._events["onNext"] = fn;
};
GaanaMaster.prototype.onPrevious = function (fn) {
    this._events["onPrevious"] = fn;
}
var staticPlayer = {
    sound: null,
    uiCtrl: null,
    old: {},
    isPlaying: false,
    isDragging: false,
    pmode: 'jsPlayer',
    updatePlayButton: function (force) {
        var isPlaying = force || this.sound.isPlaying();
        this.isPlaying = isPlaying;
        if (force) {
            this.isPlaying = force;
        }
        if (this.isPlaying) {
            this.uiCtrl.removeCSS("play", "play");
            this.uiCtrl.setCSS("play", "pause");
            if (this.pmode == "karaoke") {
                this.uiCtrl.title("play", "Stop");
            } else {
                this.uiCtrl.title("play", "Pause");
            }
            if (this.pmode == "radioGaana") {
                this.uiCtrl.removeCSS("play", "radioplay");
                this.uiCtrl.setCSS("play", "radiopause");
            }
        } else {
            this.uiCtrl.removeCSS("play", "pause");
            this.uiCtrl.setCSS("play", "play");
            this.uiCtrl.title("play", "Play");
            if (this.pmode == "radioGaana") {
                this.uiCtrl.removeCSS("play", "radiopause");
                this.uiCtrl.setCSS("play", "radioplay");
            }
        }
    },
    setSound_n_UI: function (s, u, pmode) {
        this.sound = s;
        this.uiCtrl = u;
        this.pmode = pmode;
        this.updatePlayButton();
    },
    playToggle: function () {
        if (this.sound && this.uiCtrl) {
            if ($(this.uiCtrl.containers.play).hasClass("stop")) {
                this.stopMe();
                this.isPlaying = false;
            } else {
                this.sound.playToggle();
                this.isPlaying = !this.isPlaying;
                if (this.isPlaying) {
                    if (gaanaMaster.getMode() == 'radio') {
                        RadioMetaData.playing = true
                        RadioMetaData.init(superCookie.getItem("stationid"));
                    }
                    Layout.playSong();
                } else {
                    if (gaanaMaster.getMode() == 'radio') {
                        RadioMetaData.playing = false
                        Logs.addTrackLog();
                        RadioMetaData.stopUpdating();
                    }
                }
                this.updatePlayButton();
            }
            if (done) {
                $('.yt_video_close').trigger('click');
            }
        }
    },
    stop: function () {
        if (this.sound && this.uiCtrl) {
            this.sound.stopMe();
            this.uiCtrl.removeCSS("play", "pause");
            this.uiCtrl.setCSS("play", "play");
            this.uiCtrl.title("play", "Play");
        }
    },
    setVolume: function (evt, ui) {
        this.sound.setVolume(ui.value);
        this.old.volume = ui.value;
        this.afterMute();
    },
    mute: function () {
        if (this.sound && this.uiCtrl) {
            if (this.sound.volume !== 0) {
                this.old.volume = this.sound.volume;
                this.sound.mute();
                this.uiCtrl.updateVolumeSeek(0);
                _gaq.push(['_trackEvent', "Player UI Interactions", "Mute Icon", "manual"]);
            } else {
                this.sound.setVolume(this.old.volume);
                this.uiCtrl.updateVolumeSeek(this.old.volume);
                _gaq.push(['_trackEvent', "Player UI Interactions", "Unmute Icon", "manual"]);
            }
        }
        this.afterMute();
    },
    afterMute: function () {
        if (this.sound.volume == 0) {
            this.uiCtrl.removeCSS("mute", "off");
            this.uiCtrl.setCSS("mute", "on");
            this.uiCtrl.title("mute", "Unmute");
        } else {
            this.uiCtrl.removeCSS("mute", "on");
            this.uiCtrl.setCSS("mute", "off");
            this.uiCtrl.title("mute", "Mute");
        }
    },
    formatTime: function (time) {
        if (time <= 0) {
            return '00:00'
        };
        time = Math.round(time);
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;
        var str = pad(minutes) + ":" + pad(seconds);
        return str;

        function pad(number) {
            return (number < 10 ? '0' : '') + number;
        };
    },
    updateMeta: function (arg, isReset) {
        try {
            var time = arg.time;
            var total = arg.length;
            if (this.uiCtrl.getSeekbarOption("songSeekbar", "max") != total) {
                this.uiCtrl.setSeekbarOption("songSeekbar", "max", total);
            };
            if (parseFloat(globaltimer) > 0) {
                var newtime = parseFloat(time) + parseFloat(globaltimer)
            } else {
                var newtime = time
            }
            if (!isReset) Logs._playedtime = this.formatTime(parseFloat(time))
            this.uiCtrl.updateMeta(this.formatTime(newtime), this.formatTime(total), isReset);
            if (!this.isDragging) {
                this.uiCtrl.updateSongSeek(time);
            } else {
                $('.addedsonglist').hide();
                $('.songadded').removeClass('whitebg');
                $('.songcnt').addClass('white')
            }
        } catch (e) {}
    },
    updateBuffer: function (arg) {
        if (this.sound.streamStarted === true) {
            this.uiCtrl.show("loader", "buffering...", true);
        } else {
            this.uiCtrl.show("loader");
        }
        if (arg.percent >= 100) {
            this.uiCtrl.hide("loader");
            this.uiCtrl.updateBuffer(100, true);
        } else {
            if (typeof arg.percent == "number") {
                this.uiCtrl.updateBuffer(arg.percent, false);
            }
        }
    },
    FB_Events: {
        play: function () {
            this.callFB_Event("play");
        },
        pause: function () {
            this.callFB_Event("pause");
        },
        resume: function () {
            this.callFB_Event("resume");
        },
        stop: function () {
            this.callFB_Event("pause");
        },
        callFB_Event: function (evt) {
            try {
                if (gaanaMaster) {
                    var info = gaanaMaster.getCurrentInfo();
                    if (info) {
                        if (fbPlayerEvent) {
                            fbPlayerEvent(evt + "||" + info.id + "||" + info.title + "||" + info.seokey);
                        } else {
                            utility.errorLog("fbPlayerEvent is not defined", 'callFB_Event');
                        }
                    }
                }
            } catch (e) {}
        }
    },
    stopMe: function (cb) {
        if (this.sound && this.uiCtrl) {
            this.sound.stopMe();
            if (cb) {
                eval(cb)();
            }
        }
    }
}

    function hide_singalong_popup() {
        $('.singalong_popup').animate({
            left: '-220px'
        }, {
            duration: 1000,
            easing: 'easeInOutBack'
        })
    };
/*!
 * jQuery UI Effects 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/effects-core/
 */ (function ($, undefined) {
    var dataSpace = "ui-effects-";
    $.effects = {
        effect: {}
    };
    /*!
     * jQuery Color Animations v2.1.2
     * https://github.com/jquery/jquery-color
     *
     * Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     *
     * Date: Wed Jan 16 08:47:09 2013 -0600
     */ (function (jQuery, undefined) {
        var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
            rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
            stringParsers = [{
                re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                parse: function (execResult) {
                    return [execResult[1], execResult[2], execResult[3], execResult[4]];
                }
            }, {
                re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                parse: function (execResult) {
                    return [execResult[1] * 2.55, execResult[2] * 2.55, execResult[3] * 2.55, execResult[4]];
                }
            }, {
                re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
                parse: function (execResult) {
                    return [parseInt(execResult[1], 16), parseInt(execResult[2], 16), parseInt(execResult[3], 16)];
                }
            }, {
                re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
                parse: function (execResult) {
                    return [parseInt(execResult[1] + execResult[1], 16), parseInt(execResult[2] + execResult[2], 16), parseInt(execResult[3] + execResult[3], 16)];
                }
            }, {
                re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                space: "hsla",
                parse: function (execResult) {
                    return [execResult[1], execResult[2] / 100, execResult[3] / 100, execResult[4]];
                }
            }],
            color = jQuery.Color = function (color, green, blue, alpha) {
                return new jQuery.Color.fn.parse(color, green, blue, alpha);
            }, spaces = {
                rgba: {
                    props: {
                        red: {
                            idx: 0,
                            type: "byte"
                        },
                        green: {
                            idx: 1,
                            type: "byte"
                        },
                        blue: {
                            idx: 2,
                            type: "byte"
                        }
                    }
                },
                hsla: {
                    props: {
                        hue: {
                            idx: 0,
                            type: "degrees"
                        },
                        saturation: {
                            idx: 1,
                            type: "percent"
                        },
                        lightness: {
                            idx: 2,
                            type: "percent"
                        }
                    }
                }
            }, propTypes = {
                "byte": {
                    floor: true,
                    max: 255
                },
                "percent": {
                    max: 1
                },
                "degrees": {
                    mod: 360,
                    floor: true
                }
            }, support = color.support = {}, supportElem = jQuery("<p>")[0],
            colors, each = jQuery.each;
        supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
        support.rgba = supportElem.style.backgroundColor.indexOf("rgba") > -1;
        each(spaces, function (spaceName, space) {
            space.cache = "_" + spaceName;
            space.props.alpha = {
                idx: 3,
                type: "percent",
                def: 1
            };
        });

        function clamp(value, prop, allowEmpty) {
            var type = propTypes[prop.type] || {};
            if (value == null) {
                return (allowEmpty || !prop.def) ? null : prop.def;
            }
            value = type.floor ? ~~value : parseFloat(value);
            if (isNaN(value)) {
                return prop.def;
            }
            if (type.mod) {
                return (value + type.mod) % type.mod;
            }
            return 0 > value ? 0 : type.max < value ? type.max : value;
        }

        function stringParse(string) {
            var inst = color(),
                rgba = inst._rgba = [];
            string = string.toLowerCase();
            each(stringParsers, function (i, parser) {
                var parsed, match = parser.re.exec(string),
                    values = match && parser.parse(match),
                    spaceName = parser.space || "rgba";
                if (values) {
                    parsed = inst[spaceName](values);
                    inst[spaces[spaceName].cache] = parsed[spaces[spaceName].cache];
                    rgba = inst._rgba = parsed._rgba;
                    return false;
                }
            });
            if (rgba.length) {
                if (rgba.join() === "0,0,0,0") {
                    jQuery.extend(rgba, colors.transparent);
                }
                return inst;
            }
            return colors[string];
        }
        color.fn = jQuery.extend(color.prototype, {
            parse: function (red, green, blue, alpha) {
                if (red === undefined) {
                    this._rgba = [null, null, null, null];
                    return this;
                }
                if (red.jquery || red.nodeType) {
                    red = jQuery(red).css(green);
                    green = undefined;
                }
                var inst = this,
                    type = jQuery.type(red),
                    rgba = this._rgba = [];
                if (green !== undefined) {
                    red = [red, green, blue, alpha];
                    type = "array";
                }
                if (type === "string") {
                    return this.parse(stringParse(red) || colors._default);
                }
                if (type === "array") {
                    each(spaces.rgba.props, function (key, prop) {
                        rgba[prop.idx] = clamp(red[prop.idx], prop);
                    });
                    return this;
                }
                if (type === "object") {
                    if (red instanceof color) {
                        each(spaces, function (spaceName, space) {
                            if (red[space.cache]) {
                                inst[space.cache] = red[space.cache].slice();
                            }
                        });
                    } else {
                        each(spaces, function (spaceName, space) {
                            var cache = space.cache;
                            each(space.props, function (key, prop) {
                                if (!inst[cache] && space.to) {
                                    if (key === "alpha" || red[key] == null) {
                                        return;
                                    }
                                    inst[cache] = space.to(inst._rgba);
                                }
                                inst[cache][prop.idx] = clamp(red[key], prop, true);
                            });
                            if (inst[cache] && jQuery.inArray(null, inst[cache].slice(0, 3)) < 0) {
                                inst[cache][3] = 1;
                                if (space.from) {
                                    inst._rgba = space.from(inst[cache]);
                                }
                            }
                        });
                    }
                    return this;
                }
            },
            is: function (compare) {
                var is = color(compare),
                    same = true,
                    inst = this;
                each(spaces, function (_, space) {
                    var localCache, isCache = is[space.cache];
                    if (isCache) {
                        localCache = inst[space.cache] || space.to && space.to(inst._rgba) || [];
                        each(space.props, function (_, prop) {
                            if (isCache[prop.idx] != null) {
                                same = (isCache[prop.idx] === localCache[prop.idx]);
                                return same;
                            }
                        });
                    }
                    return same;
                });
                return same;
            },
            _space: function () {
                var used = [],
                    inst = this;
                each(spaces, function (spaceName, space) {
                    if (inst[space.cache]) {
                        used.push(spaceName);
                    }
                });
                return used.pop();
            },
            transition: function (other, distance) {
                var end = color(other),
                    spaceName = end._space(),
                    space = spaces[spaceName],
                    startColor = this.alpha() === 0 ? color("transparent") : this,
                    start = startColor[space.cache] || space.to(startColor._rgba),
                    result = start.slice();
                end = end[space.cache];
                each(space.props, function (key, prop) {
                    var index = prop.idx,
                        startValue = start[index],
                        endValue = end[index],
                        type = propTypes[prop.type] || {};
                    if (endValue === null) {
                        return;
                    }
                    if (startValue === null) {
                        result[index] = endValue;
                    } else {
                        if (type.mod) {
                            if (endValue - startValue > type.mod / 2) {
                                startValue += type.mod;
                            } else if (startValue - endValue > type.mod / 2) {
                                startValue -= type.mod;
                            }
                        }
                        result[index] = clamp((endValue - startValue) * distance + startValue, prop);
                    }
                });
                return this[spaceName](result);
            },
            blend: function (opaque) {
                if (this._rgba[3] === 1) {
                    return this;
                }
                var rgb = this._rgba.slice(),
                    a = rgb.pop(),
                    blend = color(opaque)._rgba;
                return color(jQuery.map(rgb, function (v, i) {
                    return (1 - a) * blend[i] + a * v;
                }));
            },
            toRgbaString: function () {
                var prefix = "rgba(",
                    rgba = jQuery.map(this._rgba, function (v, i) {
                        return v == null ? (i > 2 ? 1 : 0) : v;
                    });
                if (rgba[3] === 1) {
                    rgba.pop();
                    prefix = "rgb(";
                }
                return prefix + rgba.join() + ")";
            },
            toHslaString: function () {
                var prefix = "hsla(",
                    hsla = jQuery.map(this.hsla(), function (v, i) {
                        if (v == null) {
                            v = i > 2 ? 1 : 0;
                        }
                        if (i && i < 3) {
                            v = Math.round(v * 100) + "%";
                        }
                        return v;
                    });
                if (hsla[3] === 1) {
                    hsla.pop();
                    prefix = "hsl(";
                }
                return prefix + hsla.join() + ")";
            },
            toHexString: function (includeAlpha) {
                var rgba = this._rgba.slice(),
                    alpha = rgba.pop();
                if (includeAlpha) {
                    rgba.push(~~ (alpha * 255));
                }
                return "#" + jQuery.map(rgba, function (v) {
                    v = (v || 0).toString(16);
                    return v.length === 1 ? "0" + v : v;
                }).join("");
            },
            toString: function () {
                return this._rgba[3] === 0 ? "transparent" : this.toRgbaString();
            }
        });
        color.fn.parse.prototype = color.fn;

        function hue2rgb(p, q, h) {
            h = (h + 1) % 1;
            if (h * 6 < 1) {
                return p + (q - p) * h * 6;
            }
            if (h * 2 < 1) {
                return q;
            }
            if (h * 3 < 2) {
                return p + (q - p) * ((2 / 3) - h) * 6;
            }
            return p;
        }
        spaces.hsla.to = function (rgba) {
            if (rgba[0] == null || rgba[1] == null || rgba[2] == null) {
                return [null, null, null, rgba[3]];
            }
            var r = rgba[0] / 255,
                g = rgba[1] / 255,
                b = rgba[2] / 255,
                a = rgba[3],
                max = Math.max(r, g, b),
                min = Math.min(r, g, b),
                diff = max - min,
                add = max + min,
                l = add * 0.5,
                h, s;
            if (min === max) {
                h = 0;
            } else if (r === max) {
                h = (60 * (g - b) / diff) + 360;
            } else if (g === max) {
                h = (60 * (b - r) / diff) + 120;
            } else {
                h = (60 * (r - g) / diff) + 240;
            }
            if (diff === 0) {
                s = 0;
            } else if (l <= 0.5) {
                s = diff / add;
            } else {
                s = diff / (2 - add);
            }
            return [Math.round(h) % 360, s, l, a == null ? 1 : a];
        };
        spaces.hsla.from = function (hsla) {
            if (hsla[0] == null || hsla[1] == null || hsla[2] == null) {
                return [null, null, null, hsla[3]];
            }
            var h = hsla[0] / 360,
                s = hsla[1],
                l = hsla[2],
                a = hsla[3],
                q = l <= 0.5 ? l * (1 + s) : l + s - l * s,
                p = 2 * l - q;
            return [Math.round(hue2rgb(p, q, h + (1 / 3)) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - (1 / 3)) * 255), a];
        };
        each(spaces, function (spaceName, space) {
            var props = space.props,
                cache = space.cache,
                to = space.to,
                from = space.from;
            color.fn[spaceName] = function (value) {
                if (to && !this[cache]) {
                    this[cache] = to(this._rgba);
                }
                if (value === undefined) {
                    return this[cache].slice();
                }
                var ret, type = jQuery.type(value),
                    arr = (type === "array" || type === "object") ? value : arguments,
                    local = this[cache].slice();
                each(props, function (key, prop) {
                    var val = arr[type === "object" ? key : prop.idx];
                    if (val == null) {
                        val = local[prop.idx];
                    }
                    local[prop.idx] = clamp(val, prop);
                });
                if (from) {
                    ret = color(from(local));
                    ret[cache] = local;
                    return ret;
                } else {
                    return color(local);
                }
            };
            each(props, function (key, prop) {
                if (color.fn[key]) {
                    return;
                }
                color.fn[key] = function (value) {
                    var vtype = jQuery.type(value),
                        fn = (key === "alpha" ? (this._hsla ? "hsla" : "rgba") : spaceName),
                        local = this[fn](),
                        cur = local[prop.idx],
                        match;
                    if (vtype === "undefined") {
                        return cur;
                    }
                    if (vtype === "function") {
                        value = value.call(this, cur);
                        vtype = jQuery.type(value);
                    }
                    if (value == null && prop.empty) {
                        return this;
                    }
                    if (vtype === "string") {
                        match = rplusequals.exec(value);
                        if (match) {
                            value = cur + parseFloat(match[2]) * (match[1] === "+" ? 1 : -1);
                        }
                    }
                    local[prop.idx] = value;
                    return this[fn](local);
                };
            });
        });
        color.hook = function (hook) {
            var hooks = hook.split(" ");
            each(hooks, function (i, hook) {
                jQuery.cssHooks[hook] = {
                    set: function (elem, value) {
                        var parsed, curElem, backgroundColor = "";
                        if (value !== "transparent" && (jQuery.type(value) !== "string" || (parsed = stringParse(value)))) {
                            value = color(parsed || value);
                            if (!support.rgba && value._rgba[3] !== 1) {
                                curElem = hook === "backgroundColor" ? elem.parentNode : elem;
                                while ((backgroundColor === "" || backgroundColor === "transparent") && curElem && curElem.style) {
                                    try {
                                        backgroundColor = jQuery.css(curElem, "backgroundColor");
                                        curElem = curElem.parentNode;
                                    } catch (e) {}
                                }
                                value = value.blend(backgroundColor && backgroundColor !== "transparent" ? backgroundColor : "_default");
                            }
                            value = value.toRgbaString();
                        }
                        try {
                            elem.style[hook] = value;
                        } catch (e) {}
                    }
                };
                jQuery.fx.step[hook] = function (fx) {
                    if (!fx.colorInit) {
                        fx.start = color(fx.elem, hook);
                        fx.end = color(fx.end);
                        fx.colorInit = true;
                    }
                    jQuery.cssHooks[hook].set(fx.elem, fx.start.transition(fx.end, fx.pos));
                };
            });
        };
        color.hook(stepHooks);
        jQuery.cssHooks.borderColor = {
            expand: function (value) {
                var expanded = {};
                each(["Top", "Right", "Bottom", "Left"], function (i, part) {
                    expanded["border" + part + "Color"] = value;
                });
                return expanded;
            }
        };
        colors = jQuery.Color.names = {
            aqua: "#00ffff",
            black: "#000000",
            blue: "#0000ff",
            fuchsia: "#ff00ff",
            gray: "#808080",
            green: "#008000",
            lime: "#00ff00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            purple: "#800080",
            red: "#ff0000",
            silver: "#c0c0c0",
            teal: "#008080",
            white: "#ffffff",
            yellow: "#ffff00",
            transparent: [null, null, null, 0],
            _default: "#ffffff"
        };
    })(jQuery);
    (function () {
        var classAnimationActions = ["add", "remove", "toggle"],
            shorthandStyles = {
                border: 1,
                borderBottom: 1,
                borderColor: 1,
                borderLeft: 1,
                borderRight: 1,
                borderTop: 1,
                borderWidth: 1,
                margin: 1,
                padding: 1
            };
        $.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function (_, prop) {
            $.fx.step[prop] = function (fx) {
                if (fx.end !== "none" && !fx.setAttr || fx.pos === 1 && !fx.setAttr) {
                    jQuery.style(fx.elem, prop, fx.end);
                    fx.setAttr = true;
                }
            };
        });

        function getElementStyles(elem) {
            var key, len, style = elem.ownerDocument.defaultView ? elem.ownerDocument.defaultView.getComputedStyle(elem, null) : elem.currentStyle,
                styles = {};
            if (style && style.length && style[0] && style[style[0]]) {
                len = style.length;
                while (len--) {
                    key = style[len];
                    if (typeof style[key] === "string") {
                        styles[$.camelCase(key)] = style[key];
                    }
                }
            } else {
                for (key in style) {
                    if (typeof style[key] === "string") {
                        styles[key] = style[key];
                    }
                }
            }
            return styles;
        }

        function styleDifference(oldStyle, newStyle) {
            var diff = {}, name, value;
            for (name in newStyle) {
                value = newStyle[name];
                if (oldStyle[name] !== value) {
                    if (!shorthandStyles[name]) {
                        if ($.fx.step[name] || !isNaN(parseFloat(value))) {
                            diff[name] = value;
                        }
                    }
                }
            }
            return diff;
        }
        if (!$.fn.addBack) {
            $.fn.addBack = function (selector) {
                return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
            };
        }
        $.effects.animateClass = function (value, duration, easing, callback) {
            var o = $.speed(duration, easing, callback);
            return this.queue(function () {
                var animated = $(this),
                    baseClass = animated.attr("class") || "",
                    applyClassChange, allAnimations = o.children ? animated.find("*").addBack() : animated;
                allAnimations = allAnimations.map(function () {
                    var el = $(this);
                    return {
                        el: el,
                        start: getElementStyles(this)
                    };
                });
                applyClassChange = function () {
                    $.each(classAnimationActions, function (i, action) {
                        if (value[action]) {
                            animated[action + "Class"](value[action]);
                        }
                    });
                };
                applyClassChange();
                allAnimations = allAnimations.map(function () {
                    this.end = getElementStyles(this.el[0]);
                    this.diff = styleDifference(this.start, this.end);
                    return this;
                });
                animated.attr("class", baseClass);
                allAnimations = allAnimations.map(function () {
                    var styleInfo = this,
                        dfd = $.Deferred(),
                        opts = $.extend({}, o, {
                            queue: false,
                            complete: function () {
                                dfd.resolve(styleInfo);
                            }
                        });
                    this.el.animate(this.diff, opts);
                    return dfd.promise();
                });
                $.when.apply($, allAnimations.get()).done(function () {
                    applyClassChange();
                    $.each(arguments, function () {
                        var el = this.el;
                        $.each(this.diff, function (key) {
                            el.css(key, "");
                        });
                    });
                    o.complete.call(animated[0]);
                });
            });
        };
        $.fn.extend({
            addClass: (function (orig) {
                return function (classNames, speed, easing, callback) {
                    return speed ? $.effects.animateClass.call(this, {
                        add: classNames
                    }, speed, easing, callback) : orig.apply(this, arguments);
                };
            })($.fn.addClass),
            removeClass: (function (orig) {
                return function (classNames, speed, easing, callback) {
                    return arguments.length > 1 ? $.effects.animateClass.call(this, {
                        remove: classNames
                    }, speed, easing, callback) : orig.apply(this, arguments);
                };
            })($.fn.removeClass),
            toggleClass: (function (orig) {
                return function (classNames, force, speed, easing, callback) {
                    if (typeof force === "boolean" || force === undefined) {
                        if (!speed) {
                            return orig.apply(this, arguments);
                        } else {
                            return $.effects.animateClass.call(this, (force ? {
                                add: classNames
                            } : {
                                remove: classNames
                            }), speed, easing, callback);
                        }
                    } else {
                        return $.effects.animateClass.call(this, {
                            toggle: classNames
                        }, force, speed, easing);
                    }
                };
            })($.fn.toggleClass),
            switchClass: function (remove, add, speed, easing, callback) {
                return $.effects.animateClass.call(this, {
                    add: add,
                    remove: remove
                }, speed, easing, callback);
            }
        });
    })();
    (function () {
        $.extend($.effects, {
            version: "1.10.3",
            save: function (element, set) {
                for (var i = 0; i < set.length; i++) {
                    if (set[i] !== null) {
                        element.data(dataSpace + set[i], element[0].style[set[i]]);
                    }
                }
            },
            restore: function (element, set) {
                var val, i;
                for (i = 0; i < set.length; i++) {
                    if (set[i] !== null) {
                        val = element.data(dataSpace + set[i]);
                        if (val === undefined) {
                            val = "";
                        }
                        element.css(set[i], val);
                    }
                }
            },
            setMode: function (el, mode) {
                if (mode === "toggle") {
                    mode = el.is(":hidden") ? "show" : "hide";
                }
                return mode;
            },
            getBaseline: function (origin, original) {
                var y, x;
                switch (origin[0]) {
                    case "top":
                        y = 0;
                        break;
                    case "middle":
                        y = 0.5;
                        break;
                    case "bottom":
                        y = 1;
                        break;
                    default:
                        y = origin[0] / original.height;
                }
                switch (origin[1]) {
                    case "left":
                        x = 0;
                        break;
                    case "center":
                        x = 0.5;
                        break;
                    case "right":
                        x = 1;
                        break;
                    default:
                        x = origin[1] / original.width;
                }
                return {
                    x: x,
                    y: y
                };
            },
            createWrapper: function (element) {
                if (element.parent().is(".ui-effects-wrapper")) {
                    return element.parent();
                }
                var props = {
                    width: element.outerWidth(true),
                    height: element.outerHeight(true),
                    "float": element.css("float")
                }, wrapper = $("<div></div>").addClass("ui-effects-wrapper").css({
                    fontSize: "100%",
                    background: "transparent",
                    border: "none",
                    margin: 0,
                    padding: 0
                }),
                    size = {
                        width: element.width(),
                        height: element.height()
                    }, active = document.activeElement;
                try {
                    active.id;
                } catch (e) {
                    active = document.body;
                }
                element.wrap(wrapper);
                if (element[0] === active || $.contains(element[0], active)) {
                    $(active).focus();
                }
                wrapper = element.parent();
                if (element.css("position") === "static") {
                    wrapper.css({
                        position: "relative"
                    });
                    element.css({
                        position: "relative"
                    });
                } else {
                    $.extend(props, {
                        position: element.css("position"),
                        zIndex: element.css("z-index")
                    });
                    $.each(["top", "left", "bottom", "right"], function (i, pos) {
                        props[pos] = element.css(pos);
                        if (isNaN(parseInt(props[pos], 10))) {
                            props[pos] = "auto";
                        }
                    });
                    element.css({
                        position: "relative",
                        top: 0,
                        left: 0,
                        right: "auto",
                        bottom: "auto"
                    });
                }
                element.css(size);
                return wrapper.css(props).show();
            },
            removeWrapper: function (element) {
                var active = document.activeElement;
                if (element.parent().is(".ui-effects-wrapper")) {
                    element.parent().replaceWith(element);
                    if (element[0] === active || $.contains(element[0], active)) {
                        $(active).focus();
                    }
                }
                return element;
            },
            setTransition: function (element, list, factor, value) {
                value = value || {};
                $.each(list, function (i, x) {
                    var unit = element.cssUnit(x);
                    if (unit[0] > 0) {
                        value[x] = unit[0] * factor + unit[1];
                    }
                });
                return value;
            }
        });

        function _normalizeArguments(effect, options, speed, callback) {
            if ($.isPlainObject(effect)) {
                options = effect;
                effect = effect.effect;
            }
            effect = {
                effect: effect
            };
            if (options == null) {
                options = {};
            }
            if ($.isFunction(options)) {
                callback = options;
                speed = null;
                options = {};
            }
            if (typeof options === "number" || $.fx.speeds[options]) {
                callback = speed;
                speed = options;
                options = {};
            }
            if ($.isFunction(speed)) {
                callback = speed;
                speed = null;
            }
            if (options) {
                $.extend(effect, options);
            }
            speed = speed || options.duration;
            effect.duration = $.fx.off ? 0 : typeof speed === "number" ? speed : speed in $.fx.speeds ? $.fx.speeds[speed] : $.fx.speeds._default;
            effect.complete = callback || options.complete;
            return effect;
        }

        function standardAnimationOption(option) {
            if (!option || typeof option === "number" || $.fx.speeds[option]) {
                return true;
            }
            if (typeof option === "string" && !$.effects.effect[option]) {
                return true;
            }
            if ($.isFunction(option)) {
                return true;
            }
            if (typeof option === "object" && !option.effect) {
                return true;
            }
            return false;
        }
        $.fn.extend({
            effect: function () {
                var args = _normalizeArguments.apply(this, arguments),
                    mode = args.mode,
                    queue = args.queue,
                    effectMethod = $.effects.effect[args.effect];
                if ($.fx.off || !effectMethod) {
                    if (mode) {
                        return this[mode](args.duration, args.complete);
                    } else {
                        return this.each(function () {
                            if (args.complete) {
                                args.complete.call(this);
                            }
                        });
                    }
                }

                function run(next) {
                    var elem = $(this),
                        complete = args.complete,
                        mode = args.mode;

                    function done() {
                        if ($.isFunction(complete)) {
                            complete.call(elem[0]);
                        }
                        if ($.isFunction(next)) {
                            next();
                        }
                    }
                    if (elem.is(":hidden") ? mode === "hide" : mode === "show") {
                        elem[mode]();
                        done();
                    } else {
                        effectMethod.call(elem[0], args, done);
                    }
                }
                return queue === false ? this.each(run) : this.queue(queue || "fx", run);
            },
            show: (function (orig) {
                return function (option) {
                    if (standardAnimationOption(option)) {
                        return orig.apply(this, arguments);
                    } else {
                        var args = _normalizeArguments.apply(this, arguments);
                        args.mode = "show";
                        return this.effect.call(this, args);
                    }
                };
            })($.fn.show),
            hide: (function (orig) {
                return function (option) {
                    if (standardAnimationOption(option)) {
                        return orig.apply(this, arguments);
                    } else {
                        var args = _normalizeArguments.apply(this, arguments);
                        args.mode = "hide";
                        return this.effect.call(this, args);
                    }
                };
            })($.fn.hide),
            toggle: (function (orig) {
                return function (option) {
                    if (standardAnimationOption(option) || typeof option === "boolean") {
                        return orig.apply(this, arguments);
                    } else {
                        var args = _normalizeArguments.apply(this, arguments);
                        args.mode = "toggle";
                        return this.effect.call(this, args);
                    }
                };
            })($.fn.toggle),
            cssUnit: function (key) {
                var style = this.css(key),
                    val = [];
                $.each(["em", "px", "%", "pt"], function (i, unit) {
                    if (style.indexOf(unit) > 0) {
                        val = [parseFloat(style), unit];
                    }
                });
                return val;
            }
        });
    })();
    (function () {
        var baseEasings = {};
        $.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (i, name) {
            baseEasings[name] = function (p) {
                return Math.pow(p, i + 2);
            };
        });
        $.extend(baseEasings, {
            Sine: function (p) {
                return 1 - Math.cos(p * Math.PI / 2);
            },
            Circ: function (p) {
                return 1 - Math.sqrt(1 - p * p);
            },
            Elastic: function (p) {
                return p === 0 || p === 1 ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
            },
            Back: function (p) {
                return p * p * (3 * p - 2);
            },
            Bounce: function (p) {
                var pow2, bounce = 4;
                while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}
                return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
            }
        });
        $.each(baseEasings, function (name, easeIn) {
            $.easing["easeIn" + name] = easeIn;
            $.easing["easeOut" + name] = function (p) {
                return 1 - easeIn(1 - p);
            };
            $.easing["easeInOut" + name] = function (p) {
                return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn(p * -2 + 2) / 2;
            };
        });
    })();
})(jQuery);;
/*!
 * jQuery UI Effects Blind 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/blind-effect/
 *
 * Depends:
 * jquery.ui.effect.js
 */ (function ($, undefined) {
    var rvertical = /up|down|vertical/,
        rpositivemotion = /up|left|vertical|horizontal/;
    $.effects.effect.blind = function (o, done) {
        var el = $(this),
            props = ["position", "top", "bottom", "left", "right", "height", "width"],
            mode = $.effects.setMode(el, o.mode || "hide"),
            direction = o.direction || "up",
            vertical = rvertical.test(direction),
            ref = vertical ? "height" : "width",
            ref2 = vertical ? "top" : "left",
            motion = rpositivemotion.test(direction),
            animation = {}, show = mode === "show",
            wrapper, distance, margin;
        if (el.parent().is(".ui-effects-wrapper")) {
            $.effects.save(el.parent(), props);
        } else {
            $.effects.save(el, props);
        }
        el.show();
        wrapper = $.effects.createWrapper(el).css({
            overflow: "hidden"
        });
        distance = wrapper[ref]();
        margin = parseFloat(wrapper.css(ref2)) || 0;
        animation[ref] = show ? distance : 0;
        if (!motion) {
            el.css(vertical ? "bottom" : "right", 0).css(vertical ? "top" : "left", "auto").css({
                position: "absolute"
            });
            animation[ref2] = show ? margin : distance + margin;
        }
        if (show) {
            wrapper.css(ref, 0);
            if (!motion) {
                wrapper.css(ref2, margin + distance);
            }
        }
        wrapper.animate(animation, {
            duration: 200,
            easing: o.easing,
            queue: false,
            complete: function () {
                if (mode === "hide") {
                    el.hide();
                }
                $.effects.restore(el, props);
                $.effects.removeWrapper(el);
                done();
            }
        });
    };
})(jQuery);;
/*!
 * jQuery UI Menu 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/menu/
 *
 * Depends:
 * jquery.ui.core.js
 * jquery.ui.widget.js
 * jquery.ui.position.js
 */ (function ($, undefined) {
    $.widget("ui.menu", {
        version: "1.10.3",
        defaultElement: "<ul>",
        delay: 300,
        options: {
            icons: {
                submenu: "ui-icon-carat-1-e"
            },
            menus: "ul",
            position: {
                my: "left top",
                at: "right top"
            },
            role: "menu",
            blur: null,
            focus: null,
            select: null
        },
        _create: function () {
            this.activeMenu = this.element;
            this.mouseHandled = false;
            this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons", !! this.element.find(".ui-icon").length).attr({
                role: this.options.role,
                tabIndex: 0
            }).bind("click" + this.eventNamespace, $.proxy(function (event) {
                if (this.options.disabled) {
                    event.preventDefault();
                }
            }, this));
            if (this.options.disabled) {
                this.element.addClass("ui-state-disabled").attr("aria-disabled", "true");
            }
            this._on({
                "mousedown .ui-menu-item > a": function (event) {
                    event.preventDefault();
                },
                "click .ui-state-disabled > a": function (event) {
                    event.preventDefault();
                },
                "click .ui-menu-item:has(a)": function (event) {
                    var target = $(event.target).closest(".ui-menu-item");
                    if (!this.mouseHandled && target.not(".ui-state-disabled").length) {
                        this.mouseHandled = true;
                        this.select(event);
                        if (target.has(".ui-menu").length) {
                            this.expand(event);
                        } else if (!this.element.is(":focus")) {
                            this.element.trigger("focus", [true]);
                            if (this.active && this.active.parents(".ui-menu").length === 1) {
                                clearTimeout(this.timer);
                            }
                        }
                    }
                },
                "mouseenter .ui-menu-item": function (event) {
                    var target = $(event.currentTarget);
                    target.siblings().children(".ui-state-active").removeClass("ui-state-active");
                    this.focus(event, target);
                },
                mouseleave: "collapseAll",
                "mouseleave .ui-menu": "collapseAll",
                focus: function (event, keepActiveItem) {
                    var item = this.active || this.element.children(".ui-menu-item").eq(0);
                    if (!keepActiveItem) {
                        this.focus(event, item);
                    }
                },
                blur: function (event) {
                    this._delay(function () {
                        if (!$.contains(this.element[0], this.document[0].activeElement)) {
                            this.collapseAll(event);
                        }
                    });
                },
                keydown: "_keydown"
            });
            this.refresh();
            this._on(this.document, {
                click: function (event) {
                    if (!$(event.target).closest(".ui-menu").length) {
                        this.collapseAll(event);
                    }
                    this.mouseHandled = false;
                }
            });
        },
        _destroy: function () {
            this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show();
            this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function () {
                var elem = $(this);
                if (elem.data("ui-menu-submenu-carat")) {
                    elem.remove();
                }
            });
            this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content");
        },
        _keydown: function (event) {
            var match, prev, character, skip, regex, preventDefault = true;

            function escape(value) {
                return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            }
            switch (event.keyCode) {
                case $.ui.keyCode.PAGE_UP:
                    this.previousPage(event);
                    break;
                case $.ui.keyCode.PAGE_DOWN:
                    this.nextPage(event);
                    break;
                case $.ui.keyCode.HOME:
                    this._move("first", "first", event);
                    break;
                case $.ui.keyCode.END:
                    this._move("last", "last", event);
                    break;
                case $.ui.keyCode.UP:
                    this.previous(event);
                    break;
                case $.ui.keyCode.DOWN:
                    this.next(event);
                    break;
                case $.ui.keyCode.LEFT:
                    this.collapse(event);
                    break;
                case $.ui.keyCode.RIGHT:
                    if (this.active && !this.active.is(".ui-state-disabled")) {
                        this.expand(event);
                    }
                    break;
                case $.ui.keyCode.ENTER:
                case $.ui.keyCode.SPACE:
                    this._activate(event);
                    break;
                case $.ui.keyCode.ESCAPE:
                    this.collapse(event);
                    break;
                default:
                    preventDefault = false;
                    prev = this.previousFilter || "";
                    character = String.fromCharCode(event.keyCode);
                    skip = false;
                    clearTimeout(this.filterTimer);
                    if (character === prev) {
                        skip = true;
                    } else {
                        character = prev + character;
                    }
                    regex = new RegExp("^" + escape(character), "i");
                    match = this.activeMenu.children(".ui-menu-item").filter(function () {
                        return regex.test($(this).children("a").text());
                    });
                    match = skip && match.index(this.active.next()) !== -1 ? this.active.nextAll(".ui-menu-item") : match;
                    if (!match.length) {
                        character = String.fromCharCode(event.keyCode);
                        regex = new RegExp("^" + escape(character), "i");
                        match = this.activeMenu.children(".ui-menu-item").filter(function () {
                            return regex.test($(this).children("a").text());
                        });
                    }
                    if (match.length) {
                        this.focus(event, match);
                        if (match.length > 1) {
                            this.previousFilter = character;
                            this.filterTimer = this._delay(function () {
                                delete this.previousFilter;
                            }, 1000);
                        } else {
                            delete this.previousFilter;
                        }
                    } else {
                        delete this.previousFilter;
                    }
            }
            if (preventDefault) {
                event.preventDefault();
            }
        },
        _activate: function (event) {
            if (!this.active.is(".ui-state-disabled")) {
                if (this.active.children("a[aria-haspopup='true']").length) {
                    this.expand(event);
                } else {
                    this.select(event);
                }
            }
        },
        refresh: function () {
            var menus, icon = this.options.icons.submenu,
                submenus = this.element.find(this.options.menus);
            submenus.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({
                role: this.options.role,
                "aria-hidden": "true",
                "aria-expanded": "false"
            }).each(function () {
                var menu = $(this),
                    item = menu.prev("a"),
                    submenuCarat = $("<span>").addClass("ui-menu-icon ui-icon " + icon).data("ui-menu-submenu-carat", true);
                item.attr("aria-haspopup", "true").prepend(submenuCarat);
                menu.attr("aria-labelledby", item.attr("id"));
            });
            menus = submenus.add(this.element);
            menus.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "presentation").children("a").uniqueId().addClass("ui-corner-all").attr({
                tabIndex: -1,
                role: this._itemRole()
            });
            menus.children(":not(.ui-menu-item)").each(function () {
                var item = $(this);
                if (!/[^\-\u2014\u2013\s]/.test(item.text())) {
                    item.addClass("ui-widget-content ui-menu-divider");
                }
            });
            menus.children(".ui-state-disabled").attr("aria-disabled", "true");
            if (this.active && !$.contains(this.element[0], this.active[0])) {
                this.blur();
            }
        },
        _itemRole: function () {
            return {
                menu: "menuitem",
                listbox: "option"
            }[this.options.role];
        },
        _setOption: function (key, value) {
            if (key === "icons") {
                this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(value.submenu);
            }
            this._super(key, value);
        },
        focus: function (event, item) {
            var nested, focused;
            this.blur(event, event && event.type === "focus");
            this._scrollIntoView(item);
            this.active = item.first();
            focused = this.active.children("a").addClass("ui-state-focus");
            if (this.options.role) {
                this.element.attr("aria-activedescendant", focused.attr("id"));
            }
            this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active");
            if (event && event.type === "keydown") {
                this._close();
            } else {
                this.timer = this._delay(function () {
                    this._close();
                }, this.delay);
            }
            nested = item.children(".ui-menu");
            if (nested.length && (/^mouse/.test(event.type))) {
                this._startOpening(nested);
            }
            this.activeMenu = item.parent();
            this._trigger("focus", event, {
                item: item
            });
        },
        _scrollIntoView: function (item) {
            var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
            if (this._hasScroll()) {
                borderTop = parseFloat($.css(this.activeMenu[0], "borderTopWidth")) || 0;
                paddingTop = parseFloat($.css(this.activeMenu[0], "paddingTop")) || 0;
                offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
                scroll = this.activeMenu.scrollTop();
                elementHeight = this.activeMenu.height();
                itemHeight = item.height();
                if (offset < 0) {
                    this.activeMenu.scrollTop(scroll + offset);
                } else if (offset + itemHeight > elementHeight) {
                    this.activeMenu.scrollTop(scroll + offset - elementHeight + itemHeight);
                }
            }
        },
        blur: function (event, fromFocus) {
            if (!fromFocus) {
                clearTimeout(this.timer);
            }
            if (!this.active) {
                return;
            }
            this.active.children("a").removeClass("ui-state-focus");
            this.active = null;
            this._trigger("blur", event, {
                item: this.active
            });
        },
        _startOpening: function (submenu) {
            clearTimeout(this.timer);
            if (submenu.attr("aria-hidden") !== "true") {
                return;
            }
            this.timer = this._delay(function () {
                this._close();
                this._open(submenu);
            }, this.delay);
        },
        _open: function (submenu) {
            var position = $.extend({
                of: this.active
            }, this.options.position);
            clearTimeout(this.timer);
            this.element.find(".ui-menu").not(submenu.parents(".ui-menu")).hide().attr("aria-hidden", "true");
            submenu.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(position);
        },
        collapseAll: function (event, all) {
            clearTimeout(this.timer);
            this.timer = this._delay(function () {
                var currentMenu = all ? this.element : $(event && event.target).closest(this.element.find(".ui-menu"));
                if (!currentMenu.length) {
                    currentMenu = this.element;
                }
                this._close(currentMenu);
                this.blur(event);
                this.activeMenu = currentMenu;
            }, this.delay);
        },
        _close: function (startMenu) {
            if (!startMenu) {
                startMenu = this.active ? this.active.parent() : this.element;
            }
            startMenu.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find("a.ui-state-active").removeClass("ui-state-active");
        },
        collapse: function (event) {
            var newItem = this.active && this.active.parent().closest(".ui-menu-item", this.element);
            if (newItem && newItem.length) {
                this._close();
                this.focus(event, newItem);
            }
        },
        expand: function (event) {
            var newItem = this.active && this.active.children(".ui-menu ").children(".ui-menu-item").first();
            if (newItem && newItem.length) {
                this._open(newItem.parent());
                this._delay(function () {
                    this.focus(event, newItem);
                });
            }
        },
        next: function (event) {
            this._move("next", "first", event);
        },
        previous: function (event) {
            this._move("prev", "last", event);
        },
        isFirstItem: function () {
            return this.active && !this.active.prevAll(".ui-menu-item").length;
        },
        isLastItem: function () {
            return this.active && !this.active.nextAll(".ui-menu-item").length;
        },
        _move: function (direction, filter, event) {
            var next;
            if (this.active) {
                if (direction === "first" || direction === "last") {
                    next = this.active[direction === "first" ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1);
                } else {
                    next = this.active[direction + "All"](".ui-menu-item").eq(0);
                }
            }
            if (!next || !next.length || !this.active) {
                next = this.activeMenu.children(".ui-menu-item")[filter]();
            }
            this.focus(event, next);
        },
        nextPage: function (event) {
            var item, base, height;
            if (!this.active) {
                this.next(event);
                return;
            }
            if (this.isLastItem()) {
                return;
            }
            if (this._hasScroll()) {
                base = this.active.offset().top;
                height = this.element.height();
                this.active.nextAll(".ui-menu-item").each(function () {
                    item = $(this);
                    return item.offset().top - base - height < 0;
                });
                this.focus(event, item);
            } else {
                this.focus(event, this.activeMenu.children(".ui-menu-item")[!this.active ? "first" : "last"]());
            }
        },
        previousPage: function (event) {
            var item, base, height;
            if (!this.active) {
                this.next(event);
                return;
            }
            if (this.isFirstItem()) {
                return;
            }
            if (this._hasScroll()) {
                base = this.active.offset().top;
                height = this.element.height();
                this.active.prevAll(".ui-menu-item").each(function () {
                    item = $(this);
                    return item.offset().top - base + height > 0;
                });
                this.focus(event, item);
            } else {
                this.focus(event, this.activeMenu.children(".ui-menu-item").first());
            }
        },
        _hasScroll: function () {
            return this.element.outerHeight() < this.element.prop("scrollHeight");
        },
        select: function (event) {
            this.active = this.active || $(event.target).closest(".ui-menu-item");
            var ui = {
                item: this.active
            };
            if (!this.active.has(".ui-menu").length) {
                this.collapseAll(event, true);
            }
            this._trigger("select", event, ui);
        }
    });
}(jQuery));;
/*!
 * jQuery UI Autocomplete 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/autocomplete/
 *
 * Depends:
 * jquery.ui.core.js
 * jquery.ui.widget.js
 * jquery.ui.position.js
 * jquery.ui.menu.js
 */ (function ($, undefined) {
    var requestIndex = 0;
    var cnt = 1;
    $.widget("ui.autocomplete", {
        version: "1.10.3",
        defaultElement: "<input>",
        options: {
            appendTo: null,
            autoFocus: false,
            delay: 500,
            minLength: 1,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "none"
            },
            source: null,
            change: null,
            close: null,
            focus: null,
            open: null,
            response: null,
            search: null,
            select: null,
            seeallresult: null
        },
        pending: 0,
        _create: function () {
            var suppressKeyPress, suppressKeyPressRepeat, suppressInput, nodeName = this.element[0].nodeName.toLowerCase(),
                isTextarea = nodeName === "textarea",
                isInput = nodeName === "input";
            this.isMultiLine = isTextarea ? true : isInput ? false : this.element.prop("isContentEditable");
            this.valueMethod = this.element[isTextarea || isInput ? "val" : "text"];
            this.isNewMenu = true;
            this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off");
            this._on(this.element, {
                keydown: function (event) {
                    if (this.element.prop("readOnly")) {
                        suppressKeyPress = true;
                        suppressInput = true;
                        suppressKeyPressRepeat = true;
                        return;
                    }
                    suppressKeyPress = false;
                    suppressInput = false;
                    suppressKeyPressRepeat = false;
                    var keyCode = $.ui.keyCode;
                    switch (event.keyCode) {
                        case keyCode.PAGE_UP:
                            suppressKeyPress = true;
                            this._move("previousPage", event);
                            break;
                        case keyCode.PAGE_DOWN:
                            suppressKeyPress = true;
                            this._move("nextPage", event);
                            break;
                        case keyCode.UP:
                            suppressKeyPress = true;
                            this._keyEvent("previous", event);
                            break;
                        case keyCode.DOWN:
                            suppressKeyPress = true;
                            this._keyEvent("next", event);
                            break;
                        case keyCode.ENTER:
                        case keyCode.NUMPAD_ENTER:
                            if (this.menu.active) {
                                suppressKeyPress = true;
                                event.preventDefault();
                                this.menu.select(event);
                            }
                            break;
                        case keyCode.TAB:
                            if (this.menu.active) {
                                this.menu.select(event);
                            }
                            break;
                        case keyCode.ESCAPE:
                            if (this.menu.element.is(":visible")) {
                                this._value(this.term);
                                this.close(event);
                                event.preventDefault();
                            }
                            break;
                        default:
                            suppressKeyPressRepeat = true;
                            this._searchTimeout(event);
                            break;
                    }
                },
                keypress: function (event) {
                    if (suppressKeyPress) {
                        suppressKeyPress = false;
                        if (!this.isMultiLine || this.menu.element.is(":visible")) {
                            event.preventDefault();
                        }
                        return;
                    }
                    if (suppressKeyPressRepeat) {
                        return;
                    }
                    var keyCode = $.ui.keyCode;
                    switch (event.keyCode) {
                        case keyCode.PAGE_UP:
                            this._move("previousPage", event);
                            break;
                        case keyCode.PAGE_DOWN:
                            this._move("nextPage", event);
                            break;
                        case keyCode.UP:
                            this._keyEvent("previous", event);
                            break;
                        case keyCode.DOWN:
                            this._keyEvent("next", event);
                            break;
                    }
                },
                input: function (event) {
                    if (suppressInput) {
                        suppressInput = false;
                        event.preventDefault();
                        return;
                    }
                    this._searchTimeout(event);
                },
                focus: function () {
                    this.selectedItem = null;
                    this.previous = this._value();
                },
                blur: function (event) {
                    if (this.cancelBlur) {
                        delete this.cancelBlur;
                        return;
                    }
                    clearTimeout(this.searching);
                    this.close(event);
                    this._change(event);
                }
            });
            this._initSource();
            this.menu = $("<div>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({
                role: null
            }).hide().data("ui-menu");
            this._on(this.menu.element, {
                mousedown: function (event) {
                    event.preventDefault();
                    this.cancelBlur = true;
                    this._delay(function () {
                        delete this.cancelBlur;
                    });
                    var menuElement = this.menu.element[0];
                    if (!$(event.target).closest(".ui-menu-item").length) {
                        this._delay(function () {
                            var that = this;
                            this.document.one("mousedown", function (event) {
                                if (event.target !== that.element[0] && event.target !== menuElement && !$.contains(menuElement, event.target)) {
                                    that.close();
                                }
                            });
                        });
                    }
                },
                menufocus: function (event, ui) {
                    if (this.isNewMenu) {
                        this.isNewMenu = false;
                        if (event.originalEvent && /^mouse/.test(event.originalEvent.type)) {
                            this.menu.blur();
                            this.document.one("mousemove", function () {
                                $(event.target).trigger(event.originalEvent);
                            });
                            return;
                        }
                    }
                    var item = ui.item.data("ui-autocomplete-item");
                    if (false !== this._trigger("focus", event, {
                        item: item
                    })) {
                        if (event.originalEvent && /^key/.test(event.originalEvent.type)) {
                            this._value(item.value);
                        }
                    } else {
                        this.liveRegion.text(item.value);
                    }
                },
                menuselect: function (event, ui) {
                    var item = ui.item.data("ui-autocomplete-item"),
                        previous = this.previous;
                    if (this.element[0] !== this.document[0].activeElement) {
                        this.element.focus();
                        this.previous = previous;
                        this._delay(function () {
                            this.previous = previous;
                            this.selectedItem = item;
                        });
                    }
                    if (false !== this._trigger("select", event, {
                        item: item
                    })) {
                        if (!this.options.cleartextbox) this._value(item.value);
                    }
                    this.term = this._value();
                    this.close(event);
                    this.selectedItem = item;
                }
            });
            this.liveRegion = $("<span>", {
                role: "status",
                "aria-live": "polite"
            }).addClass("ui-helper-hidden-accessible").insertBefore(this.element);
            this._on(this.window, {
                beforeunload: function () {
                    this.element.removeAttr("autocomplete");
                }
            });
        },
        _destroy: function () {
            clearTimeout(this.searching);
            this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete");
            this.menu.element.remove();
            this.liveRegion.remove();
        },
        _setOption: function (key, value) {
            this._super(key, value);
            if (key === "source") {
                this._initSource();
            }
            if (key === "appendTo") {
                this.menu.element.appendTo(this._appendTo());
            }
            if (key === "disabled" && value && this.xhr) {
                this.xhr.abort();
            }
        },
        _appendTo: function () {
            var element = this.options.appendTo;
            if (element) {
                element = element.jquery || element.nodeType ? $(element) : this.document.find(element).eq(0);
            }
            if (!element) {
                element = this.element.closest(".ui-front");
            }
            if (!element.length) {
                element = this.document[0].body;
            }
            return element;
        },
        _initSource: function () {
            var array, url, that = this;
            if ($.isArray(this.options.source)) {
                array = this.options.source;
                this.source = function (request, response) {
                    response($.ui.autocomplete.filter(array, request.term));
                };
            } else if (typeof this.options.source === "string") {
                url = this.options.source;
                this.source = function (request, response) {
                    if (that.xhr) {
                        that.xhr.abort();
                    }
                    that.xhr = $.ajax({
                        url: url,
                        method: 'post',
                        data: request,
                        dataType: "json",
                        success: function (data) {
                            response(data);
                        },
                        error: function () {
                            response([]);
                        }
                    });
                };
            } else {
                this.source = this.options.source;
            }
        },
        _searchTimeout: function (event) {
            clearTimeout(this.searching);
            this.searching = this._delay(function () {
                if (this.term !== this._value()) {
                    this.selectedItem = null;
                    this.search(null, event);
                }
            }, this.options.delay);
        },
        search: function (value, event) {
            value = value != null ? value : this._value();
            this.term = this._value();
            if (value.length < this.options.minLength) {
                return this.close(event);
            }
            if (this._trigger("search", event) === false) {
                return;
            }
            return this._search(value);
        },
        _search: function (value) {
            this.pending++;
            this.element.addClass("ui-autocomplete-loading");
            this.cancelSearch = false;
            this.source({
                term: value
            }, this._response());
        },
        _response: function () {
            var that = this,
                index = ++requestIndex;
            return function (content) {
                if (index === requestIndex) {
                    that.__response(content);
                }
                that.pending--;
                if (!that.pending) {
                    that.element.removeClass("ui-autocomplete-loading");
                }
            };
        },
        __response: function (content) {
            if (content) {
                content = this._normalize(content);
            }
            this._trigger("response", null, {
                content: content
            });
            if (!this.options.disabled && content && content.length && !this.cancelSearch) {
                this._suggest(content);
                this._trigger("open");
                cnt = content;
            } else {
                cnt = content;
                this._close();
            }
        },
        close: function (event) {
            this.cancelSearch = true;
            this._close(event);
        },
        _close: function (event) {
            if (this.menu.element.is(":visible")) {
                this.menu.element.hide();
                this.menu.blur();
                this.isNewMenu = true;
                if ($('#searchbox').val().length > 1 && cnt.length > 0) {
                    $('#seeallresults').trigger('click');
                }
                this._trigger("close", event);
            }
        },
        _change: function (event) {
            if (this.previous !== this._value()) {
                this._trigger("change", event, {
                    item: this.selectedItem
                });
            }
        },
        _normalize: function (items) {
            if (items.length && items[0].label && items[0].value) {
                return items;
            }
            return $.map(items, function (item) {
                if (typeof item === "string") {
                    return {
                        label: item,
                        value: item,
                        year: item
                    };
                }
                return $.extend({
                    label: item.label || item.value || item.title,
                    value: item.value || item.label || item.title,
                    year: item.release_year,
                    language: item.language
                }, item);
            });
        },
        _suggest: function (items) {
            var ul = this.menu.element.empty();
            this._renderMenu(ul, items);
            this.isNewMenu = true;
            this.menu.refresh();
            ul.show();
            this._resizeMenu();
            ul.position($.extend({
                of: this.element
            }, this.options.position));
            if (this.options.autoFocus) {
                this.menu.next();
            }
        },
        _resizeMenu: function () {
            var ul = this.menu.element;
            ul.outerWidth(Math.max(ul.width("").outerWidth() + 1, this.element.outerWidth()));
        },
        _renderMenu: function (ul, items) {
            var that = this;
            $.each(items, function (index, item) {
                that._renderItemData(ul, item);
            });
            if (typeof this.options.seeallresult != 'undefined' && typeof this.options.seeallresult == 'function') {
                this.options.seeallresult(ul)
            }
        },
        _renderItemData: function (ul, item) {
            return this._renderItem(ul, item).data("ui-autocomplete-item", item);
        },
        _renderItem: function (ul, item) {
            var release_year = item.year;
            if (typeof release_year != 'undefined' && release_year != '') {
                release_year = "[" + release_year + "]";
            } else {
                release_year = '';
            }
            return $("<div>").append($("<a data-language='" + item.language + "'>").text(item.label).append($("<span style='color:#2a2a2a; padding-left:5px'>").html(release_year))).appendTo(ul);
        },
        _move: function (direction, event) {
            if (!this.menu.element.is(":visible")) {
                this.search(null, event);
                return;
            }
            if (this.menu.isFirstItem() && /^previous/.test(direction) || this.menu.isLastItem() && /^next/.test(direction)) {
                this._value(this.term);
                this.menu.blur();
                return;
            }
            this.menu[direction](event);
        },
        widget: function () {
            return this.menu.element;
        },
        _value: function () {
            return this.valueMethod.apply(this.element, arguments);
        },
        _keyEvent: function (keyEvent, event) {
            if (!this.isMultiLine || this.menu.element.is(":visible")) {
                this._move(keyEvent, event);
                event.preventDefault();
            }
        }
    });
    $.extend($.ui.autocomplete, {
        escapeRegex: function (value) {
            return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
        },
        filter: function (array, term) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), "i");
            return $.grep(array, function (value) {
                return matcher.test(value.label || value.value || value);
            });
        }
    });
    $.widget("ui.autocomplete", $.ui.autocomplete, {
        options: {
            messages: {
                noResults: "No search results.",
                results: function (amount) {
                    return amount + (amount > 1 ? " results are" : " result is") + " available, use up and down arrow keys to navigate.";
                }
            }
        },
        __response: function (content) {
            var message;
            this._superApply(arguments);
            if (this.options.disabled || this.cancelSearch) {
                return;
            }
            if (content && content.length) {
                message = this.options.messages.results(content.length);
            } else {
                message = this.options.messages.noResults;
            }
            this.liveRegion.text(message);
        }
    });
}(jQuery));;
var first_run = true;
var helper = (function () {
    return {
        onSignInCallback: function (authResult) {
            if (authResult['code']) {
                var request = new XMLHttpRequest();
                var url = BASE_URL_SSL + 'secureplus.php';
                var params = "code=" + authResult['code'];
                request.open('POST', url, true);
                request.withCredentials = true;
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && request.status == 200) {
                        obj = JSON.parse(request.responseText);
                        login.loginRefresh(obj);
                        if (obj.newuser == 'Y') {
                            registration.languageSection();
                        }
                    }
                }
                request.send(params);
            } else if (authResult['error']) {}
        }
    };
})();

function onSignInCallback(authResult) {
    if (!first_run) {
        utility.blockui.init();
        helper.onSignInCallback(authResult);
    }
    first_run = false;
};
ajaxResponseHandler = {};
ajaxResponseHandler.ProcessAjaxResponse = function (args) {
    if (window.location.href.indexOf('singalong') == -1) {
        $('#mainarea').css('margin-right', '304px');
        $('.advertisement').show();
    } else {
        $('#mainarea').css('margin-right', '0');
        $('.advertisement').css('display', 'none');
    }
    if (window.location.href.indexOf('genre') != -1) {
        var _hash = location.href.split('/');
        if (_hash[3] == 'genre') {
            $('#mainarea').removeClass('relative');
        }
    } else {
        $('#mainarea').addClass('relative');
    }
    if (window.location.href.indexOf('channel') != -1) {
        changeBodyTheme('defChannel');
    } else {
        changeBodyTheme('');
    }
    if (typeof _deletedtrackIds !== 'undefined' && _deletedtrackIds.length > 0) {
        _deletedtrackIds = [];
    }
    switch ($(args.container).attr('id')) {
        case 'main_middle_content':
            $(args.container).html(args.html)
            loadJSData()
            $(args.container).find('.lyrics_main iframe').css({
                'height': ($(window).outerHeight() - ($('._nheader').outerHeight() + $('#mainPlayer').outerHeight() - 5)),
                width: $('#main_middle_content').outerWidth()
            });
            if ($(args.container).find('.youtube_video_class').length > 0) {
                setTimeout(function () {
                    $('#divlyrics_loader').remove();
                    $('.lyrics_main').css({
                        display: 'block'
                    });
                }, 1000)
            }
            break;
        default:
            $(args.container).append(args.html)
            loadJSData();
    }
};
var echonestIds = null;
var echonestTitle = null;
var playerTypes = {
    1: "jsPlayer",
    2: "jsPlayer",
    3: "jsPlayer",
    4: "jsPlayer",
    5: "jsPlayer",
    6: "jsPlayer",
    10: "jsPlayer",
    14: 'genreRadio',
    15: "echonestplayer",
    17: "echonestplayer",
    18: "Minisitetopsongs"
};
var _jssound;

function loadJsPlayer(target) {
    if (jsPlayer == null || typeof jsPlayer == undefined) {
        jsPlayer = new GaanaPlayer("msPlayer", null, "tunePlayer_SWF");
        window.jsPlayer = jsPlayer;
        _jssound = jsPlayer.getSound("msPlayer");
        if (_jssound.isReady) {} else {
            _jssound.onReady(function () {
                try {
                    uiController = new UIController();
                    var autoPlay = false;
                    var loadAtStartUp = false;
                    if (typeof superCookie != 'undefined' && superCookie.isReady) {
                        cacheData = superCookie.getItem(_variables.CookiesLabel.que);
                    } else {
                        cacheData = null;
                    }
                    if (target != null && target.getAttribute("class") != null && target.getAttribute("class").indexOf('playPause') != -1 && cacheData != null) {
                        autoPlay = true;
                        loadAtStartUp = true
                    }
                    gaanaMaster = new GaanaMaster({
                        data: cacheData || null,
                        autoPlay: autoPlay,
                        loadAtStartUp: loadAtStartUp
                    });
                } catch (e) {}
            });
        };
    }
}
var clickhandler = function (target, e) {
    loadJsPlayer(target)
    var type = target.getAttribute("data-type");
    switch (type) {
        case 'url_user_playlist':
            var url = target.getAttribute("data-value");
            var check_login = login.checklogin(true);
            if (check_login != 1) {
                registration.openPopup();
                return false;
            } else {
                ajaxPageRequestHandler.invoke({
                    url: url,
                    'container': 'main_middle_content',
                });
            }
            break;
        case "play":
            try {
                $('.hotbox').animate({
                    bottom: '0px'
                }, {
                    duration: 500
                });
                var playerType = "jsPlayer";
                var row = $.parseJSON($('#parent-row-' + target.getAttribute("data-value")).html());
                if (typeof row == 'undefined' || typeof row != 'object' || row == null) return;
                if (location.href.indexOf('search/albums') != -1) {
                    var listItem = $('#parent-row-' + target.getAttribute("data-value"));
                    var keywordsearch = $.trim($('#searched-keyword').text());
                    var position_from_top = $('.parentnode span').index(listItem) + 1;
                    var title = row.title;
                    gAnalyticChannelClick("SRP", 'Album - ' + title, keywordsearch + '|' + position_from_top);
                }
                var datakey = row.source + row.source_id;
                if (typeof _variables['source'][datakey] == 'undefined' && _variables['source'][datakey] == null) {
                    _variables['source'][datakey] = new Array()
                    var track_id_array = new Array();
                    if ($('.sourcelist_' + row.source_id).length > 0 && row.object_type != 3 && row.object_type != 15) {
                        $('.sourcelist_' + row.source_id).each(function () {
                            track_id_array.push($.parseJSON(this.getAttribute("data-value")).id)
                        })
                    } else {
                        row.index = 0;
                        track_id_array.push(row.id)
                    }
                    if (row.source == 15) {
                        $('.hd_img').addClass('_loader')
                        $('.bottom-popup').animate({
                            bottom: '80px'
                        }, {
                            duration: 300
                        });
                        $('.notification_msg').html('Starting your radio');
                        echonestIds = row.id;
                        echonestTitle = row.title;
                        gAnalyticChannelClick('Echonest Artist Radio', 'Play', echonestTitle);
                    }
                    try {
                        $.ajax({
                            url: "/ajax/getData",
                            data: {
                                "ids": track_id_array.join(','),
                                'action': 'tracklist',
                                'source': row.source,
                                'source_id': row.source_id,
                                'objtype': (typeof row.objtype != 'undefined' && row.objtype != null) ? row.objtype : 1,
                                'max_track_to_be_display': (typeof row.max_track_to_be_display != 'undefined' && row.max_track_to_be_display != null) ? row.max_track_to_be_display : 0,
                                'channelType': (typeof row.channelType != 'undefined' && row.channelType != null) ? row.channelType : 0,
                                'title': (typeof row.title != 'undefined' && row.title != null) ? row.title : "",
                                'seokey': (typeof row.seokey != 'undefined' && row.seokey != null) ? row.seokey : ""
                            },
                            type: 'post',
                            success: function (data) {
                                $('.bottom-popup').animate({
                                    bottom: '-60px'
                                }, 150);
                                $('.hd_img').removeClass('_loader')
                                if ($.trim(data) == null || $.trim(data) == '') {
                                    messagebox.open({
                                        msg: "Unable to play song, please try again",
                                        autoclose: true
                                    });
                                    return;
                                } else if ($.trim(data) == "radio does not exists") {
                                    messagebox.open({
                                        msg: "Could not start this radio, please try again",
                                        autoclose: true
                                    });
                                    delete _variables['source'][datakey]
                                    return;
                                }
                                if (data != '' && $.trim(data) != "null") {
                                    if (!gaanaMaster) {
                                        gaanaMaster = new GaanaMaster({
                                            autoPlay: true,
                                            data: null
                                        });
                                    }
                                    _variables['source'][datakey] = data;
                                    try {
                                        var playerType = playerTypes[row.objtype]
                                        if (_jssound.isReady) {
                                            gaanaMaster.createSound({
                                                data: _variables['source'][datakey],
                                                index: row.index,
                                                shuffle: false
                                            }, true, true, playerType, row.source, row.source_id);
                                        } else {
                                            var cls = setInterval(function () {
                                                if (!_jssound.isReady) {
                                                    gaanaMaster.createSound({
                                                        data: _variables['source'][datakey],
                                                        index: row.index,
                                                        shuffle: false
                                                    }, true, true, playerType, row.source, row.source_id);
                                                    clearInterval(cls)
                                                }
                                            }, 50)
                                        }
                                        if (row.source == '3') {
                                            _now_playing_check = true;
                                        } else if (row.source == '14') {
                                            Layout.setgenreRadioSongCards();
                                        } else {
                                            _now_playing_check = false;
                                        }
                                    } catch (e) {}
                                    if (row.source == 6) {
                                        delete _variables['source'][datakey]
                                    }
                                    return;
                                } else {
                                    utility.errorLog("data is null", 'play');
                                }
                            }
                        });
                    } catch (e) {
                        utility.errorLog(e.message, 'clickhandler: play');
                    }
                    for (sources in _variables['source']) {
                        if (sources != datakey) {
                            delete _variables['source'][sources];
                        }
                    }
                }
                var playerType = playerTypes[row.objtype]
                if (typeof _variables['source'][datakey] != 'undefined' && _variables['source'][datakey] != '') {
                    if (_variables['source'][datakey] != null && _variables['source'][datakey] != "") {
                        trace("_sound.isReady" + _jssound.isReady)
                        if (_jssound.isReady) {
                            gaanaMaster.createSound({
                                data: _variables['source'][datakey],
                                index: row.index,
                                shuffle: false
                            }, true, true, playerType, row.source, row.source_id);
                        } else {
                            var cls = setInterval(function () {
                                if (!_jssound.isReady) {
                                    gaanaMaster.createSound({
                                        data: _variables['source'][datakey],
                                        index: row.index,
                                        shuffle: false
                                    }, true, true, playerType, row.source, row.source_id);
                                    clearInterval(cls)
                                }
                            }, 50)
                        }
                    }
                }
            } catch (e) {
                alert(e.message)
            }
            break;
        case "playSong":
            try {
                $('.hotbox').animate({
                    bottom: '0px'
                }, {
                    duration: 500
                });
                var dataarr = new Array();
                var row = $.parseJSON($('#parent-row-' + target.getAttribute("data-value")).html())
                var songid = row.id
                if (typeof row == 'undefined' || typeof row != 'object' || row == null) return;
                if ($('.sourcelist_' + row.source_id).length > 0) {
                    $('.sourcelist_' + row.source_id).each(function (index) {
                        if (row.id == $.parseJSON($(this).html()).id) {
                            row.index = index;
                        }
                    })
                }
                var datakey = row.source + row.source_id;
                if (typeof _variables['source'][datakey] == 'undefined' && _variables['source'][datakey] == null) {
                    _variables['source'][datakey] = new Array()
                    if ($('.sourcelist_' + row.source_id).length > 0) {
                        $('.sourcelist_' + row.source_id).each(function (index) {
                            dataarr.push($(this).html())
                        })
                    } else {
                        row.index = 0;
                        dataarr.push($.toJSON(row))
                    }
                    var data = '[' + dataarr.join(",") + ']';
                    if (data != '' && $.trim(data) != "null") {
                        if (!gaanaMaster) {
                            gaanaMaster = new GaanaMaster({
                                autoPlay: true,
                                data: null
                            });
                        }
                        var sType = "jsPlayer";
                        _variables['source'][datakey] = data;
                    }
                    for (sources in _variables['source']) {
                        if (sources != datakey) {
                            delete _variables['source'][sources];
                        }
                    }
                }
                if ($('.playicon' + songid).hasClass('pause-icon') || $('.playicon' + songid).hasClass('songplayed')) {
                    if (gaanaMaster.getCurrentInfo() != null) {
                        staticPlayer.playToggle();
                        $('.playicon' + songid).addClass('songplayed')
                        $('.playicon' + songid).attr('title', 'Play')
                        return;
                    }
                }
                $('.play_pause').removeClass('songplayed');
                $('.playicon' + songid).attr('title', 'Pause')
                var playerType = (typeof row.source != 'undefined') ? playerTypes[row.source] : 'jsPlayer';
                gaanaMaster.createSound({
                    data: _variables['source'][datakey],
                    index: (row.index != null && typeof row.index != 'undefined') ? row.index : 0,
                    shuffle: false
                }, true, true, playerType, row.source, row.source_id);
                if (typeof row.source_id != 'undefined' && row.source_id == null) {
                    delete _variables['source'][datakey]
                }
                if (location.href.indexOf('search/songs') != -1) {
                    var listItem = $('#parent-row-' + target.getAttribute("data-value"));
                    var keywordsearch = $.trim($('#searched-keyword').text());
                    var position_from_top = $('.parentnode').index(listItem) + 1;
                    var title = row.title;
                    var language = row.language;
                    gAnalyticChannelClick("SRP", 'Track - ' + title, keywordsearch + '|' + position_from_top + '|' + language);
                }
            } catch (e) {
                alert(e.message)
            }
            break;
        case 'playfeaturedsong':
            try {
                $('.hotbox').animate({
                    bottom: '0px'
                }, {
                    duration: 500
                });
                var row = $.parseJSON($('#parent-row-' + target.getAttribute("data-value")).html());
                if (typeof row == 'undefined' || typeof row != 'object' || row == null) return;
                var songid = row.id
                if (typeof row == 'undefined' || typeof row != 'object' || row == null) return;
                if ($('.sourcelist_' + row.source_id).length > 0) {
                    $('.sourcelist_' + row.source_id).each(function (index) {
                        if (row.id == $.parseJSON($(this).html()).id) {
                            row.index = index;
                        }
                    })
                }
                if (row.source == '3') {
                    _now_playing_check = true;
                } else if (row.source == '14') {} else {
                    _now_playing_check = false;
                }
                var datakey = row.source + row.source_id;
                if (typeof _variables['source'][datakey] == 'undefined' && _variables['source'][datakey] == null) {
                    _variables['source'][datakey] = new Array()
                    var track_id_array = new Array();
                    if ($('.sourcelist_' + row.source_id).length > 0) {
                        $('.sourcelist_' + row.source_id).each(function () {
                            track_id_array.push($.parseJSON($(this).html()).id)
                        })
                    } else {
                        row.index = 0;
                        track_id_array.push(row.id)
                    }
                    try {
                        $.ajax({
                            url: "/ajax/getData",
                            data: {
                                "ids": track_id_array.join(','),
                                'action': 'tracklist',
                                'source': row.source,
                                'source_id': row.source_id,
                                'objtype': 3,
                                'max_track_to_be_display': (typeof row.max_track_to_be_display != 'undefined' && row.max_track_to_be_display != null) ? row.max_track_to_be_display : 0,
                                'channelType': (typeof row.channelType != 'undefined' && row.channelType != null) ? row.channelType : 0
                            },
                            type: 'post',
                            success: function (data) {
                                if (data != '' && $.trim(data) != "null") {
                                    if (!gaanaMaster) {
                                        gaanaMaster = new GaanaMaster({
                                            autoPlay: true,
                                            data: null
                                        });
                                    }
                                    var sType = "jsPlayer";
                                    _variables['source'][datakey] = $.trim(data);
                                    try {
                                        gaanaMaster.createSound({
                                            data: _variables['source'][datakey],
                                            index: (typeof row.index != 'undefined') ? row.index : 0,
                                            shuffle: false
                                        }, true, true, 'jsPlayer', row.source, row.source_id);
                                    } catch (e) {}
                                    return;
                                } else {
                                    utility.errorLog("data is null", 'play');
                                }
                            }
                        });
                    } catch (e) {
                        utility.errorLog(e.message, 'clickhandler: play');
                    }
                    for (sources in _variables['source']) {
                        if (sources != datakey) {
                            delete _variables['source'][sources];
                        }
                    }
                }
                if ($('.playicon' + songid).hasClass('pause-icon') || $('.playicon' + songid).hasClass('songplayed')) {
                    if (gaanaMaster.getCurrentInfo() != null) {
                        staticPlayer.playToggle();
                        $('.playicon' + songid).addClass('songplayed')
                        $('.playicon' + songid).attr('title', 'Play')
                        return;
                    }
                }
                $('.play_pause').removeClass('songplayed');
                $('.playicon' + songid).attr('title', 'Pause')
                gaanaMaster.createSound({
                    data: _variables['source'][datakey],
                    index: (typeof row.index != 'undefined') ? row.index : 0,
                    shuffle: false
                }, true, true, 'jsPlayer', row.source, row.source_id);
            } catch (e) {}
            break;
        case 'addtoqueue':
            try {
                var row = $.parseJSON($('#parent-row-' + target.getAttribute("data-value")).html())
                var dataarray = new Array();
                dataarray.push(row);
                gaanaMaster.addToQueue(dataarray)
            } catch (e) {}
            break;
        case 'favorite':
            var parentrowobj = $('#parent-row-' + target.getAttribute("data-value"));
            utility.parentrowobj = parentrowobj;
            utility.row = $.parseJSON(parentrowobj.html());
            utility.targetObj = target;
            var cbJS = "utility.addToFavorite()";
            checkSessionAndExecute({
                CBJS: cbJS,
                cbOBJ: {
                    target: target
                }
            }, type, utility.row);
            break;
        case 'favoritesong':
            var row = $.parseJSON(target.getAttribute("data-value"));
            $.ajax({
                url: BASE_URL + "ajax/favorite",
                data: row,
                type: 'post',
                success: function (data) {
                    if (data != '' && $.trim(data) != "null") {
                        if (data == 'success') {} else if (data == 'removed') {} else if (data == 'not_loggedin') {
                            registration.openPopup();
                            return false;
                        } else if (data == 'not_verified') {
                            verify.openPopUp();
                            return false;
                        }
                    } else {
                        utility.errorLog("data is null", 'play');
                    }
                }
            });
            break;
        case 'toggleFollow':
            try {
                var parentrowobj = $('#parent-row-' + target.getAttribute("data-value"));
                var row = $.parseJSON(parentrowobj.html());
                row.activity_type = 'toggle_follow';
                row.task = "push_mytimes_data";
                $.ajax({
                    url: BASE_URL + "ajax/myTimesActivities",
                    data: row,
                    type: 'post',
                    success: function (result) {
                        try {
                            if (result == 'not_loggedin') {
                                registration.openPopup();
                                return false;
                            } else if (result == 'not_verified') {
                                verify.openPopUp();
                                return false;
                            } else {
                                if (row.status == 1) {
                                    row.status = 0;
                                    $('._fol').html('Follow');
                                } else if (row.status == 0) {
                                    row.status = 1;
                                    $('._fol').html('Unfollow');
                                }
                                $('#parent-row-target_user' + row['id']).html($.toJSON(row));
                            }
                        } catch (e) {
                            alert(e);
                        }
                    }
                });
            } catch (e) {
                alert(e);
            }
            break;
        case 'followUser':
            var parentrowobj = $('#parent-row-' + target.getAttribute("data-value"));
            var row = $.parseJSON(parentrowobj.html());
            row.status = 0;
            row.activity_type = 'toggle_follow';
            row.task = "push_mytimes_data";
            $.ajax({
                url: BASE_URL + "ajax/myTimesActivities",
                data: row,
                type: 'post',
                success: function (result) {
                    try {
                        if (result == 'not_loggedin') {
                            registration.openPopup();
                            return false;
                        } else if (result == 'not_verified') {
                            verify.openPopUp();
                            return false;
                        } else {
                            row.status = 1;
                            $(target).remove();
                            $('#parent-row-member' + row['id']).html($.toJSON(row));
                        }
                    } catch (e) {
                        alert(e);
                    }
                }
            });
            break;
        case 'addtopp':
            try {
                if (gaanaMaster.getCurrentInfo() == null && typeof RadioMetaData.data.id == 'undefined') return;
                delete playlist.destination;
                delete playlist.sourceobj;
                if (gaanaMaster.getCurrentInfo() != null) {
                    var currentsong = gaanaMaster.getCurrentInfo();
                    currentsong['track_ids'] = currentsong.id
                    playlist.sourceobj = gaanaMaster.getCurrentInfo();
                }
                if (typeof RadioMetaData.data.id != 'undefined') {
                    var currentsong = RadioMetaData.data;
                    currentsong['track_ids'] = RadioMetaData.data.id
                    playlist.sourceobj = RadioMetaData.data;
                }
                var cbJS = "playlist.addtoplaylist()";
                checkSessionAndExecute({
                    CBJS: cbJS,
                    cbOBJ: {
                        target: target
                    }
                }, 'addtoplaylist', playlist.sourceobj);
            } catch (e) {
                alert(e.message)
            }
            break;
        case 'sharep':
            try {
                if (gaanaMaster.getCurrentInfo() == null && typeof RadioMetaData.data.id == 'undefined') return;
                if (gaanaMaster.getCurrentInfo() != null) {
                    share.sourceobj = gaanaMaster.getCurrentInfo()
                }
                if (typeof RadioMetaData.data.id != 'undefined') {
                    share.sourceobj = RadioMetaData.data;
                }
                var cbJS = "sharePopup(target,e,'player-share-popup')";
                checkSessionAndExecute({
                    CBJS: cbJS,
                    cbOBJ: {
                        target: target,
                        e: e
                    }
                }, 'share', share.sourceobj);
            } catch (e) {}
            break;
        case 'favp':
            if (gaanaMaster.getCurrentInfo() == null && typeof RadioMetaData.data.id == 'undefined') return;
            try {
                try {
                    if (gaanaMaster.getCurrentInfo() != null) {
                        var row = gaanaMaster.getCurrentInfo();
                    }
                    if (typeof RadioMetaData.data.id != 'undefined') {
                        RadioMetaData.data['object_type'] = 10;
                        var row = RadioMetaData.data;
                    }
                } catch (e) {}
                utility.parentrowobj = $('#parent-row-song' + row['id']);
                utility.targetObj = target;
                utility.row = row;
                var cbJS = "utility.addToFavorite()";
                checkSessionAndExecute({
                    CBJS: cbJS,
                    cbOBJ: {
                        target: target
                    }
                }, 'favorite', utility.row);
            } catch (e) {
                alert(e.message)
            }
            break;
        case 'addtoplaylist':
            try {
                var datavalue = $.parseJSON($('#parent-row-' + target.getAttribute("data-value")).html())
                var source = datavalue.source;
                var category = getKey(source, requestDataSource);
                var category_type = getKey(datavalue.object_type, requestDataSource);
                var label = datavalue.title;
                if (datavalue.source == '14') {
                    category = 'GaanaRadios';
                    $.each(_genre_radio_title_array, function (key, gaana_radio_info) {
                        if (gaana_radio_info.id == datavalue.source_id) {
                            label = gaana_radio_info.title;
                        }
                    });
                }
                gAnalyticChannelClick(category, "Addtoplaylist-" + category_type, label);
                playlist.sourceobj = datavalue
                var cbJS = "playlist.addtoplaylist()";
                checkSessionAndExecute({
                    CBJS: cbJS,
                    cbOBJ: {
                        target: target
                    }
                }, type, playlist.sourceobj);
            } catch (e) {}
            break;
        case 'addsongtoplaylist':
            var datavalue = $.parseJSON($('#parent-row-' + target.getAttribute("data-value")).html())
            playlist.sourceobj = datavalue
            var cbJS = "playlist.addtoplaylist()";
            checkSessionAndExecute({
                CBJS: cbJS,
                cbOBJ: {
                    target: target
                }
            }, 'addtoplaylist', playlist.sourceobj);
            break;
        case 'sharesong':
            var datavalue = $.parseJSON($('#parent-row-' + target.getAttribute("data-value")).html())
            share.sourceobj = datavalue
            share.openPopup(share.sourceobj)
            break;
        case 'share':
            var datavalue = $.parseJSON($('#parent-row-' + target.getAttribute("data-value")).html());
            var cbJS = "sharePopup(target,e)";
            checkSessionAndExecute({
                CBJS: cbJS,
                cbOBJ: {
                    target: target,
                    e: e
                }
            }, 'share', datavalue);
            break;
        case 'fshare':
            args = share.sourceobj
            share.onMytimes(args);
            share.Onfacebook(args)
            break;
        case 'gshare':
            args = share.sourceobj
            share.onMytimes(args);
            share.openPopup(args)
            break;
        case 'tshare':
            args = share.sourceobj
            share.onMytimes(args);
            share.Ontwitter(args)
            break;
        case 'eshare':
            args = share.sourceobj
            share.onMytimes(args);
            share.email(args);
            break;
        case 'playqueue':
            try {
                if ($(target).hasClass('pause-song-queue') || $(target).hasClass('played')) {
                    staticPlayer.playToggle();
                    $(target).addClass('played')
                    return;
                }
                $(target).removeClass('played');
                var shuffle = (typeof shuffle != 'undefined') ? shuffle : false;
                var row = $.parseJSON($('#parent-row-' + target.getAttribute("data-value")).html());
                gaanaMaster.setCurrentShuffle(false)
                gaanaMaster.playById(row.id, false)
            } catch (e) {}
            break;
        case 'playradio':
            $('.hotbox').animate({
                bottom: '0px'
            }, {
                duration: 500
            });
            var row = $.parseJSON(target.getAttribute("data-value"));
            callRadioSation(row.stationid, row.stationname, row.akamaibase, row.akamaiurl, '')
            break;
        case 'keywordsearch':
            $('#searchbox').val(target.getAttribute("data-value"))
            break;
        case 'saveasplaylist':
            var arrayid = new Array();
            var queue = $.parseJSON(superCookie.getItem('queue'))
            for (row in queue) {
                arrayid.push(queue[row].id)
            }
            playlist.sourceobj = {
                objtype: 'playerqueue',
                track_ids: arrayid.join(','),
                trackcount: arrayid.length
            }
            var cbJS = "playlist.addtoplaylist()";
            checkSessionAndExecute({
                CBJS: cbJS,
                cbOBJ: {
                    target: target
                }
            }, 'createplaylist', null);
            break;
        case 'clearqueue':
            for (sources in _variables['source']) {
                delete _variables['source'][sources];
            }
            gaanaMaster.clearQueue();
            $('.addedsonglist').html('');
            $('.addedsonglist').hide();
            $('.songadded').removeClass('whitebg');
            $('.songcnt').html('');
            $('#transparent').hide();
            break;
        case 'sortBy':
            var val = target.getAttribute("data-value")
            var url = getSortUrl(val)
            ajaxPageRequestHandler.invoke({
                url: url,
                'container': 'main_middle_content'
            });
            break;
        case 'select_language':
            break;
        case 'deleteitem':
            for (sources in _variables['source']) {
                delete _variables['source'][sources];
            }
            gaanaMaster.deleteById(target.getAttribute("data-value"))
            $('.scrollablelayerQueue').jScrollPane({
                verticalDragMinHeight: 20
            });
            break;
        case 'changeDeviceStatus':
            var device_status = '';
            if ($(target).is(':checked')) {
                device_status = 'linked';
            } else {
                device_status = 'unlinked';
            }
            var device_id = $(target).attr("data-value");
            try {
                $.ajax({
                    url: "/ajax/gaana_plus",
                    async: true,
                    data: {
                        "task": 'change_device_status',
                        'device_id': device_id,
                        'device_status': device_status
                    },
                    type: 'post',
                    success: function (data) {
                        if (data != '' && $.trim(data) != "null") {
                            if ($.trim(data) == 'linked') {
                                $("#custom_span_" + device_id).addClass('pos');
                            } else {
                                $("#custom_span_" + device_id).removeClass('pos');
                            }
                        } else {
                            utility.errorLog("data is null", 'play');
                        }
                    }
                });
            } catch (e) {
                utility.errorLog(e.message, 'clickhandler: play');
            }
            break;
        case 'removeDevice':
            var device_id = $(target).attr("data-value");
            try {
                $.ajax({
                    url: "/ajax/gaana_plus",
                    async: true,
                    data: {
                        "task": 'delete_device',
                        'device_id': device_id
                    },
                    type: 'post',
                    success: function (data) {
                        if (data != '' && $.trim(data) != "null") {
                            if ($.trim(data) == 'removed') {
                                $("#device_row_" + device_id).remove()
                            }
                        } else {
                            utility.errorLog("data is null", 'play');
                        }
                    }
                });
            } catch (e) {
                utility.errorLog(e.message, 'clickhandler: play');
            }
            break;
        case 'song-slider':
            try {
                if (!gaanaMaster.registrationLimitPopUp('Radio Theme')) return false;
                var current_index = superCookie.getItem('genre_radio_song_index');
                current_index = parseInt(current_index);
                var song_move_index = superCookie.getItem('genre_radio_song_move_index');
                var prevsong_index = 0;
                if (current_index == 0 || flag_song_index) {
                    flag_song_index = false;
                    song_move_index = current_index;
                }
                var song_index = parseInt(song_move_index);
                if (current_index > 4) {
                    prevsong_index = (parseInt(current_index) + 1 - 5);
                }
                var direction = target.getAttribute("data-value");
                if (typeof direction != 'undefined' && direction == 'right') {
                    if (current_index <= song_move_index) {
                        gaanaMaster.playNext();
                    }
                    if (song_index < current_index + 1) {
                        song_index++;
                    }
                    gAnalyticChannelClick('GaanaRadios-' + _genre_radio_title, "Next", _genre_radio_title);
                    superCookie.setItem('genre_radio_song_move_index', song_index);
                } else if (typeof direction != 'undefined' && direction == 'left' && song_index > 0) {
                    song_index--;
                    gAnalyticChannelClick('GaanaRadios-' + _genre_radio_title, "Back", _genre_radio_title);
                    superCookie.setItem('genre_radio_song_move_index', song_index);
                }
                slideGallery(direction, 'radiogall', 200, 550, song_index);
            } catch (e) {
                alert(e.message);
            }
            break;
        case "playvideo":
            if (target.getAttribute("data-value") == "playfromplayer") {
                var currentsong = gaanaMaster.getCurrentInfo();
            } else {
                var currentsong = $.parseJSON($('#parent-row-' + target.getAttribute("data-value")).html());
            }
            done = false;
            createCookie('video_url', 1)
            if (typeof currentsong.id != 'undefined' && typeof currentsong.video_url != 'undefined' && currentsong.video_url != '') {
                $('#video_player_link').removeClass("act");
                $('#video_player_link').addClass("act");
                var videoIdarr = currentsong.video_url.split('embed/');
                videoId = videoIdarr[1];
                var url = BASE_URL + "video-song/" + currentsong.seokey;
                ajaxPageRequestHandler.invoke({
                    url: url,
                    'container': 'main_middle_content',
                });
                return;
            }
            break;
        case "openlyrics":
            if (gaanaMaster.getCurrentInfo() != null) {
                var currentsong = gaanaMaster.getCurrentInfo();
                if (typeof currentsong.id != 'undefined' && typeof currentsong.lyrics_url != 'undefined' && currentsong.lyrics_url != '') {
                    $('#lyrics_player_link').removeClass('act')
                    $('#lyrics_player_link').addClass('act')
                    gAnalyticVirtualPageview('/virtual/lyrics');
                    createCookie('lyrics_url', 1)
                    if (typeof readCookie('lyrics_chk') != 'undefined' && readCookie('lyrics_chk') == 1) {
                        var myWindow = window.open(currentsong.lyrics_url, '_blank');
                        myWindow.focus();
                        return false;
                    } else {
                        lyrics.openPopUp(currentsong);
                    }
                }
            }
        default:
    }
}

    function loadYTubePlayer(video_url) {
        var videoIdarr = video_url.split('embed/');
        videoId = videoIdarr[1];
        if (jsPlayer != null && typeof jsPlayer != 'undefined') {
            var sng = jsPlayer.getSound('msPlayer');
            sng.pauseMe();
            staticPlayer.updatePlayButton();
        }
        if (!youtubeloaded) {
            $.getScript("https://www.youtube.com/iframe_api", function () {
                youtubeloaded = true
            })
        } else {
            onYouTubeIframeAPIReady()
        }
    };
var _variables = {};
var ij = 1;
var dir = 0;
var lt_slide = $('.left_slide').length;
var counter = new Array();
for (sl = 1; sl <= lt_slide; sl++) {
    counter[sl] = 1;
}
var getid = '';
var getltid = '';
_variables.channelPreRoll = "";
_variables.channelPostRoll = "";
_variables.source = {};
_variables.CookiesLabel = {
    que: 'queue'
};
_variables.ajaxRequest = null
_variables.manualClick = false;
_variables.twitterShareUrl = "http://twitter.com/share?url=";
_variables.facebookShareUrl = "http://www.facebook.com/sharer.php?u=";
var fbLoginCallback = {};
var _userLoginStatus = false;
var gridPlaySong = false;
var _countActivity = 0;
var _activeSongID = 0;
var _deletedtrackIds = new Array();
var _userInfo = {};
_userInfo.name = "";
_userInfo.regMode = "";
_userInfo.id = "";
_userInfo.email = "";
_userInfo.fbid = "";
_userInfo.twitter_uid = "";
_userInfo.id = "";
var shareInfo = "";
var artist_name = "";
var flag_song_index = false;
var _nowplaying_start_up = false;
var _playlist_similar_song = false;
var _favorite_count = 0;

function onCopied(s) {
    $('.copylink').text('Copied').css('color', 'orange');
    $('.copylink').addClass('copied');
}

function copyLink(url) {
    try {
        var elementid = 'copylinkSwf'
        if ($("#" + elementid).length == 0) return;
        var copierSwf = BASE_URL + "/swf/copylink.swf"
        if (typeof copierSwf != "undefined") {
            var so = new SWFObject(copierSwf, elementid, "100", "20", "10.1", "#ffffff");
            so.addParam("salign", "center");
            so.addParam("AllowScriptAccess", "always");
            so.addParam("wmode", "transparent");
            try {
                so.addVariable("clipText", url);
            } catch (e) {}
            so.addVariable("text_color", '0X666666');
            so.addVariable("font_size", '11');
            so.addVariable("font_name", 'Open Sans,arial');
            so.addVariable("labelTxt", 'Copy link');
            so.write(elementid);
            delete so;
        }
    } catch (e) {
        alert("copyLink.." + e.message)
    }
}

function errorLog(error, block) {}
var utility = {};
utility.errorLog = function (error, block) {}
utility.bindEvents = function () {
    $('#outercontainer').on('click', '#playAllSong', function () {
        $('.play_pause').removeClass('songplayed');
        $('.play_pause').removeClass('pause-icon');
        $($('.songlist')[0]).trigger('click')
    })
    $('#outercontainer').on('click', '#playAllSong-search', function () {
        $('.play_pause').removeClass('songplayed');
        $('.play_pause').removeClass('pause-icon');
        $('.hotbox').animate({
            bottom: '0px'
        }, {
            duration: 500
        });
        var dataarr = new Array();
        if ($('.searchsonglist').length > 0) {
            $('.searchsonglist').each(function (index) {
                dataarr.push($(this).html())
            })
        }
        if (dataarr.length < 1) return;
        var data = '[' + dataarr.join(",") + ']';
        gaanaMaster.createSound({
            data: data,
            index: 0,
            shuffle: false
        }, true, true, 'jsPlayer', 1, 1);
    })
    $('#outercontainer').on('click', '#p-list-play_all', function () {
        $('.play_pause').removeClass('songplayed');
        $('.play_pause').removeClass('pause-icon');
        $($('.songlist')[0]).trigger('click')
    })
    $('#outercontainer').on('click', '#language', function () {
        utility.selectLanguage();
    })
    $('#outercontainer').on('click', '.cus_select', function (e) {
        if ($(this).find('ul').css('display') == 'none' || $(this).find('div.gaanaradio-bands').css('display') == 'none') {
            $(this).find('div.gaanaradio-bands').show();
            $(this).find('ul').not('#gaanaradios').show();
        } else {
            $(this).find('ul').not('#gaanaradios').hide();
            $(this).find('div.gaanaradio-bands').hide();
        }
    })
    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _renderMenu: function (ul, items) {
            var that = this,
                currentCategory = "";
            $.each(items, function (index, item) {
                if (item.type != currentCategory) {
                    ul.append("<div class='a-d mar10'>" + item.type + "</div>");
                    currentCategory = item.type;
                }
                that._renderItemData(ul, item);
            });
        }
    });
    $("#searchbox").catcomplete({
        source: "/ajax/autosearch",
        cleartextbox: true,
        minLength: 2,
        appendTo: "#suggesitioncontainer",
        select: function (event, ui) {
            if (typeof ui.item == 'undefined') {
                utility.search_on_enter_hit();
            } else {
                this.value = ''
                $(this).attr('placeholder', "Click here to Search for songs, artists and albums");
                var url = "/" + ui.item.url_link.toLowerCase() + "/" + ui.item.seo_url;
                ajaxPageRequestHandler.invoke({
                    url: url,
                    'container': 'main_middle_content'
                });
                return false;
            }
        },
        open: function () {
            $('#search-suggestions').css({
                display: 'block'
            })
            $('#search-suggestions .ui-menu-item').on('click', function () {
                var keywordsearch = $.trim($('#searchbox').val());
                var position_from_top = $('#search-suggestions .ui-menu-item').index(this) + 1;
                var title = $(this).prevAll('.a-d:first').html();
                var title_position = $(this).prevAll('.a-d').length;
                var search_result = $(this).find('a').text();
                var language = $(this).find('a').attr('data-language');
                gAnalyticChannelClick("AutoSuggest", title + '|' + title_position, keywordsearch + '|' + position_from_top + '|' + search_result + '|' + language);
                var _category = title;
                _gaq.push(['_trackPageview', '/search?query=' + keywordsearch + '&cat=' + _category]);
            })
            $('#search-suggestions').css('width', $('._nsearch').width() - ($('#searchbtn').width() + 1));
            $(window).resize(function () {
                if (apis.length) {
                    $.each(apis, function (i) {
                        this.destroy();
                    })
                    apis = [];
                }
                $('#search-suggestions').css('width', $('._nsearch').width() - ($('#searchbtn').width()));
                activateverticalScrollerSearch();
                $('#search-suggestions .all-result').remove();
                if ($('#search-suggestions .all-result').length <= 0) {
                    $('<div class="all-result a-d white align-center"><a id="seeallresults" href="javascript:void(0)">See all results</a></div>').appendTo($('#search-suggestions'));
                }
            })
            activateverticalScrollerSearch();
            $('#search-suggestions .all-result').remove();
            if ($('#search-suggestions .all-result').length <= 0) {
                $('<div class="all-result a-d white align-center"><a id="seeallresults" href="javascript:void(0)">See all results</a></div>').appendTo($('#search-suggestions'));
            }
        },
        close: function () {
            $('#search-suggestions').css({
                display: 'none'
            })
        },
        seeallresult: function (ul) {}
    });
    $('body').on('keydown', "#searchbox", function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13 || code == 9) {
            utility.search_on_enter_hit();
            return false;
        }
    })
    $('body').on('click', "#seeallresults,#searchbtn", function (e) {
        utility.search_on_enter_hit();
    })
    $('body').on('keydown', "#song_search", function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13 || code == 9) {
            searchSong();
            return false;
        }
    })
    $('body').on('click', "#btnSearch", function (e) {
        searchSong();
    })
    $('input[type=text]').blankInput();
    $('#outercontainer').on('click', "#login-button", function () {
        registration.openPopup();
        gAnalyticVirtualPageview('/virtual/login-popup');
    });
    $('#outercontainer').on('click', ".login-register-button", function () {
        registration.openPopup();
        gAnalyticVirtualPageview('/virtual/login-popup');
    });
    $('#outercontainer').on('click', "#g-login", function () {
        registration.openPopup();
    })
    $('#outercontainer').on('click', ".facebook-login-home", function () {
        gAnalyticChannelClick('Login-Register', 'Facebook', 'PromoDiv');
        registration.fblogin();
    })
    $('#outercontainer').on('click', ".twit-login", function () {
        gAnalyticChannelClick('Login-Register', 'Twitter', 'PromoDiv');
        registration.twitterLogin();
    })
    $('#outercontainer').on('click', '#logout-button', function () {
        $('#gaana_datamap_ajax').remove();
        $('#gaana_datamap').remove();
        $('#gaana_datamap_main').remove();
        try {
            $.ajax({
                url: BASE_URL + "ajax/login",
                data: {
                    "task": 'logout'
                },
                type: 'post',
                success: function (data) {
                    if (data != '' && $.trim(data) != "null") {
                        if ($.trim(data) == 'success') {
                            createCookie("onBoarding", '', 0);
                            login.logoutRefresh();
                        } else {
                            alert(data);
                        }
                    } else {
                        utility.errorLog("data is null", 'logout');
                    }
                }
            });
        } catch (e) {
            alert(e.message);
        }
    });
    $("#createplaylist").unbind('click').bind('click', function () {
        playlist.sourceobj = null;
        var cbJS = "playlist.openPopup()";
        checkSessionAndExecute({
            CBJS: cbJS,
            cbOBJ: {
                target: this
            }
        }, 'createplaylist', playlist.sourceobj);
    });
    $('#outercontainer').on('click', "#terms_and_conditions,#privacy_policy", function () {
        var virtual_page = $(this).attr('data-type');
        var page_name = $(this).attr('id');
        $('#popup').remove();
        var page_url = BASE_URL + page_name + '.html';
        var frame_html = '<iframe src="' + page_url + '" width="100%" height="500" style="border:0"></iframe>';
        options = {
            template_id: 'noadstpl',
            popup_class: '_Privacy',
            header_message: null,
            disp_message: frame_html,
            is_prompt: false,
            width: '717',
            close_btn: true,
            position: 'center',
            virtualpage: virtual_page,
            yesCallback: function () {},
            noCallback: function () {}
        };
        messagebox.showMessage(options);
    });
    $('#outercontainer').on('click', '#advertise', function () {
        $('#popup').remove();
        var template = $('#advertise-div').html();
        $('#outercontainer').append('<div id="popup" >' + template + '</div>');
        $('#popup').dialog({
            autoOpen: true,
            width: 525,
            height: 300,
            modal: true,
            draggable: false,
            dialogClass: 'advertiseon',
            title: "ADVERTISE ON GAANA",
            closeText: '',
            show: {
                effect: "blind",
                duration: 1000
            },
            create: function (event, ui) {
                $(event.target).parent().css('position', 'fixed');
            },
            position: {
                my: "center",
                at: "center",
                of: window,
                collision: "fit",
                using: function (pos) {
                    var topOffset = $(this).css(pos).offset().top;
                    $(this).css({
                        "top": "59px"
                    });
                }
            }
        });
    })
    $('body').delegate('#couponcode', 'click', function (e) {
        var res = coupon.checkcoupon().split('#');
        $('#resMsgCoupon').html(res[0]).css({
            display: "block"
        });
        if (res[1] != 'success') {
            $('#resMsgCoupon').addClass("ui-state-highlight");
            setTimeout(function () {
                $('#resMsgCoupon').removeClass("ui-state-highlight", 1200);
            }, 500);
        }
    });
    $('#outercontainer').on('click', '#feedback', function () {
        $('#popup').remove();
        feedback.openPopup();
        gAnalyticChannelClick('feedback', 'left', 'popup');
    });
    $('#outercontainer').on('click', '#supported-bbdevice', function () {
        $('#popup').remove();
        var template = $("#supported-bblist").html();
        $('#outercontainer').append('<div id="popup" >' + template + '</div>');
        $('#popup').dialog({
            autoOpen: true,
            width: 450,
            height: 344,
            modal: true,
            draggable: false,
            dialogClass: 'paddingtop',
            title: "Supported Devices List",
            closeText: '',
            show: {
                effect: "blind",
                duration: 1000
            },
            create: function (event, ui) {
                $(event.target).parent().css('position', 'fixed');
            },
            position: {
                my: "center",
                at: "center",
                of: window,
                collision: "fit",
                using: function (pos) {
                    var topOffset = $(this).css(pos).offset().top;
                    $(this).css({
                        "top": "59px"
                    });
                }
            }
        });
    });
    $('#outercontainer').on('click', '#supported-jdevice', function () {
        $('#popup').remove();
        var template = $("#supported-jlist").html();
        $('#outercontainer').append('<div id="popup" >' + template + '</div>');
        $('#popup').dialog({
            autoOpen: true,
            width: 550,
            height: 450,
            modal: true,
            draggable: false,
            dialogClass: 'paddingtop',
            title: "Supported Devices List",
            closeText: '',
            show: {
                effect: "blind",
                duration: 1000
            },
            create: function (event, ui) {
                $(event.target).parent().css('position', 'fixed');
            },
            position: {
                my: "center",
                at: "center",
                of: window,
                collision: "fit",
                using: function (pos) {
                    var topOffset = $(this).css(pos).offset().top;
                    $(this).css({
                        "top": "59px"
                    });
                }
            }
        });
    });
    $('.volumesettings').hover(function () {
        $('#volum').animate({
            top: '-130px'
        }, {
            duration: 800,
            easing: 'easeInOutSine',
            queue: false
        });
    }, function () {
        $('#volum').animate({
            top: '90px'
        }, {
            duration: 800,
            easing: 'easeInOutSine',
            queue: false
        });
    })
    $(document).on('click', function (event) {
        if ($(event.target).closest(".addedsonglist").get(0) == null) {
            $('.addedsonglist').hide();
            $('.songadded').removeClass('whitebg');
            $('.songcnt').addClass('white');
            $('#transparent').hide();
        }
        if ($(event.target).closest("#quality").get(0) == null) {
            $("#quality").hide()
        }
        if ($(event.target).closest(".cus_select").get(0) == null) {
            $('.cus_select').find('ul').hide();
            $('.cus_select').find('div.gaanaradio-bands').hide();
        }
        event.stopPropagation();
    });
    $('#outercontainer').on('click', '.songadded', function (e) {
        if ($('.addedsonglist').css('display') == 'none') {
            $('._share').css('display', 'none');
            $('._arrow').css('display', 'none');
            $('#wttodo').css('display', 'none');
            $('.bit_rate').css('display', 'none');
            $('.addedsonglist').css({
                height: '291px'
            });
            $('.addedsonglist').show()
            if ($.parseJSON(superCookie.getItem('queue')) == null) return;
            $(this).addClass('whitebg');
            $('.songcnt').removeClass('white');
            $('.addedsonglist').show();
            var template = $('#playerqueuetpl').html();
            template = template.replace("##ARTWORK##", '<img width="30px"  height="30px" src="{{albumartwork}}"/>');
            var filterQuedata = filterQueueData();
            var data = {
                queue: filterQuedata,
                scrollablelayerQueue: 'scrollablelayerQueue',
                'saveasplaylist': 'saveasplaylist',
                'clearqueue': 'clearqueue'
            };
            var result = Mustache.render(template, data);
            $('.scrollablelayerQueue').remove();
            $('.addedsonglist').html(result)
            var scrollpane = $('.scrollablelayerQueue').jScrollPane({
                verticalDragMinHeight: 20
            });
            showscrollerhover();
            if (_activeSongID == 0) return;
            var curid = _activeSongID
            if (isPlayingStatus) {
                $('#qsong' + curid).addClass('pause-song-queue');
            }
            $('.addedsonglist').unbind('click');
            $('.share').unbind('click');
            $('.share').bind('click', function (event) {
                try {
                    clickhandler(event.target, event);
                    event.stopPropagation();
                } catch (e) {}
                return;
            });
            $('.addedsonglist').bind('click', function (event) {
                try {
                    clickhandler(event.target);
                    event.stopPropagation();
                } catch (e) {}
            });
            $('.queueremove').removeQueue();
            e.stopPropagation();
        } else {
            $('.addedsonglist').hide()
        }
    })
    $('#outercontainer').on('click', '#transparent', function (e) {
        $('.player-control').hide();
        $('.songadded').removeClass('whitebg');
        $('.songcnt').css('color', '#ffffff');
        $('#transparent').hide();
        e.stopPropagation();
    })
    $('#mainPlayer').on('click', '.kbps_setting', function (e) {
        $(this).append($('#quality'));
        if ($('#quality').css('display') == 'none') {
            $('#quality').show();
            $('#settings_player').css('background-position', '-886px -341px');
        } else {
            $('#quality').hide();
            $('#settings_player').css('background-position', '-886px -82px');
        }
        e.stopPropagation();
    })
    $('#songquality').on('click', '.quality', function (e) {
        $('.quality').removeClass('activetab')
        $(this).addClass('activetab');
    });
}
var blockui = blockui || {};
blockui.init = function () {
    try {
        $('#blockui').remove();
        $("#loaderBox").remove();
        var blockWidth = ($(window).width() - 300) / 2;
        var blockHeight = ($(window).height()) / 2;
        var loaderIMG = STATIC_URL + "media/images/splash-loader.gif";
        var _loader = "<div class='' id='loaderimg' ><img align='center' valign='middle' src='" + loaderIMG + "'/></div>";
        var _UI = $("<div id='blockui' style='left:" + blockWidth + "px;top:" + blockHeight + "px'>" + _loader + "</div>");
        $('#outercontainer').append(_UI);
    } catch (e) {
        alert(e.message)
    }
}
blockui.remove = function () {
    try {
        $('#blockui').fadeOut(100, function () {
            $('#blockui').remove();
        });
        $("#loaderBox").remove();
        clearInterval(blockui.timer);
    } catch (e) {
        utility.errorLog(e.message, 'blockui.remove');
    }
}
utility.blockui = blockui || {}
utility.setchannelsPreRoll = function (channelId, ChannelName, roll, artistName) {
    if (typeof roll != 'undefined' && roll == 1) {} else return;
    var mod = (channelId % 100);
    var file_name = "mp3/sales/" + ChannelName + "/" + mod + "/" + channelId + "/" + channelId + "_pre";
    _variables.channelPreRoll = '{"artist":"' + artistName + '", "path":"' + file_name + '", "fileType":"rtmp"}';
    return _variables.channelPreRoll;
}
utility.resetchannelsPreRoll = function (channelId, ChannelName) {
    _variables.channelPreRoll = '';
    return _variables.channelPreRoll;
}
utility.hasChannelPreRoll = function () {
    return _variables.channelPreRoll;
}
utility.getUrl = function (title, id, seokey) {
    try {
        if (typeof seokey != 'undefined' && seokey != null && seokey != '') {
            if (seokey.length > 0) {
                return seokey;
            } else {
                return;
            }
        } else {
            var urlTitle = title;
            var finalTitle = '';
            if (typeof urlTitle != 'undefined' && urlTitle != '') {
                finalTitle = encodeURIComponent(urlTitle).replace(' ', '_');
            }
            urlTitle = ''
            finaltitle = (typeof finaltitle != 'undefined') ? finaltitle : '';
            id = (typeof id != 'undefined') ? id : '';
            var finalurl = [finaltitle, urlSeperator, id].join('');
            finaltitle = '';
            id = '';
            return finalurl;
        }
    } catch (e) {
        utility.errorLog(e.message, 'getUrl');
    }
}

function myTimesGetFriendsActivities() {
    $('#myTimesFriendsListeningContainer').html('')
    $('#myTimesFriendsListeningContainer').removeClass('mar20');
    $('#myTimesFriendsListeningContainer').append('<div id="loading">Loading...</div>');
    $.ajax({
        dataType: 'html',
        url: BASE_URL + 'ajax/myTimesActivities',
        data: {
            "task": 'get_my_friends_activities_grouped'
        },
        type: 'POST',
        async: true,
        success: function (data) {
            try {
                if (data != '') {
                    _countActivity++;
                }
                checkActivityFeed();
                $("#myTimesFriendsListeningContainer #loading").remove();
                $('#myTimesFriendsListeningContainer').append(data);
            } catch (e) {
                alert(e);
            }
        },
        error: function () {
            $("#myTimesFriendsListeningContainer #loading").remove();
        }
    });
}

function showMytimesData() {
    if ($('#myTimesMyRecentActivitiesContainer').length > 0) {
        setTimeout(function () {
            myTimesGetMyRecentActivities();
        }, 1000);
    }
}

function myTimesGetMyRecentActivities() {
    $('#myTimesMyRecentActivitiesContainer').html('')
    $('#myTimesMyRecentActivitiesContainer').removeClass('mar20');
    $('#myTimesMyRecentActivitiesContainer').append('<div id="loading">Loading...</div>');
    $.ajax({
        url: BASE_URL + 'ajax/myTimesActivities',
        data: {
            "task": 'get_my_activities'
        },
        type: 'POST',
        dataType: 'html',
        async: true,
        success: function (data) {
            try {
                if (data != '') {
                    _countActivity++;
                }
                myTimesGetFriendsActivities();
                $("#myTimesMyRecentActivitiesContainer #loading").remove();
                $('#myTimesMyRecentActivitiesContainer').append(data);
            } catch (e) {
                alert(e);
            }
        },
        error: function () {
            $("#myTimesMyRecentActivitiesContainer #loading").remove();
        }
    });
}

function checkValidFeilds(item, type) {
    var result = false;
    switch (type) {
        case 'my_friends_listening':
            if (typeof item.A_D_N === 'undefined') {
                result = false;
            } else {
                result = true;
            }
            break;
        case 'my_recent_activities':
            if (typeof item.A_D_N === 'undefined') {
                result = false;
            } else {
                result = true;
            }
            break;
    }
    return result;
}

function pushActivityOnMyTimes(type, data) {
    try {
        var uniqueAppID = "";
        var pushUrl = "";
        switch (type) {
            case 'toggle_follow':
                if (typeof data.actor_sso_id === 'undefined' || typeof data.target_sso_id === 'undefined') {
                    return;
                } else {
                    if (data.status == 0) {
                        pushUrl = MY_ITIMES_API_URL + 'followuser?fromMyTimes=true&isNotify=false&uuId=' + data.actor_sso_id + '&followedUid=' + data.target_sso_id;
                    } else if (data.status == 1) {
                        pushUrl = MY_ITIMES_API_URL + 'unfollowuser?fromMyTimes=true&isNotify=false&uuId=' + data.actor_sso_id + '&followedUid=' + data.target_sso_id;
                    }
                    $.ajax({
                        url: pushUrl,
                        dataType: 'jsonp',
                        success: function (jsonData) {
                            try {} catch (e) {
                                alert(e);
                            }
                        }
                    });
                }
                break;
            case 'unfavorite':
            case 'favorite':
                if (typeof data.id === 'undefined') {
                    return;
                } else {
                    var refresh_container = null;
                    if (data.object_type == requestDataSource.Artist) {
                        uniqueAppID = 'ar_' + data.id;
                    } else if (data.object_type == requestDataSource.Track) {
                        uniqueAppID = 's_' + data.id;
                        if (data.source == requestDataSource.GenreRadio || (data.source == requestDataSource.Playlist || $.trim(data.source) == 'playlist')) {
                            refresh_container = "topicFollowers_" + data.id;
                        }
                    } else if (data.object_type == requestDataSource.Album) {
                        uniqueAppID = 'al_' + data.id;
                    } else if (data.object_type == requestDataSource.Playlist || $.trim(data.object_type) == 'playlist') {
                        uniqueAppID = 'pl_' + data.id;
                    } else if (data.object_type == requestDataSource.GenreRadio) {
                        uniqueAppID = 'rl_' + data.id;
                    }
                    try {
                        var count = 1;
                        setTimeout(function () {
                            refreshTopicActivityFollowers(uniqueAppID, data.object_type, refresh_container);
                        }, 6000)
                    } catch (e) {
                        alert(e);
                    }
                }
                break;
        }
    } catch (e) {}
}

function refreshTopicActivityFollowers(uniqueAppID, object_type, container) {
    if (typeof container == 'undefined' || container == '' || container == null) {
        if (typeof object_type == 'undefined' || object_type == requestDataSource.Track) {
            return;
        } else {
            container = "topicFollowers";
        }
    }
    if ($('#' + container).length > 0) {
        if (object_type == requestDataSource.Playlist || $.trim(object_type) == 'playlist') {
            updateMyTimesActivityFollowers(uniqueAppID, container);
        } else {
            updateMyTimesTopicFollowers(uniqueAppID, container);
        }
    }
}
utility.onTotalScrollCallback = function () {
    if ($('#pageinfo').length > 0) {
        var lastSeenId = 0;
        if ($('#lastSeenId').length > 0) {
            lastSeenId = $('#lastSeenId').val();
        }
        var pageinfo = $('#pageinfo').val().split('~');
        var totalpages = pageinfo[0];
        var curpage = parseInt(pageinfo[1]);
        if (totalpages <= curpage) return false;
        url = window.location.href;
        if (url.indexOf('http://') != -1) {
            furl = url.split("/").slice(3).join('/')
        } else {}
        var blockWidth = ($(window).width() - 300) / 2;
        var blockHeight = ($(window).height()) / 2;
        $('div#lastPostsLoader').html('<img src="' + BASE_URL + 'images/bigLoader.gif">');
        $('#lastPostsLoader').css({
            left: blockWidth,
            top: blockHeight,
            display: 'block'
        });
        try {
            _variables.ajaxRequest.abort();
        } catch (e) {}
        _variables.ajaxRequest = $.ajax({
            url: BASE_URL + 'ajax/pager/' + furl,
            type: 'POST',
            data: {
                page: curpage + 1,
                lastSeenId: lastSeenId
            },
            success: function (jsonData) {
                try {
                    if (typeof jsonData != 'undefined' && jsonData != '') {
                        var responseParts = jsonData.split('~~~##~~~');
                        jsonData = responseParts[0];
                        var curLastSeenId = responseParts[1];
                        if (typeof curLastSeenId != 'undefined' && curLastSeenId != '') {
                            if (curLastSeenId != '-1') {
                                $('#lastSeenId').val(curLastSeenId);
                                $('#pageinfo').val(curLastSeenId + 1 + '~' + (curLastSeenId));
                            } else {
                                $('#pageinfo').val(lastSeenId + '~' + lastSeenId);
                            }
                        } else {
                            $('#pageinfo').val(totalpages + '~' + (curpage + 1));
                        }
                        $('.content-container').append(jsonData);
                        for (sources in _variables['source']) {
                            delete _variables['source'][sources];
                        }
                    }
                    $('.add-playlist').AddEvent();
                    $(".add-playlist").on('click', function (e) {
                        e.stopPropagation();
                    });
                    if (window.navigator.userAgent.indexOf('MSIE 8.0') > 0) {
                        $(window).screen1600();
                        $(window).screen1400();
                    }
                    $('img').hover(function () {
                        $(this).closest('.hover-class').find('.play-song-small').css('top', ($(this).closest('.hover-class').height() - $(this).closest('.hover-class').find('.play-song-small').height()) / 2);
                    })
                    $('.sngandalbum a').click(function (e) {
                        e.preventDefault();
                    })
                    $('div#lastPostsLoader').empty().hide();
                    editPlaylist();
                    loaddefaultimage();
                    paiduser();
                } catch (e) {
                    alert(e);
                }
            }
        });
    }
}
utility.selectLanguage = function () {
    var template = $('#selectlanguage').html();
    var list = {
        languagelist: utility.selectlanguage()
    }
    $('#popup').remove();
    var result = Mustache.render(template, list);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        draggable: false,
        width: 420,
        modal: true,
        dialogClass: 'paddingtop',
        draggable: false,
        title: "Choose preferred languages",
        closeText: '',
        show: {
            effect: "blind",
            duration: 1000
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "42px"
                });
            }
        },
        open: function () {
            $('.languageSelector').each(function (index) {
                $(this).on('click', function () {
                    $('.languageSelector').find('.custom_chk').removeClass('pos');
                    $(this).find('.custom_chk').addClass('pos');
                    var obj = list.languagelist[index - 1];
                    var lang = obj.name;
                    try {
                        $.ajax({
                            url: BASE_URL + 'ajax/language',
                            data: {
                                task: 'set_language',
                                language: lang
                            },
                            type: 'post',
                            cache: false,
                            dataType: 'html',
                            success: function (msg) {
                                if ($.trim(msg) == 'success') {
                                    var url = window.location.href;
                                    ajaxPageRequestHandler.invoke({
                                        url: url,
                                        'container': 'main_middle_content'
                                    });
                                    if (obj.name == 'All') {
                                        $("#language").html('All Languages');
                                    } else {
                                        $("#language").html(obj.name);
                                    }
                                }
                            },
                            error: function () {}
                        });
                    } catch (e) {
                        alert(e.message)
                    }
                })
            })
        }
    });
}
utility.selectlanguage = function () {
    var languagelist = "";
    $.ajax({
        url: BASE_URL + "ajax/language",
        async: false,
        data: {
            task: 'get_language'
        },
        method: "post",
        dataType: "json",
        success: function (data) {
            languagelist = data;
        }
    })
    return languagelist;
}

function getSortUrl(val) {
    try {
        var sortBy = '';
        var requestUri = location.pathname;
        var uriArr = requestUri.split('sortby');
        var urlPrefix = uriArr[0].substr(-1) == '/' ? uriArr[0].substr(0, (uriArr[0].length - 1)) : uriArr[0];
        sortBy = 'sortby/' + val;
        var url = urlPrefix + '/' + sortBy;
    } catch (e) {
        alert(e);
    }
    return url;
}
_variables.remote = null, _variables._soundAndUI = null, _variables._sound = null, _variables._ui = null;
utility._initSingAlong = function (karaokeurl, token) {
    var REMOTE = karaokeurl;
    _variables.remote = new RemotePlayer({
        remoteAddress: REMOTE,
        remoteFile: token,
        container: "divKaraokeGarage",
        onReady: onReady,
        sound: _variables._sound,
        ui: _variables._ui
    });

    function onReady() {
        $("#divKaraokeGarage_loader").hide();
    }
}
utility.loadSingAlong = function (data) {
    $.getScript(CSSJS_URL + 'js/easyXDM/easyXDM.min.js', function () {
        loadJsPlayer(null)
        singalongurl = data.url;
        token = data.token;
        _userInfo.name = data.name;
        _userInfo.regMode = data.regmode;
        _userInfo.id = data.id;
        _userInfo.email = data.email;
        _userInfo.fbid = data.fbid;
        if (typeof gaanaMaster == 'undefined') {
            uiController = new UIController();
            gaanaMaster = new GaanaMaster({
                autoPlay: true,
                data: null
            });
        }
        _variables._soundAndUI = gaanaMaster.getSoundAndUI();
        _variables._sound = _variables._soundAndUI.sound;
        _variables._ui = uiController
        if (window.location.href.indexOf('singalong') == -1) {
            return;
        }
        $("#divKaraokeGarage_loader").show();
        var remoteHandler = TMUrl + "js/jsPlayer/remotePlayer.js";
        $.getScript(remoteHandler, function () {
            if (_variables._sound.isReady) {
                utility._initSingAlong(singalongurl, token);
            } else {
                _variables._sound.onReady(function () {
                    utility._initSingAlong(singalongurl, token);
                });
            };
        })
    })
    if (window.location.href.indexOf('singalong') == -1) {
        $('#mainarea').css('margin-right', '304px');
        $('.advertisement').show();
    } else {
        $('#mainarea').css('margin-right', '0');
        $('.advertisement').css('display', 'none');
    }
    setTimeout(function () {
        var w = $("#divKaraokeGarage").width() + $(".middWrapperV1 td.right").width();
        $("#divKaraokeGarage").css({
            width: w + 'px'
        });
    }, 500)
}
utility.search_on_enter_hit = function () {
    try {
        var keywordsearch = $.trim($('#searchbox').val());
        var searchKeyText = 'search for music'
        if ((keywordsearch == '') || (keywordsearch == searchKeyText)) {
            $('#searchbox').val('');
            $('#searchbox').blur();
            return false;
        }
        $('#searchbox').val('');
        $('#searchbox').blur();
        url = '/search/songs/' + encodeURIComponent(keywordsearch);
        gAnalyticChannelClick("SRP", url, "Search Keyword - " + keywordsearch);
        ajaxPageRequestHandler.invoke({
            url: url,
            'container': 'main_middle_content'
        });
    } catch (e) {
        alert(e.message)
        utility.errorLog(e.message, 'executeSearch');
    }
}

function searchSong() {
    try {
        var keywordsearch = $.trim($('.searchSong').val());
        var searchKeyText = 'search for music'
        if ((keywordsearch == '') || (keywordsearch == searchKeyText)) {
            $('.searchSong').val('');
            $('.searchSong').blur();
            return false;
        }
        $('.searchSong').val('');
        $('.searchSong').blur();
        url = '/search/songs/' + encodeURIComponent(keywordsearch);
        ajaxPageRequestHandler.invoke({
            url: url,
            'container': 'main_middle_content'
        });
    } catch (e) {
        utility.errorLog(e.message, 'executeSearch');
    }
}

function updateTips(t) {
    tips = $(".validateTips").text(t)
}

function checkLength(o, n, min, max, message) {
    if (o.val().length > max || o.val().length < min) {
        o.addClass("ui-state-error");
        o.focus();
        if (typeof message === "undefined") {
            updateTips("Length of " + n + " must be between " + min + " and " + max + ".");
        } else {
            updateTips(message);
        }
        return false;
    } else {
        return true;
    }
}

function checkRequired(o, n, d) {
    if ($.trim(o.val()) == '' || o.val() == d) {
        o.addClass("ui-state-error");
        o.val('');
        o.focus();
        updateTips(n);
        return false;
    } else {
        return true;
    }
}

function checkRequiredDob(o, n, d) {
    if (o.val() == '' || o.val() == d) {
        o.addClass("ui-state-error");
        updateTips(n);
        return false;
    } else {
        return true;
    }
}

function isChecked(o, n, d) {
    if (!$(o).is(":checked")) {
        updateTips(n);
        return false;
    } else {
        return true;
    }
}

function checkRegexp(o, regexp, n) {
    if (!(regexp.test(o.val()))) {
        o.addClass("ui-state-error");
        o.focus();
        updateTips(n);
        return false;
    } else {
        return true;
    }
}

function isTwoFieldsAreEqual(f1, f2) {
    if ($.trim(f1.val()) == $.trim(f2.val())) {
        return true;
    }
    f2.addClass("ui-state-error");
    return false;
}
utility.validateName = function (e, source, target, userid) {
    try {
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
        $(source).siblings('.signuperror').remove();
        var patternAllowed = new RegExp("[a-zA-Z0-9 \.\;\:\#\$\'\@]", "gi");
        if (KeyID == 0) {
            KeyID = e.which;
        }
        var KeyEntered = String.fromCharCode(KeyID)
        var actionkeys = false;
        var IsBlocked = false;
        if (KeyID == 8 || KeyID == 46 || KeyID == 9 || KeyID == 39 || KeyID == 36 || KeyID == 35) {
            actionkeys = true;
        }
        if (KeyID == 94 || KeyID == 61) {
            IsBlocked = true;
        }
        var MatchChar = KeyEntered.match(patternAllowed);
        if ((!MatchChar && actionkeys == false) || IsBlocked) {
            return false;
        }
    } catch (e) {
        errorLog(e.message, 'validateName');
    }
}
utility.postOnFacebook = function (obj) {
    var silent_mood = readCookie('silent_mood');
    if (typeof silent_mood != 'undefined' && silent_mood == '1') {
        return;
    }
    if (typeof jsuserdata.silentmode != 'undefined' && jsuserdata.silentmode == '1') {
        return;
    }
    if (typeof jsuserdata.userFbPrivacy != 'undefined' && jsuserdata.userFbPrivacy == '1') {
        return;
    }
    var loginStatus = login.checklogin();
    try {
        if (typeof obj.url != 'undefined' && obj.url != '') {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    utility.callFBapi(obj, loginStatus)
                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;
                } else if (response.status === 'not_authorized') {
                    utility.fbPermission(obj, loginStatus);
                } else {
                    utility._fbLogin(obj, loginStatus);
                }
            }, true);
        }
    } catch (e) {}
}
utility.fbPermission = function (obj, loginStatus) {
    if (typeof readCookie('fbpopup_check') != 'undefined' && readCookie('fbpopup_check') == 3) {
        return;
    }
    messagebox.fbTimeLine(obj, loginStatus);
}
utility.callFBapi = function (obj, loginStatus) {
    switch (obj.obj) {
        case 'song':
            posturl = {
                song: obj.url
            };
            break;
        case 'radio_station':
            posturl = {
                radio_station: obj.url
            };
            break;
        case 'gaana_song':
            posturl = {
                gaana_song: obj.url
            };
            break;
        case 'gaana_album':
            posturl = {
                gaana_album: obj.url
            };
            break;
        case 'gaana_artist':
            posturl = {
                gaana_artist: obj.url
            };
            break;
        case 'gaana_playlist':
            posturl = {
                playlist: obj.url
            };
            break;
        case 'music.playlist':
            posturl = {
                playlist: obj.url
            };
            break;
        case 'create':
            break;
    }
    var objtype = obj.obj;
    FB.api('me/' + obj.action, 'post', posturl, function (response) {
        if (typeof response.error != 'undefined' && typeof response.error.code != 'undefined' && (response.error.code == 190 || response.error.code == 102 || response.error.code == 10 || (response.error.code >= 200 && response.error.code <= 299))) {
            utility.fbPermission(obj, loginStatus);
        }
    });
}
utility._fbLogin = function (obj, loginStatus) {
    if (typeof readCookie('fbpopup_check') != 'undefined' && readCookie('fbpopup_check') == 3) {
        return;
    }
    messagebox.fbTimeLine(obj, loginStatus);
}
utility.playSongFromServer = function (data) {
    $('.hotbox').animate({
        bottom: '0px'
    }, {
        duration: 500
    });
    var cls = setInterval(function () {
        if (flashLoaded) {
            $('#trackrow' + data.ids).find('.play_pause').trigger('click');
            clearInterval(cls)
        }
    }, 1000)
}

function slideGallery(direction, slider, speed, width, index) {
    try {
        var current_index = 0;
        if (typeof superCookie.getItem('genre_radio_song_index') == 'undefined') {
            current_index = 0;
        }
        current_index = superCookie.getItem('genre_radio_song_index');
        if (direction == 'right') {
            dir = index * 550;
            $('.' + slider).animate({
                right: dir
            }, {
                duration: speed
            });
        } else if (direction == 'left' && dir > 0) {
            dir = dir - 550;
            $('.' + slider).animate({
                right: dir
            }, {
                duration: speed
            });
        }
        if (dir == 0) {
            $('.left_slide_radio').css('visibility', 'hidden');
            $('.right_slide_radio').css('visibility', 'visible');
        } else if (parseInt(current_index) + 1 == index) {
            $('.right_slide_radio').css('visibility', 'visible');
            $('.left_slide_radio').css('visibility', 'visible');
        } else {
            $('.left_slide_radio').css('visibility', 'visible');
            $('.right_slide_radio').css('visibility', 'visible');
        }
        if (dir == $('.' + slider).width()) {
            dir = 0;
            $('.' + slider).animate({
                right: dir
            }, {
                duration: speed
            });
        }
        setTimeout(dfpAdSlots, 2000);
    } catch (e) {
        alert(e.message);
    }
}

function showLikersFollowersSummary() {
    if ($('#myZoneFollowingContainer').length > 0 || $('#myZoneFollowersContainer').length > 0) {
        getMyTimesFollowingFollowers('get_user_following', 'myZoneFollowingContainer');
        getMyTimesFollowingFollowers('get_user_followers', 'myZoneFollowersContainer');
    }
    if ($('#yourZoneFollowingContainer').length > 0 || $('#yourZoneFollowersCountContainer').length > 0) {
        getMyTimesFollowingFollowers('get_user_following_yourzone', 'yourZoneFollowingContainer');
        getMyTimesFollowingFollowers('get_user_followers_count', 'yourZoneFollowersCountContainer');
    }
    if ($('#topicFollowers').length > 0) {
        var topicId = $('#topicId').val();
        var topicIdArr = topicId.split("_");
        if (topicIdArr[0] == "pl") {
            updateMyTimesActivityFollowers(topicId, 'topicFollowers');
        } else {
            updateMyTimesTopicFollowers(topicId, 'topicFollowers');
        }
    }
}

function getMyTimesFollowingFollowers(type, container) {
    var target_user_id = $("#target_user_id").val();
    if (isNaN(target_user_id)) {
        target_user_id = '0';
    }
    if (container == 'yourZoneFollowersCountContainer') {
        $('#' + container).html('<span class="f_load">Loading...</span>');
    } else {
        $('#' + container).append('<div id="loading">Loading...</div>');
    }
    $.ajax({
        url: BASE_URL + 'ajax/myTimesActivities',
        data: {
            "task": type,
            "target_user_id": target_user_id
        },
        type: 'POST',
        dataType: 'html',
        success: function (data) {
            try {
                $('#' + container + ' #loading').remove();
                $('#' + container).html(data);
            } catch (e) {
                alert(e);
            }
        },
        error: function () {
            $('#' + container + ' #loading').remove();
        }
    });
}

function updateMyTimesTopicFollowers(topic_id, container) {
    if ($('#' + container).length < 1) {
        return;
    }
    $.ajax({
        url: BASE_URL + 'ajax/myTimesActivities',
        data: {
            "task": 'get_topic_followers',
            "topic_id": topic_id
        },
        type: 'POST',
        dataType: 'html',
        success: function (data) {
            try {
                $('#' + container).html(data);
            } catch (e) {
                alert(e);
            }
        },
        error: function () {}
    });
}

function updateMyTimesActivityFollowers(object_id, container) {
    $.ajax({
        url: BASE_URL + 'ajax/myTimesActivities/',
        data: {
            "task": 'get_activity_follower',
            "object_id": object_id
        },
        type: 'POST',
        dataType: 'html',
        success: function (data) {
            try {
                $('#' + container).html(data);
            } catch (e) {
                alert(e);
            }
        },
        error: function () {}
    });
}

function checkActivityFeed() {
    if ($(window).width() < 1540) {
        if (_countActivity > 1) {
            $('#_topartist').hide();
        } else {
            $('#_topartist').show();
        }
        _countActivity = 0;
    } else {
        $('#_topartist').show();
    }
}
$('body').delegate('#deactivateProf', 'click', function () {
    messagebox.deactivateProfile();
});
var notify = {}
notify.openPopUp = function () {
    var template = $('#smsMarketingCheck').html();
    var formobj = {
        'mobileNo': 'smsMobileNo',
        'submit-sms': 'submitSMS'
    }
    var result = Mustache.render(template, formobj);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        width: 400,
        modal: true,
        dialogClass: 'paddingtop',
        title: "Get Gaana on your mobile",
        closeText: '',
        show: {
            effect: "blind",
            duration: 1000
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "59px"
                });
            }
        }
    });
}
notify.openPopUpTopSongs = function () {
    gAnalyticChannelClick('Campaign', 'TopGaana2013', 'popupOpen');
    var template = $('#topgaana2013').html();
    var formobj = {}
    var result = Mustache.render(template, formobj);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        width: 400,
        modal: true,
        dialogClass: 'topsongs',
        title: "Top Gaana 2013 Contest",
        closeText: '',
        show: {
            effect: "blind",
            duration: 1000
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "59px"
                });
            }
        }
    });
}

function playGenreRadio(genreRadioListObj, genreInfoObj) {
    try {
        var genreRadioListObject = JSON.parse(genreRadioListObj);
        var genreInfoObject = JSON.parse(genreInfoObj);
        var genre_radio_url = _now_playing_url_check
        _now_playing_url = genreInfoObject.genre_radio_url;
        _genre_radio_title = html_entity_decode(genreInfoObject.genre_radio_title);
        var pmode;
        if (typeof gaanaMaster != 'undefined') {
            pmode = gaanaMaster.getMode();
        }
        if (typeof genre_radio_url != 'undefined' && genre_radio_url != null && genre_radio_url != 0 && genre_radio_url == _now_playing_url && pmode == 'genreRadio') {
            Layout.setgenreRadioSongCards();
        } else {
            _now_playing_url_check = _now_playing_url;
            $('#genreradiobtn').trigger('click');
            _now_playing_check = true;
            _genre_radio_title_array = genreRadioListObject;
        }
    } catch (e) {}
}

function nowPlaying(genreInfoObj, genreRadioListObj) {
    if (typeof genreRadioListObj != 'undefined') {
        var genreRadioListObject = JSON.parse(genreRadioListObj);
    }
    var genreInfoObject = JSON.parse(genreInfoObj);
    var now_playing_url = genreInfoObject.now_playing_url;
    _genre_radio_title = genreInfoObject.now_playing_title;
    if (!_now_playing_check || _now_playing_url.indexOf(now_playing_url) == '-1') {
        $('#genreradiobtn').trigger('click');
        _playlist_similar_song = true;
        if (typeof genreRadioListObject != 'undefined') {
            _genre_radio_title_array = genreRadioListObject;
        }
    } else {
        _now_playing_url = now_playing_url;
        _playlist_similar_song = true;
        Layout.setNowPlayingSongCard();
    }
}

function myTimesInAppNotifications() {
    if (typeof jsuserdata.user_id == 'undefined' || jsuserdata.user_id == null || jsuserdata.user_id == "") {
        return;
    }
    $.ajax({
        dataType: 'json',
        url: BASE_URL + 'ajax/myTimesActivities',
        data: {
            "task": 'get_in_app_notifications'
        },
        type: 'POST',
        async: true,
        success: function (data) {
            try {
                $("#inAppNotificationsContainer #loading").remove();
                $('#inAppNotificationsContainer').html(data.notifications);
                if (typeof data.status == 'undefined' && data.status != 1) {
                    return;
                }
                if (typeof data.freshNotificationsCount != 'undefined' && data.freshNotificationsCount > 0) {
                    freshNotificationsCount = data.freshNotificationsCount;
                    $('#count_notification').html(freshNotificationsCount);
                }
                $('.notification-right').css('height', $('.notification-right .notification-blk').length * $('.notification-right .notification-blk').outerHeight())
                if ($('.notification-right').height() > 250) {
                    $('.notification-right').css('height', '250px');
                }
                if ($('.notification-right .notification-blk').length <= 0) {
                    $('.notification-right').css('height', '35px');
                }
            } catch (e) {
                alert(e);
            }
        },
        error: function () {
            $("#inAppNotificationsContainer #loading").remove();
        }
    });
}

function updateLastNotificationId() {
    var lastNotificationId = $("#lastNotificationId").val();
    $.ajax({
        dataType: 'json',
        url: BASE_URL + 'ajax/myTimesActivities',
        data: {
            "task": 'update_last_notification_id',
            "lastNotificationId": lastNotificationId
        },
        type: 'POST',
        async: true,
        success: function (data) {},
        error: function () {}
    });
}

function showNowPlaying(source_url, source_artwork, type) {
    if (typeof source_url == 'undefined' || source_url == null || source_url == '') {
        return;
    }
    var check_seoKey = source_url.split("/");
    if ($('#minimize img').length == 0) {
        $('#nw_popup').html('<a href="javascript:void(0)" id="minimize" class="mini_btn"><img src="http://static.gaana.com/images/arrow_rt.jpg" class="_arw_now"/></a><a href="#" class="_goto pjax"><div id="pop_msg">Click here to go to <br/>current <strong>Radio</strong></div><div class="song_img"><span><img src="http://static.gaana.com/images/nwplay_text.jpg" width="12" height="60" alt="" /></span><span id="source_image"><img src="http://static.gaana.com/images/nwplay_pop.jpg" width="60" height="60" alt="" /></span></div> </a>')
    }
    if ((location.href.indexOf(check_seoKey[2]) != -1 && check_seoKey[2].indexOf('nowplaying') == -1) || location.href.indexOf(check_seoKey[3]) != -1) {
        $('#nw_popup').animate({
            bottom: '-70px'
        }, 200);
    } else {
        if (_nowplaying_start_up) {
            $('#nw_popup').animate({
                bottom: '-70px'
            }, 200);
        } else {
            $('#nw_popup').animate({
                bottom: '70px'
            }, 200);
        }
    }
    $('#source_image').html(['<img src="', source_artwork, '" width="60" height="60" />'].join(''));
    $('#nw_popup ._goto strong').html(type);
    $('#nw_popup ._goto').attr('href', source_url);
    $('body').on('click', '#minimize', function (e) {
        e.stopPropagation();
        if ($('#nw_popup').css('right') >= '0px') {
            $('#nw_popup').animate({
                right: '-209px'
            }, {
                duration: 500,
                easing: 'easeInOutSine'
            })
            $('#minimize img').attr('src', TMUrl + 'images/arrow_lt.jpg');
        } else {
            $('#nw_popup').animate({
                right: '0px'
            }, {
                duration: 500,
                easing: 'easeInOutSine'
            })
            $('#minimize img').attr('src', STATIC_URL + 'images/arrow_rt.jpg');
        }
    });
    $('body').on('click', '#nw_popup', function () {});
}

function hideNowPlaying() {
    $('#nw_popup').animate({
        bottom: '-70px'
    }, 200)
}

function minimize_nw() {
    $('#nw_popup').animate({
        right: '-209px'
    }, {
        duration: 500,
        easing: 'easeInOutSine'
    });
    $('#minimize img').attr('src', TMUrl + 'images/arrow_lt.jpg');
}

function showNowPlayingPopUp() {
    if (_now_playing_check) {
        if (typeof _now_playing_url == 'undefined' || _now_playing_url == null || _now_playing_url == '') {
            _now_playing_check = false;
            hideNowPlaying();
            return;
        }
        var check_seoKey = _now_playing_url.split("/");
        var pmode = gaanaMaster.getMode();
        if (typeof pmode != 'undefined' && pmode == 'radio') {
            _now_playing_check = false;
            hideNowPlaying();
        }
        if ((location.href.indexOf(check_seoKey[2]) != -1 && check_seoKey[2].indexOf('playlist') == -1) || location.href.indexOf(check_seoKey[3]) != -1) {
            hideNowPlaying();
            return;
        } else {
            $('#nw_popup').animate({
                bottom: '70px'
            }, 200);
            setTimeout("minimize_nw()", 23000);
        }
    } else {
        _now_playing_check = false;
        hideNowPlaying();
    }
}

function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

function paiduser() {
    if (isGaanaPaidUserCheck()) {
        $('.cust_carl ul li').css('width', ($('.cust_carl').width() / 7 + 2));
        $('.advertisement').css('display', 'none');
        $('#mainarea').addClass('pd_user');
        $('.artwork_list ul li.list').addClass('paiduserartwork_wdt');
        $('#Gaana-Section-Cubical_Ads').addClass('_none');
        $('.b-plist .featured').addClass('paidfeatured');
        $('.act-main-block').addClass('paid_fndactivity');
        $('.video_ico').css({
            display: 'block'
        })
    } else {
        $('.cust_carl ul li').css('width', ($('.cust_carl').width() / 6 + 2));
        $('.advertisement').css('display', 'block');
        $('#mainarea').removeClass('pd_user');
        $('.artwork_list ul li.list').removeClass('paiduserartwork_wdt');
        $('#Gaana-Section-Cubical_Ads').removeClass('_none');
        $('.b-plist .featured').removeClass('paidfeatured');
        $('.act-main-block').removeClass('paid_fndactivity');
        $('.video_ico').css({
            display: 'block'
        })
    }
}

function checkSessionAndExecute(cbJS, type, data, check_consuption) {
    loginCallback = cbJS;
    utility.blockui.init();
    if (_userLoginStatus == true) {
        utility.blockui.remove();
        for (vname in loginCallback['cbOBJ']) {
            eval('var ' + vname + '=loginCallback["cbOBJ"]["' + vname + '"]');
        }
        eval(loginCallback['CBJS']);
        loginCallback = {};
        return false;
    } else {
        var login_check = login.checklogin(true);
        if (login_check == '1') {
            utility.blockui.remove();
            _userLoginStatus = true;
            for (vname in loginCallback['cbOBJ']) {
                eval('var ' + vname + '=loginCallback["cbOBJ"]["' + vname + '"]');
            }
            eval(loginCallback['CBJS']);
            loginCallback = {};
        } else {
            if (typeof type == 'undefined') {
                utility.blockui.remove();
                console.log(typeof loginCallback['CBRP'] + loginCallback['CBRP']);
                if (typeof loginCallback['CBRP'] != 'undefined') {
                    eval(loginCallback['CBRP']);
                    return;
                }
                return false;
            }
            if (typeof data != 'undefined' && data != '' && data != null) {
                var source_key = data.object_type;
                var title = data.title;
                if (isNaN(source_key)) {
                    source_key = data.objtype;
                }
                var category = getKey(source_key, requestDataSource);
                var raw_msg = null;
                category = category.toLowerCase();
            } else {}
            type = type.toLowerCase();
            switch (type) {
                case 'favorite':
                    if (category == 'track' || category == 'album' || category == 'artist') {
                        data.action = 'get_favorite_count';
                        $.ajax({
                            url: BASE_URL + 'ajax/favorite',
                            data: data,
                            type: 'POST',
                            success: function (result_msg) {
                                utility.blockui.remove();
                                delete data.action;
                                raw_msg = message['signup_favorite_' + category];
                                if (result_msg != null) {
                                    if (typeof check_consuption != 'undefined' && check_consuption == 'show_artist_favorite') {
                                        registration.openPopup(null, null, null, 'show_artist_favorite');
                                        registration.showArtistFavorite(data, result_msg);
                                    } else if (typeof check_consuption != 'undefined' || check_consuption != null) {
                                        registration.openPopup(null, null, null, 'show_song_favorite');
                                        registration.showSongFavorite(data, result_msg);
                                    } else {
                                        if (result_msg == '0') {
                                            raw_msg = message['signup_favorite_' + category + '1'];
                                        }
                                        var msg = messagebox.message(raw_msg, title, result_msg);
                                        registration.openPopup('regSkipPromt', msg);
                                    }
                                } else {
                                    registration.openPopup();
                                }
                            },
                            error: function () {
                                utility.blockui.remove();
                            }
                        });
                    } else {
                        utility.blockui.remove();
                        raw_msg = message['signup_favorite_' + category];
                        if (raw_msg != null) {
                            var msg = messagebox.message(raw_msg, title);
                            registration.openPopup('regSkipPromt', msg);
                        } else {
                            registration.openPopup();
                        }
                    }
                    break;
                case 'addtoplaylist':
                    utility.blockui.remove();
                    raw_msg = message['addtoplaylist_' + category];
                    if (raw_msg != null) {
                        var msg = messagebox.message(raw_msg, title);
                        registration.openPopup('regSkipPromt', msg);
                    } else {
                        registration.openPopup();
                    }
                    break;
                case 'createplaylist':
                    utility.blockui.remove();
                    raw_msg = message['createplaylist_signup'];
                    if (raw_msg != null) {
                        var msg = messagebox.message(raw_msg, title);
                        registration.openPopup('regSkipPromt', msg);
                    } else {
                        registration.openPopup();
                    }
                    break;
                case 'share':
                    utility.blockui.remove();
                    raw_msg = message['signup_share_' + category];
                    if (raw_msg != null) {
                        var msg = messagebox.message(raw_msg, title);
                        registration.openPopup('regSkipPromt', msg);
                    } else {
                        registration.openPopup();
                    }
                    break;
                default:
                    registration.openPopup();
                    break;
            }
            if (typeof loginCallback['CBRP'] != 'undefined' && typeof loginCallback['CBRP'] == 'function') {
                eval(loginCallback['CBRP']);
            }
        }
    }
}

function loginCallBack() {
    if (loginCallback != '') {
        for (vname in loginCallback['cbOBJ']) {
            eval('var ' + vname + '=loginCallback["cbOBJ"]["' + vname + '"]');
        }
        eval(loginCallback['CBJS']);
        loginCallback = {};
    }
}
utility.addToFavorite = function () {
    try {
        var action_type = $(utility.targetObj).attr('data-type');
        var targetObj = '#' + $(utility.targetObj).attr('id');
        var parentrowobj = utility.parentrowobj;
        var row = utility.row;
        utility.targetObj = null;
        utility.row = null;
        utility.parentrowobj = null;
        $.ajax({
            url: BASE_URL + "ajax/favorite",
            data: row,
            type: 'post',
            success: function (data) {
                title = (row.status == 1) ? 'Add to favorites' : 'Remove from favorites';
                var source = row.source;
                var category = getKey(source, requestDataSource);
                var favorited_type = getKey(row.object_type, requestDataSource);
                var label = row.title;
                if (row.source == '14') {
                    category = 'GaanaRadios';
                    if (typeof _genre_radio_title_array != 'undefined') {
                        $.each(_genre_radio_title_array, function (key, gaana_radio_info) {
                            if (gaana_radio_info.id == row.source_id) {
                                label = gaana_radio_info.title;
                            }
                        });
                    }
                }
                $(targetObj).attr("title", title);
                if (data != '' && $.trim(data) != "null") {
                    if (data == 'success') {
                        if (row.source == '20') {
                            if ($(targetObj).text() == 'Follow') {
                                gAnalyticChannelClick('Login-Register', 'Follow', 'Artist');
                                $(targetObj).html('Following');
                                $(targetObj).attr('onclick', '');
                                $(targetObj).attr('data-type', '');
                            }
                        } else {
                            var song_title = row.title;
                            var show_message = messagebox.message(message['favorated'], song_title);
                            messagebox.open({
                                msg: show_message,
                                autoclose: true
                            });
                        }
                        if (action_type == 'favp') {
                            $('#trackrow' + row['id']).find('.favunfav').removeClass('favorite').addClass('unfavorite');
                            $('#trackrow' + row['id']).find('.favunfav').attr('title', 'Remove from favorites')
                        }
                        if (row.id == _activeSongID) {
                            $('#mainPlayer #favorite').hide();
                        }
                        gAnalyticChannelClick(category, "Favorited-" + favorited_type, label);
                        pushActivityOnMyTimes('favorite', row);
                        row.status = '1';
                        if (row.source == '14') {
                            if ($(".gaanaradio-" + row['id']).length > 0) {
                                $(".gaanaradio-" + row['id']).removeClass('favorite').addClass('unfavorite');
                                $(".parent-gaanaradio-" + row['id']).html($.toJSON(row));
                            } else {
                                if ($(targetObj).is('a') || $(targetObj).parent().is('a')) {
                                    if ($(targetObj).is('a')) {
                                        var target_id = $(targetObj).attr('id');
                                    } else {
                                        var target_id = $(targetObj).parent().attr('id');
                                    }
                                    if (typeof target_id != 'undefined' && (target_id != null || target_id != '')) {
                                        $('#' + target_id).addClass('displaynone');
                                        $('#fd').removeClass('button-lightgrey').addClass('button-red');
                                    }
                                } else {
                                    $(targetObj).removeClass('favorite').addClass('unfavorite');
                                }
                            }
                        } else if (row.source == '20') {
                            $('#' + parentrowobj.attr('id')).html($.toJSON(row));
                            $(targetObj).removeClass('favorite').css('cursor', 'default');
                            $(targetObj).addClass('follow_active');
                        } else {
                            $('#' + parentrowobj.attr('id')).html($.toJSON(row));
                            if (action_type == 'favp') {} else {
                                if ($(targetObj).is('a') || $(targetObj).parent().is('a')) {
                                    if ($(targetObj).is('a')) {
                                        var target_id = $(targetObj).attr('id');
                                    } else {
                                        var target_id = $(targetObj).parent().attr('id');
                                    }
                                    if (typeof target_id != 'undefined' && (target_id != null || target_id != '')) {
                                        $('#' + target_id).addClass('displaynone');
                                        $('#fd').removeClass('button-lightgrey').addClass('button-red');
                                    }
                                } else {
                                    $(targetObj).removeClass('favorite').addClass('unfavorite');
                                }
                            }
                        }
                    } else if (data == 'removed') {
                        gAnalyticChannelClick(category, "Un Favorited" + favorited_type, label);
                        pushActivityOnMyTimes('unfavorite', row);
                        if ($("#my_favorite_item_row_" + row.id).length > 0) {
                            $("#my_favorite_item_row_" + row.id).remove();
                        }
                        row.status = '0';
                        if (row.source == '20') {
                            if ($(targetObj).text() == 'Follow') {
                                gAnalyticChannelClick('Login-Register', 'Follow', 'Artist');
                                $(targetObj).html('Following');
                                $(targetObj).attr('onclick', '');
                                $(targetObj).attr('data-type', '');
                                $(targetObj).removeClass('favorite').css('cursor', 'default');
                                $(targetObj).addClass('follow_active');
                            }
                        } else {
                            if (row.source == '14') {
                                if ($(".gaanaradio-" + row['id']).length > 0) {
                                    $(".gaanaradio-" + row['id']).removeClass('unfavorite').addClass('favorite');
                                    $(".parent-gaanaradio-" + row['id']).html($.toJSON(row));
                                    $("#radiomirchi_home .parentmyfav-gaanaradio-" + row['id']).remove();
                                    if ($('#radiomirchi_home').children().length == 0) {
                                        $('.radiomirchi_home').remove()
                                    }
                                } else {
                                    $('#' + parentrowobj.attr('id')).html($.toJSON(row));
                                    $(targetObj).removeClass('unfavorite').addClass('favorite');
                                }
                            } else {
                                $('#' + parentrowobj.attr('id')).html($.toJSON(row));
                                $(targetObj).removeClass('unfavorite').addClass('favorite');
                            }
                            var song_title = row.title;
                            var show_message = messagebox.message(message['unfavorated'], song_title);
                            messagebox.open({
                                msg: show_message,
                                autoclose: true
                            });
                        }
                        if (action_type == 'favp') {
                            $('#trackrow' + row['id']).find('.favunfav').removeClass('unfavorite').addClass('favorite')
                            $('#trackrow' + row['id']).find('.favunfav').attr('title', 'Add to favorites');
                        }
                        if (row.id == _activeSongID) {
                            $('#mainPlayer #favorite').removeClass('unfavorite')
                            $('#mainPlayer #favorite').addClass('favorite')
                        }
                    } else if (data == 'not_loggedin') {
                        registration.openPopup();
                        return false;
                    } else if (data == 'not_verified') {
                        verify.openPopUp();
                        return false;
                    }
                } else {
                    utility.errorLog("favorite", 'play');
                }
            }
        });
    } catch (e) {}
}

function getFavoriteCount(row) {
    var count = $.ajax({
        url: BASE_URL + 'ajax/favorite',
        data: row,
        type: 'POST',
        success: function (data) {
            row.action = null;
            _favorite_count = data;
        },
        error: function () {}
    });
}

function sharePopup(_this, e, cls) {
    if (login.checklogin() == 0) {
        registration.openPopup();
        return false;
    }
    if (typeof cls == 'string') {
        $('#sharemainpop').addClass('player-share-popup');
    } else {
        $('#sharemainpop').removeClass('player-share-popup');
    }
    _gaq.push(['_trackEvent', 'Share-Dedicate', 'popupopen', 'sharepopup']);
    $('.validateTips').hide();
    $('#copylinkSwf').removeClass('copied');
    $("#popshare-email-to").val('');
    $("#popshare-email-from").val('');
    $("#description").val('');
    if ($(_this).attr('data-type') == 'sharep') {
        try {
            if (gaanaMaster.getCurrentInfo() == null && typeof RadioMetaData.data.id == 'undefined') {
                return;
            }
            if (gaanaMaster.getCurrentInfo() != null) {
                shareInfo = gaanaMaster.getCurrentInfo();
            }
            if (typeof RadioMetaData.data.id != 'undefined') {
                shareInfo = RadioMetaData.data;
                shareInfo.share_url = typeof shareInfo.share_url != 'undefined' ? shareInfo.share_url : '/song/' + shareInfo.seokey;
                shareInfo.albumartwork = typeof shareInfo.albumartwork != 'undefined' ? shareInfo.albumartwork : shareInfo.artwork;
            }
        } catch (e) {}
    } else {
        shareInfo = $.parseJSON($('#parent-row-' + $(_this).attr('data-value')).html());
    }
    artist_name = $('#artistName-' + $(_this).attr('data-value'));
    artist_name = $(artist_name).text();
    if ($('#copylinkSwf').length > 0) {
        var shareURL = shareInfo.share_url.slice(1, $.trim(shareInfo.share_url.length));
        copyLink(BASE_URL + "" + shareURL);
    }
    $('#sharemainpop img').attr('src', shareInfo.albumartwork).attr('width', 60).attr('height', 60);
    $('#sh_fnd').find('._sh .a-d').html(html_entity_decode(shareInfo.title));
    if (typeof shareInfo.albumtitle != 'undefined' && shareInfo.albumtitle != '') {
        $('#sh_fnd').find('.a-l').html(shareInfo.albumtitle);
    } else {
        $('#sh_fnd').find('.a-l').html("");
    }
    $('#sh_fnd').find('._sh .a-l').html(artist_name);
    var arrow = '';
    var arrow1 = '';
    var leftpos, arwtopos;
    $('._share').css('display', 'none');
    $('.arrow-up').css('display', 'none');
    $('.arrow-down').css('display', 'none');
    $('.arrow-left').css('display', 'none');
    $('.arrow-right').css('display', 'none');
    toppos = e.pageY + 35;
    arrow1 = $('.arrow-up');
    arwtopos = e.pageY + 20;
    if (($(window).height() - e.clientY) < $('._share').height()) {
        toppos = e.pageY - $('._share').height();
        arwtopos = e.pageY + 1;
        arrow1 = $('.arrow-down');
    }
    if ($(_this).attr('class') == 'share' || $(_this).attr('class') == 'a-d1 share') {
        arrow = $('.arrow-right');
        leftpos = e.pageX - ($('._share').width() + 25);
        $('._share').css({
            top: e.pageY - 130,
            left: leftpos,
            boxShadow: '8px -2px 27px -9px #222222'
        });
        $('._share').fadeIn(800);
        $('.arrow-right').fadeIn(800);
        arrow.css({
            top: e.pageY - 15,
            left: e.pageX - 25
        });
    } else if ($.trim($(_this).attr('class')) == 'player_share' || $.trim($(_this).attr('id')) == 'forward') {
        $(_this).addC
        leftpos = e.pageX - 290;
        toppos = toppos - 45;
        arwtopos = arwtopos - 45;
        $('._share').css({
            top: toppos,
            left: leftpos,
            boxShadow: '0 15px 27px -9px #222222'
        });
        $('._share').fadeIn(800);
        $('._share1').hide();
        arrow1.fadeIn(800);
        arrow1.css({
            top: parseInt(arwtopos),
            left: e.pageX - 10
        });
        if (e.pageX < 180) {
            $('._share').css({
                top: e.pageY + 35,
                left: e.pageX - 130
            });
        }
    } else if ($(_this).attr('class') == 'share-white') {
        leftpos = parseInt(e.pageX) - 130;
        $('._share').css({
            top: toppos,
            left: leftpos,
            boxShadow: '0 -7px 27px -9px #222222'
        });
        $('._share').fadeIn(800);
        arrow1.fadeIn(800);
        arrow1.css({
            top: parseInt(arwtopos),
            left: e.pageX - 10
        });
        if (e.pageX < 180) {
            $('._share').css({
                top: e.pageY + 35,
                left: e.pageX - 130
            });
        }
    } else if ($(_this).attr('class') == 'share-span') {
        leftpos = parseInt(e.pageX) - 130;
        $('._share').css({
            top: toppos,
            left: leftpos,
            boxShadow: '0 -7px 27px -9px #222222'
        });
        $('._share').fadeIn(800);
        arrow1.fadeIn(800);
        arrow1.css({
            top: parseInt(arwtopos),
            left: e.pageX - 10
        });
        if (e.pageX < 180) {
            $('._share').css({
                top: e.pageY + 35,
                left: e.pageX - 130
            });
        }
    } else if ($(_this + '[class*=activity-button-bg]')) {
        arrow = $('.arrow-up');
        leftpos = e.pageX - 130;
        $('._share').css({
            top: e.pageY + 35,
            left: leftpos,
            boxShadow: '0 -7px 27px -9px #222222'
        });
        $('._share').fadeIn(800);
        $('.arrow-up').fadeIn(800);
        arrow.css({
            top: e.pageY + 20,
            left: e.pageX - 10
        });
    }
}
utility.postOnTwitter = function (obj) {
    var loginStatus = login.checklogin();
    var station_name = '';
    if ($.trim(loginStatus) != "1") {
        return;
    }
    if (typeof jsuserdata.hastwitterId != 'undefined' && jsuserdata.hastwitterId != '1') {
        return;
    }
    var silent_mood = readCookie('silent_mood');
    if (typeof silent_mood != 'undefined' && silent_mood == '1') {
        return;
    }
    if (typeof jsuserdata.silentmode != 'undefined' && jsuserdata.silentmode == '1') {
        return;
    }
    if (typeof obj.stationname != 'undefined') {
        station_name = obj.stationname;
    }
    $.ajax({
        url: BASE_URL + 'ajax/pushtotwitter',
        data: {
            songtitle: obj.songtitle,
            albumname: obj.albumname,
            url: obj.url,
            action: 'tweet',
            type: obj.obj,
            stationname: station_name,
        },
        type: 'post',
        cache: false,
        dataType: 'html',
        success: function (data) {
            if ($.trim(data) == 'Success') {}
        }
    });
}

function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};
    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });
    return indexed_array;
}

function bindGaanaplusSubscriptionEvent() {
    $('#select_pay_mode input:radio').on('click', function () {
        var selectedVal = $("#select_pay_mode input:radio:checked").val();
        $('#payment_mode').attr('value', selectedVal);
        if (selectedVal === 'nb') {
            $('#dcCardSection').hide();
            $('#netBankingSection').show();
            return;
        }
        $.ajax({
            url: BASE_URL + 'ajax/gaanaplus_process',
            data: {
                'params': getFormData($('#gaana-plus-payment-form')),
                'action': 'getpayid'
            },
            type: 'POST',
            async: true,
            beforeSend: function () {
                utility.blockui.init();
            },
            success: function (data) {
                try {
                    var payment_info = JSON.parse(data);
                    var src_url = payment_info.payUrl + '?paymentId=' + payment_info.payId;
                    var iframe_html = '<iframe src="' + src_url + '" width="100%" height="400" style="border:0"></iframe>';
                    $('#dcCardSection').html(iframe_html);
                    $('#dcCardSection').show();
                    $('#netBankingSection').hide();
                    utility.blockui.remove();
                } catch (e) {
                    alert(e);
                    utility.blockui.remove();
                }
            },
            error: function () {
                utility.blockui.remove();
                console.log("check:" + data);
            }
        });
    });
}
var lyrics = {}
lyrics.openPopUp = function (songinfo) {
    var Html = ['<div class="gradient_header_popup" id="lyricsPopup">', '<div><h3><span></span>LYRICS</h3><div class="dedicate_album border_bottom" id="sh_fnd">', '<img src="', songinfo.albumartwork, '" alt="" style="width:100px;"/>', '<div class="_sh"><span class="a-l">Gaana will open a new tab for lyrics of <span class="a-d">', songinfo.title, '</span>', ' from <span class="a-d">', songinfo.albumtitle, '</span></span></div><div class="relative" style="top:15px; width: 214px; float: right;"><span>', '<input type="checkbox" id ="chkvisibility" class="chkvisibility" value ="1" /></span>', '<span>Do not ask me again</span> <span class="custom_chk"></span></div><div class="clr"></div></div><div class="btnpanel">', '<a id="yesbtn" class="btn a-d1" href="javascript:void(0)">Open in new tab</a>', '<a id="nobtn" class="btn a-d1 greybg" href="javascript:void(0)">Cancel</a>', '</div><div class="clr"></div></div> </div>'];
    var result = Html.join('')
    $('#popup').remove();
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        width: 368,
        modal: true,
        dialogClass: 'lyricsPopupClass',
        title: "Lyrics",
        closeText: '',
        show: {
            effect: "blind",
            duration: 1000
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "59px"
                });
            }
        },
        open: function () {
            $('.chkvisibility').check();
            $('.chkvisibility').trigger('click');
            $('#nobtn').click(function () {
                $('#popup').remove();
            })
            $('#yesbtn').click(function () {
                if ($('#popup .custom_chk').attr('class').indexOf('pos') != -1) {
                    createCookie('lyrics_chk', 1)
                }
                var myWindow = window.open(songinfo.lyrics_url, '_blank');
                $('#popup').remove();
                myWindow.focus();
                return false;
            })
        },
        close: function () {}
    });
};
(function () {
    var internal = {
        "firstrun": true,
        "is_supported": true
    };
    internal.addEvent = function (obj, event, callback) {
        if (window.addEventListener) {
            obj.addEventListener(event, callback, false);
        } else {
            obj.attachEvent('on' + event, callback);
        }
    }
    internal.clone = function (obj) {
        object = {};
        for (var i in obj) {
            object[i] = obj[i];
        }
        return object;
    }
    internal.triggerEvent = function (node, event_name, args) {
        var evt = '';
        if (document.createEvent) {
            evt = document.createEvent("HTMLEvents");
            evt.initEvent(event_name, true, true);
            if (typeof args != 'undefined') {
                evt.args = args;
            }
            node.dispatchEvent(evt);
        } else {
            try {
                evt = document.createEventObject();
                evt.evtType = 'on' + event_name;
                if (typeof args != 'undefined') {
                    evt.args = args;
                }
                node.fireEvent(evt.evtType, evt);
            } catch (error) {
                if (typeof event_name != 'undefined' && event_name == 'beforeSend') {
                    $('div#lastPostsLoader').empty();
                    utility.blockui.init();
                    return false;
                }
                if (typeof event_name != 'undefined' && event_name == 'complete') {
                    utility.blockui.remove();
                }
                if (typeof event_name != 'undefined' && event_name == 'success') {
                    loaddefaultimage();
                    onSucessCallback();
                }
            }
        }
    }
    internal.addEvent(window, 'popstate', function (st) {
        if (st.state != null) {
            var options = internal.parseOptions({
                'url': st.state.url,
                'container': st.state.container,
                'history': false
            });
            if (options == false) return;
            internal.handle(options);
        }
    });
    this.statChange = function (st) {
        if (st.data != null) {
            var options = internal.parseOptions({
                'url': st.data.url,
                'container': st.data.container,
                'history': false
            });
            if (options == false) return;
            internal.handle(options);
        }
    }
    internal.attach = function (node, options) {
        if (node.hostname !== document.location.host) {
            return;
        }
        options.url = node.href;
        if (node.getAttribute('data-pjax')) {
            options.container = node.getAttribute('data-pjax');
        }
        if (node.getAttribute('data-title')) {
            options.title = node.getAttribute('data-title');
        }
        options = internal.parseOptions(options);
        if (options == false) return;
        internal.addEvent(node, 'click', function (event) {
            if (event.which > 1 || event.metaKey) return;
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
            if (document.location.href == options.url) return false;
            internal.handle(options);
        });
    }
    internal.parseLinks = function (dom_obj, options) {
        if (typeof options.useClass != 'undefined') {
            var nodes = '';
            if (dom_obj.getElementsByClassName) {
                nodes = dom_obj.getElementsByClassName(options.useClass);
            } else {
                nodes = $(dom_obj).find('.' + options.useClass);
            }
        } else {
            nodes = dom_obj.getElementsByTagName('a');
        }
        for (var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            internal.attach(node, internal.clone(options));
        }
    }
    internal.smartLoad = function (html, options) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        tmpNodes = tmp.getElementsByTagName('div');
        for (var i = 0; i < tmpNodes.length; i++) {
            if (tmpNodes[i].id == options.container.id) {
                return tmpNodes[i].innerHTML;
                break;
            }
        }
        return html;
    }
    internal.handle = function (options) {
        internal.triggerEvent(options.container, 'beforeSend');
        internal.request(options.url, function (html) {
            if (options.smartLoad) html = internal.smartLoad(html, options);
            var responses = html.split('dataseparater###');
            if (responses[0] == 'loginRequired') {
                registration.openPopup();
                utility.blockui.remove();
                setTimeout(dfpAdSlots, 2000);
                return false;
            } else {
                html = responses[0]
            }
            options.container.innerHTML = html;
            if (options.parseLinksOnload) {
                internal.parseLinks(options.container, options);
            }
            if (typeof options.title == 'undefined') {
                if (options.container.getElementsByTagName('title').length != 0) {
                    options.title = options.container.getElementsByTagName('title')[0].innerHTML;
                } else {
                    options.title = document.title;
                }
            }
            if (options.history) {
                if (internal.firstrun) {
                    History.replaceState({
                        'url': document.location.href,
                        'container': options.container.id
                    }, document.title, document.location.href);
                    internal.firstrun = false;
                }
                History.pushState({
                    'url': options.url,
                    'container': options.container.id
                }, options.title, options.url);
            }
            internal.triggerEvent(options.container, 'complete', {
                container: options.container,
                html: html
            });
            if (html == false) {
                internal.triggerEvent(options.container, 'error');
                return;
            } else {
                internal.triggerEvent(options.container, 'success');
            }
            if (window._gaq) gAnalyticPageview()
            document.title = options.title;
        });
    }
    internal.request = function (location, callback) {
        if (typeof xmlhttp != 'undefined') {
            xmlhttp.abort()
        }
        try {
            xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
        xmlhttp.onreadystatechange = function () {
            if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                callback(xmlhttp.responseText);
            } else if ((xmlhttp.readyState == 4) && (xmlhttp.status == 404 || xmlhttp.status == 500)) {
                callback(false);
            }
        }
        xmlhttp.open("GET", location, true);
        xmlhttp.setRequestHeader('X-PJAX', 'true');
        xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xmlhttp.send(null);
    }
    internal.parseOptions = function (options) {
        opt = {};
        opt.history = true;
        opt.parseLinksOnload = true;
        opt.smartLoad = true;
        if (typeof options.url == 'undefined' || typeof options.container == 'undefined') {
            console.log("URL and Container must be provided.");
            return false;
        }
        if (typeof options.history == 'undefined') {
            options.history = opt.history;
        } else {
            options.history = (!(options.history == false));
        }
        if (typeof options.parseLinksOnload == 'undefined') {
            options.parseLinksOnload = opt.parseLinksOnload;
        }
        if (typeof options.smartLoad == 'undefined') {
            options.smartLoad = opt.smartLoad;
        }
        if (typeof options.container == 'string') {
            container = document.getElementById(options.container);
            if (container == null) {
                console.log("Could not find container with id:" + options.container);
                return false;
            }
            options.container = container;
        }
        if (typeof options.beforeSend == 'function') {
            internal.addEvent(options.container, 'beforeSend', options.beforeSend);
        }
        if (typeof options.complete == 'function') {
            internal.addEvent(options.container, 'complete', options.complete);
        }
        if (typeof options.error == 'function') {
            internal.addEvent(options.container, 'error', options.error);
        }
        if (typeof options.success == 'function') {
            internal.addEvent(options.container, 'success', options.success);
        }
        return options;
    }
    this.connect = function () {
        var options = {};
        if (arguments.length == 2) {
            options.container = arguments[0];
            options.useClass = arguments[1];
        }
        if (arguments.length == 1) {
            if (typeof arguments[0] == 'string') {
                options.container = arguments[0];
            } else {
                options = arguments[0];
            }
        }
        delete options.title;
        delete options.history;
        internal.addEvent(window, 'load', function () {
            internal.parseLinks(document, options);
        });
    }
    this.invoke = function () {
        if (arguments.length == 2) {
            options = {};
            options.url = arguments[0];
            options.container = arguments[1];
        } else {
            options = arguments[0];
        }
        if (!internal.is_supported) {
            document.location = options.url;
            return;
        }
        options = internal.parseOptions(options);
        if (options !== false) internal.handle(options);
    }
    window.ajaxPageRequestHandler = this;
}).call({});;
var registration = {};
var _isNotify = false;
registration.openPopup = function (tplname, msg, _dialogClass, left_section) {
    var __tplname = tplname;
    var callingURL = document.URL;
    if (callingURL.indexOf("topgaana2013") != -1) {
        var campaign = 'topgaana2013';
    }
    createCookie("GAANA_VERSION", '3.0', 360);
    $('#login-form input').css('width', '73%');
    $('.gobtn').show();
    var formobj = {
        formelement: [{
            fieldname: 'username',
            value: "Full Name",
            type: 'text',
            'class': 'user_id',
            id: 'name'
        }, {
            fieldname: 'password_reg',
            value: "Password",
            type: 'password',
            'class': 'pwd_id',
            id: 'password_reg'
        }],
        buttons: [{
            name: '',
            value: 'Register',
            'class': '',
            id: ''
        }],
        reg_formname: 'registration-form',
        reg_formid: 'registration-form',
        metheod: 'post',
        reg_div_id: 'register-form',
        loginbutton: [{
            name: '',
            value: '',
            id: ''
        }],
        login_form_id: 'login-form',
        login_email_id: "email",
        btn_register: "btn_register",
        datepicker_id: "picker2",
        login_pass_id: "loginpassword",
        dob: [{
            id: 'birth-month',
            text: 'Month'
        }, {
            id: 'birth-day',
            text: 'Day'
        }, {
            id: 'birth-year',
            text: 'Year'
        }]
    }
    if (typeof tplname == 'undefined' || tplname == 'regSkipPromt' || tplname == null) tplname = "regtpl";
    if (typeof _dialogClass == 'undefined' || _dialogClass == null) _dialogClass = "userlogin";
    var connectusing = 'Signup using social for faster login';
    if (tplname == "regtwittertpl") {
        connectusing = "Please provide some more info to proceed.";
    }
    var template = $('#' + tplname).html();
    $('#popup').remove();
    var result = Mustache.render(template, formobj);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    if (__tplname == 'regSkipPromt') {
        $('.yt_video_close').trigger('click');
        campaign = 'regSkipPromt';
        $('#topLevel #perosnalize_exp').addClass('perosnalize_exp').show().html(msg);
        $('#popup').find('.btm_rlink').attr('onclick', 'gAnalyticChannelClick("Skip Limit","Later","");registration.popupClose();');
        gAnalyticVirtualPageview('/virtual/login-popup-skiplimit');
    } else {
        campaign = '';
        $('.timespoint').show();
        $('#topLevel #perosnalize_exp').html('');
        $('#topLevel #perosnalize_exp').removeClass('perosnalize_exp')
    }
    var popup_width = 425;
    if (typeof left_section != 'undefined' || left_section != null) {
        $('.yt_video_close').trigger('click');
        popup_width = 690;
        createCookie('consumption_limit', 1);
        $('.expand-popups').addClass('expand-popups_add');
        $('.friends-pop').css('display', 'block');
    } else {
        $('.expand-popups').removeClass('expand-popups_add');
        $('.friends-pop').css('display', 'none');
    }
    $('#popup').dialog({
        autoOpen: true,
        width: popup_width,
        modal: true,
        dialogClass: _dialogClass,
        title: connectusing,
        draggable: false,
        closeText: '',
        show: {
            effect: "blind",
            duration: 200
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "60px"
                });
            }
        },
        open: function () {
            $('body').on('click', '.btm_rlink', function () {})
            $("#picker2").birthdaypicker({
                futureDates: true,
                maxYear: 2012,
                maxAge: 112,
                defaultDate: false,
                onchnage: function (obj, value) {
                    if ($(obj).attr('class') == 'birth-day') {
                        $('#birth-day').html(value)
                    } else if ($(obj).attr('class') == 'birth-month') {
                        $('#birth-month').html(value)
                    } else if ($(obj).attr('class') == 'birth-year') {
                        $('#birth-year').html(value)
                    }
                }
            });
            $('#popup .custom-gender').on('click', function () {
                $(this).closest('div.gender').find('div.lighter_gray').removeClass('lighter_gray');
                $(this).addClass('lighter_gray');
            });
            $('#popup .timespoint sup').hover(function (e) {
                $(this).append('<div class="timespointinfo">Times Points is loyalty program on Times Network. Signup to earn points and redeem them on www.timespoints.com </div>');
            }, function () {
                $('.timespointinfo').remove();
            })

            function submitHandler(ele) {
                var bValid = true;
                allFields.removeClass("ui-state-error");
                $(".validateTips").empty();
                bValid = bValid && checkLength(email, "email", 6, 80);
                bValid = bValid && checkRegexp(email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]{2,4}|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,4})|(([a-z]{2,4}|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,4})([a-z]{2,4}|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "Invalid Email");
                if (bValid) {
                    data = {
                        "email": $(ele).val(),
                        "task": 'check_email_exists'
                    }
                    registration.submitRequest(data)
                } else {
                    tips.show();
                }
            }
            $('.terms-check input').check();
            $('#popup #facebook-login').on('click', function () {
                if (campaign == 'regSkipPromt') gAnalyticChannelClick("Skip Limit", 'Facebook', "");
                else gAnalyticChannelClick('Login-Register', 'Facebook', 'Popup');
                var url = BASE_URL + 'openpopup?type=facebook';
                var title = 'Facebook'
                window.open(url, title, "menubar=0,resizable=0,width=500,height=300");
                $('#popup').remove();
            });
            $('#popup #google-login').on('click', function () {
                if (campaign == 'regSkipPromt') gAnalyticChannelClick("Skip Limit", 'Google', "");
                else gAnalyticChannelClick('Login-Register', 'Google+', 'Popup');
                gapi.auth.signIn({
                    callback: "onSignInCallback",
                    clientid: GOOGLE_CLIENT_ID,
                    apppackagename: "com.gaana",
                    accesstype: "offline",
                    cookiepolicy: "single_host_origin",
                    approvalprompt: "auto",
                    requestvisibleactions: "http://schemas.google.com/AddActivity",
                    scope: "email https://www.googleapis.com/auth/plus.login"
                });
                $('#popup').remove();
            });
            $('#popup #twitter-login').on('click', function () {
                if (campaign == 'regSkipPromt') gAnalyticChannelClick("Skip Limit", 'Twitter', "");
                else gAnalyticChannelClick('Login-Register', 'Twitter', 'Popup');
                var url = BASE_URL + 'openpopup?type=twitter&campaign=' + campaign;
                var title = 'Twitter'
                window.open(url, title, "menubar=0,resizable=0,width=500,height=300");
                $('#popup').remove();
            });
            $('#popup #forgot_pswd').on('click', function () {
                tips.hide();
                registration.forgotpassword();
            });
            var name = $("#popup #name"),
                email = $("#popup #email"),
                password = $("#popup #password_reg"),
                loginpassword = $("#popup #loginpassword"),
                dateofbirth = $("#popup #birthdate"),
                iagree = $("#popup #i-agree"),
                allFields = $([]).add(name).add(email).add(password).add(loginpassword).add(dateofbirth).add(iagree),
                tips = $(".validateTips");
            tips.hide();
            $("input[type='text']").blankInput();
            $('#popup #email').on('keydown', function (e) {
                try {
                    e = e || window.event;
                    var code = e.keyCode || e.which;
                    if (code == 13 || code == 9) {
                        submitHandler(this);
                    }
                } catch (e) {
                    alert(e.message)
                }
            })
            $('#loginpassword').on('keydown', function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code == 13) {
                    $('#popup #btn_login').trigger('click');
                }
            })
            $('#popup #btn_login').on('click', function () {
                try {
                    if (campaign == 'regSkipPromt') gAnalyticChannelClick("Skip Limit", "Popup-Login", "");
                    else gAnalyticChannelClick('Login-Register', 'Email', 'Popup-Login');
                    var bValid = true;
                    allFields.removeClass("ui-state-error");
                    $(".validateTips").empty();
                    tips.hide();
                    bValid = bValid && checkLength(email, "email", 6, 80);
                    bValid = bValid && checkRegexp(email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]{2,4}|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,4})|(([a-z]{2,4}|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,4})([a-z]{2,4}|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "Invalid Email!");
                    bValid = bValid && checkLength(loginpassword, "password", 1, 500, "Password can't be blank");
                    if (bValid) {
                        utility.blockui.init();
                        var data = {
                            "username": $('#popup #email').val(),
                            "password": $('#popup #loginpassword').val(),
                            "task": 'login'
                        }
                        registration.submitRequest(data)
                    } else {
                        tips.show();
                    }
                } catch (e) {
                    alert(e.message)
                }
            });
            $('#popup #forgot-password').on('click', function () {
                try {
                    var bValid = true;
                    var emailId = $('#popup #emailId');
                    allFields.removeClass("ui-state-error");
                    bValid = bValid && checkLength(emailId, "email", 6, 80);
                    bValid = bValid && checkRegexp(emailId, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "Invalid Email");
                    if (bValid) {
                        var data = {
                            "email": $('#popup #emailId').val(),
                            "task": 'forgotpassword'
                        };
                        registration.submitRequest(data);
                    } else {
                        tips.show();
                        $('.login_panel>.validateTips').css('display', 'none');
                    }
                } catch (e) {
                    alert(e.message);
                }
            });
            $('#popup #btn_register').on('click', function () {
                try {
                    var bValid = true;
                    gAnalyticChannelClick('Login-Register', 'Email', 'Popup-RegisterButton');
                    allFields.removeClass("ui-state-error");
                    $(".validateTips").empty();
                    tips.hide();
                    bValid = bValid && checkLength(email, "email", 6, 80);
                    bValid = bValid && checkRegexp(email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]{2,4}|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,4})|(([a-z]{2,4}|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,4})([a-z]{2,4}|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com");
                    bValid = bValid && checkLength(name, "fullname", 3, 16);
                    bValid = bValid && checkRegexp(name, /^[A-Za-z\s]+$/, "Special Characters or Numbers are not allowed");
                    bValid = bValid && checkLength(password, "password", 6, 14);
                    bValid = bValid && checkRequiredDob(dateofbirth, "Date of birth is required.", "NaN-NaN-NaN");
                    bValid = bValid && isChecked(iagree, "Please select terms & conditions", "");
                    if (bValid) {
                        utility.blockui.init();
                        try {
                            var data = {
                                "email": $('#popup #email').val(),
                                "password": $('#popup #password_reg').val(),
                                "fullname": $('#popup #name').val(),
                                "birthdate": $('#popup #birthdate').val(),
                                "sex": $('#popup #sex').text(),
                                "twitterdata": $('#popup #twitter-data').val(),
                                "campaign": campaign,
                                "task": 'registration'
                            };
                            registration.submitRequest(data);
                        } catch (e) {
                            alert(e.message);
                        };
                    } else {
                        tips.show();
                    }
                } catch (e) {
                    alert(e.message);
                }
            });
            $('#popup #languageSelectionNext').on('click', function () {
                try {
                    createCookie("onBoarding", 'valid', 365);
                    var bValid = true;
                    gAnalyticChannelClick('Login-Register', 'Email', 'languageSelectionNext');
                    var language = new Array();
                    $('#popup .active-lang').each(function (index) {
                        language.push($(this).text());
                    });
                    var data = {
                        "language": language.toString(),
                        "task": 'languageUpdate'
                    };
                    registration.submitRequest(data);
                } catch (e) {
                    alert(e.message);
                };
            });
            $('#popup #inviteFriendNext').on('click', function () {
                registration.populateTopArtistData();
            });
            $('#popup #inviteArtistNext').on('click', function () {
                registration.popupAppsDownload();
            });
            $('#popup #subscribeMobileBtn').on('click', function () {
                try {
                    console.log('appsDownload');
                    registration.mobilePopUpSendSMS($('#popup'), 'appsDownload');
                } catch (e) {
                    console.log(e.message);
                }
            });
            $('#popup #subscribeMobileBtn1').on('click', function () {
                try {
                    console.log('appsDownload2');
                    registration.mobilePopUpSendSMS($('#popup'), 'appsDownload2');
                } catch (e) {
                    console.log(e.message);
                }
            });
            $('#popup #inviteBtn').on('click', function () {
                try {
                    gAnalyticChannelClick('Login-Register', 'Email', 'inviteByEmailBtn');
                    $('#popup .validateTips').css('background', 'none repeat scroll 0 0 #A61900').hide().html("");
                    var emailIds = $('#popup #emailIds');
                    var inviteBtn = $('#popup #inviteBtn');
                    var emailIdsArr = new Array();
                    emailIdsArr = emailIds.val().split(',');
                    var bValid = true;
                    $.each(emailIdsArr, function (index, value) {
                        var email = $.trim(value);
                        var regexp = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/;
                        if (!(regexp.test(email))) {
                            $('#popup .validateTips').show().html("Please enter a valid email id!").css('color', '#ff0000');
                            bValid = false;
                            return false;
                        }
                    });
                    if (bValid) {
                        $.ajax({
                            type: 'post',
                            url: BASE_URL + 'ajax/login',
                            data: {
                                "task": 'inviteByEmailIds',
                                "emailIds": emailIds.val()
                            },
                            dataType: 'json',
                            beforeSend: function () {
                                emailIds.attr('disabled', true);
                                inviteBtn.css('visibility', 'hidden');
                                $('#popup .validateTips').addClass('green').show().html("please wait..");
                            },
                            success: function (data) {
                                var jsondata = data;
                                if (jsondata.already_user > 0) {
                                    var _message = "This user is already a Gaana member.";
                                } else if (jsondata.already_referred > 0) {
                                    var _message = "You have already referred this user";
                                } else if (jsondata.total_referred > 0) {
                                    var _message = "You have sucessfully referred " + jsondata.total_referred + " user";
                                } else if (jsondata.failed_referral > 0) {
                                    var _message = "Due to some problem your invitation fail. Please try again!!!";
                                }
                                $('#popup .validateTips').addClass('green').show().html(_message);
                                emailIds.removeAttr('disabled');
                                inviteBtn.css('visibility', 'visible');
                                emailIds.val("");
                            }
                        });
                    }
                } catch (e) {
                    alert(e.message);
                }
            });
            $('#popup #btn_registerBack').on('click', function () {
                try {
                    gAnalyticChannelClick('Login-Register', 'Email', 'btn_registerBack');
                    $('#popup .validateTips').hide();
                    $('.login_panel #regSocialBtn').show();
                    $('#popup #password-form').show();
                    $('#popup #register-form').hide()
                } catch (e) {
                    alert(e.message);
                }
            });
        }
    });
}
registration.submitRequest = function (data) {
    $.ajax({
        url: BASE_URL + "ajax/login",
        data: data,
        type: 'post',
        dataType: "json",
        success: function (data) {
            if (data != '' && $.trim(data) != "null") {
                if ($.trim(data.status) == 'Y') {
                    $('#popup #email').closest('div').next().find('input').focus();
                } else if ($.trim(data.status) == 'N') {
                    $('#popup #topLevel .perosnalize_exp').hide();
                    $('#popup #topLevel .timespoint').find('span').html('50');
                    $('.login_panel #regSocialBtn').hide();
                    $('#popup #password-form').hide();
                    $('#popup #register-form').show().slideDown({
                        queue: false,
                        complete: function () {
                            var id = $('#popup #email').closest('div').next().next().find('input').attr('id');
                            $('#' + id).focus();
                        }
                    });
                    gAnalyticVirtualPageview('/virtual/registration-popup');
                } else if ($.trim(data.status) == 1) {
                    _userLoginStatus = true;
                    login.loginRefresh(data.userinfo);
                    $('#popup').remove();
                } else if ($.trim(data.status) == "success") {
                    login.loginRefresh(data.userinfo);
                    if (typeof readCookie('verified') != 'undefined' && $.trim(readCookie('verified')) == 'yes' && $.trim(readCookie('onboardingemail')) == $.trim(data.userinfo.email)) {
                        if (typeof data.userinfo.username != 'undefined' && data.userinfo.username != null) {
                            registration.languageSection();
                            createCookie("verified", '', -365);
                            createCookie("onboardingemail", '', -365);
                        }
                    } else {
                        $('#popup').remove();
                    }
                } else if ($.trim(data.status) == "emailsent") {
                    $('#popup').remove();
                    messagebox.open({
                        msg: message['forgot_password_message'],
                        autoclose: false
                    }, true);
                    gAnalyticVirtualPageview('/virtual/forgot_password_message-popup');
                } else if ($.trim(data.status) == "languageUpdate") {
                    registration.populateTopUserData();
                } else if ($.trim(data.status) == "updateLanguages") {} else if ($.trim(data.status) == "email_wrong_data") {
                    $('#popup .validateTips').text($.trim(data.errMsg));
                    $('#popup .validateTips').show();
                    $('.login_panel>.validateTips').css('display', 'none');
                } else {
                    $('#popup .validateTips').text($.trim(data.errMsg));
                    $('#popup .validateTips').show();
                    utility.blockui.remove();
                }
            } else {
                utility.errorLog("data is null", 'play');
            }
        }
    });
}
registration.editprofile = function () {
    $('#prowrapperdiv #file_upload').on('change', function () {
        registration.ajaxFileUpload();
    });
    $("#editprof #picker2").birthdaypicker({
        futureDates: true,
        maxYear: 2012,
        maxAge: 100,
        defaultDate: $("#hd_date").val(),
        onChange: function (args) {
            $.ajax({
                url: BASE_URL + "ajax/updateuserprofile",
                async: false,
                type: "POST",
                data: {
                    name: 'dob',
                    value: args
                },
                beforeSend: function (xhr) {}
            }).done(function (data) {
                if (data != 'failed') {
                    $("#editprof .success").show();
                    $("#editprof .fail").hide();
                } else {
                    $("#editprof .success").hide();
                    $("#editprof .fail").show();
                }
            }).fail(function () {
                $("#editprof .fail").show();
                console.log("Error: Edit Profile")
            });
        }
    });
    $('.custom_sex').on('click', function () {
        $(this).closest('div.gender').find('div.lighter_gray').removeClass('lighter_gray');
        $(this).addClass('lighter_gray');
    });
    $(".autosave").autosave({
        url: "",
        success: successCallback,
        error: errorCallback,
        before: beforeCallback
    })
}
registration.ajaxFileUpload = function () {
    try {
        $.ajaxFileUpload({
            url: BASE_URL + 'ajax/updateuserprofile?type=uploaduserpicture',
            secureuri: false,
            fileElementId: 'file_upload',
            dataType: 'html',
            success: function (data, status) {
                if (data == 'success') {
                    imagecrop.openPopup();
                } else {}
            },
            error: function (data, status, e) {
                alert(e);
            }
        })
    } catch (e) {
        alert(e.message)
    }
    $('#prowrapperdiv #file_upload').on('change', function () {
        registration.ajaxFileUpload();
    });
}
registration.socialconnect = function () {
    $('#facebook-connect').on('click', function () {
        if (!$("#facebook-connect").hasClass("btn_active")) {
            var url = BASE_URL + 'openpopup?type=fbconnect';
            var title = 'Facebook'
            window.open(url, title, "menubar=0,resizable=0,width=500,height=300");
        }
    });
    $('#outercontainer').off('click', '#facebook-disconnect');
    $('#outercontainer').on('click', '#facebook-disconnect', function () {
        if (!$("#facebook-disconnect").hasClass("btn_inactive")) {
            $.ajax({
                url: BASE_URL + 'ajax/settings',
                data: {
                    name: "publish_fb",
                    value: "1"
                },
                type: 'post',
                cache: false,
                dataType: 'html',
                success: function (data) {
                    if ($.trim(data) == 'Success') {
                        $('#facebook-connect').removeClass('btn_active');
                        $('#facebook-disconnect').addClass('btn_inactive');
                        messagebox.open({
                            msg: message['fbdisconnect_message'],
                            autoclose: false
                        }, true);
                    }
                }
            })
        }
    });
    $('#twitter-connect').on('click', function () {
        var url = BASE_URL + 'openpopup?type=twitter';
        var title = 'Twitter'
        window.open(url, title, "menubar=0,resizable=0,width=500,height=300");
    });
    $('#outercontainer').off('click', '#twitter-disconnect');
    $('#outercontainer').on('click', '#twitter-disconnect', function () {
        if (!$("#twitter-disconnect").hasClass("btn_inactive")) {
            $.ajax({
                url: BASE_URL + 'ajax/settings',
                data: {
                    name: "publish_twitter",
                    value: "1"
                },
                type: 'post',
                cache: false,
                dataType: 'html',
                success: function (data) {
                    if ($.trim(data) == 'Success') {
                        $('#twitter-connect').removeClass('btn_active');
                        $('#twitter-disconnect').addClass('btn_inactive');
                        messagebox.open({
                            msg: message['twitterdisconnect_message'],
                            autoclose: false
                        }, true);
                    }
                }
            })
        }
    });
    $('#google-connect').on('click', function () {
        gapi.auth.signIn({
            callback: "onConnectCallback",
            clientid: GOOGLE_CLIENT_ID,
            apppackagename: "com.gaana",
            accesstype: "offline",
            cookiepolicy: "single_host_origin",
            approvalprompt: "auto",
            requestvisibleactions: "http://schemas.google.com/AddActivity",
            scope: "email https://www.googleapis.com/auth/plus.login"
        });
    });
    $('#outercontainer').off('click', '#google-disconnect');
    $('#outercontainer').on('click', '#google-disconnect', function () {
        if (!$("#google-disconnect").hasClass("btn_inactive")) {
            $.ajax({
                url: BASE_URL + 'ajax/settings',
                data: {
                    name: "publish_google",
                    value: "1"
                },
                type: 'post',
                cache: false,
                dataType: 'html',
                success: function (data) {
                    if ($.trim(data) == 'Success') {
                        $('#google-connect').removeClass('btn_active');
                        $('#google-disconnect').addClass('btn_inactive');
                        messagebox.open({
                            msg: message['googledisconnect_message'],
                            autoclose: false
                        }, true);
                    }
                }
            })
        }
    });
}
registration.editsetting = function () {
    $('.setting-save').on('click', function () {
        var a = $('#editprofileform').serialize();
        registration.saveSettingData();
    });
}
registration.saveSettingData = function () {
    $.ajax({
        url: BASE_URL + 'ajax/settings',
        data: $('#editprofileform').serialize() + '&action=save',
        type: 'post',
        cache: false,
        dataType: 'html',
        success: function (data) {
            messagebox.open({
                msg: message['setting_saved'],
                autoclose: false
            }, true);
        }
    });
}
registration.fblogin = function () {
    var url = BASE_URL + 'openpopup?type=facebook';
    var title = 'Facebook'
    window.open(url, title, "menubar=0,resizable=0,width=500,height=300");
}
registration.twitterLogin = function () {
    var url = BASE_URL + 'openpopup?type=twitter';
    var title = 'Twitter'
    window.open(url, title, "menubar=0,resizable=0,width=500,height=300");
}
registration.RegWithTwitter = function (data) {
    var obj = $.parseJSON(data);
    registration.openPopup('regtwittertpl');
    $('#popup .gobtn').css('visibility', 'hidden');
    $('#popup #password_reg').val("someexampletext");
    $('#popup #password_reg').attr('type', 'hidden');
    $('#popup .login-register').slideUp({
        queue: false
    });
    $('#popup #register-form').slideDown({
        queue: false,
        complete: function () {
            $('#popup #email').focus();
            var nameid = $('#popup #email').closest('div').next().next().find('input').attr('id');
            $('#' + nameid).val(obj.fullname);
            $('#popup #twitter-data').val(data);
        }
    });
}
registration.deactivateProfile = function (tokenPassword) {
    $.ajax({
        url: BASE_URL + 'ajax/updateuserprofile',
        data: 'action=deactivate_profile&token=' + tokenPassword,
        type: 'post',
        cache: false,
        dataType: 'html',
        success: function () {
            messagebox.open({
                msg: message['deactivatedProfile_msg'],
                autoclose: false
            }, true);
            setTimeout(function () {
                window.location = BASE_URL;
            }, 5000);
        }
    });
};
registration.sendDeactivateUrl = function () {
    $.ajax({
        url: BASE_URL + 'ajax/updateuserprofile',
        data: 'action=deactivate_profile_url',
        type: 'post',
        cache: false,
        dataType: 'html',
        success: function (data) {
            if (data == 'Success') {
                messagebox.open({
                    msg: message['deactivateProfile_msg'],
                    autoclose: false
                }, true);
            } else {
                messagebox.open({
                    msg: message['deactivateProfile_msg_fail'],
                    autoclose: false
                }, true);
            }
        }
    });
};
registration.languageSection = function () {
    if (!$("#popup").dialog("isOpen") || $("#popup").length == 0) {
        registration.openPopup('languageSelection', null, 'onboarding');
    }
    $('#popup .signinPage').hide();
    $('#popup #topLevel').show();
    $('#popup #languageSelection').show();
    $('#popup .login_panel').addClass('width425');
    $('#popup .onboarding').find('h1').html('Congratulations!');
    $('#popup .onboarding').find('.timespoint').html('You have earned <img src="http://css4.gaanacdn.com/images/times_points/50.png" title="Times Point" alt="Times Point"/> <strong><a href="/timespoints" class="pjax" target="_blank">Times Points</a> <sup>?</sup></strong>');
    gAnalyticVirtualPageview('/virtual/language-popup');
    registration.timesPointInfo();
};
registration.languageSkip = function () {
    registration.populateTopUserData();
};
registration.populateTopUserData = function () {
    registration.openPopup('inviteFriend', null, 'onboarding');
    $("#popup #inviteFriend .scroll_inner").prepend("<p style='margin-top:46px'>Please wait....</p>");
    $('#popup #topLevel').show();
    $('#popup .login_panel').addClass('width425');
    $('#popup .login_panel').find('h1').html('');
    $('#popup .login_panel').find('.timespoint').html('Now get <img src="http://css4.gaanacdn.com/images/times_points/100.png" title="Times Point" alt="Times Point"/> <strong><a href="/timespoints" class="pjax">Times Points</a> <sup>?</sup></strong><p>for every friend who joins Gaana</p>');
    registration.timesPointInfo();
    try {
        $.ajax({
            url: BASE_URL + 'ajax/login',
            data: "task=topuser",
            async: true,
            type: "post",
            success: function (msg) {
                var friendsData = "";
                var data = jQuery.parseJSON(msg);
                for (var i = 1; i <= data.length; i++) {
                    followobj = {};
                    followobj.status = 0;
                    followobj.actor_sso_id = data[i - 1].actor_sso_id;
                    followobj.target_sso_id = data[i - 1].target_sso_id;
                    followobj.gaana_id = data[i - 1].id;
                    var obj = $.toJSON(followobj);
                    var temp = '<li><div class="frnd_box">';
                    temp += '<img src="' + data[i - 1].artwork + '" width="66" height="65" />';
                    temp += "<p style='height:37px; overflow:hidden;'>" + data[i - 1].fullname + "</p>";
                    if (data[i - 1].action == 'Invite') {
                        if (i == 1) {
                            $('#popup #topLevel').show();
                            $('#popup .login_panel').find('h1').html('');
                            $('#popup .login_panel').find('.timespoint').html('Invite your Friends on Gaana');
                            $('#popup #inviteFriend .customize_gaana').find('h5').html('');
                            $('#popup #inviteFriend .invite_frnd').find('h5').html('Still missing someone?');
                        }
                        temp += '<a href="javascript:void(0)" onclick="send_invitation(' + data[i - 1].fbid + ', this)">Invite</a></div></li>';
                    } else if (data[i - 1].action == 'Follow') {
                        $('#popup #topLevel').hide();
                        $('#popup #inviteFriend .customize_gaana').find('h5').html('Follow the Top Users on Gaana');
                        $('#popup #inviteFriend .invite_frnd').find('h5').html('Still missing someone?');
                        temp += '<span id="follow-row-' + data[i - 1].target_sso_id + '" style="display:none">' + obj + '</span>';
                        temp += '<a href="javascript:void(0)" id="' + data[i - 1].target_sso_id + '" onclick="followFriend(this.id);">Follow</a></div></li>';
                    }
                    friendsData += temp;
                }
                $("#popup #scroll_inner1 p").remove();
                $("#popup #scroll_inner1 ul").html(friendsData);
                $('#popup .active_step').css({
                    left: '200px'
                });
                $('#popup .steps').append('<span class="_progress"></span>');
                $('.inviteFriend .right_arrow').carouselRight();
                $('.inviteFriend .left_arrow').carouselLeft();
            }
        });
    } catch (e) {
        alert(e.message);
    }
    gAnalyticVirtualPageview('/virtual/invitefriends-popup');
};
registration.InviteFriendsSkip = function () {
    registration.populateTopArtistData();
};
registration.populateTopArtistData = function () {
    if (!$("#popup").dialog("isOpen") || $("#popup").length == 0) {
        registration.openPopup();
    }
    try {
        var bValid = true;
        gAnalyticChannelClick('Login-Register', 'Email', 'inviteFriendNext');
        registration.openPopup('inviteArtist', null, 'onboarding');
        $('#popup #topLevel').html("");
        $('#popup #inviteArtist').show();
        $("#popup #inviteArtist .scroll_inner").prepend("<p style='margin-top:46px'>Please wait....</p>");
        try {
            $.ajax({
                url: BASE_URL + 'ajax/login',
                data: "task=topartist",
                async: true,
                type: "post",
                dataType: "json",
                success: function (msg) {
                    var friendsData = "";
                    var data = msg.data;
                    if ($.trim(msg.source) == 'fb') {
                        $('#popup .customize_gaana').find('h5').html('Follow the artists you love');
                        $('#popup .customize_gaana').find('.fb_desc').html('We have used your facebook listening history and likes');
                    }
                    for (var i = 1; i <= data.length; i++) {
                        var temp = '<li><span style="display:none;" id="parent-row-artist' + data[i - 1].id + '">' + data[i - 1].datavalue + '</span><div class="frnd_box">';
                        temp += '<img src="' + data[i - 1].artwork + '" width="66" height="65" />';
                        temp += "<p style='height:37px; overflow:hidden;'>" + data[i - 1].title + "</p>";
                        temp += '<a href="javascript:void(0)" data-value="artist' + data[i - 1].id + '" id="favorite_artist' + data[i - 1].id + '" data-type="favorite">Follow</a></div></li>';
                        friendsData += temp;
                    }
                    $("#popup #scroll_inner2 p").remove();
                    $("#popup #scroll_inner2 ul").html(friendsData);
                    $('#popup .active_step').css({
                        left: '341px'
                    });
                    $('#popup .steps').append('<span class="_progress" style="width:273px;"></span>');
                    $('#popup .steps').append('<span class="visited_step"></span>');
                    $('.inviteArtist .right_arrow').carouselRight({
                        boxid: 'scroll_inner2',
                        id: 'InviteArtist_rt1',
                        containerid: 'inviteArtist'
                    });
                    $('.inviteArtist .left_arrow').carouselLeft({
                        boxid: 'scroll_inner2',
                        id: 'InviteArtist_lt1',
                        containerid: 'inviteArtist'
                    });
                }
            });
        } catch (e) {
            alert(e.message);
        }
        gAnalyticVirtualPageview('/virtual/artist-popup');
    } catch (e) {
        alert(e.message)
    }
};
registration.timesPointInfo = function () {
    $('#popup .timespoint sup').hover(function (e) {
        $(this).append('<div class="timespointinfo">Times Points is loyalty program on Times Network. Signup to earn points and redeem them on www.timespoints.com</div>');
    }, function () {
        $('.timespointinfo').remove();
    });
};
registration.popupSkip = function () {
    registration.mobilepopup();
};
registration.mobilepopup = function () {
    if (!$("#popup").dialog("isOpen") || $("#popup").length == 0) {
        registration.openPopup('appsDownload', null, '_appdownload');
    }
    $('#popup .signinPage').hide();
    $('#popup #appsDownload').show();
    $('#popup .login_panel').addClass('width350');
    registration.timesPointInfo();
};
registration.popupSkip = function () {
    registration.popupAppsDownload();
};
registration.popupAppsDownload = function () {
    if (!$("#popup").dialog("isOpen") || $("#popup").length == 0) {
        registration.openPopup();
    }
    try {
        var bValid = true;
        gAnalyticChannelClick('Login-Register', 'Email', 'inviteArtistNext');
        registration.openPopup('appsDownload', null, '_appdownload');
        $('#popup #topLevel').html("");
        $('#popup #appsDownload').show();
        $('#popup .login_panel').addClass('width425');
        $('#popup .login_panel').find('h1').html('');
        $('#popup .login_panel').find('.timespoint').html('<div class="timespoint">Earn more <img src="http://css4.gaanacdn.com/images/times_points/100.png" title="Times Point" alt="Times Point"/> <strong>Times Points</strong></div>');
        gAnalyticVirtualPageview('/virtual/appsdownload-popup');
    } catch (e) {
        alert(e.message);
    }
};
registration.mobilepopup2 = function () {
    gAnalyticVirtualPageview('/virtual/get-gaana-on-mobile-popup');
    if (!$("#popup").dialog("isOpen") || $("#popup").length == 0) {
        registration.openPopup();
    }
    registration.openPopup('appsDownload2', null, 'mobiledownload');
    $('#popup .signinPage').remove();
    $('#popup .apps_popup').remove();
    $('#popup #appsDownload2').show();
};
registration.forgotpassword = function () {
    registration.openPopup();
    $('#popup .signinPage').hide();
    $('#popup #topLevel').show();
    $('.timespoint').hide();
    $('#popup #forgotPassword').show();
    $('#popup .login_panel').find('h1').html('Forgot your password?');
    gAnalyticVirtualPageview('/virtual/forgotpassword-popup');
};
registration.fbMusicPreference = function () {
    $.ajax({
        url: BASE_URL + 'ajax/login',
        data: 'task=fbMusicPreference',
        type: 'get',
        cache: false,
        dataType: 'html',
        success: function (data) {}
    });
};
registration.popupClose = function () {
    $("#popup").dialog("close");
}
registration.mobilePopUpSendSMS = function (_domElement, _type) {
    console.log('mobilePopUpSendSMS' + _type);
    if (_type == 'appsDownload') {
        gAnalyticChannelClick('Login-Register', 'Email', 'SMS Send');
    } else {}
    $('#popup .validateTips').hide();
    var _domMobileElement = $(_domElement).find('#subscribeMobileNo');
    var _domBntElement = $(_domElement).find('#subscribeMobileBtn');
    if (typeof _domBntElement == 'undefined' || _domBntElement == null || _domBntElement == '' || _domBntElement.length < 1) {
        _domBntElement = $(_domElement).find('#subscribeMobileBtn1');
    }
    var _domStatusElement = $(_domElement).find('#status');
    var mobile = _domMobileElement.val();
    if (!isValidateMobileNo(mobile)) {
        $('#popup .validateTips').show().html("Please enter a valid mobile number!").removeClass('green');
        return;
    }
    $.ajax({
        type: 'post',
        url: BASE_URL + 'ajax/sms_notifications',
        data: {
            "mobile_no": mobile
        },
        dataType: 'json',
        beforeSend: function () {
            _domMobileElement.attr('disabled', true);
            _domBntElement.css('visibility', 'hidden');
        },
        success: function (data) {
            var jsondata = data;
            _domMobileElement.removeAttr('disabled');
            _domBntElement.css('visibility', 'visible');
            if ($.trim(jsondata.status) === 'true') {
                _domMobileElement.remove();
                _domBntElement.remove();
                if (_type == 'appsDownload') {
                    gAnalyticChannelClick('Login-Register', 'Email', 'SMS Success');
                } else {
                    gAnalyticChannelClick('Login-Register', 'GaanaMobile', 'SMS Success');
                    $(_domElement).find('.app_inputBg').removeClass('app_inputBg');
                }
                _domStatusElement.html("<br/><br/>" + jsondata.message);
            } else {
                $('#popup .validateTips').show();
                $('#popup .validateTips').html(jsondata.message);
            }
        }
    });
};

function successCallback(data, $jq) {
    if ($.trim(data) == 'failed') {
        $jq.find("~.fail").fadeIn();
    } else {
        $jq.find("~.success").fadeIn();
    }
}

function errorCallback(error, $jq) {
    $jq.find("~.fail").fadeIn();
}

function beforeCallback($jq) {
    $jq.siblings(".success,.fail").fadeOut();
}
var feedback = {}
feedback.openPopup = function () {
    $(".validateTips").empty();
    $('#popup').remove();
    var formobj = {
        formname: 'registration-form',
        formid: 'feedbackform',
        emailid: 'email',
        nameid: 'name',
        messageid: 'message',
        feedbackddid: 'feedbacks',
        feedbackfor: 'feedbackfor',
        options: [{
            value: '',
            label: 'Plaese Select..'
        }, {
            value: 'User Experience',
            label: 'User Experience'
        }, {
            value: 'Design',
            label: 'Design'
        }, {
            value: 'Music',
            label: 'Music'
        }, {
            value: 'Player',
            label: 'Player'
        }, {
            value: 'Search',
            label: 'Search'
        }, {
            value: 'Any other feedback',
            label: 'Any other feedback'
        }],
        btnsubmitid: 'btnsignin',
        msg_feedback: ''
    }
    var template = $('#feedbacktpl').html();
    $('#popup').remove();
    var result = Mustache.render(template, formobj);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        width: 550,
        height: 470,
        modal: true,
        draggable: false,
        dialogClass: 'feedbacktitle',
        title: "FEEDBACK",
        closeText: '',
        show: {
            effect: "blind",
            duration: 1000
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "60px"
                });
            }
        },
        open: function () {
            $(this).css('overflow', 'hidden');
            var loggedusreid = jsuserdata.email;
            if (loggedusreid && loggedusreid != '') $('#email').val(decodeURIComponent(loggedusreid));
            var name = $("#name"),
                email = $("#email"),
                feedbackcat = $("#feedbacks"),
                message = $("#message"),
                allFields = $([]).add(name).add(email).add(feedbackcat),
                tips = $(".validateTips");
            $('.sortbydropdown').dropdownSortBy();
            $('#btnsignin').on('click', function () {
                try {
                    var bValid = true;
                    allFields.removeClass("ui-state-error");
                    bValid = bValid && checkLength(name, "name", 1, 256);
                    bValid = bValid && checkRegexp(name, /^[A-Za-z\s]+$/, "Special Characters or Numbers are not allowed");
                    bValid = bValid && checkLength(email, "email", 6, 32);
                    bValid = bValid && checkRegexp(email, /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/, "Invalid Email!");
                    bValid = bValid && checkRequired(feedbackcat, "Please Select Atleast one feedback category");
                    bValid = bValid && checkRequired(message, "Please Enter Message");
                    if (bValid) {
                        feedback.saveData()
                    } else {
                        tips.show();
                    }
                } catch (e) {
                    alert(e.message)
                }
            });
            $('body').delegate('.selectFeedback', 'click', function () {
                $('#feedbackfor').html($(this).attr('data-value'));
                $('#feedbacks').val($(this).attr('data-value'));
            });
        }
    });
}
feedback.saveData = function () {
    $.ajax({
        url: BASE_URL + 'ajax/feedback',
        data: $('#feedbackform').serialize() + '&action=send',
        type: 'post',
        cache: false,
        dataType: 'html',
        success: function (data) {
            $('#popup').dialog('close');
            messagebox.open({
                msg: message['feedback_message'],
                autoclose: false
            }, true);
        }
    });
}
var reportissue = {};
reportissue.openPopup = function () {
    $(".validateTips").empty();
    $('#popup').remove();
    var formobj = {
        formname: 'reoprtissue-form',
        formid: 'reportissueform',
        emailid: 'email',
        nameid: 'name',
        summaryid: 'summary',
        messageid: 'message',
        reportissueid: 'reportisue',
        reportissues: 'reportissues',
        options: [{
            value: 'Recently Added Questions',
            label: 'Recently Added Questions'
        }, {
            value: 'General Queries',
            label: 'General Queries'
        }, {
            value: 'Using Gaana',
            label: 'Using Gaana'
        }, {
            value: 'Managing Your Account',
            label: 'Managing Your Account'
        }, {
            value: 'Gaana for Android',
            label: 'Gaana for Android'
        }, {
            value: 'Gaana for iOs',
            label: 'Gaana for iOs'
        }, {
            value: 'Gaana for Blackberry',
            label: 'Gaana for Blackberry'
        }, {
            value: 'Gaana for Windows',
            label: 'Gaana for Windows'
        }, {
            value: 'Gaana for Others',
            label: 'Gaana for Others'
        }, {
            value: 'Gaana+',
            label: 'Gaana+'
        }],
        btnsubmitid: 'btnsignin'
    }
    var template = $('#reportissue').html();
    $('#popup').remove();
    var result = Mustache.render(template, formobj);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        width: 550,
        height: 470,
        modal: true,
        draggable: false,
        dialogClass: 'feedbacktitle',
        title: "Report an Issue",
        closeText: '',
        show: {
            effect: "blind",
            duration: 1000
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "60px"
                });
            }
        },
        open: function () {
            $(this).css('overflow', 'hidden');
            var loggedusreid = jsuserdata.email;
            if (loggedusreid && loggedusreid != '') $('#email').val(decodeURIComponent(loggedusreid));
            var email = $("#email"),
                issue = $("#reportisue"),
                message = $("#message"),
                allFields = $([]).add(name).add(email).add(issue),
                tips = $(".validateTips");
            $('.sortbydropdown').dropdownSortBy();
            $('#btnsignin').on('click', function () {
                try {
                    var bValid = true;
                    allFields.removeClass("ui-state-error");
                    bValid = bValid && checkLength(email, "email", 6, 32);
                    bValid = bValid && checkRegexp(email, /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/, "Invalid Email!");
                    bValid = bValid && checkRequired(issue, "Please Select Atleast One Recently Added Question");
                    bValid = bValid && checkRequired(message, "Please Enter Message");
                    if (bValid) {
                        reportissue.sendIssue()
                    } else {
                        tips.show();
                    }
                } catch (e) {
                    alert(e.message)
                }
            });
            $('body').delegate('.selectIssue', 'click', function () {
                $('#reportissues').html($(this).attr('data-value'));
                $('#reportisue').val($(this).attr('data-value'));
            });
        }
    });
}
reportissue.sendIssue = function () {
    $.ajax({
        url: BASE_URL + 'ajax/report_issue',
        data: $('#reportissueform').serialize(),
        type: 'post',
        cache: false,
        dataType: 'html',
        success: function (data) {
            $('#popup').dialog('close');
            messagebox.open({
                msg: message['report_issue'],
                autoclose: false
            }, true);
        }
    });
}
var login = {};
login.checklogin = function (isAjax) {
    var status = 0;
    if (isAjax) {
        $.ajax({
            url: BASE_URL + 'ajax/login',
            async: false,
            dataType: "json",
            data: {
                task: 'checkloginstatus'
            },
            success: function (res) {
                status = res.status;
            }
        })
        return status;
    }
    if (typeof jsuserdata != 'undefined' && jsuserdata != null && typeof jsuserdata.user_id != 'undefined' && parseInt(jsuserdata.user_id) > 0) {
        return 1;
    } else {
        return 0;
    }
}
login.logoutRefresh = function () {
    $('#count_notification').html('');
    $('#activity a').unbind('click');
    if (typeof notificationinterval != 'undefined' && notificationinterval != null) {
        clearInterval(notificationinterval);
    }
    if (typeof refreshSession != 'undefined' && refreshSession != null) {
        clearInterval(refreshSession);
    }
    paiduser();
    var url = window.location.href;
    if (url.indexOf('topgaana2013') != -1) {
        minisitelogoutrefresh();
        return;
    }
    if (url.indexOf('myfavorite') != -1) {
        url = url.split('/myfavorite');
        url = url[0];
    }
    if (url.indexOf('proceedpayment') != -1) {
        url = url.split('/proceedpayment');
        url = url[0];
    }
    if (url.indexOf('my_friends_activity') != -1) {
        url = url.split('/my_friends_activity');
        url = url[0];
    }
    if (url.indexOf('most-played-songs') != -1) {
        url = url.split('/playlist');
        url = url[0];
        if (url.indexOf('nowplaying') != -1) {
            url = url.split('/nowplaying');
            url = url[0];
        }
    }
    ajaxPageRequestHandler.invoke({
        url: url,
        'container': 'main_middle_content'
    });
    $('._nlogreg').html('');
    _userLoginStatus = false;
    jsuserdata = {};
    var nonloggedin_headerHtml = ['<div class="header_divider ft_lt"></div><a href="javascript:void(0)" id="login-button">Sign in / Sign up</a><div class="header_divider ft_rt"></div>  '].join('');
    $('._nlogreg').html(nonloggedin_headerHtml);
    $('._ngetgaana').html('<a onclick="registration.mobilepopup2()" href="javascript:void(0)">Get gaana<span>on mobile</span></a>');
    $('#playlistul').html('');
    $('#most_played_songs').html('');
    activateverticalScroller();
    $('.notification-right').animate({
        top: '-400px'
    }, {
        duration: 500,
        queue: false
    });
    $('#inAppNotificationsContainer').html('');
    if (typeof _variables.remote != 'undefined' && _variables.remote != null) {
        _variables.remote.onUserInfoUpdate($.toJSON({
            email: '',
            fbid: '',
            name: '',
            email: '',
            id: ''
        }))
    }
}
login.userFavset = function (userFav) {
    $(userFav).each(function () {
        if (this.album) {
            for (i = 0; i < this.album.length; i++) {
                $('#album-' + this.album[i]).addClass('favorite-white unfavorite');
            }
        }
        if (this.playlist) {
            for (i = 0; i < this.playlist.length; i++) {
                $('#playlist-' + this.playlist[i]).addClass('favorite-white unfavorite');
            }
        }
    })
}
login.loginRefresh = function (userinfo) {
    try {
        if (typeof userinfo == 'undefined') return;
        var url = window.location.href;
        if (url.indexOf('topgaana2013') != -1) {
            minisiteloginrefresh(userinfo);
            return;
        }
        if (url.indexOf('singalong') == -1) {
            ajaxPageRequestHandler.invoke({
                url: url,
                'container': 'main_middle_content'
            });
        }
        $('#_nlogreg').html('');
        if (typeof fbLoginCallback['arg'] != 'undefined') {
            utility.callFBapi(fbLoginCallback['arg']);
        }
        if (typeof loginCallback != 'undefined' && loginCallback != null) {
            setTimeout(function () {
                loginCallBack();
            }, 3000);
        }
        playlist.mostPopularPlaylist();
        loginWrapper(userinfo);
        if (userinfo.junkEmail == 0 || userinfo.junkEmail == null) {
            if (userinfo.verified == 'N') {
                verify.openPopUp();
            }
        } else {
            verify.openPopUp();
        }
        if (url.indexOf('singalong') != -1) {
            if (typeof _variables.remote != 'undefined' && _variables.remote != null) {
                _variables.remote.onUserInfoUpdate(userinfo)
            }
        }
        refreshSession = setInterval(function () {
            refreshUserSession();
        }, 120000);
        utility.blockui.remove();
    } catch (e) {
        alert(e.message)
    }
}
var coupon = {};
coupon.checkcoupon = function () {
    var status = '',
        msg = '';
    $.ajax({
        url: BASE_URL + 'ajax/coupon',
        async: false,
        type: "POST",
        data: $('#gaanaplusreedem').serialize(),
        success: function (data) {
            var results = JSON.parse(data);
            msg = results.message;
            status = results.result;
        }
    });
    return msg + '#' + status;
}
var gaanahelp = {};
gaanahelp.showQues = function (divId, divPos) {
    var divid = divId.split('_');
    ajaxPageRequestHandler.invoke({
        url: '/gaanahelplisting',
        'container': 'main_middle_content',
        'complete': function () {
            $('.inn_wrapper.helpques').css("display", "none");
            $('#' + divid[0]).css("display", "block");
            if (divId.indexOf('_') == -1) $("#askedQues").html($('#' + divId + '_').attr('alt'));
            else $("#askedQues").html($('#' + divId).attr('alt'));
        },
        'success': function () {
            if (divPos != '' && divPos) {
                $('html, body').animate({
                    scrollTop: $('#' + divPos).offset().top - 100
                }, 900);
                $('#' + divPos).addClass("bg-cream2");
                divPos = '';
            }
        }
    });
}
var gaanamobile = {};
gaanamobile.getappurl = function () {
    var appPlatfrm = $("#appPlatfrm"),
        a = appPlatfrm.val().split('|'),
        email = $('#usrmail'),
        allFields = $([]).add(email).add(appPlatfrm),
        tips = $(".validateTips");
    try {
        var bValid = true;
        allFields.removeClass("ui-state-error");
        bValid = bValid && checkLength(email, "email", 1, 255);
        bValid = bValid && checkRegexp(email, /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/, "Invalid Email!");
        bValid = bValid && checkRequired(appPlatfrm, "Please Select Atleast one Platform");
        if (bValid) {
            gaanamobile.sendEmail(a[0], a[1]);
        } else {
            $('#validateFrmMsg').html(tips.html()).css({
                display: "block"
            });
            $('#validateFrmMsg').addClass("ui-state-highlight");
            setTimeout(function () {
                $('#validateFrmMsg').removeClass("ui-state-highlight", 1500);
            }, 500);
        }
    } catch (e) {
        alert(e.message)
    }
}
gaanamobile.sendEmail = function (url, devicetype) {
    try {
        var usermail = $('#usrmail').val();
        var url = url;
        $.ajax({
            url: BASE_URL + 'ajax/email',
            data: {
                appurl: url,
                usermail: usermail,
                devicetype: devicetype
            },
            type: 'post',
            cache: false,
            dataType: 'html',
            success: function (msg) {
                $('#validateFrmMsg').html('');
                $('#usrmail').val('');
                $("#appPlatfrm").val('');
                messagebox.open({
                    msg: message['appurl_sent'],
                    autoclose: false
                }, true);
            },
            error: function () {}
        });
    } catch (e) {
        alert(e.message)
    }
}
var forgotpassword = {}
forgotpassword.openPopup = function (token, ssoUseremail) {
    $('#popup').remove();
    var template = $('#forgotpasswordtpl').html();
    var formobj = {
        'forgotpassword-password1': 'newpassword',
        'forgotpassword-password2': 'confirmpassword',
        'resetpassword_btn': 'resetpassword'
    }
    var result = Mustache.render(template, formobj);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        width: 417,
        modal: true,
        dialogClass: 'reset_password',
        draggable: false,
        title: "Reset your password?",
        closeText: '',
        show: {
            effect: "blind"
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "59px"
                });
            }
        }
    });
    var password = $("#popup #newpassword"),
        confirmpassword = $("#popup #confirmpassword");
    allFields = $([]).add(password).add(confirmpassword);
    $('#popup #resetpassword').on('click', function () {
        try {
            var bValid = true;
            allFields.removeClass("ui-state-error");
            bValid = bValid && checkLength(password, "password", 6, 14);
            bValid = bValid && isTwoFieldsAreEqual(password, confirmpassword);
            if (bValid) {
                var data = {
                    "password": password.val(),
                    "tokenPassword": token,
                    "repassword": confirmpassword.val(),
                    "hashedEmail": ssoUseremail
                }
                forgotpassword.submitRequest(data)
            }
        } catch (e) {
            alert(e.message)
        }
    });
}
forgotpassword.submitRequest = function (data) {
    try {
        $.ajax({
            url: BASE_URL + 'ajax/resetpassword',
            type: 'post',
            cache: false,
            data: data,
            dataType: 'html',
            success: function (forgotMessage) {
                $('#popup').remove();
                messagebox.open({
                    msg: forgotMessage,
                    autoclose: false
                }, true);
                setTimeout(function () {
                    window.location = BASE_URL;
                }, 5000);
            },
            error: function () {}
        });
    } catch (e) {
        alert(e.message)
    }
}
var verifyaccountsso = {}
verifyaccountsso.verify = function ($verificationCode) {
    try {
        var code = $verificationCode
        $.ajax({
            url: BASE_URL + 'ajax/claimmyaccount',
            data: {
                token: code
            },
            type: 'post',
            cache: false,
            dataType: 'html',
            success: function (verificationMessage) {
                $('#popup').remove();
                messagebox.open({
                    msg: verificationMessage,
                    autoclose: false
                }, true);
                setTimeout(function () {
                    createCookie("verified", 'yes', 365);
                    createCookie("user_verified", 'yes');
                    window.location = BASE_URL;
                }, 5000);
            },
            error: function () {}
        });
    } catch (e) {
        alert(e.message)
    }
}
var verify = {}
verify.checkVerification = function () {
    status = 0;
    $.ajax({
        url: BASE_URL + 'ajax/login',
        async: false,
        dataType: "json",
        data: {
            task: 'checkverifystatus'
        },
        success: function (res) {
            status = res.status;
        }
    })
    return status
}
verify.openPopUp = function () {
    var template = $('#new_verfication').html();
    var formobj = {
        emailid: 'verify_email',
        btnsubmitid: 'verifyemail',
        resendVerfId: 'resendemail'
    }
    var result = Mustache.render(template, formobj);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        closeOnEscape: false,
        autoOpen: true,
        width: 490,
        modal: true,
        dialogClass: 'Junkemail',
        title: "Verification",
        closeText: '',
        show: {
            effect: "blind",
            duration: 1000
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "60px"
                });
            }
        },
        open: function () {
            $(".validateTips").hide();
            $('#resendemail').on('click', function () {
                verify.resendEmailVerification();
            });
            var email = $("#verify_email"),
                allFields = $([]).add(email),
                tips = $(".validateTips");
            $('#verifyemail').on('click', function () {
                try {
                    var bValid = true;
                    allFields.removeClass("ui-state-error");
                    bValid = bValid && checkLength(email, "email", 6, 32);
                    bValid = bValid && checkRegexp(email, /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/, "Invalid Email!");
                    if (bValid) {
                        verify.sendEmailVerification(email.val());
                    } else {
                        tips.show();
                    }
                } catch (e) {
                    alert(e.message)
                }
            });
        }
    });
    gAnalyticVirtualPageview('/virtual/verify-popup');
}
verify.resendEmailVerification = function () {
    var status = 0;
    $.ajax({
        url: BASE_URL + 'ajax/resendverificationemail',
        type: 'post',
        cache: false,
        dataType: 'html',
        beforeSend: function () {
            utility.blockui.init();
        },
        complete: function () {
            utility.blockui.remove();
        },
        success: function (res) {
            var result = $.parseJSON(res);
            status = result.status;
            if ($.trim(status) != 0 && $.trim(status) == 1) {
                $('#popup').remove();
                createCookie("verified", 'no', 365);
                verify.resendMessagePopup();
            }
        }
    });
}
verify.resendMessagePopup = function () {
    var template = $('#verifiedmessage').html();
    var result = Mustache.render(template, null);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        closeOnEscape: false,
        width: 490,
        modal: true,
        dialogClass: 'Junkemail',
        closeText: '',
        show: {
            effect: "blind",
            duration: 1000
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "59px"
                });
            }
        }
    });
};
verify.couponCode = function (couponcode) {
    status = 0;
    try {
        $.ajax({
            url: BASE_URL + 'ajax/verifycoupon',
            data: {
                "couponcode": couponcode
            },
            type: 'post',
            async: false,
            dataType: "json",
            success: function (res) {
                status = res.status;
                if (status) {
                    $('#popup').remove();
                    messagebox.open({
                        msg: res.message,
                        autoclose: false
                    }, true);
                    window.location.href = BASE_URL;
                }
            }
        })
    } catch (e) {
        alert(e.message)
    }
}
verify.sendEmailVerification = function (emailId) {
    $.ajax({
        url: BASE_URL + 'ajax/sendJunkEmailVerification',
        data: {
            email: emailId,
            action: 'send_otp'
        },
        type: 'post',
        cache: false,
        dataType: 'html',
        beforeSend: function () {
            utility.blockui.init();
        },
        complete: function () {
            utility.blockui.remove();
        },
        success: function (data) {
            var result = $.parseJSON(data);
            if ($.trim(result.sucess) != '') {
                $('#popup').remove();
                gAnalyticChannelClick("Edit email address Popup", "Send Verification Code", "edit_email_popup");
                junkemail.verifiyCode();
            } else if ($.trim(result.error) != '') {
                $('#popup #verify_email').focus();
                $("#newverficationpopup .validateTips").html("Email already exist.").show();
            }
        }
    });
}
var imagecrop = {}
imagecrop.openPopup = function () {
    $('#popup').remove();
    var template = $('#imagecroptpl').html();
    var result = Mustache.render(template, null);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        width: 505,
        modal: true,
        dialogClass: 'imagecrop',
        draggable: false,
        title: "Image Croper",
        closeText: '',
        show: {
            effect: "blind"
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "60px"
                });
            }
        },
        open: function () {
            $('#popup #imagecropifr').attr('src', BASE_URL + 'cropper/cropper?action=showcropper')
        }
    });
}
imagecrop.closePopup = function (imagename, imgpath) {
    $('#popup').remove();
    if (typeof imagename === 'undefined' || typeof imgpath === 'undefined') {
        return;
    }
    var profieimg = BASE_URL + imgpath;
    $('#profileimageid').attr('src', profieimg);
    imagecrop.imageSave(imagename);
}
imagecrop.imageSave = function (img) {
    status = 0;
    $.ajax({
        url: BASE_URL + 'ajax/updateuserprofile',
        async: false,
        dataType: "html",
        data: {
            task: 'updateimg',
            imagename: img
        },
        success: function (res) {
            $("#profilepicsucess").removeClass('hide');
            $("#profilepicsucess").addClass('show');
            var loggedin_headerHtml = ['<div class="header-Advertise-block" id="Gaana-Top-Slug"></div><div class="bor-r ft_lt col65per signedin" >', '<div class="ft_lt marrt10"><a href="/myzone" class="pjax"><img src="', BASE_URL + 'files/tempimg/' + img, '" width="25" height="25"/></a></div>', '<div class="ft_lt relative">', jsuserdata.username, '</div><div class="ft_rt relative"><a href="javascript:void(0)" class="login-setting"></a></div>', '<div id="signedin-menu" class="clearfix">', '<ul><li><span id="my-zone"></span><a href="/myzone" class="pjax a-d1" data-type="url" data-value="/myzoe">My Zone</a></li>', '<!--<li><span id="my-settings"></span><a href="/settings" data-type="url" data-value="/settings" class="a-d1 pjax">Settings</a></li>-->', '<!-- <li><span id="my-theme"></span><a href="javascript:void(0)" class="a-d1">Themes</a></li> -->', '<li><span id="sign-out"></span><a href="javascript:void(0)" id="logout-button" class="a-d1">Sign-Out</a></li>', '</ul><div class="clear"></div></div></div>', ].join('')
            $('#login-header-container').html(loggedin_headerHtml);
        }
    })
}

function send_invitation(fb_frnd_id, obj) {
    FB.ui({
        method: 'apprequests',
        message: 'Awesome music on gaana.com',
        to: fb_frnd_id
    }, function (response) {
        if (typeof response.error_message == 'undefined') {
            gAnalyticChannelClick('Login-Register', 'Follow', 'FB Friends');
            $(obj).removeClass('favorite').css('cursor', 'default');
            $(obj).addClass('follow_active');
            $(obj).html('Invited');
            $(obj).attr('onclick', '');
            $.ajax({
                url: BASE_URL + "ajax/login",
                data: {
                    "task": "inviteByFBIds",
                    "friendFBId": fb_frnd_id
                },
                type: 'post',
                success: function (result) {}
            })
        }
    })
}

function followFriend(obj) {
    var followstr = $('#follow-row-' + obj).html();
    var followobj = $.parseJSON(followstr);
    var row = {};
    row.activity_type = 'toggle_follow';
    row.task = "push_mytimes_data";
    row.status = 0;
    target_user_id = followobj.gaana_id
    row.target_user_sso_id = followobj.target_sso_id
    $.ajax({
        url: BASE_URL + "ajax/myTimesActivities",
        data: row,
        type: 'post',
        success: function (result) {
            gAnalyticChannelClick('Login-Register', 'Follow', 'Top Users');
            $('#' + obj).removeClass('favorite').css('cursor', 'default');
            $('#' + obj).addClass('follow_active');
            $('#' + obj).html('Following');
            $('#' + obj).attr('onclick', '');
        }
    })
}
var fbmessage = {}
fbmessage.openPopUp = function () {
    var template = $('#retrievId').html();
    var result = Mustache.render(template, null);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        width: 425,
        modal: true,
        dialogClass: 'id_retrieval',
        title: '',
        draggable: false,
        closeText: '',
        show: {
            effect: "blind",
            duration: 200
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "60px"
                });
            }
        }
    });
}
registration.v1Check = function () {
    if (login.checklogin() == 0) {
        registration.openPopup();
        return false;
    }
    return true;
}
var junkemail = {};
junkemail.resetJunkemail = function () {
    var formobj = {
        emailid: 'junkemail',
        btnsubmitid: 'restrc_junkemail'
    }
    var template = $('#restrict_junkemail').html();
    var result = Mustache.render(template, formobj);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        closeOnEscape: false,
        width: 490,
        modal: true,
        dialogClass: 'Junkemail',
        title: "",
        closeText: '',
        show: {
            effect: "blind",
            duration: 1000
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "60px"
                });
            }
        },
        open: function () {
            $(this).css('overflow', 'hidden');
            gAnalyticVirtualPageview('/virtual/edit-email-address-popup');
            var email = $("#junkemail"),
                allFields = $([]).add(email),
                tips = $(".validateTips");
            $('#restrc_junkemail').on('click', function () {
                try {
                    var bValid = true;
                    allFields.removeClass("ui-state-error");
                    bValid = bValid && checkLength(email, "email", 6, 32);
                    bValid = bValid && checkRegexp(email, /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/, "Invalid Email!");
                    if (bValid) {
                        junkemail.sendVerification(email.val());
                    } else {
                        tips.show();
                    }
                } catch (e) {
                    alert(e.message)
                }
            });
        }
    });
}
junkemail.sendVerification = function (emailId) {
    $.ajax({
        url: BASE_URL + 'ajax/sendJunkEmailVerification',
        data: {
            email: emailId,
            action: 'send_otp'
        },
        type: 'post',
        cache: false,
        dataType: 'html',
        beforeSend: function () {
            utility.blockui.init();
        },
        complete: function () {
            utility.blockui.remove();
        },
        success: function (data) {
            var result = $.parseJSON(data);
            if ($.trim(result.sucess) != '') {
                $('#popup').remove();
                gAnalyticChannelClick("Edit email address Popup", "Send Verification Code", "edit_email_popup");
                junkemail.verifiyCode();
            } else if ($.trim(result.error) != '') {
                $('#popup #junkemail').focus();
                $("#junkemailpopup .validateTips").html("Email already exist.");
            }
        }
    });
}
junkemail.verifiyCode = function () {
    $(".validateTips").hide();
    var formobj = {
        verifyid: 'verifycode',
        btnsubmitid: 'check_verifycode'
    }
    var template = $('#verify_junkemail').html();
    var result = Mustache.render(template, formobj);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        closeOnEscape: false,
        width: 490,
        modal: true,
        dialogClass: 'Junkemail',
        title: "",
        closeText: '',
        show: {
            effect: "blind",
            duration: 1000
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "60px"
                });
            }
        },
        open: function () {
            gAnalyticVirtualPageview('/virtual/enter-verify-code-popup');
            $(this).css('overflow', 'hidden');
            $('#check_verifycode').on('click', function () {
                try {
                    junkemail.checkVerifiyCode($("#verifycode").val());
                } catch (e) {
                    alert(e.message)
                }
            });
        }
    });
}
junkemail.checkVerifiyCode = function (verifyCode) {
    $.ajax({
        url: BASE_URL + 'ajax/sendJunkEmailVerification',
        data: {
            code: verifyCode,
            action: 'verify'
        },
        type: 'post',
        cache: false,
        dataType: 'html',
        beforeSend: function () {
            utility.blockui.init();
        },
        complete: function () {
            utility.blockui.remove();
        },
        success: function (data) {
            var result = $.parseJSON(data);
            if ($.trim(result.sucess) != '' && $.trim(result.sucess) == 'verified') {
                gAnalyticChannelClick("Email verification code Popup", "Enter Verification Code", "enter_verificationcode_popup");
                $('#popup').dialog('close');
                $('#popup').remove();
                messagebox.open({
                    msg: message['resetjunkemail'],
                    autoclose: false
                }, true);
                setTimeout(function () {
                    window.location = BASE_URL;
                }, 1000);
            } else {
                $('#popup #verify_junkemail').focus();
                $("#junkemailpopup .validateTips").html(result.error).show();
            }
        }
    });
}
var privacy = {};
privacy.setPrivacy = function (fname, fvalue) {
    $.ajax({
        url: BASE_URL + 'ajax/settings',
        data: {
            name: fname,
            value: fvalue
        },
        type: 'post',
        cache: false,
        dataType: 'html',
        success: function (data) {
            if ($.trim(data) == 'Success') {}
        }
    });
}

function getGoogleSwitchConfirmation() {
    var url = BASE_URL + 'getgoogleconnect';
    var title = 'Google'
    window.open(url, title, "menubar=0,resizable=0,width=500,height=300");
}
registration.showSongFavoritePopup = function (songInfo) {
    var parentrowobj = $('#parent-row-song' + songInfo.id);
    utility.targetObj = $('#song' + songInfo.id);
    utility.parentrowobj = parentrowobj;
    utility.row = songInfo;
    var cbJS = "utility.addToFavorite()";
    checkSessionAndExecute({
        CBJS: cbJS,
        cbOBJ: {
            target: utility.targetObj
        }
    }, 'favorite', songInfo, 'show_song_favorite');
}
registration.showArtistFavoritePopup = function (songInfo) {
    var parentrowobj = $('#parent-row-artist' + songInfo.id);
    utility.targetObj = $('#favorite_artist' + songInfo.id);
    utility.parentrowobj = parentrowobj;
    utility.row = songInfo;
    var cbJS = "utility.addToFavorite()";
    checkSessionAndExecute({
        CBJS: cbJS,
        cbOBJ: {
            target: utility.targetObj
        }
    }, 'favorite', songInfo, 'show_artist_favorite');
}
registration.showSongFavorite = function (songInfo, fav_count) {
    var song_html = '<div class="song-pop">\n\
<h2>You are obsessed with <span class="org_txt">' + html_entity_decode(songInfo.title) + '</span> from \n\
<span class="org_txt">' + html_entity_decode(songInfo.albumtitle) + '</span>.\n\
 Add to your Favourites.</h2>\n\
<img src="' + songInfo.albumartwork + '" width="175" height="175" alt="" />\n\
<p class="ts14"><span class="follow-count">' + fav_count + '</span> People love this song</p>\n\
<p class="ts18 brd-top"><strong>Sign up</strong> to Favourite and Share the songs you love</p>\n\
</div>';
    $('.friends-pop').html(song_html);
    gAnalyticVirtualPageview('/virtual/song-repeat-contextual-popup');
}
registration.showArtistFavorite = function (songInfo, fav_count) {
    songInfo.action = 'get_artist_artwork';
    $.ajax({
        url: BASE_URL + 'ajax/favorite',
        data: songInfo,
        type: 'POST',
        success: function (result_msg) {
            delete songInfo.action;
            var song_html = '<div class="artist-pop">\n\
 <h2>You love listening to <span class="org_txt">' + songInfo.title + '</span>.\n\
 Favourite to get regular updates about the artist.</h2>\n\
<img width="175" height="175" alt="" src="' + result_msg + '">\n\
<p class="ts14"><span class="follow-count">' + fav_count + '</span>People follow this artist</p>\n\
<p class="ts18 brd-top"><strong>Sign up</strong> to add\n\
<span class="org_txt">' + songInfo.title + '</span> to your favourites.</p>\n\
</div>';
            $('.friends-pop').html(song_html);
            gAnalyticVirtualPageview('/virtual/artist-repeat-contextual-popup');
        }
    });
}
registration.showFacebookFriends = function () {
    FB.getLoginStatus(function (response) {
        if (response.status === 'unknown') {
            return;
        } else {
            var skip_limit = readCookie('skip_limit');
            var fb_later = readCookie('fbpopup_check');
            var consuption_limit = readCookie('consumption_limit');
            if (jsuserdata.username !== null || skip_limit !== null || fb_later !== null || consuption_limit !== null) {
                return;
            }
            registration.openPopup(null, null, null, 'show_facebook_friend');
            gAnalyticVirtualPageview('/virtual/fifteen-mins-contextual-popup');
            $('.friends-pop').html('');
            var facebook_html = '<div class="facebook_friends"><h2>Your friends who love listening <br/>on <span class="org_txt">Gaana</span></h2>\n\
<div class="frndlist"><iframe src="//www.facebook.com/plugins/facepile.php?app_id=183019041719404&amp;href=https%3A%2F%2Fwww.facebook.com%2Fgaana.com&amp;action&amp;width&amp;height&amp;max_rows=3&amp;colorscheme=light&amp;size=medium&amp;show_count=false&amp;appId=183019041719404" scrolling="no" frameborder="0" style="border:none; overflow:hidden;" allowTransparency="true"></iframe></div>\n\
<p class="ts18 brd-top"><strong>Sign up</strong> to Favorite and Share<br/> the songs you love.</p>\n\
<div class="pop-f-a-s">\n\
<ul><li><span class="pop-fav"></span>Add to your favourites</li>\n\
<li><span class="pop-add"></span>Create your own playlists</li>\n\
<li><span class="pop-share"></span>Share with your friends</li></ul>\n\
</div></div>';
            $('.friends-pop').html(facebook_html);
        }
    });
}
gaanapluspopup = {};
gaanapluspopup.openpopup = function () {
    $('#popup').remove();
    var template = $('#gaanaplus_order').html();
    var result = Mustache.render(template, null);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        width: 590,
        height: 470,
        modal: true,
        draggable: false,
        dialogClass: 'gaanaplus_poppup',
        title: "",
        closeText: '',
        show: {
            effect: "blind",
            duration: 1000
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": ($(window).innerHeight() - 450) / 2
                });
            }
        },
        open: function () {}
    })
}
gaanapluspopup.extendpopup = function () {
    $('.friends-pop').html('');
    var image_url = BASE_URL + 'images/gaana+_promo.gif'
    var html = '<div id="gaana-plus-reg-popup" class="gaanaplus-plan-reg-popup"><img id="gaanaplusPlanRegPop" src="' + image_url + '"></div>';
    registration.openPopup(null, null, 'gaanaplusPromo', 'show_gaanaplus_plan');
    $('.friends-pop').html(html);
    $('#popup .friends-pop').show();
    gAnalyticVirtualPageview('/virtual/gaana-plus-contextual-popup');
}
gaanapluspopup.process = function (prod_details, check_paid) {
    console.log('prod_details' + JSON.stringify(prod_details));
    if (typeof prod_details == 'undefined' || prod_details == '' || prod_details == null) {
        gaanapluspopup.openpopup();
        return;
    }
    if (typeof jsuserdata.verified != 'undefined' && jsuserdata.verified == 'N') {
        verify.openPopUp();
        return;
    }
    if (check_paid === true) {
        var paid_type = gaanaPlusUserStatus();
        if (paid_type == "valid") {
            var showpopupcheck = gaanapluspopup.checkPaidUser(prod_details);
            console.log('showpopupcheck' + showpopupcheck);
            if (showpopupcheck === false) {
                $('.gaana_plus_subscribe').css('visibility', 'visible');
                $('.gaana_no_ads_subscribe').css('visibility', 'visible');
                return;
            }
        }
    }
    $.ajax({
        url: BASE_URL + 'ajax/gaanaplus_process',
        data: {
            action: 'getorderid',
            params: prod_details
        },
        dataType: 'json',
        type: 'POST',
        success: function (result_msg) {
            if (result_msg.status == 1 && result_msg.order_id > 0) {
                url = BASE_URL + "proceedpayment/";
                $('#popup').remove();
                ajaxPageRequestHandler.invoke({
                    url: url,
                    'container': 'main_middle_content'
                });
            }
        }
    });
}
gaanapluspopup.proceedPayment = function () {
    $('#popup').remove();
    var url = BASE_URL + 'proceedpayment'
    ajaxPageRequestHandler.invoke({
        url: url,
        'container': 'main_middle_content'
    });
}
gaanapluspopup.checkPaidUser = function (prod_details) {
    var result = true;
    if (typeof prod_details == 'undefined' || prod_details == null || prod_details == '') {
        return;
    }
    var prod_type = prod_details.ptype;
    switch (prod_type) {
        case 'no_ads':
            if (typeof jsuserdata.paidUserProdProperties != 'undefined' && jsuserdata.paidUserProdProperties != null) {
                result = false;
                var disp_message = null;
                var options = {};
                if (typeof jsuserdata.paidUserProdProperties.product_type !== 'udefined' && jsuserdata.paidUserProdProperties.product_type === 'no_ads') {
                    disp_message = message['noads_user_noads_message'];
                    options = {
                        template_id: 'noadstpl',
                        popup_class: 'showmessagebox',
                        header_message: null,
                        disp_message: disp_message,
                        is_prompt: false,
                        width: '420',
                        close_btn: true,
                        yesCallback: function () {},
                        noCallback: null
                    };
                    messagebox.showMessage(options);
                } else if (typeof jsuserdata.paidUserProdProperties.product_type !== 'udefined' && jsuserdata.paidUserProdProperties.product_type === 'gaana_plus') {
                    disp_message = message['noads_user_gaanaplus_message'];
                    options = {
                        template_id: 'noadstpl',
                        popup_class: 'showmessagebox',
                        header_message: null,
                        disp_message: disp_message,
                        is_prompt: false,
                        width: '420',
                        close_btn: true,
                        yesCallback: function () {},
                        noCallback: null
                    };
                    messagebox.showMessage(options);
                } else {
                    gaanapluspopup.process(prod_details, false);
                }
            }
            break;
        case 'gaana_plus':
            if (typeof jsuserdata.paidUserProdProperties != 'undefined' && jsuserdata.paidUserProdProperties != null) {
                result = false;
                var disp_message = null;
                var options = {};
                if (typeof jsuserdata.paidUserProdProperties.product_type !== 'udefined' && jsuserdata.paidUserProdProperties.product_type === 'no_ads') {
                    disp_message = message['gaanaplus_user_noads_message'];
                    options = {
                        template_id: 'noadstpl',
                        popup_class: 'showmessagebox',
                        header_message: null,
                        disp_message: disp_message,
                        is_prompt: true,
                        width: '420',
                        close_btn: false,
                        yesCallback: function () {
                            gaanapluspopup.process(prod_details, false);
                        },
                        noCallback: null
                    };
                } else if (typeof jsuserdata.paidUserProdProperties.product_type !== 'udefined' && jsuserdata.paidUserProdProperties.product_type === 'gaana_plus') {
                    disp_message = message['gaanaplus_user_gaanaplus_message'];
                    options = {
                        template_id: 'noadstpl',
                        popup_class: 'showmessagebox',
                        header_message: null,
                        disp_message: disp_message,
                        is_prompt: false,
                        width: '420',
                        close_btn: false,
                        yesCallback: function () {},
                        noCallback: null
                    };
                }
                messagebox.showMessage(options);
            }
            break;
        default:
            gaanapluspopup.process(prod_details, false);
            break;
    }
    return result;
};
var playlist = {};
playlist.openPopup = function () {
    $('#popup').remove()
    var template = $('#createplaylisttpl').html();
    var formobj = {
        btncreateid: 'createplaylist_btn',
        nameid: 'playlist_name',
        chkvisibility: 'chkvisibility'
    }
    var result = Mustache.render(template, formobj);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        closeText: '',
        dialogClass: 'paddingtop',
        draggable: false,
        modal: true,
        title: "Create a Playlist",
        show: {
            effect: "blind",
            duration: 1000
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "59px"
                });
            }
        },
        open: function () {
            utility.blockui.remove();
            var name = $("#playlist_name"),
                allFields = $([]).add(name),
                tips = $(".validateTips");
            $(".validateTips").empty();
            tips.hide();
            allFields.removeClass("ui-state-error");
            $('.chkvisibility').check();
            $('.chkvisibility').trigger('click');
            $("input[type='text']").blankInput();
            $('#createplaylist_btn').on('click', function () {
                try {
                    var bValid = true;
                    allFields.removeClass("ui-state-error");
                    bValid = bValid && checkRequired(name, "Please Enter Playlist", "Playlist Name");
                    if (bValid) {
                        tips.hide();
                        if (playlist.sourceobj != null && !playlist.sourceobj != 'undefined') {
                            var data = {
                                action: 'createplaylist',
                                source: playlist.sourceobj,
                                playlistname: name.val(),
                                chkvisibility: $('.chkvisibility').val()
                            }
                        } else {
                            var data = {
                                action: 'createplaylist',
                                playlistname: name.val(),
                                chkvisibility: $('.chkvisibility').val()
                            }
                        }
                        var status = playlist.createPlayList(data);
                        if (status == 0) {
                            tips.show()
                            checkRequired(name, "Playlist already exists", name.val());
                        } else if (status == 'not_loggedin') {
                            registration.openPopup();
                            return false;
                        } else if (status == 'not_verified') {
                            verify.openPopUp();
                            return false;
                        }
                    } else {
                        tips.show();
                    }
                } catch (e) {
                    alert(e.message)
                }
            })
            name.on('keypress', function (e) {
                return utility.validateName(e, this);
            })
        }
    });
    / * form fields */
}
playlist.addtoplaylist = function () {
    utility.blockui.init();
    var myplaylist = playlist.myplaylist({
        limit: null
    });
    if (myplaylist == false) {
        utility.blockui.remove();
        return false;
    }
    if (myplaylist.resultset.length == 0) {
        utility.blockui.remove();
        playlist.openPopup();
        return false;
    }
    $('#popup').remove();
    var list = {
        myplist: myplaylist.resultset,
        btncreateid: 'createplaylist_btn',
        nameid: 'playlist_name',
        chkvisibility: 'chkvisibility',
        playlistlist: '_playlist_list'
    }
    var template = $('#addPlaylist').html();
    var result = Mustache.render(template, list);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        closeText: '',
        dialogClass: 'addtoplaylist',
        draggable: false,
        width: 420,
        modal: true,
        title: "Add to Playlist",
        show: {
            effect: "blind",
            duration: 1000
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "59px"
                });
            }
        },
        open: function () {
            utility.blockui.remove();
            var name = $("#playlist_name"),
                allFields = $([]).add(name),
                tips = $(".validateTips");
            $('.chkvisibility').check();
            $('.chkvisibility').trigger('click');
            $("input[type='text']").blankInput();
            $('#createplaylist_btn').on('click', function () {
                try {
                    var bValid = true;
                    allFields.removeClass("ui-state-error");
                    bValid = bValid && checkRequired(name, "Please Enter Playlist", "Playlist Name");
                    if (bValid) {
                        var data = {
                            action: 'createplaylist',
                            playlistname: name.val(),
                            source: playlist.sourceobj,
                            chkvisibility: $('.chkvisibility').val()
                        }
                        var status = playlist.createPlayList(data);
                        if (status == 0) {
                            tips.show()
                            checkRequired(name, "Playlist already exists", name.val());
                        } else if (status == 'not_loggedin') {
                            registration.openPopup();
                            return false;
                        } else if (status == 'not_verified') {
                            verify.openPopUp();
                            return false;
                        }
                    } else {
                        tips.show();
                    }
                } catch (e) {
                    alert(e.message)
                }
            })
            name.on('keypress', function (e) {
                return utility.validateName(e, this);
            })
            $('._playlist_list').each(function (index) {
                $(this).on('click', function () {
                    playlist.destination = list.myplist[index];
                    playlist.save();
                })
            })
        },
        close: function () {
            delete playlist.destination;
            delete playlist.sourceobj;
        }
    });
}
playlist.myplaylist = function (options) {
    var response = "";
    $.ajax({
        url: BASE_URL + 'ajax/playlist',
        async: false,
        dataType: 'json',
        method: 'post',
        data: {
            action: 'selectmyplaylist',
            limit: options.limit
        },
        success: function (data) {
            if (data.status == 'not_loggedin') {
                registration.openPopup();
                return false;
            } else if (data.status == 'not_verified') {
                verify.openPopUp();
                return false;
            } else {
                response = data;
            }
        },
        error: function () {}
    })
    return response;
}
playlist.save = function () {
    var response = "";
    $.ajax({
        url: BASE_URL + 'ajax/playlist',
        async: false,
        dataType: 'json',
        method: 'post',
        data: {
            action: 'saveplaylist',
            source: playlist.sourceobj,
            destination: playlist.destination
        },
        success: function (data) {
            if (data.status == 1) {
                var dataObject = playlist.sourceobj;
                var song_title = dataObject.title;
                if (typeof song_title == 'undefined') {
                    song_title = 'Queue';
                }
                var show_message = messagebox.message(message['songadded_to_playlist'], song_title);
                dataObject.playlist_id = playlist.destination.id;
                messagebox.open({
                    msg: show_message,
                    autoclose: true
                })
            } else if (data.status == 'not_loggedin') {
                registration.openPopup();
                return false;
            } else if (data.status == 'not_verified') {
                verify.openPopUp();
                return false;
            }
        },
        error: function () {}
    })
    return response;
}
playlist.createPlayList = function (data) {
    var status = 0;
    var playlistname = data.playlistname;
    $.ajax({
        url: BASE_URL + 'ajax/playlist',
        async: false,
        dataType: 'json',
        data: data,
        method: 'post',
        success: function (data) {
            status = data.status;
            if (data.status == 1) {
                playlist.sourceobj = null
                show_message = messagebox.message(message['createplaylist'], playlistname);
                messagebox.open({
                    msg: show_message,
                    autoclose: true
                });
                playlist.refereshMyPlaylist();
            } else if (data.status == 0) {}
        },
        error: function () {}
    })
    return status
}
playlist.refereshMyPlaylist = function () {
    var response = "";
    $.ajax({
        url: BASE_URL + 'ajax/playlist',
        async: true,
        dataType: 'json',
        method: 'post',
        data: {
            action: 'selectmyplaylist',
            limit: 5
        },
        success: function (data) {
            if (data.status == 'not_loggedin') {
                registration.openPopup();
                return false;
            } else if (data.status == 'not_verified') {
                return false;
            } else {
                var myplaylist = data
                var is_more;
                if (typeof myplaylist.resultset == 'undefined' || myplaylist.resultset.length < 1) return false;
                if (myplaylist.count > 5) {
                    is_more = true;
                } else {
                    is_more = false;
                }
                var list = {
                    myplist: myplaylist.resultset,
                    myplistPopular: myplaylist.resultset_popular,
                    myplaylistleft: 'myplaylistleft',
                    is_more: is_more
                }
                var template = $('#myplaylistleft').html();
                var result = Mustache.render(template, list);
                $('#playlistul').html(result);
                activateverticalScroller();
            }
        },
        error: function () {}
    })
}
playlist.editPlaylist = function () {
    utility.blockui.init();
    var name = $("#playlist_title"),
        allFields = $([]).add(name),
        tips = $(".validateTips");
    playlist_title = $('#playlist_title').val();
    playlist_id = $('#play_list_id').val();
    playlist_seo_key = $('#playlist_seo_key').val();
    is_public = $('#chkvisibility').val();
    var bValid = true;
    allFields.removeClass("ui-state-error");
    bValid = bValid && checkRequired(name, "Please Enter Playlist", "Playlist Name");
    if (bValid) {
        tips.hide();
        if (typeof _deletedtrackIds !== 'undefined' && _deletedtrackIds.length > 0 || playlist_title != '') {
            try {
                deletedTrackids = _deletedtrackIds.join();
                $("#save_playlist").hide();
                $.ajax({
                    type: 'post',
                    url: BASE_URL + 'ajax/playlist',
                    data: {
                        'action': 'editplaylist',
                        'playlist_id': playlist_id,
                        'playlist_title': playlist_title,
                        'deletedTrackids': deletedTrackids,
                        'is_public': is_public
                    },
                    success: function (data) {
                        if ($.trim(data) == 'success') {
                            playlist.refereshMyPlaylist();
                            _deletedtrackIds = [];
                            ajaxPageRequestHandler.invoke({
                                url: BASE_URL + playlist_seo_key,
                                'container': 'main_middle_content'
                            });
                        } else if (data.status == 'not_loggedin') {
                            registration.openPopup();
                            return false;
                        } else if (data.status == 'not_verified') {
                            verify.openPopUp();
                            return false;
                        }
                    }
                });
            } catch (e) {
                errorLog(e.message, 'issue in edit playlist');
            }
        } else {
            errorLog('error', 'issue in edit playlist');
        }
    } else {
        utility.blockui.remove();
        tips.show();
        console.log('validation');
    }
}
playlist.mostPopularPlaylist = function () {
    $.ajax({
        url: BASE_URL + 'ajax/playlist',
        async: true,
        dataType: 'json',
        method: 'post',
        data: {
            action: 'selectmostpopular'
        },
        success: function (response) {
            if (response == null) {
                return false;
            } else {
                var list = {
                    myplistPopular: response.resultset_popular
                }
                var template = $('#myplaylistleft').html();
                var result = Mustache.render(template, list);
                $('#most_played_songs').html(result);
            }
        },
        error: function () {}
    })
};
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */ (function (root, factory) {
    if (typeof exports === "object" && exports) {
        factory(exports);
    } else {
        var mustache = {};
        factory(mustache);
        if (typeof define === "function" && define.amd) {
            define(mustache);
        } else {
            root.Mustache = mustache;
        }
    }
}(this, function (mustache) {
    var whiteRe = /\s*/;
    var spaceRe = /\s+/;
    var nonSpaceRe = /\S/;
    var eqRe = /\s*=/;
    var curlyRe = /\s*\}/;
    var tagRe = /#|\^|\/|>|\{|&|=|!/;
    var RegExp_test = RegExp.prototype.test;

    function testRegExp(re, string) {
        return RegExp_test.call(re, string);
    }

    function isWhitespace(string) {
        return !testRegExp(nonSpaceRe, string);
    }
    var Object_toString = Object.prototype.toString;
    var isArray = Array.isArray || function (obj) {
            return Object_toString.call(obj) === '[object Array]';
        };

    function escapeRegExp(string) {
        return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    }
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }

    function Scanner(string) {
        this.string = string;
        this.tail = string;
        this.pos = 0;
    }
    Scanner.prototype.eos = function () {
        return this.tail === "";
    };
    Scanner.prototype.scan = function (re) {
        var match = this.tail.match(re);
        if (match && match.index === 0) {
            this.tail = this.tail.substring(match[0].length);
            this.pos += match[0].length;
            return match[0];
        }
        return "";
    };
    Scanner.prototype.scanUntil = function (re) {
        var match, pos = this.tail.search(re);
        switch (pos) {
            case -1:
                match = this.tail;
                this.pos += this.tail.length;
                this.tail = "";
                break;
            case 0:
                match = "";
                break;
            default:
                match = this.tail.substring(0, pos);
                this.tail = this.tail.substring(pos);
                this.pos += pos;
        }
        return match;
    };

    function Context(view, parent) {
        this.view = view || {};
        this.parent = parent;
        this._cache = {};
    }
    Context.make = function (view) {
        return (view instanceof Context) ? view : new Context(view);
    };
    Context.prototype.push = function (view) {
        return new Context(view, this);
    };
    Context.prototype.lookup = function (name) {
        var value = this._cache[name];
        if (!value) {
            if (name == '.') {
                value = this.view;
            } else {
                var context = this;
                while (context) {
                    if (name.indexOf('.') > 0) {
                        value = context.view;
                        var names = name.split('.'),
                            i = 0;
                        while (value && i < names.length) {
                            value = value[names[i++]];
                        }
                    } else {
                        value = context.view[name];
                    }
                    if (value != null) break;
                    context = context.parent;
                }
            }
            this._cache[name] = value;
        }
        if (typeof value === 'function') value = value.call(this.view);
        return value;
    };

    function Writer() {
        this.clearCache();
    }
    Writer.prototype.clearCache = function () {
        this._cache = {};
        this._partialCache = {};
    };
    Writer.prototype.compile = function (template, tags) {
        var fn = this._cache[template];
        if (!fn) {
            var tokens = mustache.parse(template, tags);
            fn = this._cache[template] = this.compileTokens(tokens, template);
        }
        return fn;
    };
    Writer.prototype.compilePartial = function (name, template, tags) {
        var fn = this.compile(template, tags);
        this._partialCache[name] = fn;
        return fn;
    };
    Writer.prototype.getPartial = function (name) {
        if (!(name in this._partialCache) && this._loadPartial) {
            this.compilePartial(name, this._loadPartial(name));
        }
        return this._partialCache[name];
    };
    Writer.prototype.compileTokens = function (tokens, template) {
        var self = this;
        return function (view, partials) {
            if (partials) {
                if (typeof partials === 'function') {
                    self._loadPartial = partials;
                } else {
                    for (var name in partials) {
                        self.compilePartial(name, partials[name]);
                    }
                }
            }
            return renderTokens(tokens, self, Context.make(view), template);
        };
    };
    Writer.prototype.render = function (template, view, partials) {
        return this.compile(template)(view, partials);
    };

    function renderTokens(tokens, writer, context, template) {
        var buffer = '';
        var token, tokenValue, value;
        for (var i = 0, len = tokens.length; i < len; ++i) {
            token = tokens[i];
            tokenValue = token[1];
            switch (token[0]) {
                case '#':
                    value = context.lookup(tokenValue);
                    if (typeof value === 'object') {
                        if (isArray(value)) {
                            for (var j = 0, jlen = value.length; j < jlen; ++j) {
                                buffer += renderTokens(token[4], writer, context.push(value[j]), template);
                            }
                        } else if (value) {
                            buffer += renderTokens(token[4], writer, context.push(value), template);
                        }
                    } else if (typeof value === 'function') {
                        var text = template == null ? null : template.slice(token[3], token[5]);
                        value = value.call(context.view, text, function (template) {
                            return writer.render(template, context);
                        });
                        if (value != null) buffer += value;
                    } else if (value) {
                        buffer += renderTokens(token[4], writer, context, template);
                    }
                    break;
                case '^':
                    value = context.lookup(tokenValue);
                    if (!value || (isArray(value) && value.length === 0)) {
                        buffer += renderTokens(token[4], writer, context, template);
                    }
                    break;
                case '>':
                    value = writer.getPartial(tokenValue);
                    if (typeof value === 'function') buffer += value(context);
                    break;
                case '&':
                    value = context.lookup(tokenValue);
                    if (value != null) buffer += value;
                    break;
                case 'name':
                    value = context.lookup(tokenValue);
                    if (value != null) buffer += mustache.escape(value);
                    break;
                case 'text':
                    buffer += tokenValue;
                    break;
            }
        }
        return buffer;
    }

    function nestTokens(tokens) {
        var tree = [];
        var collector = tree;
        var sections = [];
        var token;
        for (var i = 0, len = tokens.length; i < len; ++i) {
            token = tokens[i];
            switch (token[0]) {
                case '#':
                case '^':
                    sections.push(token);
                    collector.push(token);
                    collector = token[4] = [];
                    break;
                case '/':
                    var section = sections.pop();
                    section[5] = token[2];
                    collector = sections.length > 0 ? sections[sections.length - 1][4] : tree;
                    break;
                default:
                    collector.push(token);
            }
        }
        return tree;
    }

    function squashTokens(tokens) {
        var squashedTokens = [];
        var token, lastToken;
        for (var i = 0, len = tokens.length; i < len; ++i) {
            token = tokens[i];
            if (token) {
                if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
                    lastToken[1] += token[1];
                    lastToken[3] = token[3];
                } else {
                    lastToken = token;
                    squashedTokens.push(token);
                }
            }
        }
        return squashedTokens;
    }

    function escapeTags(tags) {
        return [new RegExp(escapeRegExp(tags[0]) + "\\s*"), new RegExp("\\s*" + escapeRegExp(tags[1]))];
    }

    function parseTemplate(template, tags) {
        template = template || '';
        tags = tags || mustache.tags;
        if (typeof tags === 'string') tags = tags.split(spaceRe);
        if (tags.length !== 2) throw new Error('Invalid tags: ' + tags.join(', '));
        var tagRes = escapeTags(tags);
        var scanner = new Scanner(template);
        var sections = [];
        var tokens = [];
        var spaces = [];
        var hasTag = false;
        var nonSpace = false;

        function stripSpace() {
            if (hasTag && !nonSpace) {
                while (spaces.length) {
                    delete tokens[spaces.pop()];
                }
            } else {
                spaces = [];
            }
            hasTag = false;
            nonSpace = false;
        }
        var start, type, value, chr, token;
        while (!scanner.eos()) {
            start = scanner.pos;
            value = scanner.scanUntil(tagRes[0]);
            if (value) {
                for (var i = 0, len = value.length; i < len; ++i) {
                    chr = value.charAt(i);
                    if (isWhitespace(chr)) {
                        spaces.push(tokens.length);
                    } else {
                        nonSpace = true;
                    }
                    tokens.push(['text', chr, start, start + 1]);
                    start += 1;
                    if (chr == '\n') stripSpace();
                }
            }
            if (!scanner.scan(tagRes[0])) break;
            hasTag = true;
            type = scanner.scan(tagRe) || 'name';
            scanner.scan(whiteRe);
            if (type === '=') {
                value = scanner.scanUntil(eqRe);
                scanner.scan(eqRe);
                scanner.scanUntil(tagRes[1]);
            } else if (type === '{') {
                value = scanner.scanUntil(new RegExp('\\s*' + escapeRegExp('}' + tags[1])));
                scanner.scan(curlyRe);
                scanner.scanUntil(tagRes[1]);
                type = '&';
            } else {
                value = scanner.scanUntil(tagRes[1]);
            }
            if (!scanner.scan(tagRes[1])) throw new Error('Unclosed tag at ' + scanner.pos);
            token = [type, value, start, scanner.pos];
            tokens.push(token);
            if (type === '#' || type === '^') {
                sections.push(token);
            } else if (type === '/') {
                if (sections.length === 0) throw new Error('Unopened section "' + value + '" at ' + start);
                var openSection = sections.pop();
                if (openSection[1] !== value) throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
            } else if (type === 'name' || type === '{' || type === '&') {
                nonSpace = true;
            } else if (type === '=') {
                tags = value.split(spaceRe);
                if (tags.length !== 2) throw new Error('Invalid tags at ' + start + ': ' + tags.join(', '));
                tagRes = escapeTags(tags);
            }
        }
        var openSection = sections.pop();
        if (openSection) throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);
        tokens = squashTokens(tokens);
        return nestTokens(tokens);
    }
    mustache.name = "mustache.js";
    mustache.version = "0.7.2";
    mustache.tags = ["{{", "}}"];
    mustache.Scanner = Scanner;
    mustache.Context = Context;
    mustache.Writer = Writer;
    mustache.parse = parseTemplate;
    mustache.escape = escapeHtml;
    var defaultWriter = new Writer();
    mustache.clearCache = function () {
        return defaultWriter.clearCache();
    };
    mustache.compile = function (template, tags) {
        return defaultWriter.compile(template, tags);
    };
    mustache.compilePartial = function (name, template, tags) {
        return defaultWriter.compilePartial(name, template, tags);
    };
    mustache.compileTokens = function (tokens, template) {
        return defaultWriter.compileTokens(tokens, template);
    };
    mustache.render = function (template, view, partials) {
        return defaultWriter.render(template, view, partials);
    };
    mustache.to_html = function (template, view, partials, send) {
        var result = mustache.render(template, view, partials);
        if (typeof send === "function") {
            send(result);
        } else {
            return result;
        }
    };
}));;
(function ($) {
    var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g,
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
    $.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function (o) {
        if (o === null) {
            return 'null';
        }
        var type = typeof o;
        if (type === 'undefined') {
            return undefined;
        }
        if (type === 'number' || type === 'boolean') {
            return '' + o;
        }
        if (type === 'string') {
            return $.quoteString(o);
        }
        if (type === 'object') {
            if (typeof o.toJSON === 'function') {
                return $.toJSON(o.toJSON());
            }
            if (o.constructor === Date) {
                var month = o.getUTCMonth() + 1,
                    day = o.getUTCDate(),
                    year = o.getUTCFullYear(),
                    hours = o.getUTCHours(),
                    minutes = o.getUTCMinutes(),
                    seconds = o.getUTCSeconds(),
                    milli = o.getUTCMilliseconds();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                if (hours < 10) {
                    hours = '0' + hours;
                }
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }
                if (milli < 100) {
                    milli = '0' + milli;
                }
                if (milli < 10) {
                    milli = '0' + milli;
                }
                return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';
            }
            if (o.constructor === Array) {
                var ret = [];
                for (var i = 0; i < o.length; i++) {
                    ret.push($.toJSON(o[i]) || 'null');
                }
                return '[' + ret.join(',') + ']';
            }
            var name, val, pairs = [];
            for (var k in o) {
                type = typeof k;
                if (type === 'number') {
                    name = '"' + k + '"';
                } else if (type === 'string') {
                    name = $.quoteString(k);
                } else {
                    continue;
                }
                type = typeof o[k];
                if (type === 'function' || type === 'undefined') {
                    continue;
                }
                val = $.toJSON(o[k]);
                pairs.push(name + ':' + val);
            }
            return '{' + pairs.join(',') + '}';
        }
    };
    $.evalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function (src) {
        return eval('(' + src + ')');
    };
    $.secureEvalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function (src) {
        var filtered = src.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        if (/^[\],:{}\s]*$/.test(filtered)) {
            return eval('(' + src + ')');
        } else {
            throw new SyntaxError('Error parsing JSON, source is not valid.');
        }
    };
    $.quoteString = function (string) {
        if (string.match(escapeable)) {
            return '"' + string.replace(escapeable, function (a) {
                var c = meta[a];
                if (typeof c === 'string') {
                    return c;
                }
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };
})(jQuery);;
var AdsWrapper = {};
var AdsType = '';
var browserInfo = '';
AdsWrapper.checkAdsCounter = function (playerMode) {
    if (_globalPlayCounter < videoAdsCondition) return false;
    playerMode = (typeof playerMode != 'undefined' && playerMode != '') ? playerMode : 'song';
    if (readCookie("globalAdsCounterTwoMin") == null || (readCookie("globalAdsCounterTwoMin") != null && (readCookie("globalAdsCounterTwoMin") % 6 == 0))) {
        currentAdsInQueue = AdsWrapper.filterAds(playerMode);
        AdsWrapper.resetAdsCookie();
        return true;
    } else if (readCookie("globalAdsCounterThreeMin") != null && (readCookie("globalAdsCounterThreeMin") % 4 == 0)) {
        currentAdsInQueue = AdsWrapper.filterAds(playerMode);
        AdsWrapper.resetAdsCookie();
        return true;
    }
    return false;
};
AdsWrapper.filterAds = function (playerMode) {
    if (currentAdsInQueue == '') {
        return 'song';
    } else if (currentAdsInQueue == 'video') {
        return 'song';
    } else {
        return 'video';
    }
};
AdsWrapper.updateAdsCounter = function (type) {
    AdsType = type;
    var cookieName = "globalAdsCounter" + type;
    if (typeof readCookie(cookieName) == 'undefined' || readCookie(cookieName) == null) {
        createCookie(cookieName, 1);
    } else {
        value = readCookie(cookieName);
        createCookie(cookieName, parseInt(value) + 1);
    }
};
AdsWrapper.resetAdsCookie = function () {
    createCookie("globalAdsCounterTwoMin", 1);
    createCookie("globalAdsCounterThreeMin", 1);
};
AdsWrapper.showAds = function (type) {
    if (browserInfo == '') {
        browserInfo = AdsWrapper.browserinfo();
    }
    playingVideoPreRoll = true;
    var main_middle_content = $('#main_middle_content').innerWidth() / 2;
    var videoObjectCode = ($('#videoObjectCode').length > 0) ? $('#videoObjectCode').width() / 2 : '210';
    var left_panel = $('#left_panel').width();
    var leftMargin = (main_middle_content - videoObjectCode) + left_panel;
    if (type == 'audio') var campaignId = 883;
    else if (type == 'video') var campaignId = 870;
    $('#videoObjectCode').remove();
    if ($.browser.msie || navigator.userAgent.indexOf("Opera")) {
        var _visiblityStr = 'visible';
    } else {
        var _visiblityStr = 'hidden';
    }
    var result = '<div id="videoObjectCode" style="visibility:' + _visiblityStr + '; left:' + leftMargin + 'px;"><div class="videopop">';
    result += '<div id="adPlayer" style="display: block; opacity: 1; height:300px; background:none; border:0px solid #000; padding:0px">';
    result += '<object width="100%" height="100%" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="myMovie">';
    result += '<param value="http://timesofindia.indiatimes.com/configspace/ads/adWrapper.swf" name="movie">';
    result += '<param value="true" name="allowFullScreen">';
    result += '<param value="high" name="quality">';
    result += '<param value="opaque" name="wmode">';
    result += '<param value="always" name="allowScriptAccess">';
    result += '<param value="all" name="allowNetworking">';
    result += '<param value="videosection=videoshow&amp;channelid=10001&amp;tadsid=38838&amp;tslotid=' + campaignId + '" name="flashvars">';
    result += '<embed width="100%" height="100%" style="z-index:-1" src="http://timesofindia.indiatimes.com/configspace/ads/adWrapper.swf" name="myMovie" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" allownetworking="all" flashvars="videosection=videoshow&amp;channelid=10001&amp;tadsid=38838&amp;tslotid=' + campaignId + '" allowscriptaccess="always" wmode="transparent" quality="high" allowfullscreen="true">';
    result += '</object>';
    result += '</div></div>';
    var connectusing = 'Gaana Promotional';
    $('#outercontainer').append('<div>' + result + '</div>');
    $('#mq').html("Your song has been queued and will play shortly.");
    $('#playercontrol_transparent').remove();
    $('.yt_video_close').trigger('click');
    if (!isGaanaPaidUserCheck()) {
        $('body').append('<div id="playercontrol_transparent" class="pc_block" style="bottom:0px;"></div>');
    }
    setTimeout(function () {
        if (!isVideoAdsFlashContainerLoaded) {
            playingVideoPreRoll = false;
            AdsWrapper.closeAdsVideo();
            gaanaMaster.PlaySongsAfterVideo();
            gAnalyticChannelClick('Ads', 'UnableToLoadFlash', browserInfo);
        }
    }, 8000);
};
AdsWrapper.destroyAds = function () {
    if ($('#videoObjectCode').length > 0 && !playingVideoPreRoll) {
        AdsWrapper.closeAdsVideo();
        gAnalyticChannelClick('Ads', 'destroyAds', browserInfo);
    }
    return playingVideoPreRoll;
};
AdsWrapper.isVideoAdsPlaying = function () {
    return playingVideoPreRoll;
};
AdsWrapper.printCurrentSong = function () {
    if ($('#videoObjectCode').length > 0) {
        $('#mq').html("Advertisement | Your song has been queued and will play shortly.");
    }
};
AdsWrapper.closeAdsVideo = function () {
    $('#videoObjectCode').animate({
        bottom: '-300px'
    }, {
        duration: 1200
    });
};
AdsWrapper.showAdsVideo = function () {
    if ($.browser.msie || navigator.userAgent.indexOf("Opera")) {} else {
        $('#videoObjectCode').css({
            bottom: '-300px'
        });
        $('#videoObjectCode').css('visibility', 'visible');
        $('#videoObjectCode').animate({
            bottom: '90px'
        }, {
            duration: 1200
        });
    }
};

function removeAdLayer() {
    playingVideoPreRoll = false;
    $('#mq').html("");
    AdsWrapper.closeAdsVideo();
    gaanaMaster.PlaySongsAfterVideo();
    gAnalyticChannelClick('Ads', 'Close', browserInfo);
}

function videoadloaded() {
    isVideoAdsFlashContainerLoaded = true;
    AdsWrapper.showAdsVideo();
    AdsWrapper.printCurrentSong();
    gAnalyticChannelClick('Ads', 'Open', browserInfo);
}

function removeVideoAdsOnDemand() {
    playingVideoPreRoll = false;
    $('#mq').html("");
    AdsWrapper.closeAdsVideo();
    gAnalyticChannelClick('Ads', 'On Demand Close', browserInfo);
}
AdsWrapper.browserinfo = function () {
    var ua = navigator.userAgent,
        tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
    return M.join(' ');
};;
if (typeof JSON !== 'object') {
    JSON = {};
}
(function () {
    'use strict';

    function f(n) {
        return n < 10 ? '0' + n : n;
    }
    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        }, rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    function str(key, holder) {
        var i, k, v, length, mind = gap,
            partial, value = holder[key];
        if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }
    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {
                '': value
            });
        };
    }
    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ? walk({
                    '': j
                }, '') : j;
            }
            throw new SyntaxError('JSON.parse');
        };
    }
}());
(function (window, undefined) {
    "use strict";
    var History = window.History = window.History || {};
    if (typeof History.Adapter !== 'undefined') {
        throw new Error('History.js Adapter has already been loaded...');
    }
    History.Adapter = {
        handlers: {},
        _uid: 1,
        uid: function (element) {
            return element._uid || (element._uid = History.Adapter._uid++);
        },
        bind: function (element, eventName, callback) {
            var uid = History.Adapter.uid(element);
            History.Adapter.handlers[uid] = History.Adapter.handlers[uid] || {};
            History.Adapter.handlers[uid][eventName] = History.Adapter.handlers[uid][eventName] || [];
            History.Adapter.handlers[uid][eventName].push(callback);
            element['on' + eventName] = (function (element, eventName) {
                return function (event) {
                    History.Adapter.trigger(element, eventName, event);
                };
            })(element, eventName);
        },
        trigger: function (element, eventName, event) {
            event = event || {};
            var uid = History.Adapter.uid(element),
                i, n;
            History.Adapter.handlers[uid] = History.Adapter.handlers[uid] || {};
            History.Adapter.handlers[uid][eventName] = History.Adapter.handlers[uid][eventName] || [];
            for (i = 0, n = History.Adapter.handlers[uid][eventName].length; i < n; ++i) {
                History.Adapter.handlers[uid][eventName][i].apply(this, [event]);
            }
        },
        extractEventData: function (key, event) {
            var result = (event && event[key]) || undefined;
            return result;
        },
        onDomLoad: function (callback) {
            var timeout = window.setTimeout(function () {
                callback();
            }, 2000);
            window.onload = function () {
                clearTimeout(timeout);
                callback();
            };
        }
    };
    if (typeof History.init !== 'undefined') {
        History.init();
    }
})(window);
(function (window, undefined) {
    "use strict";
    var
    document = window.document,
        setTimeout = window.setTimeout || setTimeout,
        clearTimeout = window.clearTimeout || clearTimeout,
        setInterval = window.setInterval || setInterval,
        History = window.History = window.History || {};
    if (typeof History.initHtml4 !== 'undefined') {
        throw new Error('History.js HTML4 Support has already been loaded...');
    }
    History.initHtml4 = function () {
        if (typeof History.initHtml4.initialized !== 'undefined') {
            return false;
        } else {
            History.initHtml4.initialized = true;
        }
        History.enabled = true;
        History.savedHashes = [];
        History.isLastHash = function (newHash) {
            var oldHash = History.getHashByIndex(),
                isLast;
            isLast = newHash === oldHash;
            return isLast;
        };
        History.isHashEqual = function (newHash, oldHash) {
            newHash = encodeURIComponent(newHash).replace(/%25/g, "%");
            oldHash = encodeURIComponent(oldHash).replace(/%25/g, "%");
            return newHash === oldHash;
        };
        History.saveHash = function (newHash) {
            if (History.isLastHash(newHash)) {
                return false;
            }
            History.savedHashes.push(newHash);
            return true;
        };
        History.getHashByIndex = function (index) {
            var hash = null;
            if (typeof index === 'undefined') {
                hash = History.savedHashes[History.savedHashes.length - 1];
            } else if (index < 0) {
                hash = History.savedHashes[History.savedHashes.length + index];
            } else {
                hash = History.savedHashes[index];
            }
            return hash;
        };
        History.discardedHashes = {};
        History.discardedStates = {};
        History.discardState = function (discardedState, forwardState, backState) {
            var discardedStateHash = History.getHashByState(discardedState),
                discardObject;
            discardObject = {
                'discardedState': discardedState,
                'backState': backState,
                'forwardState': forwardState
            };
            History.discardedStates[discardedStateHash] = discardObject;
            return true;
        };
        History.discardHash = function (discardedHash, forwardState, backState) {
            var discardObject = {
                'discardedHash': discardedHash,
                'backState': backState,
                'forwardState': forwardState
            };
            History.discardedHashes[discardedHash] = discardObject;
            return true;
        };
        History.discardedState = function (State) {
            var StateHash = History.getHashByState(State),
                discarded;
            discarded = History.discardedStates[StateHash] || false;
            return discarded;
        };
        History.discardedHash = function (hash) {
            var discarded = History.discardedHashes[hash] || false;
            return discarded;
        };
        History.recycleState = function (State) {
            var StateHash = History.getHashByState(State);
            if (History.discardedState(State)) {
                delete History.discardedStates[StateHash];
            }
            return true;
        };
        if (History.emulated.hashChange) {
            History.hashChangeInit = function () {
                History.checkerFunction = null;
                var lastDocumentHash = '',
                    iframeId, iframe, lastIframeHash, checkerRunning, startedWithHash = Boolean(History.getHash());
                if (History.isInternetExplorer()) {
                    iframeId = 'historyjs-iframe';
                    iframe = document.createElement('iframe');
                    iframe.setAttribute('id', iframeId);
                    iframe.setAttribute('src', '#');
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                    iframe.contentWindow.document.open();
                    iframe.contentWindow.document.close();
                    lastIframeHash = '';
                    checkerRunning = false;
                    History.checkerFunction = function () {
                        if (checkerRunning) {
                            return false;
                        }
                        checkerRunning = true;
                        var
                        documentHash = History.getHash(),
                            iframeHash = History.getHash(iframe.contentWindow.document);
                        if (documentHash !== lastDocumentHash) {
                            lastDocumentHash = documentHash;
                            if (iframeHash !== documentHash) {
                                lastIframeHash = iframeHash = documentHash;
                                iframe.contentWindow.document.open();
                                iframe.contentWindow.document.close();
                                iframe.contentWindow.document.location.hash = History.escapeHash(documentHash);
                            }
                            History.Adapter.trigger(window, 'hashchange');
                        } else if (iframeHash !== lastIframeHash) {
                            lastIframeHash = iframeHash;
                            if (startedWithHash && iframeHash === '') {
                                History.back();
                            } else {
                                History.setHash(iframeHash, false);
                            }
                        }
                        checkerRunning = false;
                        return true;
                    };
                } else {
                    History.checkerFunction = function () {
                        var documentHash = History.getHash() || '';
                        if (documentHash !== lastDocumentHash) {
                            lastDocumentHash = documentHash;
                            History.Adapter.trigger(window, 'hashchange');
                        }
                        return true;
                    };
                }
                History.intervalList.push(setInterval(History.checkerFunction, History.options.hashChangeInterval));
                return true;
            };
            History.Adapter.onDomLoad(History.hashChangeInit);
        }
        if (History.emulated.pushState) {
            History.onHashChange = function (event) {
                var currentUrl = ((event && event.newURL) || History.getLocationHref()),
                    currentHash = History.getHashByUrl(currentUrl),
                    currentState = null,
                    currentStateHash = null,
                    currentStateHashExits = null,
                    discardObject;
                if (History.isLastHash(currentHash)) {
                    History.busy(false);
                    return false;
                }
                History.doubleCheckComplete();
                History.saveHash(currentHash);
                if (currentHash && History.isTraditionalAnchor(currentHash)) {
                    History.Adapter.trigger(window, 'anchorchange');
                    History.busy(false);
                    return false;
                }
                currentState = History.extractState(History.getFullUrl(currentHash || History.getLocationHref()), true);
                if (History.isLastSavedState(currentState)) {
                    History.busy(false);
                    return false;
                }
                currentStateHash = History.getHashByState(currentState);
                discardObject = History.discardedState(currentState);
                if (discardObject) {
                    if (History.getHashByIndex(-2) === History.getHashByState(discardObject.forwardState)) {
                        History.back(false);
                    } else {
                        History.forward(false);
                    }
                    return false;
                }
                History.pushState(currentState.data, currentState.title, encodeURI(currentState.url), false);
                if (!_variables.manualClick) {
                    ajaxPageRequestHandler.statChange(currentState);
                    _variables.manualClick = false;
                } else {
                    _variables.manualClick = false;
                }
                return true;
            };
            History.Adapter.bind(window, 'hashchange', History.onHashChange);
            History.pushState = function (data, title, url, queue) {
                url = encodeURI(url).replace(/%25/g, "%");
                if (History.getHashByUrl(url)) {
                    throw new Error('History.js does not support states with fragment-identifiers (hashes/anchors).');
                }
                if (queue !== false && History.busy()) {
                    History.pushQueue({
                        scope: History,
                        callback: History.pushState,
                        args: arguments,
                        queue: queue
                    });
                    return false;
                }
                History.busy(true);
                var newState = History.createStateObject(data, title, url),
                    newStateHash = History.getHashByState(newState),
                    oldState = History.getState(false),
                    oldStateHash = History.getHashByState(oldState),
                    html4Hash = History.getHash(),
                    wasExpected = History.expectedStateId == newState.id;
                History.storeState(newState);
                History.expectedStateId = newState.id;
                History.recycleState(newState);
                History.setTitle(newState);
                if (newStateHash === oldStateHash) {
                    History.busy(false);
                    return false;
                }
                History.saveState(newState);
                if (!wasExpected) History.Adapter.trigger(window, 'statechange');
                if (!History.isHashEqual(newStateHash, html4Hash) && !History.isHashEqual(newStateHash, History.getShortUrl(History.getLocationHref()))) {
                    History.setHash(newStateHash, false);
                }
                History.busy(false);
                return true;
            };
            History.replaceState = function (data, title, url, queue) {
                url = encodeURI(url).replace(/%25/g, "%");
                if (History.getHashByUrl(url)) {
                    throw new Error('History.js does not support states with fragment-identifiers (hashes/anchors).');
                }
                if (queue !== false && History.busy()) {
                    History.pushQueue({
                        scope: History,
                        callback: History.replaceState,
                        args: arguments,
                        queue: queue
                    });
                    return false;
                }
                History.busy(true);
                var newState = History.createStateObject(data, title, url),
                    newStateHash = History.getHashByState(newState),
                    oldState = History.getState(false),
                    oldStateHash = History.getHashByState(oldState),
                    previousState = History.getStateByIndex(-2);
                History.discardState(oldState, newState, previousState);
                if (newStateHash === oldStateHash) {
                    History.storeState(newState);
                    History.expectedStateId = newState.id;
                    History.recycleState(newState);
                    History.setTitle(newState);
                    History.saveState(newState);
                    History.Adapter.trigger(window, 'statechange');
                    History.busy(false);
                } else {
                    History.pushState(newState.data, newState.title, newState.url, false);
                }
                return true;
            };
        }
        if (History.emulated.pushState) {
            if (History.getHash() && !History.emulated.hashChange) {
                History.Adapter.onDomLoad(function () {
                    History.Adapter.trigger(window, 'hashchange');
                });
            }
        }
    };
    if (typeof History.init !== 'undefined') {
        History.init();
    }
})(window);
(function (window, undefined) {
    "use strict";
    var
    console = window.console || undefined,
        document = window.document,
        navigator = window.navigator,
        sessionStorage = window.sessionStorage || false,
        setTimeout = window.setTimeout,
        clearTimeout = window.clearTimeout,
        setInterval = window.setInterval,
        clearInterval = window.clearInterval,
        JSON = window.JSON,
        alert = window.alert,
        History = window.History = window.History || {}, history = window.history;
    try {
        sessionStorage.setItem('TEST', '1');
        sessionStorage.removeItem('TEST');
    } catch (e) {
        sessionStorage = false;
    }
    JSON.stringify = JSON.stringify || JSON.encode;
    JSON.parse = JSON.parse || JSON.decode;
    if (typeof History.init !== 'undefined') {
        throw new Error('History.js Core has already been loaded...');
    }
    History.init = function (options) {
        if (typeof History.Adapter === 'undefined') {
            return false;
        }
        if (typeof History.initCore !== 'undefined') {
            History.initCore();
        }
        if (typeof History.initHtml4 !== 'undefined') {
            History.initHtml4();
        }
        return true;
    };
    History.initCore = function (options) {
        if (typeof History.initCore.initialized !== 'undefined') {
            return false;
        } else {
            History.initCore.initialized = true;
        }
        History.options = History.options || {};
        History.options.hashChangeInterval = History.options.hashChangeInterval || 100;
        History.options.safariPollInterval = History.options.safariPollInterval || 500;
        History.options.doubleCheckInterval = History.options.doubleCheckInterval || 500;
        History.options.disableSuid = History.options.disableSuid || false;
        History.options.storeInterval = History.options.storeInterval || 1000;
        History.options.busyDelay = History.options.busyDelay || 250;
        History.options.debug = History.options.debug || false;
        History.options.initialTitle = History.options.initialTitle || document.title;
        History.options.html4Mode = History.options.html4Mode || false;
        History.options.delayInit = History.options.delayInit || false;
        History.intervalList = [];
        History.clearAllIntervals = function () {
            var i, il = History.intervalList;
            if (typeof il !== "undefined" && il !== null) {
                for (i = 0; i < il.length; i++) {
                    clearInterval(il[i]);
                }
                History.intervalList = null;
            }
        };
        History.debug = function () {
            if ((History.options.debug || false)) {
                History.log.apply(History, arguments);
            }
        };
        History.log = function () {
            var
            consoleExists = !(typeof console === 'undefined' || typeof console.log === 'undefined' || typeof console.log.apply === 'undefined'),
                textarea = document.getElementById('log'),
                message, i, n, args, arg;
            if (consoleExists) {
                args = Array.prototype.slice.call(arguments);
                message = args.shift();
                if (typeof console.debug !== 'undefined') {
                    console.debug.apply(console, [message, args]);
                } else {
                    console.log.apply(console, [message, args]);
                }
            } else {
                message = ("\n" + arguments[0] + "\n");
            }
            for (i = 1, n = arguments.length; i < n; ++i) {
                arg = arguments[i];
                if (typeof arg === 'object' && typeof JSON !== 'undefined') {
                    try {
                        arg = JSON.stringify(arg);
                    } catch (Exception) {}
                }
                message += "\n" + arg + "\n";
            }
            if (textarea) {
                textarea.value += message + "\n-----\n";
                textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
            } else if (!consoleExists) {
                alert(message);
            }
            return true;
        };
        History.getInternetExplorerMajorVersion = function () {
            var result = History.getInternetExplorerMajorVersion.cached = (typeof History.getInternetExplorerMajorVersion.cached !== 'undefined') ? History.getInternetExplorerMajorVersion.cached : (function () {
                var v = 3,
                    div = document.createElement('div'),
                    all = div.getElementsByTagName('i');
                while ((div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->') && all[0]) {}
                return (v > 4) ? v : false;
            })();
            return result;
        };
        History.isInternetExplorer = function () {
            var result = History.isInternetExplorer.cached = (typeof History.isInternetExplorer.cached !== 'undefined') ? History.isInternetExplorer.cached : Boolean(History.getInternetExplorerMajorVersion());
            return result;
        };
        if (History.options.html4Mode) {
            History.emulated = {
                pushState: true,
                hashChange: true
            };
        } else {
            History.emulated = {
                pushState: !Boolean(window.history && window.history.pushState && window.history.replaceState && !((/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i).test(navigator.userAgent) || (/AppleWebKit\/5([0-2]|3[0-2])/i).test(navigator.userAgent))),
                hashChange: Boolean(!(('onhashchange' in window) || ('onhashchange' in document)) || (History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8))
            };
        }
        History.enabled = !History.emulated.pushState;
        History.bugs = {
            setHash: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),
            safariPoll: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),
            ieDoubleCheck: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8),
            hashEscape: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 7)
        };
        History.isEmptyObject = function (obj) {
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    return false;
                }
            }
            return true;
        };
        History.cloneObject = function (obj) {
            var hash, newObj;
            if (obj) {
                hash = JSON.stringify(obj);
                newObj = JSON.parse(hash);
            } else {
                newObj = {};
            }
            return newObj;
        };
        History.getRootUrl = function () {
            var rootUrl = document.location.protocol + '//' + (document.location.hostname || document.location.host);
            if (document.location.port || false) {
                rootUrl += ':' + document.location.port;
            }
            rootUrl += '/';
            return rootUrl;
        };
        History.getBaseHref = function () {
            var
            baseElements = document.getElementsByTagName('base'),
                baseElement = null,
                baseHref = '';
            if (baseElements.length === 1) {
                baseElement = baseElements[0];
                baseHref = baseElement.href.replace(/[^\/]+$/, '');
            }
            baseHref = baseHref.replace(/\/+$/, '');
            if (baseHref) baseHref += '/';
            return baseHref;
        };
        History.getBaseUrl = function () {
            var baseUrl = History.getBaseHref() || History.getBasePageUrl() || History.getRootUrl();
            return baseUrl;
        };
        History.getPageUrl = function () {
            var
            State = History.getState(false, false),
                stateUrl = (State || {}).url || History.getLocationHref(),
                pageUrl;
            pageUrl = stateUrl.replace(/\/+$/, '').replace(/[^\/]+$/, function (part, index, string) {
                return (/\./).test(part) ? part : part + '/';
            });
            return pageUrl;
        };
        History.getBasePageUrl = function () {
            var basePageUrl = (History.getLocationHref()).replace(/[#\?].*/, '').replace(/[^\/]+$/, function (part, index, string) {
                return (/[^\/]$/).test(part) ? '' : part;
            }).replace(/\/+$/, '') + '/';
            return basePageUrl;
        };
        History.getFullUrl = function (url, allowBaseHref) {
            var fullUrl = url,
                firstChar = url.substring(0, 1);
            allowBaseHref = (typeof allowBaseHref === 'undefined') ? true : allowBaseHref;
            if (/[a-z]+\:\/\//.test(url)) {} else if (firstChar === '/') {
                fullUrl = History.getRootUrl() + url.replace(/^\/+/, '');
            } else if (firstChar === '#') {
                fullUrl = History.getPageUrl().replace(/#.*/, '') + url;
            } else if (firstChar === '?') {
                fullUrl = History.getPageUrl().replace(/[\?#].*/, '') + url;
            } else {
                if (allowBaseHref) {
                    fullUrl = History.getBaseUrl() + url.replace(/^(\.\/)+/, '');
                } else {
                    fullUrl = History.getBasePageUrl() + url.replace(/^(\.\/)+/, '');
                }
            }
            return fullUrl.replace(/\#$/, '');
        };
        History.getShortUrl = function (url) {
            var shortUrl = url,
                baseUrl = History.getBaseUrl(),
                rootUrl = History.getRootUrl();
            if (History.emulated.pushState) {
                shortUrl = shortUrl.replace(baseUrl, '');
            }
            shortUrl = shortUrl.replace(rootUrl, '/');
            if (History.isTraditionalAnchor(shortUrl)) {
                shortUrl = './' + shortUrl;
            }
            shortUrl = shortUrl.replace(/^(\.\/)+/g, './').replace(/\#$/, '');
            return shortUrl;
        };
        History.getLocationHref = function (doc) {
            doc = doc || document;
            if (doc.URL === doc.location.href) return doc.location.href;
            if (doc.location.href === decodeURIComponent(doc.URL)) return doc.URL;
            if (doc.location.hash && decodeURIComponent(doc.location.href.replace(/^[^#]+/, "")) === doc.location.hash) return doc.location.href;
            if (doc.URL.indexOf('#') == -1 && doc.location.href.indexOf('#') != -1) return doc.location.href;
            return doc.URL || doc.location.href;
        };
        History.store = {};
        History.idToState = History.idToState || {};
        History.stateToId = History.stateToId || {};
        History.urlToId = History.urlToId || {};
        History.storedStates = History.storedStates || [];
        History.savedStates = History.savedStates || [];
        History.normalizeStore = function () {
            History.store.idToState = History.store.idToState || {};
            History.store.urlToId = History.store.urlToId || {};
            History.store.stateToId = History.store.stateToId || {};
        };
        History.getState = function (friendly, create) {
            if (typeof friendly === 'undefined') {
                friendly = true;
            }
            if (typeof create === 'undefined') {
                create = true;
            }
            var State = History.getLastSavedState();
            if (!State && create) {
                State = History.createStateObject();
            }
            if (friendly) {
                State = History.cloneObject(State);
                State.url = State.cleanUrl || State.url;
            }
            return State;
        };
        History.getIdByState = function (newState) {
            var id = History.extractId(newState.url),
                str;
            if (!id) {
                str = History.getStateString(newState);
                if (typeof History.stateToId[str] !== 'undefined') {
                    id = History.stateToId[str];
                } else if (typeof History.store.stateToId[str] !== 'undefined') {
                    id = History.store.stateToId[str];
                } else {
                    while (true) {
                        id = (new Date()).getTime() + String(Math.random()).replace(/\D/g, '');
                        if (typeof History.idToState[id] === 'undefined' && typeof History.store.idToState[id] === 'undefined') {
                            break;
                        }
                    }
                    History.stateToId[str] = id;
                    History.idToState[id] = newState;
                }
            }
            return id;
        };
        History.normalizeState = function (oldState) {
            var newState, dataNotEmpty;
            if (!oldState || (typeof oldState !== 'object')) {
                oldState = {};
            }
            if (typeof oldState.normalized !== 'undefined') {
                return oldState;
            }
            if (!oldState.data || (typeof oldState.data !== 'object')) {
                oldState.data = {};
            }
            newState = {};
            newState.normalized = true;
            newState.title = oldState.title || '';
            newState.url = History.getFullUrl(oldState.url ? oldState.url : (History.getLocationHref()));
            newState.hash = History.getShortUrl(newState.url);
            newState.data = History.cloneObject(oldState.data);
            newState.id = History.getIdByState(newState);
            newState.cleanUrl = newState.url.replace(/\??\&_suid.*/, '');
            newState.url = newState.cleanUrl;
            dataNotEmpty = !History.isEmptyObject(newState.data);
            if ((newState.title || dataNotEmpty) && History.options.disableSuid !== true) {
                newState.hash = History.getShortUrl(newState.url).replace(/\??\&_suid.*/, '');
            }
            newState.hashedUrl = History.getFullUrl(newState.hash);
            if ((History.emulated.pushState || History.bugs.safariPoll) && History.hasUrlDuplicate(newState)) {
                newState.url = newState.hashedUrl;
            }
            return newState;
        };
        History.createStateObject = function (data, title, url) {
            var State = {
                'data': data,
                'title': title,
                'url': url
            };
            State = History.normalizeState(State);
            return State;
        };
        History.getStateById = function (id) {
            id = String(id);
            var State = History.idToState[id] || History.store.idToState[id] || undefined;
            return State;
        };
        History.getStateString = function (passedState) {
            var State, cleanedState, str;
            State = History.normalizeState(passedState);
            cleanedState = {
                data: State.data,
                title: passedState.title,
                url: passedState.url
            };
            str = JSON.stringify(cleanedState);
            return str;
        };
        History.getStateId = function (passedState) {
            var State, id;
            State = History.normalizeState(passedState);
            id = State.id;
            return id;
        };
        History.getHashByState = function (passedState) {
            var State, hash;
            State = History.normalizeState(passedState);
            hash = State.hash;
            return hash;
        };
        History.extractId = function (url_or_hash) {
            var id, parts, url, tmp;
            if (url_or_hash.indexOf('#') != -1) {
                tmp = url_or_hash.split("#")[0];
            } else {
                tmp = url_or_hash;
            }
            parts = /(.*)\&_suid=([0-9]+)$/.exec(tmp);
            url = parts ? (parts[1] || url_or_hash) : url_or_hash;
            id = parts ? String(parts[2] || '') : '';
            return id || false;
        };
        History.isTraditionalAnchor = function (url_or_hash) {
            var isTraditional = !(/[\/\?\.]/.test(url_or_hash));
            return isTraditional;
        };
        History.extractState = function (url_or_hash, create) {
            var State = null,
                id, url;
            create = create || false;
            id = History.extractId(url_or_hash);
            if (id) {
                State = History.getStateById(id);
            }
            if (!State) {
                url = History.getFullUrl(url_or_hash);
                id = History.getIdByUrl(url) || false;
                if (id) {
                    State = History.getStateById(id);
                }
                if (!State && create && !History.isTraditionalAnchor(url_or_hash)) {
                    State = History.createStateObject(null, null, url);
                }
            }
            return State;
        };
        History.getIdByUrl = function (url) {
            var id = History.urlToId[url] || History.store.urlToId[url] || undefined;
            return id;
        };
        History.getLastSavedState = function () {
            return History.savedStates[History.savedStates.length - 1] || undefined;
        };
        History.getLastStoredState = function () {
            return History.storedStates[History.storedStates.length - 1] || undefined;
        };
        History.hasUrlDuplicate = function (newState) {
            var hasDuplicate = false,
                oldState;
            oldState = History.extractState(newState.url);
            hasDuplicate = oldState && oldState.id !== newState.id;
            return hasDuplicate;
        };
        History.storeState = function (newState) {
            History.urlToId[newState.url] = newState.id;
            History.storedStates.push(History.cloneObject(newState));
            return newState;
        };
        History.isLastSavedState = function (newState) {
            var isLast = false,
                newId, oldState, oldId;
            if (History.savedStates.length) {
                newId = newState.id;
                oldState = History.getLastSavedState();
                oldId = oldState.id;
                isLast = (newId === oldId);
            }
            return isLast;
        };
        History.saveState = function (newState) {
            if (History.isLastSavedState(newState)) {
                return false;
            }
            History.savedStates.push(History.cloneObject(newState));
            return true;
        };
        History.getStateByIndex = function (index) {
            var State = null;
            if (typeof index === 'undefined') {
                State = History.savedStates[History.savedStates.length - 1];
            } else if (index < 0) {
                State = History.savedStates[History.savedStates.length + index];
            } else {
                State = History.savedStates[index];
            }
            return State;
        };
        History.getCurrentIndex = function () {
            var index = null;
            if (History.savedStates.length < 1) {
                index = 0;
            } else {
                index = History.savedStates.length - 1;
            }
            return index;
        };
        History.getHash = function (doc) {
            var url = History.getLocationHref(doc),
                hash;
            hash = History.getHashByUrl(url);
            return hash;
        };
        History.unescapeHash = function (hash) {
            var result = History.normalizeHash(hash);
            result = encodeURIComponent(result);
            result = decodeURIComponent(result);
            return result;
        };
        History.normalizeHash = function (hash) {
            var result = hash.replace(/[^#]*#/, '').replace(/#.*/, '');
            return result;
        };
        History.setHash = function (hash, queue) {
            var State, pageUrl;
            if (queue !== false && History.busy()) {
                History.pushQueue({
                    scope: History,
                    callback: History.setHash,
                    args: arguments,
                    queue: queue
                });
                return false;
            }
            History.busy(true);
            State = History.extractState(hash, true);
            if (State && !History.emulated.pushState) {
                History.pushState(State.data, State.title, State.url, false);
            } else if (History.getHash() !== hash) {
                if (History.bugs.setHash) {
                    pageUrl = History.getPageUrl();
                    History.pushState(null, null, pageUrl + hash, false);
                } else {
                    document.location.hash = hash;
                }
            }
            return History;
        };
        History.escapeHash = function (hash) {
            var result = History.normalizeHash(hash);
            result = window.encodeURIComponent(result);
            if (!History.bugs.hashEscape) {
                result = result.replace(/\%21/g, '!').replace(/\%26/g, '&').replace(/\%3D/g, '=').replace(/\%3F/g, '?');
            }
            return result;
        };
        History.getHashByUrl = function (url) {
            var hash = String(url).replace(/([^#]*)#?([^#]*)#?(.*)/, '$2');
            hash = History.unescapeHash(hash);
            return hash;
        };
        History.setTitle = function (newState) {
            var title = newState.title,
                firstState;
            if (!title) {
                firstState = History.getStateByIndex(0);
                if (firstState && firstState.url === newState.url) {
                    title = firstState.title || History.options.initialTitle;
                }
            }
            try {
                document.getElementsByTagName('title')[0].innerHTML = title.replace('<', '&lt;').replace('>', '&gt;').replace(' & ', ' &amp; ');
            } catch (Exception) {}
            document.title = title;
            return History;
        };
        History.queues = [];
        History.busy = function (value) {
            if (typeof value !== 'undefined') {
                History.busy.flag = value;
            } else if (typeof History.busy.flag === 'undefined') {
                History.busy.flag = false;
            }
            if (!History.busy.flag) {
                clearTimeout(History.busy.timeout);
                var fireNext = function () {
                    var i, queue, item;
                    if (History.busy.flag) return;
                    for (i = History.queues.length - 1; i >= 0; --i) {
                        queue = History.queues[i];
                        if (queue.length === 0) continue;
                        item = queue.shift();
                        History.fireQueueItem(item);
                        History.busy.timeout = setTimeout(fireNext, History.options.busyDelay);
                    }
                };
                History.busy.timeout = setTimeout(fireNext, History.options.busyDelay);
            }
            return History.busy.flag;
        };
        History.busy.flag = false;
        History.fireQueueItem = function (item) {
            return item.callback.apply(item.scope || History, item.args || []);
        };
        History.pushQueue = function (item) {
            History.queues[item.queue || 0] = History.queues[item.queue || 0] || [];
            History.queues[item.queue || 0].push(item);
            return History;
        };
        History.queue = function (item, queue) {
            if (typeof item === 'function') {
                item = {
                    callback: item
                };
            }
            if (typeof queue !== 'undefined') {
                item.queue = queue;
            }
            if (History.busy()) {
                History.pushQueue(item);
            } else {
                History.fireQueueItem(item);
            }
            return History;
        };
        History.clearQueue = function () {
            History.busy.flag = false;
            History.queues = [];
            return History;
        };
        History.stateChanged = false;
        History.doubleChecker = false;
        History.doubleCheckComplete = function () {
            History.stateChanged = true;
            History.doubleCheckClear();
            return History;
        };
        History.doubleCheckClear = function () {
            if (History.doubleChecker) {
                clearTimeout(History.doubleChecker);
                History.doubleChecker = false;
            }
            return History;
        };
        History.doubleCheck = function (tryAgain) {
            History.stateChanged = false;
            History.doubleCheckClear();
            if (History.bugs.ieDoubleCheck) {
                History.doubleChecker = setTimeout(function () {
                    History.doubleCheckClear();
                    if (!History.stateChanged) {
                        tryAgain();
                    }
                    return true;
                }, History.options.doubleCheckInterval);
            }
            return History;
        };
        History.safariStatePoll = function () {
            var
            urlState = History.extractState(History.getLocationHref()),
                newState;
            if (!History.isLastSavedState(urlState)) {
                newState = urlState;
            } else {
                return;
            }
            if (!newState) {
                newState = History.createStateObject();
            }
            History.Adapter.trigger(window, 'popstate');
            return History;
        };
        History.back = function (queue) {
            if (queue !== false && History.busy()) {
                History.pushQueue({
                    scope: History,
                    callback: History.back,
                    args: arguments,
                    queue: queue
                });
                return false;
            }
            History.busy(true);
            History.doubleCheck(function () {
                History.back(false);
            });
            history.go(-1);
            return true;
        };
        History.forward = function (queue) {
            if (queue !== false && History.busy()) {
                History.pushQueue({
                    scope: History,
                    callback: History.forward,
                    args: arguments,
                    queue: queue
                });
                return false;
            }
            History.busy(true);
            History.doubleCheck(function () {
                History.forward(false);
            });
            history.go(1);
            return true;
        };
        History.go = function (index, queue) {
            var i;
            if (index > 0) {
                for (i = 1; i <= index; ++i) {
                    History.forward(queue);
                }
            } else if (index < 0) {
                for (i = -1; i >= index; --i) {
                    History.back(queue);
                }
            } else {
                throw new Error('History.go: History.go requires a positive or negative integer passed.');
            }
            return History;
        };
        if (History.emulated.pushState) {
            var emptyFunction = function () {};
            History.pushState = History.pushState || emptyFunction;
            History.replaceState = History.replaceState || emptyFunction;
        } else {
            History.onPopState = function (event, extra) {
                var stateId = false,
                    newState = false,
                    currentHash, currentState, firePJAX = false;
                History.doubleCheckComplete();
                currentHash = History.getHash();
                if (currentHash) {
                    currentState = History.extractState(currentHash || History.getLocationHref(), true);
                    if (currentState) {
                        History.replaceState(currentState.data, currentState.title, currentState.url, false);
                    } else {
                        History.Adapter.trigger(window, 'anchorchange');
                        History.busy(false);
                    }
                    History.expectedStateId = false;
                    return false;
                }
                stateId = History.Adapter.extractEventData('state', event, extra) || false;
                if (stateId) {
                    newState = History.getStateById(stateId);
                    firePJAX = true;
                } else if (History.expectedStateId) {
                    newState = History.getStateById(History.expectedStateId);
                } else {
                    newState = History.extractState(History.getLocationHref());
                }
                if (!newState) {
                    newState = History.createStateObject(null, null, History.getLocationHref());
                }
                History.expectedStateId = false;
                if (History.isLastSavedState(newState)) {
                    History.busy(false);
                    return false;
                }
                History.storeState(newState);
                History.saveState(newState);
                History.setTitle(newState);
                History.Adapter.trigger(window, 'statechange');
                History.busy(false);
                if (firePJAX) {
                    ajaxPageRequestHandler.statChange(newState);
                }
                return true;
            };
            History.Adapter.bind(window, 'popstate', History.onPopState);
            History.pushState = function (data, title, url, queue) {
                if (History.getHashByUrl(url) && History.emulated.pushState) {
                    throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
                }
                if (queue !== false && History.busy()) {
                    History.pushQueue({
                        scope: History,
                        callback: History.pushState,
                        args: arguments,
                        queue: queue
                    });
                    return false;
                }
                History.busy(true);
                var newState = History.createStateObject(data, title, url);
                if (History.isLastSavedState(newState)) {
                    History.busy(false);
                } else {
                    History.storeState(newState);
                    History.expectedStateId = newState.id;
                    history.pushState(newState.id, newState.title, newState.url);
                    History.Adapter.trigger(window, 'popstate');
                }
                return true;
            };
            History.replaceState = function (data, title, url, queue) {
                if (History.getHashByUrl(url) && History.emulated.pushState) {
                    throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
                }
                if (queue !== false && History.busy()) {
                    History.pushQueue({
                        scope: History,
                        callback: History.replaceState,
                        args: arguments,
                        queue: queue
                    });
                    return false;
                }
                History.busy(true);
                var newState = History.createStateObject(data, title, url);
                if (History.isLastSavedState(newState)) {
                    History.busy(false);
                } else {
                    History.storeState(newState);
                    History.expectedStateId = newState.id;
                    history.replaceState(newState.id, newState.title, newState.url);
                    History.Adapter.trigger(window, 'popstate');
                }
                return true;
            };
        }
        if (sessionStorage) {
            try {
                History.store = JSON.parse(sessionStorage.getItem('History.store')) || {};
            } catch (err) {
                History.store = {};
            }
            History.normalizeStore();
        } else {
            History.store = {};
            History.normalizeStore();
        }
        History.Adapter.bind(window, "unload", History.clearAllIntervals);
        History.saveState(History.storeState(History.extractState(History.getLocationHref(), true)));
        if (sessionStorage) {
            History.onUnload = function () {
                var currentStore, item, currentStoreString;
                try {
                    currentStore = JSON.parse(sessionStorage.getItem('History.store')) || {};
                } catch (err) {
                    currentStore = {};
                }
                currentStore.idToState = currentStore.idToState || {};
                currentStore.urlToId = currentStore.urlToId || {};
                currentStore.stateToId = currentStore.stateToId || {};
                for (item in History.idToState) {
                    if (!History.idToState.hasOwnProperty(item)) {
                        continue;
                    }
                    currentStore.idToState[item] = History.idToState[item];
                }
                for (item in History.urlToId) {
                    if (!History.urlToId.hasOwnProperty(item)) {
                        continue;
                    }
                    currentStore.urlToId[item] = History.urlToId[item];
                }
                for (item in History.stateToId) {
                    if (!History.stateToId.hasOwnProperty(item)) {
                        continue;
                    }
                    currentStore.stateToId[item] = History.stateToId[item];
                }
                History.store = currentStore;
                History.normalizeStore();
                currentStoreString = JSON.stringify(currentStore);
                try {
                    sessionStorage.setItem('History.store', currentStoreString);
                } catch (e) {
                    if (e.code === DOMException.QUOTA_EXCEEDED_ERR) {
                        if (sessionStorage.length) {
                            sessionStorage.removeItem('History.store');
                            sessionStorage.setItem('History.store', currentStoreString);
                        } else {}
                    } else {
                        throw e;
                    }
                }
            };
            History.intervalList.push(setInterval(History.onUnload, History.options.storeInterval));
            History.Adapter.bind(window, 'beforeunload', History.onUnload);
            History.Adapter.bind(window, 'unload', History.onUnload);
        }
        if (!History.emulated.pushState) {
            if (History.bugs.safariPoll) {
                History.intervalList.push(setInterval(History.safariStatePoll, History.options.safariPollInterval));
            }
            if (navigator.vendor === 'Apple Computer, Inc.' || (navigator.appCodeName || '') === 'Mozilla') {
                History.Adapter.bind(window, 'hashchange', function () {
                    History.Adapter.trigger(window, 'popstate');
                });
                if (History.getHash()) {
                    History.Adapter.onDomLoad(function () {
                        History.Adapter.trigger(window, 'hashchange');
                    });
                }
            }
        }
    };
    if (!History.options || !History.options.delayInit) {
        History.init();
    }
})(window);;
/*!
 * jQuery Birthday Picker: v1.4 - 10/16/2011
 * http://abecoffman.com/stuff/birthdaypicker
 *
 * Copyright (c) 2010 Abe Coffman
 * Dual licensed under the MIT and GPL licenses.
 *
 */ (function ($) {
    var months = {
        "short": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        "long": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }, todayDate = new Date(),
        todayYear = todayDate.getFullYear(),
        todayMonth = todayDate.getMonth() + 1,
        todayDay = todayDate.getDate();
    $.fn.birthdaypicker = function (options) {
        var settings = {
            "maxAge": 120,
            "minAge": 0,
            "futureDates": false,
            "maxYear": todayYear,
            "dateFormat": "middleEndian",
            "monthFormat": "short",
            "placeholder": true,
            "legend": "",
            "defaultDate": true,
            "fieldName": "birthdate",
            "fieldId": "birthdate",
            "hiddenDate": true,
            "onChange": null,
            "tabindex": null
        };
        return this.each(function () {
            if (options) {
                $.extend(settings, options);
            }
            var $fieldset = $("<fieldset class='birthday-picker'></fieldset>"),
                $year = $("<select class='birth-year' name='birth[year]'></select>"),
                $month = $("<select class='birth-month' name='birth[month]'></select>"),
                $day = $("<select class='birth-day' name='birth[day]'></select>");
            if (settings["legend"]) {
                $("<legend>" + settings["legend"] + "</legend>").appendTo($fieldset);
            }
            var tabindex = settings["tabindex"];
            if (settings["dateFormat"] == "bigEndian") {
                $fieldset.append($year).append($month).append($day);
                if (tabindex != null) {
                    $year.attr('tabindex', tabindex);
                    $month.attr('tabindex', tabindex++);
                    $day.attr('tabindex', tabindex++);
                }
            } else if (settings["dateFormat"] == "littleEndian") {
                $fieldset.append($day).append($month).append($year);
                if (tabindex != null) {
                    $day.attr('tabindex', tabindex);
                    $month.attr('tabindex', tabindex++);
                    $year.attr('tabindex', tabindex++);
                }
            } else {
                $fieldset.append($month).append($day).append($year);
                if (tabindex != null) {
                    $month.attr('tabindex', tabindex);
                    $day.attr('tabindex', tabindex++);
                    $year.attr('tabindex', tabindex++);
                }
            }
            if (settings["placeholder"]) {
                $("<option value='0'>YYYY</option>").appendTo($year);
                $("<option value='0'>MM</option>").appendTo($month);
                $("<option value='0'>DD</option>").appendTo($day);
            }
            var hiddenDate;
            if (settings["defaultDate"]) {
                var defDate = new Date(settings["defaultDate"] + "T00:00:00"),
                    defYear = defDate.getFullYear(),
                    defMonth = defDate.getMonth() + 1,
                    defDay = defDate.getDate();
                if (defMonth < 10) defMonth = "0" + defMonth;
                if (defDay < 10) defDay = "0" + defDay;
                hiddenDate = defYear + "-" + defMonth + "-" + defDay;
            }
            if (settings["hiddenDate"]) {
                $("<input type='hidden' name='" + settings["fieldName"] + "'/>").attr("id", settings["fieldId"]).val(hiddenDate).appendTo($fieldset);
            }
            var startYear = todayYear - settings["minAge"];
            var endYear = todayYear - settings["maxAge"];
            if (settings["futureDates"] && settings["maxYear"] != todayYear) {
                if (settings["maxYear"] > 1000) {
                    startYear = settings["maxYear"];
                } else {
                    startYear = todayYear + settings["maxYear"];
                }
            }
            for (var i = startYear; i >= endYear; i--) {
                $("<option></option>").attr("value", i).text(i).appendTo($year);
            }
            for (var j = 0; j < 12; j++) {
                $("<option></option>").attr("value", j + 1).text(months[settings["monthFormat"]][j]).appendTo($month);
            }
            for (var k = 1; k < 32; k++) {
                $("<option></option>").attr("value", k).text(k).appendTo($day);
            }
            $(this).append($fieldset);
            if (settings["defaultDate"]) {
                var date = new Date(settings["defaultDate"] + "T00:00:00");
                $year.val(date.getFullYear());
                $month.val(date.getMonth() + 1);
                $day.val(date.getDate());
            }
            $day.change(function () {
                if (typeof options.onchnage != 'undefined' && typeof options.onchnage == 'function') {
                    options.onchnage(this, $(this).val());
                }
            })
            $month.change(function () {
                if (typeof options.onchnage != 'undefined' && typeof options.onchnage == 'function') {
                    options.onchnage(this, months[settings["monthFormat"]][$(this).val() - 1]);
                }
            })
            $year.change(function () {
                if (typeof options.onchnage != 'undefined' && typeof options.onchnage == 'function') {
                    options.onchnage(this, $(this).val());
                }
            })
            $fieldset.change(function () {
                var todayDate = new Date(),
                    todayYear = todayDate.getFullYear(),
                    todayMonth = todayDate.getMonth() + 1,
                    todayDay = todayDate.getDate(),
                    selectedYear = parseInt($year.val(), 10),
                    selectedMonth = parseInt($month.val(), 10),
                    selectedDay = parseInt($day.val(), 10),
                    actMaxDay = (new Date(selectedYear, selectedMonth, 0)).getDate(),
                    curMaxMonth = parseInt($month.children(":last").val()),
                    curMaxDay = parseInt($day.children(":last").val());
                if (curMaxDay > actMaxDay) {
                    while (curMaxDay > actMaxDay) {
                        $day.children(":last").remove();
                        curMaxDay--;
                    }
                } else if (curMaxDay < actMaxDay) {
                    while (curMaxDay < actMaxDay) {
                        curMaxDay++;
                        $day.append("<option value=" + curMaxDay + ">" + curMaxDay + "</option>");
                    }
                }
                if (!settings["futureDates"] && selectedYear == startYear) {
                    if (curMaxMonth > todayMonth) {
                        while (curMaxMonth > todayMonth) {
                            $month.children(":last").remove();
                            curMaxMonth--;
                        }
                        $day.children(":first").attr("selected", "selected");
                    }
                    if (selectedMonth === todayMonth) {
                        while (curMaxDay > todayDay) {
                            $day.children(":last").remove();
                            curMaxDay -= 1;
                        }
                    }
                }
                if (selectedYear != startYear && curMaxMonth != 12) {
                    while (curMaxMonth < 12) {
                        $month.append("<option value=" + (curMaxMonth + 1) + ">" + months[settings["monthFormat"]][curMaxMonth] + "</option>");
                        curMaxMonth++;
                    }
                }
                if ((selectedYear * selectedMonth * selectedDay) != 0) {
                    if (selectedMonth < 10) selectedMonth = "0" + selectedMonth;
                    if (selectedDay < 10) selectedDay = "0" + selectedDay;
                    hiddenDate = selectedYear + "-" + selectedMonth + "-" + selectedDay;
                    $(this).find('#' + settings["fieldId"]).val(hiddenDate);
                    if (settings["onChange"] != null) {
                        settings["onChange"](hiddenDate);
                    }
                }
            });
        });
    };
})(jQuery);;
jQuery.fn.autosave = function (e) {
    function n(e) {
        var n = /^data\-(\w+)$/,
            r = {};
        r.value = e.value;
        r.name = e.name;
        t.each(e.attributes, function (e, t) {
            n.test(t.nodeName) && (r[n.exec(t.nodeName)[1]] = t.value)
        });
        return r
    }
    var t = jQuery;
    t.each(this, function () {
        var r = t(this),
            i = {
                data: {},
                event: "change",
                success: function () {},
                error: function () {},
                before: function () {}
            };
        e = t.extend(i, e);
        var s = n(this),
            o = s.event || e.event;
        r.on(o, function () {
            var r = t(this);
            s.value = r.val();
            s = t.extend(s, n(this));
            var i = s.url ? s.url : e.url;
            e.before && e.before.call(this, r);
            t.ajax({
                url: i,
                data: s,
                type: "POST",
                success: function (t) {
                    e.success(t, r)
                },
                error: function (t) {
                    e.error(t, r)
                }
            })
        })
    })
};;
/*!
 * jScrollPane - v2.0.17 - 2013-08-17
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2013 Kelvin Luck
 * Dual licensed under the MIT or GPL licenses.
 */! function (a, b, c) {
    a.fn.jScrollPane = function (d) {
        function e(d, e) {
            function f(b) {
                var e, h, j, l, m, n, q = !1,
                    r = !1;
                if (P = b, Q === c) m = d.scrollTop(), n = d.scrollLeft(), d.css({
                    overflow: "hidden",
                    padding: 0
                }), R = d.innerWidth() + tb, S = d.innerHeight(), d.width(R), Q = a('<div class="jspPane" />').css("padding", sb).append(d.children()), T = a('<div class="jspContainer" />').css({
                    width: R + "px",
                    height: S + "px"
                }).append(Q).appendTo(d);
                else {
                    if (d.css("width", ""), q = P.stickToBottom && C(), r = P.stickToRight && D(), l = d.innerWidth() + tb != R || d.outerHeight() != S, l && (R = d.innerWidth() + tb, S = d.innerHeight(), T.css({
                        width: R + "px",
                        height: S + "px"
                    })), !l && ub == U && Q.outerHeight() == V) return d.width(R), void 0;
                    ub = U, Q.css("width", ""), d.width(R), T.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()
                }
                Q.css("overflow", "auto"), U = b.contentWidth ? b.contentWidth : Q[0].scrollWidth, V = Q[0].scrollHeight, Q.css("overflow", ""), W = U / R, X = V / S, Y = X > 1, Z = W > 1, Z || Y ? (d.addClass("jspScrollable"), e = P.maintainPosition && (ab || db), e && (h = A(), j = B()), g(), i(), k(), e && (y(r ? U - R : h, !1), x(q ? V - S : j, !1)), H(), E(), N(), P.enableKeyboardNavigation && J(), P.clickOnTrack && o(), L(), P.hijackInternalLinks && M()) : (d.removeClass("jspScrollable"), Q.css({
                    top: 0,
                    left: 0,
                    width: T.width() - tb
                }), F(), I(), K(), p()), P.autoReinitialise && !rb ? rb = setInterval(function () {
                    f(P)
                }, P.autoReinitialiseDelay) : !P.autoReinitialise && rb && clearInterval(rb), m && d.scrollTop(0) && x(m, !1), n && d.scrollLeft(0) && y(n, !1), d.trigger("jsp-initialised", [Z || Y])
            }
            function g() {
                Y && (T.append(a('<div class="jspVerticalBar" />').append(a('<div class="jspCap jspCapTop" />'), a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragTop" />'), a('<div class="jspDragBottom" />'))), a('<div class="jspCap jspCapBottom" />'))), eb = T.find(">.jspVerticalBar"), fb = eb.find(">.jspTrack"), $ = fb.find(">.jspDrag"), P.showArrows && (jb = a('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp", m(0, -1)).bind("click.jsp", G), kb = a('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp", m(0, 1)).bind("click.jsp", G), P.arrowScrollOnHover && (jb.bind("mouseover.jsp", m(0, -1, jb)), kb.bind("mouseover.jsp", m(0, 1, kb))), l(fb, P.verticalArrowPositions, jb, kb)), hb = S, T.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function () {
                    hb -= a(this).outerHeight()
                }), $.hover(function () {
                    $.addClass("jspHover")
                }, function () {
                    $.removeClass("jspHover")
                }).bind("mousedown.jsp", function (b) {
                    a("html").bind("dragstart.jsp selectstart.jsp", G), $.addClass("jspActive");
                    var c = b.pageY - $.position().top;
                    return a("html").bind("mousemove.jsp", function (a) {
                        r(a.pageY - c, !1)
                    }).bind("mouseup.jsp mouseleave.jsp", q), !1
                }), h())
            }
            function h() {
                fb.height(hb + "px"), ab = 0, gb = P.verticalGutter + fb.outerWidth(), Q.width(R - gb - tb);
                try {
                    0 === eb.position().left && Q.css("margin-left", gb + "px")
                } catch (a) {}
            }
            function i() {
                Z && (T.append(a('<div class="jspHorizontalBar" />').append(a('<div class="jspCap jspCapLeft" />'), a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragLeft" />'), a('<div class="jspDragRight" />'))), a('<div class="jspCap jspCapRight" />'))), lb = T.find(">.jspHorizontalBar"), mb = lb.find(">.jspTrack"), bb = mb.find(">.jspDrag"), P.showArrows && (pb = a('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp", m(-1, 0)).bind("click.jsp", G), qb = a('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp", m(1, 0)).bind("click.jsp", G), P.arrowScrollOnHover && (pb.bind("mouseover.jsp", m(-1, 0, pb)), qb.bind("mouseover.jsp", m(1, 0, qb))), l(mb, P.horizontalArrowPositions, pb, qb)), bb.hover(function () {
                    bb.addClass("jspHover")
                }, function () {
                    bb.removeClass("jspHover")
                }).bind("mousedown.jsp", function (b) {
                    a("html").bind("dragstart.jsp selectstart.jsp", G), bb.addClass("jspActive");
                    var c = b.pageX - bb.position().left;
                    return a("html").bind("mousemove.jsp", function (a) {
                        t(a.pageX - c, !1)
                    }).bind("mouseup.jsp mouseleave.jsp", q), !1
                }), nb = T.innerWidth(), j())
            }
            function j() {
                T.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function () {
                    nb -= a(this).outerWidth()
                }), mb.width(nb + "px"), db = 0
            }
            function k() {
                if (Z && Y) {
                    var b = mb.outerHeight(),
                        c = fb.outerWidth();
                    hb -= b, a(lb).find(">.jspCap:visible,>.jspArrow").each(function () {
                        nb += a(this).outerWidth()
                    }), nb -= c, S -= c, R -= b, mb.parent().append(a('<div class="jspCorner" />').css("width", b + "px")), h(), j()
                }
                Z && Q.width(T.outerWidth() - tb + "px"), V = Q.outerHeight(), X = V / S, Z && (ob = Math.ceil(1 / W * nb), ob > P.horizontalDragMaxWidth ? ob = P.horizontalDragMaxWidth : ob < P.horizontalDragMinWidth && (ob = P.horizontalDragMinWidth), bb.width(ob + "px"), cb = nb - ob, u(db)), Y && (ib = Math.ceil(1 / X * hb), ib > P.verticalDragMaxHeight ? ib = P.verticalDragMaxHeight : ib < P.verticalDragMinHeight && (ib = P.verticalDragMinHeight), $.height(ib + "px"), _ = hb - ib, s(ab))
            }
            function l(a, b, c, d) {
                var e, f = "before",
                    g = "after";
                "os" == b && (b = /Mac/.test(navigator.platform) ? "after" : "split"), b == f ? g = b : b == g && (f = b, e = c, c = d, d = e), a[f](c)[g](d)
            }
            function m(a, b, c) {
                return function () {
                    return n(a, b, this, c), this.blur(), !1
                }
            }
            function n(b, c, d, e) {
                d = a(d).addClass("jspActive");
                var f, g, h = !0,
                    i = function () {
                        0 !== b && vb.scrollByX(b * P.arrowButtonSpeed), 0 !== c && vb.scrollByY(c * P.arrowButtonSpeed), g = setTimeout(i, h ? P.initialDelay : P.arrowRepeatFreq), h = !1
                    };
                i(), f = e ? "mouseout.jsp" : "mouseup.jsp", e = e || a("html"), e.bind(f, function () {
                    d.removeClass("jspActive"), g && clearTimeout(g), g = null, e.unbind(f)
                })
            }
            function o() {
                p(), Y && fb.bind("mousedown.jsp", function (b) {
                    if (b.originalTarget === c || b.originalTarget == b.currentTarget) {
                        var d, e = a(this),
                            f = e.offset(),
                            g = b.pageY - f.top - ab,
                            h = !0,
                            i = function () {
                                var a = e.offset(),
                                    c = b.pageY - a.top - ib / 2,
                                    f = S * P.scrollPagePercent,
                                    k = _ * f / (V - S);
                                if (0 > g) ab - k > c ? vb.scrollByY(-f) : r(c);
                                else {
                                    if (!(g > 0)) return j(), void 0;
                                    c > ab + k ? vb.scrollByY(f) : r(c)
                                }
                                d = setTimeout(i, h ? P.initialDelay : P.trackClickRepeatFreq), h = !1
                            }, j = function () {
                                d && clearTimeout(d), d = null, a(document).unbind("mouseup.jsp", j)
                            };
                        return i(), a(document).bind("mouseup.jsp", j), !1
                    }
                }), Z && mb.bind("mousedown.jsp", function (b) {
                    if (b.originalTarget === c || b.originalTarget == b.currentTarget) {
                        var d, e = a(this),
                            f = e.offset(),
                            g = b.pageX - f.left - db,
                            h = !0,
                            i = function () {
                                var a = e.offset(),
                                    c = b.pageX - a.left - ob / 2,
                                    f = R * P.scrollPagePercent,
                                    k = cb * f / (U - R);
                                if (0 > g) db - k > c ? vb.scrollByX(-f) : t(c);
                                else {
                                    if (!(g > 0)) return j(), void 0;
                                    c > db + k ? vb.scrollByX(f) : t(c)
                                }
                                d = setTimeout(i, h ? P.initialDelay : P.trackClickRepeatFreq), h = !1
                            }, j = function () {
                                d && clearTimeout(d), d = null, a(document).unbind("mouseup.jsp", j)
                            };
                        return i(), a(document).bind("mouseup.jsp", j), !1
                    }
                })
            }
            function p() {
                mb && mb.unbind("mousedown.jsp"), fb && fb.unbind("mousedown.jsp")
            }
            function q() {
                a("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp"), $ && $.removeClass("jspActive"), bb && bb.removeClass("jspActive")
            }
            function r(a, b) {
                Y && (0 > a ? a = 0 : a > _ && (a = _), b === c && (b = P.animateScroll), b ? vb.animate($, "top", a, s) : ($.css("top", a), s(a)))
            }
            function s(a) {
                a === c && (a = $.position().top), T.scrollTop(0), ab = a;
                var b = 0 === ab,
                    e = ab == _,
                    f = a / _,
                    g = -f * (V - S);
                (wb != b || yb != e) && (wb = b, yb = e, d.trigger("jsp-arrow-change", [wb, yb, xb, zb])), v(b, e), Q.css("top", g), d.trigger("jsp-scroll-y", [-g, b, e]).trigger("scroll")
            }
            function t(a, b) {
                Z && (0 > a ? a = 0 : a > cb && (a = cb), b === c && (b = P.animateScroll), b ? vb.animate(bb, "left", a, u) : (bb.css("left", a), u(a)))
            }
            function u(a) {
                a === c && (a = bb.position().left), T.scrollTop(0), db = a;
                var b = 0 === db,
                    e = db == cb,
                    f = a / cb,
                    g = -f * (U - R);
                (xb != b || zb != e) && (xb = b, zb = e, d.trigger("jsp-arrow-change", [wb, yb, xb, zb])), w(b, e), Q.css("left", g), d.trigger("jsp-scroll-x", [-g, b, e]).trigger("scroll")
            }
            function v(a, b) {
                P.showArrows && (jb[a ? "addClass" : "removeClass"]("jspDisabled"), kb[b ? "addClass" : "removeClass"]("jspDisabled"))
            }
            function w(a, b) {
                P.showArrows && (pb[a ? "addClass" : "removeClass"]("jspDisabled"), qb[b ? "addClass" : "removeClass"]("jspDisabled"))
            }
            function x(a, b) {
                var c = a / (V - S);
                r(c * _, b)
            }
            function y(a, b) {
                var c = a / (U - R);
                t(c * cb, b)
            }
            function z(b, c, d) {
                var e, f, g, h, i, j, k, l, m, n = 0,
                    o = 0;
                try {
                    e = a(b)
                } catch (p) {
                    return
                }
                for (f = e.outerHeight(), g = e.outerWidth(), T.scrollTop(0), T.scrollLeft(0); !e.is(".jspPane");) if (n += e.position().top, o += e.position().left, e = e.offsetParent(), /^body|html$/i.test(e[0].nodeName)) return;
                h = B(), j = h + S, h > n || c ? l = n - P.verticalGutter : n + f > j && (l = n - S + f + P.verticalGutter), isNaN(l) || x(l, d), i = A(), k = i + R, i > o || c ? m = o - P.horizontalGutter : o + g > k && (m = o - R + g + P.horizontalGutter), isNaN(m) || y(m, d)
            }
            function A() {
                return -Q.position().left
            }
            function B() {
                return -Q.position().top
            }
            function C() {
                var a = V - S;
                return a > 20 && a - B() < 10
            }
            function D() {
                var a = U - R;
                return a > 20 && a - A() < 10
            }
            function E() {
                T.unbind(Bb).bind(Bb, function (a, b, c, d) {
                    var e = db,
                        f = ab;
                    return vb.scrollBy(c * P.mouseWheelSpeed, -d * P.mouseWheelSpeed, !1), e == db && f == ab
                })
            }
            function F() {
                T.unbind(Bb)
            }
            function G() {
                return !1
            }
            function H() {
                Q.find(":input,a").unbind("focus.jsp").bind("focus.jsp", function (a) {
                    z(a.target, !1)
                })
            }
            function I() {
                Q.find(":input,a").unbind("focus.jsp")
            }
            function J() {
                function b() {
                    var a = db,
                        b = ab;
                    switch (c) {
                        case 40:
                            vb.scrollByY(P.keyboardSpeed, !1);
                            break;
                        case 38:
                            vb.scrollByY(-P.keyboardSpeed, !1);
                            break;
                        case 34:
                        case 32:
                            vb.scrollByY(S * P.scrollPagePercent, !1);
                            break;
                        case 33:
                            vb.scrollByY(-S * P.scrollPagePercent, !1);
                            break;
                        case 39:
                            vb.scrollByX(P.keyboardSpeed, !1);
                            break;
                        case 37:
                            vb.scrollByX(-P.keyboardSpeed, !1)
                    }
                    return e = a != db || b != ab
                }
                var c, e, f = [];
                Z && f.push(lb[0]), Y && f.push(eb[0]), Q.focus(function () {
                    d.focus()
                }), d.attr("tabindex", 0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp", function (d) {
                    if (d.target === this || f.length && a(d.target).closest(f).length) {
                        var g = db,
                            h = ab;
                        switch (d.keyCode) {
                            case 40:
                            case 38:
                            case 34:
                            case 32:
                            case 33:
                            case 39:
                            case 37:
                                c = d.keyCode, b();
                                break;
                            case 35:
                                x(V - S), c = null;
                                break;
                            case 36:
                                x(0), c = null
                        }
                        return e = d.keyCode == c && g != db || h != ab, !e
                    }
                }).bind("keypress.jsp", function (a) {
                    return a.keyCode == c && b(), !e
                }), P.hideFocus ? (d.css("outline", "none"), "hideFocus" in T[0] && d.attr("hideFocus", !0)) : (d.css("outline", ""), "hideFocus" in T[0] && d.attr("hideFocus", !1))
            }
            function K() {
                d.attr("tabindex", "-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp")
            }
            function L() {
                if (location.hash && location.hash.length > 1) {
                    var b, c, d = escape(location.hash.substr(1));
                    try {
                        b = a("#" + d + ', a[name="' + d + '"]')
                    } catch (e) {
                        return
                    }
                    b.length && Q.find(d) && (0 === T.scrollTop() ? c = setInterval(function () {
                        T.scrollTop() > 0 && (z(b, !0), a(document).scrollTop(T.position().top), clearInterval(c))
                    }, 50) : (z(b, !0), a(document).scrollTop(T.position().top)))
                }
            }
            function M() {
                a(document.body).data("jspHijack") || (a(document.body).data("jspHijack", !0), a(document.body).delegate("a[href*=#]", "click", function (c) {
                    var d, e, f, g, h, i, j = this.href.substr(0, this.href.indexOf("#")),
                        k = location.href;
                    if (-1 !== location.href.indexOf("#") && (k = location.href.substr(0, location.href.indexOf("#"))), j === k) {
                        d = escape(this.href.substr(this.href.indexOf("#") + 1));
                        try {
                            e = a("#" + d + ', a[name="' + d + '"]')
                        } catch (l) {
                            return
                        }
                        e.length && (f = e.closest(".jspScrollable"), g = f.data("jsp"), g.scrollToElement(e, !0), f[0].scrollIntoView && (h = a(b).scrollTop(), i = e.offset().top, (h > i || i > h + a(b).height()) && f[0].scrollIntoView()), c.preventDefault())
                    }
                }))
            }
            function N() {
                var a, b, c, d, e, f = !1;
                T.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp", function (g) {
                    var h = g.originalEvent.touches[0];
                    a = A(), b = B(), c = h.pageX, d = h.pageY, e = !1, f = !0
                }).bind("touchmove.jsp", function (g) {
                    if (f) {
                        var h = g.originalEvent.touches[0],
                            i = db,
                            j = ab;
                        return vb.scrollTo(a + c - h.pageX, b + d - h.pageY), e = e || Math.abs(c - h.pageX) > 5 || Math.abs(d - h.pageY) > 5, i == db && j == ab
                    }
                }).bind("touchend.jsp", function () {
                    f = !1
                }).bind("click.jsp-touchclick", function () {
                    return e ? (e = !1, !1) : void 0
                })
            }
            function O() {
                var a = B(),
                    b = A();
                d.removeClass("jspScrollable").unbind(".jsp"), d.replaceWith(Ab.append(Q.children())), Ab.scrollTop(a), Ab.scrollLeft(b), rb && clearInterval(rb)
            }
            var P, Q, R, S, T, U, V, W, X, Y, Z, $, _, ab, bb, cb, db, eb, fb, gb, hb, ib, jb, kb, lb, mb, nb, ob, pb, qb, rb, sb, tb, ub, vb = this,
                wb = !0,
                xb = !0,
                yb = !1,
                zb = !1,
                Ab = d.clone(!1, !1).empty(),
                Bb = a.fn.mwheelIntent ? "mwheelIntent.jsp" : "mousewheel.jsp";
            "border-box" === d.css("box-sizing") ? (sb = 0, tb = 0) : (sb = d.css("paddingTop") + " " + d.css("paddingRight") + " " + d.css("paddingBottom") + " " + d.css("paddingLeft"), tb = (parseInt(d.css("paddingLeft"), 10) || 0) + (parseInt(d.css("paddingRight"), 10) || 0)), a.extend(vb, {
                reinitialise: function (b) {
                    b = a.extend({}, P, b), f(b)
                },
                scrollToElement: function (a, b, c) {
                    z(a, b, c)
                },
                scrollTo: function (a, b, c) {
                    y(a, c), x(b, c)
                },
                scrollToX: function (a, b) {
                    y(a, b)
                },
                scrollToY: function (a, b) {
                    x(a, b)
                },
                scrollToPercentX: function (a, b) {
                    y(a * (U - R), b)
                },
                scrollToPercentY: function (a, b) {
                    x(a * (V - S), b)
                },
                scrollBy: function (a, b, c) {
                    vb.scrollByX(a, c), vb.scrollByY(b, c)
                },
                scrollByX: function (a, b) {
                    var c = A() + Math[0 > a ? "floor" : "ceil"](a),
                        d = c / (U - R);
                    t(d * cb, b)
                },
                scrollByY: function (a, b) {
                    var c = B() + Math[0 > a ? "floor" : "ceil"](a),
                        d = c / (V - S);
                    r(d * _, b)
                },
                positionDragX: function (a, b) {
                    t(a, b)
                },
                positionDragY: function (a, b) {
                    r(a, b)
                },
                animate: function (a, b, c, d) {
                    var e = {};
                    e[b] = c, a.animate(e, {
                        duration: P.animateDuration,
                        easing: P.animateEase,
                        queue: !1,
                        step: d
                    })
                },
                getContentPositionX: function () {
                    return A()
                },
                getContentPositionY: function () {
                    return B()
                },
                getContentWidth: function () {
                    return U
                },
                getContentHeight: function () {
                    return V
                },
                getPercentScrolledX: function () {
                    return A() / (U - R)
                },
                getPercentScrolledY: function () {
                    return B() / (V - S)
                },
                getIsScrollableH: function () {
                    return Z
                },
                getIsScrollableV: function () {
                    return Y
                },
                getContentPane: function () {
                    return Q
                },
                scrollToBottom: function (a) {
                    r(_, a)
                },
                hijackInternalLinks: a.noop,
                destroy: function () {
                    O()
                }
            }), f(e)
        }
        return d = a.extend({}, a.fn.jScrollPane.defaults, d), a.each(["arrowButtonSpeed", "trackClickSpeed", "keyboardSpeed"], function () {
            d[this] = d[this] || d.speed
        }), this.each(function () {
            var b = a(this),
                c = b.data("jsp");
            c ? c.reinitialise(d) : (a("script", b).filter('[type="text/javascript"],:not([type])').remove(), c = new e(b, d), b.data("jsp", c))
        })
    }, a.fn.jScrollPane.defaults = {
        showArrows: !1,
        maintainPosition: !0,
        stickToBottom: !1,
        stickToRight: !1,
        clickOnTrack: !0,
        autoReinitialise: !1,
        autoReinitialiseDelay: 500,
        verticalDragMinHeight: 0,
        verticalDragMaxHeight: 99999,
        horizontalDragMinWidth: 0,
        horizontalDragMaxWidth: 99999,
        contentWidth: c,
        animateScroll: !1,
        animateDuration: 300,
        animateEase: "linear",
        hijackInternalLinks: !1,
        verticalGutter: 4,
        horizontalGutter: 4,
        mouseWheelSpeed: 3,
        arrowButtonSpeed: 0,
        arrowRepeatFreq: 50,
        arrowScrollOnHover: !1,
        trackClickSpeed: 0,
        trackClickRepeatFreq: 70,
        verticalArrowPositions: "split",
        horizontalArrowPositions: "split",
        enableKeyboardNavigation: !0,
        hideFocus: !1,
        keyboardSpeed: 0,
        initialDelay: 300,
        speed: 30,
        scrollPagePercent: .8
    }
}(jQuery, this);;
/*! Copyright (c) 2013 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.1.3
 *
 * Requires: 1.2.2+
 */ (function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        factory(jQuery);
    }
}(function ($) {
    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];
    var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
    var lowestDelta, lowestDeltaXY;
    if ($.event.fixHooks) {
        for (var i = toFix.length; i;) {
            $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
        }
    }
    $.event.special.mousewheel = {
        setup: function () {
            if (this.addEventListener) {
                for (var i = toBind.length; i;) {
                    this.addEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
        },
        teardown: function () {
            if (this.removeEventListener) {
                for (var i = toBind.length; i;) {
                    this.removeEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };
    $.fn.extend({
        mousewheel: function (fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },
        unmousewheel: function (fn) {
            return this.unbind("mousewheel", fn);
        }
    });

    function handler(event) {
        var orgEvent = event || window.event,
            args = [].slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            absDeltaXY = 0,
            fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";
        if (orgEvent.wheelDelta) {
            delta = orgEvent.wheelDelta;
        }
        if (orgEvent.detail) {
            delta = orgEvent.detail * -1;
        }
        if (orgEvent.deltaY) {
            deltaY = orgEvent.deltaY * -1;
            delta = deltaY;
        }
        if (orgEvent.deltaX) {
            deltaX = orgEvent.deltaX;
            delta = deltaX * -1;
        }
        if (orgEvent.wheelDeltaY !== undefined) {
            deltaY = orgEvent.wheelDeltaY;
        }
        if (orgEvent.wheelDeltaX !== undefined) {
            deltaX = orgEvent.wheelDeltaX * -1;
        }
        absDelta = Math.abs(delta);
        if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta;
        }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if (!lowestDeltaXY || absDeltaXY < lowestDeltaXY) {
            lowestDeltaXY = absDeltaXY;
        }
        fn = delta > 0 ? 'floor' : 'ceil';
        delta = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY);
        args.unshift(event, delta, deltaX, deltaY);
        return ($.event.dispatch || $.event.handle).apply(this, args);
    }
}));;
var validNavigation = false;

function wireUpEvents() {
    var dont_confirm_leave = 1;

    function goodbye(e) {
        if (!validNavigation) {
            try {
                if (typeof readCookie("Logs._playingSong") == 'undefined' || readCookie("Logs._playingSong") == null) {
                    createCookie("Logs._playingSong", $.toJSON(Logs._playingSong, 24 * 365))
                    createCookie("Logs._playedtime", Logs._playedtime, 24 * 365)
                    createCookie("Logs._last_track_id", Logs._last_track_id, 24 * 365)
                }
            } catch (e) {}
        }
    }
    window.onbeforeunload = goodbye;
    $(document).bind('keypress', function (e) {
        if (e.keyCode == 116) {
            validNavigation = true;
        }
    });
    $("form").bind("submit", function () {
        validNavigation = true;
    });
    $("input[type=submit]").bind("click", function () {
        validNavigation = true;
    });
};
var share = {}
share.openPopup = function (row) {
    if (login.checklogin() == 0) {
        registration.openPopup();
        return false;
    }
    _gaq.push(['_trackEvent', 'Share-Dedicate', 'popupopen', 'sharepopup']);
    $('.ui-widget-overlay').css('display', 'none')
    $('#popup').remove();
    var template = $('#share').html();
    var formobj = {
        'popshare-email': 'popshare-email',
        'description': 'description'
    }
    var result = Mustache.render(template, formobj);
    $('#outercontainer').append('<div id="popup" >' + result + '</div>');
    $('#popup').dialog({
        autoOpen: true,
        width: 320,
        modal: true,
        dialogClass: 'shareh',
        closeText: '',
        draggable: false,
        show: {
            effect: "blind"
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            using: function (pos) {
                var topOffset = $(this).css(pos).offset().top;
                $(this).css({
                    "top": "59px"
                });
            }
        }
    });
}
share.onMytimes = function (args) {
    try {
        args.task = 'push_mytimes_data';
        args.activity_type = 'share_on_mytimes';
        $.ajax({
            dataType: 'html',
            url: BASE_URL + 'ajax/myTimesActivities',
            data: args,
            type: 'POST',
            async: true,
            success: function (data) {},
            error: function () {}
        });
    } catch (e) {}
}
share.Onfacebook = function (args) {
    try {
        var shareurl = args.share_url.substring(1);
        var url = 'http://www.facebook.com/sharer.php?u=' + BASE_URL + shareurl;
        _gaq.push(['_trackSocial', 'facebook', 'share', shareurl]);
        share.onMytimes(args);
        var left = (screen.width / 2) - (400 / 2);
        var top = (screen.height / 2) - (400 / 2);
        window.open(url, 'Facebook', "menubar=0,resizable=0,width=600,height=400,top=" + top + ",left=" + left);
    } catch (e) {
        alert(e.message)
    }
}
share.Ontwitter = function (args) {
    try {
        var type = $.trim(args.object_type);
        var title = $.trim(args.title);
        var shareurl = args.share_url.substring(1);
        var addMsg = '&hashtags=nowplaying &via=gaana';
        var msg = "";
        switch (type) {
            case '2':
                msg = 'Listening to the Album ' + title;
                break;
            case '10':
                msg = 'Listening to ' + title + ' from the album ' + args.albumtitle;
                break;
            case '4':
                msg = 'Listening to the songs of ' + title;
                break;
            case '3':
                msg = 'Listening to the playlist ' + title;
                break;
            case '6':
                msg = 'Listening to the channel ' + title;
                break;
            default:
                msg = 'Listening to ' + title;
                break;
        }
        var url = 'http://twitter.com/share?url=' + BASE_URL + shareurl;
        var share_url = url + "&text=" + msg + addMsg;
        _gaq.push(['_trackSocial', 'twitter', 'share', share_url]);
        share.onMytimes(args);
        var left = (screen.width / 2) - (400 / 2);
        var top = (screen.height / 2) - (400 / 2);
        window.open(share_url, 'Twitter', "menubar=0,resizable=0,width=600,height=400,top=" + top + ",left=" + left);
    } catch (e) {
        alert(e.message)
    }
}
share.email = function (args) {
    var emailobjTo = $("#popshare-email-to");
    var emailobjFrom = $("#popshare-email-from");
    var description = $("#description");
    var shareurl = args.share_url.substring(1);
    var urltoshare = BASE_URL + shareurl;
    var sharetitle = args.title;
    var shareImgId = args.source_id;
    var bValid = true;
    var messgetofriend = description.val();
    var friendsEmail = emailobjTo.val();
    bValid = bValid && checkRegexp(emailobjFrom, /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/, "Your email is invalid!");
    bValid = bValid && checkRegexp(emailobjTo, /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/, "Your friends email is invalid!");
    if (bValid) {
        $.ajax({
            url: BASE_URL + 'ajax/emailshare',
            data: {
                'url': urltoshare,
                'action': 'send',
                'msgtofrd': messgetofriend,
                'emailfrd': friendsEmail,
                'emailfrom': emailobjFrom.val(),
                'sharetitle': sharetitle,
                'shareImgId': shareImgId,
                'type': $('#type').val()
            },
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function (data) {
                if ($.trim(data.status) == 1) {
                    share.onMytimes(args);
                    _gaq.push(['_trackSocial', 'email', 'share', shareurl, sharetitle]);
                    messagebox.open({
                        msg: message['email_share'],
                        autoclose: false
                    }, true);
                    $('#sharemainpop').hide();
                }
            }
        });
    } else {
        console.log("Email id wrong");
    }
}
share.FBUISend = function (args) {
    try {
        var shareurl = args.share_url.substring(1);
        var urltoshare = BASE_URL + shareurl;
        FB.ui({
            link: urltoshare,
            picture: 'http://static.gaana.com/images/channel/35/crop_110x110_35.jpg',
            method: 'send',
            message: 'Dedicate this song to .'
        }, function (response) {
            if (response != null) {
                _gaq.push(['_trackSocial', 'facebook', 'send', shareurl]);
                _gaq.push(['_trackEvent', 'facebook', 'send', shareurl]);
            } else {
                _gaq.push(['_trackSocial', 'facebook', 'send', 'fail' + shareurl]);
                _gaq.push(['_trackEvent', 'facebook', 'send', 'fail' + shareurl]);
            }
        })
    } catch (e) {
        alert(e.message)
        utility.errorLog(e.message, 'Fanta');
    }
}
share.bindEvent = function () {
    $('#sharemainpop').on('click', function (e) {
        e.stopPropagation();
    })
    $('#sharemainpop').on('click', "a", function () {
        $('.arrow-up,.arrow-down').hide();
    })
    $('#sharemainpop').on('click', '#dedicate', function (e) {
        $('._stab').removeClass('_actnav')
        var tmpAlbumInfo = '';
        if (typeof shareInfo.albumtitle != 'undefined' && shareInfo.albumtitle != '') {
            tmpAlbumInfo = '<span class="a-l">' + shareInfo.albumtitle + '</span>';
        }
        $('#sh_fnd').html('<img src="' + shareInfo.albumartwork + '" alt="artwork" width="60" height="60"/><div class="_sh"><span class="a-d">' + html_entity_decode(shareInfo.title) + '</span>' + tmpAlbumInfo + '</div><div class="clear"></div><div class="_sha_btn clearfix"><a class="_nface" id="fbBtnDedicate"></a><a class="_nemail"></a></div><div class="_shr_act"><a href="javascript:void(0)" class="cancel">Cancel</a></div>')
        $(this).addClass('_actnav');
    })
    $('#share_friends').on('click', function (e) {
        $('._stab').removeClass('_actnav')
        var tmpAlbumInfo = '';
        if (typeof shareInfo.albumtitle != 'undefined' && shareInfo.albumtitle != '') {
            tmpAlbumInfo = '<span class="a-l">' + html_entity_decode(shareInfo.albumtitle) + '</span>';
        }
        $('#sh_fnd').html('<img src="' + shareInfo.albumartwork + '" alt="artwork" width="60" height="60"/><div class="_sh"><span class="a-d">' + html_entity_decode(shareInfo.title) + '</span>' + tmpAlbumInfo + '</div><div class="clear"></div><div class="_sha_btn clearfix"><a class="_nface" id="fbBtnShare"></a><a class="_ntwitt"></a></div><div class="_shr_act"><a href="javascript:void(0)" class="copylink" id="copylinkSwf"></a><a href="javascript:void(0)" class="shareemail">Share Via email</a><a href="javascript:void(0)" class="cancel">Cancel</a></div>')
        $(this).addClass('_actnav');
        if ($('#copylinkSwf').length > 0) {
            var shareURL = shareInfo.share_url.slice(1, $.trim(shareInfo.share_url.length));
            copyLink(BASE_URL + "" + shareURL);
        }
    })
    $('#sharemainpop').on('click', '._nemail', function (e) {
        var userName = (typeof jsuserdata != 'undefined' && jsuserdata.email != null) ? decodeURIComponent(jsuserdata.email) : '';
        $('#sh_fnd').html('<input type="hidden" id="type" name="type" value="dedicate"/><div class="validateTips"></div><input type="text" class="my_email" id="popshare-email-from" placeholder="Enter your email" value="' + userName + '"/><input id="popshare-email-to" type="text" placeholder="Enter your friend\'s email"/><textarea id="description" placeholder="Add a personalized message"></textarea><div class="clear"></div><div class="_shr_act"><a href="javascript:void(0)" class="a-d mar7 backbtn">&lt; Back</a><a href="javascript:void(0)" class="cancel">Cancel</a><a href="javascript:void(0)" class="sharebtn">Dedicate</a></div>')
    })
    $('#sharemainpop').on('click', '#fbBtnShare', function (e) {
        share.Onfacebook(shareInfo);
    })
    $('#sharemainpop').on('click', '#fbBtnDedicate', function (e) {
        $('#sharemainpop').hide();
        share.FBUISend(shareInfo);
    })
    $('#sharemainpop').on('click', '.sharebtn', function (e) {
        share.email(shareInfo);
    })
    $('#sharemainpop').on('click', '._ntwitt', function (e) {
        $('#sharemainpop').hide();
        $('.arrow-up').css('display', 'none');
        $('.arrow-down').css('display', 'none');
        $('.arrow-left').css('display', 'none');
        $('.arrow-right').css('display', 'none');
        share.Ontwitter(shareInfo);
    })
    $('#sharemainpop').on('click', '.cancel', function (e) {
        $('#sharemainpop').hide();
        $('.arrow-up').css('display', 'none');
        $('.arrow-down').css('display', 'none');
        $('.arrow-left').css('display', 'none');
        $('.arrow-right').css('display', 'none');
    })
    $('#sharemainpop').on('click', '._nface', function () {
        $('#sharemainpop').hide();
        $('.arrow-up').css('display', 'none');
        $('.arrow-down').css('display', 'none');
        $('.arrow-left').css('display', 'none');
        $('.arrow-right').css('display', 'none');
    })
    $('#sharemainpop').on('click', '#sh_fnd .backbtn', function (e) {
        var tmpAlbumInfo = '';
        if (typeof shareInfo.albumtitle != 'undefined' && shareInfo.albumtitle != '') {
            tmpAlbumInfo = '<span class="a-l">' + html_entity_decode(shareInfo.albumtitle) + '</span>';
        }
        $('#sh_fnd').html('<img src="' + shareInfo.albumartwork + '" alt="artwork" width="60" height="60"/><div class="_sh"><span class="a-d">' + html_entity_decode(shareInfo.title) + '</span>' + tmpAlbumInfo + '</div><div class="clear"></div>')
    });
    $('#sharemainpop').on('click', '#gshare', function () {
        $('#sharevalentinepop').hide();
        var shareURL = shareInfo.share_url.slice(1, $.trim(shareInfo.share_url.length));
        var url = BASE_URL + "" + shareURL;
        _gaq.push(['_trackSocial', 'twitter', 'share', shareURL]);
        share.onMytimes(shareInfo);
        var left = (screen.width / 2) - (400 / 2);
        var top = (screen.height / 2) - (400 / 2);
        window.open('https://plus.google.com/share?url=' + url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600,top=' + top + ',left=' + left);
        return false;
    });
    $('#sharemainpop').on('click', ".shareemail", function (e) {
        var userName = (typeof jsuserdata != 'undefined' && jsuserdata.email != '') ? decodeURIComponent(jsuserdata.email) : '';
        $('#sh_fnd').html('<input type="hidden" id="type" name="type" value="share"/><div class="validateTips"></div><input type="text" class="my_email shareEmail" id="popshare-email-from" placeholder="Enter your email" value="' + userName + '"/><input type="text" class="shareEmail" id="popshare-email-to" placeholder="Enter your friend\'s email"/><textarea id="description" class="shareDesc" placeholder="Add a personalized message"></textarea><div class="clear"></div><div class="_shr_act"><a href="javascript:void(0)" class="a-d sharebtn backbtn">&lt; Back</a><a href="javascript:void(0)" class="sharebtn">Share</a></div>')
    });
};
var radiomirchi = {}
radiomirchi.play = function (row) {
    loadJsPlayer(null)
    removeVideoAdsOnDemand();
    data = {
        sType: "radio",
        stationId: row.akamaiBase,
        feedId: row.akamaiUrl,
        stationName: row.stationName,
        artWork: row.stationArtwork,
        id: row.stationId
    };
    var obj = {};
    obj.data = data
    if (typeof gaanaMaster == 'undefined') {
        gaanaMaster = new GaanaMaster({
            autoPlay: true,
            data: null
        });
    }
    RadioMetaData.stopUpdating();
    RadioMetaData.logAdded = false;
    RadioMetaData.playing = true;
    superCookie.setItem("stationid", row.stationId);
    var cls = setInterval(function () {
        if (flashLoaded) {
            gaanaMaster.playRadio(obj);
            clearInterval(cls)
        }
    }, 1000)
    switchOffradio = false
    gAnalyticChannelClick('RadioStation', 'Click', row.stationName)
}

function playradio(obj) {
    $('.hotbox').animate({
        bottom: '0px'
    }, {
        duration: 500
    });
    var _this = obj
    var row = $.parseJSON($(_this).attr('data-value'));
    RadioMetaData.stopUpdating();
}
var radiostaion = {};

function callRadioSation(staionId, stationName, akamaiBase, akamaiUrl, stationArtwork) {
    try {
        $('#iframeid').remove();
        var id = staionId;
        var name = stationName;
        var base = akamaiBase;
        var url = akamaiUrl;
        var artWork = stationArtwork;
        var paramString = base + "##" + url + "##" + id + "##" + name + "##" + artWork;
        radiostaion.staionId = id;
        radiostaion.stationName = name;
        radiostaion.akamaiBase = akamaiBase;
        radiostaion.akamaiUrl = akamaiUrl;
        radiostaion.stationArtwork = stationArtwork;
        radiostaion.playerType = 'radiostation';
        RadioMetaData.logAdded = false;
        RadioMetaData.playing = true;
        RadioMetaData.stopUpdating();
        if (isNaN(akamaiBase) == true) {
            errorLog("Invalid sation id (akamaiBase) '" + akamaiBase + "'", 'callRadioSation');
        } else {
            var obj = {};
            obj.data = {
                sType: "radio",
                stationId: akamaiBase,
                feedId: akamaiUrl,
                stationName: stationName,
                artWork: stationArtwork,
                id: staionId
            };
            if (typeof gaanaMaster == 'undefined') {
                gaanaMaster = new GaanaMaster({
                    autoPlay: true,
                    data: null
                });
            }
            var key = obj.data.feedId + obj.data.stationId;
            superCookie.setItem("stationid", id);
            var cls = setInterval(function () {
                if (flashLoaded) {
                    gaanaMaster.playRadio(obj);
                    clearInterval(cls)
                }
            }, 1000)
            switchOffradio = false
            gAnalyticChannelClick('RadioStation', 'Click', stationName)
        }
    } catch (e) {
        alert(e.message)
    }
}
var RadioMetaData = {};
RadioMetaData = {
    playing: true,
    activate: true,
    availabeFor: new Array("6"),
    enableForAll: true,
    adsLable: 'Radio Mirchi Started...',
    metaHolder: "#trackInfo",
    feedReader: 'http://feeds.gaana.com/radiofeed/radio_mirchi_feed.php',
    data: {},
    streamdata: {},
    inertvalTime: 10000,
    timeout_id: 0,
    radioStationId: 6,
    checkNull: 0,
    isSync: false,
    trackid: 0,
    logAdded: false,
    adjustRadioTrackInfo: function () {
        if ($(this.metaHolder).length > 0) {
            var pos = $("#falshplayerouter").position();
            var zIndex = parseInt($("#falshplayerouter").css("z-index")) + 1;
            var top = pos.top + 10;
            if ($(".vodaPlaylist").length > 0 && songRec === true) {
                top = top + $(".vodaPlaylist").height() - 2;
            }
            var left = 190;
            var w = $("#falshplayerouter").width();
            var h = 20;
        }
    },
    loadRadioTrackInfo: function (t_id) {
        gaanaMaster.clearQueue();
        var track_id = (typeof (t_id) == "undefined") ? 0 : t_id;
        var onsuccess = function (res) {
            $('#lyrics_player_link').hide();
            $('#video_player_link').hide();
            if (RadioMetaData.playing == false) return;
            if ($.trim(res.toString()) == "null" || $.trim(res.toString()) == "false" || $.trim(res.toString()) == "") {
                $(".mainPlayer .social").hide();
                $(".mainPlayer .player_activity").hide();
                var data = {
                    title: RadioMetaData.adsLable
                };
                RadioMetaData.showTrackInfo(data);
                clearTimeout(RadioMetaData.timeout_id);
                RadioMetaData.timeout_id = setTimeout(function () {
                    RadioMetaData.loadRadioTrackInfo($.trim(RadioMetaData.data.id));
                }, RadioMetaData.inertvalTime);
            } else {
                var data = res;
                if (typeof RadioMetaData.data != "undefined" && typeof data.id != "undefined" && typeof data != "undefined") {
                    if ($.trim(RadioMetaData.data.id) == $.trim(data.id) || typeof RadioMetaData.data.id == 'undefined') {
                        RadioMetaData.isSync = false;
                    } else {
                        RadioMetaData.isSync = true;
                        RadioMetaData.logAdded = false;
                    }
                }
                RadioMetaData.data = data;
                if (RadioMetaData.data && typeof RadioMetaData.data != "undefined") {
                    if (typeof RadioMetaData.data.id == "undefined" || RadioMetaData.isSync == false || RadioMetaData.data.id == null) {
                        if (typeof RadioMetaData.data.id == "undefined" || RadioMetaData.data.id == null) {
                            $(".mainPlayer .social").hide();
                            $(".mainPlayer .player_activity").hide();
                            var data = {
                                title: RadioMetaData.adsLable
                            };
                            RadioMetaData.showTrackInfo(data);
                        } else {
                            if (typeof jsfavdata.track != 'undefined' && jsfavdata.track.indexOf(RadioMetaData.data.id) != '-1') {
                                RadioMetaData.data.status = 1;
                            } else {
                                RadioMetaData.data.status = 0;
                            }
                            RadioMetaData.showTrackInfo(RadioMetaData.data);
                        }
                        clearTimeout(RadioMetaData.timeout_id);
                        RadioMetaData.timeout_id = setTimeout(function () {
                            RadioMetaData.loadRadioTrackInfo();
                        }, RadioMetaData.inertvalTime);
                        if (!RadioMetaData.logAdded) {
                            RadioMetaData.logAdded = true;
                            setTimeout(function () {
                                $.ajax({
                                    type: 'post',
                                    url: BASE_URL + "ajax/get_radio_stream_data",
                                    data: RadioMetaData.data,
                                    success: function (data) {
                                        Logs._last_track_id = data;
                                        var source = RadioMetaData.data.source;
                                        var source_id = RadioMetaData.data.source_id;
                                        var song_id = RadioMetaData.data.id;
                                        var category = getKey(source, requestDataSource);
                                        gAnalyticChannelClick(category, 'Play', source_id + '|' + song_id);
                                        if (typeof RadioMetaData.data.title != 'undefined') {}
                                    }
                                });
                            }, 3000)
                            Logs._playingSong = RadioMetaData.data
                        }
                    } else {
                        Logs.addTrackLog();
                        RadioMetaData.showTrackInfo(RadioMetaData.data);
                        Logs._lastPlayedTime = Logs._playedtime;
                        Logs._playingSong = RadioMetaData.data
                        setTimeout(function () {
                            $.ajax({
                                type: 'post',
                                url: BASE_URL + "ajax/get_radio_stream_data",
                                data: RadioMetaData.data,
                                success: function (data) {
                                    Logs._last_track_id = data;
                                    var source = RadioMetaData.data.source;
                                    var source_id = RadioMetaData.data.source_id;
                                    var song_id = RadioMetaData.data.id;
                                    var category = getKey(source, requestDataSource);
                                    gAnalyticChannelClick(category, 'Play', source_id + '|' + song_id);
                                    if (typeof RadioMetaData.data.title != 'undefined') {}
                                }
                            });
                        }, 3000)
                        try {
                            if (typeof RadioMetaData.data.duration == 'undefined' || RadioMetaData.data.duration.indexOf(":") != -1) {
                                RadioMetaData.data.duration = "00:00.0";
                                var duration = RadioMetaData.data.duration.split(":");
                                var sec_arr = duration[1].split(".");
                                var seconds = parseInt(sec_arr[0], 10);
                                var time = (parseInt(duration[0], 10) * 60) + seconds;
                            } else {
                                var time = (typeof RadioMetaData.data.duration != 'undefined' && RadioMetaData.data.duration > 0) ? RadioMetaData.data.duration : 0;
                                var nextcall = time * 1000;
                            }
                        } catch (e) {}
                        clearTimeout(RadioMetaData.timeout_id);
                        RadioMetaData.timeout_id = setTimeout(function () {
                            RadioMetaData.loadRadioTrackInfo();
                        }, nextcall);
                    }
                }
            }
        };
        var on_error = function (res) {}
        $.ajax({
            crossDomain: true,
            contentType: "application/json",
            dataType: "jsonp",
            callback: onsuccess,
            url: this.feedReader,
            data: {
                id: track_id,
                station_id: RadioMetaData.radioStationId
            },
            type: 'post',
            asyn: false,
            success: onsuccess,
            error: on_error
        });
    },
    toTitleCase: function (title) {
        if (typeof title == "undefined" || title == null) return "";
        title = title.toLowerCase();
        title = title.replace(/_/g, " ");
        return title.replace(/\w\S*/g, function (title) {
            return title.charAt(0).toUpperCase() + title.substr(1).toLowerCase();
        });
    },
    showTrackInfo: function (j) {
        var jsonObj = j;
        var songInfo = j;
        var title = (typeof jsonObj.title != 'undefined' && jsonObj.title != '') ? this.toTitleCase(jsonObj.title) : '';
        var artistname = (typeof jsonObj.artistname != 'undefined' && jsonObj.artistname != '') ? this.toTitleCase(jsonObj.artistname) : '';
        var albumtitle = (typeof jsonObj.albumtitle != 'undefined' && jsonObj.albumtitle != '') ? this.toTitleCase(jsonObj.albumtitle) : '';
        title = "<span class='songName'>" + this.toTitleCase(title) + "</span>";
        albumtitle = ($.trim(albumtitle) == "") ? "" : " - <span class='albumNamePl'>" + albumtitle + "</span>";
        artistname = ($.trim(artistname) == "") ? "" : " - <span class='artistName'>" + artistname + "</span>";
        if (typeof jsonObj.artwork != 'undefined' && jsonObj.artwork != '' && jsonObj.id != '') {
            _activeSongID = jsonObj.id;
            $('.thumbHolder').attr('href', '/album/' + jsonObj.albumseokey)
            $('.thumbHolder').addClass('pjax')
            $(".mainPlayer .social").show();
            $(".mainPlayer .player_activity").show();
            if (typeof jsonObj.status != 'undefined') {
                if (jsonObj.status == 0) {
                    $(".mainPlayer .player_activity #favorite").show();
                } else {
                    $(".mainPlayer .player_activity #favorite").hide();
                }
            } else {
                $(".mainPlayer .player_activity #favorite").hide();
            }
            $('.mainPlayer .thumbHolder img').attr('src', jsonObj.artwork);
        } else {
            $(".mainPlayer .social").hide();
            $(".mainPlayer .player_activity").hide();
            $('.mainPlayer .thumbHolder img').attr('src', TMStaticUrl + '/images/radiothumbimages/' + RadioMetaData.radioStationId + ".jpg");
        }
        if (typeof jsonObj.id != 'undefined' && $.trim(jsonObj.id) != '' && (/^\d+$/.test($.trim(jsonObj.id)))) {
            var html = [title, '<span>', albumtitle, '</span>'].join('')
            $(this.metaHolder).html(html);
        } else {
            var html = title + " " + albumtitle;
            $(this.metaHolder).html(html);
        }
        $(this.metaHolder).show();
    },
    init: function (stationId) {
        try {
            RadioMetaData.stopUpdating();
            if (this.activate == true) {
                if (typeof stationId != 'undefined' && $.inArray((stationId).toString(), this.availabeFor) != -1 || this.enableForAll == true) {
                    this.radioStationId = (typeof stationId == "undefined") ? this.radioStationId : stationId;
                    this.loadRadioTrackInfo();
                    $(this.metaHolder).show();
                } else {
                    if ($(this.metaHolder).length > 0) {
                        $(this.metaHolder).hide();
                    }
                    clearTimeout(RadioMetaData.timeout_id);
                }
            };
        } catch (e) {
            alert(e.message)
        }
    },
    stopUpdating: function () {
        RadioMetaData.isSync = false;
        RadioMetaData.data = {};
        clearTimeout(RadioMetaData.timeout_id);
        if ($(this.metaHolder).length > 0) {}
    },
    getCurrentId: function () {
        RadioMetaData.trackid = false;
    },
    clearRadioHistory: function () {
        radiostaion = {};
    },
    getTime: function () {
        try {
            var _uiCtrlr = gaanaMaster.getUIController();
            var t = _uiCtrlr.getTime().time ? _uiCtrlr.getTime().time.split(':') : "00:00";
            var totaltime = (parseInt(t[0]) * 60) + parseInt(t[1]);
            var p_t = _previoustimeplayed.split(':');
            var p_t_s = (parseInt(p_t[0]) * 60) + parseInt(p_t[1]);
            var actualtime = totaltime - p_t_s
        } catch (e) {
            alert(e.message)
        }
        return actualtime;
    }
};
jQuery.extend({
    createUploadIframe: function (id, uri) {
        var frameId = 'jUploadFrame' + id;
        if (window.ActiveXObject) {
            var io = document.createElement('<iframe id="' + frameId + '" name="' + frameId + '" />');
            if (typeof uri == 'boolean') {
                io.src = 'javascript:false';
            } else if (typeof uri == 'string') {
                io.src = uri;
            }
        } else {
            var io = document.createElement('iframe');
            io.id = frameId;
            io.name = frameId;
        }
        io.style.position = 'absolute';
        io.style.top = '-1000px';
        io.style.left = '-1000px';
        document.body.appendChild(io);
        return io
    },
    createUploadForm: function (id, fileElementId) {
        var formId = 'jUploadForm' + id;
        var fileId = 'jUploadFile' + id;
        var form = $('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
        var oldElement = $('#' + fileElementId);
        var newElement = $(oldElement).clone();
        $(oldElement).attr('id', fileId);
        $(oldElement).before(newElement);
        $(oldElement).appendTo(form);
        $(form).css('position', 'absolute');
        $(form).css('top', '-1200px');
        $(form).css('left', '-1200px');
        $(form).appendTo('body');
        return form;
    },
    ajaxFileUpload: function (s) {
        s = jQuery.extend({}, jQuery.ajaxSettings, s);
        var id = new Date().getTime()
        var form = jQuery.createUploadForm(id, s.fileElementId);
        var io = jQuery.createUploadIframe(id, s.secureuri);
        var frameId = 'jUploadFrame' + id;
        var formId = 'jUploadForm' + id;
        if (s.global && !jQuery.active++) {
            jQuery.event.trigger("ajaxStart");
        }
        var requestDone = false;
        var xml = {}
        if (s.global) jQuery.event.trigger("ajaxSend", [xml, s]);
        var uploadCallback = function (isTimeout) {
            var io = document.getElementById(frameId);
            try {
                if (io.contentWindow) {
                    xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
                    xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;
                } else if (io.contentDocument) {
                    xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
                    xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
                }
            } catch (e) {
                jQuery.handleError(s, xml, null, e);
            }
            if (xml || isTimeout == "timeout") {
                requestDone = true;
                var status;
                try {
                    status = isTimeout != "timeout" ? "success" : "error";
                    if (status != "error") {
                        var data = jQuery.uploadHttpData(xml, s.dataType);
                        if (s.success) s.success(data, status);
                        if (s.global) jQuery.event.trigger("ajaxSuccess", [xml, s]);
                    } else jQuery.handleError(s, xml, status);
                } catch (e) {
                    status = "error";
                    jQuery.handleError(s, xml, status, e);
                }
                if (s.global) jQuery.event.trigger("ajaxComplete", [xml, s]);
                if (s.global && !--jQuery.active) jQuery.event.trigger("ajaxStop");
                if (s.complete) s.complete(xml, status);
                jQuery(io).unbind()
                setTimeout(function () {
                    try {
                        $(io).remove();
                        $(form).remove();
                    } catch (e) {
                        jQuery.handleError(s, xml, null, e);
                    }
                }, 100)
                xml = null
            }
        }
        if (s.timeout > 0) {
            setTimeout(function () {
                if (!requestDone) uploadCallback("timeout");
            }, s.timeout);
        }
        try {
            var form = $('#' + formId);
            $(form).attr('action', s.url);
            $(form).attr('method', 'POST');
            $(form).attr('target', frameId);
            if (form.encoding) {
                form.encoding = 'multipart/form-data';
            } else {
                form.enctype = 'multipart/form-data';
            }
            $(form).submit();
        } catch (e) {
            jQuery.handleError(s, xml, null, e);
        }
        if (window.attachEvent) {
            document.getElementById(frameId).attachEvent('onload', uploadCallback);
        } else {
            document.getElementById(frameId).addEventListener('load', uploadCallback, false);
        }
        return {
            abort: function () {}
        };
    },
    uploadHttpData: function (r, type) {
        var data = !type;
        data = type == "xml" || data ? r.responseXML : r.responseText;
        return data;
    }
});
var googletag;
var _hash = page = '';
var resolution = ($(window).width() >= 1200) ? 'high' : 'low';
if (resolution == 'high') {
    var dfpAdsArr = {
        'test': {
            "ads_645x60_strip": "div-gpt-ad-1397651404611-4",
            "ads_300x250_promotional": "div-gpt-ad-1397651404611-0",
            "ads_300x250": "div-gpt-ad-1397651404611-2",
            "ads_135x35": "",
            "ads_110x110": "div-gpt-ad-1397651404611-1",
            "ads_645x60_pd": "div-gpt-ad-1397651404611-5",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-5"
        },
        'home': {
            "ads_645x60_strip": "div-gpt-ad-1396272345456-0",
            "ads_300x250_promotional": "div-gpt-ad-1396272345456-1",
            "ads_300x250": "div-gpt-ad-1396272345456-2",
            "ads_135x35": "div-gpt-ad-1396272345456-3",
            "ads_110x110": "div-gpt-ad-1396272345456-4",
            "ads_645x60_pd": "div-gpt-ad-1396272345456-6",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'newrelease': {
            "ads_300x250_promotional": "div-gpt-ad-1396272382487-0",
            "ads_300x250": "div-gpt-ad-1396272382487-1",
            "ads_135x35": "div-gpt-ad-1396272382487-2",
            "ads_110x110": "div-gpt-ad-1396272382487-3",
            "ads_645x60_pd": "div-gpt-ad-1396272382487-5",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'genre': {
            "ads_300x250_promotional": "div-gpt-ad-1396272310378-0",
            "ads_300x250": "div-gpt-ad-1396272310378-1",
            "ads_135x35": "div-gpt-ad-1396272310378-2",
            "ads_110x110": "div-gpt-ad-1396272310378-3",
            "ads_645x60_pd": "div-gpt-ad-1396272310378-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'album': {
            "ads_300x250_promotional": "div-gpt-ad-1396272178213-0",
            "ads_300x250": "div-gpt-ad-1396272178213-1",
            "ads_135x35": "div-gpt-ad-1396272178213-2",
            "ads_110x110": "div-gpt-ad-1396272178213-3",
            "ads_645x60_pd": "div-gpt-ad-1396272178213-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'albumdetail': {
            "ads_300x250_promotional": "div-gpt-ad-1396272119698-0",
            "ads_300x250": "div-gpt-ad-1396272119698-1",
            "ads_135x35": "div-gpt-ad-1396272119698-2",
            "ads_110x110": "div-gpt-ad-1396272119698-3",
            "ads_645x60_pd": "div-gpt-ad-1396272119698-5",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'artist': {
            "ads_300x250_promotional": "div-gpt-ad-1396272211578-0",
            "ads_300x250": "div-gpt-ad-1396272211578-1",
            "ads_135x35": "div-gpt-ad-1396272211578-2",
            "ads_110x110": "div-gpt-ad-1396272211578-3",
            "ads_645x60_pd": "div-gpt-ad-1396272211578-5",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'playlist': {
            "ads_300x250_promotional": "div-gpt-ad-1396272418239-0",
            "ads_300x250": "div-gpt-ad-1396272418239-1",
            "ads_135x35": "div-gpt-ad-1396272418239-2",
            "ads_110x110": "div-gpt-ad-1396272418239-3",
            "ads_645x60_pd": "div-gpt-ad-1396272418239-5",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'playlistdetail': {
            "ads_300x250_promotional": "div-gpt-ad-1396272418239-0",
            "ads_300x250": "div-gpt-ad-1396272418239-1",
            "ads_135x35": "div-gpt-ad-1396272418239-2",
            "ads_110x110": "div-gpt-ad-1396272418239-3",
            "ads_645x60_pd": "div-gpt-ad-1396272418239-5",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'mostpopular': {
            "ads_300x250_promotional": "div-gpt-ad-1396272525619-0",
            "ads_300x250": "div-gpt-ad-1396272525619-1",
            "ads_135x35": "div-gpt-ad-1396272525619-2",
            "ads_110x110": "div-gpt-ad-1396272525619-3",
            "ads_645x60_pd": "div-gpt-ad-1396272525619-5",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'radio': {
            "ads_300x250_promotional": "div-gpt-ad-1396272556412-0",
            "ads_300x250": "div-gpt-ad-1396272556412-1",
            "ads_135x35": "div-gpt-ad-1396272556412-2",
            "ads_110x110": "div-gpt-ad-1396272556412-3",
            "ads_645x60_pd": "div-gpt-ad-1396272556412-5",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'gaanaradio': {
            "ads_300x250_promotional": "div-gpt-ad-1396272277577-0",
            "ads_300x250": "div-gpt-ad-1396272277577-1",
            "ads_135x35": "div-gpt-ad-1396272277577-2",
            "ads_110x110": "div-gpt-ad-1396272277577-3",
            "ads_645x60_pd": "div-gpt-ad-1396272277577-5",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'myfavorite': {
            "ads_300x250_promotional": "div-gpt-ad-1396272247361-0",
            "ads_300x250": "div-gpt-ad-1396272247361-1",
            "ads_135x35": "div-gpt-ad-1396272247361-2",
            "ads_110x110": "div-gpt-ad-1396272247361-3",
            "ads_645x60_pd": "div-gpt-ad-1396272247361-5",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'rest': {
            "ads_300x250_promotional": "div-gpt-ad-1396272588862-0",
            "ads_300x250": "div-gpt-ad-1396272588862-1",
            "ads_135x35": "div-gpt-ad-1396272588862-2",
            "ads_110x110": "div-gpt-ad-1396272588862-3",
            "ads_645x60_pd": "div-gpt-ad-1396272588862-5",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'zoomplaylists': {
            "ads_300x250_promotional": "div-gpt-ad-1396272619091-0",
            "ads_300x250": "div-gpt-ad-1396272619091-1",
            "ads_135x35": "div-gpt-ad-1396272619091-2",
            "ads_110x110": "div-gpt-ad-1396272619091-3",
            "ads_645x60_pd": "div-gpt-ad-1396272619091-5",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'home1': {
            "ads_645x60_strip": "div-gpt-ad-1381301229773-0",
            "ads_300x250_promotional": "div-gpt-ad-1381301229773-1",
            "ads_300x250": "div-gpt-ad-1381301229773-2",
            "ads_135x35": "div-gpt-ad-1381301229773-3",
            "ads_110x110": "div-gpt-ad-1381301229773-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'discover': {
            "ads_300x250_promotional": "div-gpt-ad-1399533515732-0",
            "ads_300x250": "div-gpt-ad-1399533515732-1",
            "ads_135x35": "div-gpt-ad-1399533515732-2",
            "ads_110x110": "div-gpt-ad-1399533515732-3",
            "ads_645x60_pd": "div-gpt-ad-1399533515732-5"
        },
        'channel': {
            "ads_300x250_promotional": "div-gpt-ad-1400242945619-0",
            "ads_300x250": "div-gpt-ad-1400242945619-0",
            "ads_135x35": "",
            "ads_110x110": "",
            "ads_645x60_pd": "div-gpt-ad-1400242945619-3"
        }
    }
} else {
    var dfpAdsArr = {
        'home': {
            "ads_645x60_strip": "div-gpt-ad-1396272345456-0",
            "ads_300x250_promotional": "div-gpt-ad-1396272345456-1",
            "ads_300x250": "div-gpt-ad-1396272345456-2",
            "ads_135x35": "div-gpt-ad-1396272345456-3",
            "ads_110x110": "div-gpt-ad-1396272345456-4",
            "ads_645x60_pd": "div-gpt-ad-1396272345456-5",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'newrelease': {
            "ads_300x250_promotional": "div-gpt-ad-1396272382487-0",
            "ads_300x250": "div-gpt-ad-1396272382487-1",
            "ads_135x35": "div-gpt-ad-1396272382487-2",
            "ads_110x110": "div-gpt-ad-1396272382487-3",
            "ads_645x60_pd": "div-gpt-ad-1396272382487-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'genre': {
            "ads_300x250_promotional": "div-gpt-ad-1396272310378-0",
            "ads_300x250": "div-gpt-ad-1396272310378-1",
            "ads_135x35": "div-gpt-ad-1396272310378-2",
            "ads_110x110": "div-gpt-ad-1396272310378-3",
            "ads_645x60_pd": "div-gpt-ad-1396272310378-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'album': {
            "ads_300x250_promotional": "div-gpt-ad-1396272178213-0",
            "ads_300x250": "div-gpt-ad-1396272178213-1",
            "ads_135x35": "div-gpt-ad-1396272178213-2",
            "ads_110x110": "div-gpt-ad-1396272178213-3",
            "ads_645x60_pd": "div-gpt-ad-1396272178213-3",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'albumdetail': {
            "ads_300x250_promotional": "div-gpt-ad-1396272119698-0",
            "ads_300x250": "div-gpt-ad-1396272119698-1",
            "ads_135x35": "div-gpt-ad-1396272119698-2",
            "ads_110x110": "div-gpt-ad-1396272119698-3",
            "ads_645x60_pd": "div-gpt-ad-1396272119698-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'artist': {
            "ads_300x250_promotional": "div-gpt-ad-1396272211578-0",
            "ads_300x250": "div-gpt-ad-1396272211578-1",
            "ads_135x35": "div-gpt-ad-1396272211578-2",
            "ads_110x110": "div-gpt-ad-1396272211578-3",
            "ads_645x60_pd": "div-gpt-ad-1396272211578-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'playlist': {
            "ads_300x250_promotional": "div-gpt-ad-1396272418239-0",
            "ads_300x250": "div-gpt-ad-1396272418239-1",
            "ads_135x35": "div-gpt-ad-1396272418239-2",
            "ads_110x110": "div-gpt-ad-1396272418239-3",
            "ads_645x60_pd": "div-gpt-ad-1381301308337-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'playlistdetail': {
            "ads_300x250_promotional": "div-gpt-ad-1396272418239-0",
            "ads_300x250": "div-gpt-ad-1396272418239-1",
            "ads_135x35": "div-gpt-ad-1396272418239-2",
            "ads_110x110": "div-gpt-ad-1396272418239-3",
            "ads_645x60_pd": "div-gpt-ad-1381301308337-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'mostpopular': {
            "ads_300x250_promotional": "div-gpt-ad-1396272525619-0",
            "ads_300x250": "div-gpt-ad-1396272525619-1",
            "ads_135x35": "div-gpt-ad-1396272525619-2",
            "ads_110x110": "div-gpt-ad-1396272525619-3",
            "ads_645x60_pd": "div-gpt-ad-1396272525619-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'radio': {
            "ads_300x250_promotional": "div-gpt-ad-1396272556412-0",
            "ads_300x250": "div-gpt-ad-1396272556412-1",
            "ads_135x35": "div-gpt-ad-1396272556412-2",
            "ads_110x110": "div-gpt-ad-1396272556412-3",
            "ads_645x60_pd": "div-gpt-ad-1396272556412-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'gaanaradio': {
            "ads_300x250_promotional": "div-gpt-ad-1396272277577-0",
            "ads_300x250": "div-gpt-ad-1396272277577-1",
            "ads_135x35": "div-gpt-ad-1396272277577-2",
            "ads_110x110": "div-gpt-ad-1396272277577-3",
            "ads_645x60_pd": "div-gpt-ad-1396272277577-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'myfavorite': {
            "ads_300x250_promotional": "div-gpt-ad-1396272247361-0",
            "ads_300x250": "div-gpt-ad-1396272247361-1",
            "ads_135x35": "div-gpt-ad-1396272247361-2",
            "ads_110x110": "div-gpt-ad-1396272247361-3",
            "ads_645x60_pd": "div-gpt-ad-1396272247361-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'rest': {
            "ads_300x250_promotional": "div-gpt-ad-1396272588862-0",
            "ads_300x250": "div-gpt-ad-1396272588862-1",
            "ads_135x35": "div-gpt-ad-1396272588862-2",
            "ads_110x110": "div-gpt-ad-1396272588862-3",
            "ads_645x60_pd": "div-gpt-ad-1396272588862-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'zoomplaylists': {
            "ads_300x250_promotional": "div-gpt-ad-1396272619091-0",
            "ads_300x250": "div-gpt-ad-1396272619091-1",
            "ads_135x35": "div-gpt-ad-1396272619091-2",
            "ads_110x110": "div-gpt-ad-1396272619091-3",
            "ads_645x60_pd": "div-gpt-ad-1396272619091-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'home1': {
            "ads_645x60_strip": "div-gpt-ad-1381301229773-0",
            "ads_300x250_promotional": "div-gpt-ad-1381301229773-1",
            "ads_300x250": "div-gpt-ad-1381301229773-2",
            "ads_135x35": "div-gpt-ad-1381301229773-3",
            "ads_110x110": "div-gpt-ad-1381301229773-4",
            "ads_300x250_promotional_US": "div-gpt-ad-1397651404611-0"
        },
        'discover': {
            "ads_300x250_promotional": "div-gpt-ad-1399533515732-0",
            "ads_300x250": "div-gpt-ad-1399533515732-1",
            "ads_135x35": "div-gpt-ad-1399533515732-2",
            "ads_110x110": "div-gpt-ad-1399533515732-3",
            "ads_645x60_pd": "div-gpt-ad-1399533515732-4"
        },
        'channel': {
            "ads_300x250_promotional": "div-gpt-ad-1400242945619-0",
            "ads_300x250": "div-gpt-ad-1400242945619-0",
            "ads_135x35": "",
            "ads_110x110": "",
            "ads_645x60_pd": "div-gpt-ad-1400242945619-2"
        }
    }
}
var languageArr = ['hindi', 'english', 'tamil', 'telugu', 'kannada', 'malayalam', 'bengali', 'punjabi', 'oriya'];

function RenderDOMElements() {
    if (location.href.indexOf('?') > 0) {
        var _tmp = location.href.split('?');
        _hash = _tmp[0].split('/');
    } else _hash = location.href.split('/');
    page = (_hash[3] == '') ? 'home' : _hash[3];
    if (typeof dfpAdsArr[page] == 'undefined') {
        page = 'rest';
    }
    if (isGaanaPaidUserCheck()) {
        if ($('#Gaana-Top-Slug').length > 0) {
            $('#Gaana-Top-Slug').html('');
        }
        if ($('#Gaana-Player-Slug').length > 0) {
            $('#Gaana-Player-Slug').html('');
        }
        if ($('#Gaana-Home-Top_Ads').length > 0) {
            $('#Gaana-Home-Top_Ads').html('');
        }
        if ($('#Gaana-Home-Cubical_Ads').length > 0) {
            $('#Gaana-Home-Cubical_Ads').html('');
        }
        if ($('#Gaana-Home-Mid_Ads').length > 0) {
            $('#Gaana-Home-Mid_Ads').html('');
        }
        if ($('#Gaana-Section-Cubical_Ads').length > 0) {
            $('#Gaana-Section-Cubical_Ads').removeClass("list parentnode");
            $('#Gaana-Section-Cubical_Ads').html('');
        }
        if ($('#Gaana-Mid_Ads').length > 0) {
            $('#Gaana-Mid_Ads').removeClass("list parentnode").width(0);
            $('#Gaana-Mid_Ads').html('');
        }
        $("#adsRightTop").html("");
        $("#adsRightMid").html("");
        return false;
    } else {
        if ($('#Gaana-Top-Slug').length > 0) {
            $('#Gaana-Top-Slug').html('<div id="' + dfpAdsArr[page].ads_135x35 + '"></div>');
        }
        if ($('#Gaana-Home-Top_Ads').length > 0) {
            $('#Gaana-Home-Top_Ads').html('<div id="' + dfpAdsArr[page].ads_645x60_pd + '" style="height:auto"></div>');
        }
        if ($('#Gaana-Home-Cubical_Ads').length > 0) {
            $('#Gaana-Home-Cubical_Ads').html('<li class="list parentnode"><div id="' + dfpAdsArr[page].ads_110x110 + '"  style="width:110px; height:110px;"></div></li>');
        }
        if ($('#Gaana-Home-Mid_Ads').length > 0) {
            $('#Gaana-Home-Mid_Ads').html('<div id="' + dfpAdsArr[page].ads_645x60_strip + '" id="Gaana-Home-Mid_Ads"></div>');
        }
        if ($('#Gaana-Section-Top_Ads').length > 0) {
            $('#Gaana-Section-Top_Ads').html('<div id="' + dfpAdsArr[page].ads_645x60_pd + '" style="height:auto"></div>');
        }
        if ($('#Gaana-Section-Cubical_Ads').length > 0) {
            $('#Gaana-Section-Cubical_Ads').addClass("list parentnode");
            $('#Gaana-Section-Cubical_Ads').html('<div id="' + dfpAdsArr[page].ads_110x110 + '"  style="width:110px; height:110px;"></div>');
        }
        $("#adsRightTop").html("");
        $("#adsRightMid").html("");
        $('#paiduser').html("");
        $("#adsRightTop").html('<div id="' + dfpAdsArr[page].ads_300x250_promotional + '"></div>');
        $("#adsRightMid").html('<div id="' + dfpAdsArr[page].ads_300x250 + '" style="display:none"></div>');
    }
}

function dfpAdSlots() {
    RenderDOMElements();
    if (isGaanaPaidUserCheck()) {
        return;
    }
    try {
        if ($('#dfp').length > 0) {
            $('#dfp').remove();
            $('#lotame').remove();
        }
        var _gads = document.createElement('script');
        _gads.id = 'lotame';
        _gads.type = 'text/javascript';
        var useSSL = 'https:' == document.location.protocol;
        _gads.src = (useSSL ? 'https:' : 'http:') + '//ad.crwdcntrl.net/5/c=2800/pe=y/callback=_loadDFP';
        document.body.appendChild(_gads);
    } catch (e) {
        console.log("DFP Error on dfpAdSlots " + e.message);
    }
}

function _loadDFP(_ccaud) {
    googletag = {};
    googletag.cmd = [];
    (function () {
        var gads = document.createElement('script');
        gads.async = true;
        gads.id = 'dfp';
        gads.type = 'text/javascript';
        var useSSL = 'https:' == document.location.protocol;
        gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
        document.body.appendChild(gads);
    })();
    googletag.cmd.push(function () {
        var _auds = new Array();
        if (typeof (_ccaud) != 'undefined') {
            for (var i = 0; i < _ccaud.Profile.Audiences.Audience.length; i++) {
                if (i < 200) {
                    _auds.push(_ccaud.Profile.Audiences.Audience[i].abbr);
                }
            }
        }
        var _HDL = '';
        var _ARC1 = '';
        var _Hyp1 = '';
        var _article = '';
        var _tval = function (v) {
            if (typeof (v) == 'undefined') return '';
            if (v.length > 100) return v.substr(0, 100);
            return v;
        }
        switch (page) {
            case 'test':
                googletag.defineSlot('/7176/Gaana_Test/Gaana_Test2_300x250', [300, 250], 'div-gpt-ad-1397651404611-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana_Test/Gaana_Test_110x110', [110, 110], 'div-gpt-ad-1397651404611-1').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana_Test/Gaana_Test_300x250', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1397651404611-2').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana_Test/Gaana_Test_728x90', [728, 90], 'div-gpt-ad-1397651404611-3').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana_Test/Gaana_Test_925x60', [645, 60], 'div-gpt-ad-1397651404611-4').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana_Test/Gaana_Test_Top_925x60', [645, 60], 'div-gpt-ad-1397651404611-5').addService(googletag.pubads());
                break;
            case 'home1':
                googletag.defineSlot('/7176/Gaana/Gaana_Home/Gaana_HP_MID_STP_645', [645, 60], 'div-gpt-ad-1381301229773-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Home/Gaana_HP_RHS_ATF_300', [300, 250], 'div-gpt-ad-1381301229773-1').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Home/Gaana_HP_RHS_BTF_300', [300, 250], 'div-gpt-ad-1381301229773-2').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Home/Gaana_HP_SB_135', [135, 35], 'div-gpt-ad-1381301229773-3').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Home/Gaana_HP_TBN_110', [110, 110], 'div-gpt-ad-1381301229773-4').addService(googletag.pubads());
                break;
            case 'home':
                googletag.defineSlot('/7176/Gaana/Gaana_Home/Gaana_HP_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1396272345456-1').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Home/Gaana_HP_MID_STP_645', [645, 60], 'div-gpt-ad-1396272345456-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Home/Gaana_HP_RHS_BTF_300', [300, 250], 'div-gpt-ad-1396272345456-2').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Home/Gaana_HP_TBN_110', [110, 110], 'div-gpt-ad-1396272345456-4').addService(googletag.pubads());
                if (resolution == 'high') {
                    googletag.defineSlot('/7176/Gaana/Gaana_Home/Gaana_HP_TOP_PD_728', [728, 90], 'div-gpt-ad-1396272345456-6').addService(googletag.pubads());
                } else {
                    googletag.defineSlot('/7176/Gaana/Gaana_Home/Gaana_HP_TOP_PD_645', [645, 60], 'div-gpt-ad-1396272345456-5').addService(googletag.pubads());
                }
                break;
            case 'newrelease':
                googletag.defineSlot('/7176/Gaana/Gaana_NewReleases/Gaana_ROS_NR_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1396272382487-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_NewReleases/Gaana_ROS_NR_RHS_BTF_300', [300, 250], 'div-gpt-ad-1396272382487-1').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_NewReleases/Gaana_ROS_NR_TBN_110', [110, 110], 'div-gpt-ad-1396272382487-3').addService(googletag.pubads());
                if (resolution == 'high') {
                    googletag.defineSlot('/7176/Gaana/Gaana_NewReleases/Gaana_ROS_NR_TOP_PD_728', [728, 90], 'div-gpt-ad-1396272382487-5').addService(googletag.pubads());
                } else {
                    googletag.defineSlot('/7176/Gaana/Gaana_NewReleases/Gaana_ROS_NR_TOP_PD_645', [645, 60], 'div-gpt-ad-1396272382487-4').addService(googletag.pubads());
                }
                break;
            case 'genre':
                googletag.defineSlot('/7176/Gaana/Gaana_Genre/Gaana_ROS_GEN_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1396272310378-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Genre/Gaana_ROS_GEN_RHS_BTF_300', [300, 250], 'div-gpt-ad-1396272310378-1').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Genre/Gaana_ROS_GEN_TBN_110', [110, 110], 'div-gpt-ad-1396272310378-3').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Genre/Gaana_ROS_GEN_TOP_PD_645', [645, 60], 'div-gpt-ad-1396272310378-4').addService(googletag.pubads());
                break;
            case 'album':
                googletag.defineSlot('/7176/Gaana/Gaana_Albums/Gaana_ROS_ALB_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1396272178213-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Albums/Gaana_ROS_ALB_RHS_BTF_300', [300, 250], 'div-gpt-ad-1396272178213-1').addService(googletag.pubads());
                var checkLanguage = _hash[4].toLowerCase();
                if ($.inArray(checkLanguage, languageArr) >= 0) {
                    if (resolution == 'high') {
                        googletag.defineSlot('/7176/Gaana/Gaana_Albums/Gaana_ROS_ALB_TOP_PD_728', [728, 90], 'div-gpt-ad-1396272178213-4').addService(googletag.pubads());
                    } else {
                        googletag.defineSlot('/7176/Gaana/Gaana_Albums/Gaana_ROS_ALB_TOP_PD_645', [645, 60], 'div-gpt-ad-1396272178213-3').addService(googletag.pubads());
                    }
                }
                break;
            case 'albumdetail':
                googletag.defineSlot('/7176/Gaana/Gaana_Albumdetail/Gaana_ROS_ALBD_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1396272119698-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Albumdetail/Gaana_ROS_ALBD_RHS_BTF_300', [300, 250], 'div-gpt-ad-1396272119698-1').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Albumdetail/Gaana_ROS_ALBD_TBN_110', [110, 110], 'div-gpt-ad-1396272119698-3').addService(googletag.pubads());
                if (resolution == 'high') {
                    googletag.defineSlot('/7176/Gaana/Gaana_Albumdetail/Gaana_ROS_ALBD_TOP_PD_728', [728, 90], 'div-gpt-ad-1396272119698-5').addService(googletag.pubads());
                } else {
                    googletag.defineSlot('/7176/Gaana/Gaana_Albumdetail/Gaana_ROS_ALBD_TOP_PD_645', [645, 60], 'div-gpt-ad-1396272119698-4').addService(googletag.pubads());
                }
                break;
            case 'artist':
                googletag.defineSlot('/7176/Gaana/Gaana_Artists/Gaana_ROS_ART_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1396272211578-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Artists/Gaana_ROS_ART_RHS_BTF_300', [300, 250], 'div-gpt-ad-1396272211578-1').addService(googletag.pubads());
                var checkLanguage = _hash[4].toLowerCase();
                if ($.inArray(checkLanguage, languageArr) >= 0) {
                    googletag.defineSlot('/7176/Gaana/Gaana_Artists/Gaana_ROS_ART_TBN_110', [110, 110], 'div-gpt-ad-1396272211578-3').addService(googletag.pubads());
                    if (resolution == 'high') {
                        googletag.defineSlot('/7176/Gaana/Gaana_Artists/Gaana_ROS_ART_TOP_PD_728', [728, 90], 'div-gpt-ad-1396272211578-5').addService(googletag.pubads());
                    } else {
                        googletag.defineSlot('/7176/Gaana/Gaana_Artists/Gaana_ROS_ART_TOP_PD_645', [645, 60], 'div-gpt-ad-1396272211578-4').addService(googletag.pubads());
                    }
                }
                break;
            case 'playlist':
                googletag.defineSlot('/7176/Gaana/Gaana_Playlistdetail/Gaana_ROS_PLD_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1396272418239-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Playlistdetail/Gaana_ROS_PLD_RHS_BTF_300', [300, 250], 'div-gpt-ad-1396272418239-1').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Playlistdetail/Gaana_ROS_PLD_TBN_110', [110, 110], 'div-gpt-ad-1396272418239-3').addService(googletag.pubads());
                if (typeof _hash[4] == 'undefined' || _hash[4].toLowerCase() == 'featuredplaylist') {
                    if (resolution == 'high') {
                        googletag.defineSlot('/7176/Gaana/Gaana_Playlistdetail/Gaana_ROS_PLD_TOP_PD_728', [728, 90], 'div-gpt-ad-1396272418239-5').addService(googletag.pubads());
                    } else {
                        googletag.defineSlot('/7176/Gaana/Gaana_Playlistdetail/Gaana_ROS_PLD_TOP_PD_645', [645, 60], 'div-gpt-ad-1396272418239-4').addService(googletag.pubads());
                    }
                }
                break;
            case 'mostpopular':
                googletag.defineSlot('/7176/Gaana/Gaana_Popular/Gaana_ROS_POP_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1396272525619-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Popular/Gaana_ROS_POP_RHS_BTF_300', [300, 250], 'div-gpt-ad-1396272525619-1').addService(googletag.pubads());
                if (_hash[5].toLowerCase() == 'album' || _hash[5].toLowerCase == 'artist') {
                    googletag.defineSlot('/7176/Gaana/Gaana_Popular/Gaana_ROS_POP_TBN_110', [110, 110], 'div-gpt-ad-1396272525619-3').addService(googletag.pubads());
                }
                if (resolution == 'high') {
                    googletag.defineSlot('/7176/Gaana/Gaana_Popular/Gaana_ROS_POP_TOP_PD_728', [728, 90], 'div-gpt-ad-1396272525619-5').addService(googletag.pubads());
                } else {
                    googletag.defineSlot('/7176/Gaana/Gaana_Popular/Gaana_ROS_POP_TOP_PD_645', [645, 60], 'div-gpt-ad-1396272525619-4').addService(googletag.pubads());
                }
                break;
            case 'radio':
                googletag.defineSlot('/7176/Gaana/Gaana_RadioMirchi/Gaana_ROS_RDM_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1396272556412-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_RadioMirchi/Gaana_ROS_RDM_RHS_BTF_300', [300, 250], 'div-gpt-ad-1396272556412-1').addService(googletag.pubads());
                if (resolution == 'high') {
                    googletag.defineSlot('/7176/Gaana/Gaana_RadioMirchi/Gaana_ROS_RDM_TOP_PD_728', [728, 90], 'div-gpt-ad-1396272556412-5').addService(googletag.pubads());
                } else {
                    googletag.defineSlot('/7176/Gaana/Gaana_RadioMirchi/Gaana_ROS_RDM_TOP_PD_645', [645, 60], 'div-gpt-ad-1396272556412-4').addService(googletag.pubads());
                }
                break;
            case 'gaanaradio':
                googletag.defineSlot('/7176/Gaana/Gaana_GaanaRadio/Gaana_ROS_GRD_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1396272277577-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_GaanaRadio/Gaana_ROS_GRD_RHS_BTF_300', [300, 250], 'div-gpt-ad-1396272277577-1').addService(googletag.pubads());
                if (resolution == 'high') {
                    googletag.defineSlot('/7176/Gaana/Gaana_GaanaRadio/Gaana_ROS_GRD_TOP_PD_728', [728, 90], 'div-gpt-ad-1396272277577-5').addService(googletag.pubads());
                } else {
                    googletag.defineSlot('/7176/Gaana/Gaana_GaanaRadio/Gaana_ROS_GRD_TOP_PD_645', [645, 60], 'div-gpt-ad-1396272277577-4').addService(googletag.pubads());
                }
                break;
            case 'myfavorite':
                googletag.defineSlot('/7176/Gaana/Gaana_Favorites/Gaana_ROS_FAV_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1396272247361-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Favorites/Gaana_ROS_FAV_RHS_BTF_300', [300, 250], 'div-gpt-ad-1396272247361-1').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Favorites/Gaana_ROS_FAV_TBN_110', [110, 110], 'div-gpt-ad-1396272247361-3').addService(googletag.pubads());
                if (resolution == 'high') {
                    googletag.defineSlot('/7176/Gaana/Gaana_Favorites/Gaana_ROS_FAV_TOP_PD_728', [728, 90], 'div-gpt-ad-1396272247361-5').addService(googletag.pubads());
                } else {
                    googletag.defineSlot('/7176/Gaana/Gaana_Favorites/Gaana_ROS_FAV_TOP_PD_645', [645, 60], 'div-gpt-ad-1396272247361-4').addService(googletag.pubads());
                }
                break;
            case 'zoomplaylists':
                googletag.defineSlot('/7176/Gaana/Gaana_Zoom_MyPlaylists/Gaana_ROS_ZMP_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1396272619091-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Zoom_MyPlaylists/Gaana_ROS_ZMP_RHS_BTF_300', [300, 250], 'div-gpt-ad-1396272619091-1').addService(googletag.pubads());
                if (resolution == 'high') {
                    googletag.defineSlot('/7176/Gaana/Gaana_Zoom_MyPlaylists/Gaana_ROS_ZMP_TOP_PD_728', [728, 90], 'div-gpt-ad-1396272619091-5').addService(googletag.pubads());
                } else {
                    googletag.defineSlot('/7176/Gaana/Gaana_Zoom_MyPlaylists/Gaana_ROS_ZMP_TOP_PD_645', [645, 60], 'div-gpt-ad-1396272619091-4').addService(googletag.pubads());
                }
                break;
            case 'discover':
                googletag.defineSlot('/7176/Gaana/Gaana_Discover/Gaana_Discover_Home/Gaana_ROS_DSC_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1399533515732-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Discover/Gaana_Discover_Home/Gaana_ROS_DSC_RHS_BTF_300', [300, 250], 'div-gpt-ad-1399533515732-1').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Discover/Gaana_Discover_Home/Gaana_ROS_DSC_TBN_110', [110, 110], 'div-gpt-ad-1399533515732-3').addService(googletag.pubads());
                if (resolution == 'high') {
                    googletag.defineSlot('/7176/Gaana/Gaana_Discover/Gaana_Discover_Home/Gaana_ROS_DSC_TOP_PD_728', [728, 90], 'div-gpt-ad-1399533515732-5').addService(googletag.pubads());
                } else {
                    googletag.defineSlot('/7176/Gaana/Gaana_Discover/Gaana_Discover_Home/Gaana_ROS_DSC_TOP_PD_645', [645, 60], 'div-gpt-ad-1399533515732-4').addService(googletag.pubads());
                }
                break;
            case 'channel':
                googletag.defineSlot('/7176/Gaana/Gaana_Promotions/Gaana_Promotions_Channel1/Gaana_ROS_PRM_CHN1_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1400242945619-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Promotions/Gaana_Promotions_Channel1/Gaana_ROS_PRM_CHN1_RHS_BTF_300', [300, 250], 'div-gpt-ad-1400242945619-1').addService(googletag.pubads());
                if (resolution == 'high') {
                    googletag.defineSlot('/7176/Gaana/Gaana_Promotions/Gaana_Promotions_Channel1/Gaana_ROS_PRM_CHN1_TOP_PD_728', [728, 90], 'div-gpt-ad-1400242945619-3').addService(googletag.pubads());
                } else {
                    googletag.defineSlot('/7176/Gaana/Gaana_Promotions/Gaana_Promotions_Channel1/Gaana_ROS_PRM_CHN1_TOP_PD_645', [645, 60], 'div-gpt-ad-1400242945619-2').addService(googletag.pubads());
                }
                break;
            case 'rest':
                googletag.defineSlot('/7176/Gaana/Gaana_Rest/Gaana_ROS_RST_RHS_ATF_300', [
                    [300, 250],
                    [300, 600]
                ], 'div-gpt-ad-1396272588862-0').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Rest/Gaana_ROS_RST_RHS_BTF_300', [300, 250], 'div-gpt-ad-1396272588862-1').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Rest/Gaana_ROS_RST_TBN_110', [110, 110], 'div-gpt-ad-1396272588862-3').addService(googletag.pubads());
                if (resolution == 'high') {
                    googletag.defineSlot('/7176/Gaana/Gaana_Rest/Gaana_ROS_RST_TOP_PD_728', [728, 90], 'div-gpt-ad-1396272588862-5').addService(googletag.pubads());
                } else {
                    googletag.defineSlot('/7176/Gaana/Gaana_Rest/Gaana_ROS_RST_TOP_PD_645', [645, 60], 'div-gpt-ad-1396272588862-4').addService(googletag.pubads());
                }
                break;
            default:
                googletag.defineSlot('/7176/Gaana/Gaana_Home/Gaana_HP_RHS_ATF_300', [300, 250], 'div-gpt-ad-1381301229773-1').addService(googletag.pubads());
                googletag.defineSlot('/7176/Gaana/Gaana_Home/Gaana_HP_RHS_BTF_300', [300, 250], 'div-gpt-ad-1381301229773-2').addService(googletag.pubads());
                break;
        }
        googletag.pubads().setTargeting('sg', _auds).setTargeting('HDL', _tval(_HDL)).setTargeting('ARC1', _tval(_ARC1)).setTargeting('Hyp1', _tval(_Hyp1)).setTargeting('article', _tval(_article));
        googletag.pubads().enableSingleRequest();
        googletag.pubads().collapseEmptyDivs();
        googletag.enableServices();
        renderSlots(page);
    });
}

function renderSlots(page) {
    try {
        googletag.cmd.push(function () {
            if (page == 'home') {
                googletag.display(dfpAdsArr[page].ads_645x60_strip);
            }
            googletag.display(dfpAdsArr[page].ads_300x250_promotional);
            googletag.display(dfpAdsArr[page].ads_300x250);
            googletag.display(dfpAdsArr[page].ads_135x35);
            googletag.display(dfpAdsArr[page].ads_110x110);
            googletag.display(dfpAdsArr[page].ads_645x60_pd);
        });
    } catch (e) {
        console.log("DFP Error on renderSlots " + e.message);
    }
};
var dfpinitialized = false;
var notificationinterval = null;
var refreshSession = null;
var paidUser = null;
var _globalPlayCounter = 0;
var _globalPlayCounterWithPreroll = 0;
var isUsingMobile = true;
var flagAdsOverThePlayer = false;
var flagAirtelAdsOverThePlayer = false;
var flagPrerollPlayOneTime = true;
var flashLoaded = false;
var _AGENTTYPE = 0;
var jsuserdata = {};
var jsfavdata = {};
var REQUEST_URI = "";
var _now_playing_url_check = "";
var _now_playing_check = false;
var freshNotificationsCount = "";
var _now_playing_url = "";
var currentAdsInQueue = '';
var _twttr_flag = true;
var campaign = '';
var isVideoAdsFlashContainerLoaded = false;
var _isAutoPlaylist = false;
var apis = [];
var loginCallback = {};
var paid_user_check = true;
var player;
var youtubeloaded = false;
var videoId(function ($) {
    $.fn.menuaccordion = function (option) {
        var def = {
            clas: 'sub_menu',
            spd: 800,
            arrow: 'lt_arw_dn'
        };
        var obj = $.extend(def, option);
        $(this).click(function () {
            $('#left_panel>ul>li>a').removeAttr('style').find('span').removeClass('orange').removeAttr('style');
            $('#left_panel>ul>li').removeAttr('style');
            var bgpos = $(this).css('backgroundPosition').split(' ');
            var dppos = $(this).find('span').css('backgroundPosition').split(' ');
            if ($(this).closest('li').find('ul').css('display') == 'block') {
                $(this).closest('ul').find('ul.sub_menu').slideUp();
            } else {
                $(this).closest('ul').find('ul.sub_menu').slideUp();
                $(this).closest('li').find('ul.sub_menu').slideDown();
                var pos = bgpos[1].length - 2;
                var pos1 = dppos[1].length - 2;
                bgpos1 = parseInt(bgpos[1].substring(0, pos));
                dppos1 = parseInt(dppos[1].substring(0, pos1)) + 36;
                $(this).css('backgroundPosition', bgpos[0] + ' ' + (bgpos1) + 'px');
                $(this).find('span').css('backgroundPosition', dppos[0] + ' ' + (dppos1) + 'px');
                $(this).find('span').addClass('orange');
                $(this).closest('li').css('backgroundColor', '#242424');
            }
        });
    };
    if ($(window).width() < 1540) {
        $('#left_panel').mouseleave(function () {
            $('#left_panel > ul > li > ul').css('display', 'none');
        })
        $('#left_panel').mouseenter(function () {
            activateverticalScroller();
        })
    }
    $.fn.showActivity = function () {
        $(this).bind('click', function (e) {
            if (typeof jsuserdata.user_id == 'undefined' || jsuserdata.user_id == null || jsuserdata.user_id == "") {
                return;
            }
            e.stopPropagation();
            activateverticalScrollernotification();
            $('.notification-right .jspVerticalBar').on('click', function (e) {
                e.stopPropagation();
            })
            if ($('.notification-right').css('top') == '-400px') {
                try {
                    if (freshNotificationsCount > 0) {
                        updateLastNotificationId();
                    }
                } catch (e) {}
                freshNotificationsCount = '';
                $('#count_notification').html('');
                $('.notification-right').animate({
                    top: '62px'
                }, {
                    duration: 500,
                    queue: false
                });
            } else if ($('.notification-right').css('top') == '62px') {
                $('.notification-blk').removeClass('unread-notification');
                $('.notification-right').animate({
                    top: '-400px'
                }, {
                    duration: 500,
                    queue: false
                });
            }
        })
    }
    $.fn.tabChange = function () {
        $(this).click(function () {
            $('.tab-div').hide();
            $('.hideall').show();
            if ($(this).attr('rel') != 'overview') {
                $('.hideall').hide();
            }
            $(this).closest('ul').find('a').removeClass('active_tab');
            $(this).addClass('active_tab');
            $('#' + $(this).attr('rel')).show();
            eqFrame();
        })
    }
    $.fn.tabChange1 = function () {
        $(this).click(function () {
            $('.fav-div').hide();
            $(this).closest('ul').find('a').removeClass('active-fav');
            $(this).addClass('active-fav');
            $('#' + $(this).attr('rel')).show();
            eqFrame();
        })
    }
    $.fn.showScroll = function () {
        return;
        $(this).hover(function () {
            $(this).find('.jspHorizontalBar').css("display", "block");
        }, function () {
            $(".jspHorizontalBar").css("display", "none");
        })
    }
    $.fn.check = function () {
        $(this).bind('click', function () {
            if ($(this).closest('div').find('.custom_chk').hasClass('pos')) {
                $(this).closest('div').find('.custom_chk').removeClass('pos');
            } else {
                $(this).closest('div').find('.custom_chk').addClass('pos');
            }
        })
    }
    $.fn.radioCheck = function () {
        $(this).bind('click', function () {
            $(this).parent().parent().find('.radioclass').addClass('radio-inactive');
            if ($(this).hasClass('radio-inactive')) {
                $(this).removeClass('radio-inactive');
            } else {
                $(this).addClass('radio-inactive');
            }
            $(this).siblings('.original-radio').attr('checked')
        })
    }
    $.fn.CustomSelect = function () {
        $(this).on('change', function () {
            $(this).closest('div').find('abbr').text($(this).val());
        })
    }
    $.fn.settingLanguage = function () {
        $(this).bind('click', function () {
            if ($(this).attr('id') == 'sl_0') {
                $(this).closest('div').find('a').removeClass('actgrn');
                $(this).addClass('actgrn');
            } else {
                var check_active = $(this).attr('class');
                $('#sl_0').removeClass('actgrn');
                if (check_active.indexOf('actgrn') != -1) {
                    $(this).removeClass('actgrn');
                } else {
                    $(this).addClass('actgrn');
                }
            }
            var language = new Array();
            $('.actgrn').each(function (index) {
                language.push($(this).text());
            });
            var data = {
                "language": language.toString(),
                "task": 'updateLanguages'
            };
            registration.submitRequest(data);
        });
    };
    $.fn.mySettings = function () {
        $(this).click(function () {
            $('.signedin').css({
                background: 'url(../../images/popup_bg.jpg)'
            });
            $('.signedin div').css({
                color: '#3e3e3e'
            });
            $('#signedin-menu').fadeIn(400);
        });
    };
    $.fn.mySettingsOut = function () {
        $(this).mouseleave(function () {
            $('.signedin').css({
                background: 'transparent'
            });
            $('.signedin div').css({
                color: '#ffffff'
            });
            $('#signedin-menu').fadeOut(400);
        });
    };
    $.fn.leftSlide = function (option) {
        var def = {
            spd: 500,
            wdth: '200px',
            disp: 1,
            id: 1
        }
        var obj = $.extend(def, option);
        $(this).click(function () {
            var li_count = $(this).closest('li').find('ul.genrehome-gallery').length;
            if (counter[obj.id] > 1) {
                $(this).closest('li').find('ul').animate({
                    right: '-=' + obj.wdth
                }, 500);
                counter[obj.id]--;
            }
        });
    };
    $.fn.rightSlide = function (option) {
        var def = {
            spd: 500,
            wdth: '200px',
            disp: 1,
            id: 1
        }
        var obj = $.extend(def, option);
        $(this).click(function () {
            var li_count = $(this).closest('li').find('ul.genrehome-gallery li').length;
            if (counter[obj.id] <= li_count - obj.disp) {
                $(this).closest('li').find('ul').animate({
                    right: '+=' + obj.wdth
                }, obj.spd);
                counter[obj.id]++;
            }
        });
    };
    $.fn.blankInput = function () {
        return this.each(function () {
            $(this).bind('click keypress', function () {
                var id = $(this).attr('id');
                var x = document.getElementById(id).defaultValue;
                if ($(this).val() == x || $(this).val() == '') {
                    $(this).val('');
                }
            });
            $(this).bind("blur", function () {
                var id = $(this).attr('id');
                var x = document.getElementById(id).defaultValue;
                if ($(this).val() == x || $(this).val() == '') {
                    $(this).val(x);
                }
            });
        });
    };
    $.fn.offlinelisten = function () {
        $(this).click(function () {
            if ($(this).attr('style')) {
                $(this).removeAttr('style');
            } else {
                $(this).css('background-position', '-583px -120px');
            }
        });
    };
    $.fn.dropdown = function () {
        $(this).click(function () {
            if ($(this).find('ul').css('display') == 'none') {
                $(this).find('ul').show();
            } else {
                $(this).find('ul').hide();
            }
        });
    };
    $.fn.dropdownSortBy = function () {
        $(this).on('click', function () {
            if ($(this).find('.data-bind').css('display') == 'none') {
                $(this).find('.data-bind').show();
            } else {
                $(this).find('.data-bind').hide();
            }
        });
        $(this).mouseleave(function () {
            $(this).find('.data-bind').hide();
        });
    };
    $.fn.removeQueue = function () {
        $(this).click(function () {
            $(this).closest('div').remove();
        });
    };
    $.fn.changeSetting = function () {
        $('body').on('click', '.dc2 a', function () {
            var attr = $(this).closest('span').find('a');
            $(this).closest('span').find('a').removeClass('btn_active');
            $(this).addClass('btn_active');
        });
    };
    $.fn.scrollPosition = function () {
        $(this).click(function () {
            var cls = $(this).attr('title');
            $('html,body').animate({
                scrollTop: $('.' + cls).offset().top - $('.grammy_header').height()
            });
        });
    };
    $.fn.checkPlaylist = function (option) {
        var def = {
            classgroup: 'checkbox_group'
        }
        var obj = $.extend(def, option);
        $(this).on('click', function () {
            if ($(this).prop("checked") == true) {
                $('.' + obj.classgroup).each(function () {
                    $(this).prop('checked', true);
                    $('#remove_playlist').css('display', 'none');
                    $('#delete_playlist').css('display', 'block');
                })
            } else {
                $('.' + obj.classgroup).each(function () {
                    $(this).prop('checked', false);
                    $('#remove_playlist').css('display', 'block');
                    $('#delete_playlist').css('display', 'none');
                });
            }
        });
    };
    $.fn.removeSelection = function (option) {
        var def = {
            classgroup: 'selector_group'
        };
        var obj = $.extend(def, option);
        $(this).on('click', function () {
            var checked_count = $("input:checked").length;
            if (checked_count > 0) {
                $('#remove_playlist').css('display', 'none');
                $('#delete_playlist').css('display', 'block');
            } else {
                $('#remove_playlist').css('display', 'block');
                $('#delete_playlist').css('display', 'none');
            }
            $(this).each(function () {
                if ($(this).prop('checked') == false) {
                    $('.' + obj.classgroup).prop('checked', false);
                }
            });
        });
    };
    $.fn.AddEvent = function () {
        $(this).unbind('click')
        $(this).bind('click', function (e) {
            $('.add-event').hide();
            if ($(this).parent().find('.add-event').css('display') == 'none') {
                $('._share').css('display', 'none');
                $('._arrow').css('display', 'none');
                $('#wttodo').css('display', 'none');
                $(this).parent().find('.add-event').show();
            } else {
                $(this).parent().find('.add-event').hide();
            }
        });
    };
    $.fn.removePlaylist = function () {
        $(this).click(function () {
            var trackid = $(this).closest('ul').attr('id');
            trackid = trackid.replace("trackrow", "");
            _deletedtrackIds.push($.trim(trackid));
            $(this).closest('ul').remove();
        });
    };
    $.fn.RegistrationSexchange = function () {
        $('body').on('click', '.radio_outer a', function () {
            if ($('.radio_outer a span.txtch').html() == 'Male') {
                $('.radio_outer a').css({
                    'padding': '4px 0 3px 7px'
                })
                $('.radio_outer a span:first-of-type').css({
                    'padding': '4px 0 3px 0',
                    'line-height': '18px',
                    'float': 'right'
                });
                $('.radio_outer a span.txtch').html('Female');
            } else {
                $('.radio_outer a').removeAttr('style');
                $('.radio_outer a span:first-of-type').removeAttr('style');
                $('.radio_outer a span.txtch').html('Male');
            }
        });
    };
    $.fn.acceptTerms = function () {
        $('body').on('click', '#i-agree', function () {
            if ($(this).prop('checked')) {
                $(this).parent().css({
                    'background-position': '-10px -63px'
                });
            } else {
                $(this).parent().css({
                    'background-position': '-9px -88px'
                });
            }
        })
    }
    $.fn.backtoLogin = function () {
        $('body').on('click', '.btm_llink', function () {
            $(this).click(function () {
                $('#register-form').slideUp({
                    duration: 500,
                    easing: 'easeInOutSine'
                });
                $('#password-form,#regSocialBtn').slideDown({
                    duration: 500,
                    easing: 'easeInOutSine'
                });
            })
        })
    }
    $.fn.deleteSelected = function (option) {
        var def = {
            classgroup: 'checkbox_group',
            selectorgroup: 'selector_group'
        }
        var obj = $.extend(def, option);
        $(this).click(function () {
            $('#remove_playlist').css('display', 'block');
            $('#delete_playlist').css('display', 'none');
            $('.' + obj.classgroup).each(function () {
                if ($(this).prop('checked') == true) {
                    var trackid = $(this).closest('ul').attr('id');
                    trackid = trackid.replace("trackrow", "");
                    _deletedtrackIds.push($.trim(trackid));
                    $(this).closest('ul').remove();
                }
            })
            var numItems = $('.' + obj.classgroup).length;
            if (numItems < 1) {
                $("input.selector_group").attr("disabled", true);
            }
            $('.' + obj.selectorgroup).prop('checked', false);
        })
    }
    $.fn.registraionLanguage = function () {
        $('body').on('click', '.select_lang a', function () {
            if ($(this).attr('class') == 'active-lang') $(this).removeClass('active-lang');
            else $(this).addClass('active-lang');
        })
    }
    $.fn.carouselRight = function (option) {
        var def = {
            boxid: 'scroll_inner1',
            id: 'Invitefriend_rt',
            containerid: 'inviteFriend'
        }
        var obj = $.extend(def, option);
        $('body').on('click', '.' + obj.containerid + ' #' + obj.id, function () {
            $('.' + obj.containerid + ' #' + obj.boxid + ' ul').find('li:last-of-type').after($('.' + obj.containerid + ' #' + obj.boxid + ' ul').find('li:first-of-type'));
        })
    }
    $.fn.carouselLeft = function (option) {
        var def = {
            boxid: 'scroll_inner1',
            id: 'Invitefriend_lt',
            containerid: 'inviteFriend'
        }
        var obj = $.extend(def, option);
        $('body').on('click', '.' + obj.containerid + ' #' + obj.id, function () {
            $('.' + obj.containerid + ' #' + obj.boxid + ' ul').find('li:first-of-type').before($('.' + obj.containerid + ' #' + obj.boxid + ' ul').find('li:last-of-type'));
        })
    }
    $.fn.closeGaanaplus = function () {
        $('body').on('click', '.gaanaplus_poppup #popup .gaanalite_close', function () {
            $('#popup').remove();
        })
    }
    $.fn.bitrate = function () {
        $('body').on('click', '.song_quality', function (e) {
            e.stopPropagation();
            $('#sharemainpop').hide();
            $('.addedsonglist').hide();
            $('.songadded').removeClass('whitebg');
            $('.addedlist').addClass('white');
            $('._arrow').hide();
            if (typeof readCookie('songquality') != 'undefined' && readCookie('songquality') != '' && readCookie('songquality') != null) {
                $('.qualityvalue').each(function () {
                    $(this).removeClass('bit_rate_active')
                    if (this.getAttribute("data-value") == readCookie('songquality')) {
                        $(this).addClass('bit_rate_active')
                    }
                })
            }
            if ($(this).find('.bit_rate').css('display') == 'none') {
                $(this).find('.bit_rate').show();
            } else {
                $(this).find('.bit_rate').hide();
            }
        });
    }
    $.fn.showcarousel = function () {
        $(this).hover(function () {
            $(this).find('.carl_prev_v1_body').show()
        }, function () {
            $(this).find('.carl_prev_v1_body').hide()
        })
    }
})(jQuery)

    function loadJSData() {
        try {
            if ($('#gaana_datamap_ajax').length > 0) {
                var jsonobj = $.parseJSON($('#gaana_datamap_ajax').html());
                jsuserdata = jsonobj.user;
                jsfavdata = jsonobj.favs;
                REQUEST_URI = jsonobj.REQUEST_URI;
                renderFavInfo();
                renderUserInfo();
            } else if ($('#gaana_datamap').length > 0) {
                var jsonobj = $.parseJSON($('#gaana_datamap').html());
                jsuserdata = jsonobj.user;
                jsfavdata = jsonobj.favs;
                REQUEST_URI = jsonobj.REQUEST_URI;
                renderFavInfo();
                renderUserInfo();
            } else if ($('#gaana_datamap_main').length > 0) {
                var jsonobj = $.parseJSON($('#gaana_datamap_main').html());
                jsuserdata = jsonobj.user;
            }
            if (typeof notificationinterval != 'undefined' && notificationinterval != null) {
                clearInterval(notificationinterval);
            }
            if (typeof jsuserdata.user_id != 'undefined' && jsuserdata.user_id != null && jsuserdata.user_id > 0) {
                myTimesInAppNotifications()
                notificationinterval = setInterval(function () {
                    myTimesInAppNotifications();
                }, 15 * 60000);
            }
            if (!_isAutoPlaylist && typeof jsuserdata.user_id != 'undefined' && jsuserdata.user_id != null) {
                _isAutoPlaylist = true;
                _userLoginStatus = true;
                setTimeout(function () {
                    playlist.mostPopularPlaylist();
                }, 2000);
            }
        } catch (e) {
            alert(e.message);
        }
    }

    function renderFavInfo() {
        $('.hover-suggestion .f-a-s .favorite-white,.favunfav,.fav_blk span').each(function () {
            try {
                var strid = this.getAttribute("data-value");
                strid = strid.replace('album', 'album-');
                strid = strid.replace('playlist', 'playlist-');
                strid = strid.replace('artist', 'artist-');
                strid = strid.replace('channel', 'channel-');
                strid = strid.replace('song', 'track-');
                var id = "";
                var type = "";
                id = strid.split("-")[1];
                type = strid.split("-")[0];
                if (typeof jsfavdata[type] != 'undefined' && jsfavdata[type] != null && jsfavdata[type].length > 0) {
                    if (type == 'radio') {
                        strid = "rl" + "_" + id;
                        var check = $.inArray(strid, jsfavdata[type]);
                    } else {
                        var check = $.inArray(id, jsfavdata[type]);
                    }
                    if (check > 0) {
                        if ($(this).is('a') && $(this).hasClass('favorite-white')) {
                            $(this).addClass('displaynone');
                        } else if ($(this).parent().is('a') && $(this).hasClass('f_ico')) {
                            $(this).parent().addClass('displaynone');
                            $('#fd').removeClass('button-lightgrey').addClass('button-red');
                        } else {
                            $(this).removeClass('favorite');
                            $(this).addClass('unfavorite');
                        }
                    }
                }
            } catch (e) {
                alert(e.message);
            }
        });
    }

    function renderUserInfo() {
        var url = window.location.href;
        if (jsuserdata.username != "" && REQUEST_URI.indexOf('home') != -1) {
            try {
                $('#myTimesFriendsListeningContainer').html('');
                $('#myTimesMyRecentActivitiesContainer').html('');
                $('.login-remind').hide();
                myTimesGetMyRecentActivities();
            } catch (e) {
                alert(e.message);
            }
        }
        var newNotifictionCountString = '';
        if (typeof freshNotificationsCount != 'undefined' && freshNotificationsCount > 0) {
            newNotifictionCountString = '<strong>' + freshNotificationsCount + '</strong>';
        } else {
            newNotifictionCountString = '';
        }
        loginWrapper(jsuserdata);
        if (typeof jsuserdata.user_id != 'undefined' && jsuserdata.user_id != null) {
            setTimeout(function () {
                playlist.refereshMyPlaylist();
            }, 1000);
        }
        if (url.indexOf('singalong') != -1) {
            if (typeof _variables.remote != 'undefined' && _variables.remote != null) {
                _variables.remote.onUserInfoUpdate(jsuserdata);
            }
        }
        utility.blockui.remove();
    }
var start;
$(document).ready(function () {
    start = new Date().getTime();
    dynamicsetWidth();
    if ($('#youtube_video').length > 0) {
        setTimeout(function () {
            $('#divlyrics_loader').remove();
            $('.lyrics_main').css({
                display: 'block'
            });
        }, 1000)
    }
    $('body').on('click', '.gaana_plus_subscribe', function () {
        gaanapluspopup.openpopup();
    });
    $('body').on('click', "#payment_proceed_gaanaplus", function () {
        var prod_id = $(".pay_checkbox input:radio:checked").val();
        var prod_amount = $(".pay_checkbox input:radio:checked").attr('data-value');
        var prod_name = $(".pay_checkbox input:radio:checked").attr('name');
        var prod_type = $(".pay_checkbox input:radio:checked").attr('data-type');
        var prod_details = {
            pid: prod_id,
            pamount: prod_amount,
            pname: prod_name,
            ptype: prod_type
        };
        $('#popup').remove();
        var check_paid = true;
        var cbJS = "gaanapluspopup.process(prod_details,check_paid);";
        checkSessionAndExecute({
            CBJS: cbJS,
            cbOBJ: {
                prod_details: prod_details,
                check_paid: check_paid
            },
            CBRP: "gaanapluspopup.extendpopup()"
        });
    });
    $('body').on('click', '.gaana_no_ads_subscribe', function () {
        try {
            if (_userLoginStatus) {
                $('.gaana_no_ads_subscribe').css('visibility', 'hidden');
            }
            var prod_id = $("#no_ads_prodId").val();
            var prod_amount = $("#no_ads_prodAmount").val();
            var prod_name = $("#no_ads_prodName").val();
            var prod_type = $("#no_ads_prodType").val();
            var prod_details = {
                pid: prod_id,
                pamount: prod_amount,
                pname: prod_name,
                ptype: prod_type
            };
            var check_paid = true;
            var cbJS = "gaanapluspopup.process(prod_details,check_paid);";
            checkSessionAndExecute({
                CBJS: cbJS,
                cbOBJ: {
                    prod_details: prod_details,
                    check_paid: check_paid
                },
                CBRP: "gaanapluspopup.extendpopup()"
            });
        } catch (error) {
            alert(error.message);
        }
    });
    $('body').on('click', '#make_payment', function () {
        var bank_name = $('#bankName');
        if (!checkRequired(bank_name, "Please select your bank!")) {
            $(".validateTips").show();
        } else {
            $(".validateTips").hide();
            $("#gaana-plus-payment-form").submit();
        }
    });
    if (typeof readCookie("Logs._playingSong") != 'undefined' || readCookie("Logs._playingSong") != null) {
        try {
            Logs._playingSong = $.parseJSON(readCookie("Logs._playingSong"));
            Logs._playedtime = readCookie("Logs._playedtime");
            Logs._last_track_id = readCookie("Logs._last_track_id");
            Logs.addTrackLog();
            Logs._playingSong = null;
            Logs._last_track_id = null;
            Logs._playedtime = '00:00';
            document.cookie = "Logs._playingSong" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = "Logs._playedtime" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        } catch (e) {}
    }
    loadJSData();
    $('.sngandalbum a').click(function (e) {
        e.preventDefault();
    });
    $('.playlistlist a').click(function (e) {
        e.preventDefault();
    });
    setTimeout('registration.showFacebookFriends()', 15 * 60 * 1000);
    setTimeout('removeLeftNavClass()', 2000);
    $('#pagination').css({
        display: 'none'
    });
    $('#templates').load(BASE_URL + "media/statictpls/grouptemplates.tpl", function () {
        var requesturl = $(location).attr('href');
        var pathname = window.location.pathname;
        handleClickLinkRequest(requesturl, pathname);
        if (typeof readCookie('verified') != 'undefined' && $.trim(readCookie('verified')) == 'yes' && ($.trim(readCookie('onBoarding')) != 'undefined' && $.trim(readCookie('onBoarding')) != 'valid')) {
            if (typeof jsuserdata.username != 'undefined' && jsuserdata.username != null) {
                registration.languageSection();
                createCookie("verified", '', -365);
                createCookie("onboardingemail", '', -365);
            }
        }
        $('#iHaveIt').click(function () {
            parent.createCookie('isUsingMobile', 'true', 360);
            $('#popup').remove();
        });
        $('#smsMarketingForm').submit(function (e) {
            e.preventDefault();
            submitform(e);
        });
        if (login.checklogin() !== 0) {
            if (typeof readCookie('user_verified') == 'undefined' || readCookie('user_verified') == null) {
                if (jsuserdata.junkEmail == 0 || jsuserdata.junkEmail == null) {
                    if (jsuserdata.verified == 'N') {
                        verify.openPopUp();
                    }
                } else {
                    verify.openPopUp();
                }
            }
            refreshSession = setInterval(function () {
                refreshUserSession();
            }, 120000);
        }
    })
    $('#footer').load(BASE_URL + "media/statictpls/footer.tpl", function () {});
    $('#sharemainpop').load(BASE_URL + "media/statictpls/share.tpl", function () {
        share.bindEvent();
    });
    jQuery.browser = {};
    (function () {
        jQuery.browser.msie = false;
        jQuery.browser.version = 0;
        if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
            jQuery.browser.msie = true;
            jQuery.browser.version = RegExp.$1;
        }
    })();
    if (window.location.hash) {
        var mapedUrl = "";
        var sharedUrl = window.location.hash.replace("//", "/");
        var pageInfo = sharedUrl.split("/");
        var nUrl = window.location.hash.replace("!", "");
        nUrl = nUrl.replace("#/", "");
        switch (pageInfo[1]) {
            case 'newreleases':
                nUrl = TMStaticUrl + nUrl.replace(pageInfo[1], "newrelease").toLowerCase();
                break;
            case 'streamalbums':
                nUrl = TMStaticUrl + nUrl.replace(pageInfo[1], "streamalbum").toLowerCase();
                break;
            case 'albums':
                nUrl = TMStaticUrl + nUrl.replace(pageInfo[1], "album").toLowerCase();
                break;
            case 'songs':
                nUrl = TMStaticUrl + nUrl.replace(pageInfo[1], "song").toLowerCase();
                break;
            case 'streamplaylists':
                nUrl = TMStaticUrl + nUrl.replace(pageInfo[1], "streamplaylist").toLowerCase();
                break;
            case 'playlists':
                nUrl = TMStaticUrl + nUrl.replace(pageInfo[1], "playlist").toLowerCase();
                if (pageInfo[2] == "featuredplaylists") {
                    nUrl = nUrl.replace("featuredplaylists", "featuredplaylist");
                }
                break;
            case 'artists':
                nUrl = TMStaticUrl + nUrl.replace(pageInfo[1], "artist").toLowerCase();
                if (pageInfo[4] == "albums" || pageInfo[4] == "tracks") {
                    nUrl = nUrl.replace(pageInfo[2] + "/", "");
                    nUrl = nUrl.replace("tracks", "songs");
                }
                break;
            case 'mostpopular':
                nUrl = TMStaticUrl + nUrl.replace("albums", "album").toLowerCase();
                if (pageInfo[2] == "all") {
                    if (pageInfo[3] == "playlists") {
                        nUrl = nUrl.replace("all/", "");
                        nUrl = nUrl.replace("playlists", "playlist");
                    } else {
                        nUrl = nUrl.replace("all", "hindi");
                    }
                }
                if (pageInfo[3] == "artists") {
                    nUrl = nUrl.replace("artists", "artist");
                }
                if (pageInfo[2] == "playlists") {
                    nUrl = nUrl.replace("playlists", "playlist");
                    if (pageInfo[3] != "") {
                        nUrl = nUrl.replace(pageInfo[3], "sortby/" + pageInfo[3]);
                    }
                } else if (pageInfo[4] != "") {
                    nUrl = nUrl.replace(pageInfo[4], "sortby/" + pageInfo[4]);
                }
                break;
            case 'radiostations':
            case 'radiomirchi':
                nUrl = TMStaticUrl + nUrl.replace(pageInfo[1], "radio").toLowerCase();
                break;
            case 'genres':
                nUrl = TMStaticUrl + nUrl.replace(pageInfo[1], "genre").toLowerCase();
                break;
            case 'mobile':
                nUrl = TMStaticUrl + nUrl.replace(pageInfo[1], "gaanamobile").toLowerCase();
                break;
        }
        window.location.href = nUrl;
    }
    if (window.location.href.indexOf('genre') != -1) {
        var _hash = location.href.split('/');
        if (_hash[3] == 'genre') {
            $('#mainarea').removeClass('relative');
        }
    } else {
        $('#mainarea').addClass('relative');
    }
    if (window.location.href.indexOf('channel') != -1) {
        changeBodyTheme('defChannel');
    } else {
        changeBodyTheme('');
    }
    if (typeof _deletedtrackIds !== 'undefined' && _deletedtrackIds.length > 0) {
        _deletedtrackIds = [];
    }
    wireUpEvents();
    window.superCookie = new SuperCookie();
    $("#radio").bind("click", function () {
        gaanaMaster.surprisePlay();
    });
    $(".languageSelector").bind("click", function () {
        alert("called");
    })
    ajaxPageRequestHandler.connect({
        'container': 'main_middle_content',
        'beforeSend': function () {
            $('div#lastPostsLoader').empty();
            utility.blockui.init();
            return false
        },
        'complete': function (res) {
            ajaxResponseHandler.ProcessAjaxResponse(res.args);
            utility.blockui.remove();
        },
        'success': function () {
            loaddefaultimage();
            onSucessCallback();
        },
        'useClass': 'history'
    });
    $('body .visibility').check();
    $('#popup #languageSelection .select_lang a').registraionLanguage();
    $('body').on('click', '.pjax', function (e) {
        _variables.manualClick = true;
        e.preventDefault();
        var target = $(this);
        var type = target.attr("data-type");
        if (typeof type != 'undefined' && type == 'url_user_playlist') {
            return;
        }
        if (location.href.indexOf('search/artists') != -1) {
            var keywordsearch = $.trim($('#searched-keyword').text());
            var position_from_top = $('.list >a').index(target) + 1;
            if (typeof position_from_top == 'undefined' || position_from_top == 0 || position_from_top == null) {
                position_from_top = $('.list .title >a').index(target) + 1;
            }
            var title = target.attr("href");
            gAnalyticChannelClick("SRP", 'Artist - ' + title, keywordsearch + '|' + position_from_top);
        }
        if (typeof target.attr("href") && target.attr("href")) {
            var url = target.attr("href");
        } else if (typeof target.attr("value") && target.attr("value")) {
            var url = target.attr("value");
            url = getSortUrl(url);
        } else if (typeof target.attr("data-value") && target.attr("data-value")) {
            var url = target.attr("data-value");
        }
        ajaxPageRequestHandler.invoke({
            url: url,
            'container': 'main_middle_content'
        });
    });
    $('body').on('click', '.silent-btn a', function () {
        var id = $(this).attr('id');
        if (id == 'silent_inactive') {
            $("#silent_inactive").addClass('btn_inactive');
            $("#silent_active").removeClass('btn_active');
        } else {
            $("#silent_active").addClass('btn_active');
            $("#silent_inactive").removeClass('btn_inactive');
        }
    });
    $('body').on('click', '#user_popular_song', function () {
        gAnalyticChannelClick('Most PLayed Songs', 'Click', 'Left Menu');
    });
    $('body').on('click', '#j2me-app', function () {
        var url = $(this).attr('href');
        gAnalyticChannelClick('j2me', 'Download', url);
    });
    $('body').on('click', '#blackberry-app', function () {
        var url = $(this).attr('href');
        gAnalyticChannelClick('blackberry', 'Download', url);
    });
    $('body').on('click', '#blackberry10-app', function () {
        var url = $(this).attr('href');
        gAnalyticChannelClick('blackberry10', 'Download', url);
    });
    $('body').on('click', '#windows-app', function () {
        var url = $(this).attr('href');
        gAnalyticChannelClick('windows', 'Download', url);
    });
    $('body').on('click', '#android-app', function () {
        var url = $(this).attr('href');
        gAnalyticChannelClick('android', 'Download', url);
    });
    $('body').on('click', '#iphone-app', function () {
        var url = $(this).attr('href');
        gAnalyticChannelClick('iphone', 'Download', url);
    });
    $('body').on('click', '.playlist_listing_page', function () {
        gAnalyticChannelClick('Most PLayed Songs', 'Click', 'Listing Page');
    });
    $('body').on('click', '.see_all', function () {
        var url = $(this).attr('href');
        gAnalyticChannelClick('See All', 'Click', 'Home Page | URL-' + url);
    });
    $('.originalselect').on('click', '.pjax', function (e) {
        _variables.manualClick = true;
        e.preventDefault();
        var target = $(this);
        if (typeof target.attr("href") && target.attr("href")) {
            var url = target.attr("href");
        } else if (typeof target.attr("value") && target.attr("value")) {
            var url = target.attr("value");
        }
        ajaxPageRequestHandler.invoke({
            url: url,
            'container': 'main_middle_content'
        });
    });
    $('body').delegate('.getnowit', 'click', function () {
        $('html, body').animate({
            scrollTop: $("#usrmail").offset().top
        }, 900);
    });
    $('body').delegate('.ghelpques', 'click', function () {
        gaanahelp.showQues($(this).attr('id'));
    });
    $('body').delegate('.ghelprecques', 'click', function () {
        gaanahelp.showQues($(this).attr('data-type'), $(this).attr('data-value'));
    });
    $('body').delegate('#appsubmitbtn', 'click', function () {
        gaanamobile.getappurl();
    });
    $('.lastfive div.span4:nth-child(3n+4)').css('margin', '10px 0 0 0');
    $('#slider').find('a:gt(0)').css('display', 'none');
    $('.selector_group').checkPlaylist();
    $('.checkbox_group').removeSelection();
    $('.removesong').removePlaylist();
    $('#delete_playlist').deleteSelected();
    $('.tab_nav a').scrollPosition();
    $('.download').scrollPosition();
    $('.song_quality').bitrate();
    dynamicsetWidth();
    activateCarousel()
    $('body').on('click', '.bit_rate', function (e) {
        e.stopPropagation();
    })
    $('body').click(function () {
        $('._share').css('display', 'none');
        $('._arrow').css('display', 'none');
        $('#wttodo').css('display', 'none');
        $('.bit_rate').css('display', 'none');
        $('.notification-blk').removeClass('unread-notification');
        $('.notification-right').animate({
            top: '-400px'
        }, {
            duration: 500,
            queue: false
        });
    });
    $('._nsearch input').focusin(function () {
        if ($(this).attr('placeholder') == 'Click here to Search for Songs, Artists, Albums, Playlists and Radios') $(this).attr('placeholder', '');
    })
    $('._nsearch input').focusout(function () {
        if ($(this).val() == '') $(this).attr('placeholder', 'Click here to Search for Songs, Artists, Albums, Playlists and Radios');
    })
    $('#save_playlist').click(function () {
        playlist.editPlaylist();
    });
    $('#slider1').find('a:gt(0)').css('display', 'none');
    $('#main_middle_content').css('min-height', $(window).height() - 180);
    $('.radio_bg').css('height', $(window).height() - ($('.scroll_grd_panel').outerHeight() + 80));
    $('.main_blk').css({
        top: ($('#radio_bg').height() - 443) / 2
    });
    $('.video_blk').css({
        top: ($('#radio_bg').height() - 550) / 2
    });
    $('.radio_outer a').RegistrationSexchange();
    $('#i-agree').acceptTerms();
    $('.btm_llink').backtoLogin();
    $('.gaanalite_close').closeGaanaplus();
    bindGaanaplusSubscriptionEvent();
    GenreLayout();
    $('.lyrics_main iframe').css({
        'height': ($(window).outerHeight() - ($('._nheader').outerHeight() + $('#mainPlayer').outerHeight() - 5)),
        width: $('#main_middle_content').outerWidth()
    });
    paiduser();
    setHomeActive();
    $('#sharevalentinepop').on('click', 'a', function () {
        $('._arrow').hide();
    });
    $('.genrehome-gallery').each(function () {
        var wid = Math.ceil($(this).children('li').length * $(this).closest('li').width() * 10);
        $(this).css('width', wid);
    });
    $('.logo a').click(function () {
        $('#left_panel ul li a').find('span').removeClass('orange');
        $('#left_panel>ul>li>a').removeAttr('style');
        $('#left_panel ul li:first').find('span').addClass('orange');
        $('#left_panel>ul>li>a#home').css('background-position', '-12px 1px');
    });
    activateScroller();
    $("body").click(function () {
        $(".add-event").fadeOut();
    });
    $('.add-playlist').AddEvent();
    $(".song-widget").on('click', 'a.add', function (e) {
        e.stopPropagation();
    });
    $(".small-screen").on('click', '.circle', function (e) {
        e.stopPropagation();
    });
    $(".add-event").click(function (e) {});
    $(window).bind('scroll', function () {
        if ($(window).scrollTop() > 45) {} else {}
        if ($(this).scrollTop() == 0) {}
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 50) {
            utility.onTotalScrollCallback();
        }
        if ($('#mainPlayer').css('bottom') == '0px') {
            $('#mainarea').addClass('pd-bt80');
        }
    });
    $(window).bind('scroll', function () {
        if ($(window).scrollTop() > 130) {
            $('.gen-link').css({
                top: $(this).scrollTop() - 168
            });
        } else if ($(window).scrollTop() < 130) {
            $('.gen-link').removeAttr('style');
        }
    })
    $('body').on('click', function (e) {
        try {
            clickhandler(e.target, e);
        } catch (e) {}
    });
    $('.feedback').on('click', function (e) {
        e.preventDefault();
        $(".validateTips").empty();
        $('#feedback').trigger('click');
    });
    $('body').delegate('.notification', 'click', function (e) {
        e.preventDefault();
        $('#notification').trigger('click');
    });
    $('body').delegate('#report_issue', 'click', function (e) {
        e.preventDefault();
        $(".validateTips").empty();
        reportissue.openPopup();
    });
    $('body').delegate('#birth-month', 'click mouseleave', function (e) {
        if (e.type == 'click') {
            $(this).children('div.select_data').show();
        } else if (e.type == 'mouseleave') {
            $(this).children('div.select_data').hide();
        }
    });
    utility.bindEvents();
    $('#left_panel>ul>li>a').menuaccordion();
    $('._nlogreg').mySettings();
    $('._nlogreg').mySettingsOut();
    $('.sync').offlinelisten();
    $('.feedback-ul li input').blankInput();
    hoverSuggestion();
    containerheight();
    rightpanelControl();
    registration.editprofile();
    $('.add-playlist').AddEvent();
    $('.circle').AddEvent();
    $('body').on('click', '.addPlaylist', function () {
        playlist.addtoplaylist();
    });
    registration.socialconnect();
    $('.radioclass').radioCheck();
    registration.editsetting();
    discoversetting();
    $('.setting_language').settingLanguage();
    if (jsuserdata.username != "" && jsuserdata.username != null) {
        showMytimesData();
        $('#activity a').showActivity();
    }
    $('#splash').fadeOut(500, function () {
        $(this).remove();
        if (typeof jsuserdata != 'undefined' && jsuserdata.id != "" && jsuserdata.id != null) {}
    });
    activateverticalScroller();
    activateverticalScroller_ge();
    gAnalyticPageview();
    highLightNavLink();
    comscore();
    showNowPlayingPopUp();
    showLikersFollowersSummary();
    $('.sortbydropdown').dropdownSortBy();
    $(document).bind(($.browser.opera ? "keypress" : "keydown"), function (event) {
        $target = (event.target);
        if (event.keyCode) {
            $code = event.keyCode;
        } else {
            $code = event.which;
        }
        if (typeof $code == 'undefined' && typeof $target == 'undefined') {
            return;
        }
        var targetTag = $target.tagName.toLowerCase();
        if (targetTag != 'input' && targetTag != 'embed' && targetTag != 'textarea' && gaanaMaster) {
            switch ($code.toString()) {
                case '32':
                    $('.hotbox').animate({
                        bottom: '0px'
                    }, {
                        duration: 500
                    });
                    gaanaMaster.playToggle();
                    event.preventDefault();
                    break;
                case '39':
                    if (!gaanaMaster.registrationLimitPopUp('Keyboard Next')) {
                        return false;
                    }
                    $('.hotbox').animate({
                        bottom: '0px'
                    }, {
                        duration: 500
                    });
                    gaanaMaster.playNext();
                    break;
                case '37':
                    if (!gaanaMaster.registrationLimitPopUp('Keyboard Prev')) {
                        return false;
                    }
                    if (gaanaMaster.getPlayerMode() == 'radio' || gaanaMaster.getPlayerMode() == 'genreRadio') return
                    $('.hotbox').animate({
                        bottom: '0px'
                    }, {
                        duration: 500
                    });
                    gaanaMaster.playPrevious();
                    break;
            }
        }
    });
});

function containerheight() {
    $('.aside-arrow').css({
        top: ($(window).height() - $('.aside-arrow').height()) / 2
    });
    if ($('.hotbox').attr('style')) {
        $('#main_middle_content').css('min-height', $(window).height() - 175);
    } else {
        $('#main_middle_content').css('min-height', $(window).height() - 120);
    }
}

function hoverSuggestion() {
    $('img').hover(function () {
        $(this).closest('.hover-class').find('.play-song-small').css('top', ($(this).closest('.hover-class').height() - $(this).closest('.hover-class').find('.play-song-small').height()) / 2);
    })
};
$(window).load(function () {
    $('#notfoundimg').css('margin-top', ($(window).height() - $('#notfound').height()) / 2 - 70);
    $('.transparent-div').height($(document).height());
    funcLoadGaanaAds();
    $('#youtubeplayerdiv').css({
        left: (($('#main_middle_content').innerWidth() - 420) / 2) + $('#left_panel').width()
    })
});
$(window).resize(function () {
    GenreLayout();
    rightpanelControl();
    containerheight();
    dynamicsetWidth();
    hoverSuggestion();
    activateverticalScroller();
    activateverticalScroller_ge();
    $('#youtubeplayerdiv').css({
        left: (($('#main_middle_content').innerWidth() - 420) / 2) + $('#left_panel').width()
    })
    $('.lyrics_main iframe').css({
        'height': ($(window).outerHeight() - ($('._nheader').outerHeight() + $('#mainPlayer').outerHeight() - 5)),
        width: $('#main_middle_content').outerWidth()
    });
    $('#search-suggestions').css('width', $(window).width() - 522);
    $('#main_middle_content').css('min-height', $(window).height() - 180);
    $('.radio_bg').css('height', $(window).height() - ($('.scroll_grd_panel').outerHeight() + 80));
    $('.main_blk').css({
        top: ($('#radio_bg').height() - 443) / 2
    });
    $('.video_blk').css({
        top: ($('#radio_bg').height() - 550) / 2
    });
});

function changeselection(obj) {}

function activateverticalScroller() {
    var userlist_w = $(window).height() - ($('#leftmenulink').outerHeight() + $('._nheader').outerHeight() + $('#mainPlayer').outerHeight());
    $('.scrollvertical').height(userlist_w);
    var scrollpane = $('.scrollvertical').jScrollPane({
        verticalDragMinHeight: 20,
        mouseWheelSpeed: 100
    });
    scrollpane.bind('mousewheel', function (e) {
        e.preventDefault();
    });
}

function activateverticalScroller_ge() {
    var playerHeight = 0;
    if (typeof readCookie('playerloaded') != 'undefined' && readCookie('playerloaded') == 1) {
        var playerHeight = 65;
    }
    var userlist_w = $(window).height() - parseInt($('.genre_heading').height()) - parseInt($('._nheader').height());
    $('.scroll-pane-genre').height(userlist_w);
    $('.scroll-pane-genre').each(function () {
        $(this).jScrollPane({
            animateScroll: true,
            mouseWheelSpeed: 100
        });
        var api = $(this).data('jsp');
        var throttleTimeout;
        $(window).bind('resize', function () {
            if ($.browser.msie) {
                if (!throttleTimeout) {
                    throttleTimeout = setTimeout(function () {
                        api.reinitialise();
                        throttleTimeout = null;
                    }, 50);
                }
            } else {
                api.reinitialise();
            }
        });
        $(this).bind('mousewheel', function (e) {
            e.preventDefault();
        });
        $('.genrealphabet').bind('click', function () {
            api.scrollTo(parseInt($('#toX').val()), parseInt($('#toY').val()));
            return false;
        });
        $('.genrealphabet').each(function () {
            $(this).unbind('click');
            $(this).bind('click', function () {
                var target_div_id = '#' + $(this).attr('data-value') + "_container";
                api.scrollToElement(target_div_id, true);
                return false;
            });
        });
    });
    showscrollerhover();
}

function activateverticalScrollerfixed() {
    scroll_containter_height = $('.scrollverticalfixed').height();
    scroll_content_height = $('.scrollverticalfixed').children().height();
    if (scroll_content_height > scroll_containter_height) {
        var scrollpane = $('.scrollverticalfixed').jScrollPane({
            verticalDragMinHeight: 15
        });
    }
    showscrollerhover();
}

function activateverticalScrollernotification() {
    scroll_containter_height = $('.scrollverticalnotification').height();
    scroll_content_height = $('.scrollverticalnotification>div.notification-innerblock').height();
    if (scroll_content_height > scroll_containter_height) {
        var scrollpane = $('.scrollverticalnotification').jScrollPane({
            verticalDragMinHeight: 15
        });
    }
    showscrollerhover();
}

function activateverticalScrollerSearch() {
    scroll_containter_height = $('.scrollverticalsearch').height();
    scroll_content_height = $('.scrollverticalsearch div#suggesitioncontainer').height();
    if (apis.length) {
        $.each(apis, function (i) {
            this.destroy();
        })
        apis = [];
    }
    if (scroll_content_height > scroll_containter_height) {
        var userlist_w = $(window).innerHeight() - ($('._nheader').outerHeight() + $('#mainPlayer').outerHeight() + 30);
        $('#search-suggestions').css('height', userlist_w);
        $('.scrollverticalsearch').each(function () {
            apis.push($(this).jScrollPane().data().jsp);
        })
        return false;
    } else {
        $('#search-suggestions').css('height', $('.scrollverticalsearch div#suggesitioncontainer').height());
        return false;
    }
    showscrollerhover();
}

function activateverticalScrollerContent() {
    var scrollpane = $('.scroll-vartical-content').jScrollPane();
    $(scrollpane).jScrollPane({
        animateScroll: true,
        mouseWheelSpeed: 100
    });
    var api = $(scrollpane).data('jsp');
    var throttleTimeout;
    $(window).bind('resize', function () {
        if ($.browser.msie) {
            if (!throttleTimeout) {
                throttleTimeout = setTimeout(function () {
                    api.reinitialise();
                    throttleTimeout = null;
                }, 50);
            }
        } else {
            api.reinitialise();
        }
    });
    $(scrollpane).bind('mousewheel', function (e) {
        e.preventDefault();
    })
    showscrollerhover();
}

function gAnalyticChannelClick(category, action, label) {
    _gaq.push(['_trackEvent', category, "g3-" + action, label]);
}

function readCookie(name) {
    try {
        var ca = document.cookie.split(';');
        var nameEQ = name + "=";
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    } catch (e) {
        errorLog(e.message, 'readCookie');
    }
}

function createCookie(name, value, hours) {
    try {
        if (hours) {
            var date = new Date();
            date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    } catch (e) {
        errorLog(e.message, 'createCookie');
    }
}

function loginRefresh(type) {
    if (typeof fbLoginCallback['arg'] != 'undefined') {
        utility.callFBapi(fbLoginCallback['arg']);
    }
    if (typeof loginCallback != 'undefined' && loginCallback != 'undefined') {
        loginCallBack();
    }
    if (type == 'twitter') {
        var fname = "publish_twitter";
        privacy.setPrivacy(fname, '0');
    } else if (type == 'facebook') {
        var fname = "publish_fb";
        privacy.setPrivacy(fname, '0');
    } else if (type == 'google') {
        var fname = "publish_google";
        privacy.setPrivacy(fname, '0');
        utility.blockui.remove();
    }
    $('#' + type + '-disconnect').removeClass('btn_inactive');
    $('#' + type + '-connect').addClass('btn_active');
}

function updateUserSocialFriends() {
    try {
        var url = BASE_URL + "ajax/updateusersocialfriends";
        $.ajax({
            url: url,
            success: function (msg) {},
            complete: function (msg) {},
            error: function () {}
        });
    } catch (e) {
        errorLog(e.message, 'updateUserSocialFriends');
    }
}

function rightpanelControl() {
    if ($(window).width() > 1199) {
        if ($('#right_panel').children().length >= 1) {
            $('#right_panel').show();
        }
    } else {
        $('#mainarea').attr('style', '');
    }
}

function followGaanaman() {
    try {
        $.ajax({
            url: BASE_URL + 'ajax/follow',
            data: "action=follow",
            type: "post",
            success: function (msg) {}
        });
    } catch (e) {
        alert(e.message)
    }
}

function sortBy(obj) {
    var url = getSortUrl($(obj).val())
    ajaxPageRequestHandler.invoke({
        url: url,
        'container': 'main_middle_content'
    });
}

function GenreLayout() {}

function initilizeGeoLocation() {
    try {
        $.ajax({
            type: 'post',
            url: BASE_URL + '/geolocation/geoIp.php',
            data: {},
            success: function (data) {
                geoLocation = $.trim(data);
            }
        });
    } catch (e) {
        errorLog(e.message, 'issue in initilize GeoLocation');
    }
}

function handleClickLinkRequest(requesturl, pathname) {
    if (requesturl.indexOf('validatecoupon') != -1) {
        var data = pathname.split("/");
        var token = data[2];
        verify.couponCode(token);
    }
    if (requesturl.indexOf('forgotpassword') != -1) {
        var data = pathname.split("/");
        var token = data[2];
        var ssoUseremail = '';
        if (typeof data[3] != 'undefined') {
            ssoUseremail = data[3];
        }
        forgotpassword.openPopup(token, ssoUseremail);
    }
    if (requesturl.indexOf('verify') != -1) {
        var data = pathname.split("/");
        var verificationCode = data[2];
        verifyaccountsso.verify(verificationCode);
    }
    if (requesturl.indexOf('deleteaccount') != -1) {
        var data = pathname.split("/");
        var token = data[2];
        registration.deactivateProfile(token);
    }
    if (requesturl.indexOf('home1') != -1) {
        registration.v1Check();
    }
}

function activateCurrentPlaying() {
    if (_activeSongID > 0) {
        if (isPlayingStatus) {
            Layout.playSong();
        } else {
            Layout.pauseSong();
        }
    }
}

function highLightNavLink(openmenu) {
    if ($(window).width() > 1540) {
        try {
            $('.dontclick').click(function (e) {
                e.preventDefault();
            })
            $href = location.href;
            var lochref = $href
            var href = lochref.split('/');
            $("#leftmenutop .sub_menu").each(function () {
                var _this = this;
                $(this).children().each(function () {
                    var innerlink = $(this).children('.history').attr('href').split('/');
                    $(this).children('.history').removeClass('active-link')
                    if ($.trim(href[3]) == $.trim(innerlink[1]) && $.trim(innerlink[1]) != 'myfavorite') {
                        if ($(_this).closest('li').find('ul').css('display') == 'none') $(_this).siblings().trigger('click')
                        $(this).children('.history').addClass('active-link')
                    } else if ($.trim(innerlink[1]) == 'myfavorite' && $.trim(innerlink[2]) == $.trim(href[4])) {
                        if ($(_this).closest('li').find('ul').css('display') == 'none') $(_this).siblings().trigger('click')
                        $(this).children('.history').addClass('active-link')
                    }
                })
            });
        } catch (e) {}
    }
}

function gAnalyticPageview() {
    lochref = window.location.href;
    domainUrl = location.protocol + "//" + location.host;
    pageUrl = lochref.replace(domainUrl, "");
    url = pageUrl;
    if (url.indexOf('search') != -1) {
        var _hashVal = url.split('/');
        var _category = 'general';
        var _keyword = _hashVal[3];
        _gaq.push(['_trackPageview', '/search?query=' + _keyword + '&cat=' + _category]);
    }
    _gaq.push(['_trackPageview', url]);
    if (typeof _cc2808 != 'undefined') {
        _cc2808.bcp();
    }
}

function gAnalyticVirtualPageview(url) {
    _gaq.push(['_trackPageview', url]);
}

function comscore() {
    if (typeof COMSCORE != 'undefined') {
        COMSCORE.beacon({
            c1: 2,
            c2: 6036484,
            c3: "",
            c4: "",
            c5: "",
            c6: "",
            c15: ""
        });
    }
}

function setBrowserTitle() {}

function changeBodyTheme(cls) {
    $('body').removeClass().addClass(cls);
}

function isGaanaPaidUserCheck() {
    var cookieName = 'gaana_paidUser';
    var paidUser = (typeof readCookie(cookieName) != 'undefined' && readCookie(cookieName) != '') ? readCookie(cookieName) : '';
    if (typeof paidUser != 'undefined' && (paidUser == 'valid' || paidUser == 'trial')) {
        return true;
    }
    return false;
}

function gaanaPlusUserStatus() {
    var cookieName = 'gaana_paidUser';
    var paidUser = (typeof readCookie(cookieName) != 'undefined' && (readCookie(cookieName) != '' || readCookie(cookieName) != '')) ? readCookie(cookieName) : '';
    if (typeof paidUser != 'undefined' && (paidUser != '' || paidUser != null)) {
        return paidUser;
    }
    return null;
}

function smsMarketingPrompt() {
    try {
        notify.openPopUp();
    } catch (e) {
        alert(e.message)
        errorLog(e.message, 'smsMarketingPrompt');
    }
}

function cleartextfield(e) {
    var id = e.id;
    var defvalue = document.getElementById(id).defaultValue;
    if ($('#' + id).val() == defvalue) {
        $('#' + id).val('');
    } else if ($('#' + id).val() == '') {
        $('#' + id).val(defvalue);
    }
}

function isValidateMobileNo(number) {
    if (isNaN(number) || number.indexOf(" ") != -1) {
        return false;
    }
    if (number.length > 10 || number.length < 10) {
        return false;
    }
    return true;
}

function trackingPreRoll(id, title) {
    try {
        $.ajax({
            type: 'post',
            url: 'http://223.165.30.111/prerol-log/',
            data: [{
                name: 'log',
                value: '{"cid":"' + id + '","cname":"' + title + '","eId":"0","uid":"0","prid":"1"}'
            }],
            success: function (data) {},
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                try {
                    if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown);
                } catch (e) {}
            }
        });
    } catch (e) {
        errorLog(e.message, 'trackingPreRoll');
    }
}

function autoplay() {
    var cls = setInterval(function () {
        if (flashLoaded) {
            $('.play_pause').removeClass('songplayed');
            $('.play_pause').removeClass('pause-icon');
            $($('.songlist')[0]).trigger('click')
            clearInterval(cls)
        }
    }, 1000)
}

function onSucessCallback() {
    setHomeActive();
    dynamicsetWidth();
    paiduser();
    discoversetting();
    activateCarousel()
    $('.sngandalbum a').click(function (e) {
        e.preventDefault();
    })
    $('.visibility').check();
    $('.add-playlist').AddEvent();
    $('.circle').AddEvent();
    $(".add-playlist").on('click', function (e) {
        e.stopPropagation();
    });
    $('.radio_bg').css('height', $(window).height() - ($('.scroll_grd_panel').outerHeight() + 80));
    $('.main_blk').css({
        top: ($('#radio_bg').height() - 443) / 2
    });
    $('.video_blk').css({
        top: ($('#radio_bg').height() - 550) / 2
    });
    $('.terms-check input').check();
    hoverSuggestion();
    for (sources in _variables['source']) {
        delete _variables['source'][sources];
    }
    GenreLayout();
    $('.gen-link').bind('scroll', function () {
        $('.alpha_search').animate({
            marginTop: $(this).scrollTop()
        }, 10);
    })
    $('#sharevalentinepop').on('click', 'a', function () {
        $('._arrow').hide(50);
    })
    activateverticalScroller();
    activateverticalScroller_ge();
    registration.editprofile();
    registration.editsetting();
    registration.socialconnect();
    activateCurrentPlaying();
    containerheight();
    comscore();
    highLightNavLink();
    showNowPlayingPopUp();
    $('.gaanalite_close').closeGaanaplus();
    bindGaanaplusSubscriptionEvent();
    editPlaylist();
    $('#activity a').showActivity();
    setTimeout(dfpAdSlots, 2000);
    $(".add-playlist").click(function (e) {
        e.stopPropagation();
    });
    $(".add-event").click(function (e) {});
    $(".small-screen").on('click', '.circle', function (e) {
        e.stopPropagation();
    });
    $('.setting_language').settingLanguage();
    $('.sortbydropdown').dropdownSortBy();
    $('.download').scrollPosition();
    $('.tab_nav a').scrollPosition();
    setTimeout(function () {
        activateScroller();
        showscrollerhover();
    }, 10);
    utility.blockui.remove();
    showLikersFollowersSummary();
    showscrollerhover();
    if ($('#Gaana-Section-Cubical_Ads').find('embed').length == 0) {
        $(this).hide();
    } else {
        $(this).show();
    }
    funcLoadGaanaAds();
}

function showscrollerhover() {
    $('.jspContainer').each(function () {
        $(this).hover(function () {
            $(this).find('.jspDrag').css("display", "block");
        }, function () {
            $(this).find(".jspDrag").css("display", "none");
        })
    })
}

function funcLoadGaanaAds() {
    $('#Gaana-Home-Cubical_Ads').css('display', 'block');
    $('#Gaana-Section-Cubical_Ads').css('display', 'inline-block');
    $('#Gaana-Home-Top_Ads').css('display', 'block');
    $('#Gaana-Home-Mid_Ads').css('display', 'block');
}

function addSocialScripts() {
    if (typeof (FB) != 'undefined') {
        FB.XFBML.parse();
    } else {
        $.getScript("http://connect.facebook.net/en_US/all.js#xfbml=1", function () {
            setTimeout(function () {
                if (_twttr_flag) {
                    if (typeof twttr != 'undefined') {
                        _twttr_flag = false;
                        _ga.trackTwitter();
                    }
                }
            }, 1000);
        });
    }
    $.getScript("https://platform.twitter.com/widgets.js", function () {});
    $.getScript("https://apis.google.com/js/plusone.js", function () {});
}

function getKey(value, jsondata) {
    var flag = false;
    var keyVal;
    for (key in jsondata) {
        if (jsondata[key] == value) {
            flag = true;
            keyVal = key;
            break;
        }
    }
    if (flag) {
        return keyVal;
    } else {
        return false;
    }
}

function editPlaylist() {
    $('.selector_group').checkPlaylist();
    $('.checkbox_group').removeSelection();
    $('.removesong').removePlaylist();
    $('#delete_playlist').deleteSelected();
    $('#save_playlist').click(function () {
        playlist.editPlaylist();
    });
}

function html_entity_decode(string, quote_style) {
    var hash_map = {}, symbol = '',
        tmp_str = '',
        entity = '';
    if (typeof string == 'undefined') {
        return false;
    }
    tmp_str = string.toString();
    if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style))) {
        return false;
    }
    delete(hash_map['&']);
    hash_map['&'] = '&amp;';
    for (symbol in hash_map) {
        entity = hash_map[symbol];
        tmp_str = tmp_str.split(entity).join(symbol);
    }
    tmp_str = tmp_str.split('&#039;').join("'");
    return tmp_str;
}

function get_html_translation_table(table, quote_style) {
    var entities = {}, hash_map = {}, decimal;
    var constMappingTable = {}, constMappingQuoteStyle = {};
    var useTable = {}, useQuoteStyle = {};
    constMappingTable[0] = 'HTML_SPECIALCHARS';
    constMappingTable[1] = 'HTML_ENTITIES';
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
    constMappingQuoteStyle[2] = 'ENT_COMPAT';
    constMappingQuoteStyle[3] = 'ENT_QUOTES';
    useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';
    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
        throw new Error("Table: " + useTable + ' not supported');
    }
    entities['38'] = '&amp;';
    if (useTable === 'HTML_ENTITIES') {
        entities['160'] = '&nbsp;';
        entities['161'] = '&iexcl;';
        entities['162'] = '&cent;';
        entities['163'] = '&pound;';
        entities['164'] = '&curren;';
        entities['165'] = '&yen;';
        entities['166'] = '&brvbar;';
        entities['167'] = '&sect;';
        entities['168'] = '&uml;';
        entities['169'] = '&copy;';
        entities['170'] = '&ordf;';
        entities['171'] = '&laquo;';
        entities['172'] = '&not;';
        entities['173'] = '&shy;';
        entities['174'] = '&reg;';
        entities['175'] = '&macr;';
        entities['176'] = '&deg;';
        entities['177'] = '&plusmn;';
        entities['178'] = '&sup2;';
        entities['179'] = '&sup3;';
        entities['180'] = '&acute;';
        entities['181'] = '&micro;';
        entities['182'] = '&para;';
        entities['183'] = '&middot;';
        entities['184'] = '&cedil;';
        entities['185'] = '&sup1;';
        entities['186'] = '&ordm;';
        entities['187'] = '&raquo;';
        entities['188'] = '&frac14;';
        entities['189'] = '&frac12;';
        entities['190'] = '&frac34;';
        entities['191'] = '&iquest;';
        entities['192'] = '&Agrave;';
        entities['193'] = '&Aacute;';
        entities['194'] = '&Acirc;';
        entities['195'] = '&Atilde;';
        entities['196'] = '&Auml;';
        entities['197'] = '&Aring;';
        entities['198'] = '&AElig;';
        entities['199'] = '&Ccedil;';
        entities['200'] = '&Egrave;';
        entities['201'] = '&Eacute;';
        entities['202'] = '&Ecirc;';
        entities['203'] = '&Euml;';
        entities['204'] = '&Igrave;';
        entities['205'] = '&Iacute;';
        entities['206'] = '&Icirc;';
        entities['207'] = '&Iuml;';
        entities['208'] = '&ETH;';
        entities['209'] = '&Ntilde;';
        entities['210'] = '&Ograve;';
        entities['211'] = '&Oacute;';
        entities['212'] = '&Ocirc;';
        entities['213'] = '&Otilde;';
        entities['214'] = '&Ouml;';
        entities['215'] = '&times;';
        entities['216'] = '&Oslash;';
        entities['217'] = '&Ugrave;';
        entities['218'] = '&Uacute;';
        entities['219'] = '&Ucirc;';
        entities['220'] = '&Uuml;';
        entities['221'] = '&Yacute;';
        entities['222'] = '&THORN;';
        entities['223'] = '&szlig;';
        entities['224'] = '&agrave;';
        entities['225'] = '&aacute;';
        entities['226'] = '&acirc;';
        entities['227'] = '&atilde;';
        entities['228'] = '&auml;';
        entities['229'] = '&aring;';
        entities['230'] = '&aelig;';
        entities['231'] = '&ccedil;';
        entities['232'] = '&egrave;';
        entities['233'] = '&eacute;';
        entities['234'] = '&ecirc;';
        entities['235'] = '&euml;';
        entities['236'] = '&igrave;';
        entities['237'] = '&iacute;';
        entities['238'] = '&icirc;';
        entities['239'] = '&iuml;';
        entities['240'] = '&eth;';
        entities['241'] = '&ntilde;';
        entities['242'] = '&ograve;';
        entities['243'] = '&oacute;';
        entities['244'] = '&ocirc;';
        entities['245'] = '&otilde;';
        entities['246'] = '&ouml;';
        entities['247'] = '&divide;';
        entities['248'] = '&oslash;';
        entities['249'] = '&ugrave;';
        entities['250'] = '&uacute;';
        entities['251'] = '&ucirc;';
        entities['252'] = '&uuml;';
        entities['253'] = '&yacute;';
        entities['254'] = '&thorn;';
        entities['255'] = '&yuml;';
    }
    if (useQuoteStyle !== 'ENT_NOQUOTES') {
        entities['34'] = '&quot;';
    }
    if (useQuoteStyle === 'ENT_QUOTES') {
        entities['39'] = '&#39;';
    }
    entities['60'] = '&lt;';
    entities['62'] = '&gt;';
    for (decimal in entities) {
        if (entities.hasOwnProperty(decimal)) {
            hash_map[String.fromCharCode(decimal)] = entities[decimal];
        }
    }
    return hash_map;
}

function filterQueueData() {
    var queuedata = $.parseJSON(superCookie.getItem('queue'));
    var filterq = new Array();
    for (a in queuedata) {
        var queue = queuedata[a];
        filterq[a] = {};
        filterq[a].title = html_entity_decode(queue.title);
        filterq[a].id = queue.id;
        filterq[a].albumartwork = queue.albumartwork;
        filterq[a].albumseokey = queue.albumseokey;
        filterq[a].albumtitle = html_entity_decode(queue.albumtitle);
        filterq[a].artist = queue.artist;
        filterq[a].content_source = queue.content_source;
        filterq[a].duration = queue.duration;
        filterq[a].object_type = queue.object_type;
        filterq[a].path = queue.path;
        filterq[a].playtype = queue.playtype;
        filterq[a].sType = queue.sType;
        filterq[a].seokey = queue.seokey;
        filterq[a].share_url = queue.share_url;
        filterq[a].source = queue.source;
        filterq[a].source_id = queue.source_id;
        filterq[a].status = queue.status;
        filterq[a].track_ids = queue.track_ids;
    }
    return filterq;
}

function removeLeftNavClass() {
    $('#left_panel').removeClass('setLeftnavClass');
}
$(document).ready(function () {
    try {
        var snd = jsPlayer.getSound('msPlayer')
        if (snd.isReady) {
            loaddefaultimage();
        } else {
            snd.onReady(function () {
                loaddefaultimage();
            });
        };
    } catch (e) {}
})

function loaddefaultimage() {
    var preload = $("<img>");
    var randomNumberIe = '';
    if (isIE()) {
        randomNumberIe = "?" + new Date().getTime();
    }
    $(preload).attr("src", 'http://static.gaana.com//media/images-v1/default-album-175x175.gif' + randomNumberIe).load(function () {
        _checkLoad($("#new-release-album"));
        _checkLoad($("#radiomirchi_home"));
        _checkLoad($("#gaanaradio_home"));
        _checkLoad($("#zoomplaylist_home"));
        _checkLoad($("#homefeatured_home"));
        _checkLoad($("#art_work_list"));
        _checkLoad($("#artist_work_list"));
        _checkLoad($("#similar_section"));
        _checkLoad($("#discover-section"));
        $(window).bind("scroll", function () {
            _checkLoad($("#art_work_list"));
            _checkLoad($("#artist_work_list"));
            _checkLoad($("#gaanaradio_home"));
            _checkLoad($("#radiomirchi_home"));
            _checkLoad($("#zoomplaylist_home"));
            _checkLoad($("#homefeatured_home"));
            _checkLoad($("#new-release-album"));
            _checkLoad($("#similar_section"));
            _checkLoad($("#discover-section"));
        });
        $(preload).remove()
    });
}

function loadimagesdynamic(el, forceSize) {
    if ($(el).hasClass("loaded")) return;
    if (forceSize === undefined) var forceSize = false;
    var tgt = $(el).find(".img");
    if (forceSize) $(tgt).parent().css({});
    $(el).find(".artworkdiv").css("background-image", "url(" + $(tgt).attr("src") + ")");
    $(tgt).attr("src", $(tgt).attr("data-src")).css('opacity', 0);
    $(tgt).animate({
        opacity: 1
    }, 500);
    $(el).addClass("loaded")
}

function _checkLoad(tgt) {
    if ($(tgt).find(".list:not(.loaded),.thumbClass:not(.loaded)").length > 0) {
        var scrollPos = $(window).height() + $(document).scrollTop();
        $(tgt).find(".list:not(.loaded),.thumbClass:not(.loaded)").each(function (i) {
            if (scrollPos > $(this).offset().top) loadimagesdynamic($(this), true)
        })
    } else {}
}
var TimesPoint = {}
TimesPoint.ShowPoints = function (user_id, zone) {
    var _zone = (typeof zone == 'undefined') ? 'myzone' : zone;
    try {
        var url = BASE_URL + "ajax/timespoint";
        $.ajax({
            url: url,
            'async': true,
            data: {
                "task": "showpoints",
                "user_id": user_id
            },
            method: 'get',
            dataType: "json",
            success: function (msg) {
                if (msg.status == 'success') {
                    if (_zone == 'header') {
                        $("#header .headerpointsbg").html(msg.message.statusPoints);
                    } else {
                        var html = "<h2><span></span>Times<strong>Points</strong></h2>";
                        html += '<a href="/timespoints" class="times_point pjax"><span class="wht_crown"></span>' + msg.message.levelName + ' : ' + msg.message.statusPoints + '</a>';
                        html += '<a href="/timespoints" class="pjax">How to earn more points?</a>';
                        $("#mainarea .Timespoint").html(html);
                        if (msg.message.levelName.toLowerCase() == 'gold') {
                            $("#mainarea .Timespoint").find('.times_point').addClass('gold');
                        } else if (msg.message.levelName.toLowerCase() == 'silver') {
                            $("#mainarea .Timespoint").find('.times_point').addClass('silver');
                        } else if (msg.message.levelName.toLowerCase() == 'bronze') {
                            $("#mainarea .Timespoint").find('.times_point').addClass('bronze');
                        } else if (msg.message.levelName.toLowerCase() == 'diamond') {
                            $("#mainarea .Timespoint").find('.times_point').addClass('diamond');
                        } else if (msg.message.levelName.toLowerCase() == 'platinum') {
                            $("#mainarea .Timespoint").find('.times_point').addClass('platinum');
                        }
                    }
                }
            },
            complete: function (msg) {},
            error: function () {}
        });
    } catch (e) {
        errorLog(e.message, 'TimesPoint.ShowPoints');
    }
}

function submitform(e) {
    e.preventDefault();
    var mobNumber = $.trim($('#smsMobileNo').val());
    if (mobNumber != '' && parent.isValidateMobileNo(mobNumber)) {
        $.ajax({
            type: 'post',
            url: BASE_URL + 'ajax/sms_notifications',
            data: {
                "mobile_no": mobNumber
            },
            dataType: 'json',
            beforeSend: function () {
                $('#smsMobileNo').attr('disabled', true);
                $('#submitSMS').css('visibility', 'hidden');
            },
            success: function (data) {
                var jsondata = data;
                $("#smsMobileNo").removeAttr('disabled');
                $('#submitSMS').css('visibility', 'visible');
                if ($.trim(jsondata.status) === 'true') {
                    parent.createCookie('isUsingMobile', 'true', 360);
                    var htmlMessage = '<div style="padding:40px; font-size:15px; text-align:center;">' + jsondata.message + '</div>';
                    $('#popup').remove();
                    parent.gAnalyticChannelClick('SMSMarketing', 'click', 'submit')
                    parent.messagebox.open({
                        msg: jsondata.message,
                        autoclose: false
                    }, true);
                } else {
                    $('.smsErrorMsg').show();
                    $('.smsErrorMsg').html(jsondata.message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                try {} catch (e) {}
            }
        });
    } else {
        $('.smsErrorMsg').show();
        $('.smsErrorMsg').html('Number entered is invalid');
    }
}

function SuperCookie() {
    var _this = this;
    this.isReady = false;
    this.onReady = null;
    var _ua = navigator.userAgent,
        _isIE = _ua.match(/msie/i),
        _win = window,
        _doc = document,
        _isLocal = false;
    var _cookieObj;
    this.length = 0;
    this.remainingSpace;
    this.getItem = function (key) {
        try {
            return _cookieObj.getItem(key);
        } catch (error) {}
    }
    this.clear = function () {
        _cookieObj.clear();
        this.updateProp("length", _cookieObj.length);
    }
    this.key = function (index) {
        return _cookieObj.key(index);
    }
    this.removeItem = function (key) {
        _cookieObj.removeItem(key);
        this.updateProp("length", _cookieObj.length);
    }
    this.setItem = function (key, value) {
        try {
            _cookieObj.setItem(key, value);
        } catch (error) {
            if (typeof createFlash() == 'undefined') {
                return;
            }
            createFlash();
        }
        this.updateProp("length", _cookieObj.length);
    }
    this.updateProp = function (key, val) {
        this[key] = val;
    }
    var createFlash = function () {
        _isLocal = false;
        var fashid = "cookieswf";
        var so = new SWFObject(TMUrl + "/swf/supercookie.swf", fashid, "215", "138", 10.3, "#ffffff");
        if (typeof so == 'undefined') {
            return;
        }
        so.addParam("salign", "center");
        so.addParam("allowFullScreen", "true");
        so.addParam("wmode", "window");
        so.addParam("AllowScriptAccess", "always");
        so.addVariable("baseURL", window.location.host);
        if (!document.getElementById("cookieDiv")) {
            var div = document.createElement("div");
            div.id = "cookieDiv";
            div.style.cssText = "position:absolute;top:-200px";
            if (document.body) {
                document.body.appendChild(div);
            }
        }
        so.write("cookieDiv");
        _cookieObj = (_isIE) ? _win[fashid] : _doc[fashid];
    }
    var getLength = function () {
        return (_isLocal == false) ? _cookieObj.getLength() : _cookieObj.length;
    }
    var init = function () {
        if (window.localStorage) {
            _isLocal = true;
            _cookieObj = window.localStorage;
        } else {
            createFlash();
        }
        _this.isReady = true;
        _this.length = getLength();
        if (_this.onReady != null) {
            _this.onReady.apply(_this, arguments);
        };
    }
    init();
}

function activateScroller() {
    paiduser();
    $('.scroll-pane').each(function () {
        var contentcontainer = $(this).find('.content-container-scroll');
        var items_count = contentcontainer.children().length;
        var _width = 0;
        var offset = 10;
        contentcontainer.children().each(function () {
            _width = _width + $(this).outerWidth(true);
        })
        if ($(this).attr('class').indexOf('_featured') != -1) {
            contentcontainer.css({
                width: items_count * 260
            });
        } else {
            contentcontainer.css({
                width: _width + offset
            });
        }
        $(this).css({
            height: $(this).height() + 20
        });
        $(this).jScrollPane();
        var api = $(this).data('jsp');
        var throttleTimeout;
        $(window).bind('resize', function () {
            if ($.browser.msie) {
                if (!throttleTimeout) {
                    throttleTimeout = setTimeout(function () {
                        api.reinitialise();
                        throttleTimeout = null;
                    }, 50);
                }
            } else {
                api.reinitialise();
            }
        });
    })
    $('.scroll-pane').each(function () {
        return;
        $(this).hover(function () {
            $(this).find('.jspHorizontalBar').css("display", "block");
        }, function () {
            $(".jspHorizontalBar").css("display", "none");
        })
    })
}

function loginWrapper(userinfo) {
    if (userinfo.username.split(" ").length > 1) {
        var _username = userinfo.username.split(" ")[0];
    } else {
        var _username = userinfo.username;
    }
    var loggedin_headerHtml = ['<div class="header_divider ft_lt"></div><a href="/myzone" class="pjax" style="line-height:13px;"><img src="', jsuserdata.artwork, '" width="25" height="25"/></a> <a href="javascript:void(0)">', _username, '</a><a href="javascript:void(0)" class="login-setting"></a>', '<ul id="signedin-menu" class="clearfix">', '<li><a href="/myzone" class="pjax a-d1" data-type="url" data-value="/myzone"><span id="my-zone"></span> My Zone</a></li>', '<li><a href="/settings" class="pjax a-d1" data-type="url" data-value="/settings"><span id="my-settings"></span> Settings</a></li>', '<li><a href="javascript:void(0)" id="logout-button" class="a-d1"><span id="sign-out"></span> Sign-Out</a></li>', '</ul><div class="header_divider ft_rt"></div> '].join('')
    $('._nlogreg').html(loggedin_headerHtml);
    $('._nlogreg').mySettings();
    $('._nlogreg').mySettingsOut();
    if (userinfo.isMobileUser == 'Y' && gaanaPlusUserStatus() == 'valid') {
        $('._ngetgaana').html('');
        $('._nlogreg div:first-of-type').remove();
    } else if (userinfo.isMobileUser == 'Y') {
        $('._ngetgaana').html('<a href="/gaanaplus1" class="upgradegaana pjax"><span>Upgrade to</span> Gaana+</a>');
    } else {
        $('._ngetgaana').html('<a href="javascript:void(0)" onclick="registration.mobilepopup2()">Get gaana<span>on mobile</span></a>');
    }
}

function setHomeActive() {
    var pathname = window.location.pathname;
    if (pathname === '/') {
        $('#left_panel>ul>li>a').removeAttr('style').find('span').removeClass('orange').removeAttr('style');
        $('#left_panel>ul>li').removeAttr('style');
        $('#left_panel>ul>li:first-of-type').css('background', '#242424');
        $('#left_panel>ul>li:first-of-type').find('span').addClass('orange');
        $('#left_panel>ul>li>a#home').css('background-position', '-12px 1px');
    }
}

function countMatchItemsInArray(arr, what) {
    var count = 0,
        i;
    while ((i = arr.indexOf(what, i)) != -1) {
        ++count;
        ++i;
    }
    return count;
}

function googleConnect() {
    gapi.auth.signIn({
        callback: "onConnectCallback",
        clientid: GOOGLE_CLIENT_ID,
        apppackagename: "com.gaana",
        accesstype: "offline",
        cookiepolicy: "single_host_origin",
        approvalprompt: "auto",
        requestvisibleactions: "http://schemas.google.com/AddActivity",
        scope: "email https://www.googleapis.com/auth/plus.login"
    });
}

function refreshUserSession() {
    $.ajax({
        url: BASE_URL + 'ajax/refreshUserSession',
        type: 'POST',
        dataType: 'html',
        success: function (data) {
            try {
                var data = $.parseJSON(data);
                if (data[0] != 'failed') {
                    paiduser();
                }
            } catch (e) {}
        },
        error: function () {}
    });
}

function setListenedHistory(songInfo) {
    var stored_history = (readCookie('stored_history')) != null ? JSON.parse(readCookie('stored_history')) : null;
    var stored_history_song = [];
    var stored_history_album = [];
    var stored_history_artist = [];
    if (stored_history != null) {
        stored_history_song = stored_history.song_id;
        stored_history_album = stored_history.album_id;
        stored_history_artist = stored_history.artist_id;
    }
    var artist_ids = setListenedArtistIdArray(songInfo);
    for (var index in artist_ids.artist_id) {
        stored_history_artist.push(artist_ids.artist_id[index]);
    }
    stored_history_song.push(songInfo.id);
    stored_history_album.push(songInfo.album_id);
    var listen_history = {
        "song_id": stored_history_song,
        "album_id": stored_history_album,
        "artist_id": stored_history_artist
    };
    createCookie('stored_history', JSON.stringify(listen_history));
}

function getListenedHistory(cookie_name) {
    return (readCookie('stored_history')) != null ? JSON.parse(readCookie('stored_history')) : null;
}

function setListenedArtistIdArray(data) {
    try {
        var artists = (data.artist != null) ? data.artist.split(",") : 'no';
        var artistobj = new Array();
        var artist_ids = new Array();
        var artist_names = new Array();
        for (i = 0; i < artists.length; i++) {
            var arname_id = artists[i].split("###");
            var name = (typeof $.trim(arname_id[0]) != 'undefined' && $.trim(arname_id[0]) != '') ? $.trim(arname_id[0]) : '';
            var id = (typeof arname_id[1] != 'undefined' && arname_id[1] != '') ? arname_id[1] : '';
            artist_ids.push(id);
            artist_names.push(name);
        }
        artistobj = {
            "artist_id": artist_ids,
            "artist_name": artist_names
        };
        return artistobj;
    } catch (error) {}
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtubeplayervideo', {
        height: '350',
        width: '630',
        autoplay: 1,
        autohide: 1,
        allowfullscreen: false,
        videoId: videoId,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onError
        },
        playerVars: {
            autoplay: 1,
            autohide: 1
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onError(event) {
    var s = event.data;
    if (s != 2) {
        done = true;
    }
}
var done = false;
$(document).keyup(function (e) {
    if (e.which == 27) {
        if (typeof player != 'undefined' && typeof YT != 'undefined' && done) {}
    }
});

function onPlayerStateChange(event) {
    if (event.data == 1) {} else {}
    if (event.data == YT.PlayerState.PLAYING && !done) {
        gAnalyticVirtualPageview('/virtual/videoplayer');
        done = true;
    }
}

function discoversetting() {
    $('.discover ul li > div .title a').each(function () {
        if ($(this).text().length <= 20) {
            $(this).css('min-height', '17px');
            $(this).closest('.title').next('.album').find('span').css({
                'padding-bottom': '17px',
                'display': 'block'
            });
        }
    })
}

function dynamicsetWidth() {
    $('.cust_carl ul li').css('width', ($('.cust_carl').width() / 6 + 2));
    _setwidth = $('.fav>ul').children('li').length * ($('.fav>ul').children('li').innerWidth() + 15);
    $('.fav>ul').css({
        width: _setwidth
    });
    $('.carl_next_v1').css('top', ($('.carl_prev_v1_body').height() - $('.carl_next_v1').height()) / 2)
    $('.carl_prev_v1').css('top', ($('.carl_prev_v1_body').height() - $('.carl_next_v1').height()) / 2)
    $('.cust_carl ul li > div .title a').each(function () {
        if ($(this).width() > $(this).closest('div.title').width()) {
            $(this).css('white-space', 'normal');
            $(this).css('min-height', '34px');
            $(this).closest('.title').next('.album').find('span').css({
                'padding-bottom': '0',
                'display': 'block'
            });
        }
        if ($(this).width() < $(this).closest('div.title').width()) {
            $(this).removeAttr('style');
            $(this).closest('.title').next('.album').find('span').removeAttr('style');
        }
    })
}

function activateCarousel() {
    var _this = null;
    $('.cust_carl').jcarousel({
        animation: 'slow'
    })
    $('.cust_carl').showcarousel();
    $('.carl_prev').on('jcarouselcontrol:active', function () {
        $(this).removeClass('carlinactive');
    }).on('jcarouselcontrol:inactive', function () {
        $(this).addClass('carlinactive');
    }).jcarouselControl({
        target: '-=6'
    });
    $('.carl_next').on('jcarouselcontrol:active', function () {
        $(this).removeClass('carlinactive');
    }).on('jcarouselcontrol:inactive', function () {
        $(this).addClass('carlinactive');
    }).jcarouselControl({
        target: '+=6'
    });
    $('.bodyr').on('jcarouselcontrol:active', function () {
        $(this).removeClass('carlinactive');
    }).on('jcarouselcontrol:inactive', function () {
        $(this).addClass('carlinactive');
    }).jcarouselControl({
        target: '+=1',
        event: 'click'
    });
    $('.bodyl').on('jcarouselcontrol:active', function () {
        $(this).removeClass('carlinactive');
    }).on('jcarouselcontrol:inactive', function () {
        $(this).addClass('carlinactive');
    }).jcarouselControl({
        target: '-=1',
        event: 'click'
    });
    $('.bodyr').mouseover(function (e) {
        if (!$(this).hasClass("carlinactive")) {
            _this = $(this);
            _this.click();
            window.setTimeout(CallAgain, 2000);
            e.stopPropagation();
        }
    });
    $('.bodyl').mouseover(function (e) {
        if (!$(this).hasClass("carlinactive")) {
            _this = $(this);
            _this.click();
            window.setTimeout(CallAgain, 2000);
            e.stopPropagation();
        }
    });
    $('.bodyl').mouseout(function (e) {
        if (!$(this).hasClass("carlinactive")) {
            _this = null;
        }
    });
    $('.bodyr').mouseout(function (e) {
        if (!$(this).hasClass("carlinactive")) {
            _this = null;
        }
    });
    $('body').mouseover(function (e) {
        _this = null;
    });

    function CallAgain() {
        if (_this != null) {
            _this.click();
            window.setTimeout(CallAgain, 2000);
        }
    };
}
$(window).load(function () {
    $('body').trigger('click');
    (function () {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://') + 'stats.g.doubleclick.net/dc.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    })();
    (function () {
        var s = document.createElement("script"),
            el = document.getElementsByTagName("script")[0];
        s.async = true;
        s.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";
        el.parentNode.insertBefore(s, el);
    })();
    (function () {
        var mf = document.createElement("script");
        mf.type = "text/javascript";
        mf.async = true;
        mf.src = "//cdn.mouseflow.com/projects/90c844a8-7b9b-4ab9-824f-80d42364442a.js";
        document.getElementsByTagName("head")[0].appendChild(mf);
    })();
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "http://connect.facebook.net/en_US/all/vb.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    (function () {
        var po = document.createElement('script');
        po.type = 'text/javascript';
        po.async = true;
        po.src = 'https://plus.google.com/js/client:plusone.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
    })();
    (function () {
        var gl = document.createElement('script');
        gl.type = 'text/javascript';
        gl.async = true;
        gl.src = '//www.googleadservices.com/pagead/conversion.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gl, s);
    })();
    end = new Date().getTime();
    diff = end - start;
    loaddefaultimage();
    dfpAdSlots()
});
var Pixastic = (function () {
    function addEvent(el, event, handler) {
        if (el.addEventListener) el.addEventListener(event, handler, false);
        else if (el.attachEvent) el.attachEvent("on" + event, handler);
    }

    function onready(handler) {
        var handlerDone = false;
        var execHandler = function () {
            if (!handlerDone) {
                handlerDone = true;
                handler();
            }
        }
        document.write("<" + "script defer src=\"//:\" id=\"__onload_ie_pixastic__\"></" + "script>");
        var script = document.getElementById("__onload_ie_pixastic__");
        script.onreadystatechange = function () {
            if (script.readyState == "complete") {
                script.parentNode.removeChild(script);
                execHandler();
            }
        }
        if (document.addEventListener) document.addEventListener("DOMContentLoaded", execHandler, false);
        addEvent(window, "load", execHandler);
    }

    function init() {
        var imgEls = getElementsByClass("pixastic", null, "img");
        var canvasEls = getElementsByClass("pixastic", null, "canvas");
        var elements = imgEls.concat(canvasEls);
        for (var i = 0; i < elements.length; i++) {
            (function () {
                var el = elements[i];
                var actions = [];
                var classes = el.className.split(" ");
                for (var c = 0; c < classes.length; c++) {
                    var cls = classes[c];
                    if (cls.substring(0, 9) == "pixastic-") {
                        var actionName = cls.substring(9);
                        if (actionName != "") actions.push(actionName);
                    }
                }
                if (actions.length) {
                    if (el.tagName.toLowerCase() == "img") {
                        var dataImg = new Image();
                        dataImg.src = el.src;
                        if (dataImg.complete) {
                            for (var a = 0; a < actions.length; a++) {
                                var res = Pixastic.applyAction(el, el, actions[a], null);
                                if (res) el = res;
                            }
                        } else {
                            dataImg.onload = function () {
                                for (var a = 0; a < actions.length; a++) {
                                    var res = Pixastic.applyAction(el, el, actions[a], null)
                                    if (res) el = res;
                                }
                            }
                        }
                    } else {
                        setTimeout(function () {
                            for (var a = 0; a < actions.length; a++) {
                                var res = Pixastic.applyAction(el, el, actions[a], null);
                                if (res) el = res;
                            }
                        }, 1);
                    }
                }
            })();
        }
    }
    if (typeof pixastic_parseonload != "undefined" && pixastic_parseonload) onready(init);

    function getElementsByClass(searchClass, node, tag) {
        var classElements = new Array();
        if (node == null) node = document;
        if (tag == null) tag = '*';
        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;
        var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
        for (i = 0, j = 0; i < elsLen; i++) {
            if (pattern.test(els[i].className)) {
                classElements[j] = els[i];
                j++;
            }
        }
        return classElements;
    }
    var debugElement;

    function writeDebug(text, level) {
        if (!Pixastic.debug) return;
        try {
            switch (level) {
                case "warn":
                    console.warn("Pixastic:", text);
                    break;
                case "error":
                    console.error("Pixastic:", text);
                    break;
                default:
                    console.log("Pixastic:", text);
            }
        } catch (e) {}
        if (!debugElement) {}
    }
    var hasCanvas = (function () {
        var c = document.createElement("canvas");
        var val = false;
        try {
            val = !! ((typeof c.getContext == "function") && c.getContext("2d"));
        } catch (e) {}
        return function () {
            return val;
        }
    })();
    var hasCanvasImageData = (function () {
        var c = document.createElement("canvas");
        var val = false;
        var ctx;
        try {
            if (typeof c.getContext == "function" && (ctx = c.getContext("2d"))) {
                val = (typeof ctx.getImageData == "function");
            }
        } catch (e) {}
        return function () {
            return val;
        }
    })();
    var hasGlobalAlpha = (function () {
        var hasAlpha = false;
        var red = document.createElement("canvas");
        if (hasCanvas() && hasCanvasImageData()) {
            red.width = red.height = 1;
            var redctx = red.getContext("2d");
            redctx.fillStyle = "rgb(255,0,0)";
            redctx.fillRect(0, 0, 1, 1);
            var blue = document.createElement("canvas");
            blue.width = blue.height = 1;
            var bluectx = blue.getContext("2d");
            bluectx.fillStyle = "rgb(0,0,255)";
            bluectx.fillRect(0, 0, 1, 1);
            redctx.globalAlpha = 0.5;
            redctx.drawImage(blue, 0, 0);
            var reddata = redctx.getImageData(0, 0, 1, 1).data;
            hasAlpha = (reddata[2] != 255);
        }
        return function () {
            return hasAlpha;
        }
    })();
    return {
        parseOnLoad: false,
        debug: false,
        applyAction: function (img, dataImg, actionName, options) {
            options = options || {};
            var imageIsCanvas = (img.tagName.toLowerCase() == "canvas");
            if (imageIsCanvas && Pixastic.Client.isIE()) {
                if (Pixastic.debug) writeDebug("Tried to process a canvas element but browser is IE.");
                return false;
            }
            var canvas, ctx;
            var hasOutputCanvas = false;
            if (Pixastic.Client.hasCanvas()) {
                hasOutputCanvas = !! options.resultCanvas;
                canvas = options.resultCanvas || document.createElement("canvas");
                ctx = canvas.getContext("2d");
            }
            var w = img.offsetWidth;
            var h = img.offsetHeight;
            if (imageIsCanvas) {
                w = img.width;
                h = img.height;
            }
            if (w == 0 || h == 0) {
                if (img.parentNode == null) {
                    var oldpos = img.style.position;
                    var oldleft = img.style.left;
                    img.style.position = "absolute";
                    img.style.left = "-9999px";
                    document.body.appendChild(img);
                    w = img.offsetWidth;
                    h = img.offsetHeight;
                    document.body.removeChild(img);
                    img.style.position = oldpos;
                    img.style.left = oldleft;
                } else {
                    if (Pixastic.debug) writeDebug("Image has 0 width and/or height.");
                    return;
                }
            }
            if (actionName.indexOf("(") > -1) {
                var tmp = actionName;
                actionName = tmp.substr(0, tmp.indexOf("("));
                var arg = tmp.match(/\((.*?)\)/);
                if (arg[1]) {
                    arg = arg[1].split(";");
                    for (var a = 0; a < arg.length; a++) {
                        thisArg = arg[a].split("=");
                        if (thisArg.length == 2) {
                            if (thisArg[0] == "rect") {
                                var rectVal = thisArg[1].split(",");
                                options[thisArg[0]] = {
                                    left: parseInt(rectVal[0], 10) || 0,
                                    top: parseInt(rectVal[1], 10) || 0,
                                    width: parseInt(rectVal[2], 10) || 0,
                                    height: parseInt(rectVal[3], 10) || 0
                                }
                            } else {
                                options[thisArg[0]] = thisArg[1];
                            }
                        }
                    }
                }
            }
            if (!options.rect) {
                options.rect = {
                    left: 0,
                    top: 0,
                    width: w,
                    height: h
                };
            } else {
                options.rect.left = Math.round(options.rect.left);
                options.rect.top = Math.round(options.rect.top);
                options.rect.width = Math.round(options.rect.width);
                options.rect.height = Math.round(options.rect.height);
            }
            var validAction = false;
            if (Pixastic.Actions[actionName] && typeof Pixastic.Actions[actionName].process == "function") {
                validAction = true;
            }
            if (!validAction) {
                if (Pixastic.debug) writeDebug("Invalid action \"" + actionName + "\". Maybe file not included?");
                return false;
            }
            if (!Pixastic.Actions[actionName].checkSupport()) {
                if (Pixastic.debug) writeDebug("Action \"" + actionName + "\" not supported by this browser.");
                return false;
            }
            if (Pixastic.Client.hasCanvas()) {
                if (canvas !== img) {
                    canvas.width = w;
                    canvas.height = h;
                }
                if (!hasOutputCanvas) {
                    canvas.style.width = w + "px";
                    canvas.style.height = h + "px";
                }
                ctx.drawImage(dataImg, 0, 0, w, h);
                if (!img.__pixastic_org_image) {
                    canvas.__pixastic_org_image = img;
                    canvas.__pixastic_org_width = w;
                    canvas.__pixastic_org_height = h;
                } else {
                    canvas.__pixastic_org_image = img.__pixastic_org_image;
                    canvas.__pixastic_org_width = img.__pixastic_org_width;
                    canvas.__pixastic_org_height = img.__pixastic_org_height;
                }
            } else if (Pixastic.Client.isIE() && typeof img.__pixastic_org_style == "undefined") {
                img.__pixastic_org_style = img.style.cssText;
            }
            var params = {
                image: img,
                canvas: canvas,
                width: w,
                height: h,
                useData: true,
                options: options
            }
            var res = Pixastic.Actions[actionName].process(params);
            if (!res) {
                return false;
            }
            if (Pixastic.Client.hasCanvas()) {
                if (params.useData) {
                    if (Pixastic.Client.hasCanvasImageData()) {
                        canvas.getContext("2d").putImageData(params.canvasData, options.rect.left, options.rect.top);
                        canvas.getContext("2d").fillRect(0, 0, 0, 0);
                    }
                }
                if (!options.leaveDOM) {
                    canvas.title = img.title;
                    canvas.imgsrc = img.imgsrc;
                    if (!imageIsCanvas) canvas.alt = img.alt;
                    if (!imageIsCanvas) canvas.imgsrc = img.src;
                    canvas.className = img.className;
                    canvas.style.cssText = img.style.cssText;
                    canvas.name = img.name;
                    canvas.tabIndex = img.tabIndex;
                    canvas.id = img.id;
                    if (img.parentNode && img.parentNode.replaceChild) {
                        img.parentNode.replaceChild(canvas, img);
                    }
                }
                options.resultCanvas = canvas;
                return canvas;
            }
            return img;
        },
        prepareData: function (params, getCopy) {
            var ctx = params.canvas.getContext("2d");
            var rect = params.options.rect;
            var dataDesc = ctx.getImageData(rect.left, rect.top, rect.width, rect.height);
            var data = dataDesc.data;
            if (!getCopy) params.canvasData = dataDesc;
            return data;
        },
        process: function (img, actionName, options, callback) {
            if (img.tagName.toLowerCase() == "img") {
                var dataImg = new Image();
                dataImg.src = img.src;
                if (dataImg.complete) {
                    var res = Pixastic.applyAction(img, dataImg, actionName, options);
                    if (callback) callback(res);
                    return res;
                } else {
                    dataImg.onload = function () {
                        var res = Pixastic.applyAction(img, dataImg, actionName, options)
                        if (callback) callback(res);
                    }
                }
            }
            if (img.tagName.toLowerCase() == "canvas") {
                var res = Pixastic.applyAction(img, img, actionName, options);
                if (callback) callback(res);
                return res;
            }
        },
        revert: function (img) {
            if (Pixastic.Client.hasCanvas()) {
                if (img.tagName.toLowerCase() == "canvas" && img.__pixastic_org_image) {
                    img.width = img.__pixastic_org_width;
                    img.height = img.__pixastic_org_height;
                    img.getContext("2d").drawImage(img.__pixastic_org_image, 0, 0);
                    if (img.parentNode && img.parentNode.replaceChild) {
                        img.parentNode.replaceChild(img.__pixastic_org_image, img);
                    }
                    return img;
                }
            } else if (Pixastic.Client.isIE()) {
                if (typeof img.__pixastic_org_style != "undefined") img.style.cssText = img.__pixastic_org_style;
            }
        },
        Client: {
            hasCanvas: hasCanvas,
            hasCanvasImageData: hasCanvasImageData,
            hasGlobalAlpha: hasGlobalAlpha,
            isIE: function () {
                return !!document.all && !! window.attachEvent && !window.opera;
            }
        },
        Actions: {}
    }
})();;
Pixastic.Actions.blurfast = {
    process: function (params) {
        var amount = parseFloat(params.options.amount) || 0;
        var clear = !! (params.options.clear && params.options.clear != "false");
        amount = Math.max(0, Math.min(5, amount));
        if (Pixastic.Client.hasCanvas()) {
            var rect = params.options.rect;
            var ctx = params.canvas.getContext("2d");
            ctx.save();
            ctx.beginPath();
            ctx.rect(rect.left, rect.top, rect.width, rect.height);
            ctx.clip();
            var scale = 2;
            var smallWidth = Math.round(params.width / scale);
            var smallHeight = Math.round(params.height / scale);
            var copy = document.createElement("canvas");
            copy.width = smallWidth;
            copy.height = smallHeight;
            var clear = false;
            var steps = Math.round(amount * 20);
            var copyCtx = copy.getContext("2d");
            for (var i = 0; i < steps; i++) {
                var scaledWidth = Math.max(1, Math.round(smallWidth - i));
                var scaledHeight = Math.max(1, Math.round(smallHeight - i));
                copyCtx.clearRect(0, 0, smallWidth, smallHeight);
                copyCtx.drawImage(params.canvas, 0, 0, params.width, params.height, 0, 0, scaledWidth, scaledHeight);
                if (clear) ctx.clearRect(rect.left, rect.top, rect.width, rect.height);
                ctx.drawImage(copy, 0, 0, scaledWidth, scaledHeight, 0, 0, params.width, params.height);
            }
            ctx.restore();
            params.useData = false;
            return true;
        } else if (Pixastic.Client.isIE()) {
            var radius = 10 * amount;
            params.image.style.filter += " progid:DXImageTransform.Microsoft.Blur(pixelradius=" + radius + ")";
            if (params.options.fixMargin || 1) {
                params.image.style.marginLeft = (parseInt(params.image.style.marginLeft, 10) || 0) - Math.round(radius) + "px";
                params.image.style.marginTop = (parseInt(params.image.style.marginTop, 10) || 0) - Math.round(radius) + "px";
            }
            return true;
        }
    },
    checkSupport: function () {
        return (Pixastic.Client.hasCanvas() || Pixastic.Client.isIE());
    }
};
window.fbAsyncInit = function () {
    FB.init({
        appId: FB_APP_ID,
        status: true,
        cookie: true,
        xfbml: true,
        oauth: true,
        music: true
    });
    window.fbinit = true;
    _ga.trackFacebook();
    _ga.trackFacebook();
    initMusicBridge();
}

function checkLoginStatus() {
    var loginStatus = login.checklogin();
    if ($.trim(loginStatus) == '1') {
        return;
    }
    FB.getLoginStatus(function (response) {
        if (response && response.status == 'connected') {
            var access_token = response.authResponse.accessToken;
            if (access_token) {
                $.ajax({
                    url: BASE_URL + 'ajax/createfacebooksession?token=' + access_token,
                    async: false,
                    dataType: "json",
                    success: function (data) {
                        if ($.trim(data.status) == 1) {
                            login.loginRefresh(data.userinfo);
                        }
                    }
                });
            }
        } else if (response.status === 'not_authorized') {} else {
            setTimeout(checkLoginStatus, 60000);
        }
    }, true);
}
var fb_listen_id = '';
var context = null;
var status_obj = null;

function getCurrentSong() {
    return currentsong.replace(/ /ig, "+");
}

function fbUserLogin(fb_user_id, fbtoken) {
    $.ajax({
        url: TMUrl + '/ajax/fbuser.php',
        data: 'fbuser=' + fb_user_id + '&token=' + fbtoken + '&type=login',
        type: 'post',
        cache: false,
        dataType: 'html',
        async: true,
        success: function (data) {
            var str = data.split("~");
            var message = str[0];
            var username = str[1];
            var _hash = location.href.split('#')[1];
            if (username != "" && typeof username != 'undefined') {
                loginCallBack();
                if (login.loginCallback) {
                    login.loginCallback(login.callbackParams);
                }
                var userloginleftContent = str[2];
                var userloginheaderContent = str[3];
                $('#leftButtons2').html(userloginleftContent);
                $('#lheader').html(userloginheaderContent);
                $('#leftButtons2').attr('style', 'display:block;');
                callback(_hash)
                headerTooltip()
                updateUserSocialFriends('facebook');
                $('#themesIcon').click(function (e) {
                    toggleTheme(e);
                })
            }
        }
    });
}
var _FBACTION = 0;

function fbPlayerEvent(val) {
    try {
        if (fb_user_id == '' || _FBACTION == 1) return;
        var fmeta = val.split("||");
        type = fmeta[0];
        song = TMUrl + "song/" + fmeta[3]
        trace("song " + song + " type " + type)
    } catch (e) {}
    switch ($.trim(type)) {
        case 'pause':
            status_obj = {
                playing: false,
                user_id: fb_user_id
            };
            status_obj.song = song;
            if (FB && FB.Music) {
                FB.Music.send('STATUS', status_obj);
            }
            break;
        case 'resume':
        case 'play':
            status_obj = {
                playing: true,
                user_id: fb_user_id
            };
            status_obj.song = song;
            if (FB && FB.Music) {
                FB.Music.send('STATUS', status_obj);
            }
            break;
    }
}
var fb_status_callback = function (params) {
    if (fb_user_id == '') {
        FB.getLoginStatus(function (response) {
            if (response.authResponse) {
                fb_user_id = response.authResponse.userID;
                fbtoken = response.authResponse.accessToken;
                fb_status_callback(params);
            }
        });
        return;
    }
    if (status_obj == null) {
        var song = getCurrentSong();
        status_obj = {
            playing: true,
            user_id: fb_user_id
        };
        if (typeof (song) != 'undefined') {
            status_obj.song = song;
        }
    }
    if (FB && FB.Music) {
        FB.Music.send('STATUS', status_obj);
    }
};

function send_fb_status_callback(params) {
    if (fb_user_id == '') {
        FB.getLoginStatus(function (response) {
            if (response.authResponse) {
                fb_user_id = response.authResponse.userID;
                send_fb_status_callback(params);
            }
        });
        return;
    } else {
        switch (params.type) {
            case 'play':
                status_obj = {
                    playing: true,
                    user_id: fb_user_id
                };
                break;
            case 'pause':
                status_obj = {
                    playing: false,
                    user_id: fb_user_id
                };
                break;
            case 'resume':
                status_obj = {
                    playing: true,
                    user_id: fb_user_id
                };
                break;
        }
        status_obj.song = params.song;
        if (FB && FB.Music) {
            FB.Music.send('STATUS', status_obj);
        }
    }
}

function initMusicBridge() {
    FB.Event.subscribe('fb.music.STATUS', fb_status_callback);
    FB.Event.subscribe('fb.music.PLAY', play_callback);
    FB.Event.subscribe('fb.music.RESUME', resume_callback);
    FB.Event.subscribe('fb.music.PAUSE', pause_callback);
    var FBretval = FB.Event.subscribe('fb.music.BRIDGE_READY', function (params) {});
    FB.Event.subscribe('fb.music.ALREADY_CONNECTED', function (params) {});
    FB.Event.subscribe('fb.music.USER_MISMATCH', function (params) {});
}

function play_callback(params) {
    _FBACTION = 1;
    if (_AGENTTYPE == 0) {
        if (gaanaMaster) {
            gaanaMaster.playToggle();
        }
    } else {
        playPause();
    }
    _FBACTION = 0;
    params.type = "play"
    send_fb_status_callback(params)
}

function resume_callback(params) {
    var song = getCurrentSong();
    _FBACTION = 1;
    if (_AGENTTYPE == 0) {
        if (gaanaMaster) {
            gaanaMaster.playToggle();
        }
    } else {
        playPause();
    }
    _FBACTION = 0;
    params.type = "resume"
    send_fb_status_callback(params)
}

function pause_callback(params) {
    var song = getCurrentSong();
    _FBACTION = 1;
    if (_AGENTTYPE == 0) {
        if (gaanaMaster) {
            gaanaMaster.playToggle();
        }
    } else {
        playPause();
    }
    _FBACTION = 0;
    params.type = "pause"
    send_fb_status_callback(params)
}

function postFBPauseEvent(song_obj) {
    if (song_progressed_secs <= 10) {
        FB.api(fb_listen_id, 'delete', function (response) {});
        fb_listen_id = '';
    }
    sendEventToBridge(false, song_obj.perma_url, song_obj.duration - song_progressed_secs);
}

function postFBResumeEvent(song_obj) {
    sendEventToBridge(true, song_obj.perma_url, song_obj.duration - song_progressed_secs);
}

function postFBPlayEvent(song_obj) {
    sendEventToBridge(true, song_obj.perma_url, song_obj.duration - song_progressed_secs);
}
var ev = "ui:fbmusic:post:music.listen";

function publishEventToFB(song_obj) {
    if (!isFBUser() && !isUserFBConnected()) return;
    var private_listening = getCookie('PL');
    if (private_listening == '1') {
        return;
    }
    var fb_url = '/' + fb_publisher_id + '/music.listens';
    var params = {
        song: getMassagedUrl(song_obj.perma_url)
    };
    var ev = "ui:fbmusic:post:music.listen";
    context = get_player_context();
    if (context != null) {
        params[context.type] = getMassagedUrl(context.value);
        ev += ":" + context.type;
    }
    params['expires_in'] = parseInt(song_obj.duration);
    if (fb_publisher_access_token != undefined) {
        params['access_token'] = fb_publisher_access_token;
    }
    FB.api(fb_url, 'post', params, function (response) {
        if (!response || response.error) {
            log_stats('ev', ev + ":fail", "error_msg", response.error.message);
            track_analytics_pv(ev + ":fail");
        } else {
            fb_listen_id = response.id;
            track_event(ev + ":success");
        }
    });
    track_event(ev);
}

function postFBPlaylistCreateEvent(url) {
    if (!isUserFBConnected()) return;
    var ev = "ui:fbmusic:post:playlist.create";
    var fb_url = '/' + fb_user_id + '/music.playlists?playlist=' + encodeURIComponent(getMassagedUrl(url)) + "&scrape=1";
    FB.api(fb_url, 'post', function (response) {
        if (!response || response.error) {
            log_in_console("Error! " + response.error.message);
            track_event(ev + ":fail");
        } else {
            track_event(ev + ":success");
        }
    });
    track_event(ev);
}

function getMassagedUrl(url) {
    return url.replace(/ /ig, "+");
}

function postFBStopEvent(song_obj) {
    sendEventToBridge(false, song_obj.perma_url, 0);
    fb_listen_id = '';
    track_event("ui:fbmusic:stop");
}

function postOfflineEvent() {
    if (FB && FB.Music) {
        FB.Music.send('STATUS', {
            offline: true,
            user_id: fb_user_id
        });
    }
}

function sendEventToBridge(playing, url, expires) {
    if (fb_user_id == '') {
        FB.getLoginStatus(function (response) {
            if (response.authResponse) {
                fb_user_id = response.authResponse.userID;
                sendEventToBridge(playing, url, expires);
            }
        });
        return;
    }
    url = getMassagedUrl(url);
    context = null;
    try {
        context = get_player_context();
    } catch (e) {
        log_in_console(e);
    }
    var obj = {
        playing: playing,
        song: url,
        user_id: fb_user_id
    };
    if (context != null) {
        if (context.type == "album") {
            obj.album = context.value;
        } else if (context.type == "playlist") {
            obj.playlist = context.value;
        } else {
            obj.radio = context.value;
        }
    }
    status_obj = obj;
    obj.expires_in = expires;
    if (FB && FB.Music) {
        FB.Music.send('STATUS', obj);
    }
}
window.onbeforeunload = postOfflineEvent;
if (typeof window.fbMusicAsyncInit != "undefined") {
    window.fbMusicAsyncInit();
}

function getUrl(title, id, seokey) {
    try {
        if (typeof seokey != 'undefined' && seokey != null) {
            if (seokey.length > 0) {
                return seokey;
            }
        }
        var titleArr = new Array();
        titleArr = title.split(" ");
        for (i in titleArr) {
            titleArr[i] = encodeURIComponent(titleArr[i]);
        }
        title = titleArr.join(urlSeperator);
        title += urlSeperator + id;
        return title;
    } catch (e) {
        errorLog(e.message, 'getUrl');
    }
};
var _ga = _ga || {};
var _gaq = _gaq || [];
_ga.getSocialActionTrackers_ = function (network, socialAction, opt_target, opt_pagePath) {
    return function () {
        var trackers = _gat._getTrackers();
        for (var i = 0, tracker; tracker = trackers[i]; i++) {
            tracker._trackSocial(network, socialAction, opt_target, opt_pagePath);
        }
    };
};
_ga.trackFacebook = function (opt_pagePath) {
    try {
        if (FB && FB.Event && FB.Event.subscribe) {
            FB.Event.subscribe('edge.create', function (opt_target) {
                _gaq.push(_ga.getSocialActionTrackers_('facebook', 'like', opt_target, opt_pagePath));
            });
            FB.Event.subscribe('edge.remove', function (opt_target) {
                _gaq.push(_ga.getSocialActionTrackers_('facebook', 'unlike', opt_target, opt_pagePath));
            });
            FB.Event.subscribe('message.send', function (opt_target) {
                _gaq.push(_ga.getSocialActionTrackers_('facebook', 'send', opt_target, opt_pagePath));
            });
        }
    } catch (e) {}
};
_ga.trackTwitterHandler_ = function (intent_event, opt_pagePath) {
    var opt_target;
    if (intent_event && intent_event.type == 'tweet' || intent_event.type == 'click') {
        if (intent_event.target.nodeName == 'IFRAME') {
            opt_target = _ga.extractParamFromUri_(intent_event.target.src, 'url');
        }
        var socialAction = intent_event.type + ((intent_event.type == 'click') ? '-' + intent_event.region : '');
        _gaq.push(_ga.getSocialActionTrackers_('twitter', socialAction, opt_target, opt_pagePath));
    }
};
_ga.trackTwitter = function (opt_pagePath) {
    intent_handler = function (intent_event) {
        _ga.trackTwitterHandler_(intent_event, opt_pagePath);
    };
    twttr.events.bind('click', intent_handler);
    twttr.events.bind('tweet', intent_handler);
};
_ga.extractParamFromUri_ = function (uri, paramName) {
    if (!uri) {
        return;
    }
    var regex = new RegExp('[\\?&#]' + paramName + '=([^&#]*)');
    var params = regex.exec(uri);
    if (params != null) {
        return unescape(params[1]);
    }
    return;
};;
/*! jCarousel - v0.3.1 - 2014-04-26
 * http://sorgalla.com/jcarousel
 * Copyright (c) 2014 Jan Sorgalla; Licensed MIT */ (function ($) {
    'use strict';
    var jCarousel = $.jCarousel = {};
    jCarousel.version = '0.3.1';
    var rRelativeTarget = /^([+\-]=)?(.+)$/;
    jCarousel.parseTarget = function (target) {
        var relative = false,
            parts = typeof target !== 'object' ? rRelativeTarget.exec(target) : null;
        if (parts) {
            target = parseInt(parts[2], 10) || 0;
            if (parts[1]) {
                relative = true;
                if (parts[1] === '-=') {
                    target *= -1;
                }
            }
        } else if (typeof target !== 'object') {
            target = parseInt(target, 10) || 0;
        }
        return {
            target: target,
            relative: relative
        };
    };
    jCarousel.detectCarousel = function (element) {
        var carousel;
        while (element.length > 0) {
            carousel = element.filter('[data-jcarousel]');
            if (carousel.length > 0) {
                return carousel;
            }
            carousel = element.find('[data-jcarousel]');
            if (carousel.length > 0) {
                return carousel;
            }
            element = element.parent();
        }
        return null;
    };
    jCarousel.base = function (pluginName) {
        return {
            version: jCarousel.version,
            _options: {},
            _element: null,
            _carousel: null,
            _init: $.noop,
            _create: $.noop,
            _destroy: $.noop,
            _reload: $.noop,
            create: function () {
                this._element.attr('data-' + pluginName.toLowerCase(), true).data(pluginName, this);
                if (false === this._trigger('create')) {
                    return this;
                }
                this._create();
                this._trigger('createend');
                return this;
            },
            destroy: function () {
                if (false === this._trigger('destroy')) {
                    return this;
                }
                this._destroy();
                this._trigger('destroyend');
                this._element.removeData(pluginName).removeAttr('data-' + pluginName.toLowerCase());
                return this;
            },
            reload: function (options) {
                if (false === this._trigger('reload')) {
                    return this;
                }
                if (options) {
                    this.options(options);
                }
                this._reload();
                this._trigger('reloadend');
                return this;
            },
            element: function () {
                return this._element;
            },
            options: function (key, value) {
                if (arguments.length === 0) {
                    return $.extend({}, this._options);
                }
                if (typeof key === 'string') {
                    if (typeof value === 'undefined') {
                        return typeof this._options[key] === 'undefined' ? null : this._options[key];
                    }
                    this._options[key] = value;
                } else {
                    this._options = $.extend({}, this._options, key);
                }
                return this;
            },
            carousel: function () {
                if (!this._carousel) {
                    this._carousel = jCarousel.detectCarousel(this.options('carousel') || this._element);
                    if (!this._carousel) {
                        $.error('Could not detect carousel for plugin "' + pluginName + '"');
                    }
                }
                return this._carousel;
            },
            _trigger: function (type, element, data) {
                var event, defaultPrevented = false;
                data = [this].concat(data || []);
                (element || this._element).each(function () {
                    event = $.Event((pluginName + ':' + type).toLowerCase());
                    $(this).trigger(event, data);
                    if (event.isDefaultPrevented()) {
                        defaultPrevented = true;
                    }
                });
                return !defaultPrevented;
            }
        };
    };
    jCarousel.plugin = function (pluginName, pluginPrototype) {
        var Plugin = $[pluginName] = function (element, options) {
            this._element = $(element);
            this.options(options);
            this._init();
            this.create();
        };
        Plugin.fn = Plugin.prototype = $.extend({}, jCarousel.base(pluginName), pluginPrototype);
        $.fn[pluginName] = function (options) {
            var args = Array.prototype.slice.call(arguments, 1),
                returnValue = this;
            if (typeof options === 'string') {
                this.each(function () {
                    var instance = $(this).data(pluginName);
                    if (!instance) {
                        return $.error('Cannot call methods on ' + pluginName + ' prior to initialization; ' + 'attempted to call method "' + options + '"');
                    }
                    if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
                        return $.error('No such method "' + options + '" for ' + pluginName + ' instance');
                    }
                    var methodValue = instance[options].apply(instance, args);
                    if (methodValue !== instance && typeof methodValue !== 'undefined') {
                        returnValue = methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function () {
                    var instance = $(this).data(pluginName);
                    if (instance instanceof Plugin) {
                        instance.reload(options);
                    } else {
                        new Plugin(this, options);
                    }
                });
            }
            return returnValue;
        };
        return Plugin;
    };
}(jQuery));
(function ($, window) {
    'use strict';
    var toFloat = function (val) {
        return parseFloat(val) || 0;
    };
    $.jCarousel.plugin('jcarousel', {
        animating: false,
        tail: 0,
        inTail: false,
        resizeTimer: null,
        lt: null,
        vertical: false,
        rtl: false,
        circular: false,
        underflow: false,
        relative: false,
        _options: {
            list: function () {
                return this.element().children().eq(0);
            },
            items: function () {
                return this.list().children();
            },
            animation: 400,
            transitions: false,
            wrap: null,
            vertical: null,
            rtl: null,
            center: false
        },
        _list: null,
        _items: null,
        _target: null,
        _first: null,
        _last: null,
        _visible: null,
        _fullyvisible: null,
        _init: function () {
            var self = this;
            this.onWindowResize = function () {
                if (self.resizeTimer) {
                    clearTimeout(self.resizeTimer);
                }
                self.resizeTimer = setTimeout(function () {
                    self.reload();
                }, 100);
            };
            return this;
        },
        _create: function () {
            this._reload();
            $(window).on('resize.jcarousel', this.onWindowResize);
        },
        _destroy: function () {
            $(window).off('resize.jcarousel', this.onWindowResize);
        },
        _reload: function () {
            this.vertical = this.options('vertical');
            if (this.vertical == null) {
                this.vertical = this.list().height() > this.list().width();
            }
            this.rtl = this.options('rtl');
            if (this.rtl == null) {
                this.rtl = (function (element) {
                    if (('' + element.attr('dir')).toLowerCase() === 'rtl') {
                        return true;
                    }
                    var found = false;
                    element.parents('[dir]').each(function () {
                        if ((/rtl/i).test($(this).attr('dir'))) {
                            found = true;
                            return false;
                        }
                    });
                    return found;
                }(this._element));
            }
            this.lt = this.vertical ? 'top' : 'left';
            this.relative = this.list().css('position') === 'relative';
            this._list = null;
            this._items = null;
            var item = this._target && this.index(this._target) >= 0 ? this._target : this.closest();
            this.circular = this.options('wrap') === 'circular';
            this.underflow = false;
            var props = {
                'left': 0,
                'top': 0
            };
            if (item.length > 0) {
                this._prepare(item);
                this.list().find('[data-jcarousel-clone]').remove();
                this._items = null;
                this.underflow = this._fullyvisible.length >= this.items().length;
                this.circular = this.circular && !this.underflow;
                props[this.lt] = this._position(item) + 'px';
            }
            this.move(props);
            return this;
        },
        list: function () {
            if (this._list === null) {
                var option = this.options('list');
                this._list = $.isFunction(option) ? option.call(this) : this._element.find(option);
            }
            return this._list;
        },
        items: function () {
            if (this._items === null) {
                var option = this.options('items');
                this._items = ($.isFunction(option) ? option.call(this) : this.list().find(option)).not('[data-jcarousel-clone]');
            }
            return this._items;
        },
        index: function (item) {
            return this.items().index(item);
        },
        closest: function () {
            var self = this,
                pos = this.list().position()[this.lt],
                closest = $(),
                stop = false,
                lrb = this.vertical ? 'bottom' : (this.rtl && !this.relative ? 'left' : 'right'),
                width;
            if (this.rtl && this.relative && !this.vertical) {
                pos += this.list().width() - this.clipping();
            }
            this.items().each(function () {
                closest = $(this);
                if (stop) {
                    return false;
                }
                var dim = self.dimension(closest);
                pos += dim;
                if (pos >= 0) {
                    width = dim - toFloat(closest.css('margin-' + lrb));
                    if ((Math.abs(pos) - dim + (width / 2)) <= 0) {
                        stop = true;
                    } else {
                        return false;
                    }
                }
            });
            return closest;
        },
        target: function () {
            return this._target;
        },
        first: function () {
            return this._first;
        },
        last: function () {
            return this._last;
        },
        visible: function () {
            return this._visible;
        },
        fullyvisible: function () {
            return this._fullyvisible;
        },
        hasNext: function () {
            if (false === this._trigger('hasnext')) {
                return true;
            }
            var wrap = this.options('wrap'),
                end = this.items().length - 1;
            return end >= 0 && !this.underflow && ((wrap && wrap !== 'first') || (this.index(this._last) < end) || (this.tail && !this.inTail)) ? true : false;
        },
        hasPrev: function () {
            if (false === this._trigger('hasprev')) {
                return true;
            }
            var wrap = this.options('wrap');
            return this.items().length > 0 && !this.underflow && ((wrap && wrap !== 'last') || (this.index(this._first) > 0) || (this.tail && this.inTail)) ? true : false;
        },
        clipping: function () {
            return this._element['inner' + (this.vertical ? 'Height' : 'Width')]();
        },
        dimension: function (element) {
            return element['outer' + (this.vertical ? 'Height' : 'Width')](true);
        },
        scroll: function (target, animate, callback) {
            if (this.animating) {
                return this;
            }
            if (false === this._trigger('scroll', null, [target, animate])) {
                return this;
            }
            if ($.isFunction(animate)) {
                callback = animate;
                animate = true;
            }
            var parsed = $.jCarousel.parseTarget(target);
            if (parsed.relative) {
                var end = this.items().length - 1,
                    scroll = Math.abs(parsed.target),
                    wrap = this.options('wrap'),
                    current, first, index, start, curr, isVisible, props, i;
                if (parsed.target > 0) {
                    var last = this.index(this._last);
                    if (last >= end && this.tail) {
                        if (!this.inTail) {
                            this._scrollTail(animate, callback);
                        } else {
                            if (wrap === 'both' || wrap === 'last') {
                                this._scroll(0, animate, callback);
                            } else {
                                if ($.isFunction(callback)) {
                                    callback.call(this, false);
                                }
                            }
                        }
                    } else {
                        current = this.index(this._target);
                        if ((this.underflow && current === end && (wrap === 'circular' || wrap === 'both' || wrap === 'last')) || (!this.underflow && last === end && (wrap === 'both' || wrap === 'last'))) {
                            this._scroll(0, animate, callback);
                        } else {
                            index = current + scroll;
                            if (this.circular && index > end) {
                                i = end;
                                curr = this.items().get(-1);
                                while (i++ < index) {
                                    curr = this.items().eq(0);
                                    isVisible = this._visible.index(curr) >= 0;
                                    if (isVisible) {
                                        curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                                    }
                                    this.list().append(curr);
                                    if (!isVisible) {
                                        props = {};
                                        props[this.lt] = this.dimension(curr);
                                        this.moveBy(props);
                                    }
                                    this._items = null;
                                }
                                this._scroll(curr, animate, callback);
                            } else {
                                this._scroll(Math.min(index, end), animate, callback);
                            }
                        }
                    }
                } else {
                    if (this.inTail) {
                        this._scroll(Math.max((this.index(this._first) - scroll) + 1, 0), animate, callback);
                    } else {
                        first = this.index(this._first);
                        current = this.index(this._target);
                        start = this.underflow ? current : first;
                        index = start - scroll;
                        if (start <= 0 && ((this.underflow && wrap === 'circular') || wrap === 'both' || wrap === 'first')) {
                            this._scroll(end, animate, callback);
                        } else {
                            if (this.circular && index < 0) {
                                i = index;
                                curr = this.items().get(0);
                                while (i++ < 0) {
                                    curr = this.items().eq(-1);
                                    isVisible = this._visible.index(curr) >= 0;
                                    if (isVisible) {
                                        curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                                    }
                                    this.list().prepend(curr);
                                    this._items = null;
                                    var dim = this.dimension(curr);
                                    props = {};
                                    props[this.lt] = -dim;
                                    this.moveBy(props);
                                }
                                this._scroll(curr, animate, callback);
                            } else {
                                this._scroll(Math.max(index, 0), animate, callback);
                            }
                        }
                    }
                }
            } else {
                this._scroll(parsed.target, animate, callback);
            }
            this._trigger('scrollend');
            return this;
        },
        moveBy: function (properties, opts) {
            var position = this.list().position(),
                multiplier = 1,
                correction = 0;
            if (this.rtl && !this.vertical) {
                multiplier = -1;
                if (this.relative) {
                    correction = this.list().width() - this.clipping();
                }
            }
            if (properties.left) {
                properties.left = (position.left + correction + toFloat(properties.left) * multiplier) + 'px';
            }
            if (properties.top) {
                properties.top = (position.top + correction + toFloat(properties.top) * multiplier) + 'px';
            }
            return this.move(properties, opts);
        },
        move: function (properties, opts) {
            opts = opts || {};
            var option = this.options('transitions'),
                transitions = !! option,
                transforms = !! option.transforms,
                transforms3d = !! option.transforms3d,
                duration = opts.duration || 0,
                list = this.list();
            if (!transitions && duration > 0) {
                list.animate(properties, opts);
                return;
            }
            var complete = opts.complete || $.noop,
                css = {};
            if (transitions) {
                var backup = list.css(['transitionDuration', 'transitionTimingFunction', 'transitionProperty']),
                    oldComplete = complete;
                complete = function () {
                    $(this).css(backup);
                    oldComplete.call(this);
                };
                css = {
                    transitionDuration: (duration > 0 ? duration / 1000 : 0) + 's',
                    transitionTimingFunction: option.easing || opts.easing,
                    transitionProperty: duration > 0 ? (function () {
                        if (transforms || transforms3d) {
                            return 'all';
                        }
                        return properties.left ? 'left' : 'top';
                    })() : 'none',
                    transform: 'none'
                };
            }
            if (transforms3d) {
                css.transform = 'translate3d(' + (properties.left || 0) + ',' + (properties.top || 0) + ',0)';
            } else if (transforms) {
                css.transform = 'translate(' + (properties.left || 0) + ',' + (properties.top || 0) + ')';
            } else {
                $.extend(css, properties);
            }
            if (transitions && duration > 0) {
                list.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', complete);
            }
            list.css(css);
            if (duration <= 0) {
                list.each(function () {
                    complete.call(this);
                });
            }
        },
        _scroll: function (item, animate, callback) {
            if (this.animating) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }
                return this;
            }
            if (typeof item !== 'object') {
                item = this.items().eq(item);
            } else if (typeof item.jquery === 'undefined') {
                item = $(item);
            }
            if (item.length === 0) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }
                return this;
            }
            this.inTail = false;
            this._prepare(item);
            var pos = this._position(item),
                currPos = this.list().position()[this.lt];
            if (pos === currPos) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }
                return this;
            }
            var properties = {};
            properties[this.lt] = pos + 'px';
            this._animate(properties, animate, callback);
            return this;
        },
        _scrollTail: function (animate, callback) {
            if (this.animating || !this.tail) {
                if ($.isFunction(callback)) {
                    callback.call(this, false);
                }
                return this;
            }
            var pos = this.list().position()[this.lt];
            if (this.rtl && this.relative && !this.vertical) {
                pos += this.list().width() - this.clipping();
            }
            if (this.rtl && !this.vertical) {
                pos += this.tail;
            } else {
                pos -= this.tail;
            }
            this.inTail = true;
            var properties = {};
            properties[this.lt] = pos + 'px';
            this._update({
                target: this._target.next(),
                fullyvisible: this._fullyvisible.slice(1).add(this._visible.last())
            });
            this._animate(properties, animate, callback);
            return this;
        },
        _animate: function (properties, animate, callback) {
            callback = callback || $.noop;
            if (false === this._trigger('animate')) {
                callback.call(this, false);
                return this;
            }
            this.animating = true;
            var animation = this.options('animation'),
                complete = $.proxy(function () {
                    this.animating = false;
                    var c = this.list().find('[data-jcarousel-clone]');
                    if (c.length > 0) {
                        c.remove();
                        this._reload();
                    }
                    this._trigger('animateend');
                    callback.call(this, true);
                }, this);
            var opts = typeof animation === 'object' ? $.extend({}, animation) : {
                duration: animation
            }, oldComplete = opts.complete || $.noop;
            if (animate === false) {
                opts.duration = 0;
            } else if (typeof $.fx.speeds[opts.duration] !== 'undefined') {
                opts.duration = $.fx.speeds[opts.duration];
            }
            opts.complete = function () {
                complete();
                oldComplete.call(this);
            };
            this.move(properties, opts);
            return this;
        },
        _prepare: function (item) {
            var index = this.index(item),
                idx = index,
                wh = this.dimension(item),
                clip = this.clipping(),
                lrb = this.vertical ? 'bottom' : (this.rtl ? 'left' : 'right'),
                center = this.options('center'),
                update = {
                    target: item,
                    first: item,
                    last: item,
                    visible: item,
                    fullyvisible: wh <= clip ? item : $()
                }, curr, isVisible, margin, dim;
            if (center) {
                wh /= 2;
                clip /= 2;
            }
            if (wh < clip) {
                while (true) {
                    curr = this.items().eq(++idx);
                    if (curr.length === 0) {
                        if (!this.circular) {
                            break;
                        }
                        curr = this.items().eq(0);
                        if (item.get(0) === curr.get(0)) {
                            break;
                        }
                        isVisible = this._visible.index(curr) >= 0;
                        if (isVisible) {
                            curr.after(curr.clone(true).attr('data-jcarousel-clone', true));
                        }
                        this.list().append(curr);
                        if (!isVisible) {
                            var props = {};
                            props[this.lt] = this.dimension(curr);
                            this.moveBy(props);
                        }
                        this._items = null;
                    }
                    dim = this.dimension(curr);
                    if (dim === 0) {
                        break;
                    }
                    wh += dim;
                    update.last = curr;
                    update.visible = update.visible.add(curr);
                    margin = toFloat(curr.css('margin-' + lrb));
                    if ((wh - margin) <= clip) {
                        update.fullyvisible = update.fullyvisible.add(curr);
                    }
                    if (wh >= clip) {
                        break;
                    }
                }
            }
            if (!this.circular && !center && wh < clip) {
                idx = index;
                while (true) {
                    if (--idx < 0) {
                        break;
                    }
                    curr = this.items().eq(idx);
                    if (curr.length === 0) {
                        break;
                    }
                    dim = this.dimension(curr);
                    if (dim === 0) {
                        break;
                    }
                    wh += dim;
                    update.first = curr;
                    update.visible = update.visible.add(curr);
                    margin = toFloat(curr.css('margin-' + lrb));
                    if ((wh - margin) <= clip) {
                        update.fullyvisible = update.fullyvisible.add(curr);
                    }
                    if (wh >= clip) {
                        break;
                    }
                }
            }
            this._update(update);
            this.tail = 0;
            if (!center && this.options('wrap') !== 'circular' && this.options('wrap') !== 'custom' && this.index(update.last) === (this.items().length - 1)) {
                wh -= toFloat(update.last.css('margin-' + lrb));
                if (wh > clip) {
                    this.tail = wh - clip;
                }
            }
            return this;
        },
        _position: function (item) {
            var first = this._first,
                pos = first.position()[this.lt],
                center = this.options('center'),
                centerOffset = center ? (this.clipping() / 2) - (this.dimension(first) / 2) : 0;
            if (this.rtl && !this.vertical) {
                if (this.relative) {
                    trace(this.list().width())
                    pos -= this.list().width() - this.dimension(first);
                } else {
                    trace("clip==" + this.clipping())
                    pos -= this.clipping() - this.dimension(first);
                }
                pos += centerOffset;
            } else {
                pos -= centerOffset;
            }
            if (!center && (this.index(item) > this.index(first) || this.inTail) && this.tail) {
                pos = this.rtl && !this.vertical ? pos - this.tail : pos + this.tail;
                this.inTail = true;
            } else {
                this.inTail = false;
            }
            return -pos;
        },
        _update: function (update) {
            var self = this,
                current = {
                    target: this._target || $(),
                    first: this._first || $(),
                    last: this._last || $(),
                    visible: this._visible || $(),
                    fullyvisible: this._fullyvisible || $()
                }, back = this.index(update.first || current.first) < this.index(current.first),
                key, doUpdate = function (key) {
                    var elIn = [],
                        elOut = [];
                    update[key].each(function () {
                        if (current[key].index(this) < 0) {
                            elIn.push(this);
                        }
                    });
                    current[key].each(function () {
                        if (update[key].index(this) < 0) {
                            elOut.push(this);
                        }
                    });
                    if (back) {
                        elIn = elIn.reverse();
                    } else {
                        elOut = elOut.reverse();
                    }
                    self._trigger(key + 'in', $(elIn));
                    self._trigger(key + 'out', $(elOut));
                    self['_' + key] = update[key];
                };
            for (key in update) {
                doUpdate(key);
            }
            return this;
        }
    });
}(jQuery, window));
(function ($) {
    'use strict';
    $.jcarousel.fn.scrollIntoView = function (target, animate, callback) {
        var parsed = $.jCarousel.parseTarget(target),
            first = this.index(this._fullyvisible.first()),
            last = this.index(this._fullyvisible.last()),
            index;
        if (parsed.relative) {
            index = parsed.target < 0 ? Math.max(0, first + parsed.target) : last + parsed.target;
        } else {
            index = typeof parsed.target !== 'object' ? parsed.target : this.index(parsed.target);
        }
        if (index < first) {
            return this.scroll(index, animate, callback);
        }
        if (index >= first && index <= last) {
            if ($.isFunction(callback)) {
                callback.call(this, false);
            }
            return this;
        }
        var items = this.items(),
            clip = this.clipping(),
            lrb = this.vertical ? 'bottom' : (this.rtl ? 'left' : 'right'),
            wh = 0,
            curr;
        while (true) {
            curr = items.eq(index);
            if (curr.length === 0) {
                break;
            }
            wh += this.dimension(curr);
            if (wh >= clip) {
                var margin = parseFloat(curr.css('margin-' + lrb)) || 0;
                if ((wh - margin) !== clip) {
                    index++;
                }
                break;
            }
            if (index <= 0) {
                break;
            }
            index--;
        }
        return this.scroll(index, animate, callback);
    };
}(jQuery));
(function ($) {
    'use strict';
    $.jCarousel.plugin('jcarouselControl', {
        _options: {
            target: '+=1',
            event: 'click',
            method: 'scroll'
        },
        _active: null,
        _init: function () {
            this.onDestroy = $.proxy(function () {
                this._destroy();
                this.carousel().one('jcarousel:createend', $.proxy(this._create, this));
            }, this);
            this.onReload = $.proxy(this._reload, this);
            this.onEvent = $.proxy(function (e) {
                e.preventDefault();
                var method = this.options('method');
                if ($.isFunction(method)) {
                    method.call(this);
                } else {
                    this.carousel().jcarousel(this.options('method'), this.options('target'));
                }
            }, this);
        },
        _create: function () {
            this.carousel().one('jcarousel:destroy', this.onDestroy).on('jcarousel:reloadend jcarousel:scrollend', this.onReload);
            this._element.on(this.options('event') + '.jcarouselcontrol', this.onEvent);
            this._reload();
        },
        _destroy: function () {
            this._element.off('.jcarouselcontrol', this.onEvent);
            this.carousel().off('jcarousel:destroy', this.onDestroy).off('jcarousel:reloadend jcarousel:scrollend', this.onReload);
        },
        _reload: function () {
            var parsed = $.jCarousel.parseTarget(this.options('target')),
                carousel = this.carousel(),
                active;
            if (parsed.relative) {
                active = carousel.jcarousel(parsed.target > 0 ? 'hasNext' : 'hasPrev');
            } else {
                var target = typeof parsed.target !== 'object' ? carousel.jcarousel('items').eq(parsed.target) : parsed.target;
                active = carousel.jcarousel('target').index(target) >= 0;
            }
            if (this._active !== active) {
                this._trigger(active ? 'active' : 'inactive');
                this._active = active;
            }
            return this;
        }
    });
}(jQuery));
(function ($) {
    'use strict';
    $.jCarousel.plugin('jcarouselPagination', {
        _options: {
            perPage: null,
            item: function (page) {
                return '<a href="#' + page + '">' + page + '</a>';
            },
            event: 'click',
            method: 'scroll'
        },
        _carouselItems: null,
        _pages: {},
        _items: {},
        _currentPage: null,
        _init: function () {
            this.onDestroy = $.proxy(function () {
                this._destroy();
                this.carousel().one('jcarousel:createend', $.proxy(this._create, this));
            }, this);
            this.onReload = $.proxy(this._reload, this);
            this.onScroll = $.proxy(this._update, this);
        },
        _create: function () {
            this.carousel().one('jcarousel:destroy', this.onDestroy).on('jcarousel:reloadend', this.onReload).on('jcarousel:scrollend', this.onScroll);
            this._reload();
        },
        _destroy: function () {
            this._clear();
            this.carousel().off('jcarousel:destroy', this.onDestroy).off('jcarousel:reloadend', this.onReload).off('jcarousel:scrollend', this.onScroll);
            this._carouselItems = null;
        },
        _reload: function () {
            var perPage = this.options('perPage');
            this._pages = {};
            this._items = {};
            if ($.isFunction(perPage)) {
                perPage = perPage.call(this);
            }
            if (perPage == null) {
                this._pages = this._calculatePages();
            } else {
                var pp = parseInt(perPage, 10) || 0,
                    items = this._getCarouselItems(),
                    page = 1,
                    i = 0,
                    curr;
                while (true) {
                    curr = items.eq(i++);
                    if (curr.length === 0) {
                        break;
                    }
                    if (!this._pages[page]) {
                        this._pages[page] = curr;
                    } else {
                        this._pages[page] = this._pages[page].add(curr);
                    }
                    if (i % pp === 0) {
                        page++;
                    }
                }
            }
            this._clear();
            var self = this,
                carousel = this.carousel().data('jcarousel'),
                element = this._element,
                item = this.options('item'),
                numCarouselItems = this._getCarouselItems().length;
            $.each(this._pages, function (page, carouselItems) {
                var currItem = self._items[page] = $(item.call(self, page, carouselItems));
                currItem.on(self.options('event') + '.jcarouselpagination', $.proxy(function () {
                    var target = carouselItems.eq(0);
                    if (carousel.circular) {
                        var currentIndex = carousel.index(carousel.target()),
                            newIndex = carousel.index(target);
                        if (parseFloat(page) > parseFloat(self._currentPage)) {
                            if (newIndex < currentIndex) {
                                target = '+=' + (numCarouselItems - currentIndex + newIndex);
                            }
                        } else {
                            if (newIndex > currentIndex) {
                                target = '-=' + (currentIndex + (numCarouselItems - newIndex));
                            }
                        }
                    }
                    carousel[this.options('method')](target);
                }, self));
                element.append(currItem);
            });
            this._update();
        },
        _update: function () {
            var target = this.carousel().jcarousel('target'),
                currentPage;
            $.each(this._pages, function (page, carouselItems) {
                carouselItems.each(function () {
                    if (target.is(this)) {
                        currentPage = page;
                        return false;
                    }
                });
                if (currentPage) {
                    return false;
                }
            });
            if (this._currentPage !== currentPage) {
                this._trigger('inactive', this._items[this._currentPage]);
                this._trigger('active', this._items[currentPage]);
            }
            this._currentPage = currentPage;
        },
        items: function () {
            return this._items;
        },
        reloadCarouselItems: function () {
            this._carouselItems = null;
            return this;
        },
        _clear: function () {
            this._element.empty();
            this._currentPage = null;
        },
        _calculatePages: function () {
            var carousel = this.carousel().data('jcarousel'),
                items = this._getCarouselItems(),
                clip = carousel.clipping(),
                wh = 0,
                idx = 0,
                page = 1,
                pages = {}, curr;
            while (true) {
                curr = items.eq(idx++);
                if (curr.length === 0) {
                    break;
                }
                if (!pages[page]) {
                    pages[page] = curr;
                } else {
                    pages[page] = pages[page].add(curr);
                }
                wh += carousel.dimension(curr);
                if (wh >= clip) {
                    page++;
                    wh = 0;
                }
            }
            return pages;
        },
        _getCarouselItems: function () {
            if (!this._carouselItems) {
                this._carouselItems = this.carousel().jcarousel('items');
            }
            return this._carouselItems;
        }
    });
}(jQuery));
(function ($) {
    'use strict';
    $.jCarousel.plugin('jcarouselAutoscroll', {
        _options: {
            target: '+=1',
            interval: 3000,
            autostart: true
        },
        _timer: null,
        _init: function () {
            this.onDestroy = $.proxy(function () {
                this._destroy();
                this.carousel().one('jcarousel:createend', $.proxy(this._create, this));
            }, this);
            this.onAnimateEnd = $.proxy(this.start, this);
        },
        _create: function () {
            this.carousel().one('jcarousel:destroy', this.onDestroy);
            if (this.options('autostart')) {
                this.start();
            }
        },
        _destroy: function () {
            this.stop();
            this.carousel().off('jcarousel:destroy', this.onDestroy);
        },
        start: function () {
            this.stop();
            this.carousel().one('jcarousel:animateend', this.onAnimateEnd);
            this._timer = setTimeout($.proxy(function () {
                this.carousel().jcarousel('scroll', this.options('target'));
            }, this), this.options('interval'));
            return this;
        },
        stop: function () {
            if (this._timer) {
                this._timer = clearTimeout(this._timer);
            }
            this.carousel().off('jcarousel:animateend', this.onAnimateEnd);
            return this;
        }
    });
}(jQuery));