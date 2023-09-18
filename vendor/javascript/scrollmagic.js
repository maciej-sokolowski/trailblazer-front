var e="undefined"!==typeof globalThis?globalThis:"undefined"!==typeof self?self:global;var t={};
/*!
 * ScrollMagic v2.0.8 (2020-08-14)
 * The javascript library for magical scroll interactions.
 * (c) 2020 Jan Paepke (@janpaepke)
 * Project Website: http://scrollmagic.io
 * 
 * @version 2.0.8
 * @license Dual licensed under MIT license and GPL.
 * @author Jan Paepke - e-mail@janpaepke.de
 *
 * @file ScrollMagic main library.
 */(function(e,n){t=n()})(t,(function(){var ScrollMagic=function(){i.log(2,"(COMPATIBILITY NOTICE) -> As of ScrollMagic 2.0.0 you need to use 'new ScrollMagic.Controller()' to create a new controller instance. Use 'new ScrollMagic.Scene()' to instance a scene.")};ScrollMagic.version="2.0.8";"undefined"!==typeof window&&window.addEventListener("mousewheel",void 0);var t="data-scrollmagic-pin-spacer";
/**
   * The main class that is needed once per scroll container.
   *
   * @class
   *
   * @example
   * // basic initialization
   * var controller = new ScrollMagic.Controller();
   *
   * // passing options
   * var controller = new ScrollMagic.Controller({container: "#myContainer", loglevel: 3});
   *
   * @param {object} [options] - An object containing one or more options for the controller.
   * @param {(string|object)} [options.container=window] - A selector, DOM object that references the main container for scrolling.
   * @param {boolean} [options.vertical=true] - Sets the scroll mode to vertical (`true`) or horizontal (`false`) scrolling.
   * @param {object} [options.globalSceneOptions={}] - These options will be passed to every Scene that is added to the controller using the addScene method. For more information on Scene options see {@link ScrollMagic.Scene}.
   * @param {number} [options.loglevel=2] Loglevel for debugging. Note that logging is disabled in the minified version of ScrollMagic.
  										 ** `0` => silent
  										 ** `1` => errors
  										 ** `2` => errors, warnings
  										 ** `3` => errors, warnings, debuginfo
   * @param {boolean} [options.refreshInterval=100] - Some changes don't call events by default, like changing the container size or moving a scene trigger element.  
   																										 This interval polls these parameters to fire the necessary events.  
   																										 If you don't use custom containers, trigger elements or have static layouts, where the positions of the trigger elements don't change, you can set this to 0 disable interval checking and improve performance.
   *
   */ScrollMagic.Controller=function(r){var o="ScrollMagic.Controller",l="FORWARD",a="REVERSE",s="PAUSED",c=n.defaults;var u=this||e,f=i.extend({},c,r),d=[],g=false,p=0,h=s,v=true,m=0,w=true,y,S;var construct=function(){for(var e in f)if(!c.hasOwnProperty(e)){b(2,'WARNING: Unknown option "'+e+'"');delete f[e]}f.container=i.get.elements(f.container)[0];if(!f.container){b(1,"ERROR creating object "+o+": No valid scroll container supplied");throw o+" init failed."}v=f.container===window||f.container===document.body||!document.body.contains(f.container);v&&(f.container=window);m=getViewportSize();f.container.addEventListener("resize",onChange);f.container.addEventListener("scroll",onChange);var t=parseInt(f.refreshInterval,10);f.refreshInterval=i.type.Number(t)?t:c.refreshInterval;scheduleRefresh();b(3,"added new "+o+" controller (v"+ScrollMagic.version+")")};var scheduleRefresh=function(){f.refreshInterval>0&&(S=window.setTimeout(refresh,f.refreshInterval))};var getScrollPos=function(){return f.vertical?i.get.scrollTop(f.container):i.get.scrollLeft(f.container)};var getViewportSize=function(){return f.vertical?i.get.height(f.container):i.get.width(f.container)};var E=(this||e)._setScrollPos=function(e){f.vertical?v?window.scrollTo(i.get.scrollLeft(),e):f.container.scrollTop=e:v?window.scrollTo(e,i.get.scrollTop()):f.container.scrollLeft=e};var updateScenes=function(){if(w&&g){var e=i.type.Array(g)?g:d.slice(0);g=false;var t=p;p=u.scrollPos();var n=p-t;0!==n&&(h=n>0?l:a);h===a&&e.reverse();e.forEach((function(t,n){b(3,"updating Scene "+(n+1)+"/"+e.length+" ("+d.length+" total)");t.update(true)}));0===e.length&&f.loglevel>=3&&b(3,"updating 0 Scenes (nothing added to controller)")}};var debounceUpdate=function(){y=i.rAF(updateScenes)};var onChange=function(e){b(3,"event fired causing an update:",e.type);if("resize"==e.type){m=getViewportSize();h=s}if(true!==g){g=true;debounceUpdate()}};var refresh=function(){if(!v&&m!=getViewportSize()){var e;try{e=new Event("resize",{bubbles:false,cancelable:false})}catch(t){e=document.createEvent("Event");e.initEvent("resize",false,false)}f.container.dispatchEvent(e)}d.forEach((function(e,t){e.refresh()}));scheduleRefresh()};
/**
     * Send a debug message to the console.
     * provided publicly with _log for plugins
     * @private
     *
     * @param {number} loglevel - The loglevel required to initiate output for the message.
     * @param {...mixed} output - One or more variables that should be passed to the console.
     */var b=(this||e)._log=function(e,t){if(f.loglevel>=e){Array.prototype.splice.call(arguments,1,0,"("+o+") ->");i.log.apply(window,arguments)}};(this||e)._options=f;
/**
     * Sort scenes in ascending order of their start offset.
     * @private
     *
     * @param {array} ScenesArray - an array of ScrollMagic Scenes that should be sorted
     * @return {array} The sorted array of Scenes.
     */var sortScenes=function(e){if(e.length<=1)return e;var t=e.slice(0);t.sort((function(e,t){return e.scrollOffset()>t.scrollOffset()?1:-1}));return t};
/**
     * Add one ore more scene(s) to the controller.  
     * This is the equivalent to `Scene.addTo(controller)`.
     * @public
     * @example
     * // with a previously defined scene
     * controller.addScene(scene);
     *
     * // with a newly created scene.
     * controller.addScene(new ScrollMagic.Scene({duration : 0}));
     *
     * // adding multiple scenes
     * controller.addScene([scene, scene2, new ScrollMagic.Scene({duration : 0})]);
     *
     * @param {(ScrollMagic.Scene|array)} newScene - ScrollMagic Scene or Array of Scenes to be added to the controller.
     * @return {Controller} Parent object for chaining.
     */(this||e).addScene=function(e){if(i.type.Array(e))e.forEach((function(e,t){u.addScene(e)}));else if(e instanceof ScrollMagic.Scene){if(e.controller()!==u)e.addTo(u);else if(d.indexOf(e)<0){d.push(e);d=sortScenes(d);e.on("shift.controller_sort",(function(){d=sortScenes(d)}));for(var t in f.globalSceneOptions)e[t]&&e[t].call(e,f.globalSceneOptions[t]);b(3,"adding Scene (now "+d.length+" total)")}}else b(1,"ERROR: invalid argument supplied for '.addScene()'");return u};
/**
     * Remove one ore more scene(s) from the controller.  
     * This is the equivalent to `Scene.remove()`.
     * @public
     * @example
     * // remove a scene from the controller
     * controller.removeScene(scene);
     *
     * // remove multiple scenes from the controller
     * controller.removeScene([scene, scene2, scene3]);
     *
     * @param {(ScrollMagic.Scene|array)} Scene - ScrollMagic Scene or Array of Scenes to be removed from the controller.
     * @returns {Controller} Parent object for chaining.
     */(this||e).removeScene=function(e){if(i.type.Array(e))e.forEach((function(e,t){u.removeScene(e)}));else{var t=d.indexOf(e);if(t>-1){e.off("shift.controller_sort");d.splice(t,1);b(3,"removing Scene (now "+d.length+" left)");e.remove()}}return u};
/**
    * Update one ore more scene(s) according to the scroll position of the container.  
    * This is the equivalent to `Scene.update()`.  
    * The update method calculates the scene's start and end position (based on the trigger element, trigger hook, duration and offset) and checks it against the current scroll position of the container.  
    * It then updates the current scene state accordingly (or does nothing, if the state is already correct) – Pins will be set to their correct position and tweens will be updated to their correct progress.  
    * _**Note:** This method gets called constantly whenever Controller detects a change. The only application for you is if you change something outside of the realm of ScrollMagic, like moving the trigger or changing tween parameters._
    * @public
    * @example
    * // update a specific scene on next cycle
     * controller.updateScene(scene);
     *
    * // update a specific scene immediately
    * controller.updateScene(scene, true);
     *
    * // update multiple scenes scene on next cycle
    * controller.updateScene([scene1, scene2, scene3]);
    *
    * @param {ScrollMagic.Scene} Scene - ScrollMagic Scene or Array of Scenes that is/are supposed to be updated.
    * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle.  
    										  This is useful when changing multiple properties of the scene - this way it will only be updated once all new properties are set (updateScenes).
    * @return {Controller} Parent object for chaining.
    */(this||e).updateScene=function(e,t){if(i.type.Array(e))e.forEach((function(e,n){u.updateScene(e,t)}));else if(t)e.update(true);else if(true!==g&&e instanceof ScrollMagic.Scene){g=g||[];-1==g.indexOf(e)&&g.push(e);g=sortScenes(g);debounceUpdate()}return u};
/**
     * Updates the controller params and calls updateScene on every scene, that is attached to the controller.  
     * See `Controller.updateScene()` for more information about what this means.  
     * In most cases you will not need this function, as it is called constantly, whenever ScrollMagic detects a state change event, like resize or scroll.  
     * The only application for this method is when ScrollMagic fails to detect these events.  
     * One application is with some external scroll libraries (like iScroll) that move an internal container to a negative offset instead of actually scrolling. In this case the update on the controller needs to be called whenever the child container's position changes.
     * For this case there will also be the need to provide a custom function to calculate the correct scroll position. See `Controller.scrollPos()` for details.
     * @public
     * @example
     * // update the controller on next cycle (saves performance due to elimination of redundant updates)
     * controller.update();
     *
     * // update the controller immediately
     * controller.update(true);
     *
     * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle (better performance)
     * @return {Controller} Parent object for chaining.
     */(this||e).update=function(e){onChange({type:"resize"});e&&updateScenes();return u};
/**
     * Scroll to a numeric scroll offset, a DOM element, the start of a scene or provide an alternate method for scrolling.  
     * For vertical controllers it will change the top scroll offset and for horizontal applications it will change the left offset.
     * @public
     *
     * @since 1.1.0
     * @example
     * // scroll to an offset of 100
     * controller.scrollTo(100);
     *
     * // scroll to a DOM element
     * controller.scrollTo("#anchor");
     *
     * // scroll to the beginning of a scene
     * var scene = new ScrollMagic.Scene({offset: 200});
     * controller.scrollTo(scene);
     *
     * // define a new scroll position modification function (jQuery animate instead of jump)
     * controller.scrollTo(function (newScrollPos) {
     *	$("html, body").animate({scrollTop: newScrollPos});
     * });
     * controller.scrollTo(100); // call as usual, but the new function will be used instead
     *
     * // define a new scroll function with an additional parameter
     * controller.scrollTo(function (newScrollPos, message) {
     *  console.log(message);
     *	$(this).animate({scrollTop: newScrollPos});
     * });
     * // call as usual, but supply an extra parameter to the defined custom function
     * controller.scrollTo(100, "my message");
     *
     * // define a new scroll function with an additional parameter containing multiple variables
     * controller.scrollTo(function (newScrollPos, options) {
     *  someGlobalVar = options.a + options.b;
     *	$(this).animate({scrollTop: newScrollPos});
     * });
     * // call as usual, but supply an extra parameter containing multiple options
     * controller.scrollTo(100, {a: 1, b: 2});
     *
     * // define a new scroll function with a callback supplied as an additional parameter
     * controller.scrollTo(function (newScrollPos, callback) {
     *	$(this).animate({scrollTop: newScrollPos}, 400, "swing", callback);
     * });
     * // call as usual, but supply an extra parameter, which is used as a callback in the previously defined custom scroll function
     * controller.scrollTo(100, function() {
     *	console.log("scroll has finished.");
     * });
     *
     * @param {mixed} scrollTarget - The supplied argument can be one of these types:
     * 1. `number` -> The container will scroll to this new scroll offset.
     * 2. `string` or `object` -> Can be a selector or a DOM object.  
     *  The container will scroll to the position of this element.
     * 3. `ScrollMagic Scene` -> The container will scroll to the start of this scene.
     * 4. `function` -> This function will be used for future scroll position modifications.  
     *  This provides a way for you to change the behaviour of scrolling and adding new behaviour like animation. The function receives the new scroll position as a parameter and a reference to the container element using `this`.  
     *  It may also optionally receive an optional additional parameter (see below)  
     *  _**NOTE:**  
     *  All other options will still work as expected, using the new function to scroll._
     * @param {mixed} [additionalParameter] - If a custom scroll function was defined (see above 4.), you may want to supply additional parameters to it, when calling it. You can do this using this parameter – see examples for details. Please note, that this parameter will have no effect, if you use the default scrolling function.
     * @returns {Controller} Parent object for chaining.
     */(this||e).scrollTo=function(e,n){if(i.type.Number(e))E.call(f.container,e,n);else if(e instanceof ScrollMagic.Scene)e.controller()===u?u.scrollTo(e.scrollOffset(),n):b(2,"scrollTo(): The supplied scene does not belong to this controller. Scroll cancelled.",e);else if(i.type.Function(e))E=e;else{var r=i.get.elements(e)[0];if(r){while(r.parentNode.hasAttribute(t))r=r.parentNode;var o=f.vertical?"top":"left",l=i.get.offset(f.container),a=i.get.offset(r);v||(l[o]-=u.scrollPos());u.scrollTo(a[o]-l[o],n)}else b(2,"scrollTo(): The supplied argument is invalid. Scroll cancelled.",e)}return u};
/**
     * **Get** the current scrollPosition or **Set** a new method to calculate it.  
     * -> **GET**:
     * When used as a getter this function will return the current scroll position.  
     * To get a cached value use Controller.info("scrollPos"), which will be updated in the update cycle.  
     * For vertical controllers it will return the top scroll offset and for horizontal applications it will return the left offset.
     *
     * -> **SET**:
     * When used as a setter this method prodes a way to permanently overwrite the controller's scroll position calculation.  
     * A typical usecase is when the scroll position is not reflected by the containers scrollTop or scrollLeft values, but for example by the inner offset of a child container.  
     * Moving a child container inside a parent is a commonly used method for several scrolling frameworks, including iScroll.  
     * By providing an alternate calculation function you can make sure ScrollMagic receives the correct scroll position.  
     * Please also bear in mind that your function should return y values for vertical scrolls an x for horizontals.
     *
     * To change the current scroll position please use `Controller.scrollTo()`.
     * @public
     *
     * @example
     * // get the current scroll Position
     * var scrollPos = controller.scrollPos();
     *
     * // set a new scroll position calculation method
     * controller.scrollPos(function () {
     *	return this.info("vertical") ? -mychildcontainer.y : -mychildcontainer.x
     * });
     *
     * @param {function} [scrollPosMethod] - The function to be used for the scroll position calculation of the container.
     * @returns {(number|Controller)} Current scroll position or parent object for chaining.
     */(this||e).scrollPos=function(e){if(!arguments.length)return getScrollPos.call(u);i.type.Function(e)?getScrollPos=e:b(2,"Provided value for method 'scrollPos' is not a function. To change the current scroll position use 'scrollTo()'.");return u};
/**
     * **Get** all infos or one in particular about the controller.
     * @public
     * @example
     * // returns the current scroll position (number)
     * var scrollPos = controller.info("scrollPos");
     *
     * // returns all infos as an object
     * var infos = controller.info();
     *
     * @param {string} [about] - If passed only this info will be returned instead of an object containing all.  
     							 Valid options are:
     							 ** `"size"` => the current viewport size of the container
     							 ** `"vertical"` => true if vertical scrolling, otherwise false
     							 ** `"scrollPos"` => the current scroll position
     							 ** `"scrollDirection"` => the last known direction of the scroll
     							 ** `"container"` => the container element
     							 ** `"isDocument"` => true if container element is the document.
     * @returns {(mixed|object)} The requested info(s).
     */(this||e).info=function(e){var t={size:m,vertical:f.vertical,scrollPos:p,scrollDirection:h,container:f.container,isDocument:v};if(!arguments.length)return t;if(void 0!==t[e])return t[e];b(1,'ERROR: option "'+e+'" is not available')};
/**
     * **Get** or **Set** the current loglevel option value.
     * @public
     *
     * @example
     * // get the current value
     * var loglevel = controller.loglevel();
     *
     * // set a new value
     * controller.loglevel(3);
     *
     * @param {number} [newLoglevel] - The new loglevel setting of the Controller. `[0-3]`
     * @returns {(number|Controller)} Current loglevel or parent object for chaining.
     */(this||e).loglevel=function(e){if(!arguments.length)return f.loglevel;f.loglevel!=e&&(f.loglevel=e);return u};
/**
     * **Get** or **Set** the current enabled state of the controller.  
     * This can be used to disable all Scenes connected to the controller without destroying or removing them.
     * @public
     *
     * @example
     * // get the current value
     * var enabled = controller.enabled();
     *
     * // disable the controller
     * controller.enabled(false);
     *
     * @param {boolean} [newState] - The new enabled state of the controller `true` or `false`.
     * @returns {(boolean|Controller)} Current enabled state or parent object for chaining.
     */(this||e).enabled=function(e){if(!arguments.length)return w;if(w!=e){w=!!e;u.updateScene(d,true)}return u};
/**
     * Destroy the Controller, all Scenes and everything.
     * @public
     *
     * @example
     * // without resetting the scenes
     * controller = controller.destroy();
     *
     * // with scene reset
     * controller = controller.destroy(true);
     *
     * @param {boolean} [resetScenes=false] - If `true` the pins and tweens (if existent) of all scenes will be reset.
     * @returns {null} Null to unset handler variables.
     */(this||e).destroy=function(e){window.clearTimeout(S);var t=d.length;while(t--)d[t].destroy(e);f.container.removeEventListener("resize",onChange);f.container.removeEventListener("scroll",onChange);i.cAF(y);b(3,"destroyed "+o+" (reset: "+(e?"true":"false")+")");return null};construct();return u};var n={defaults:{container:window,vertical:true,globalSceneOptions:{},loglevel:2,refreshInterval:100}};ScrollMagic.Controller.addOption=function(e,t){n.defaults[e]=t};ScrollMagic.Controller.extend=function(t){var n=this||e;ScrollMagic.Controller=function(){n.apply(this||e,arguments);(this||e).$super=i.extend({},this||e);return t.apply(this||e,arguments)||this||e};i.extend(ScrollMagic.Controller,n);ScrollMagic.Controller.prototype=n.prototype;ScrollMagic.Controller.prototype.constructor=ScrollMagic.Controller};
/**
   * A Scene defines where the controller should react and how.
   *
   * @class
   *
   * @example
   * // create a standard scene and add it to a controller
   * new ScrollMagic.Scene()
   *		.addTo(controller);
   *
   * // create a scene with custom options and assign a handler to it.
   * var scene = new ScrollMagic.Scene({
   * 		duration: 100,
   *		offset: 200,
   *		triggerHook: "onEnter",
   *		reverse: false
   * });
   *
   * @param {object} [options] - Options for the Scene. The options can be updated at any time.  
   							   Instead of setting the options for each scene individually you can also set them globally in the controller as the controllers `globalSceneOptions` option. The object accepts the same properties as the ones below.  
   							   When a scene is added to the controller the options defined using the Scene constructor will be overwritten by those set in `globalSceneOptions`.
   * @param {(number|string|function)} [options.duration=0] - The duration of the scene. 
   					Please see `Scene.duration()` for details.
   * @param {number} [options.offset=0] - Offset Value for the Trigger Position. If no triggerElement is defined this will be the scroll distance from the start of the page, after which the scene will start.
   * @param {(string|object)} [options.triggerElement=null] - Selector or DOM object that defines the start of the scene. If undefined the scene will start right at the start of the page (unless an offset is set).
   * @param {(number|string)} [options.triggerHook="onCenter"] - Can be a number between 0 and 1 defining the position of the trigger Hook in relation to the viewport.  
   															  Can also be defined using a string:
   															  ** `"onEnter"` => `1`
   															  ** `"onCenter"` => `0.5`
   															  ** `"onLeave"` => `0`
   * @param {boolean} [options.reverse=true] - Should the scene reverse, when scrolling up?
   * @param {number} [options.loglevel=2] - Loglevel for debugging. Note that logging is disabled in the minified version of ScrollMagic.
   										  ** `0` => silent
   										  ** `1` => errors
   										  ** `2` => errors, warnings
   										  ** `3` => errors, warnings, debuginfo
   * 
   */ScrollMagic.Scene=function(n){var o="ScrollMagic.Scene",l="BEFORE",a="DURING",s="AFTER",c=r.defaults;var u=this||e,f=i.extend({},c,n),d=l,g=0,p={start:0,end:0},h=0,v=true,m,w;var construct=function(){for(var e in f)if(!c.hasOwnProperty(e)){S(2,'WARNING: Unknown option "'+e+'"');delete f[e]}for(var t in c)addSceneOption(t);validateOption()};var y={};
/**
     * Add one ore more event listener.  
     * The callback function will be fired at the respective event, and an object containing relevant data will be passed to the callback.
     * @method ScrollMagic.Scene#on
     *
     * @example
     * function callback (event) {
     * 		console.log("Event fired! (" + event.type + ")");
     * }
     * // add listeners
     * scene.on("change update progress start end enter leave", callback);
     *
     * @param {string} names - The name or names of the event the callback should be attached to.
     * @param {function} callback - A function that should be executed, when the event is dispatched. An event object will be passed to the callback.
     * @returns {Scene} Parent object for chaining.
     */(this||e).on=function(e,t){if(i.type.Function(t)){e=e.trim().split(" ");e.forEach((function(e){var n=e.split("."),r=n[0],i=n[1];if("*"!=r){y[r]||(y[r]=[]);y[r].push({namespace:i||"",callback:t})}}))}else S(1,"ERROR when calling '.on()': Supplied callback for '"+e+"' is not a valid function!");return u};
/**
     * Remove one or more event listener.
     * @method ScrollMagic.Scene#off
     *
     * @example
     * function callback (event) {
     * 		console.log("Event fired! (" + event.type + ")");
     * }
     * // add listeners
     * scene.on("change update", callback);
     * // remove listeners
     * scene.off("change update", callback);
     *
     * @param {string} names - The name or names of the event that should be removed.
     * @param {function} [callback] - A specific callback function that should be removed. If none is passed all callbacks to the event listener will be removed.
     * @returns {Scene} Parent object for chaining.
     */(this||e).off=function(e,t){if(!e){S(1,"ERROR: Invalid event name supplied.");return u}e=e.trim().split(" ");e.forEach((function(e,n){var r=e.split("."),i=r[0],o=r[1]||"",l="*"===i?Object.keys(y):[i];l.forEach((function(e){var n=y[e]||[],r=n.length;while(r--){var i=n[r];!i||o!==i.namespace&&"*"!==o||t&&t!=i.callback||n.splice(r,1)}n.length||delete y[e]}))}));return u};
/**
     * Trigger an event.
     * @method ScrollMagic.Scene#trigger
     *
     * @example
     * this.trigger("change");
     *
     * @param {string} name - The name of the event that should be triggered.
     * @param {object} [vars] - An object containing info that should be passed to the callback.
     * @returns {Scene} Parent object for chaining.
     */(this||e).trigger=function(e,t){if(e){var n=e.trim().split("."),r=n[0],i=n[1],o=y[r];S(3,"event fired:",r,t?"->":"",t||"");o&&o.forEach((function(e,n){i&&i!==e.namespace||e.callback.call(u,new ScrollMagic.Event(r,e.namespace,u,t))}))}else S(1,"ERROR: Invalid event name supplied.");return u};u.on("change.internal",(function(e){"loglevel"!==e.what&&"tweenChanges"!==e.what&&("triggerElement"===e.what?updateTriggerElementPosition():"reverse"===e.what&&u.update())})).on("shift.internal",(function(e){updateScrollOffset();u.update()}));
/**
     * Send a debug message to the console.
     * @private
     * but provided publicly with _log for plugins
     *
     * @param {number} loglevel - The loglevel required to initiate output for the message.
     * @param {...mixed} output - One or more variables that should be passed to the console.
     */var S=(this||e)._log=function(e,t){if(f.loglevel>=e){Array.prototype.splice.call(arguments,1,0,"("+o+") ->");i.log.apply(window,arguments)}};
/**
     * Add the scene to a controller.  
     * This is the equivalent to `Controller.addScene(scene)`.
     * @method ScrollMagic.Scene#addTo
     *
     * @example
     * // add a scene to a ScrollMagic Controller
     * scene.addTo(controller);
     *
     * @param {ScrollMagic.Controller} controller - The controller to which the scene should be added.
     * @returns {Scene} Parent object for chaining.
     */(this||e).addTo=function(e){if(e instanceof ScrollMagic.Controller){if(w!=e){w&&w.removeScene(u);w=e;validateOption();updateDuration(true);updateTriggerElementPosition(true);updateScrollOffset();w.info("container").addEventListener("resize",onContainerResize);e.addScene(u);u.trigger("add",{controller:w});S(3,"added "+o+" to controller");u.update()}}else S(1,"ERROR: supplied argument of 'addTo()' is not a valid ScrollMagic Controller");return u};
/**
     * **Get** or **Set** the current enabled state of the scene.  
     * This can be used to disable this scene without removing or destroying it.
     * @method ScrollMagic.Scene#enabled
     *
     * @example
     * // get the current value
     * var enabled = scene.enabled();
     *
     * // disable the scene
     * scene.enabled(false);
     *
     * @param {boolean} [newState] - The new enabled state of the scene `true` or `false`.
     * @returns {(boolean|Scene)} Current enabled state or parent object for chaining.
     */(this||e).enabled=function(e){if(!arguments.length)return v;if(v!=e){v=!!e;u.update(true)}return u};
/**
     * Remove the scene from the controller.  
     * This is the equivalent to `Controller.removeScene(scene)`.
     * The scene will not be updated anymore until you readd it to a controller.
     * To remove the pin or the tween you need to call removeTween() or removePin() respectively.
     * @method ScrollMagic.Scene#remove
     * @example
     * // remove the scene from its controller
     * scene.remove();
     *
     * @returns {Scene} Parent object for chaining.
     */(this||e).remove=function(){if(w){w.info("container").removeEventListener("resize",onContainerResize);var e=w;w=void 0;e.removeScene(u);u.trigger("remove");S(3,"removed "+o+" from controller")}return u};
/**
     * Destroy the scene and everything.
     * @method ScrollMagic.Scene#destroy
     * @example
     * // destroy the scene without resetting the pin and tween to their initial positions
     * scene = scene.destroy();
     *
     * // destroy the scene and reset the pin and tween
     * scene = scene.destroy(true);
     *
     * @param {boolean} [reset=false] - If `true` the pin and tween (if existent) will be reset.
     * @returns {null} Null to unset handler variables.
     */(this||e).destroy=function(e){u.trigger("destroy",{reset:e});u.remove();u.off("*.*");S(3,"destroyed "+o+" (reset: "+(e?"true":"false")+")");return null};
/**
     * Updates the Scene to reflect the current state.  
     * This is the equivalent to `Controller.updateScene(scene, immediately)`.  
     * The update method calculates the scene's start and end position (based on the trigger element, trigger hook, duration and offset) and checks it against the current scroll position of the container.  
     * It then updates the current scene state accordingly (or does nothing, if the state is already correct) – Pins will be set to their correct position and tweens will be updated to their correct progress.
     * This means an update doesn't necessarily result in a progress change. The `progress` event will be fired if the progress has indeed changed between this update and the last.  
     * _**NOTE:** This method gets called constantly whenever ScrollMagic detects a change. The only application for you is if you change something outside of the realm of ScrollMagic, like moving the trigger or changing tween parameters._
     * @method ScrollMagic.Scene#update
     * @example
     * // update the scene on next tick
     * scene.update();
     *
     * // update the scene immediately
     * scene.update(true);
     *
     * @fires Scene.update
     *
     * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle (better performance).
     * @returns {Scene} Parent object for chaining.
     */(this||e).update=function(e){if(w)if(e)if(w.enabled()&&v){var t=w.info("scrollPos"),n;n=f.duration>0?(t-p.start)/(p.end-p.start):t>=p.start?1:0;u.trigger("update",{startPos:p.start,endPos:p.end,scrollPos:t});u.progress(n)}else b&&d===a&&updatePinState(true);else w.updateScene(u,false);return u};
/**
     * Updates dynamic scene variables like the trigger element position or the duration.
     * This method is automatically called in regular intervals from the controller. See {@link ScrollMagic.Controller} option `refreshInterval`.
     * 
     * You can call it to minimize lag, for example when you intentionally change the position of the triggerElement.
     * If you don't it will simply be updated in the next refresh interval of the container, which is usually sufficient.
     *
     * @method ScrollMagic.Scene#refresh
     * @since 1.1.0
     * @example
     * scene = new ScrollMagic.Scene({triggerElement: "#trigger"});
     * 
     * // change the position of the trigger
     * $("#trigger").css("top", 500);
     * // immediately let the scene know of this change
     * scene.refresh();
     *
     * @fires {@link Scene.shift}, if the trigger element position or the duration changed
     * @fires {@link Scene.change}, if the duration changed
     *
     * @returns {Scene} Parent object for chaining.
     */(this||e).refresh=function(){updateDuration();updateTriggerElementPosition();return u};
/**
     * **Get** or **Set** the scene's progress.  
     * Usually it shouldn't be necessary to use this as a setter, as it is set automatically by scene.update().  
     * The order in which the events are fired depends on the duration of the scene:
     *  1. Scenes with `duration == 0`:  
     *  Scenes that have no duration by definition have no ending. Thus the `end` event will never be fired.  
     *  When the trigger position of the scene is passed the events are always fired in this order:  
     *  `enter`, `start`, `progress` when scrolling forward  
     *  and  
     *  `progress`, `start`, `leave` when scrolling in reverse
     *  2. Scenes with `duration > 0`:  
     *  Scenes with a set duration have a defined start and end point.  
     *  When scrolling past the start position of the scene it will fire these events in this order:  
     *  `enter`, `start`, `progress`  
     *  When continuing to scroll and passing the end point it will fire these events:  
     *  `progress`, `end`, `leave`  
     *  When reversing through the end point these events are fired:  
     *  `enter`, `end`, `progress`  
     *  And when continuing to scroll past the start position in reverse it will fire:  
     *  `progress`, `start`, `leave`  
     *  In between start and end the `progress` event will be called constantly, whenever the progress changes.
     * 
     * In short:  
     * `enter` events will always trigger **before** the progress update and `leave` envents will trigger **after** the progress update.  
     * `start` and `end` will always trigger at their respective position.
     * 
     * Please review the event descriptions for details on the events and the event object that is passed to the callback.
     * 
     * @method ScrollMagic.Scene#progress
     * @example
     * // get the current scene progress
     * var progress = scene.progress();
     *
     * // set new scene progress
     * scene.progress(0.3);
     *
     * @fires {@link Scene.enter}, when used as setter
     * @fires {@link Scene.start}, when used as setter
     * @fires {@link Scene.progress}, when used as setter
     * @fires {@link Scene.end}, when used as setter
     * @fires {@link Scene.leave}, when used as setter
     *
     * @param {number} [progress] - The new progress value of the scene `[0-1]`.
     * @returns {number} `get` -  Current scene progress.
     * @returns {Scene} `set` -  Parent object for chaining.
     */(this||e).progress=function(e){if(arguments.length){var t=false,n=d,r=w?w.info("scrollDirection"):"PAUSED",i=f.reverse||e>=g;if(0===f.duration){t=g!=e;g=e<1&&i?0:1;d=0===g?l:a}else if(e<0&&d!==l&&i){g=0;d=l;t=true}else if(e>=0&&e<1&&i){g=e;d=a;t=true}else if(e>=1&&d!==s){g=1;d=s;t=true}else d!==a||i||updatePinState();if(t){var o={progress:g,state:d,scrollDirection:r},c=d!=n;var trigger=function(e){u.trigger(e,o)};if(c&&n!==a){trigger("enter");trigger(n===l?"start":"end")}trigger("progress");if(c&&d!==a){trigger(d===l?"start":"end");trigger("leave")}}return u}return g};var updateScrollOffset=function(){p={start:h+f.offset};w&&f.triggerElement&&(p.start-=w.info("size")*f.triggerHook);p.end=p.start+f.duration};
/**
     * Updates the duration if set to a dynamic function.
     * This method is called when the scene is added to a controller and in regular intervals from the controller through scene.refresh().
     * 
     * @fires {@link Scene.change}, if the duration changed
     * @fires {@link Scene.shift}, if the duration changed
     *
     * @param {boolean} [suppressEvents=false] - If true the shift event will be suppressed.
     * @private
     */var updateDuration=function(e){if(m){var t="duration";if(changeOption(t,m.call(u))&&!e){u.trigger("change",{what:t,newval:f[t]});u.trigger("shift",{reason:t})}}};
/**
     * Updates the position of the triggerElement, if present.
     * This method is called ...
     *  - ... when the triggerElement is changed
     *  - ... when the scene is added to a (new) controller
     *  - ... in regular intervals from the controller through scene.refresh().
     * 
     * @fires {@link Scene.shift}, if the position changed
     *
     * @param {boolean} [suppressEvents=false] - If true the shift event will be suppressed.
     * @private
     */var updateTriggerElementPosition=function(e){var n=0,r=f.triggerElement;if(w&&(r||h>0)){if(r)if(r.parentNode){var o=w.info(),l=i.get.offset(o.container),a=o.vertical?"top":"left";while(r.parentNode.hasAttribute(t))r=r.parentNode;var s=i.get.offset(r);o.isDocument||(l[a]-=w.scrollPos());n=s[a]-l[a]}else{S(2,"WARNING: triggerElement was removed from DOM and will be reset to",void 0);u.triggerElement(void 0)}var c=n!=h;h=n;c&&!e&&u.trigger("shift",{reason:"triggerElementPosition"})}};var onContainerResize=function(e){f.triggerHook>0&&u.trigger("shift",{reason:"containerResize"})};var E=i.extend(r.validate,{duration:function(e){if(i.type.String(e)&&e.match(/^(\.|\d)*\d+%$/)){var t=parseFloat(e)/100;e=function(){return w?w.info("size")*t:0}}if(i.type.Function(e)){m=e;try{e=parseFloat(m.call(u))}catch(t){e=-1}}e=parseFloat(e);if(!i.type.Number(e)||e<0){if(m){m=void 0;throw['Invalid return value of supplied function for option "duration":',e]}throw['Invalid value for option "duration":',e]}return e}});var validateOption=function(t){t=arguments.length?[t]:Object.keys(E);t.forEach((function(t,n){var r;if(E[t])try{r=E[t](f[t])}catch(n){r=c[t];var o=i.type.String(n)?[n]:n;if(i.type.Array(o)){o[0]="ERROR: "+o[0];o.unshift(1);S.apply(this||e,o)}else S(1,"ERROR: Problem executing validation callback for option '"+t+"':",n.message)}finally{f[t]=r}}))};var changeOption=function(e,t){var n=false,r=f[e];if(f[e]!=t){f[e]=t;validateOption(e);n=r!=f[e]}return n};var addSceneOption=function(e){u[e]||(u[e]=function(t){if(!arguments.length)return f[e];"duration"===e&&(m=void 0);if(changeOption(e,t)){u.trigger("change",{what:e,newval:f[e]});r.shifts.indexOf(e)>-1&&u.trigger("shift",{reason:e})}return u})};
/**
     * **Get** or **Set** the duration option value.
     *
     * As a **setter** it accepts three types of parameters:
     * 1. `number`: Sets the duration of the scene to exactly this amount of pixels.  
     *   This means the scene will last for exactly this amount of pixels scrolled. Sub-Pixels are also valid.
     *   A value of `0` means that the scene is 'open end' and no end will be triggered. Pins will never unpin and animations will play independently of scroll progress.
     * 2. `string`: Always updates the duration relative to parent scroll container.  
     *   For example `"100%"` will keep the duration always exactly at the inner height of the scroll container.
     *   When scrolling vertically the width is used for reference respectively.
     * 3. `function`: The supplied function will be called to return the scene duration.
     *   This is useful in setups where the duration depends on other elements who might change size. By supplying a function you can return a value instead of updating potentially multiple scene durations.  
     *   The scene can be referenced inside the callback using `this`.
     *   _**WARNING:** This is an easy way to kill performance, as the callback will be executed every time `Scene.refresh()` is called, which happens a lot. The interval is defined by the controller (see ScrollMagic.Controller option `refreshInterval`).  
     *   It's recomended to avoid calculations within the function and use cached variables as return values.  
     *   This counts double if you use the same function for multiple scenes._
     *
     * @method ScrollMagic.Scene#duration
     * @example
     * // get the current duration value
     * var duration = scene.duration();
     *
     * // set a new duration
     * scene.duration(300);
     *
     * // set duration responsively to container size
     * scene.duration("100%");
     *
     * // use a function to randomize the duration for some reason.
     * var durationValueCache;
     * function durationCallback () {
     *   return durationValueCache;
     * }
     * function updateDuration () {
     *   durationValueCache = Math.random() * 100;
     * }
     * updateDuration(); // set to initial value
     * scene.duration(durationCallback); // set duration callback
     *
     * @fires {@link Scene.change}, when used as setter
     * @fires {@link Scene.shift}, when used as setter
     * @param {(number|string|function)} [newDuration] - The new duration setting for the scene.
     * @returns {number} `get` -  Current scene duration.
     * @returns {Scene} `set` -  Parent object for chaining.
     */
/**
     * **Get** or **Set** the offset option value.
     * @method ScrollMagic.Scene#offset
     * @example
     * // get the current offset
     * var offset = scene.offset();
     *
     * // set a new offset
     * scene.offset(100);
     *
     * @fires {@link Scene.change}, when used as setter
     * @fires {@link Scene.shift}, when used as setter
     * @param {number} [newOffset] - The new offset of the scene.
     * @returns {number} `get` -  Current scene offset.
     * @returns {Scene} `set` -  Parent object for chaining.
     */
/**
     * **Get** or **Set** the triggerElement option value.
     * Does **not** fire `Scene.shift`, because changing the trigger Element doesn't necessarily mean the start position changes. This will be determined in `Scene.refresh()`, which is automatically triggered.
     * @method ScrollMagic.Scene#triggerElement
     * @example
     * // get the current triggerElement
     * var triggerElement = scene.triggerElement();
     *
     * // set a new triggerElement using a selector
     * scene.triggerElement("#trigger");
     * // set a new triggerElement using a DOM object
     * scene.triggerElement(document.getElementById("trigger"));
     *
     * @fires {@link Scene.change}, when used as setter
     * @param {(string|object)} [newTriggerElement] - The new trigger element for the scene.
     * @returns {(string|object)} `get` -  Current triggerElement.
     * @returns {Scene} `set` -  Parent object for chaining.
     */
/**
     * **Get** or **Set** the triggerHook option value.
     * @method ScrollMagic.Scene#triggerHook
     * @example
     * // get the current triggerHook value
     * var triggerHook = scene.triggerHook();
     *
     * // set a new triggerHook using a string
     * scene.triggerHook("onLeave");
     * // set a new triggerHook using a number
     * scene.triggerHook(0.7);
     *
     * @fires {@link Scene.change}, when used as setter
     * @fires {@link Scene.shift}, when used as setter
     * @param {(number|string)} [newTriggerHook] - The new triggerHook of the scene. See {@link Scene} parameter description for value options.
     * @returns {number} `get` -  Current triggerHook (ALWAYS numerical).
     * @returns {Scene} `set` -  Parent object for chaining.
     */
/**
     * **Get** or **Set** the reverse option value.
     * @method ScrollMagic.Scene#reverse
     * @example
     * // get the current reverse option
     * var reverse = scene.reverse();
     *
     * // set new reverse option
     * scene.reverse(false);
     *
     * @fires {@link Scene.change}, when used as setter
     * @param {boolean} [newReverse] - The new reverse setting of the scene.
     * @returns {boolean} `get` -  Current reverse option value.
     * @returns {Scene} `set` -  Parent object for chaining.
     */
/**
     * **Get** or **Set** the loglevel option value.
     * @method ScrollMagic.Scene#loglevel
     * @example
     * // get the current loglevel
     * var loglevel = scene.loglevel();
     *
     * // set new loglevel
     * scene.loglevel(3);
     *
     * @fires {@link Scene.change}, when used as setter
     * @param {number} [newLoglevel] - The new loglevel setting of the scene. `[0-3]`
     * @returns {number} `get` -  Current loglevel.
     * @returns {Scene} `set` -  Parent object for chaining.
     */
/**
     * **Get** the associated controller.
     * @method ScrollMagic.Scene#controller
     * @example
     * // get the controller of a scene
     * var controller = scene.controller();
     *
     * @returns {ScrollMagic.Controller} Parent controller or `undefined`
     */(this||e).controller=function(){return w};
/**
     * **Get** the current state.
     * @method ScrollMagic.Scene#state
     * @example
     * // get the current state
     * var state = scene.state();
     *
     * @returns {string} `"BEFORE"`, `"DURING"` or `"AFTER"`
     */(this||e).state=function(){return d};
/**
     * **Get** the current scroll offset for the start of the scene.  
     * Mind, that the scrollOffset is related to the size of the container, if `triggerHook` is bigger than `0` (or `"onLeave"`).  
     * This means, that resizing the container or changing the `triggerHook` will influence the scene's start offset.
     * @method ScrollMagic.Scene#scrollOffset
     * @example
     * // get the current scroll offset for the start and end of the scene.
     * var start = scene.scrollOffset();
     * var end = scene.scrollOffset() + scene.duration();
     * console.log("the scene starts at", start, "and ends at", end);
     *
     * @returns {number} The scroll offset (of the container) at which the scene will trigger. Y value for vertical and X value for horizontal scrolls.
     */(this||e).scrollOffset=function(){return p.start};
/**
     * **Get** the trigger position of the scene (including the value of the `offset` option).  
     * @method ScrollMagic.Scene#triggerPosition
     * @example
     * // get the scene's trigger position
     * var triggerPosition = scene.triggerPosition();
     *
     * @returns {number} Start position of the scene. Top position value for vertical and left position value for horizontal scrolls.
     */(this||e).triggerPosition=function(){var e=f.offset;w&&(f.triggerElement?e+=h:e+=w.info("size")*u.triggerHook());return e};var b,R;u.on("shift.internal",(function(e){var t="duration"===e.reason;(d===s&&t||d===a&&0===f.duration)&&updatePinState();t&&updatePinDimensions()})).on("progress.internal",(function(e){updatePinState()})).on("add.internal",(function(e){updatePinDimensions()})).on("destroy.internal",(function(e){u.removePin(e.reset)}));var updatePinState=function(e){if(b&&w){var t=w.info(),n=R.spacer.firstChild;if(e||d!==a){var r={position:R.inFlow?"relative":"absolute",top:0,left:0},o=i.css(n,"position")!=r.position;R.pushFollowers?f.duration>0&&(d===s&&0===parseFloat(i.css(R.spacer,"padding-top"))||d===l&&0===parseFloat(i.css(R.spacer,"padding-bottom")))&&(o=true):r[t.vertical?"top":"left"]=f.duration*g;i.css(n,r);o&&updatePinDimensions()}else{if("fixed"!=i.css(n,"position")){i.css(n,{position:"fixed"});updatePinDimensions()}var c=i.get.offset(R.spacer,true),u=f.reverse||0===f.duration?t.scrollPos-p.start:Math.round(g*f.duration*10)/10;c[t.vertical?"top":"left"]+=u;i.css(R.spacer.firstChild,{top:c.top,left:c.left})}}};var updatePinDimensions=function(){if(b&&w&&R.inFlow){var e=d===s,t=d===l,n=d===a,r=w.info("vertical"),o=R.spacer.firstChild,c=i.isMarginCollapseType(i.css(R.spacer,"display")),u={};if(R.relSize.width||R.relSize.autoFullWidth)n?i.css(b,{width:i.get.width(R.spacer)}):i.css(b,{width:"100%"});else{u["min-width"]=i.get.width(r?b:o,true,true);u.width=n?u["min-width"]:"auto"}if(R.relSize.height)n?i.css(b,{height:i.get.height(R.spacer)-(R.pushFollowers?f.duration:0)}):i.css(b,{height:"100%"});else{u["min-height"]=i.get.height(r?o:b,true,!c);u.height=n?u["min-height"]:"auto"}if(R.pushFollowers){u["padding"+(r?"Top":"Left")]=f.duration*g;u["padding"+(r?"Bottom":"Right")]=f.duration*(1-g)}i.css(R.spacer,u)}};var updatePinInContainer=function(){w&&b&&d===a&&!w.info("isDocument")&&updatePinState()};var updateRelativePinSpacer=function(){w&&b&&d===a&&((R.relSize.width||R.relSize.autoFullWidth)&&i.get.width(window)!=i.get.width(R.spacer.parentNode)||R.relSize.height&&i.get.height(window)!=i.get.height(R.spacer.parentNode))&&updatePinDimensions()};var onMousewheelOverPin=function(e){if(w&&b&&d===a&&!w.info("isDocument")){e.preventDefault();w._setScrollPos(w.info("scrollPos")-((e.wheelDelta||e[w.info("vertical")?"wheelDeltaY":"wheelDeltaX"])/3||30*-e.detail))}};
/**
     * Pin an element for the duration of the scene.
     * If the scene duration is 0 the element will only be unpinned, if the user scrolls back past the start position.  
     * Make sure only one pin is applied to an element at the same time.
     * An element can be pinned multiple times, but only successively.
     * _**NOTE:** The option `pushFollowers` has no effect, when the scene duration is 0._
     * @method ScrollMagic.Scene#setPin
     * @example
     * // pin element and push all following elements down by the amount of the pin duration.
     * scene.setPin("#pin");
     *
     * // pin element and keeping all following elements in their place. The pinned element will move past them.
     * scene.setPin("#pin", {pushFollowers: false});
     *
     * @param {(string|object)} element - A Selector targeting an element or a DOM object that is supposed to be pinned.
     * @param {object} [settings] - settings for the pin
     * @param {boolean} [settings.pushFollowers=true] - If `true` following elements will be "pushed" down for the duration of the pin, if `false` the pinned element will just scroll past them.  
     												   Ignored, when duration is `0`.
     * @param {string} [settings.spacerClass="scrollmagic-pin-spacer"] - Classname of the pin spacer element, which is used to replace the element.
     *
     * @returns {Scene} Parent object for chaining.
     */(this||e).setPin=function(e,n){var r={pushFollowers:true,spacerClass:"scrollmagic-pin-spacer"};var o=n&&n.hasOwnProperty("pushFollowers");n=i.extend({},r,n);e=i.get.elements(e)[0];if(!e){S(1,"ERROR calling method 'setPin()': Invalid pin element supplied.");return u}if("fixed"===i.css(e,"position")){S(1,"ERROR calling method 'setPin()': Pin does not work with elements that are positioned 'fixed'.");return u}if(b){if(b===e)return u;u.removePin()}b=e;var l=b.parentNode.style.display,a=["top","left","bottom","right","margin","marginLeft","marginRight","marginTop","marginBottom"];b.parentNode.style.display="none";var s="absolute"!=i.css(b,"position"),c=i.css(b,a.concat(["display"])),d=i.css(b,["width","height"]);b.parentNode.style.display=l;if(!s&&n.pushFollowers){S(2,"WARNING: If the pinned element is positioned absolutely pushFollowers will be disabled.");n.pushFollowers=false}window.setTimeout((function(){b&&0===f.duration&&o&&n.pushFollowers&&S(2,"WARNING: pushFollowers =",true,"has no effect, when scene duration is 0.")}),0);var g=b.parentNode.insertBefore(document.createElement("div"),b),p=i.extend(c,{position:s?"relative":"absolute",boxSizing:"content-box",mozBoxSizing:"content-box",webkitBoxSizing:"content-box"});s||i.extend(p,i.css(b,["width","height"]));i.css(g,p);g.setAttribute(t,"");i.addClass(g,n.spacerClass);R={spacer:g,relSize:{width:"%"===d.width.slice(-1),height:"%"===d.height.slice(-1),autoFullWidth:"auto"===d.width&&s&&i.isMarginCollapseType(c.display)},pushFollowers:n.pushFollowers,inFlow:s};if(!b.___origStyle){b.___origStyle={};var h=b.style,v=a.concat(["width","height","position","boxSizing","mozBoxSizing","webkitBoxSizing"]);v.forEach((function(e){b.___origStyle[e]=h[e]||""}))}R.relSize.width&&i.css(g,{width:d.width});R.relSize.height&&i.css(g,{height:d.height});g.appendChild(b);i.css(b,{position:s?"relative":"absolute",margin:"auto",top:"auto",left:"auto",bottom:"auto",right:"auto"});(R.relSize.width||R.relSize.autoFullWidth)&&i.css(b,{boxSizing:"border-box",mozBoxSizing:"border-box",webkitBoxSizing:"border-box"});window.addEventListener("scroll",updatePinInContainer);window.addEventListener("resize",updatePinInContainer);window.addEventListener("resize",updateRelativePinSpacer);b.addEventListener("mousewheel",onMousewheelOverPin);b.addEventListener("DOMMouseScroll",onMousewheelOverPin);S(3,"added pin");updatePinState();return u};
/**
     * Remove the pin from the scene.
     * @method ScrollMagic.Scene#removePin
     * @example
     * // remove the pin from the scene without resetting it (the spacer is not removed)
     * scene.removePin();
     *
     * // remove the pin from the scene and reset the pin element to its initial position (spacer is removed)
     * scene.removePin(true);
     *
     * @param {boolean} [reset=false] - If `false` the spacer will not be removed and the element's position will not be reset.
     * @returns {Scene} Parent object for chaining.
     */(this||e).removePin=function(e){if(b){d===a&&updatePinState(true);if(e||!w){var n=R.spacer.firstChild;if(n.hasAttribute(t)){var r=R.spacer.style,o=["margin","marginLeft","marginRight","marginTop","marginBottom"],l={};o.forEach((function(e){l[e]=r[e]||""}));i.css(n,l)}R.spacer.parentNode.insertBefore(n,R.spacer);R.spacer.parentNode.removeChild(R.spacer);if(!b.parentNode.hasAttribute(t)){i.css(b,b.___origStyle);delete b.___origStyle}}window.removeEventListener("scroll",updatePinInContainer);window.removeEventListener("resize",updatePinInContainer);window.removeEventListener("resize",updateRelativePinSpacer);b.removeEventListener("mousewheel",onMousewheelOverPin);b.removeEventListener("DOMMouseScroll",onMousewheelOverPin);b=void 0;S(3,"removed pin (reset: "+(e?"true":"false")+")")}return u};var T,C=[];u.on("destroy.internal",(function(e){u.removeClassToggle(e.reset)}));
/**
     * Define a css class modification while the scene is active.  
     * When the scene triggers the classes will be added to the supplied element and removed, when the scene is over.
     * If the scene duration is 0 the classes will only be removed if the user scrolls back past the start position.
     * @method ScrollMagic.Scene#setClassToggle
     * @example
     * // add the class 'myclass' to the element with the id 'my-elem' for the duration of the scene
     * scene.setClassToggle("#my-elem", "myclass");
     *
     * // add multiple classes to multiple elements defined by the selector '.classChange'
     * scene.setClassToggle(".classChange", "class1 class2 class3");
     *
     * @param {(string|object)} element - A Selector targeting one or more elements or a DOM object that is supposed to be modified.
     * @param {string} classes - One or more Classnames (separated by space) that should be added to the element during the scene.
     *
     * @returns {Scene} Parent object for chaining.
     */(this||e).setClassToggle=function(e,t){var n=i.get.elements(e);if(0===n.length||!i.type.String(t)){S(1,"ERROR calling method 'setClassToggle()': Invalid "+(0===n.length?"element":"classes")+" supplied.");return u}C.length>0&&u.removeClassToggle();T=t;C=n;u.on("enter.internal_class leave.internal_class",(function(e){var t="enter"===e.type?i.addClass:i.removeClass;C.forEach((function(e,n){t(e,T)}))}));return u};
/**
     * Remove the class binding from the scene.
     * @method ScrollMagic.Scene#removeClassToggle
     * @example
     * // remove class binding from the scene without reset
     * scene.removeClassToggle();
     *
     * // remove class binding and remove the changes it caused
     * scene.removeClassToggle(true);
     *
     * @param {boolean} [reset=false] - If `false` and the classes are currently active, they will remain on the element. If `true` they will be removed.
     * @returns {Scene} Parent object for chaining.
     */(this||e).removeClassToggle=function(e){e&&C.forEach((function(e,t){i.removeClass(e,T)}));u.off("start.internal_class end.internal_class");T=void 0;C=[];return u};construct();return u};var r={defaults:{duration:0,offset:0,triggerElement:void 0,triggerHook:.5,reverse:true,loglevel:2},validate:{offset:function(e){e=parseFloat(e);if(!i.type.Number(e))throw['Invalid value for option "offset":',e];return e},triggerElement:function(e){e=e||void 0;if(e){var t=i.get.elements(e)[0];if(!t||!t.parentNode)throw['Element defined in option "triggerElement" was not found:',e];e=t}return e},triggerHook:function(e){var t={onCenter:.5,onEnter:1,onLeave:0};if(i.type.Number(e))e=Math.max(0,Math.min(parseFloat(e),1));else{if(!(e in t))throw['Invalid value for option "triggerHook": ',e];e=t[e]}return e},reverse:function(e){return!!e},loglevel:function(e){e=parseInt(e);if(!i.type.Number(e)||e<0||e>3)throw['Invalid value for option "loglevel":',e];return e}},shifts:["duration","offset","triggerHook"]};ScrollMagic.Scene.addOption=function(e,t,n,i){if(e in r.defaults)ScrollMagic._util.log(1,"[static] ScrollMagic.Scene -> Cannot add Scene option '"+e+"', because it already exists.");else{r.defaults[e]=t;r.validate[e]=n;i&&r.shifts.push(e)}};ScrollMagic.Scene.extend=function(t){var n=this||e;ScrollMagic.Scene=function(){n.apply(this||e,arguments);(this||e).$super=i.extend({},this||e);return t.apply(this||e,arguments)||this||e};i.extend(ScrollMagic.Scene,n);ScrollMagic.Scene.prototype=n.prototype;ScrollMagic.Scene.prototype.constructor=ScrollMagic.Scene};ScrollMagic.Event=function(t,n,r,i){i=i||{};for(var o in i)(this||e)[o]=i[o];(this||e).type=t;(this||e).target=(this||e).currentTarget=r;(this||e).namespace=n||"";(this||e).timeStamp=(this||e).timestamp=Date.now();return this||e};var i=ScrollMagic._util=function(e){var t={},n;var floatval=function(e){return parseFloat(e)||0};var _getComputedStyle=function(t){return t.currentStyle?t.currentStyle:e.getComputedStyle(t)};var _dimension=function(t,n,r,i){n=n===document?e:n;if(n===e)i=false;else if(!u.DomElement(n))return 0;t=t.charAt(0).toUpperCase()+t.substr(1).toLowerCase();var o=(r?n["offset"+t]||n["outer"+t]:n["client"+t]||n["inner"+t])||0;if(r&&i){var l=_getComputedStyle(n);o+="Height"===t?floatval(l.marginTop)+floatval(l.marginBottom):floatval(l.marginLeft)+floatval(l.marginRight)}return o};var _camelCase=function(e){return e.replace(/^[^a-z]+([a-z])/g,"$1").replace(/-([a-z])/g,(function(e){return e[1].toUpperCase()}))};t.extend=function(e){e=e||{};for(n=1;n<arguments.length;n++)if(arguments[n])for(var t in arguments[n])arguments[n].hasOwnProperty(t)&&(e[t]=arguments[n][t]);return e};t.isMarginCollapseType=function(e){return["block","flex","list-item","table","-webkit-box"].indexOf(e)>-1};var r=0,i=["ms","moz","webkit","o"];var o=e.requestAnimationFrame;var l=e.cancelAnimationFrame;for(n=0;!o&&n<i.length;++n){o=e[i[n]+"RequestAnimationFrame"];l=e[i[n]+"CancelAnimationFrame"]||e[i[n]+"CancelRequestAnimationFrame"]}o||(o=function(t){var n=(new Date).getTime(),i=Math.max(0,16-(n-r)),o=e.setTimeout((function(){t(n+i)}),i);r=n+i;return o});l||(l=function(t){e.clearTimeout(t)});t.rAF=o.bind(e);t.cAF=l.bind(e);var a=["error","warn","log"],s=e.console||{};s.log=s.log||function(){};for(n=0;n<a.length;n++){var c=a[n];s[c]||(s[c]=s.log)}t.log=function(e){(e>a.length||e<=0)&&(e=a.length);var t=new Date,n=("0"+t.getHours()).slice(-2)+":"+("0"+t.getMinutes()).slice(-2)+":"+("0"+t.getSeconds()).slice(-2)+":"+("00"+t.getMilliseconds()).slice(-3),r=a[e-1],i=Array.prototype.splice.call(arguments,1),o=Function.prototype.bind.call(s[r],s);i.unshift(n);o.apply(s,i)};var u=t.type=function(e){return Object.prototype.toString.call(e).replace(/^\[object (.+)\]$/,"$1").toLowerCase()};u.String=function(e){return"string"===u(e)};u.Function=function(e){return"function"===u(e)};u.Array=function(e){return Array.isArray(e)};u.Number=function(e){return!u.Array(e)&&e-parseFloat(e)+1>=0};u.DomElement=function(e){return"object"===typeof HTMLElement||"function"===typeof HTMLElement?e instanceof HTMLElement||e instanceof SVGElement:e&&"object"===typeof e&&null!==e&&1===e.nodeType&&"string"===typeof e.nodeName};var f=t.get={};f.elements=function(t){var n=[];if(u.String(t))try{t=document.querySelectorAll(t)}catch(e){return n}if("nodelist"===u(t)||u.Array(t)||t instanceof NodeList)for(var r=0,i=n.length=t.length;r<i;r++){var o=t[r];n[r]=u.DomElement(o)?o:f.elements(o)}else(u.DomElement(t)||t===document||t===e)&&(n=[t]);return n};f.scrollTop=function(t){return t&&"number"===typeof t.scrollTop?t.scrollTop:e.pageYOffset||0};f.scrollLeft=function(t){return t&&"number"===typeof t.scrollLeft?t.scrollLeft:e.pageXOffset||0};f.width=function(e,t,n){return _dimension("width",e,t,n)};f.height=function(e,t,n){return _dimension("height",e,t,n)};f.offset=function(e,t){var n={top:0,left:0};if(e&&e.getBoundingClientRect){var r=e.getBoundingClientRect();n.top=r.top;n.left=r.left;if(!t){n.top+=f.scrollTop();n.left+=f.scrollLeft()}}return n};t.addClass=function(e,t){t&&(e.classList?e.classList.add(t):e.className+=" "+t)};t.removeClass=function(e,t){t&&(e.classList?e.classList.remove(t):e.className=e.className.replace(new RegExp("(^|\\b)"+t.split(" ").join("|")+"(\\b|$)","gi")," "))};t.css=function(e,t){if(u.String(t))return _getComputedStyle(e)[_camelCase(t)];if(u.Array(t)){var n={},r=_getComputedStyle(e);t.forEach((function(e,t){n[e]=r[_camelCase(e)]}));return n}for(var i in t){var o=t[i];o==parseFloat(o)&&(o+="px");e.style[_camelCase(i)]=o}};return t}(window||{});ScrollMagic.Scene.prototype.addIndicators=function(){ScrollMagic._util.log(1,"(ScrollMagic.Scene) -> ERROR calling addIndicators() due to missing Plugin 'debug.addIndicators'. Please make sure to include plugins/debug.addIndicators.js");return this||e};ScrollMagic.Scene.prototype.removeIndicators=function(){ScrollMagic._util.log(1,"(ScrollMagic.Scene) -> ERROR calling removeIndicators() due to missing Plugin 'debug.addIndicators'. Please make sure to include plugins/debug.addIndicators.js");return this||e};ScrollMagic.Scene.prototype.setTween=function(){ScrollMagic._util.log(1,"(ScrollMagic.Scene) -> ERROR calling setTween() due to missing Plugin 'animation.gsap'. Please make sure to include plugins/animation.gsap.js");return this||e};ScrollMagic.Scene.prototype.removeTween=function(){ScrollMagic._util.log(1,"(ScrollMagic.Scene) -> ERROR calling removeTween() due to missing Plugin 'animation.gsap'. Please make sure to include plugins/animation.gsap.js");return this||e};ScrollMagic.Scene.prototype.setVelocity=function(){ScrollMagic._util.log(1,"(ScrollMagic.Scene) -> ERROR calling setVelocity() due to missing Plugin 'animation.velocity'. Please make sure to include plugins/animation.velocity.js");return this||e};ScrollMagic.Scene.prototype.removeVelocity=function(){ScrollMagic._util.log(1,"(ScrollMagic.Scene) -> ERROR calling removeVelocity() due to missing Plugin 'animation.velocity'. Please make sure to include plugins/animation.velocity.js");return this||e};return ScrollMagic}));var n=t;export default n;

