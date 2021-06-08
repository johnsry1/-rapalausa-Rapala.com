/*! jQuery UI - v1.12.1 - 2016-09-14
* http://jqueryui.com
* Includes: widget.js, position.js, data.js, disable-selection.js, effect.js, effects/effect-blind.js, effects/effect-bounce.js, effects/effect-clip.js, effects/effect-drop.js, effects/effect-explode.js, effects/effect-fade.js, effects/effect-fold.js, effects/effect-highlight.js, effects/effect-puff.js, effects/effect-pulsate.js, effects/effect-scale.js, effects/effect-shake.js, effects/effect-size.js, effects/effect-slide.js, effects/effect-transfer.js, focusable.js, form-reset-mixin.js, jquery-1-7.js, keycode.js, labels.js, scroll-parent.js, tabbable.js, unique-id.js, widgets/accordion.js, widgets/autocomplete.js, widgets/button.js, widgets/checkboxradio.js, widgets/controlgroup.js, widgets/datepicker.js, widgets/dialog.js, widgets/draggable.js, widgets/droppable.js, widgets/menu.js, widgets/mouse.js, widgets/progressbar.js, widgets/resizable.js, widgets/selectable.js, widgets/selectmenu.js, widgets/slider.js, widgets/sortable.js, widgets/spinner.js, widgets/tabs.js, widgets/tooltip.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */

(function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)})(function(t){function e(t){for(var e=t.css("visibility");"inherit"===e;)t=t.parent(),e=t.css("visibility");return"hidden"!==e}function i(t){for(var e,i;t.length&&t[0]!==document;){if(e=t.css("position"),("absolute"===e||"relative"===e||"fixed"===e)&&(i=parseInt(t.css("zIndex"),10),!isNaN(i)&&0!==i))return i;t=t.parent()}return 0}function s(){this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},t.extend(this._defaults,this.regional[""]),this.regional.en=t.extend(!0,{},this.regional[""]),this.regional["en-US"]=t.extend(!0,{},this.regional.en),this.dpDiv=n(t("<div id='"+this._mainDivId+"' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))}function n(e){var i="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return e.on("mouseout",i,function(){t(this).removeClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&t(this).removeClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&t(this).removeClass("ui-datepicker-next-hover")}).on("mouseover",i,o)}function o(){t.datepicker._isDisabledDatepicker(m.inline?m.dpDiv.parent()[0]:m.input[0])||(t(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),t(this).addClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&t(this).addClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&t(this).addClass("ui-datepicker-next-hover"))}function a(e,i){t.extend(e,i);for(var s in i)null==i[s]&&(e[s]=i[s]);return e}function r(t){return function(){var e=this.element.val();t.apply(this,arguments),this._refresh(),e!==this.element.val()&&this._trigger("change")}}t.ui=t.ui||{},t.ui.version="1.12.1";var h=0,l=Array.prototype.slice;t.cleanData=function(e){return function(i){var s,n,o;for(o=0;null!=(n=i[o]);o++)try{s=t._data(n,"events"),s&&s.remove&&t(n).triggerHandler("remove")}catch(a){}e(i)}}(t.cleanData),t.widget=function(e,i,s){var n,o,a,r={},h=e.split(".")[0];e=e.split(".")[1];var l=h+"-"+e;return s||(s=i,i=t.Widget),t.isArray(s)&&(s=t.extend.apply(null,[{}].concat(s))),t.expr[":"][l.toLowerCase()]=function(e){return!!t.data(e,l)},t[h]=t[h]||{},n=t[h][e],o=t[h][e]=function(t,e){return this._createWidget?(arguments.length&&this._createWidget(t,e),void 0):new o(t,e)},t.extend(o,n,{version:s.version,_proto:t.extend({},s),_childConstructors:[]}),a=new i,a.options=t.widget.extend({},a.options),t.each(s,function(e,s){return t.isFunction(s)?(r[e]=function(){function t(){return i.prototype[e].apply(this,arguments)}function n(t){return i.prototype[e].apply(this,t)}return function(){var e,i=this._super,o=this._superApply;return this._super=t,this._superApply=n,e=s.apply(this,arguments),this._super=i,this._superApply=o,e}}(),void 0):(r[e]=s,void 0)}),o.prototype=t.widget.extend(a,{widgetEventPrefix:n?a.widgetEventPrefix||e:e},r,{constructor:o,namespace:h,widgetName:e,widgetFullName:l}),n?(t.each(n._childConstructors,function(e,i){var s=i.prototype;t.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete n._childConstructors):i._childConstructors.push(o),t.widget.bridge(e,o),o},t.widget.extend=function(e){for(var i,s,n=l.call(arguments,1),o=0,a=n.length;a>o;o++)for(i in n[o])s=n[o][i],n[o].hasOwnProperty(i)&&void 0!==s&&(e[i]=t.isPlainObject(s)?t.isPlainObject(e[i])?t.widget.extend({},e[i],s):t.widget.extend({},s):s);return e},t.widget.bridge=function(e,i){var s=i.prototype.widgetFullName||e;t.fn[e]=function(n){var o="string"==typeof n,a=l.call(arguments,1),r=this;return o?this.length||"instance"!==n?this.each(function(){var i,o=t.data(this,s);return"instance"===n?(r=o,!1):o?t.isFunction(o[n])&&"_"!==n.charAt(0)?(i=o[n].apply(o,a),i!==o&&void 0!==i?(r=i&&i.jquery?r.pushStack(i.get()):i,!1):void 0):t.error("no such method '"+n+"' for "+e+" widget instance"):t.error("cannot call methods on "+e+" prior to initialization; "+"attempted to call method '"+n+"'")}):r=void 0:(a.length&&(n=t.widget.extend.apply(null,[n].concat(a))),this.each(function(){var e=t.data(this,s);e?(e.option(n||{}),e._init&&e._init()):t.data(this,s,new i(n,this))})),r}},t.Widget=function(){},t.Widget._childConstructors=[],t.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{classes:{},disabled:!1,create:null},_createWidget:function(e,i){i=t(i||this.defaultElement||this)[0],this.element=t(i),this.uuid=h++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=t(),this.hoverable=t(),this.focusable=t(),this.classesElementLookup={},i!==this&&(t.data(i,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===i&&this.destroy()}}),this.document=t(i.style?i.ownerDocument:i.document||i),this.window=t(this.document[0].defaultView||this.document[0].parentWindow)),this.options=t.widget.extend({},this.options,this._getCreateOptions(),e),this._create(),this.options.disabled&&this._setOptionDisabled(this.options.disabled),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:function(){return{}},_getCreateEventData:t.noop,_create:t.noop,_init:t.noop,destroy:function(){var e=this;this._destroy(),t.each(this.classesElementLookup,function(t,i){e._removeClass(i,t)}),this.element.off(this.eventNamespace).removeData(this.widgetFullName),this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),this.bindings.off(this.eventNamespace)},_destroy:t.noop,widget:function(){return this.element},option:function(e,i){var s,n,o,a=e;if(0===arguments.length)return t.widget.extend({},this.options);if("string"==typeof e)if(a={},s=e.split("."),e=s.shift(),s.length){for(n=a[e]=t.widget.extend({},this.options[e]),o=0;s.length-1>o;o++)n[s[o]]=n[s[o]]||{},n=n[s[o]];if(e=s.pop(),1===arguments.length)return void 0===n[e]?null:n[e];n[e]=i}else{if(1===arguments.length)return void 0===this.options[e]?null:this.options[e];a[e]=i}return this._setOptions(a),this},_setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return"classes"===t&&this._setOptionClasses(e),this.options[t]=e,"disabled"===t&&this._setOptionDisabled(e),this},_setOptionClasses:function(e){var i,s,n;for(i in e)n=this.classesElementLookup[i],e[i]!==this.options.classes[i]&&n&&n.length&&(s=t(n.get()),this._removeClass(n,i),s.addClass(this._classes({element:s,keys:i,classes:e,add:!0})))},_setOptionDisabled:function(t){this._toggleClass(this.widget(),this.widgetFullName+"-disabled",null,!!t),t&&(this._removeClass(this.hoverable,null,"ui-state-hover"),this._removeClass(this.focusable,null,"ui-state-focus"))},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_classes:function(e){function i(i,o){var a,r;for(r=0;i.length>r;r++)a=n.classesElementLookup[i[r]]||t(),a=e.add?t(t.unique(a.get().concat(e.element.get()))):t(a.not(e.element).get()),n.classesElementLookup[i[r]]=a,s.push(i[r]),o&&e.classes[i[r]]&&s.push(e.classes[i[r]])}var s=[],n=this;return e=t.extend({element:this.element,classes:this.options.classes||{}},e),this._on(e.element,{remove:"_untrackClassesElement"}),e.keys&&i(e.keys.match(/\S+/g)||[],!0),e.extra&&i(e.extra.match(/\S+/g)||[]),s.join(" ")},_untrackClassesElement:function(e){var i=this;t.each(i.classesElementLookup,function(s,n){-1!==t.inArray(e.target,n)&&(i.classesElementLookup[s]=t(n.not(e.target).get()))})},_removeClass:function(t,e,i){return this._toggleClass(t,e,i,!1)},_addClass:function(t,e,i){return this._toggleClass(t,e,i,!0)},_toggleClass:function(t,e,i,s){s="boolean"==typeof s?s:i;var n="string"==typeof t||null===t,o={extra:n?e:i,keys:n?t:e,element:n?this.element:t,add:s};return o.element.toggleClass(this._classes(o),s),this},_on:function(e,i,s){var n,o=this;"boolean"!=typeof e&&(s=i,i=e,e=!1),s?(i=n=t(i),this.bindings=this.bindings.add(i)):(s=i,i=this.element,n=this.widget()),t.each(s,function(s,a){function r(){return e||o.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled")?("string"==typeof a?o[a]:a).apply(o,arguments):void 0}"string"!=typeof a&&(r.guid=a.guid=a.guid||r.guid||t.guid++);var h=s.match(/^([\w:-]*)\s*(.*)$/),l=h[1]+o.eventNamespace,c=h[2];c?n.on(l,c,r):i.on(l,r)})},_off:function(e,i){i=(i||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.off(i).off(i),this.bindings=t(this.bindings.not(e).get()),this.focusable=t(this.focusable.not(e).get()),this.hoverable=t(this.hoverable.not(e).get())},_delay:function(t,e){function i(){return("string"==typeof t?s[t]:t).apply(s,arguments)}var s=this;return setTimeout(i,e||0)},_hoverable:function(e){this.hoverable=this.hoverable.add(e),this._on(e,{mouseenter:function(e){this._addClass(t(e.currentTarget),null,"ui-state-hover")},mouseleave:function(e){this._removeClass(t(e.currentTarget),null,"ui-state-hover")}})},_focusable:function(e){this.focusable=this.focusable.add(e),this._on(e,{focusin:function(e){this._addClass(t(e.currentTarget),null,"ui-state-focus")},focusout:function(e){this._removeClass(t(e.currentTarget),null,"ui-state-focus")}})},_trigger:function(e,i,s){var n,o,a=this.options[e];if(s=s||{},i=t.Event(i),i.type=(e===this.widgetEventPrefix?e:this.widgetEventPrefix+e).toLowerCase(),i.target=this.element[0],o=i.originalEvent)for(n in o)n in i||(i[n]=o[n]);return this.element.trigger(i,s),!(t.isFunction(a)&&a.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},t.each({show:"fadeIn",hide:"fadeOut"},function(e,i){t.Widget.prototype["_"+e]=function(s,n,o){"string"==typeof n&&(n={effect:n});var a,r=n?n===!0||"number"==typeof n?i:n.effect||i:e;n=n||{},"number"==typeof n&&(n={duration:n}),a=!t.isEmptyObject(n),n.complete=o,n.delay&&s.delay(n.delay),a&&t.effects&&t.effects.effect[r]?s[e](n):r!==e&&s[r]?s[r](n.duration,n.easing,o):s.queue(function(i){t(this)[e](),o&&o.call(s[0]),i()})}}),t.widget,function(){function e(t,e,i){return[parseFloat(t[0])*(u.test(t[0])?e/100:1),parseFloat(t[1])*(u.test(t[1])?i/100:1)]}function i(e,i){return parseInt(t.css(e,i),10)||0}function s(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}var n,o=Math.max,a=Math.abs,r=/left|center|right/,h=/top|center|bottom/,l=/[\+\-]\d+(\.[\d]+)?%?/,c=/^\w+/,u=/%$/,d=t.fn.position;t.position={scrollbarWidth:function(){if(void 0!==n)return n;var e,i,s=t("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=s.children()[0];return t("body").append(s),e=o.offsetWidth,s.css("overflow","scroll"),i=o.offsetWidth,e===i&&(i=s[0].clientWidth),s.remove(),n=e-i},getScrollInfo:function(e){var i=e.isWindow||e.isDocument?"":e.element.css("overflow-x"),s=e.isWindow||e.isDocument?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,o="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:o?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]),n=!!i[0]&&9===i[0].nodeType,o=!s&&!n;return{element:i,isWindow:s,isDocument:n,offset:o?t(e).offset():{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:i.outerWidth(),height:i.outerHeight()}}},t.fn.position=function(n){if(!n||!n.of)return d.apply(this,arguments);n=t.extend({},n);var u,p,f,g,m,_,v=t(n.of),b=t.position.getWithinInfo(n.within),y=t.position.getScrollInfo(b),w=(n.collision||"flip").split(" "),k={};return _=s(v),v[0].preventDefault&&(n.at="left top"),p=_.width,f=_.height,g=_.offset,m=t.extend({},g),t.each(["my","at"],function(){var t,e,i=(n[this]||"").split(" ");1===i.length&&(i=r.test(i[0])?i.concat(["center"]):h.test(i[0])?["center"].concat(i):["center","center"]),i[0]=r.test(i[0])?i[0]:"center",i[1]=h.test(i[1])?i[1]:"center",t=l.exec(i[0]),e=l.exec(i[1]),k[this]=[t?t[0]:0,e?e[0]:0],n[this]=[c.exec(i[0])[0],c.exec(i[1])[0]]}),1===w.length&&(w[1]=w[0]),"right"===n.at[0]?m.left+=p:"center"===n.at[0]&&(m.left+=p/2),"bottom"===n.at[1]?m.top+=f:"center"===n.at[1]&&(m.top+=f/2),u=e(k.at,p,f),m.left+=u[0],m.top+=u[1],this.each(function(){var s,r,h=t(this),l=h.outerWidth(),c=h.outerHeight(),d=i(this,"marginLeft"),_=i(this,"marginTop"),x=l+d+i(this,"marginRight")+y.width,C=c+_+i(this,"marginBottom")+y.height,D=t.extend({},m),I=e(k.my,h.outerWidth(),h.outerHeight());"right"===n.my[0]?D.left-=l:"center"===n.my[0]&&(D.left-=l/2),"bottom"===n.my[1]?D.top-=c:"center"===n.my[1]&&(D.top-=c/2),D.left+=I[0],D.top+=I[1],s={marginLeft:d,marginTop:_},t.each(["left","top"],function(e,i){t.ui.position[w[e]]&&t.ui.position[w[e]][i](D,{targetWidth:p,targetHeight:f,elemWidth:l,elemHeight:c,collisionPosition:s,collisionWidth:x,collisionHeight:C,offset:[u[0]+I[0],u[1]+I[1]],my:n.my,at:n.at,within:b,elem:h})}),n.using&&(r=function(t){var e=g.left-D.left,i=e+p-l,s=g.top-D.top,r=s+f-c,u={target:{element:v,left:g.left,top:g.top,width:p,height:f},element:{element:h,left:D.left,top:D.top,width:l,height:c},horizontal:0>i?"left":e>0?"right":"center",vertical:0>r?"top":s>0?"bottom":"middle"};l>p&&p>a(e+i)&&(u.horizontal="center"),c>f&&f>a(s+r)&&(u.vertical="middle"),u.important=o(a(e),a(i))>o(a(s),a(r))?"horizontal":"vertical",n.using.call(this,t,u)}),h.offset(t.extend(D,{using:r}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=t.left-e.collisionPosition.marginLeft,h=n-r,l=r+e.collisionWidth-a-n;e.collisionWidth>a?h>0&&0>=l?(i=t.left+h+e.collisionWidth-a-n,t.left+=h-i):t.left=l>0&&0>=h?n:h>l?n+a-e.collisionWidth:n:h>0?t.left+=h:l>0?t.left-=l:t.left=o(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,a=e.within.height,r=t.top-e.collisionPosition.marginTop,h=n-r,l=r+e.collisionHeight-a-n;e.collisionHeight>a?h>0&&0>=l?(i=t.top+h+e.collisionHeight-a-n,t.top+=h-i):t.top=l>0&&0>=h?n:h>l?n+a-e.collisionHeight:n:h>0?t.top+=h:l>0?t.top-=l:t.top=o(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,o=n.offset.left+n.scrollLeft,r=n.width,h=n.isWindow?n.scrollLeft:n.offset.left,l=t.left-e.collisionPosition.marginLeft,c=l-h,u=l+e.collisionWidth-r-h,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-r-o,(0>i||a(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-h,(s>0||u>a(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,o=n.offset.top+n.scrollTop,r=n.height,h=n.isWindow?n.scrollTop:n.offset.top,l=t.top-e.collisionPosition.marginTop,c=l-h,u=l+e.collisionHeight-r-h,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,g=-2*e.offset[1];0>c?(s=t.top+p+f+g+e.collisionHeight-r-o,(0>s||a(c)>s)&&(t.top+=p+f+g)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+g-h,(i>0||u>a(i))&&(t.top+=p+f+g))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}}}(),t.ui.position,t.extend(t.expr[":"],{data:t.expr.createPseudo?t.expr.createPseudo(function(e){return function(i){return!!t.data(i,e)}}):function(e,i,s){return!!t.data(e,s[3])}}),t.fn.extend({disableSelection:function(){var t="onselectstart"in document.createElement("div")?"selectstart":"mousedown";return function(){return this.on(t+".ui-disableSelection",function(t){t.preventDefault()})}}(),enableSelection:function(){return this.off(".ui-disableSelection")}});var c="ui-effects-",u="ui-effects-style",d="ui-effects-animated",p=t;t.effects={effect:{}},function(t,e){function i(t,e,i){var s=u[e.type]||{};return null==t?i||!e.def?null:e.def:(t=s.floor?~~t:parseFloat(t),isNaN(t)?e.def:s.mod?(t+s.mod)%s.mod:0>t?0:t>s.max?s.max:t)}function s(i){var s=l(),n=s._rgba=[];return i=i.toLowerCase(),f(h,function(t,o){var a,r=o.re.exec(i),h=r&&o.parse(r),l=o.space||"rgba";return h?(a=s[l](h),s[c[l].cache]=a[c[l].cache],n=s._rgba=a._rgba,!1):e}),n.length?("0,0,0,0"===n.join()&&t.extend(n,o.transparent),s):o[i]}function n(t,e,i){return i=(i+1)%1,1>6*i?t+6*(e-t)*i:1>2*i?e:2>3*i?t+6*(e-t)*(2/3-i):t}var o,a="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",r=/^([\-+])=\s*(\d+\.?\d*)/,h=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[t[1],t[2],t[3],t[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[2.55*t[1],2.55*t[2],2.55*t[3],t[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(t){return[t[1],t[2]/100,t[3]/100,t[4]]}}],l=t.Color=function(e,i,s,n){return new t.Color.fn.parse(e,i,s,n)},c={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},u={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},d=l.support={},p=t("<p>")[0],f=t.each;p.style.cssText="background-color:rgba(1,1,1,.5)",d.rgba=p.style.backgroundColor.indexOf("rgba")>-1,f(c,function(t,e){e.cache="_"+t,e.props.alpha={idx:3,type:"percent",def:1}}),l.fn=t.extend(l.prototype,{parse:function(n,a,r,h){if(n===e)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=t(n).css(a),a=e);var u=this,d=t.type(n),p=this._rgba=[];return a!==e&&(n=[n,a,r,h],d="array"),"string"===d?this.parse(s(n)||o._default):"array"===d?(f(c.rgba.props,function(t,e){p[e.idx]=i(n[e.idx],e)}),this):"object"===d?(n instanceof l?f(c,function(t,e){n[e.cache]&&(u[e.cache]=n[e.cache].slice())}):f(c,function(e,s){var o=s.cache;f(s.props,function(t,e){if(!u[o]&&s.to){if("alpha"===t||null==n[t])return;u[o]=s.to(u._rgba)}u[o][e.idx]=i(n[t],e,!0)}),u[o]&&0>t.inArray(null,u[o].slice(0,3))&&(u[o][3]=1,s.from&&(u._rgba=s.from(u[o])))}),this):e},is:function(t){var i=l(t),s=!0,n=this;return f(c,function(t,o){var a,r=i[o.cache];return r&&(a=n[o.cache]||o.to&&o.to(n._rgba)||[],f(o.props,function(t,i){return null!=r[i.idx]?s=r[i.idx]===a[i.idx]:e})),s}),s},_space:function(){var t=[],e=this;return f(c,function(i,s){e[s.cache]&&t.push(i)}),t.pop()},transition:function(t,e){var s=l(t),n=s._space(),o=c[n],a=0===this.alpha()?l("transparent"):this,r=a[o.cache]||o.to(a._rgba),h=r.slice();return s=s[o.cache],f(o.props,function(t,n){var o=n.idx,a=r[o],l=s[o],c=u[n.type]||{};null!==l&&(null===a?h[o]=l:(c.mod&&(l-a>c.mod/2?a+=c.mod:a-l>c.mod/2&&(a-=c.mod)),h[o]=i((l-a)*e+a,n)))}),this[n](h)},blend:function(e){if(1===this._rgba[3])return this;var i=this._rgba.slice(),s=i.pop(),n=l(e)._rgba;return l(t.map(i,function(t,e){return(1-s)*n[e]+s*t}))},toRgbaString:function(){var e="rgba(",i=t.map(this._rgba,function(t,e){return null==t?e>2?1:0:t});return 1===i[3]&&(i.pop(),e="rgb("),e+i.join()+")"},toHslaString:function(){var e="hsla(",i=t.map(this.hsla(),function(t,e){return null==t&&(t=e>2?1:0),e&&3>e&&(t=Math.round(100*t)+"%"),t});return 1===i[3]&&(i.pop(),e="hsl("),e+i.join()+")"},toHexString:function(e){var i=this._rgba.slice(),s=i.pop();return e&&i.push(~~(255*s)),"#"+t.map(i,function(t){return t=(t||0).toString(16),1===t.length?"0"+t:t}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),l.fn.parse.prototype=l.fn,c.hsla.to=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e,i,s=t[0]/255,n=t[1]/255,o=t[2]/255,a=t[3],r=Math.max(s,n,o),h=Math.min(s,n,o),l=r-h,c=r+h,u=.5*c;return e=h===r?0:s===r?60*(n-o)/l+360:n===r?60*(o-s)/l+120:60*(s-n)/l+240,i=0===l?0:.5>=u?l/c:l/(2-c),[Math.round(e)%360,i,u,null==a?1:a]},c.hsla.from=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e=t[0]/360,i=t[1],s=t[2],o=t[3],a=.5>=s?s*(1+i):s+i-s*i,r=2*s-a;return[Math.round(255*n(r,a,e+1/3)),Math.round(255*n(r,a,e)),Math.round(255*n(r,a,e-1/3)),o]},f(c,function(s,n){var o=n.props,a=n.cache,h=n.to,c=n.from;l.fn[s]=function(s){if(h&&!this[a]&&(this[a]=h(this._rgba)),s===e)return this[a].slice();var n,r=t.type(s),u="array"===r||"object"===r?s:arguments,d=this[a].slice();return f(o,function(t,e){var s=u["object"===r?t:e.idx];null==s&&(s=d[e.idx]),d[e.idx]=i(s,e)}),c?(n=l(c(d)),n[a]=d,n):l(d)},f(o,function(e,i){l.fn[e]||(l.fn[e]=function(n){var o,a=t.type(n),h="alpha"===e?this._hsla?"hsla":"rgba":s,l=this[h](),c=l[i.idx];return"undefined"===a?c:("function"===a&&(n=n.call(this,c),a=t.type(n)),null==n&&i.empty?this:("string"===a&&(o=r.exec(n),o&&(n=c+parseFloat(o[2])*("+"===o[1]?1:-1))),l[i.idx]=n,this[h](l)))})})}),l.hook=function(e){var i=e.split(" ");f(i,function(e,i){t.cssHooks[i]={set:function(e,n){var o,a,r="";if("transparent"!==n&&("string"!==t.type(n)||(o=s(n)))){if(n=l(o||n),!d.rgba&&1!==n._rgba[3]){for(a="backgroundColor"===i?e.parentNode:e;(""===r||"transparent"===r)&&a&&a.style;)try{r=t.css(a,"backgroundColor"),a=a.parentNode}catch(h){}n=n.blend(r&&"transparent"!==r?r:"_default")}n=n.toRgbaString()}try{e.style[i]=n}catch(h){}}},t.fx.step[i]=function(e){e.colorInit||(e.start=l(e.elem,i),e.end=l(e.end),e.colorInit=!0),t.cssHooks[i].set(e.elem,e.start.transition(e.end,e.pos))}})},l.hook(a),t.cssHooks.borderColor={expand:function(t){var e={};return f(["Top","Right","Bottom","Left"],function(i,s){e["border"+s+"Color"]=t}),e}},o=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(p),function(){function e(e){var i,s,n=e.ownerDocument.defaultView?e.ownerDocument.defaultView.getComputedStyle(e,null):e.currentStyle,o={};if(n&&n.length&&n[0]&&n[n[0]])for(s=n.length;s--;)i=n[s],"string"==typeof n[i]&&(o[t.camelCase(i)]=n[i]);else for(i in n)"string"==typeof n[i]&&(o[i]=n[i]);return o}function i(e,i){var s,o,a={};for(s in i)o=i[s],e[s]!==o&&(n[s]||(t.fx.step[s]||!isNaN(parseFloat(o)))&&(a[s]=o));return a}var s=["add","remove","toggle"],n={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};t.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(e,i){t.fx.step[i]=function(t){("none"!==t.end&&!t.setAttr||1===t.pos&&!t.setAttr)&&(p.style(t.elem,i,t.end),t.setAttr=!0)}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.effects.animateClass=function(n,o,a,r){var h=t.speed(o,a,r);return this.queue(function(){var o,a=t(this),r=a.attr("class")||"",l=h.children?a.find("*").addBack():a;l=l.map(function(){var i=t(this);return{el:i,start:e(this)}}),o=function(){t.each(s,function(t,e){n[e]&&a[e+"Class"](n[e])})},o(),l=l.map(function(){return this.end=e(this.el[0]),this.diff=i(this.start,this.end),this}),a.attr("class",r),l=l.map(function(){var e=this,i=t.Deferred(),s=t.extend({},h,{queue:!1,complete:function(){i.resolve(e)}});return this.el.animate(this.diff,s),i.promise()}),t.when.apply(t,l.get()).done(function(){o(),t.each(arguments,function(){var e=this.el;t.each(this.diff,function(t){e.css(t,"")})}),h.complete.call(a[0])})})},t.fn.extend({addClass:function(e){return function(i,s,n,o){return s?t.effects.animateClass.call(this,{add:i},s,n,o):e.apply(this,arguments)}}(t.fn.addClass),removeClass:function(e){return function(i,s,n,o){return arguments.length>1?t.effects.animateClass.call(this,{remove:i},s,n,o):e.apply(this,arguments)}}(t.fn.removeClass),toggleClass:function(e){return function(i,s,n,o,a){return"boolean"==typeof s||void 0===s?n?t.effects.animateClass.call(this,s?{add:i}:{remove:i},n,o,a):e.apply(this,arguments):t.effects.animateClass.call(this,{toggle:i},s,n,o)}}(t.fn.toggleClass),switchClass:function(e,i,s,n,o){return t.effects.animateClass.call(this,{add:i,remove:e},s,n,o)}})}(),function(){function e(e,i,s,n){return t.isPlainObject(e)&&(i=e,e=e.effect),e={effect:e},null==i&&(i={}),t.isFunction(i)&&(n=i,s=null,i={}),("number"==typeof i||t.fx.speeds[i])&&(n=s,s=i,i={}),t.isFunction(s)&&(n=s,s=null),i&&t.extend(e,i),s=s||i.duration,e.duration=t.fx.off?0:"number"==typeof s?s:s in t.fx.speeds?t.fx.speeds[s]:t.fx.speeds._default,e.complete=n||i.complete,e}function i(e){return!e||"number"==typeof e||t.fx.speeds[e]?!0:"string"!=typeof e||t.effects.effect[e]?t.isFunction(e)?!0:"object"!=typeof e||e.effect?!1:!0:!0}function s(t,e){var i=e.outerWidth(),s=e.outerHeight(),n=/^rect\((-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto)\)$/,o=n.exec(t)||["",0,i,s,0];return{top:parseFloat(o[1])||0,right:"auto"===o[2]?i:parseFloat(o[2]),bottom:"auto"===o[3]?s:parseFloat(o[3]),left:parseFloat(o[4])||0}}t.expr&&t.expr.filters&&t.expr.filters.animated&&(t.expr.filters.animated=function(e){return function(i){return!!t(i).data(d)||e(i)}}(t.expr.filters.animated)),t.uiBackCompat!==!1&&t.extend(t.effects,{save:function(t,e){for(var i=0,s=e.length;s>i;i++)null!==e[i]&&t.data(c+e[i],t[0].style[e[i]])},restore:function(t,e){for(var i,s=0,n=e.length;n>s;s++)null!==e[s]&&(i=t.data(c+e[s]),t.css(e[s],i))},setMode:function(t,e){return"toggle"===e&&(e=t.is(":hidden")?"show":"hide"),e},createWrapper:function(e){if(e.parent().is(".ui-effects-wrapper"))return e.parent();var i={width:e.outerWidth(!0),height:e.outerHeight(!0),"float":e.css("float")},s=t("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),n={width:e.width(),height:e.height()},o=document.activeElement;try{o.id}catch(a){o=document.body}return e.wrap(s),(e[0]===o||t.contains(e[0],o))&&t(o).trigger("focus"),s=e.parent(),"static"===e.css("position")?(s.css({position:"relative"}),e.css({position:"relative"})):(t.extend(i,{position:e.css("position"),zIndex:e.css("z-index")}),t.each(["top","left","bottom","right"],function(t,s){i[s]=e.css(s),isNaN(parseInt(i[s],10))&&(i[s]="auto")}),e.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),e.css(n),s.css(i).show()},removeWrapper:function(e){var i=document.activeElement;return e.parent().is(".ui-effects-wrapper")&&(e.parent().replaceWith(e),(e[0]===i||t.contains(e[0],i))&&t(i).trigger("focus")),e}}),t.extend(t.effects,{version:"1.12.1",define:function(e,i,s){return s||(s=i,i="effect"),t.effects.effect[e]=s,t.effects.effect[e].mode=i,s},scaledDimensions:function(t,e,i){if(0===e)return{height:0,width:0,outerHeight:0,outerWidth:0};var s="horizontal"!==i?(e||100)/100:1,n="vertical"!==i?(e||100)/100:1;return{height:t.height()*n,width:t.width()*s,outerHeight:t.outerHeight()*n,outerWidth:t.outerWidth()*s}},clipToBox:function(t){return{width:t.clip.right-t.clip.left,height:t.clip.bottom-t.clip.top,left:t.clip.left,top:t.clip.top}},unshift:function(t,e,i){var s=t.queue();e>1&&s.splice.apply(s,[1,0].concat(s.splice(e,i))),t.dequeue()},saveStyle:function(t){t.data(u,t[0].style.cssText)},restoreStyle:function(t){t[0].style.cssText=t.data(u)||"",t.removeData(u)},mode:function(t,e){var i=t.is(":hidden");return"toggle"===e&&(e=i?"show":"hide"),(i?"hide"===e:"show"===e)&&(e="none"),e},getBaseline:function(t,e){var i,s;switch(t[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=t[0]/e.height}switch(t[1]){case"left":s=0;break;case"center":s=.5;break;case"right":s=1;break;default:s=t[1]/e.width}return{x:s,y:i}},createPlaceholder:function(e){var i,s=e.css("position"),n=e.position();return e.css({marginTop:e.css("marginTop"),marginBottom:e.css("marginBottom"),marginLeft:e.css("marginLeft"),marginRight:e.css("marginRight")}).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()),/^(static|relative)/.test(s)&&(s="absolute",i=t("<"+e[0].nodeName+">").insertAfter(e).css({display:/^(inline|ruby)/.test(e.css("display"))?"inline-block":"block",visibility:"hidden",marginTop:e.css("marginTop"),marginBottom:e.css("marginBottom"),marginLeft:e.css("marginLeft"),marginRight:e.css("marginRight"),"float":e.css("float")}).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).addClass("ui-effects-placeholder"),e.data(c+"placeholder",i)),e.css({position:s,left:n.left,top:n.top}),i},removePlaceholder:function(t){var e=c+"placeholder",i=t.data(e);i&&(i.remove(),t.removeData(e))},cleanUp:function(e){t.effects.restoreStyle(e),t.effects.removePlaceholder(e)},setTransition:function(e,i,s,n){return n=n||{},t.each(i,function(t,i){var o=e.cssUnit(i);o[0]>0&&(n[i]=o[0]*s+o[1])}),n}}),t.fn.extend({effect:function(){function i(e){function i(){r.removeData(d),t.effects.cleanUp(r),"hide"===s.mode&&r.hide(),a()}function a(){t.isFunction(h)&&h.call(r[0]),t.isFunction(e)&&e()}var r=t(this);s.mode=c.shift(),t.uiBackCompat===!1||o?"none"===s.mode?(r[l](),a()):n.call(r[0],s,i):(r.is(":hidden")?"hide"===l:"show"===l)?(r[l](),a()):n.call(r[0],s,a)}var s=e.apply(this,arguments),n=t.effects.effect[s.effect],o=n.mode,a=s.queue,r=a||"fx",h=s.complete,l=s.mode,c=[],u=function(e){var i=t(this),s=t.effects.mode(i,l)||o;i.data(d,!0),c.push(s),o&&("show"===s||s===o&&"hide"===s)&&i.show(),o&&"none"===s||t.effects.saveStyle(i),t.isFunction(e)&&e()};return t.fx.off||!n?l?this[l](s.duration,h):this.each(function(){h&&h.call(this)}):a===!1?this.each(u).each(i):this.queue(r,u).queue(r,i)},show:function(t){return function(s){if(i(s))return t.apply(this,arguments);var n=e.apply(this,arguments);return n.mode="show",this.effect.call(this,n)
}}(t.fn.show),hide:function(t){return function(s){if(i(s))return t.apply(this,arguments);var n=e.apply(this,arguments);return n.mode="hide",this.effect.call(this,n)}}(t.fn.hide),toggle:function(t){return function(s){if(i(s)||"boolean"==typeof s)return t.apply(this,arguments);var n=e.apply(this,arguments);return n.mode="toggle",this.effect.call(this,n)}}(t.fn.toggle),cssUnit:function(e){var i=this.css(e),s=[];return t.each(["em","px","%","pt"],function(t,e){i.indexOf(e)>0&&(s=[parseFloat(i),e])}),s},cssClip:function(t){return t?this.css("clip","rect("+t.top+"px "+t.right+"px "+t.bottom+"px "+t.left+"px)"):s(this.css("clip"),this)},transfer:function(e,i){var s=t(this),n=t(e.to),o="fixed"===n.css("position"),a=t("body"),r=o?a.scrollTop():0,h=o?a.scrollLeft():0,l=n.offset(),c={top:l.top-r,left:l.left-h,height:n.innerHeight(),width:n.innerWidth()},u=s.offset(),d=t("<div class='ui-effects-transfer'></div>").appendTo("body").addClass(e.className).css({top:u.top-r,left:u.left-h,height:s.innerHeight(),width:s.innerWidth(),position:o?"fixed":"absolute"}).animate(c,e.duration,e.easing,function(){d.remove(),t.isFunction(i)&&i()})}}),t.fx.step.clip=function(e){e.clipInit||(e.start=t(e.elem).cssClip(),"string"==typeof e.end&&(e.end=s(e.end,e.elem)),e.clipInit=!0),t(e.elem).cssClip({top:e.pos*(e.end.top-e.start.top)+e.start.top,right:e.pos*(e.end.right-e.start.right)+e.start.right,bottom:e.pos*(e.end.bottom-e.start.bottom)+e.start.bottom,left:e.pos*(e.end.left-e.start.left)+e.start.left})}}(),function(){var e={};t.each(["Quad","Cubic","Quart","Quint","Expo"],function(t,i){e[i]=function(e){return Math.pow(e,t+2)}}),t.extend(e,{Sine:function(t){return 1-Math.cos(t*Math.PI/2)},Circ:function(t){return 1-Math.sqrt(1-t*t)},Elastic:function(t){return 0===t||1===t?t:-Math.pow(2,8*(t-1))*Math.sin((80*(t-1)-7.5)*Math.PI/15)},Back:function(t){return t*t*(3*t-2)},Bounce:function(t){for(var e,i=4;((e=Math.pow(2,--i))-1)/11>t;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*e-2)/22-t,2)}}),t.each(e,function(e,i){t.easing["easeIn"+e]=i,t.easing["easeOut"+e]=function(t){return 1-i(1-t)},t.easing["easeInOut"+e]=function(t){return.5>t?i(2*t)/2:1-i(-2*t+2)/2}})}();var f=t.effects;t.effects.define("blind","hide",function(e,i){var s={up:["bottom","top"],vertical:["bottom","top"],down:["top","bottom"],left:["right","left"],horizontal:["right","left"],right:["left","right"]},n=t(this),o=e.direction||"up",a=n.cssClip(),r={clip:t.extend({},a)},h=t.effects.createPlaceholder(n);r.clip[s[o][0]]=r.clip[s[o][1]],"show"===e.mode&&(n.cssClip(r.clip),h&&h.css(t.effects.clipToBox(r)),r.clip=a),h&&h.animate(t.effects.clipToBox(r),e.duration,e.easing),n.animate(r,{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("bounce",function(e,i){var s,n,o,a=t(this),r=e.mode,h="hide"===r,l="show"===r,c=e.direction||"up",u=e.distance,d=e.times||5,p=2*d+(l||h?1:0),f=e.duration/p,g=e.easing,m="up"===c||"down"===c?"top":"left",_="up"===c||"left"===c,v=0,b=a.queue().length;for(t.effects.createPlaceholder(a),o=a.css(m),u||(u=a["top"===m?"outerHeight":"outerWidth"]()/3),l&&(n={opacity:1},n[m]=o,a.css("opacity",0).css(m,_?2*-u:2*u).animate(n,f,g)),h&&(u/=Math.pow(2,d-1)),n={},n[m]=o;d>v;v++)s={},s[m]=(_?"-=":"+=")+u,a.animate(s,f,g).animate(n,f,g),u=h?2*u:u/2;h&&(s={opacity:0},s[m]=(_?"-=":"+=")+u,a.animate(s,f,g)),a.queue(i),t.effects.unshift(a,b,p+1)}),t.effects.define("clip","hide",function(e,i){var s,n={},o=t(this),a=e.direction||"vertical",r="both"===a,h=r||"horizontal"===a,l=r||"vertical"===a;s=o.cssClip(),n.clip={top:l?(s.bottom-s.top)/2:s.top,right:h?(s.right-s.left)/2:s.right,bottom:l?(s.bottom-s.top)/2:s.bottom,left:h?(s.right-s.left)/2:s.left},t.effects.createPlaceholder(o),"show"===e.mode&&(o.cssClip(n.clip),n.clip=s),o.animate(n,{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("drop","hide",function(e,i){var s,n=t(this),o=e.mode,a="show"===o,r=e.direction||"left",h="up"===r||"down"===r?"top":"left",l="up"===r||"left"===r?"-=":"+=",c="+="===l?"-=":"+=",u={opacity:0};t.effects.createPlaceholder(n),s=e.distance||n["top"===h?"outerHeight":"outerWidth"](!0)/2,u[h]=l+s,a&&(n.css(u),u[h]=c+s,u.opacity=1),n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("explode","hide",function(e,i){function s(){b.push(this),b.length===u*d&&n()}function n(){p.css({visibility:"visible"}),t(b).remove(),i()}var o,a,r,h,l,c,u=e.pieces?Math.round(Math.sqrt(e.pieces)):3,d=u,p=t(this),f=e.mode,g="show"===f,m=p.show().css("visibility","hidden").offset(),_=Math.ceil(p.outerWidth()/d),v=Math.ceil(p.outerHeight()/u),b=[];for(o=0;u>o;o++)for(h=m.top+o*v,c=o-(u-1)/2,a=0;d>a;a++)r=m.left+a*_,l=a-(d-1)/2,p.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-a*_,top:-o*v}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:_,height:v,left:r+(g?l*_:0),top:h+(g?c*v:0),opacity:g?0:1}).animate({left:r+(g?0:l*_),top:h+(g?0:c*v),opacity:g?1:0},e.duration||500,e.easing,s)}),t.effects.define("fade","toggle",function(e,i){var s="show"===e.mode;t(this).css("opacity",s?0:1).animate({opacity:s?1:0},{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("fold","hide",function(e,i){var s=t(this),n=e.mode,o="show"===n,a="hide"===n,r=e.size||15,h=/([0-9]+)%/.exec(r),l=!!e.horizFirst,c=l?["right","bottom"]:["bottom","right"],u=e.duration/2,d=t.effects.createPlaceholder(s),p=s.cssClip(),f={clip:t.extend({},p)},g={clip:t.extend({},p)},m=[p[c[0]],p[c[1]]],_=s.queue().length;h&&(r=parseInt(h[1],10)/100*m[a?0:1]),f.clip[c[0]]=r,g.clip[c[0]]=r,g.clip[c[1]]=0,o&&(s.cssClip(g.clip),d&&d.css(t.effects.clipToBox(g)),g.clip=p),s.queue(function(i){d&&d.animate(t.effects.clipToBox(f),u,e.easing).animate(t.effects.clipToBox(g),u,e.easing),i()}).animate(f,u,e.easing).animate(g,u,e.easing).queue(i),t.effects.unshift(s,_,4)}),t.effects.define("highlight","show",function(e,i){var s=t(this),n={backgroundColor:s.css("backgroundColor")};"hide"===e.mode&&(n.opacity=0),t.effects.saveStyle(s),s.css({backgroundImage:"none",backgroundColor:e.color||"#ffff99"}).animate(n,{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("size",function(e,i){var s,n,o,a=t(this),r=["fontSize"],h=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],l=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],c=e.mode,u="effect"!==c,d=e.scale||"both",p=e.origin||["middle","center"],f=a.css("position"),g=a.position(),m=t.effects.scaledDimensions(a),_=e.from||m,v=e.to||t.effects.scaledDimensions(a,0);t.effects.createPlaceholder(a),"show"===c&&(o=_,_=v,v=o),n={from:{y:_.height/m.height,x:_.width/m.width},to:{y:v.height/m.height,x:v.width/m.width}},("box"===d||"both"===d)&&(n.from.y!==n.to.y&&(_=t.effects.setTransition(a,h,n.from.y,_),v=t.effects.setTransition(a,h,n.to.y,v)),n.from.x!==n.to.x&&(_=t.effects.setTransition(a,l,n.from.x,_),v=t.effects.setTransition(a,l,n.to.x,v))),("content"===d||"both"===d)&&n.from.y!==n.to.y&&(_=t.effects.setTransition(a,r,n.from.y,_),v=t.effects.setTransition(a,r,n.to.y,v)),p&&(s=t.effects.getBaseline(p,m),_.top=(m.outerHeight-_.outerHeight)*s.y+g.top,_.left=(m.outerWidth-_.outerWidth)*s.x+g.left,v.top=(m.outerHeight-v.outerHeight)*s.y+g.top,v.left=(m.outerWidth-v.outerWidth)*s.x+g.left),a.css(_),("content"===d||"both"===d)&&(h=h.concat(["marginTop","marginBottom"]).concat(r),l=l.concat(["marginLeft","marginRight"]),a.find("*[width]").each(function(){var i=t(this),s=t.effects.scaledDimensions(i),o={height:s.height*n.from.y,width:s.width*n.from.x,outerHeight:s.outerHeight*n.from.y,outerWidth:s.outerWidth*n.from.x},a={height:s.height*n.to.y,width:s.width*n.to.x,outerHeight:s.height*n.to.y,outerWidth:s.width*n.to.x};n.from.y!==n.to.y&&(o=t.effects.setTransition(i,h,n.from.y,o),a=t.effects.setTransition(i,h,n.to.y,a)),n.from.x!==n.to.x&&(o=t.effects.setTransition(i,l,n.from.x,o),a=t.effects.setTransition(i,l,n.to.x,a)),u&&t.effects.saveStyle(i),i.css(o),i.animate(a,e.duration,e.easing,function(){u&&t.effects.restoreStyle(i)})})),a.animate(v,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){var e=a.offset();0===v.opacity&&a.css("opacity",_.opacity),u||(a.css("position","static"===f?"relative":f).offset(e),t.effects.saveStyle(a)),i()}})}),t.effects.define("scale",function(e,i){var s=t(this),n=e.mode,o=parseInt(e.percent,10)||(0===parseInt(e.percent,10)?0:"effect"!==n?0:100),a=t.extend(!0,{from:t.effects.scaledDimensions(s),to:t.effects.scaledDimensions(s,o,e.direction||"both"),origin:e.origin||["middle","center"]},e);e.fade&&(a.from.opacity=1,a.to.opacity=0),t.effects.effect.size.call(this,a,i)}),t.effects.define("puff","hide",function(e,i){var s=t.extend(!0,{},e,{fade:!0,percent:parseInt(e.percent,10)||150});t.effects.effect.scale.call(this,s,i)}),t.effects.define("pulsate","show",function(e,i){var s=t(this),n=e.mode,o="show"===n,a="hide"===n,r=o||a,h=2*(e.times||5)+(r?1:0),l=e.duration/h,c=0,u=1,d=s.queue().length;for((o||!s.is(":visible"))&&(s.css("opacity",0).show(),c=1);h>u;u++)s.animate({opacity:c},l,e.easing),c=1-c;s.animate({opacity:c},l,e.easing),s.queue(i),t.effects.unshift(s,d,h+1)}),t.effects.define("shake",function(e,i){var s=1,n=t(this),o=e.direction||"left",a=e.distance||20,r=e.times||3,h=2*r+1,l=Math.round(e.duration/h),c="up"===o||"down"===o?"top":"left",u="up"===o||"left"===o,d={},p={},f={},g=n.queue().length;for(t.effects.createPlaceholder(n),d[c]=(u?"-=":"+=")+a,p[c]=(u?"+=":"-=")+2*a,f[c]=(u?"-=":"+=")+2*a,n.animate(d,l,e.easing);r>s;s++)n.animate(p,l,e.easing).animate(f,l,e.easing);n.animate(p,l,e.easing).animate(d,l/2,e.easing).queue(i),t.effects.unshift(n,g,h+1)}),t.effects.define("slide","show",function(e,i){var s,n,o=t(this),a={up:["bottom","top"],down:["top","bottom"],left:["right","left"],right:["left","right"]},r=e.mode,h=e.direction||"left",l="up"===h||"down"===h?"top":"left",c="up"===h||"left"===h,u=e.distance||o["top"===l?"outerHeight":"outerWidth"](!0),d={};t.effects.createPlaceholder(o),s=o.cssClip(),n=o.position()[l],d[l]=(c?-1:1)*u+n,d.clip=o.cssClip(),d.clip[a[h][1]]=d.clip[a[h][0]],"show"===r&&(o.cssClip(d.clip),o.css(l,d[l]),d.clip=s,d[l]=n),o.animate(d,{queue:!1,duration:e.duration,easing:e.easing,complete:i})});var f;t.uiBackCompat!==!1&&(f=t.effects.define("transfer",function(e,i){t(this).transfer(e,i)})),t.ui.focusable=function(i,s){var n,o,a,r,h,l=i.nodeName.toLowerCase();return"area"===l?(n=i.parentNode,o=n.name,i.href&&o&&"map"===n.nodeName.toLowerCase()?(a=t("img[usemap='#"+o+"']"),a.length>0&&a.is(":visible")):!1):(/^(input|select|textarea|button|object)$/.test(l)?(r=!i.disabled,r&&(h=t(i).closest("fieldset")[0],h&&(r=!h.disabled))):r="a"===l?i.href||s:s,r&&t(i).is(":visible")&&e(t(i)))},t.extend(t.expr[":"],{focusable:function(e){return t.ui.focusable(e,null!=t.attr(e,"tabindex"))}}),t.ui.focusable,t.fn.form=function(){return"string"==typeof this[0].form?this.closest("form"):t(this[0].form)},t.ui.formResetMixin={_formResetHandler:function(){var e=t(this);setTimeout(function(){var i=e.data("ui-form-reset-instances");t.each(i,function(){this.refresh()})})},_bindFormResetHandler:function(){if(this.form=this.element.form(),this.form.length){var t=this.form.data("ui-form-reset-instances")||[];t.length||this.form.on("reset.ui-form-reset",this._formResetHandler),t.push(this),this.form.data("ui-form-reset-instances",t)}},_unbindFormResetHandler:function(){if(this.form.length){var e=this.form.data("ui-form-reset-instances");e.splice(t.inArray(this,e),1),e.length?this.form.data("ui-form-reset-instances",e):this.form.removeData("ui-form-reset-instances").off("reset.ui-form-reset")}}},"1.7"===t.fn.jquery.substring(0,3)&&(t.each(["Width","Height"],function(e,i){function s(e,i,s,o){return t.each(n,function(){i-=parseFloat(t.css(e,"padding"+this))||0,s&&(i-=parseFloat(t.css(e,"border"+this+"Width"))||0),o&&(i-=parseFloat(t.css(e,"margin"+this))||0)}),i}var n="Width"===i?["Left","Right"]:["Top","Bottom"],o=i.toLowerCase(),a={innerWidth:t.fn.innerWidth,innerHeight:t.fn.innerHeight,outerWidth:t.fn.outerWidth,outerHeight:t.fn.outerHeight};t.fn["inner"+i]=function(e){return void 0===e?a["inner"+i].call(this):this.each(function(){t(this).css(o,s(this,e)+"px")})},t.fn["outer"+i]=function(e,n){return"number"!=typeof e?a["outer"+i].call(this,e):this.each(function(){t(this).css(o,s(this,e,!0,n)+"px")})}}),t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.ui.keyCode={BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38},t.ui.escapeSelector=function(){var t=/([!"#$%&'()*+,.\/:;<=>?@[\]^`{|}~])/g;return function(e){return e.replace(t,"\\$1")}}(),t.fn.labels=function(){var e,i,s,n,o;return this[0].labels&&this[0].labels.length?this.pushStack(this[0].labels):(n=this.eq(0).parents("label"),s=this.attr("id"),s&&(e=this.eq(0).parents().last(),o=e.add(e.length?e.siblings():this.siblings()),i="label[for='"+t.ui.escapeSelector(s)+"']",n=n.add(o.find(i).addBack(i))),this.pushStack(n))},t.fn.scrollParent=function(e){var i=this.css("position"),s="absolute"===i,n=e?/(auto|scroll|hidden)/:/(auto|scroll)/,o=this.parents().filter(function(){var e=t(this);return s&&"static"===e.css("position")?!1:n.test(e.css("overflow")+e.css("overflow-y")+e.css("overflow-x"))}).eq(0);return"fixed"!==i&&o.length?o:t(this[0].ownerDocument||document)},t.extend(t.expr[":"],{tabbable:function(e){var i=t.attr(e,"tabindex"),s=null!=i;return(!s||i>=0)&&t.ui.focusable(e,s)}}),t.fn.extend({uniqueId:function(){var t=0;return function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++t)})}}(),removeUniqueId:function(){return this.each(function(){/^ui-id-\d+$/.test(this.id)&&t(this).removeAttr("id")})}}),t.widget("ui.accordion",{version:"1.12.1",options:{active:0,animate:{},classes:{"ui-accordion-header":"ui-corner-top","ui-accordion-header-collapsed":"ui-corner-all","ui-accordion-content":"ui-corner-bottom"},collapsible:!1,event:"click",header:"> li > :first-child, > :not(li):even",heightStyle:"auto",icons:{activeHeader:"ui-icon-triangle-1-s",header:"ui-icon-triangle-1-e"},activate:null,beforeActivate:null},hideProps:{borderTopWidth:"hide",borderBottomWidth:"hide",paddingTop:"hide",paddingBottom:"hide",height:"hide"},showProps:{borderTopWidth:"show",borderBottomWidth:"show",paddingTop:"show",paddingBottom:"show",height:"show"},_create:function(){var e=this.options;this.prevShow=this.prevHide=t(),this._addClass("ui-accordion","ui-widget ui-helper-reset"),this.element.attr("role","tablist"),e.collapsible||e.active!==!1&&null!=e.active||(e.active=0),this._processPanels(),0>e.active&&(e.active+=this.headers.length),this._refresh()},_getCreateEventData:function(){return{header:this.active,panel:this.active.length?this.active.next():t()}},_createIcons:function(){var e,i,s=this.options.icons;s&&(e=t("<span>"),this._addClass(e,"ui-accordion-header-icon","ui-icon "+s.header),e.prependTo(this.headers),i=this.active.children(".ui-accordion-header-icon"),this._removeClass(i,s.header)._addClass(i,null,s.activeHeader)._addClass(this.headers,"ui-accordion-icons"))},_destroyIcons:function(){this._removeClass(this.headers,"ui-accordion-icons"),this.headers.children(".ui-accordion-header-icon").remove()},_destroy:function(){var t;this.element.removeAttr("role"),this.headers.removeAttr("role aria-expanded aria-selected aria-controls tabIndex").removeUniqueId(),this._destroyIcons(),t=this.headers.next().css("display","").removeAttr("role aria-hidden aria-labelledby").removeUniqueId(),"content"!==this.options.heightStyle&&t.css("height","")},_setOption:function(t,e){return"active"===t?(this._activate(e),void 0):("event"===t&&(this.options.event&&this._off(this.headers,this.options.event),this._setupEvents(e)),this._super(t,e),"collapsible"!==t||e||this.options.active!==!1||this._activate(0),"icons"===t&&(this._destroyIcons(),e&&this._createIcons()),void 0)},_setOptionDisabled:function(t){this._super(t),this.element.attr("aria-disabled",t),this._toggleClass(null,"ui-state-disabled",!!t),this._toggleClass(this.headers.add(this.headers.next()),null,"ui-state-disabled",!!t)},_keydown:function(e){if(!e.altKey&&!e.ctrlKey){var i=t.ui.keyCode,s=this.headers.length,n=this.headers.index(e.target),o=!1;switch(e.keyCode){case i.RIGHT:case i.DOWN:o=this.headers[(n+1)%s];break;case i.LEFT:case i.UP:o=this.headers[(n-1+s)%s];break;case i.SPACE:case i.ENTER:this._eventHandler(e);break;case i.HOME:o=this.headers[0];break;case i.END:o=this.headers[s-1]}o&&(t(e.target).attr("tabIndex",-1),t(o).attr("tabIndex",0),t(o).trigger("focus"),e.preventDefault())}},_panelKeyDown:function(e){e.keyCode===t.ui.keyCode.UP&&e.ctrlKey&&t(e.currentTarget).prev().trigger("focus")},refresh:function(){var e=this.options;this._processPanels(),e.active===!1&&e.collapsible===!0||!this.headers.length?(e.active=!1,this.active=t()):e.active===!1?this._activate(0):this.active.length&&!t.contains(this.element[0],this.active[0])?this.headers.length===this.headers.find(".ui-state-disabled").length?(e.active=!1,this.active=t()):this._activate(Math.max(0,e.active-1)):e.active=this.headers.index(this.active),this._destroyIcons(),this._refresh()},_processPanels:function(){var t=this.headers,e=this.panels;this.headers=this.element.find(this.options.header),this._addClass(this.headers,"ui-accordion-header ui-accordion-header-collapsed","ui-state-default"),this.panels=this.headers.next().filter(":not(.ui-accordion-content-active)").hide(),this._addClass(this.panels,"ui-accordion-content","ui-helper-reset ui-widget-content"),e&&(this._off(t.not(this.headers)),this._off(e.not(this.panels)))},_refresh:function(){var e,i=this.options,s=i.heightStyle,n=this.element.parent();this.active=this._findActive(i.active),this._addClass(this.active,"ui-accordion-header-active","ui-state-active")._removeClass(this.active,"ui-accordion-header-collapsed"),this._addClass(this.active.next(),"ui-accordion-content-active"),this.active.next().show(),this.headers.attr("role","tab").each(function(){var e=t(this),i=e.uniqueId().attr("id"),s=e.next(),n=s.uniqueId().attr("id");e.attr("aria-controls",n),s.attr("aria-labelledby",i)}).next().attr("role","tabpanel"),this.headers.not(this.active).attr({"aria-selected":"false","aria-expanded":"false",tabIndex:-1}).next().attr({"aria-hidden":"true"}).hide(),this.active.length?this.active.attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0}).next().attr({"aria-hidden":"false"}):this.headers.eq(0).attr("tabIndex",0),this._createIcons(),this._setupEvents(i.event),"fill"===s?(e=n.height(),this.element.siblings(":visible").each(function(){var i=t(this),s=i.css("position");"absolute"!==s&&"fixed"!==s&&(e-=i.outerHeight(!0))}),this.headers.each(function(){e-=t(this).outerHeight(!0)}),this.headers.next().each(function(){t(this).height(Math.max(0,e-t(this).innerHeight()+t(this).height()))}).css("overflow","auto")):"auto"===s&&(e=0,this.headers.next().each(function(){var i=t(this).is(":visible");i||t(this).show(),e=Math.max(e,t(this).css("height","").height()),i||t(this).hide()}).height(e))},_activate:function(e){var i=this._findActive(e)[0];i!==this.active[0]&&(i=i||this.active[0],this._eventHandler({target:i,currentTarget:i,preventDefault:t.noop}))},_findActive:function(e){return"number"==typeof e?this.headers.eq(e):t()},_setupEvents:function(e){var i={keydown:"_keydown"};e&&t.each(e.split(" "),function(t,e){i[e]="_eventHandler"}),this._off(this.headers.add(this.headers.next())),this._on(this.headers,i),this._on(this.headers.next(),{keydown:"_panelKeyDown"}),this._hoverable(this.headers),this._focusable(this.headers)},_eventHandler:function(e){var i,s,n=this.options,o=this.active,a=t(e.currentTarget),r=a[0]===o[0],h=r&&n.collapsible,l=h?t():a.next(),c=o.next(),u={oldHeader:o,oldPanel:c,newHeader:h?t():a,newPanel:l};e.preventDefault(),r&&!n.collapsible||this._trigger("beforeActivate",e,u)===!1||(n.active=h?!1:this.headers.index(a),this.active=r?t():a,this._toggle(u),this._removeClass(o,"ui-accordion-header-active","ui-state-active"),n.icons&&(i=o.children(".ui-accordion-header-icon"),this._removeClass(i,null,n.icons.activeHeader)._addClass(i,null,n.icons.header)),r||(this._removeClass(a,"ui-accordion-header-collapsed")._addClass(a,"ui-accordion-header-active","ui-state-active"),n.icons&&(s=a.children(".ui-accordion-header-icon"),this._removeClass(s,null,n.icons.header)._addClass(s,null,n.icons.activeHeader)),this._addClass(a.next(),"ui-accordion-content-active")))},_toggle:function(e){var i=e.newPanel,s=this.prevShow.length?this.prevShow:e.oldPanel;this.prevShow.add(this.prevHide).stop(!0,!0),this.prevShow=i,this.prevHide=s,this.options.animate?this._animate(i,s,e):(s.hide(),i.show(),this._toggleComplete(e)),s.attr({"aria-hidden":"true"}),s.prev().attr({"aria-selected":"false","aria-expanded":"false"}),i.length&&s.length?s.prev().attr({tabIndex:-1,"aria-expanded":"false"}):i.length&&this.headers.filter(function(){return 0===parseInt(t(this).attr("tabIndex"),10)}).attr("tabIndex",-1),i.attr("aria-hidden","false").prev().attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0})},_animate:function(t,e,i){var s,n,o,a=this,r=0,h=t.css("box-sizing"),l=t.length&&(!e.length||t.index()<e.index()),c=this.options.animate||{},u=l&&c.down||c,d=function(){a._toggleComplete(i)};return"number"==typeof u&&(o=u),"string"==typeof u&&(n=u),n=n||u.easing||c.easing,o=o||u.duration||c.duration,e.length?t.length?(s=t.show().outerHeight(),e.animate(this.hideProps,{duration:o,easing:n,step:function(t,e){e.now=Math.round(t)}}),t.hide().animate(this.showProps,{duration:o,easing:n,complete:d,step:function(t,i){i.now=Math.round(t),"height"!==i.prop?"content-box"===h&&(r+=i.now):"content"!==a.options.heightStyle&&(i.now=Math.round(s-e.outerHeight()-r),r=0)}}),void 0):e.animate(this.hideProps,o,n,d):t.animate(this.showProps,o,n,d)},_toggleComplete:function(t){var e=t.oldPanel,i=e.prev();this._removeClass(e,"ui-accordion-content-active"),this._removeClass(i,"ui-accordion-header-active")._addClass(i,"ui-accordion-header-collapsed"),e.length&&(e.parent()[0].className=e.parent()[0].className),this._trigger("activate",null,t)}}),t.ui.safeActiveElement=function(t){var e;try{e=t.activeElement}catch(i){e=t.body}return e||(e=t.body),e.nodeName||(e=t.body),e},t.widget("ui.menu",{version:"1.12.1",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-caret-1-e"},items:"> *",menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().attr({role:this.options.role,tabIndex:0}),this._addClass("ui-menu","ui-widget ui-widget-content"),this._on({"mousedown .ui-menu-item":function(t){t.preventDefault()},"click .ui-menu-item":function(e){var i=t(e.target),s=t(t.ui.safeActiveElement(this.document[0]));!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.select(e),e.isPropagationStopped()||(this.mouseHandled=!0),i.has(".ui-menu").length?this.expand(e):!this.element.is(":focus")&&s.closest(".ui-menu").length&&(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(e){if(!this.previousFilter){var i=t(e.target).closest(".ui-menu-item"),s=t(e.currentTarget);i[0]===s[0]&&(this._removeClass(s.siblings().children(".ui-state-active"),null,"ui-state-active"),this.focus(e,s))}},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(t,e){var i=this.active||this.element.find(this.options.items).eq(0);e||this.focus(t,i)},blur:function(e){this._delay(function(){var i=!t.contains(this.element[0],t.ui.safeActiveElement(this.document[0]));i&&this.collapseAll(e)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(t){this._closeOnDocumentClick(t)&&this.collapseAll(t),this.mouseHandled=!1}})},_destroy:function(){var e=this.element.find(".ui-menu-item").removeAttr("role aria-disabled"),i=e.children(".ui-menu-item-wrapper").removeUniqueId().removeAttr("tabIndex role aria-haspopup");this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeAttr("role aria-labelledby aria-expanded aria-hidden aria-disabled tabIndex").removeUniqueId().show(),i.children().each(function(){var e=t(this);e.data("ui-menu-submenu-caret")&&e.remove()})},_keydown:function(e){var i,s,n,o,a=!0;switch(e.keyCode){case t.ui.keyCode.PAGE_UP:this.previousPage(e);break;case t.ui.keyCode.PAGE_DOWN:this.nextPage(e);break;case t.ui.keyCode.HOME:this._move("first","first",e);break;case t.ui.keyCode.END:this._move("last","last",e);break;case t.ui.keyCode.UP:this.previous(e);break;case t.ui.keyCode.DOWN:this.next(e);break;case t.ui.keyCode.LEFT:this.collapse(e);break;case t.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(e);break;case t.ui.keyCode.ENTER:case t.ui.keyCode.SPACE:this._activate(e);break;case t.ui.keyCode.ESCAPE:this.collapse(e);break;default:a=!1,s=this.previousFilter||"",o=!1,n=e.keyCode>=96&&105>=e.keyCode?""+(e.keyCode-96):String.fromCharCode(e.keyCode),clearTimeout(this.filterTimer),n===s?o=!0:n=s+n,i=this._filterMenuItems(n),i=o&&-1!==i.index(this.active.next())?this.active.nextAll(".ui-menu-item"):i,i.length||(n=String.fromCharCode(e.keyCode),i=this._filterMenuItems(n)),i.length?(this.focus(e,i),this.previousFilter=n,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter}a&&e.preventDefault()},_activate:function(t){this.active&&!this.active.is(".ui-state-disabled")&&(this.active.children("[aria-haspopup='true']").length?this.expand(t):this.select(t))},refresh:function(){var e,i,s,n,o,a=this,r=this.options.icons.submenu,h=this.element.find(this.options.menus);this._toggleClass("ui-menu-icons",null,!!this.element.find(".ui-icon").length),s=h.filter(":not(.ui-menu)").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var e=t(this),i=e.prev(),s=t("<span>").data("ui-menu-submenu-caret",!0);a._addClass(s,"ui-menu-icon","ui-icon "+r),i.attr("aria-haspopup","true").prepend(s),e.attr("aria-labelledby",i.attr("id"))}),this._addClass(s,"ui-menu","ui-widget ui-widget-content ui-front"),e=h.add(this.element),i=e.find(this.options.items),i.not(".ui-menu-item").each(function(){var e=t(this);a._isDivider(e)&&a._addClass(e,"ui-menu-divider","ui-widget-content")}),n=i.not(".ui-menu-item, .ui-menu-divider"),o=n.children().not(".ui-menu").uniqueId().attr({tabIndex:-1,role:this._itemRole()}),this._addClass(n,"ui-menu-item")._addClass(o,"ui-menu-item-wrapper"),i.filter(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!t.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(t,e){if("icons"===t){var i=this.element.find(".ui-menu-icon");this._removeClass(i,null,this.options.icons.submenu)._addClass(i,null,e.submenu)}this._super(t,e)},_setOptionDisabled:function(t){this._super(t),this.element.attr("aria-disabled",t+""),this._toggleClass(null,"ui-state-disabled",!!t)},focus:function(t,e){var i,s,n;this.blur(t,t&&"focus"===t.type),this._scrollIntoView(e),this.active=e.first(),s=this.active.children(".ui-menu-item-wrapper"),this._addClass(s,null,"ui-state-active"),this.options.role&&this.element.attr("aria-activedescendant",s.attr("id")),n=this.active.parent().closest(".ui-menu-item").children(".ui-menu-item-wrapper"),this._addClass(n,null,"ui-state-active"),t&&"keydown"===t.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),i=e.children(".ui-menu"),i.length&&t&&/^mouse/.test(t.type)&&this._startOpening(i),this.activeMenu=e.parent(),this._trigger("focus",t,{item:e})},_scrollIntoView:function(e){var i,s,n,o,a,r;this._hasScroll()&&(i=parseFloat(t.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(t.css(this.activeMenu[0],"paddingTop"))||0,n=e.offset().top-this.activeMenu.offset().top-i-s,o=this.activeMenu.scrollTop(),a=this.activeMenu.height(),r=e.outerHeight(),0>n?this.activeMenu.scrollTop(o+n):n+r>a&&this.activeMenu.scrollTop(o+n-a+r))},blur:function(t,e){e||clearTimeout(this.timer),this.active&&(this._removeClass(this.active.children(".ui-menu-item-wrapper"),null,"ui-state-active"),this._trigger("blur",t,{item:this.active}),this.active=null)},_startOpening:function(t){clearTimeout(this.timer),"true"===t.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(t)},this.delay))},_open:function(e){var i=t.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(e.parents(".ui-menu")).hide().attr("aria-hidden","true"),e.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(e,i){clearTimeout(this.timer),this.timer=this._delay(function(){var s=i?this.element:t(e&&e.target).closest(this.element.find(".ui-menu"));s.length||(s=this.element),this._close(s),this.blur(e),this._removeClass(s.find(".ui-state-active"),null,"ui-state-active"),this.activeMenu=s},this.delay)},_close:function(t){t||(t=this.active?this.active.parent():this.element),t.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false")},_closeOnDocumentClick:function(e){return!t(e.target).closest(".ui-menu").length},_isDivider:function(t){return!/[^\-\u2014\u2013\s]/.test(t.text())},collapse:function(t){var e=this.active&&this.active.parent().closest(".ui-menu-item",this.element);e&&e.length&&(this._close(),this.focus(t,e))},expand:function(t){var e=this.active&&this.active.children(".ui-menu ").find(this.options.items).first();e&&e.length&&(this._open(e.parent()),this._delay(function(){this.focus(t,e)}))},next:function(t){this._move("next","first",t)},previous:function(t){this._move("prev","last",t)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(t,e,i){var s;this.active&&(s="first"===t||"last"===t?this.active["first"===t?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[t+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.find(this.options.items)[e]()),this.focus(i,s)},nextPage:function(e){var i,s,n;return this.active?(this.isLastItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=t(this),0>i.offset().top-s-n}),this.focus(e,i)):this.focus(e,this.activeMenu.find(this.options.items)[this.active?"last":"first"]())),void 0):(this.next(e),void 0)},previousPage:function(e){var i,s,n;return this.active?(this.isFirstItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=t(this),i.offset().top-s+n>0}),this.focus(e,i)):this.focus(e,this.activeMenu.find(this.options.items).first())),void 0):(this.next(e),void 0)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(e){this.active=this.active||t(e.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(e,!0),this._trigger("select",e,i)},_filterMenuItems:function(e){var i=e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&"),s=RegExp("^"+i,"i");return this.activeMenu.find(this.options.items).filter(".ui-menu-item").filter(function(){return s.test(t.trim(t(this).children(".ui-menu-item-wrapper").text()))})}}),t.widget("ui.autocomplete",{version:"1.12.1",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},requestIndex:0,pending:0,_create:function(){var e,i,s,n=this.element[0].nodeName.toLowerCase(),o="textarea"===n,a="input"===n;
this.isMultiLine=o||!a&&this._isContentEditable(this.element),this.valueMethod=this.element[o||a?"val":"text"],this.isNewMenu=!0,this._addClass("ui-autocomplete-input"),this.element.attr("autocomplete","off"),this._on(this.element,{keydown:function(n){if(this.element.prop("readOnly"))return e=!0,s=!0,i=!0,void 0;e=!1,s=!1,i=!1;var o=t.ui.keyCode;switch(n.keyCode){case o.PAGE_UP:e=!0,this._move("previousPage",n);break;case o.PAGE_DOWN:e=!0,this._move("nextPage",n);break;case o.UP:e=!0,this._keyEvent("previous",n);break;case o.DOWN:e=!0,this._keyEvent("next",n);break;case o.ENTER:this.menu.active&&(e=!0,n.preventDefault(),this.menu.select(n));break;case o.TAB:this.menu.active&&this.menu.select(n);break;case o.ESCAPE:this.menu.element.is(":visible")&&(this.isMultiLine||this._value(this.term),this.close(n),n.preventDefault());break;default:i=!0,this._searchTimeout(n)}},keypress:function(s){if(e)return e=!1,(!this.isMultiLine||this.menu.element.is(":visible"))&&s.preventDefault(),void 0;if(!i){var n=t.ui.keyCode;switch(s.keyCode){case n.PAGE_UP:this._move("previousPage",s);break;case n.PAGE_DOWN:this._move("nextPage",s);break;case n.UP:this._keyEvent("previous",s);break;case n.DOWN:this._keyEvent("next",s)}}},input:function(t){return s?(s=!1,t.preventDefault(),void 0):(this._searchTimeout(t),void 0)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,void 0):(clearTimeout(this.searching),this.close(t),this._change(t),void 0)}}),this._initSource(),this.menu=t("<ul>").appendTo(this._appendTo()).menu({role:null}).hide().menu("instance"),this._addClass(this.menu.element,"ui-autocomplete","ui-front"),this._on(this.menu.element,{mousedown:function(e){e.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,this.element[0]!==t.ui.safeActiveElement(this.document[0])&&this.element.trigger("focus")})},menufocus:function(e,i){var s,n;return this.isNewMenu&&(this.isNewMenu=!1,e.originalEvent&&/^mouse/.test(e.originalEvent.type))?(this.menu.blur(),this.document.one("mousemove",function(){t(e.target).trigger(e.originalEvent)}),void 0):(n=i.item.data("ui-autocomplete-item"),!1!==this._trigger("focus",e,{item:n})&&e.originalEvent&&/^key/.test(e.originalEvent.type)&&this._value(n.value),s=i.item.attr("aria-label")||n.value,s&&t.trim(s).length&&(this.liveRegion.children().hide(),t("<div>").text(s).appendTo(this.liveRegion)),void 0)},menuselect:function(e,i){var s=i.item.data("ui-autocomplete-item"),n=this.previous;this.element[0]!==t.ui.safeActiveElement(this.document[0])&&(this.element.trigger("focus"),this.previous=n,this._delay(function(){this.previous=n,this.selectedItem=s})),!1!==this._trigger("select",e,{item:s})&&this._value(s.value),this.term=this._value(),this.close(e),this.selectedItem=s}}),this.liveRegion=t("<div>",{role:"status","aria-live":"assertive","aria-relevant":"additions"}).appendTo(this.document[0].body),this._addClass(this.liveRegion,null,"ui-helper-hidden-accessible"),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(t,e){this._super(t,e),"source"===t&&this._initSource(),"appendTo"===t&&this.menu.element.appendTo(this._appendTo()),"disabled"===t&&e&&this.xhr&&this.xhr.abort()},_isEventTargetInWidget:function(e){var i=this.menu.element[0];return e.target===this.element[0]||e.target===i||t.contains(i,e.target)},_closeOnClickOutside:function(t){this._isEventTargetInWidget(t)||this.close()},_appendTo:function(){var e=this.options.appendTo;return e&&(e=e.jquery||e.nodeType?t(e):this.document.find(e).eq(0)),e&&e[0]||(e=this.element.closest(".ui-front, dialog")),e.length||(e=this.document[0].body),e},_initSource:function(){var e,i,s=this;t.isArray(this.options.source)?(e=this.options.source,this.source=function(i,s){s(t.ui.autocomplete.filter(e,i.term))}):"string"==typeof this.options.source?(i=this.options.source,this.source=function(e,n){s.xhr&&s.xhr.abort(),s.xhr=t.ajax({url:i,data:e,dataType:"json",success:function(t){n(t)},error:function(){n([])}})}):this.source=this.options.source},_searchTimeout:function(t){clearTimeout(this.searching),this.searching=this._delay(function(){var e=this.term===this._value(),i=this.menu.element.is(":visible"),s=t.altKey||t.ctrlKey||t.metaKey||t.shiftKey;(!e||e&&!i&&!s)&&(this.selectedItem=null,this.search(null,t))},this.options.delay)},search:function(t,e){return t=null!=t?t:this._value(),this.term=this._value(),t.length<this.options.minLength?this.close(e):this._trigger("search",e)!==!1?this._search(t):void 0},_search:function(t){this.pending++,this._addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:t},this._response())},_response:function(){var e=++this.requestIndex;return t.proxy(function(t){e===this.requestIndex&&this.__response(t),this.pending--,this.pending||this._removeClass("ui-autocomplete-loading")},this)},__response:function(t){t&&(t=this._normalize(t)),this._trigger("response",null,{content:t}),!this.options.disabled&&t&&t.length&&!this.cancelSearch?(this._suggest(t),this._trigger("open")):this._close()},close:function(t){this.cancelSearch=!0,this._close(t)},_close:function(t){this._off(this.document,"mousedown"),this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",t))},_change:function(t){this.previous!==this._value()&&this._trigger("change",t,{item:this.selectedItem})},_normalize:function(e){return e.length&&e[0].label&&e[0].value?e:t.map(e,function(e){return"string"==typeof e?{label:e,value:e}:t.extend({},e,{label:e.label||e.value,value:e.value||e.label})})},_suggest:function(e){var i=this.menu.element.empty();this._renderMenu(i,e),this.isNewMenu=!0,this.menu.refresh(),i.show(),this._resizeMenu(),i.position(t.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next(),this._on(this.document,{mousedown:"_closeOnClickOutside"})},_resizeMenu:function(){var t=this.menu.element;t.outerWidth(Math.max(t.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(e,i){var s=this;t.each(i,function(t,i){s._renderItemData(e,i)})},_renderItemData:function(t,e){return this._renderItem(t,e).data("ui-autocomplete-item",e)},_renderItem:function(e,i){return t("<li>").append(t("<div>").text(i.label)).appendTo(e)},_move:function(t,e){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(t)||this.menu.isLastItem()&&/^next/.test(t)?(this.isMultiLine||this._value(this.term),this.menu.blur(),void 0):(this.menu[t](e),void 0):(this.search(null,e),void 0)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(t,e){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(t,e),e.preventDefault())},_isContentEditable:function(t){if(!t.length)return!1;var e=t.prop("contentEditable");return"inherit"===e?this._isContentEditable(t.parent()):"true"===e}}),t.extend(t.ui.autocomplete,{escapeRegex:function(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(e,i){var s=RegExp(t.ui.autocomplete.escapeRegex(i),"i");return t.grep(e,function(t){return s.test(t.label||t.value||t)})}}),t.widget("ui.autocomplete",t.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(t){return t+(t>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(e){var i;this._superApply(arguments),this.options.disabled||this.cancelSearch||(i=e&&e.length?this.options.messages.results(e.length):this.options.messages.noResults,this.liveRegion.children().hide(),t("<div>").text(i).appendTo(this.liveRegion))}}),t.ui.autocomplete;var g=/ui-corner-([a-z]){2,6}/g;t.widget("ui.controlgroup",{version:"1.12.1",defaultElement:"<div>",options:{direction:"horizontal",disabled:null,onlyVisible:!0,items:{button:"input[type=button], input[type=submit], input[type=reset], button, a",controlgroupLabel:".ui-controlgroup-label",checkboxradio:"input[type='checkbox'], input[type='radio']",selectmenu:"select",spinner:".ui-spinner-input"}},_create:function(){this._enhance()},_enhance:function(){this.element.attr("role","toolbar"),this.refresh()},_destroy:function(){this._callChildMethod("destroy"),this.childWidgets.removeData("ui-controlgroup-data"),this.element.removeAttr("role"),this.options.items.controlgroupLabel&&this.element.find(this.options.items.controlgroupLabel).find(".ui-controlgroup-label-contents").contents().unwrap()},_initWidgets:function(){var e=this,i=[];t.each(this.options.items,function(s,n){var o,a={};return n?"controlgroupLabel"===s?(o=e.element.find(n),o.each(function(){var e=t(this);e.children(".ui-controlgroup-label-contents").length||e.contents().wrapAll("<span class='ui-controlgroup-label-contents'></span>")}),e._addClass(o,null,"ui-widget ui-widget-content ui-state-default"),i=i.concat(o.get()),void 0):(t.fn[s]&&(a=e["_"+s+"Options"]?e["_"+s+"Options"]("middle"):{classes:{}},e.element.find(n).each(function(){var n=t(this),o=n[s]("instance"),r=t.widget.extend({},a);if("button"!==s||!n.parent(".ui-spinner").length){o||(o=n[s]()[s]("instance")),o&&(r.classes=e._resolveClassesValues(r.classes,o)),n[s](r);var h=n[s]("widget");t.data(h[0],"ui-controlgroup-data",o?o:n[s]("instance")),i.push(h[0])}})),void 0):void 0}),this.childWidgets=t(t.unique(i)),this._addClass(this.childWidgets,"ui-controlgroup-item")},_callChildMethod:function(e){this.childWidgets.each(function(){var i=t(this),s=i.data("ui-controlgroup-data");s&&s[e]&&s[e]()})},_updateCornerClass:function(t,e){var i="ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-corner-all",s=this._buildSimpleOptions(e,"label").classes.label;this._removeClass(t,null,i),this._addClass(t,null,s)},_buildSimpleOptions:function(t,e){var i="vertical"===this.options.direction,s={classes:{}};return s.classes[e]={middle:"",first:"ui-corner-"+(i?"top":"left"),last:"ui-corner-"+(i?"bottom":"right"),only:"ui-corner-all"}[t],s},_spinnerOptions:function(t){var e=this._buildSimpleOptions(t,"ui-spinner");return e.classes["ui-spinner-up"]="",e.classes["ui-spinner-down"]="",e},_buttonOptions:function(t){return this._buildSimpleOptions(t,"ui-button")},_checkboxradioOptions:function(t){return this._buildSimpleOptions(t,"ui-checkboxradio-label")},_selectmenuOptions:function(t){var e="vertical"===this.options.direction;return{width:e?"auto":!1,classes:{middle:{"ui-selectmenu-button-open":"","ui-selectmenu-button-closed":""},first:{"ui-selectmenu-button-open":"ui-corner-"+(e?"top":"tl"),"ui-selectmenu-button-closed":"ui-corner-"+(e?"top":"left")},last:{"ui-selectmenu-button-open":e?"":"ui-corner-tr","ui-selectmenu-button-closed":"ui-corner-"+(e?"bottom":"right")},only:{"ui-selectmenu-button-open":"ui-corner-top","ui-selectmenu-button-closed":"ui-corner-all"}}[t]}},_resolveClassesValues:function(e,i){var s={};return t.each(e,function(n){var o=i.options.classes[n]||"";o=t.trim(o.replace(g,"")),s[n]=(o+" "+e[n]).replace(/\s+/g," ")}),s},_setOption:function(t,e){return"direction"===t&&this._removeClass("ui-controlgroup-"+this.options.direction),this._super(t,e),"disabled"===t?(this._callChildMethod(e?"disable":"enable"),void 0):(this.refresh(),void 0)},refresh:function(){var e,i=this;this._addClass("ui-controlgroup ui-controlgroup-"+this.options.direction),"horizontal"===this.options.direction&&this._addClass(null,"ui-helper-clearfix"),this._initWidgets(),e=this.childWidgets,this.options.onlyVisible&&(e=e.filter(":visible")),e.length&&(t.each(["first","last"],function(t,s){var n=e[s]().data("ui-controlgroup-data");if(n&&i["_"+n.widgetName+"Options"]){var o=i["_"+n.widgetName+"Options"](1===e.length?"only":s);o.classes=i._resolveClassesValues(o.classes,n),n.element[n.widgetName](o)}else i._updateCornerClass(e[s](),s)}),this._callChildMethod("refresh"))}}),t.widget("ui.checkboxradio",[t.ui.formResetMixin,{version:"1.12.1",options:{disabled:null,label:null,icon:!0,classes:{"ui-checkboxradio-label":"ui-corner-all","ui-checkboxradio-icon":"ui-corner-all"}},_getCreateOptions:function(){var e,i,s=this,n=this._super()||{};return this._readType(),i=this.element.labels(),this.label=t(i[i.length-1]),this.label.length||t.error("No label found for checkboxradio widget"),this.originalLabel="",this.label.contents().not(this.element[0]).each(function(){s.originalLabel+=3===this.nodeType?t(this).text():this.outerHTML}),this.originalLabel&&(n.label=this.originalLabel),e=this.element[0].disabled,null!=e&&(n.disabled=e),n},_create:function(){var t=this.element[0].checked;this._bindFormResetHandler(),null==this.options.disabled&&(this.options.disabled=this.element[0].disabled),this._setOption("disabled",this.options.disabled),this._addClass("ui-checkboxradio","ui-helper-hidden-accessible"),this._addClass(this.label,"ui-checkboxradio-label","ui-button ui-widget"),"radio"===this.type&&this._addClass(this.label,"ui-checkboxradio-radio-label"),this.options.label&&this.options.label!==this.originalLabel?this._updateLabel():this.originalLabel&&(this.options.label=this.originalLabel),this._enhance(),t&&(this._addClass(this.label,"ui-checkboxradio-checked","ui-state-active"),this.icon&&this._addClass(this.icon,null,"ui-state-hover")),this._on({change:"_toggleClasses",focus:function(){this._addClass(this.label,null,"ui-state-focus ui-visual-focus")},blur:function(){this._removeClass(this.label,null,"ui-state-focus ui-visual-focus")}})},_readType:function(){var e=this.element[0].nodeName.toLowerCase();this.type=this.element[0].type,"input"===e&&/radio|checkbox/.test(this.type)||t.error("Can't create checkboxradio on element.nodeName="+e+" and element.type="+this.type)},_enhance:function(){this._updateIcon(this.element[0].checked)},widget:function(){return this.label},_getRadioGroup:function(){var e,i=this.element[0].name,s="input[name='"+t.ui.escapeSelector(i)+"']";return i?(e=this.form.length?t(this.form[0].elements).filter(s):t(s).filter(function(){return 0===t(this).form().length}),e.not(this.element)):t([])},_toggleClasses:function(){var e=this.element[0].checked;this._toggleClass(this.label,"ui-checkboxradio-checked","ui-state-active",e),this.options.icon&&"checkbox"===this.type&&this._toggleClass(this.icon,null,"ui-icon-check ui-state-checked",e)._toggleClass(this.icon,null,"ui-icon-blank",!e),"radio"===this.type&&this._getRadioGroup().each(function(){var e=t(this).checkboxradio("instance");e&&e._removeClass(e.label,"ui-checkboxradio-checked","ui-state-active")})},_destroy:function(){this._unbindFormResetHandler(),this.icon&&(this.icon.remove(),this.iconSpace.remove())},_setOption:function(t,e){return"label"!==t||e?(this._super(t,e),"disabled"===t?(this._toggleClass(this.label,null,"ui-state-disabled",e),this.element[0].disabled=e,void 0):(this.refresh(),void 0)):void 0},_updateIcon:function(e){var i="ui-icon ui-icon-background ";this.options.icon?(this.icon||(this.icon=t("<span>"),this.iconSpace=t("<span> </span>"),this._addClass(this.iconSpace,"ui-checkboxradio-icon-space")),"checkbox"===this.type?(i+=e?"ui-icon-check ui-state-checked":"ui-icon-blank",this._removeClass(this.icon,null,e?"ui-icon-blank":"ui-icon-check")):i+="ui-icon-blank",this._addClass(this.icon,"ui-checkboxradio-icon",i),e||this._removeClass(this.icon,null,"ui-icon-check ui-state-checked"),this.icon.prependTo(this.label).after(this.iconSpace)):void 0!==this.icon&&(this.icon.remove(),this.iconSpace.remove(),delete this.icon)},_updateLabel:function(){var t=this.label.contents().not(this.element[0]);this.icon&&(t=t.not(this.icon[0])),this.iconSpace&&(t=t.not(this.iconSpace[0])),t.remove(),this.label.append(this.options.label)},refresh:function(){var t=this.element[0].checked,e=this.element[0].disabled;this._updateIcon(t),this._toggleClass(this.label,"ui-checkboxradio-checked","ui-state-active",t),null!==this.options.label&&this._updateLabel(),e!==this.options.disabled&&this._setOptions({disabled:e})}}]),t.ui.checkboxradio,t.widget("ui.button",{version:"1.12.1",defaultElement:"<button>",options:{classes:{"ui-button":"ui-corner-all"},disabled:null,icon:null,iconPosition:"beginning",label:null,showLabel:!0},_getCreateOptions:function(){var t,e=this._super()||{};return this.isInput=this.element.is("input"),t=this.element[0].disabled,null!=t&&(e.disabled=t),this.originalLabel=this.isInput?this.element.val():this.element.html(),this.originalLabel&&(e.label=this.originalLabel),e},_create:function(){!this.option.showLabel&!this.options.icon&&(this.options.showLabel=!0),null==this.options.disabled&&(this.options.disabled=this.element[0].disabled||!1),this.hasTitle=!!this.element.attr("title"),this.options.label&&this.options.label!==this.originalLabel&&(this.isInput?this.element.val(this.options.label):this.element.html(this.options.label)),this._addClass("ui-button","ui-widget"),this._setOption("disabled",this.options.disabled),this._enhance(),this.element.is("a")&&this._on({keyup:function(e){e.keyCode===t.ui.keyCode.SPACE&&(e.preventDefault(),this.element[0].click?this.element[0].click():this.element.trigger("click"))}})},_enhance:function(){this.element.is("button")||this.element.attr("role","button"),this.options.icon&&(this._updateIcon("icon",this.options.icon),this._updateTooltip())},_updateTooltip:function(){this.title=this.element.attr("title"),this.options.showLabel||this.title||this.element.attr("title",this.options.label)},_updateIcon:function(e,i){var s="iconPosition"!==e,n=s?this.options.iconPosition:i,o="top"===n||"bottom"===n;this.icon?s&&this._removeClass(this.icon,null,this.options.icon):(this.icon=t("<span>"),this._addClass(this.icon,"ui-button-icon","ui-icon"),this.options.showLabel||this._addClass("ui-button-icon-only")),s&&this._addClass(this.icon,null,i),this._attachIcon(n),o?(this._addClass(this.icon,null,"ui-widget-icon-block"),this.iconSpace&&this.iconSpace.remove()):(this.iconSpace||(this.iconSpace=t("<span> </span>"),this._addClass(this.iconSpace,"ui-button-icon-space")),this._removeClass(this.icon,null,"ui-wiget-icon-block"),this._attachIconSpace(n))},_destroy:function(){this.element.removeAttr("role"),this.icon&&this.icon.remove(),this.iconSpace&&this.iconSpace.remove(),this.hasTitle||this.element.removeAttr("title")},_attachIconSpace:function(t){this.icon[/^(?:end|bottom)/.test(t)?"before":"after"](this.iconSpace)},_attachIcon:function(t){this.element[/^(?:end|bottom)/.test(t)?"append":"prepend"](this.icon)},_setOptions:function(t){var e=void 0===t.showLabel?this.options.showLabel:t.showLabel,i=void 0===t.icon?this.options.icon:t.icon;e||i||(t.showLabel=!0),this._super(t)},_setOption:function(t,e){"icon"===t&&(e?this._updateIcon(t,e):this.icon&&(this.icon.remove(),this.iconSpace&&this.iconSpace.remove())),"iconPosition"===t&&this._updateIcon(t,e),"showLabel"===t&&(this._toggleClass("ui-button-icon-only",null,!e),this._updateTooltip()),"label"===t&&(this.isInput?this.element.val(e):(this.element.html(e),this.icon&&(this._attachIcon(this.options.iconPosition),this._attachIconSpace(this.options.iconPosition)))),this._super(t,e),"disabled"===t&&(this._toggleClass(null,"ui-state-disabled",e),this.element[0].disabled=e,e&&this.element.blur())},refresh:function(){var t=this.element.is("input, button")?this.element[0].disabled:this.element.hasClass("ui-button-disabled");t!==this.options.disabled&&this._setOptions({disabled:t}),this._updateTooltip()}}),t.uiBackCompat!==!1&&(t.widget("ui.button",t.ui.button,{options:{text:!0,icons:{primary:null,secondary:null}},_create:function(){this.options.showLabel&&!this.options.text&&(this.options.showLabel=this.options.text),!this.options.showLabel&&this.options.text&&(this.options.text=this.options.showLabel),this.options.icon||!this.options.icons.primary&&!this.options.icons.secondary?this.options.icon&&(this.options.icons.primary=this.options.icon):this.options.icons.primary?this.options.icon=this.options.icons.primary:(this.options.icon=this.options.icons.secondary,this.options.iconPosition="end"),this._super()},_setOption:function(t,e){return"text"===t?(this._super("showLabel",e),void 0):("showLabel"===t&&(this.options.text=e),"icon"===t&&(this.options.icons.primary=e),"icons"===t&&(e.primary?(this._super("icon",e.primary),this._super("iconPosition","beginning")):e.secondary&&(this._super("icon",e.secondary),this._super("iconPosition","end"))),this._superApply(arguments),void 0)}}),t.fn.button=function(e){return function(){return!this.length||this.length&&"INPUT"!==this[0].tagName||this.length&&"INPUT"===this[0].tagName&&"checkbox"!==this.attr("type")&&"radio"!==this.attr("type")?e.apply(this,arguments):(t.ui.checkboxradio||t.error("Checkboxradio widget missing"),0===arguments.length?this.checkboxradio({icon:!1}):this.checkboxradio.apply(this,arguments))}}(t.fn.button),t.fn.buttonset=function(){return t.ui.controlgroup||t.error("Controlgroup widget missing"),"option"===arguments[0]&&"items"===arguments[1]&&arguments[2]?this.controlgroup.apply(this,[arguments[0],"items.button",arguments[2]]):"option"===arguments[0]&&"items"===arguments[1]?this.controlgroup.apply(this,[arguments[0],"items.button"]):("object"==typeof arguments[0]&&arguments[0].items&&(arguments[0].items={button:arguments[0].items}),this.controlgroup.apply(this,arguments))}),t.ui.button,t.extend(t.ui,{datepicker:{version:"1.12.1"}});var m;t.extend(s.prototype,{markerClassName:"hasDatepicker",maxRows:4,_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(t){return a(this._defaults,t||{}),this},_attachDatepicker:function(e,i){var s,n,o;s=e.nodeName.toLowerCase(),n="div"===s||"span"===s,e.id||(this.uuid+=1,e.id="dp"+this.uuid),o=this._newInst(t(e),n),o.settings=t.extend({},i||{}),"input"===s?this._connectDatepicker(e,o):n&&this._inlineDatepicker(e,o)},_newInst:function(e,i){var s=e[0].id.replace(/([^A-Za-z0-9_\-])/g,"\\\\$1");return{id:s,input:e,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:i,dpDiv:i?n(t("<div class='"+this._inlineClass+" ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")):this.dpDiv}},_connectDatepicker:function(e,i){var s=t(e);i.append=t([]),i.trigger=t([]),s.hasClass(this.markerClassName)||(this._attachments(s,i),s.addClass(this.markerClassName).on("keydown",this._doKeyDown).on("keypress",this._doKeyPress).on("keyup",this._doKeyUp),this._autoSize(i),t.data(e,"datepicker",i),i.settings.disabled&&this._disableDatepicker(e))},_attachments:function(e,i){var s,n,o,a=this._get(i,"appendText"),r=this._get(i,"isRTL");i.append&&i.append.remove(),a&&(i.append=t("<span class='"+this._appendClass+"'>"+a+"</span>"),e[r?"before":"after"](i.append)),e.off("focus",this._showDatepicker),i.trigger&&i.trigger.remove(),s=this._get(i,"showOn"),("focus"===s||"both"===s)&&e.on("focus",this._showDatepicker),("button"===s||"both"===s)&&(n=this._get(i,"buttonText"),o=this._get(i,"buttonImage"),i.trigger=t(this._get(i,"buttonImageOnly")?t("<img/>").addClass(this._triggerClass).attr({src:o,alt:n,title:n}):t("<button type='button'></button>").addClass(this._triggerClass).html(o?t("<img/>").attr({src:o,alt:n,title:n}):n)),e[r?"before":"after"](i.trigger),i.trigger.on("click",function(){return t.datepicker._datepickerShowing&&t.datepicker._lastInput===e[0]?t.datepicker._hideDatepicker():t.datepicker._datepickerShowing&&t.datepicker._lastInput!==e[0]?(t.datepicker._hideDatepicker(),t.datepicker._showDatepicker(e[0])):t.datepicker._showDatepicker(e[0]),!1}))},_autoSize:function(t){if(this._get(t,"autoSize")&&!t.inline){var e,i,s,n,o=new Date(2009,11,20),a=this._get(t,"dateFormat");a.match(/[DM]/)&&(e=function(t){for(i=0,s=0,n=0;t.length>n;n++)t[n].length>i&&(i=t[n].length,s=n);return s},o.setMonth(e(this._get(t,a.match(/MM/)?"monthNames":"monthNamesShort"))),o.setDate(e(this._get(t,a.match(/DD/)?"dayNames":"dayNamesShort"))+20-o.getDay())),t.input.attr("size",this._formatDate(t,o).length)}},_inlineDatepicker:function(e,i){var s=t(e);s.hasClass(this.markerClassName)||(s.addClass(this.markerClassName).append(i.dpDiv),t.data(e,"datepicker",i),this._setDate(i,this._getDefaultDate(i),!0),this._updateDatepicker(i),this._updateAlternate(i),i.settings.disabled&&this._disableDatepicker(e),i.dpDiv.css("display","block"))},_dialogDatepicker:function(e,i,s,n,o){var r,h,l,c,u,d=this._dialogInst;return d||(this.uuid+=1,r="dp"+this.uuid,this._dialogInput=t("<input type='text' id='"+r+"' style='position: absolute; top: -100px; width: 0px;'/>"),this._dialogInput.on("keydown",this._doKeyDown),t("body").append(this._dialogInput),d=this._dialogInst=this._newInst(this._dialogInput,!1),d.settings={},t.data(this._dialogInput[0],"datepicker",d)),a(d.settings,n||{}),i=i&&i.constructor===Date?this._formatDate(d,i):i,this._dialogInput.val(i),this._pos=o?o.length?o:[o.pageX,o.pageY]:null,this._pos||(h=document.documentElement.clientWidth,l=document.documentElement.clientHeight,c=document.documentElement.scrollLeft||document.body.scrollLeft,u=document.documentElement.scrollTop||document.body.scrollTop,this._pos=[h/2-100+c,l/2-150+u]),this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),d.settings.onSelect=s,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),t.blockUI&&t.blockUI(this.dpDiv),t.data(this._dialogInput[0],"datepicker",d),this},_destroyDatepicker:function(e){var i,s=t(e),n=t.data(e,"datepicker");s.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),t.removeData(e,"datepicker"),"input"===i?(n.append.remove(),n.trigger.remove(),s.removeClass(this.markerClassName).off("focus",this._showDatepicker).off("keydown",this._doKeyDown).off("keypress",this._doKeyPress).off("keyup",this._doKeyUp)):("div"===i||"span"===i)&&s.removeClass(this.markerClassName).empty(),m===n&&(m=null))},_enableDatepicker:function(e){var i,s,n=t(e),o=t.data(e,"datepicker");n.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),"input"===i?(e.disabled=!1,o.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().removeClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)),this._disabledInputs=t.map(this._disabledInputs,function(t){return t===e?null:t}))},_disableDatepicker:function(e){var i,s,n=t(e),o=t.data(e,"datepicker");n.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),"input"===i?(e.disabled=!0,o.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().addClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)),this._disabledInputs=t.map(this._disabledInputs,function(t){return t===e?null:t}),this._disabledInputs[this._disabledInputs.length]=e)},_isDisabledDatepicker:function(t){if(!t)return!1;for(var e=0;this._disabledInputs.length>e;e++)if(this._disabledInputs[e]===t)return!0;return!1},_getInst:function(e){try{return t.data(e,"datepicker")}catch(i){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(e,i,s){var n,o,r,h,l=this._getInst(e);return 2===arguments.length&&"string"==typeof i?"defaults"===i?t.extend({},t.datepicker._defaults):l?"all"===i?t.extend({},l.settings):this._get(l,i):null:(n=i||{},"string"==typeof i&&(n={},n[i]=s),l&&(this._curInst===l&&this._hideDatepicker(),o=this._getDateDatepicker(e,!0),r=this._getMinMaxDate(l,"min"),h=this._getMinMaxDate(l,"max"),a(l.settings,n),null!==r&&void 0!==n.dateFormat&&void 0===n.minDate&&(l.settings.minDate=this._formatDate(l,r)),null!==h&&void 0!==n.dateFormat&&void 0===n.maxDate&&(l.settings.maxDate=this._formatDate(l,h)),"disabled"in n&&(n.disabled?this._disableDatepicker(e):this._enableDatepicker(e)),this._attachments(t(e),l),this._autoSize(l),this._setDate(l,o),this._updateAlternate(l),this._updateDatepicker(l)),void 0)},_changeDatepicker:function(t,e,i){this._optionDatepicker(t,e,i)},_refreshDatepicker:function(t){var e=this._getInst(t);e&&this._updateDatepicker(e)},_setDateDatepicker:function(t,e){var i=this._getInst(t);i&&(this._setDate(i,e),this._updateDatepicker(i),this._updateAlternate(i))},_getDateDatepicker:function(t,e){var i=this._getInst(t);return i&&!i.inline&&this._setDateFromField(i,e),i?this._getDate(i):null},_doKeyDown:function(e){var i,s,n,o=t.datepicker._getInst(e.target),a=!0,r=o.dpDiv.is(".ui-datepicker-rtl");if(o._keyEvent=!0,t.datepicker._datepickerShowing)switch(e.keyCode){case 9:t.datepicker._hideDatepicker(),a=!1;break;case 13:return n=t("td."+t.datepicker._dayOverClass+":not(."+t.datepicker._currentClass+")",o.dpDiv),n[0]&&t.datepicker._selectDay(e.target,o.selectedMonth,o.selectedYear,n[0]),i=t.datepicker._get(o,"onSelect"),i?(s=t.datepicker._formatDate(o),i.apply(o.input?o.input[0]:null,[s,o])):t.datepicker._hideDatepicker(),!1;case 27:t.datepicker._hideDatepicker();break;case 33:t.datepicker._adjustDate(e.target,e.ctrlKey?-t.datepicker._get(o,"stepBigMonths"):-t.datepicker._get(o,"stepMonths"),"M");break;case 34:t.datepicker._adjustDate(e.target,e.ctrlKey?+t.datepicker._get(o,"stepBigMonths"):+t.datepicker._get(o,"stepMonths"),"M");break;case 35:(e.ctrlKey||e.metaKey)&&t.datepicker._clearDate(e.target),a=e.ctrlKey||e.metaKey;break;case 36:(e.ctrlKey||e.metaKey)&&t.datepicker._gotoToday(e.target),a=e.ctrlKey||e.metaKey;break;case 37:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,r?1:-1,"D"),a=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&t.datepicker._adjustDate(e.target,e.ctrlKey?-t.datepicker._get(o,"stepBigMonths"):-t.datepicker._get(o,"stepMonths"),"M");break;case 38:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,-7,"D"),a=e.ctrlKey||e.metaKey;break;case 39:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,r?-1:1,"D"),a=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&t.datepicker._adjustDate(e.target,e.ctrlKey?+t.datepicker._get(o,"stepBigMonths"):+t.datepicker._get(o,"stepMonths"),"M");break;case 40:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,7,"D"),a=e.ctrlKey||e.metaKey;break;default:a=!1}else 36===e.keyCode&&e.ctrlKey?t.datepicker._showDatepicker(this):a=!1;a&&(e.preventDefault(),e.stopPropagation())},_doKeyPress:function(e){var i,s,n=t.datepicker._getInst(e.target);return t.datepicker._get(n,"constrainInput")?(i=t.datepicker._possibleChars(t.datepicker._get(n,"dateFormat")),s=String.fromCharCode(null==e.charCode?e.keyCode:e.charCode),e.ctrlKey||e.metaKey||" ">s||!i||i.indexOf(s)>-1):void 0},_doKeyUp:function(e){var i,s=t.datepicker._getInst(e.target);if(s.input.val()!==s.lastVal)try{i=t.datepicker.parseDate(t.datepicker._get(s,"dateFormat"),s.input?s.input.val():null,t.datepicker._getFormatConfig(s)),i&&(t.datepicker._setDateFromField(s),t.datepicker._updateAlternate(s),t.datepicker._updateDatepicker(s))}catch(n){}return!0},_showDatepicker:function(e){if(e=e.target||e,"input"!==e.nodeName.toLowerCase()&&(e=t("input",e.parentNode)[0]),!t.datepicker._isDisabledDatepicker(e)&&t.datepicker._lastInput!==e){var s,n,o,r,h,l,c;s=t.datepicker._getInst(e),t.datepicker._curInst&&t.datepicker._curInst!==s&&(t.datepicker._curInst.dpDiv.stop(!0,!0),s&&t.datepicker._datepickerShowing&&t.datepicker._hideDatepicker(t.datepicker._curInst.input[0])),n=t.datepicker._get(s,"beforeShow"),o=n?n.apply(e,[e,s]):{},o!==!1&&(a(s.settings,o),s.lastVal=null,t.datepicker._lastInput=e,t.datepicker._setDateFromField(s),t.datepicker._inDialog&&(e.value=""),t.datepicker._pos||(t.datepicker._pos=t.datepicker._findPos(e),t.datepicker._pos[1]+=e.offsetHeight),r=!1,t(e).parents().each(function(){return r|="fixed"===t(this).css("position"),!r}),h={left:t.datepicker._pos[0],top:t.datepicker._pos[1]},t.datepicker._pos=null,s.dpDiv.empty(),s.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),t.datepicker._updateDatepicker(s),h=t.datepicker._checkOffset(s,h,r),s.dpDiv.css({position:t.datepicker._inDialog&&t.blockUI?"static":r?"fixed":"absolute",display:"none",left:h.left+"px",top:h.top+"px"}),s.inline||(l=t.datepicker._get(s,"showAnim"),c=t.datepicker._get(s,"duration"),s.dpDiv.css("z-index",i(t(e))+1),t.datepicker._datepickerShowing=!0,t.effects&&t.effects.effect[l]?s.dpDiv.show(l,t.datepicker._get(s,"showOptions"),c):s.dpDiv[l||"show"](l?c:null),t.datepicker._shouldFocusInput(s)&&s.input.trigger("focus"),t.datepicker._curInst=s))
}},_updateDatepicker:function(e){this.maxRows=4,m=e,e.dpDiv.empty().append(this._generateHTML(e)),this._attachHandlers(e);var i,s=this._getNumberOfMonths(e),n=s[1],a=17,r=e.dpDiv.find("."+this._dayOverClass+" a");r.length>0&&o.apply(r.get(0)),e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),n>1&&e.dpDiv.addClass("ui-datepicker-multi-"+n).css("width",a*n+"em"),e.dpDiv[(1!==s[0]||1!==s[1]?"add":"remove")+"Class"]("ui-datepicker-multi"),e.dpDiv[(this._get(e,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),e===t.datepicker._curInst&&t.datepicker._datepickerShowing&&t.datepicker._shouldFocusInput(e)&&e.input.trigger("focus"),e.yearshtml&&(i=e.yearshtml,setTimeout(function(){i===e.yearshtml&&e.yearshtml&&e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml),i=e.yearshtml=null},0))},_shouldFocusInput:function(t){return t.input&&t.input.is(":visible")&&!t.input.is(":disabled")&&!t.input.is(":focus")},_checkOffset:function(e,i,s){var n=e.dpDiv.outerWidth(),o=e.dpDiv.outerHeight(),a=e.input?e.input.outerWidth():0,r=e.input?e.input.outerHeight():0,h=document.documentElement.clientWidth+(s?0:t(document).scrollLeft()),l=document.documentElement.clientHeight+(s?0:t(document).scrollTop());return i.left-=this._get(e,"isRTL")?n-a:0,i.left-=s&&i.left===e.input.offset().left?t(document).scrollLeft():0,i.top-=s&&i.top===e.input.offset().top+r?t(document).scrollTop():0,i.left-=Math.min(i.left,i.left+n>h&&h>n?Math.abs(i.left+n-h):0),i.top-=Math.min(i.top,i.top+o>l&&l>o?Math.abs(o+r):0),i},_findPos:function(e){for(var i,s=this._getInst(e),n=this._get(s,"isRTL");e&&("hidden"===e.type||1!==e.nodeType||t.expr.filters.hidden(e));)e=e[n?"previousSibling":"nextSibling"];return i=t(e).offset(),[i.left,i.top]},_hideDatepicker:function(e){var i,s,n,o,a=this._curInst;!a||e&&a!==t.data(e,"datepicker")||this._datepickerShowing&&(i=this._get(a,"showAnim"),s=this._get(a,"duration"),n=function(){t.datepicker._tidyDialog(a)},t.effects&&(t.effects.effect[i]||t.effects[i])?a.dpDiv.hide(i,t.datepicker._get(a,"showOptions"),s,n):a.dpDiv["slideDown"===i?"slideUp":"fadeIn"===i?"fadeOut":"hide"](i?s:null,n),i||n(),this._datepickerShowing=!1,o=this._get(a,"onClose"),o&&o.apply(a.input?a.input[0]:null,[a.input?a.input.val():"",a]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),t.blockUI&&(t.unblockUI(),t("body").append(this.dpDiv))),this._inDialog=!1)},_tidyDialog:function(t){t.dpDiv.removeClass(this._dialogClass).off(".ui-datepicker-calendar")},_checkExternalClick:function(e){if(t.datepicker._curInst){var i=t(e.target),s=t.datepicker._getInst(i[0]);(i[0].id!==t.datepicker._mainDivId&&0===i.parents("#"+t.datepicker._mainDivId).length&&!i.hasClass(t.datepicker.markerClassName)&&!i.closest("."+t.datepicker._triggerClass).length&&t.datepicker._datepickerShowing&&(!t.datepicker._inDialog||!t.blockUI)||i.hasClass(t.datepicker.markerClassName)&&t.datepicker._curInst!==s)&&t.datepicker._hideDatepicker()}},_adjustDate:function(e,i,s){var n=t(e),o=this._getInst(n[0]);this._isDisabledDatepicker(n[0])||(this._adjustInstDate(o,i+("M"===s?this._get(o,"showCurrentAtPos"):0),s),this._updateDatepicker(o))},_gotoToday:function(e){var i,s=t(e),n=this._getInst(s[0]);this._get(n,"gotoCurrent")&&n.currentDay?(n.selectedDay=n.currentDay,n.drawMonth=n.selectedMonth=n.currentMonth,n.drawYear=n.selectedYear=n.currentYear):(i=new Date,n.selectedDay=i.getDate(),n.drawMonth=n.selectedMonth=i.getMonth(),n.drawYear=n.selectedYear=i.getFullYear()),this._notifyChange(n),this._adjustDate(s)},_selectMonthYear:function(e,i,s){var n=t(e),o=this._getInst(n[0]);o["selected"+("M"===s?"Month":"Year")]=o["draw"+("M"===s?"Month":"Year")]=parseInt(i.options[i.selectedIndex].value,10),this._notifyChange(o),this._adjustDate(n)},_selectDay:function(e,i,s,n){var o,a=t(e);t(n).hasClass(this._unselectableClass)||this._isDisabledDatepicker(a[0])||(o=this._getInst(a[0]),o.selectedDay=o.currentDay=t("a",n).html(),o.selectedMonth=o.currentMonth=i,o.selectedYear=o.currentYear=s,this._selectDate(e,this._formatDate(o,o.currentDay,o.currentMonth,o.currentYear)))},_clearDate:function(e){var i=t(e);this._selectDate(i,"")},_selectDate:function(e,i){var s,n=t(e),o=this._getInst(n[0]);i=null!=i?i:this._formatDate(o),o.input&&o.input.val(i),this._updateAlternate(o),s=this._get(o,"onSelect"),s?s.apply(o.input?o.input[0]:null,[i,o]):o.input&&o.input.trigger("change"),o.inline?this._updateDatepicker(o):(this._hideDatepicker(),this._lastInput=o.input[0],"object"!=typeof o.input[0]&&o.input.trigger("focus"),this._lastInput=null)},_updateAlternate:function(e){var i,s,n,o=this._get(e,"altField");o&&(i=this._get(e,"altFormat")||this._get(e,"dateFormat"),s=this._getDate(e),n=this.formatDate(i,s,this._getFormatConfig(e)),t(o).val(n))},noWeekends:function(t){var e=t.getDay();return[e>0&&6>e,""]},iso8601Week:function(t){var e,i=new Date(t.getTime());return i.setDate(i.getDate()+4-(i.getDay()||7)),e=i.getTime(),i.setMonth(0),i.setDate(1),Math.floor(Math.round((e-i)/864e5)/7)+1},parseDate:function(e,i,s){if(null==e||null==i)throw"Invalid arguments";if(i="object"==typeof i?""+i:i+"",""===i)return null;var n,o,a,r,h=0,l=(s?s.shortYearCutoff:null)||this._defaults.shortYearCutoff,c="string"!=typeof l?l:(new Date).getFullYear()%100+parseInt(l,10),u=(s?s.dayNamesShort:null)||this._defaults.dayNamesShort,d=(s?s.dayNames:null)||this._defaults.dayNames,p=(s?s.monthNamesShort:null)||this._defaults.monthNamesShort,f=(s?s.monthNames:null)||this._defaults.monthNames,g=-1,m=-1,_=-1,v=-1,b=!1,y=function(t){var i=e.length>n+1&&e.charAt(n+1)===t;return i&&n++,i},w=function(t){var e=y(t),s="@"===t?14:"!"===t?20:"y"===t&&e?4:"o"===t?3:2,n="y"===t?s:1,o=RegExp("^\\d{"+n+","+s+"}"),a=i.substring(h).match(o);if(!a)throw"Missing number at position "+h;return h+=a[0].length,parseInt(a[0],10)},k=function(e,s,n){var o=-1,a=t.map(y(e)?n:s,function(t,e){return[[e,t]]}).sort(function(t,e){return-(t[1].length-e[1].length)});if(t.each(a,function(t,e){var s=e[1];return i.substr(h,s.length).toLowerCase()===s.toLowerCase()?(o=e[0],h+=s.length,!1):void 0}),-1!==o)return o+1;throw"Unknown name at position "+h},x=function(){if(i.charAt(h)!==e.charAt(n))throw"Unexpected literal at position "+h;h++};for(n=0;e.length>n;n++)if(b)"'"!==e.charAt(n)||y("'")?x():b=!1;else switch(e.charAt(n)){case"d":_=w("d");break;case"D":k("D",u,d);break;case"o":v=w("o");break;case"m":m=w("m");break;case"M":m=k("M",p,f);break;case"y":g=w("y");break;case"@":r=new Date(w("@")),g=r.getFullYear(),m=r.getMonth()+1,_=r.getDate();break;case"!":r=new Date((w("!")-this._ticksTo1970)/1e4),g=r.getFullYear(),m=r.getMonth()+1,_=r.getDate();break;case"'":y("'")?x():b=!0;break;default:x()}if(i.length>h&&(a=i.substr(h),!/^\s+/.test(a)))throw"Extra/unparsed characters found in date: "+a;if(-1===g?g=(new Date).getFullYear():100>g&&(g+=(new Date).getFullYear()-(new Date).getFullYear()%100+(c>=g?0:-100)),v>-1)for(m=1,_=v;;){if(o=this._getDaysInMonth(g,m-1),o>=_)break;m++,_-=o}if(r=this._daylightSavingAdjust(new Date(g,m-1,_)),r.getFullYear()!==g||r.getMonth()+1!==m||r.getDate()!==_)throw"Invalid date";return r},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:1e7*60*60*24*(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925)),formatDate:function(t,e,i){if(!e)return"";var s,n=(i?i.dayNamesShort:null)||this._defaults.dayNamesShort,o=(i?i.dayNames:null)||this._defaults.dayNames,a=(i?i.monthNamesShort:null)||this._defaults.monthNamesShort,r=(i?i.monthNames:null)||this._defaults.monthNames,h=function(e){var i=t.length>s+1&&t.charAt(s+1)===e;return i&&s++,i},l=function(t,e,i){var s=""+e;if(h(t))for(;i>s.length;)s="0"+s;return s},c=function(t,e,i,s){return h(t)?s[e]:i[e]},u="",d=!1;if(e)for(s=0;t.length>s;s++)if(d)"'"!==t.charAt(s)||h("'")?u+=t.charAt(s):d=!1;else switch(t.charAt(s)){case"d":u+=l("d",e.getDate(),2);break;case"D":u+=c("D",e.getDay(),n,o);break;case"o":u+=l("o",Math.round((new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime()-new Date(e.getFullYear(),0,0).getTime())/864e5),3);break;case"m":u+=l("m",e.getMonth()+1,2);break;case"M":u+=c("M",e.getMonth(),a,r);break;case"y":u+=h("y")?e.getFullYear():(10>e.getFullYear()%100?"0":"")+e.getFullYear()%100;break;case"@":u+=e.getTime();break;case"!":u+=1e4*e.getTime()+this._ticksTo1970;break;case"'":h("'")?u+="'":d=!0;break;default:u+=t.charAt(s)}return u},_possibleChars:function(t){var e,i="",s=!1,n=function(i){var s=t.length>e+1&&t.charAt(e+1)===i;return s&&e++,s};for(e=0;t.length>e;e++)if(s)"'"!==t.charAt(e)||n("'")?i+=t.charAt(e):s=!1;else switch(t.charAt(e)){case"d":case"m":case"y":case"@":i+="0123456789";break;case"D":case"M":return null;case"'":n("'")?i+="'":s=!0;break;default:i+=t.charAt(e)}return i},_get:function(t,e){return void 0!==t.settings[e]?t.settings[e]:this._defaults[e]},_setDateFromField:function(t,e){if(t.input.val()!==t.lastVal){var i=this._get(t,"dateFormat"),s=t.lastVal=t.input?t.input.val():null,n=this._getDefaultDate(t),o=n,a=this._getFormatConfig(t);try{o=this.parseDate(i,s,a)||n}catch(r){s=e?"":s}t.selectedDay=o.getDate(),t.drawMonth=t.selectedMonth=o.getMonth(),t.drawYear=t.selectedYear=o.getFullYear(),t.currentDay=s?o.getDate():0,t.currentMonth=s?o.getMonth():0,t.currentYear=s?o.getFullYear():0,this._adjustInstDate(t)}},_getDefaultDate:function(t){return this._restrictMinMax(t,this._determineDate(t,this._get(t,"defaultDate"),new Date))},_determineDate:function(e,i,s){var n=function(t){var e=new Date;return e.setDate(e.getDate()+t),e},o=function(i){try{return t.datepicker.parseDate(t.datepicker._get(e,"dateFormat"),i,t.datepicker._getFormatConfig(e))}catch(s){}for(var n=(i.toLowerCase().match(/^c/)?t.datepicker._getDate(e):null)||new Date,o=n.getFullYear(),a=n.getMonth(),r=n.getDate(),h=/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,l=h.exec(i);l;){switch(l[2]||"d"){case"d":case"D":r+=parseInt(l[1],10);break;case"w":case"W":r+=7*parseInt(l[1],10);break;case"m":case"M":a+=parseInt(l[1],10),r=Math.min(r,t.datepicker._getDaysInMonth(o,a));break;case"y":case"Y":o+=parseInt(l[1],10),r=Math.min(r,t.datepicker._getDaysInMonth(o,a))}l=h.exec(i)}return new Date(o,a,r)},a=null==i||""===i?s:"string"==typeof i?o(i):"number"==typeof i?isNaN(i)?s:n(i):new Date(i.getTime());return a=a&&"Invalid Date"==""+a?s:a,a&&(a.setHours(0),a.setMinutes(0),a.setSeconds(0),a.setMilliseconds(0)),this._daylightSavingAdjust(a)},_daylightSavingAdjust:function(t){return t?(t.setHours(t.getHours()>12?t.getHours()+2:0),t):null},_setDate:function(t,e,i){var s=!e,n=t.selectedMonth,o=t.selectedYear,a=this._restrictMinMax(t,this._determineDate(t,e,new Date));t.selectedDay=t.currentDay=a.getDate(),t.drawMonth=t.selectedMonth=t.currentMonth=a.getMonth(),t.drawYear=t.selectedYear=t.currentYear=a.getFullYear(),n===t.selectedMonth&&o===t.selectedYear||i||this._notifyChange(t),this._adjustInstDate(t),t.input&&t.input.val(s?"":this._formatDate(t))},_getDate:function(t){var e=!t.currentYear||t.input&&""===t.input.val()?null:this._daylightSavingAdjust(new Date(t.currentYear,t.currentMonth,t.currentDay));return e},_attachHandlers:function(e){var i=this._get(e,"stepMonths"),s="#"+e.id.replace(/\\\\/g,"\\");e.dpDiv.find("[data-handler]").map(function(){var e={prev:function(){t.datepicker._adjustDate(s,-i,"M")},next:function(){t.datepicker._adjustDate(s,+i,"M")},hide:function(){t.datepicker._hideDatepicker()},today:function(){t.datepicker._gotoToday(s)},selectDay:function(){return t.datepicker._selectDay(s,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return t.datepicker._selectMonthYear(s,this,"M"),!1},selectYear:function(){return t.datepicker._selectMonthYear(s,this,"Y"),!1}};t(this).on(this.getAttribute("data-event"),e[this.getAttribute("data-handler")])})},_generateHTML:function(t){var e,i,s,n,o,a,r,h,l,c,u,d,p,f,g,m,_,v,b,y,w,k,x,C,D,I,T,P,M,S,H,z,O,A,N,W,E,F,L,R=new Date,B=this._daylightSavingAdjust(new Date(R.getFullYear(),R.getMonth(),R.getDate())),Y=this._get(t,"isRTL"),j=this._get(t,"showButtonPanel"),q=this._get(t,"hideIfNoPrevNext"),K=this._get(t,"navigationAsDateFormat"),U=this._getNumberOfMonths(t),V=this._get(t,"showCurrentAtPos"),$=this._get(t,"stepMonths"),X=1!==U[0]||1!==U[1],G=this._daylightSavingAdjust(t.currentDay?new Date(t.currentYear,t.currentMonth,t.currentDay):new Date(9999,9,9)),Q=this._getMinMaxDate(t,"min"),J=this._getMinMaxDate(t,"max"),Z=t.drawMonth-V,te=t.drawYear;if(0>Z&&(Z+=12,te--),J)for(e=this._daylightSavingAdjust(new Date(J.getFullYear(),J.getMonth()-U[0]*U[1]+1,J.getDate())),e=Q&&Q>e?Q:e;this._daylightSavingAdjust(new Date(te,Z,1))>e;)Z--,0>Z&&(Z=11,te--);for(t.drawMonth=Z,t.drawYear=te,i=this._get(t,"prevText"),i=K?this.formatDate(i,this._daylightSavingAdjust(new Date(te,Z-$,1)),this._getFormatConfig(t)):i,s=this._canAdjustMonth(t,-1,te,Z)?"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>":q?"":"<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>",n=this._get(t,"nextText"),n=K?this.formatDate(n,this._daylightSavingAdjust(new Date(te,Z+$,1)),this._getFormatConfig(t)):n,o=this._canAdjustMonth(t,1,te,Z)?"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>":q?"":"<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>",a=this._get(t,"currentText"),r=this._get(t,"gotoCurrent")&&t.currentDay?G:B,a=K?this.formatDate(a,r,this._getFormatConfig(t)):a,h=t.inline?"":"<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>"+this._get(t,"closeText")+"</button>",l=j?"<div class='ui-datepicker-buttonpane ui-widget-content'>"+(Y?h:"")+(this._isInRange(t,r)?"<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>"+a+"</button>":"")+(Y?"":h)+"</div>":"",c=parseInt(this._get(t,"firstDay"),10),c=isNaN(c)?0:c,u=this._get(t,"showWeek"),d=this._get(t,"dayNames"),p=this._get(t,"dayNamesMin"),f=this._get(t,"monthNames"),g=this._get(t,"monthNamesShort"),m=this._get(t,"beforeShowDay"),_=this._get(t,"showOtherMonths"),v=this._get(t,"selectOtherMonths"),b=this._getDefaultDate(t),y="",k=0;U[0]>k;k++){for(x="",this.maxRows=4,C=0;U[1]>C;C++){if(D=this._daylightSavingAdjust(new Date(te,Z,t.selectedDay)),I=" ui-corner-all",T="",X){if(T+="<div class='ui-datepicker-group",U[1]>1)switch(C){case 0:T+=" ui-datepicker-group-first",I=" ui-corner-"+(Y?"right":"left");break;case U[1]-1:T+=" ui-datepicker-group-last",I=" ui-corner-"+(Y?"left":"right");break;default:T+=" ui-datepicker-group-middle",I=""}T+="'>"}for(T+="<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix"+I+"'>"+(/all|left/.test(I)&&0===k?Y?o:s:"")+(/all|right/.test(I)&&0===k?Y?s:o:"")+this._generateMonthYearHeader(t,Z,te,Q,J,k>0||C>0,f,g)+"</div><table class='ui-datepicker-calendar'><thead>"+"<tr>",P=u?"<th class='ui-datepicker-week-col'>"+this._get(t,"weekHeader")+"</th>":"",w=0;7>w;w++)M=(w+c)%7,P+="<th scope='col'"+((w+c+6)%7>=5?" class='ui-datepicker-week-end'":"")+">"+"<span title='"+d[M]+"'>"+p[M]+"</span></th>";for(T+=P+"</tr></thead><tbody>",S=this._getDaysInMonth(te,Z),te===t.selectedYear&&Z===t.selectedMonth&&(t.selectedDay=Math.min(t.selectedDay,S)),H=(this._getFirstDayOfMonth(te,Z)-c+7)%7,z=Math.ceil((H+S)/7),O=X?this.maxRows>z?this.maxRows:z:z,this.maxRows=O,A=this._daylightSavingAdjust(new Date(te,Z,1-H)),N=0;O>N;N++){for(T+="<tr>",W=u?"<td class='ui-datepicker-week-col'>"+this._get(t,"calculateWeek")(A)+"</td>":"",w=0;7>w;w++)E=m?m.apply(t.input?t.input[0]:null,[A]):[!0,""],F=A.getMonth()!==Z,L=F&&!v||!E[0]||Q&&Q>A||J&&A>J,W+="<td class='"+((w+c+6)%7>=5?" ui-datepicker-week-end":"")+(F?" ui-datepicker-other-month":"")+(A.getTime()===D.getTime()&&Z===t.selectedMonth&&t._keyEvent||b.getTime()===A.getTime()&&b.getTime()===D.getTime()?" "+this._dayOverClass:"")+(L?" "+this._unselectableClass+" ui-state-disabled":"")+(F&&!_?"":" "+E[1]+(A.getTime()===G.getTime()?" "+this._currentClass:"")+(A.getTime()===B.getTime()?" ui-datepicker-today":""))+"'"+(F&&!_||!E[2]?"":" title='"+E[2].replace(/'/g,"&#39;")+"'")+(L?"":" data-handler='selectDay' data-event='click' data-month='"+A.getMonth()+"' data-year='"+A.getFullYear()+"'")+">"+(F&&!_?"&#xa0;":L?"<span class='ui-state-default'>"+A.getDate()+"</span>":"<a class='ui-state-default"+(A.getTime()===B.getTime()?" ui-state-highlight":"")+(A.getTime()===G.getTime()?" ui-state-active":"")+(F?" ui-priority-secondary":"")+"' href='#'>"+A.getDate()+"</a>")+"</td>",A.setDate(A.getDate()+1),A=this._daylightSavingAdjust(A);T+=W+"</tr>"}Z++,Z>11&&(Z=0,te++),T+="</tbody></table>"+(X?"</div>"+(U[0]>0&&C===U[1]-1?"<div class='ui-datepicker-row-break'></div>":""):""),x+=T}y+=x}return y+=l,t._keyEvent=!1,y},_generateMonthYearHeader:function(t,e,i,s,n,o,a,r){var h,l,c,u,d,p,f,g,m=this._get(t,"changeMonth"),_=this._get(t,"changeYear"),v=this._get(t,"showMonthAfterYear"),b="<div class='ui-datepicker-title'>",y="";if(o||!m)y+="<span class='ui-datepicker-month'>"+a[e]+"</span>";else{for(h=s&&s.getFullYear()===i,l=n&&n.getFullYear()===i,y+="<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",c=0;12>c;c++)(!h||c>=s.getMonth())&&(!l||n.getMonth()>=c)&&(y+="<option value='"+c+"'"+(c===e?" selected='selected'":"")+">"+r[c]+"</option>");y+="</select>"}if(v||(b+=y+(!o&&m&&_?"":"&#xa0;")),!t.yearshtml)if(t.yearshtml="",o||!_)b+="<span class='ui-datepicker-year'>"+i+"</span>";else{for(u=this._get(t,"yearRange").split(":"),d=(new Date).getFullYear(),p=function(t){var e=t.match(/c[+\-].*/)?i+parseInt(t.substring(1),10):t.match(/[+\-].*/)?d+parseInt(t,10):parseInt(t,10);return isNaN(e)?d:e},f=p(u[0]),g=Math.max(f,p(u[1]||"")),f=s?Math.max(f,s.getFullYear()):f,g=n?Math.min(g,n.getFullYear()):g,t.yearshtml+="<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";g>=f;f++)t.yearshtml+="<option value='"+f+"'"+(f===i?" selected='selected'":"")+">"+f+"</option>";t.yearshtml+="</select>",b+=t.yearshtml,t.yearshtml=null}return b+=this._get(t,"yearSuffix"),v&&(b+=(!o&&m&&_?"":"&#xa0;")+y),b+="</div>"},_adjustInstDate:function(t,e,i){var s=t.selectedYear+("Y"===i?e:0),n=t.selectedMonth+("M"===i?e:0),o=Math.min(t.selectedDay,this._getDaysInMonth(s,n))+("D"===i?e:0),a=this._restrictMinMax(t,this._daylightSavingAdjust(new Date(s,n,o)));t.selectedDay=a.getDate(),t.drawMonth=t.selectedMonth=a.getMonth(),t.drawYear=t.selectedYear=a.getFullYear(),("M"===i||"Y"===i)&&this._notifyChange(t)},_restrictMinMax:function(t,e){var i=this._getMinMaxDate(t,"min"),s=this._getMinMaxDate(t,"max"),n=i&&i>e?i:e;return s&&n>s?s:n},_notifyChange:function(t){var e=this._get(t,"onChangeMonthYear");e&&e.apply(t.input?t.input[0]:null,[t.selectedYear,t.selectedMonth+1,t])},_getNumberOfMonths:function(t){var e=this._get(t,"numberOfMonths");return null==e?[1,1]:"number"==typeof e?[1,e]:e},_getMinMaxDate:function(t,e){return this._determineDate(t,this._get(t,e+"Date"),null)},_getDaysInMonth:function(t,e){return 32-this._daylightSavingAdjust(new Date(t,e,32)).getDate()},_getFirstDayOfMonth:function(t,e){return new Date(t,e,1).getDay()},_canAdjustMonth:function(t,e,i,s){var n=this._getNumberOfMonths(t),o=this._daylightSavingAdjust(new Date(i,s+(0>e?e:n[0]*n[1]),1));return 0>e&&o.setDate(this._getDaysInMonth(o.getFullYear(),o.getMonth())),this._isInRange(t,o)},_isInRange:function(t,e){var i,s,n=this._getMinMaxDate(t,"min"),o=this._getMinMaxDate(t,"max"),a=null,r=null,h=this._get(t,"yearRange");return h&&(i=h.split(":"),s=(new Date).getFullYear(),a=parseInt(i[0],10),r=parseInt(i[1],10),i[0].match(/[+\-].*/)&&(a+=s),i[1].match(/[+\-].*/)&&(r+=s)),(!n||e.getTime()>=n.getTime())&&(!o||e.getTime()<=o.getTime())&&(!a||e.getFullYear()>=a)&&(!r||r>=e.getFullYear())},_getFormatConfig:function(t){var e=this._get(t,"shortYearCutoff");return e="string"!=typeof e?e:(new Date).getFullYear()%100+parseInt(e,10),{shortYearCutoff:e,dayNamesShort:this._get(t,"dayNamesShort"),dayNames:this._get(t,"dayNames"),monthNamesShort:this._get(t,"monthNamesShort"),monthNames:this._get(t,"monthNames")}},_formatDate:function(t,e,i,s){e||(t.currentDay=t.selectedDay,t.currentMonth=t.selectedMonth,t.currentYear=t.selectedYear);var n=e?"object"==typeof e?e:this._daylightSavingAdjust(new Date(s,i,e)):this._daylightSavingAdjust(new Date(t.currentYear,t.currentMonth,t.currentDay));return this.formatDate(this._get(t,"dateFormat"),n,this._getFormatConfig(t))}}),t.fn.datepicker=function(e){if(!this.length)return this;t.datepicker.initialized||(t(document).on("mousedown",t.datepicker._checkExternalClick),t.datepicker.initialized=!0),0===t("#"+t.datepicker._mainDivId).length&&t("body").append(t.datepicker.dpDiv);var i=Array.prototype.slice.call(arguments,1);return"string"!=typeof e||"isDisabled"!==e&&"getDate"!==e&&"widget"!==e?"option"===e&&2===arguments.length&&"string"==typeof arguments[1]?t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this[0]].concat(i)):this.each(function(){"string"==typeof e?t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this].concat(i)):t.datepicker._attachDatepicker(this,e)}):t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this[0]].concat(i))},t.datepicker=new s,t.datepicker.initialized=!1,t.datepicker.uuid=(new Date).getTime(),t.datepicker.version="1.12.1",t.datepicker,t.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());var _=!1;t(document).on("mouseup",function(){_=!1}),t.widget("ui.mouse",{version:"1.12.1",options:{cancel:"input, textarea, button, select, option",distance:1,delay:0},_mouseInit:function(){var e=this;this.element.on("mousedown."+this.widgetName,function(t){return e._mouseDown(t)}).on("click."+this.widgetName,function(i){return!0===t.data(i.target,e.widgetName+".preventClickEvent")?(t.removeData(i.target,e.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):void 0}),this.started=!1},_mouseDestroy:function(){this.element.off("."+this.widgetName),this._mouseMoveDelegate&&this.document.off("mousemove."+this.widgetName,this._mouseMoveDelegate).off("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(e){if(!_){this._mouseMoved=!1,this._mouseStarted&&this._mouseUp(e),this._mouseDownEvent=e;var i=this,s=1===e.which,n="string"==typeof this.options.cancel&&e.target.nodeName?t(e.target).closest(this.options.cancel).length:!1;return s&&!n&&this._mouseCapture(e)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){i.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(e)!==!1,!this._mouseStarted)?(e.preventDefault(),!0):(!0===t.data(e.target,this.widgetName+".preventClickEvent")&&t.removeData(e.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(t){return i._mouseMove(t)},this._mouseUpDelegate=function(t){return i._mouseUp(t)},this.document.on("mousemove."+this.widgetName,this._mouseMoveDelegate).on("mouseup."+this.widgetName,this._mouseUpDelegate),e.preventDefault(),_=!0,!0)):!0}},_mouseMove:function(e){if(this._mouseMoved){if(t.ui.ie&&(!document.documentMode||9>document.documentMode)&&!e.button)return this._mouseUp(e);if(!e.which)if(e.originalEvent.altKey||e.originalEvent.ctrlKey||e.originalEvent.metaKey||e.originalEvent.shiftKey)this.ignoreMissingWhich=!0;else if(!this.ignoreMissingWhich)return this._mouseUp(e)}return(e.which||e.button)&&(this._mouseMoved=!0),this._mouseStarted?(this._mouseDrag(e),e.preventDefault()):(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,e)!==!1,this._mouseStarted?this._mouseDrag(e):this._mouseUp(e)),!this._mouseStarted)},_mouseUp:function(e){this.document.off("mousemove."+this.widgetName,this._mouseMoveDelegate).off("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,e.target===this._mouseDownEvent.target&&t.data(e.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(e)),this._mouseDelayTimer&&(clearTimeout(this._mouseDelayTimer),delete this._mouseDelayTimer),this.ignoreMissingWhich=!1,_=!1,e.preventDefault()},_mouseDistanceMet:function(t){return Math.max(Math.abs(this._mouseDownEvent.pageX-t.pageX),Math.abs(this._mouseDownEvent.pageY-t.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}}),t.ui.plugin={add:function(e,i,s){var n,o=t.ui[e].prototype;for(n in s)o.plugins[n]=o.plugins[n]||[],o.plugins[n].push([i,s[n]])},call:function(t,e,i,s){var n,o=t.plugins[e];if(o&&(s||t.element[0].parentNode&&11!==t.element[0].parentNode.nodeType))for(n=0;o.length>n;n++)t.options[o[n][0]]&&o[n][1].apply(t.element,i)}},t.ui.safeBlur=function(e){e&&"body"!==e.nodeName.toLowerCase()&&t(e).trigger("blur")},t.widget("ui.draggable",t.ui.mouse,{version:"1.12.1",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"===this.options.helper&&this._setPositionRelative(),this.options.addClasses&&this._addClass("ui-draggable"),this._setHandleClassName(),this._mouseInit()},_setOption:function(t,e){this._super(t,e),"handle"===t&&(this._removeHandleClassName(),this._setHandleClassName())},_destroy:function(){return(this.helper||this.element).is(".ui-draggable-dragging")?(this.destroyOnClear=!0,void 0):(this._removeHandleClassName(),this._mouseDestroy(),void 0)},_mouseCapture:function(e){var i=this.options;return this.helper||i.disabled||t(e.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(e),this.handle?(this._blurActiveElement(e),this._blockFrames(i.iframeFix===!0?"iframe":i.iframeFix),!0):!1)},_blockFrames:function(e){this.iframeBlocks=this.document.find(e).map(function(){var e=t(this);return t("<div>").css("position","absolute").appendTo(e.parent()).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).offset(e.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_blurActiveElement:function(e){var i=t.ui.safeActiveElement(this.document[0]),s=t(e.target);s.closest(i).length||t.ui.safeBlur(i)},_mouseStart:function(e){var i=this.options;return this.helper=this._createHelper(e),this._addClass(this.helper,"ui-draggable-dragging"),this._cacheHelperProportions(),t.ui.ddmanager&&(t.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(!0),this.offsetParent=this.helper.offsetParent(),this.hasFixedAncestor=this.helper.parents().filter(function(){return"fixed"===t(this).css("position")}).length>0,this.positionAbs=this.element.offset(),this._refreshOffsets(e),this.originalPosition=this.position=this._generatePosition(e,!1),this.originalPageX=e.pageX,this.originalPageY=e.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",e)===!1?(this._clear(),!1):(this._cacheHelperProportions(),t.ui.ddmanager&&!i.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this._mouseDrag(e,!0),t.ui.ddmanager&&t.ui.ddmanager.dragStart(this,e),!0)},_refreshOffsets:function(t){this.offset={top:this.positionAbs.top-this.margins.top,left:this.positionAbs.left-this.margins.left,scroll:!1,parent:this._getParentOffset(),relative:this._getRelativeOffset()},this.offset.click={left:t.pageX-this.offset.left,top:t.pageY-this.offset.top}},_mouseDrag:function(e,i){if(this.hasFixedAncestor&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(e,!0),this.positionAbs=this._convertPositionTo("absolute"),!i){var s=this._uiHash();if(this._trigger("drag",e,s)===!1)return this._mouseUp(new t.Event("mouseup",e)),!1;this.position=s.position}return this.helper[0].style.left=this.position.left+"px",this.helper[0].style.top=this.position.top+"px",t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),!1},_mouseStop:function(e){var i=this,s=!1;return t.ui.ddmanager&&!this.options.dropBehaviour&&(s=t.ui.ddmanager.drop(this,e)),this.dropped&&(s=this.dropped,this.dropped=!1),"invalid"===this.options.revert&&!s||"valid"===this.options.revert&&s||this.options.revert===!0||t.isFunction(this.options.revert)&&this.options.revert.call(this.element,s)?t(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",e)!==!1&&i._clear()}):this._trigger("stop",e)!==!1&&this._clear(),!1},_mouseUp:function(e){return this._unblockFrames(),t.ui.ddmanager&&t.ui.ddmanager.dragStop(this,e),this.handleElement.is(e.target)&&this.element.trigger("focus"),t.ui.mouse.prototype._mouseUp.call(this,e)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp(new t.Event("mouseup",{target:this.element[0]})):this._clear(),this},_getHandle:function(e){return this.options.handle?!!t(e.target).closest(this.element.find(this.options.handle)).length:!0},_setHandleClassName:function(){this.handleElement=this.options.handle?this.element.find(this.options.handle):this.element,this._addClass(this.handleElement,"ui-draggable-handle")},_removeHandleClassName:function(){this._removeClass(this.handleElement,"ui-draggable-handle")},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper),n=s?t(i.helper.apply(this.element[0],[e])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return n.parents("body").length||n.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),s&&n[0]===this.element[0]&&this._setPositionRelative(),n[0]===this.element[0]||/(fixed|absolute)/.test(n.css("position"))||n.css("position","absolute"),n},_setPositionRelative:function(){/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative")},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_isRootNode:function(t){return/(html|body)/i.test(t.tagName)||t===this.document[0]},_getParentOffset:function(){var e=this.offsetParent.offset(),i=this.document[0];return"absolute"===this.cssPosition&&this.scrollParent[0]!==i&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),this._isRootNode(this.offsetParent[0])&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"!==this.cssPosition)return{top:0,left:0};var t=this.element.position(),e=this._isRootNode(this.scrollParent[0]);return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+(e?0:this.scrollParent.scrollTop()),left:t.left-(parseInt(this.helper.css("left"),10)||0)+(e?0:this.scrollParent.scrollLeft())}
},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options,o=this.document[0];return this.relativeContainer=null,n.containment?"window"===n.containment?(this.containment=[t(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,t(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,t(window).scrollLeft()+t(window).width()-this.helperProportions.width-this.margins.left,t(window).scrollTop()+(t(window).height()||o.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):"document"===n.containment?(this.containment=[0,0,t(o).width()-this.helperProportions.width-this.margins.left,(t(o).height()||o.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):n.containment.constructor===Array?(this.containment=n.containment,void 0):("parent"===n.containment&&(n.containment=this.helper[0].parentNode),i=t(n.containment),s=i[0],s&&(e=/(scroll|auto)/.test(i.css("overflow")),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(e?Math.max(s.scrollWidth,s.offsetWidth):s.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(e?Math.max(s.scrollHeight,s.offsetHeight):s.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relativeContainer=i),void 0):(this.containment=null,void 0)},_convertPositionTo:function(t,e){e||(e=this.position);var i="absolute"===t?1:-1,s=this._isRootNode(this.scrollParent[0]);return{top:e.top+this.offset.relative.top*i+this.offset.parent.top*i-("fixed"===this.cssPosition?-this.offset.scroll.top:s?0:this.offset.scroll.top)*i,left:e.left+this.offset.relative.left*i+this.offset.parent.left*i-("fixed"===this.cssPosition?-this.offset.scroll.left:s?0:this.offset.scroll.left)*i}},_generatePosition:function(t,e){var i,s,n,o,a=this.options,r=this._isRootNode(this.scrollParent[0]),h=t.pageX,l=t.pageY;return r&&this.offset.scroll||(this.offset.scroll={top:this.scrollParent.scrollTop(),left:this.scrollParent.scrollLeft()}),e&&(this.containment&&(this.relativeContainer?(s=this.relativeContainer.offset(),i=[this.containment[0]+s.left,this.containment[1]+s.top,this.containment[2]+s.left,this.containment[3]+s.top]):i=this.containment,t.pageX-this.offset.click.left<i[0]&&(h=i[0]+this.offset.click.left),t.pageY-this.offset.click.top<i[1]&&(l=i[1]+this.offset.click.top),t.pageX-this.offset.click.left>i[2]&&(h=i[2]+this.offset.click.left),t.pageY-this.offset.click.top>i[3]&&(l=i[3]+this.offset.click.top)),a.grid&&(n=a.grid[1]?this.originalPageY+Math.round((l-this.originalPageY)/a.grid[1])*a.grid[1]:this.originalPageY,l=i?n-this.offset.click.top>=i[1]||n-this.offset.click.top>i[3]?n:n-this.offset.click.top>=i[1]?n-a.grid[1]:n+a.grid[1]:n,o=a.grid[0]?this.originalPageX+Math.round((h-this.originalPageX)/a.grid[0])*a.grid[0]:this.originalPageX,h=i?o-this.offset.click.left>=i[0]||o-this.offset.click.left>i[2]?o:o-this.offset.click.left>=i[0]?o-a.grid[0]:o+a.grid[0]:o),"y"===a.axis&&(h=this.originalPageX),"x"===a.axis&&(l=this.originalPageY)),{top:l-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.offset.scroll.top:r?0:this.offset.scroll.top),left:h-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.offset.scroll.left:r?0:this.offset.scroll.left)}},_clear:function(){this._removeClass(this.helper,"ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1,this.destroyOnClear&&this.destroy()},_trigger:function(e,i,s){return s=s||this._uiHash(),t.ui.plugin.call(this,e,[i,s,this],!0),/^(drag|start|stop)/.test(e)&&(this.positionAbs=this._convertPositionTo("absolute"),s.offset=this.positionAbs),t.Widget.prototype._trigger.call(this,e,i,s)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),t.ui.plugin.add("draggable","connectToSortable",{start:function(e,i,s){var n=t.extend({},i,{item:s.element});s.sortables=[],t(s.options.connectToSortable).each(function(){var i=t(this).sortable("instance");i&&!i.options.disabled&&(s.sortables.push(i),i.refreshPositions(),i._trigger("activate",e,n))})},stop:function(e,i,s){var n=t.extend({},i,{item:s.element});s.cancelHelperRemoval=!1,t.each(s.sortables,function(){var t=this;t.isOver?(t.isOver=0,s.cancelHelperRemoval=!0,t.cancelHelperRemoval=!1,t._storedCSS={position:t.placeholder.css("position"),top:t.placeholder.css("top"),left:t.placeholder.css("left")},t._mouseStop(e),t.options.helper=t.options._helper):(t.cancelHelperRemoval=!0,t._trigger("deactivate",e,n))})},drag:function(e,i,s){t.each(s.sortables,function(){var n=!1,o=this;o.positionAbs=s.positionAbs,o.helperProportions=s.helperProportions,o.offset.click=s.offset.click,o._intersectsWith(o.containerCache)&&(n=!0,t.each(s.sortables,function(){return this.positionAbs=s.positionAbs,this.helperProportions=s.helperProportions,this.offset.click=s.offset.click,this!==o&&this._intersectsWith(this.containerCache)&&t.contains(o.element[0],this.element[0])&&(n=!1),n})),n?(o.isOver||(o.isOver=1,s._parent=i.helper.parent(),o.currentItem=i.helper.appendTo(o.element).data("ui-sortable-item",!0),o.options._helper=o.options.helper,o.options.helper=function(){return i.helper[0]},e.target=o.currentItem[0],o._mouseCapture(e,!0),o._mouseStart(e,!0,!0),o.offset.click.top=s.offset.click.top,o.offset.click.left=s.offset.click.left,o.offset.parent.left-=s.offset.parent.left-o.offset.parent.left,o.offset.parent.top-=s.offset.parent.top-o.offset.parent.top,s._trigger("toSortable",e),s.dropped=o.element,t.each(s.sortables,function(){this.refreshPositions()}),s.currentItem=s.element,o.fromOutside=s),o.currentItem&&(o._mouseDrag(e),i.position=o.position)):o.isOver&&(o.isOver=0,o.cancelHelperRemoval=!0,o.options._revert=o.options.revert,o.options.revert=!1,o._trigger("out",e,o._uiHash(o)),o._mouseStop(e,!0),o.options.revert=o.options._revert,o.options.helper=o.options._helper,o.placeholder&&o.placeholder.remove(),i.helper.appendTo(s._parent),s._refreshOffsets(e),i.position=s._generatePosition(e,!0),s._trigger("fromSortable",e),s.dropped=!1,t.each(s.sortables,function(){this.refreshPositions()}))})}}),t.ui.plugin.add("draggable","cursor",{start:function(e,i,s){var n=t("body"),o=s.options;n.css("cursor")&&(o._cursor=n.css("cursor")),n.css("cursor",o.cursor)},stop:function(e,i,s){var n=s.options;n._cursor&&t("body").css("cursor",n._cursor)}}),t.ui.plugin.add("draggable","opacity",{start:function(e,i,s){var n=t(i.helper),o=s.options;n.css("opacity")&&(o._opacity=n.css("opacity")),n.css("opacity",o.opacity)},stop:function(e,i,s){var n=s.options;n._opacity&&t(i.helper).css("opacity",n._opacity)}}),t.ui.plugin.add("draggable","scroll",{start:function(t,e,i){i.scrollParentNotHidden||(i.scrollParentNotHidden=i.helper.scrollParent(!1)),i.scrollParentNotHidden[0]!==i.document[0]&&"HTML"!==i.scrollParentNotHidden[0].tagName&&(i.overflowOffset=i.scrollParentNotHidden.offset())},drag:function(e,i,s){var n=s.options,o=!1,a=s.scrollParentNotHidden[0],r=s.document[0];a!==r&&"HTML"!==a.tagName?(n.axis&&"x"===n.axis||(s.overflowOffset.top+a.offsetHeight-e.pageY<n.scrollSensitivity?a.scrollTop=o=a.scrollTop+n.scrollSpeed:e.pageY-s.overflowOffset.top<n.scrollSensitivity&&(a.scrollTop=o=a.scrollTop-n.scrollSpeed)),n.axis&&"y"===n.axis||(s.overflowOffset.left+a.offsetWidth-e.pageX<n.scrollSensitivity?a.scrollLeft=o=a.scrollLeft+n.scrollSpeed:e.pageX-s.overflowOffset.left<n.scrollSensitivity&&(a.scrollLeft=o=a.scrollLeft-n.scrollSpeed))):(n.axis&&"x"===n.axis||(e.pageY-t(r).scrollTop()<n.scrollSensitivity?o=t(r).scrollTop(t(r).scrollTop()-n.scrollSpeed):t(window).height()-(e.pageY-t(r).scrollTop())<n.scrollSensitivity&&(o=t(r).scrollTop(t(r).scrollTop()+n.scrollSpeed))),n.axis&&"y"===n.axis||(e.pageX-t(r).scrollLeft()<n.scrollSensitivity?o=t(r).scrollLeft(t(r).scrollLeft()-n.scrollSpeed):t(window).width()-(e.pageX-t(r).scrollLeft())<n.scrollSensitivity&&(o=t(r).scrollLeft(t(r).scrollLeft()+n.scrollSpeed)))),o!==!1&&t.ui.ddmanager&&!n.dropBehaviour&&t.ui.ddmanager.prepareOffsets(s,e)}}),t.ui.plugin.add("draggable","snap",{start:function(e,i,s){var n=s.options;s.snapElements=[],t(n.snap.constructor!==String?n.snap.items||":data(ui-draggable)":n.snap).each(function(){var e=t(this),i=e.offset();this!==s.element[0]&&s.snapElements.push({item:this,width:e.outerWidth(),height:e.outerHeight(),top:i.top,left:i.left})})},drag:function(e,i,s){var n,o,a,r,h,l,c,u,d,p,f=s.options,g=f.snapTolerance,m=i.offset.left,_=m+s.helperProportions.width,v=i.offset.top,b=v+s.helperProportions.height;for(d=s.snapElements.length-1;d>=0;d--)h=s.snapElements[d].left-s.margins.left,l=h+s.snapElements[d].width,c=s.snapElements[d].top-s.margins.top,u=c+s.snapElements[d].height,h-g>_||m>l+g||c-g>b||v>u+g||!t.contains(s.snapElements[d].item.ownerDocument,s.snapElements[d].item)?(s.snapElements[d].snapping&&s.options.snap.release&&s.options.snap.release.call(s.element,e,t.extend(s._uiHash(),{snapItem:s.snapElements[d].item})),s.snapElements[d].snapping=!1):("inner"!==f.snapMode&&(n=g>=Math.abs(c-b),o=g>=Math.abs(u-v),a=g>=Math.abs(h-_),r=g>=Math.abs(l-m),n&&(i.position.top=s._convertPositionTo("relative",{top:c-s.helperProportions.height,left:0}).top),o&&(i.position.top=s._convertPositionTo("relative",{top:u,left:0}).top),a&&(i.position.left=s._convertPositionTo("relative",{top:0,left:h-s.helperProportions.width}).left),r&&(i.position.left=s._convertPositionTo("relative",{top:0,left:l}).left)),p=n||o||a||r,"outer"!==f.snapMode&&(n=g>=Math.abs(c-v),o=g>=Math.abs(u-b),a=g>=Math.abs(h-m),r=g>=Math.abs(l-_),n&&(i.position.top=s._convertPositionTo("relative",{top:c,left:0}).top),o&&(i.position.top=s._convertPositionTo("relative",{top:u-s.helperProportions.height,left:0}).top),a&&(i.position.left=s._convertPositionTo("relative",{top:0,left:h}).left),r&&(i.position.left=s._convertPositionTo("relative",{top:0,left:l-s.helperProportions.width}).left)),!s.snapElements[d].snapping&&(n||o||a||r||p)&&s.options.snap.snap&&s.options.snap.snap.call(s.element,e,t.extend(s._uiHash(),{snapItem:s.snapElements[d].item})),s.snapElements[d].snapping=n||o||a||r||p)}}),t.ui.plugin.add("draggable","stack",{start:function(e,i,s){var n,o=s.options,a=t.makeArray(t(o.stack)).sort(function(e,i){return(parseInt(t(e).css("zIndex"),10)||0)-(parseInt(t(i).css("zIndex"),10)||0)});a.length&&(n=parseInt(t(a[0]).css("zIndex"),10)||0,t(a).each(function(e){t(this).css("zIndex",n+e)}),this.css("zIndex",n+a.length))}}),t.ui.plugin.add("draggable","zIndex",{start:function(e,i,s){var n=t(i.helper),o=s.options;n.css("zIndex")&&(o._zIndex=n.css("zIndex")),n.css("zIndex",o.zIndex)},stop:function(e,i,s){var n=s.options;n._zIndex&&t(i.helper).css("zIndex",n._zIndex)}}),t.ui.draggable,t.widget("ui.resizable",t.ui.mouse,{version:"1.12.1",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,classes:{"ui-resizable-se":"ui-icon ui-icon-gripsmall-diagonal-se"},containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_num:function(t){return parseFloat(t)||0},_isNumber:function(t){return!isNaN(parseFloat(t))},_hasScroll:function(e,i){if("hidden"===t(e).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",n=!1;return e[s]>0?!0:(e[s]=1,n=e[s]>0,e[s]=0,n)},_create:function(){var e,i=this.options,s=this;this._addClass("ui-resizable"),t.extend(this,{_aspectRatio:!!i.aspectRatio,aspectRatio:i.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:i.helper||i.ghost||i.animate?i.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i)&&(this.element.wrap(t("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.resizable("instance")),this.elementIsWrapper=!0,e={marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom"),marginLeft:this.originalElement.css("marginLeft")},this.element.css(e),this.originalElement.css("margin",0),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css(e),this._proportionallyResize()),this._setupHandles(),i.autoHide&&t(this.element).on("mouseenter",function(){i.disabled||(s._removeClass("ui-resizable-autohide"),s._handles.show())}).on("mouseleave",function(){i.disabled||s.resizing||(s._addClass("ui-resizable-autohide"),s._handles.hide())}),this._mouseInit()},_destroy:function(){this._mouseDestroy();var e,i=function(e){t(e).removeData("resizable").removeData("ui-resizable").off(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),e=this.element,this.originalElement.css({position:e.css("position"),width:e.outerWidth(),height:e.outerHeight(),top:e.css("top"),left:e.css("left")}).insertAfter(e),e.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_setOption:function(t,e){switch(this._super(t,e),t){case"handles":this._removeHandles(),this._setupHandles();break;default:}},_setupHandles:function(){var e,i,s,n,o,a=this.options,r=this;if(this.handles=a.handles||(t(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this._handles=t(),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),s=this.handles.split(","),this.handles={},i=0;s.length>i;i++)e=t.trim(s[i]),n="ui-resizable-"+e,o=t("<div>"),this._addClass(o,"ui-resizable-handle "+n),o.css({zIndex:a.zIndex}),this.handles[e]=".ui-resizable-"+e,this.element.append(o);this._renderAxis=function(e){var i,s,n,o;e=e||this.element;for(i in this.handles)this.handles[i].constructor===String?this.handles[i]=this.element.children(this.handles[i]).first().show():(this.handles[i].jquery||this.handles[i].nodeType)&&(this.handles[i]=t(this.handles[i]),this._on(this.handles[i],{mousedown:r._mouseDown})),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i)&&(s=t(this.handles[i],this.element),o=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),n=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),e.css(n,o),this._proportionallyResize()),this._handles=this._handles.add(this.handles[i])},this._renderAxis(this.element),this._handles=this._handles.add(this.element.find(".ui-resizable-handle")),this._handles.disableSelection(),this._handles.on("mouseover",function(){r.resizing||(this.className&&(o=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),r.axis=o&&o[1]?o[1]:"se")}),a.autoHide&&(this._handles.hide(),this._addClass("ui-resizable-autohide"))},_removeHandles:function(){this._handles.remove()},_mouseCapture:function(e){var i,s,n=!1;for(i in this.handles)s=t(this.handles[i])[0],(s===e.target||t.contains(s,e.target))&&(n=!0);return!this.options.disabled&&n},_mouseStart:function(e){var i,s,n,o=this.options,a=this.element;return this.resizing=!0,this._renderProxy(),i=this._num(this.helper.css("left")),s=this._num(this.helper.css("top")),o.containment&&(i+=t(o.containment).scrollLeft()||0,s+=t(o.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:i,top:s},this.size=this._helper?{width:this.helper.width(),height:this.helper.height()}:{width:a.width(),height:a.height()},this.originalSize=this._helper?{width:a.outerWidth(),height:a.outerHeight()}:{width:a.width(),height:a.height()},this.sizeDiff={width:a.outerWidth()-a.width(),height:a.outerHeight()-a.height()},this.originalPosition={left:i,top:s},this.originalMousePosition={left:e.pageX,top:e.pageY},this.aspectRatio="number"==typeof o.aspectRatio?o.aspectRatio:this.originalSize.width/this.originalSize.height||1,n=t(".ui-resizable-"+this.axis).css("cursor"),t("body").css("cursor","auto"===n?this.axis+"-resize":n),this._addClass("ui-resizable-resizing"),this._propagate("start",e),!0},_mouseDrag:function(e){var i,s,n=this.originalMousePosition,o=this.axis,a=e.pageX-n.left||0,r=e.pageY-n.top||0,h=this._change[o];return this._updatePrevProperties(),h?(i=h.apply(this,[e,a,r]),this._updateVirtualBoundaries(e.shiftKey),(this._aspectRatio||e.shiftKey)&&(i=this._updateRatio(i,e)),i=this._respectSize(i,e),this._updateCache(i),this._propagate("resize",e),s=this._applyChanges(),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),t.isEmptyObject(s)||(this._updatePrevProperties(),this._trigger("resize",e,this.ui()),this._applyChanges()),!1):!1},_mouseStop:function(e){this.resizing=!1;var i,s,n,o,a,r,h,l=this.options,c=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),n=s&&this._hasScroll(i[0],"left")?0:c.sizeDiff.height,o=s?0:c.sizeDiff.width,a={width:c.helper.width()-o,height:c.helper.height()-n},r=parseFloat(c.element.css("left"))+(c.position.left-c.originalPosition.left)||null,h=parseFloat(c.element.css("top"))+(c.position.top-c.originalPosition.top)||null,l.animate||this.element.css(t.extend(a,{top:h,left:r})),c.helper.height(c.size.height),c.helper.width(c.size.width),this._helper&&!l.animate&&this._proportionallyResize()),t("body").css("cursor","auto"),this._removeClass("ui-resizable-resizing"),this._propagate("stop",e),this._helper&&this.helper.remove(),!1},_updatePrevProperties:function(){this.prevPosition={top:this.position.top,left:this.position.left},this.prevSize={width:this.size.width,height:this.size.height}},_applyChanges:function(){var t={};return this.position.top!==this.prevPosition.top&&(t.top=this.position.top+"px"),this.position.left!==this.prevPosition.left&&(t.left=this.position.left+"px"),this.size.width!==this.prevSize.width&&(t.width=this.size.width+"px"),this.size.height!==this.prevSize.height&&(t.height=this.size.height+"px"),this.helper.css(t),t},_updateVirtualBoundaries:function(t){var e,i,s,n,o,a=this.options;o={minWidth:this._isNumber(a.minWidth)?a.minWidth:0,maxWidth:this._isNumber(a.maxWidth)?a.maxWidth:1/0,minHeight:this._isNumber(a.minHeight)?a.minHeight:0,maxHeight:this._isNumber(a.maxHeight)?a.maxHeight:1/0},(this._aspectRatio||t)&&(e=o.minHeight*this.aspectRatio,s=o.minWidth/this.aspectRatio,i=o.maxHeight*this.aspectRatio,n=o.maxWidth/this.aspectRatio,e>o.minWidth&&(o.minWidth=e),s>o.minHeight&&(o.minHeight=s),o.maxWidth>i&&(o.maxWidth=i),o.maxHeight>n&&(o.maxHeight=n)),this._vBoundaries=o},_updateCache:function(t){this.offset=this.helper.offset(),this._isNumber(t.left)&&(this.position.left=t.left),this._isNumber(t.top)&&(this.position.top=t.top),this._isNumber(t.height)&&(this.size.height=t.height),this._isNumber(t.width)&&(this.size.width=t.width)},_updateRatio:function(t){var e=this.position,i=this.size,s=this.axis;return this._isNumber(t.height)?t.width=t.height*this.aspectRatio:this._isNumber(t.width)&&(t.height=t.width/this.aspectRatio),"sw"===s&&(t.left=e.left+(i.width-t.width),t.top=null),"nw"===s&&(t.top=e.top+(i.height-t.height),t.left=e.left+(i.width-t.width)),t},_respectSize:function(t){var e=this._vBoundaries,i=this.axis,s=this._isNumber(t.width)&&e.maxWidth&&e.maxWidth<t.width,n=this._isNumber(t.height)&&e.maxHeight&&e.maxHeight<t.height,o=this._isNumber(t.width)&&e.minWidth&&e.minWidth>t.width,a=this._isNumber(t.height)&&e.minHeight&&e.minHeight>t.height,r=this.originalPosition.left+this.originalSize.width,h=this.originalPosition.top+this.originalSize.height,l=/sw|nw|w/.test(i),c=/nw|ne|n/.test(i);return o&&(t.width=e.minWidth),a&&(t.height=e.minHeight),s&&(t.width=e.maxWidth),n&&(t.height=e.maxHeight),o&&l&&(t.left=r-e.minWidth),s&&l&&(t.left=r-e.maxWidth),a&&c&&(t.top=h-e.minHeight),n&&c&&(t.top=h-e.maxHeight),t.width||t.height||t.left||!t.top?t.width||t.height||t.top||!t.left||(t.left=null):t.top=null,t},_getPaddingPlusBorderDimensions:function(t){for(var e=0,i=[],s=[t.css("borderTopWidth"),t.css("borderRightWidth"),t.css("borderBottomWidth"),t.css("borderLeftWidth")],n=[t.css("paddingTop"),t.css("paddingRight"),t.css("paddingBottom"),t.css("paddingLeft")];4>e;e++)i[e]=parseFloat(s[e])||0,i[e]+=parseFloat(n[e])||0;return{height:i[0]+i[2],width:i[1]+i[3]}},_proportionallyResize:function(){if(this._proportionallyResizeElements.length)for(var t,e=0,i=this.helper||this.element;this._proportionallyResizeElements.length>e;e++)t=this._proportionallyResizeElements[e],this.outerDimensions||(this.outerDimensions=this._getPaddingPlusBorderDimensions(t)),t.css({height:i.height()-this.outerDimensions.height||0,width:i.width()-this.outerDimensions.width||0})},_renderProxy:function(){var e=this.element,i=this.options;this.elementOffset=e.offset(),this._helper?(this.helper=this.helper||t("<div style='overflow:hidden;'></div>"),this._addClass(this.helper,this._helper),this.helper.css({width:this.element.outerWidth(),height:this.element.outerHeight(),position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(t,e){return{width:this.originalSize.width+e}},w:function(t,e){var i=this.originalSize,s=this.originalPosition;return{left:s.left+e,width:i.width-e}},n:function(t,e,i){var s=this.originalSize,n=this.originalPosition;return{top:n.top+i,height:s.height-i}},s:function(t,e,i){return{height:this.originalSize.height+i}},se:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},sw:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[e,i,s]))},ne:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},nw:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[e,i,s]))}},_propagate:function(e,i){t.ui.plugin.call(this,e,[i,this.ui()]),"resize"!==e&&this._trigger(e,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),t.ui.plugin.add("resizable","animate",{stop:function(e){var i=t(this).resizable("instance"),s=i.options,n=i._proportionallyResizeElements,o=n.length&&/textarea/i.test(n[0].nodeName),a=o&&i._hasScroll(n[0],"left")?0:i.sizeDiff.height,r=o?0:i.sizeDiff.width,h={width:i.size.width-r,height:i.size.height-a},l=parseFloat(i.element.css("left"))+(i.position.left-i.originalPosition.left)||null,c=parseFloat(i.element.css("top"))+(i.position.top-i.originalPosition.top)||null;i.element.animate(t.extend(h,c&&l?{top:c,left:l}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseFloat(i.element.css("width")),height:parseFloat(i.element.css("height")),top:parseFloat(i.element.css("top")),left:parseFloat(i.element.css("left"))};n&&n.length&&t(n[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",e)}})}}),t.ui.plugin.add("resizable","containment",{start:function(){var e,i,s,n,o,a,r,h=t(this).resizable("instance"),l=h.options,c=h.element,u=l.containment,d=u instanceof t?u.get(0):/parent/.test(u)?c.parent().get(0):u;d&&(h.containerElement=t(d),/document/.test(u)||u===document?(h.containerOffset={left:0,top:0},h.containerPosition={left:0,top:0},h.parentData={element:t(document),left:0,top:0,width:t(document).width(),height:t(document).height()||document.body.parentNode.scrollHeight}):(e=t(d),i=[],t(["Top","Right","Left","Bottom"]).each(function(t,s){i[t]=h._num(e.css("padding"+s))}),h.containerOffset=e.offset(),h.containerPosition=e.position(),h.containerSize={height:e.innerHeight()-i[3],width:e.innerWidth()-i[1]},s=h.containerOffset,n=h.containerSize.height,o=h.containerSize.width,a=h._hasScroll(d,"left")?d.scrollWidth:o,r=h._hasScroll(d)?d.scrollHeight:n,h.parentData={element:d,left:s.left,top:s.top,width:a,height:r}))},resize:function(e){var i,s,n,o,a=t(this).resizable("instance"),r=a.options,h=a.containerOffset,l=a.position,c=a._aspectRatio||e.shiftKey,u={top:0,left:0},d=a.containerElement,p=!0;d[0]!==document&&/static/.test(d.css("position"))&&(u=h),l.left<(a._helper?h.left:0)&&(a.size.width=a.size.width+(a._helper?a.position.left-h.left:a.position.left-u.left),c&&(a.size.height=a.size.width/a.aspectRatio,p=!1),a.position.left=r.helper?h.left:0),l.top<(a._helper?h.top:0)&&(a.size.height=a.size.height+(a._helper?a.position.top-h.top:a.position.top),c&&(a.size.width=a.size.height*a.aspectRatio,p=!1),a.position.top=a._helper?h.top:0),n=a.containerElement.get(0)===a.element.parent().get(0),o=/relative|absolute/.test(a.containerElement.css("position")),n&&o?(a.offset.left=a.parentData.left+a.position.left,a.offset.top=a.parentData.top+a.position.top):(a.offset.left=a.element.offset().left,a.offset.top=a.element.offset().top),i=Math.abs(a.sizeDiff.width+(a._helper?a.offset.left-u.left:a.offset.left-h.left)),s=Math.abs(a.sizeDiff.height+(a._helper?a.offset.top-u.top:a.offset.top-h.top)),i+a.size.width>=a.parentData.width&&(a.size.width=a.parentData.width-i,c&&(a.size.height=a.size.width/a.aspectRatio,p=!1)),s+a.size.height>=a.parentData.height&&(a.size.height=a.parentData.height-s,c&&(a.size.width=a.size.height*a.aspectRatio,p=!1)),p||(a.position.left=a.prevPosition.left,a.position.top=a.prevPosition.top,a.size.width=a.prevSize.width,a.size.height=a.prevSize.height)},stop:function(){var e=t(this).resizable("instance"),i=e.options,s=e.containerOffset,n=e.containerPosition,o=e.containerElement,a=t(e.helper),r=a.offset(),h=a.outerWidth()-e.sizeDiff.width,l=a.outerHeight()-e.sizeDiff.height;e._helper&&!i.animate&&/relative/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:h,height:l}),e._helper&&!i.animate&&/static/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:h,height:l})}}),t.ui.plugin.add("resizable","alsoResize",{start:function(){var e=t(this).resizable("instance"),i=e.options;t(i.alsoResize).each(function(){var e=t(this);e.data("ui-resizable-alsoresize",{width:parseFloat(e.width()),height:parseFloat(e.height()),left:parseFloat(e.css("left")),top:parseFloat(e.css("top"))})})},resize:function(e,i){var s=t(this).resizable("instance"),n=s.options,o=s.originalSize,a=s.originalPosition,r={height:s.size.height-o.height||0,width:s.size.width-o.width||0,top:s.position.top-a.top||0,left:s.position.left-a.left||0};t(n.alsoResize).each(function(){var e=t(this),s=t(this).data("ui-resizable-alsoresize"),n={},o=e.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];t.each(o,function(t,e){var i=(s[e]||0)+(r[e]||0);i&&i>=0&&(n[e]=i||null)}),e.css(n)})},stop:function(){t(this).removeData("ui-resizable-alsoresize")}}),t.ui.plugin.add("resizable","ghost",{start:function(){var e=t(this).resizable("instance"),i=e.size;e.ghost=e.originalElement.clone(),e.ghost.css({opacity:.25,display:"block",position:"relative",height:i.height,width:i.width,margin:0,left:0,top:0}),e._addClass(e.ghost,"ui-resizable-ghost"),t.uiBackCompat!==!1&&"string"==typeof e.options.ghost&&e.ghost.addClass(this.options.ghost),e.ghost.appendTo(e.helper)},resize:function(){var e=t(this).resizable("instance");e.ghost&&e.ghost.css({position:"relative",height:e.size.height,width:e.size.width})},stop:function(){var e=t(this).resizable("instance");e.ghost&&e.helper&&e.helper.get(0).removeChild(e.ghost.get(0))}}),t.ui.plugin.add("resizable","grid",{resize:function(){var e,i=t(this).resizable("instance"),s=i.options,n=i.size,o=i.originalSize,a=i.originalPosition,r=i.axis,h="number"==typeof s.grid?[s.grid,s.grid]:s.grid,l=h[0]||1,c=h[1]||1,u=Math.round((n.width-o.width)/l)*l,d=Math.round((n.height-o.height)/c)*c,p=o.width+u,f=o.height+d,g=s.maxWidth&&p>s.maxWidth,m=s.maxHeight&&f>s.maxHeight,_=s.minWidth&&s.minWidth>p,v=s.minHeight&&s.minHeight>f;s.grid=h,_&&(p+=l),v&&(f+=c),g&&(p-=l),m&&(f-=c),/^(se|s|e)$/.test(r)?(i.size.width=p,i.size.height=f):/^(ne)$/.test(r)?(i.size.width=p,i.size.height=f,i.position.top=a.top-d):/^(sw)$/.test(r)?(i.size.width=p,i.size.height=f,i.position.left=a.left-u):((0>=f-c||0>=p-l)&&(e=i._getPaddingPlusBorderDimensions(this)),f-c>0?(i.size.height=f,i.position.top=a.top-d):(f=c-e.height,i.size.height=f,i.position.top=a.top+o.height-f),p-l>0?(i.size.width=p,i.position.left=a.left-u):(p=l-e.width,i.size.width=p,i.position.left=a.left+o.width-p))}}),t.ui.resizable,t.widget("ui.dialog",{version:"1.12.1",options:{appendTo:"body",autoOpen:!0,buttons:[],classes:{"ui-dialog":"ui-corner-all","ui-dialog-titlebar":"ui-corner-all"},closeOnEscape:!0,closeText:"Close",draggable:!0,hide:null,height:"auto",maxHeight:null,maxWidth:null,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(e){var i=t(this).css(e).offset().top;0>i&&t(this).css("top",e.top-i)}},resizable:!0,show:null,title:null,width:300,beforeClose:null,close:null,drag:null,dragStart:null,dragStop:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null},sizeRelatedOptions:{buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},resizableRelatedOptions:{maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0},_create:function(){this.originalCss={display:this.element[0].style.display,width:this.element[0].style.width,minHeight:this.element[0].style.minHeight,maxHeight:this.element[0].style.maxHeight,height:this.element[0].style.height},this.originalPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.originalTitle=this.element.attr("title"),null==this.options.title&&null!=this.originalTitle&&(this.options.title=this.originalTitle),this.options.disabled&&(this.options.disabled=!1),this._createWrapper(),this.element.show().removeAttr("title").appendTo(this.uiDialog),this._addClass("ui-dialog-content","ui-widget-content"),this._createTitlebar(),this._createButtonPane(),this.options.draggable&&t.fn.draggable&&this._makeDraggable(),this.options.resizable&&t.fn.resizable&&this._makeResizable(),this._isOpen=!1,this._trackFocus()},_init:function(){this.options.autoOpen&&this.open()},_appendTo:function(){var e=this.options.appendTo;return e&&(e.jquery||e.nodeType)?t(e):this.document.find(e||"body").eq(0)},_destroy:function(){var t,e=this.originalPosition;this._untrackInstance(),this._destroyOverlay(),this.element.removeUniqueId().css(this.originalCss).detach(),this.uiDialog.remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),t=e.parent.children().eq(e.index),t.length&&t[0]!==this.element[0]?t.before(this.element):e.parent.append(this.element)},widget:function(){return this.uiDialog
},disable:t.noop,enable:t.noop,close:function(e){var i=this;this._isOpen&&this._trigger("beforeClose",e)!==!1&&(this._isOpen=!1,this._focusedElement=null,this._destroyOverlay(),this._untrackInstance(),this.opener.filter(":focusable").trigger("focus").length||t.ui.safeBlur(t.ui.safeActiveElement(this.document[0])),this._hide(this.uiDialog,this.options.hide,function(){i._trigger("close",e)}))},isOpen:function(){return this._isOpen},moveToTop:function(){this._moveToTop()},_moveToTop:function(e,i){var s=!1,n=this.uiDialog.siblings(".ui-front:visible").map(function(){return+t(this).css("z-index")}).get(),o=Math.max.apply(null,n);return o>=+this.uiDialog.css("z-index")&&(this.uiDialog.css("z-index",o+1),s=!0),s&&!i&&this._trigger("focus",e),s},open:function(){var e=this;return this._isOpen?(this._moveToTop()&&this._focusTabbable(),void 0):(this._isOpen=!0,this.opener=t(t.ui.safeActiveElement(this.document[0])),this._size(),this._position(),this._createOverlay(),this._moveToTop(null,!0),this.overlay&&this.overlay.css("z-index",this.uiDialog.css("z-index")-1),this._show(this.uiDialog,this.options.show,function(){e._focusTabbable(),e._trigger("focus")}),this._makeFocusTarget(),this._trigger("open"),void 0)},_focusTabbable:function(){var t=this._focusedElement;t||(t=this.element.find("[autofocus]")),t.length||(t=this.element.find(":tabbable")),t.length||(t=this.uiDialogButtonPane.find(":tabbable")),t.length||(t=this.uiDialogTitlebarClose.filter(":tabbable")),t.length||(t=this.uiDialog),t.eq(0).trigger("focus")},_keepFocus:function(e){function i(){var e=t.ui.safeActiveElement(this.document[0]),i=this.uiDialog[0]===e||t.contains(this.uiDialog[0],e);i||this._focusTabbable()}e.preventDefault(),i.call(this),this._delay(i)},_createWrapper:function(){this.uiDialog=t("<div>").hide().attr({tabIndex:-1,role:"dialog"}).appendTo(this._appendTo()),this._addClass(this.uiDialog,"ui-dialog","ui-widget ui-widget-content ui-front"),this._on(this.uiDialog,{keydown:function(e){if(this.options.closeOnEscape&&!e.isDefaultPrevented()&&e.keyCode&&e.keyCode===t.ui.keyCode.ESCAPE)return e.preventDefault(),this.close(e),void 0;if(e.keyCode===t.ui.keyCode.TAB&&!e.isDefaultPrevented()){var i=this.uiDialog.find(":tabbable"),s=i.filter(":first"),n=i.filter(":last");e.target!==n[0]&&e.target!==this.uiDialog[0]||e.shiftKey?e.target!==s[0]&&e.target!==this.uiDialog[0]||!e.shiftKey||(this._delay(function(){n.trigger("focus")}),e.preventDefault()):(this._delay(function(){s.trigger("focus")}),e.preventDefault())}},mousedown:function(t){this._moveToTop(t)&&this._focusTabbable()}}),this.element.find("[aria-describedby]").length||this.uiDialog.attr({"aria-describedby":this.element.uniqueId().attr("id")})},_createTitlebar:function(){var e;this.uiDialogTitlebar=t("<div>"),this._addClass(this.uiDialogTitlebar,"ui-dialog-titlebar","ui-widget-header ui-helper-clearfix"),this._on(this.uiDialogTitlebar,{mousedown:function(e){t(e.target).closest(".ui-dialog-titlebar-close")||this.uiDialog.trigger("focus")}}),this.uiDialogTitlebarClose=t("<button type='button'></button>").button({label:t("<a>").text(this.options.closeText).html(),icon:"ui-icon-closethick",showLabel:!1}).appendTo(this.uiDialogTitlebar),this._addClass(this.uiDialogTitlebarClose,"ui-dialog-titlebar-close"),this._on(this.uiDialogTitlebarClose,{click:function(t){t.preventDefault(),this.close(t)}}),e=t("<span>").uniqueId().prependTo(this.uiDialogTitlebar),this._addClass(e,"ui-dialog-title"),this._title(e),this.uiDialogTitlebar.prependTo(this.uiDialog),this.uiDialog.attr({"aria-labelledby":e.attr("id")})},_title:function(t){this.options.title?t.text(this.options.title):t.html("&#160;")},_createButtonPane:function(){this.uiDialogButtonPane=t("<div>"),this._addClass(this.uiDialogButtonPane,"ui-dialog-buttonpane","ui-widget-content ui-helper-clearfix"),this.uiButtonSet=t("<div>").appendTo(this.uiDialogButtonPane),this._addClass(this.uiButtonSet,"ui-dialog-buttonset"),this._createButtons()},_createButtons:function(){var e=this,i=this.options.buttons;return this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),t.isEmptyObject(i)||t.isArray(i)&&!i.length?(this._removeClass(this.uiDialog,"ui-dialog-buttons"),void 0):(t.each(i,function(i,s){var n,o;s=t.isFunction(s)?{click:s,text:i}:s,s=t.extend({type:"button"},s),n=s.click,o={icon:s.icon,iconPosition:s.iconPosition,showLabel:s.showLabel,icons:s.icons,text:s.text},delete s.click,delete s.icon,delete s.iconPosition,delete s.showLabel,delete s.icons,"boolean"==typeof s.text&&delete s.text,t("<button></button>",s).button(o).appendTo(e.uiButtonSet).on("click",function(){n.apply(e.element[0],arguments)})}),this._addClass(this.uiDialog,"ui-dialog-buttons"),this.uiDialogButtonPane.appendTo(this.uiDialog),void 0)},_makeDraggable:function(){function e(t){return{position:t.position,offset:t.offset}}var i=this,s=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(s,n){i._addClass(t(this),"ui-dialog-dragging"),i._blockFrames(),i._trigger("dragStart",s,e(n))},drag:function(t,s){i._trigger("drag",t,e(s))},stop:function(n,o){var a=o.offset.left-i.document.scrollLeft(),r=o.offset.top-i.document.scrollTop();s.position={my:"left top",at:"left"+(a>=0?"+":"")+a+" "+"top"+(r>=0?"+":"")+r,of:i.window},i._removeClass(t(this),"ui-dialog-dragging"),i._unblockFrames(),i._trigger("dragStop",n,e(o))}})},_makeResizable:function(){function e(t){return{originalPosition:t.originalPosition,originalSize:t.originalSize,position:t.position,size:t.size}}var i=this,s=this.options,n=s.resizable,o=this.uiDialog.css("position"),a="string"==typeof n?n:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:s.maxWidth,maxHeight:s.maxHeight,minWidth:s.minWidth,minHeight:this._minHeight(),handles:a,start:function(s,n){i._addClass(t(this),"ui-dialog-resizing"),i._blockFrames(),i._trigger("resizeStart",s,e(n))},resize:function(t,s){i._trigger("resize",t,e(s))},stop:function(n,o){var a=i.uiDialog.offset(),r=a.left-i.document.scrollLeft(),h=a.top-i.document.scrollTop();s.height=i.uiDialog.height(),s.width=i.uiDialog.width(),s.position={my:"left top",at:"left"+(r>=0?"+":"")+r+" "+"top"+(h>=0?"+":"")+h,of:i.window},i._removeClass(t(this),"ui-dialog-resizing"),i._unblockFrames(),i._trigger("resizeStop",n,e(o))}}).css("position",o)},_trackFocus:function(){this._on(this.widget(),{focusin:function(e){this._makeFocusTarget(),this._focusedElement=t(e.target)}})},_makeFocusTarget:function(){this._untrackInstance(),this._trackingInstances().unshift(this)},_untrackInstance:function(){var e=this._trackingInstances(),i=t.inArray(this,e);-1!==i&&e.splice(i,1)},_trackingInstances:function(){var t=this.document.data("ui-dialog-instances");return t||(t=[],this.document.data("ui-dialog-instances",t)),t},_minHeight:function(){var t=this.options;return"auto"===t.height?t.minHeight:Math.min(t.minHeight,t.height)},_position:function(){var t=this.uiDialog.is(":visible");t||this.uiDialog.show(),this.uiDialog.position(this.options.position),t||this.uiDialog.hide()},_setOptions:function(e){var i=this,s=!1,n={};t.each(e,function(t,e){i._setOption(t,e),t in i.sizeRelatedOptions&&(s=!0),t in i.resizableRelatedOptions&&(n[t]=e)}),s&&(this._size(),this._position()),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option",n)},_setOption:function(e,i){var s,n,o=this.uiDialog;"disabled"!==e&&(this._super(e,i),"appendTo"===e&&this.uiDialog.appendTo(this._appendTo()),"buttons"===e&&this._createButtons(),"closeText"===e&&this.uiDialogTitlebarClose.button({label:t("<a>").text(""+this.options.closeText).html()}),"draggable"===e&&(s=o.is(":data(ui-draggable)"),s&&!i&&o.draggable("destroy"),!s&&i&&this._makeDraggable()),"position"===e&&this._position(),"resizable"===e&&(n=o.is(":data(ui-resizable)"),n&&!i&&o.resizable("destroy"),n&&"string"==typeof i&&o.resizable("option","handles",i),n||i===!1||this._makeResizable()),"title"===e&&this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))},_size:function(){var t,e,i,s=this.options;this.element.show().css({width:"auto",minHeight:0,maxHeight:"none",height:0}),s.minWidth>s.width&&(s.width=s.minWidth),t=this.uiDialog.css({height:"auto",width:s.width}).outerHeight(),e=Math.max(0,s.minHeight-t),i="number"==typeof s.maxHeight?Math.max(0,s.maxHeight-t):"none","auto"===s.height?this.element.css({minHeight:e,maxHeight:i,height:"auto"}):this.element.height(Math.max(0,s.height-t)),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())},_blockFrames:function(){this.iframeBlocks=this.document.find("iframe").map(function(){var e=t(this);return t("<div>").css({position:"absolute",width:e.outerWidth(),height:e.outerHeight()}).appendTo(e.parent()).offset(e.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_allowInteraction:function(e){return t(e.target).closest(".ui-dialog").length?!0:!!t(e.target).closest(".ui-datepicker").length},_createOverlay:function(){if(this.options.modal){var e=!0;this._delay(function(){e=!1}),this.document.data("ui-dialog-overlays")||this._on(this.document,{focusin:function(t){e||this._allowInteraction(t)||(t.preventDefault(),this._trackingInstances()[0]._focusTabbable())}}),this.overlay=t("<div>").appendTo(this._appendTo()),this._addClass(this.overlay,null,"ui-widget-overlay ui-front"),this._on(this.overlay,{mousedown:"_keepFocus"}),this.document.data("ui-dialog-overlays",(this.document.data("ui-dialog-overlays")||0)+1)}},_destroyOverlay:function(){if(this.options.modal&&this.overlay){var t=this.document.data("ui-dialog-overlays")-1;t?this.document.data("ui-dialog-overlays",t):(this._off(this.document,"focusin"),this.document.removeData("ui-dialog-overlays")),this.overlay.remove(),this.overlay=null}}}),t.uiBackCompat!==!1&&t.widget("ui.dialog",t.ui.dialog,{options:{dialogClass:""},_createWrapper:function(){this._super(),this.uiDialog.addClass(this.options.dialogClass)},_setOption:function(t,e){"dialogClass"===t&&this.uiDialog.removeClass(this.options.dialogClass).addClass(e),this._superApply(arguments)}}),t.ui.dialog,t.widget("ui.droppable",{version:"1.12.1",widgetEventPrefix:"drop",options:{accept:"*",addClasses:!0,greedy:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var e,i=this.options,s=i.accept;this.isover=!1,this.isout=!0,this.accept=t.isFunction(s)?s:function(t){return t.is(s)},this.proportions=function(){return arguments.length?(e=arguments[0],void 0):e?e:e={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight}},this._addToManager(i.scope),i.addClasses&&this._addClass("ui-droppable")},_addToManager:function(e){t.ui.ddmanager.droppables[e]=t.ui.ddmanager.droppables[e]||[],t.ui.ddmanager.droppables[e].push(this)},_splice:function(t){for(var e=0;t.length>e;e++)t[e]===this&&t.splice(e,1)},_destroy:function(){var e=t.ui.ddmanager.droppables[this.options.scope];this._splice(e)},_setOption:function(e,i){if("accept"===e)this.accept=t.isFunction(i)?i:function(t){return t.is(i)};else if("scope"===e){var s=t.ui.ddmanager.droppables[this.options.scope];this._splice(s),this._addToManager(i)}this._super(e,i)},_activate:function(e){var i=t.ui.ddmanager.current;this._addActiveClass(),i&&this._trigger("activate",e,this.ui(i))},_deactivate:function(e){var i=t.ui.ddmanager.current;this._removeActiveClass(),i&&this._trigger("deactivate",e,this.ui(i))},_over:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this._addHoverClass(),this._trigger("over",e,this.ui(i)))},_out:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this._removeHoverClass(),this._trigger("out",e,this.ui(i)))},_drop:function(e,i){var s=i||t.ui.ddmanager.current,n=!1;return s&&(s.currentItem||s.element)[0]!==this.element[0]?(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var i=t(this).droppable("instance");return i.options.greedy&&!i.options.disabled&&i.options.scope===s.options.scope&&i.accept.call(i.element[0],s.currentItem||s.element)&&v(s,t.extend(i,{offset:i.element.offset()}),i.options.tolerance,e)?(n=!0,!1):void 0}),n?!1:this.accept.call(this.element[0],s.currentItem||s.element)?(this._removeActiveClass(),this._removeHoverClass(),this._trigger("drop",e,this.ui(s)),this.element):!1):!1},ui:function(t){return{draggable:t.currentItem||t.element,helper:t.helper,position:t.position,offset:t.positionAbs}},_addHoverClass:function(){this._addClass("ui-droppable-hover")},_removeHoverClass:function(){this._removeClass("ui-droppable-hover")},_addActiveClass:function(){this._addClass("ui-droppable-active")},_removeActiveClass:function(){this._removeClass("ui-droppable-active")}});var v=t.ui.intersect=function(){function t(t,e,i){return t>=e&&e+i>t}return function(e,i,s,n){if(!i.offset)return!1;var o=(e.positionAbs||e.position.absolute).left+e.margins.left,a=(e.positionAbs||e.position.absolute).top+e.margins.top,r=o+e.helperProportions.width,h=a+e.helperProportions.height,l=i.offset.left,c=i.offset.top,u=l+i.proportions().width,d=c+i.proportions().height;switch(s){case"fit":return o>=l&&u>=r&&a>=c&&d>=h;case"intersect":return o+e.helperProportions.width/2>l&&u>r-e.helperProportions.width/2&&a+e.helperProportions.height/2>c&&d>h-e.helperProportions.height/2;case"pointer":return t(n.pageY,c,i.proportions().height)&&t(n.pageX,l,i.proportions().width);case"touch":return(a>=c&&d>=a||h>=c&&d>=h||c>a&&h>d)&&(o>=l&&u>=o||r>=l&&u>=r||l>o&&r>u);default:return!1}}}();t.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(e,i){var s,n,o=t.ui.ddmanager.droppables[e.options.scope]||[],a=i?i.type:null,r=(e.currentItem||e.element).find(":data(ui-droppable)").addBack();t:for(s=0;o.length>s;s++)if(!(o[s].options.disabled||e&&!o[s].accept.call(o[s].element[0],e.currentItem||e.element))){for(n=0;r.length>n;n++)if(r[n]===o[s].element[0]){o[s].proportions().height=0;continue t}o[s].visible="none"!==o[s].element.css("display"),o[s].visible&&("mousedown"===a&&o[s]._activate.call(o[s],i),o[s].offset=o[s].element.offset(),o[s].proportions({width:o[s].element[0].offsetWidth,height:o[s].element[0].offsetHeight}))}},drop:function(e,i){var s=!1;return t.each((t.ui.ddmanager.droppables[e.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&v(e,this,this.options.tolerance,i)&&(s=this._drop.call(this,i)||s),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],e.currentItem||e.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,i)))}),s},dragStart:function(e,i){e.element.parentsUntil("body").on("scroll.droppable",function(){e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)})},drag:function(e,i){e.options.refreshPositions&&t.ui.ddmanager.prepareOffsets(e,i),t.each(t.ui.ddmanager.droppables[e.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var s,n,o,a=v(e,this,this.options.tolerance,i),r=!a&&this.isover?"isout":a&&!this.isover?"isover":null;r&&(this.options.greedy&&(n=this.options.scope,o=this.element.parents(":data(ui-droppable)").filter(function(){return t(this).droppable("instance").options.scope===n}),o.length&&(s=t(o[0]).droppable("instance"),s.greedyChild="isover"===r)),s&&"isover"===r&&(s.isover=!1,s.isout=!0,s._out.call(s,i)),this[r]=!0,this["isout"===r?"isover":"isout"]=!1,this["isover"===r?"_over":"_out"].call(this,i),s&&"isout"===r&&(s.isout=!1,s.isover=!0,s._over.call(s,i)))}})},dragStop:function(e,i){e.element.parentsUntil("body").off("scroll.droppable"),e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)}},t.uiBackCompat!==!1&&t.widget("ui.droppable",t.ui.droppable,{options:{hoverClass:!1,activeClass:!1},_addActiveClass:function(){this._super(),this.options.activeClass&&this.element.addClass(this.options.activeClass)},_removeActiveClass:function(){this._super(),this.options.activeClass&&this.element.removeClass(this.options.activeClass)},_addHoverClass:function(){this._super(),this.options.hoverClass&&this.element.addClass(this.options.hoverClass)},_removeHoverClass:function(){this._super(),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass)}}),t.ui.droppable,t.widget("ui.progressbar",{version:"1.12.1",options:{classes:{"ui-progressbar":"ui-corner-all","ui-progressbar-value":"ui-corner-left","ui-progressbar-complete":"ui-corner-right"},max:100,value:0,change:null,complete:null},min:0,_create:function(){this.oldValue=this.options.value=this._constrainedValue(),this.element.attr({role:"progressbar","aria-valuemin":this.min}),this._addClass("ui-progressbar","ui-widget ui-widget-content"),this.valueDiv=t("<div>").appendTo(this.element),this._addClass(this.valueDiv,"ui-progressbar-value","ui-widget-header"),this._refreshValue()},_destroy:function(){this.element.removeAttr("role aria-valuemin aria-valuemax aria-valuenow"),this.valueDiv.remove()},value:function(t){return void 0===t?this.options.value:(this.options.value=this._constrainedValue(t),this._refreshValue(),void 0)},_constrainedValue:function(t){return void 0===t&&(t=this.options.value),this.indeterminate=t===!1,"number"!=typeof t&&(t=0),this.indeterminate?!1:Math.min(this.options.max,Math.max(this.min,t))},_setOptions:function(t){var e=t.value;delete t.value,this._super(t),this.options.value=this._constrainedValue(e),this._refreshValue()},_setOption:function(t,e){"max"===t&&(e=Math.max(this.min,e)),this._super(t,e)},_setOptionDisabled:function(t){this._super(t),this.element.attr("aria-disabled",t),this._toggleClass(null,"ui-state-disabled",!!t)},_percentage:function(){return this.indeterminate?100:100*(this.options.value-this.min)/(this.options.max-this.min)},_refreshValue:function(){var e=this.options.value,i=this._percentage();this.valueDiv.toggle(this.indeterminate||e>this.min).width(i.toFixed(0)+"%"),this._toggleClass(this.valueDiv,"ui-progressbar-complete",null,e===this.options.max)._toggleClass("ui-progressbar-indeterminate",null,this.indeterminate),this.indeterminate?(this.element.removeAttr("aria-valuenow"),this.overlayDiv||(this.overlayDiv=t("<div>").appendTo(this.valueDiv),this._addClass(this.overlayDiv,"ui-progressbar-overlay"))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":e}),this.overlayDiv&&(this.overlayDiv.remove(),this.overlayDiv=null)),this.oldValue!==e&&(this.oldValue=e,this._trigger("change")),e===this.options.max&&this._trigger("complete")}}),t.widget("ui.selectable",t.ui.mouse,{version:"1.12.1",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch",selected:null,selecting:null,start:null,stop:null,unselected:null,unselecting:null},_create:function(){var e=this;this._addClass("ui-selectable"),this.dragged=!1,this.refresh=function(){e.elementPos=t(e.element[0]).offset(),e.selectees=t(e.options.filter,e.element[0]),e._addClass(e.selectees,"ui-selectee"),e.selectees.each(function(){var i=t(this),s=i.offset(),n={left:s.left-e.elementPos.left,top:s.top-e.elementPos.top};t.data(this,"selectable-item",{element:this,$element:i,left:n.left,top:n.top,right:n.left+i.outerWidth(),bottom:n.top+i.outerHeight(),startselected:!1,selected:i.hasClass("ui-selected"),selecting:i.hasClass("ui-selecting"),unselecting:i.hasClass("ui-unselecting")})})},this.refresh(),this._mouseInit(),this.helper=t("<div>"),this._addClass(this.helper,"ui-selectable-helper")},_destroy:function(){this.selectees.removeData("selectable-item"),this._mouseDestroy()},_mouseStart:function(e){var i=this,s=this.options;this.opos=[e.pageX,e.pageY],this.elementPos=t(this.element[0]).offset(),this.options.disabled||(this.selectees=t(s.filter,this.element[0]),this._trigger("start",e),t(s.appendTo).append(this.helper),this.helper.css({left:e.pageX,top:e.pageY,width:0,height:0}),s.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var s=t.data(this,"selectable-item");s.startselected=!0,e.metaKey||e.ctrlKey||(i._removeClass(s.$element,"ui-selected"),s.selected=!1,i._addClass(s.$element,"ui-unselecting"),s.unselecting=!0,i._trigger("unselecting",e,{unselecting:s.element}))}),t(e.target).parents().addBack().each(function(){var s,n=t.data(this,"selectable-item");return n?(s=!e.metaKey&&!e.ctrlKey||!n.$element.hasClass("ui-selected"),i._removeClass(n.$element,s?"ui-unselecting":"ui-selected")._addClass(n.$element,s?"ui-selecting":"ui-unselecting"),n.unselecting=!s,n.selecting=s,n.selected=s,s?i._trigger("selecting",e,{selecting:n.element}):i._trigger("unselecting",e,{unselecting:n.element}),!1):void 0}))},_mouseDrag:function(e){if(this.dragged=!0,!this.options.disabled){var i,s=this,n=this.options,o=this.opos[0],a=this.opos[1],r=e.pageX,h=e.pageY;return o>r&&(i=r,r=o,o=i),a>h&&(i=h,h=a,a=i),this.helper.css({left:o,top:a,width:r-o,height:h-a}),this.selectees.each(function(){var i=t.data(this,"selectable-item"),l=!1,c={};i&&i.element!==s.element[0]&&(c.left=i.left+s.elementPos.left,c.right=i.right+s.elementPos.left,c.top=i.top+s.elementPos.top,c.bottom=i.bottom+s.elementPos.top,"touch"===n.tolerance?l=!(c.left>r||o>c.right||c.top>h||a>c.bottom):"fit"===n.tolerance&&(l=c.left>o&&r>c.right&&c.top>a&&h>c.bottom),l?(i.selected&&(s._removeClass(i.$element,"ui-selected"),i.selected=!1),i.unselecting&&(s._removeClass(i.$element,"ui-unselecting"),i.unselecting=!1),i.selecting||(s._addClass(i.$element,"ui-selecting"),i.selecting=!0,s._trigger("selecting",e,{selecting:i.element}))):(i.selecting&&((e.metaKey||e.ctrlKey)&&i.startselected?(s._removeClass(i.$element,"ui-selecting"),i.selecting=!1,s._addClass(i.$element,"ui-selected"),i.selected=!0):(s._removeClass(i.$element,"ui-selecting"),i.selecting=!1,i.startselected&&(s._addClass(i.$element,"ui-unselecting"),i.unselecting=!0),s._trigger("unselecting",e,{unselecting:i.element}))),i.selected&&(e.metaKey||e.ctrlKey||i.startselected||(s._removeClass(i.$element,"ui-selected"),i.selected=!1,s._addClass(i.$element,"ui-unselecting"),i.unselecting=!0,s._trigger("unselecting",e,{unselecting:i.element})))))}),!1}},_mouseStop:function(e){var i=this;return this.dragged=!1,t(".ui-unselecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");i._removeClass(s.$element,"ui-unselecting"),s.unselecting=!1,s.startselected=!1,i._trigger("unselected",e,{unselected:s.element})}),t(".ui-selecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");i._removeClass(s.$element,"ui-selecting")._addClass(s.$element,"ui-selected"),s.selecting=!1,s.selected=!0,s.startselected=!0,i._trigger("selected",e,{selected:s.element})}),this._trigger("stop",e),this.helper.remove(),!1}}),t.widget("ui.selectmenu",[t.ui.formResetMixin,{version:"1.12.1",defaultElement:"<select>",options:{appendTo:null,classes:{"ui-selectmenu-button-open":"ui-corner-top","ui-selectmenu-button-closed":"ui-corner-all"},disabled:null,icons:{button:"ui-icon-triangle-1-s"},position:{my:"left top",at:"left bottom",collision:"none"},width:!1,change:null,close:null,focus:null,open:null,select:null},_create:function(){var e=this.element.uniqueId().attr("id");this.ids={element:e,button:e+"-button",menu:e+"-menu"},this._drawButton(),this._drawMenu(),this._bindFormResetHandler(),this._rendered=!1,this.menuItems=t()},_drawButton:function(){var e,i=this,s=this._parseOption(this.element.find("option:selected"),this.element[0].selectedIndex);this.labels=this.element.labels().attr("for",this.ids.button),this._on(this.labels,{click:function(t){this.button.focus(),t.preventDefault()}}),this.element.hide(),this.button=t("<span>",{tabindex:this.options.disabled?-1:0,id:this.ids.button,role:"combobox","aria-expanded":"false","aria-autocomplete":"list","aria-owns":this.ids.menu,"aria-haspopup":"true",title:this.element.attr("title")}).insertAfter(this.element),this._addClass(this.button,"ui-selectmenu-button ui-selectmenu-button-closed","ui-button ui-widget"),e=t("<span>").appendTo(this.button),this._addClass(e,"ui-selectmenu-icon","ui-icon "+this.options.icons.button),this.buttonItem=this._renderButtonItem(s).appendTo(this.button),this.options.width!==!1&&this._resizeButton(),this._on(this.button,this._buttonEvents),this.button.one("focusin",function(){i._rendered||i._refreshMenu()})},_drawMenu:function(){var e=this;this.menu=t("<ul>",{"aria-hidden":"true","aria-labelledby":this.ids.button,id:this.ids.menu}),this.menuWrap=t("<div>").append(this.menu),this._addClass(this.menuWrap,"ui-selectmenu-menu","ui-front"),this.menuWrap.appendTo(this._appendTo()),this.menuInstance=this.menu.menu({classes:{"ui-menu":"ui-corner-bottom"},role:"listbox",select:function(t,i){t.preventDefault(),e._setSelection(),e._select(i.item.data("ui-selectmenu-item"),t)},focus:function(t,i){var s=i.item.data("ui-selectmenu-item");null!=e.focusIndex&&s.index!==e.focusIndex&&(e._trigger("focus",t,{item:s}),e.isOpen||e._select(s,t)),e.focusIndex=s.index,e.button.attr("aria-activedescendant",e.menuItems.eq(s.index).attr("id"))}}).menu("instance"),this.menuInstance._off(this.menu,"mouseleave"),this.menuInstance._closeOnDocumentClick=function(){return!1},this.menuInstance._isDivider=function(){return!1}},refresh:function(){this._refreshMenu(),this.buttonItem.replaceWith(this.buttonItem=this._renderButtonItem(this._getSelectedItem().data("ui-selectmenu-item")||{})),null===this.options.width&&this._resizeButton()},_refreshMenu:function(){var t,e=this.element.find("option");this.menu.empty(),this._parseOptions(e),this._renderMenu(this.menu,this.items),this.menuInstance.refresh(),this.menuItems=this.menu.find("li").not(".ui-selectmenu-optgroup").find(".ui-menu-item-wrapper"),this._rendered=!0,e.length&&(t=this._getSelectedItem(),this.menuInstance.focus(null,t),this._setAria(t.data("ui-selectmenu-item")),this._setOption("disabled",this.element.prop("disabled")))},open:function(t){this.options.disabled||(this._rendered?(this._removeClass(this.menu.find(".ui-state-active"),null,"ui-state-active"),this.menuInstance.focus(null,this._getSelectedItem())):this._refreshMenu(),this.menuItems.length&&(this.isOpen=!0,this._toggleAttr(),this._resizeMenu(),this._position(),this._on(this.document,this._documentClick),this._trigger("open",t)))},_position:function(){this.menuWrap.position(t.extend({of:this.button},this.options.position))},close:function(t){this.isOpen&&(this.isOpen=!1,this._toggleAttr(),this.range=null,this._off(this.document),this._trigger("close",t))},widget:function(){return this.button},menuWidget:function(){return this.menu},_renderButtonItem:function(e){var i=t("<span>");return this._setText(i,e.label),this._addClass(i,"ui-selectmenu-text"),i},_renderMenu:function(e,i){var s=this,n="";t.each(i,function(i,o){var a;o.optgroup!==n&&(a=t("<li>",{text:o.optgroup}),s._addClass(a,"ui-selectmenu-optgroup","ui-menu-divider"+(o.element.parent("optgroup").prop("disabled")?" ui-state-disabled":"")),a.appendTo(e),n=o.optgroup),s._renderItemData(e,o)})},_renderItemData:function(t,e){return this._renderItem(t,e).data("ui-selectmenu-item",e)},_renderItem:function(e,i){var s=t("<li>"),n=t("<div>",{title:i.element.attr("title")});return i.disabled&&this._addClass(s,null,"ui-state-disabled"),this._setText(n,i.label),s.append(n).appendTo(e)},_setText:function(t,e){e?t.text(e):t.html("&#160;")},_move:function(t,e){var i,s,n=".ui-menu-item";this.isOpen?i=this.menuItems.eq(this.focusIndex).parent("li"):(i=this.menuItems.eq(this.element[0].selectedIndex).parent("li"),n+=":not(.ui-state-disabled)"),s="first"===t||"last"===t?i["first"===t?"prevAll":"nextAll"](n).eq(-1):i[t+"All"](n).eq(0),s.length&&this.menuInstance.focus(e,s)},_getSelectedItem:function(){return this.menuItems.eq(this.element[0].selectedIndex).parent("li")},_toggle:function(t){this[this.isOpen?"close":"open"](t)},_setSelection:function(){var t;this.range&&(window.getSelection?(t=window.getSelection(),t.removeAllRanges(),t.addRange(this.range)):this.range.select(),this.button.focus())},_documentClick:{mousedown:function(e){this.isOpen&&(t(e.target).closest(".ui-selectmenu-menu, #"+t.ui.escapeSelector(this.ids.button)).length||this.close(e))}},_buttonEvents:{mousedown:function(){var t;window.getSelection?(t=window.getSelection(),t.rangeCount&&(this.range=t.getRangeAt(0))):this.range=document.selection.createRange()},click:function(t){this._setSelection(),this._toggle(t)},keydown:function(e){var i=!0;switch(e.keyCode){case t.ui.keyCode.TAB:case t.ui.keyCode.ESCAPE:this.close(e),i=!1;break;case t.ui.keyCode.ENTER:this.isOpen&&this._selectFocusedItem(e);break;case t.ui.keyCode.UP:e.altKey?this._toggle(e):this._move("prev",e);break;case t.ui.keyCode.DOWN:e.altKey?this._toggle(e):this._move("next",e);break;case t.ui.keyCode.SPACE:this.isOpen?this._selectFocusedItem(e):this._toggle(e);break;case t.ui.keyCode.LEFT:this._move("prev",e);break;case t.ui.keyCode.RIGHT:this._move("next",e);break;case t.ui.keyCode.HOME:case t.ui.keyCode.PAGE_UP:this._move("first",e);break;case t.ui.keyCode.END:case t.ui.keyCode.PAGE_DOWN:this._move("last",e);break;default:this.menu.trigger(e),i=!1}i&&e.preventDefault()}},_selectFocusedItem:function(t){var e=this.menuItems.eq(this.focusIndex).parent("li");e.hasClass("ui-state-disabled")||this._select(e.data("ui-selectmenu-item"),t)},_select:function(t,e){var i=this.element[0].selectedIndex;this.element[0].selectedIndex=t.index,this.buttonItem.replaceWith(this.buttonItem=this._renderButtonItem(t)),this._setAria(t),this._trigger("select",e,{item:t}),t.index!==i&&this._trigger("change",e,{item:t}),this.close(e)},_setAria:function(t){var e=this.menuItems.eq(t.index).attr("id");this.button.attr({"aria-labelledby":e,"aria-activedescendant":e}),this.menu.attr("aria-activedescendant",e)},_setOption:function(t,e){if("icons"===t){var i=this.button.find("span.ui-icon");this._removeClass(i,null,this.options.icons.button)._addClass(i,null,e.button)}this._super(t,e),"appendTo"===t&&this.menuWrap.appendTo(this._appendTo()),"width"===t&&this._resizeButton()},_setOptionDisabled:function(t){this._super(t),this.menuInstance.option("disabled",t),this.button.attr("aria-disabled",t),this._toggleClass(this.button,null,"ui-state-disabled",t),this.element.prop("disabled",t),t?(this.button.attr("tabindex",-1),this.close()):this.button.attr("tabindex",0)},_appendTo:function(){var e=this.options.appendTo;return e&&(e=e.jquery||e.nodeType?t(e):this.document.find(e).eq(0)),e&&e[0]||(e=this.element.closest(".ui-front, dialog")),e.length||(e=this.document[0].body),e},_toggleAttr:function(){this.button.attr("aria-expanded",this.isOpen),this._removeClass(this.button,"ui-selectmenu-button-"+(this.isOpen?"closed":"open"))._addClass(this.button,"ui-selectmenu-button-"+(this.isOpen?"open":"closed"))._toggleClass(this.menuWrap,"ui-selectmenu-open",null,this.isOpen),this.menu.attr("aria-hidden",!this.isOpen)},_resizeButton:function(){var t=this.options.width;return t===!1?(this.button.css("width",""),void 0):(null===t&&(t=this.element.show().outerWidth(),this.element.hide()),this.button.outerWidth(t),void 0)},_resizeMenu:function(){this.menu.outerWidth(Math.max(this.button.outerWidth(),this.menu.width("").outerWidth()+1))},_getCreateOptions:function(){var t=this._super();return t.disabled=this.element.prop("disabled"),t},_parseOptions:function(e){var i=this,s=[];e.each(function(e,n){s.push(i._parseOption(t(n),e))}),this.items=s},_parseOption:function(t,e){var i=t.parent("optgroup");return{element:t,index:e,value:t.val(),label:t.text(),optgroup:i.attr("label")||"",disabled:i.prop("disabled")||t.prop("disabled")}},_destroy:function(){this._unbindFormResetHandler(),this.menuWrap.remove(),this.button.remove(),this.element.show(),this.element.removeUniqueId(),this.labels.attr("for",this.ids.element)}}]),t.widget("ui.slider",t.ui.mouse,{version:"1.12.1",widgetEventPrefix:"slide",options:{animate:!1,classes:{"ui-slider":"ui-corner-all","ui-slider-handle":"ui-corner-all","ui-slider-range":"ui-corner-all ui-widget-header"},distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null,change:null,slide:null,start:null,stop:null},numPages:5,_create:function(){this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this._calculateNewMax(),this._addClass("ui-slider ui-slider-"+this.orientation,"ui-widget ui-widget-content"),this._refresh(),this._animateOff=!1
},_refresh:function(){this._createRange(),this._createHandles(),this._setupEvents(),this._refreshValue()},_createHandles:function(){var e,i,s=this.options,n=this.element.find(".ui-slider-handle"),o="<span tabindex='0'></span>",a=[];for(i=s.values&&s.values.length||1,n.length>i&&(n.slice(i).remove(),n=n.slice(0,i)),e=n.length;i>e;e++)a.push(o);this.handles=n.add(t(a.join("")).appendTo(this.element)),this._addClass(this.handles,"ui-slider-handle","ui-state-default"),this.handle=this.handles.eq(0),this.handles.each(function(e){t(this).data("ui-slider-handle-index",e).attr("tabIndex",0)})},_createRange:function(){var e=this.options;e.range?(e.range===!0&&(e.values?e.values.length&&2!==e.values.length?e.values=[e.values[0],e.values[0]]:t.isArray(e.values)&&(e.values=e.values.slice(0)):e.values=[this._valueMin(),this._valueMin()]),this.range&&this.range.length?(this._removeClass(this.range,"ui-slider-range-min ui-slider-range-max"),this.range.css({left:"",bottom:""})):(this.range=t("<div>").appendTo(this.element),this._addClass(this.range,"ui-slider-range")),("min"===e.range||"max"===e.range)&&this._addClass(this.range,"ui-slider-range-"+e.range)):(this.range&&this.range.remove(),this.range=null)},_setupEvents:function(){this._off(this.handles),this._on(this.handles,this._handleEvents),this._hoverable(this.handles),this._focusable(this.handles)},_destroy:function(){this.handles.remove(),this.range&&this.range.remove(),this._mouseDestroy()},_mouseCapture:function(e){var i,s,n,o,a,r,h,l,c=this,u=this.options;return u.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),i={x:e.pageX,y:e.pageY},s=this._normValueFromMouse(i),n=this._valueMax()-this._valueMin()+1,this.handles.each(function(e){var i=Math.abs(s-c.values(e));(n>i||n===i&&(e===c._lastChangedValue||c.values(e)===u.min))&&(n=i,o=t(this),a=e)}),r=this._start(e,a),r===!1?!1:(this._mouseSliding=!0,this._handleIndex=a,this._addClass(o,null,"ui-state-active"),o.trigger("focus"),h=o.offset(),l=!t(e.target).parents().addBack().is(".ui-slider-handle"),this._clickOffset=l?{left:0,top:0}:{left:e.pageX-h.left-o.width()/2,top:e.pageY-h.top-o.height()/2-(parseInt(o.css("borderTopWidth"),10)||0)-(parseInt(o.css("borderBottomWidth"),10)||0)+(parseInt(o.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(e,a,s),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(t){var e={x:t.pageX,y:t.pageY},i=this._normValueFromMouse(e);return this._slide(t,this._handleIndex,i),!1},_mouseStop:function(t){return this._removeClass(this.handles,null,"ui-state-active"),this._mouseSliding=!1,this._stop(t,this._handleIndex),this._change(t,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation="vertical"===this.options.orientation?"vertical":"horizontal"},_normValueFromMouse:function(t){var e,i,s,n,o;return"horizontal"===this.orientation?(e=this.elementSize.width,i=t.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(e=this.elementSize.height,i=t.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),s=i/e,s>1&&(s=1),0>s&&(s=0),"vertical"===this.orientation&&(s=1-s),n=this._valueMax()-this._valueMin(),o=this._valueMin()+s*n,this._trimAlignValue(o)},_uiHash:function(t,e,i){var s={handle:this.handles[t],handleIndex:t,value:void 0!==e?e:this.value()};return this._hasMultipleValues()&&(s.value=void 0!==e?e:this.values(t),s.values=i||this.values()),s},_hasMultipleValues:function(){return this.options.values&&this.options.values.length},_start:function(t,e){return this._trigger("start",t,this._uiHash(e))},_slide:function(t,e,i){var s,n,o=this.value(),a=this.values();this._hasMultipleValues()&&(n=this.values(e?0:1),o=this.values(e),2===this.options.values.length&&this.options.range===!0&&(i=0===e?Math.min(n,i):Math.max(n,i)),a[e]=i),i!==o&&(s=this._trigger("slide",t,this._uiHash(e,i,a)),s!==!1&&(this._hasMultipleValues()?this.values(e,i):this.value(i)))},_stop:function(t,e){this._trigger("stop",t,this._uiHash(e))},_change:function(t,e){this._keySliding||this._mouseSliding||(this._lastChangedValue=e,this._trigger("change",t,this._uiHash(e)))},value:function(t){return arguments.length?(this.options.value=this._trimAlignValue(t),this._refreshValue(),this._change(null,0),void 0):this._value()},values:function(e,i){var s,n,o;if(arguments.length>1)return this.options.values[e]=this._trimAlignValue(i),this._refreshValue(),this._change(null,e),void 0;if(!arguments.length)return this._values();if(!t.isArray(arguments[0]))return this._hasMultipleValues()?this._values(e):this.value();for(s=this.options.values,n=arguments[0],o=0;s.length>o;o+=1)s[o]=this._trimAlignValue(n[o]),this._change(null,o);this._refreshValue()},_setOption:function(e,i){var s,n=0;switch("range"===e&&this.options.range===!0&&("min"===i?(this.options.value=this._values(0),this.options.values=null):"max"===i&&(this.options.value=this._values(this.options.values.length-1),this.options.values=null)),t.isArray(this.options.values)&&(n=this.options.values.length),this._super(e,i),e){case"orientation":this._detectOrientation(),this._removeClass("ui-slider-horizontal ui-slider-vertical")._addClass("ui-slider-"+this.orientation),this._refreshValue(),this.options.range&&this._refreshRange(i),this.handles.css("horizontal"===i?"bottom":"left","");break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),s=n-1;s>=0;s--)this._change(null,s);this._animateOff=!1;break;case"step":case"min":case"max":this._animateOff=!0,this._calculateNewMax(),this._refreshValue(),this._animateOff=!1;break;case"range":this._animateOff=!0,this._refresh(),this._animateOff=!1}},_setOptionDisabled:function(t){this._super(t),this._toggleClass(null,"ui-state-disabled",!!t)},_value:function(){var t=this.options.value;return t=this._trimAlignValue(t)},_values:function(t){var e,i,s;if(arguments.length)return e=this.options.values[t],e=this._trimAlignValue(e);if(this._hasMultipleValues()){for(i=this.options.values.slice(),s=0;i.length>s;s+=1)i[s]=this._trimAlignValue(i[s]);return i}return[]},_trimAlignValue:function(t){if(this._valueMin()>=t)return this._valueMin();if(t>=this._valueMax())return this._valueMax();var e=this.options.step>0?this.options.step:1,i=(t-this._valueMin())%e,s=t-i;return 2*Math.abs(i)>=e&&(s+=i>0?e:-e),parseFloat(s.toFixed(5))},_calculateNewMax:function(){var t=this.options.max,e=this._valueMin(),i=this.options.step,s=Math.round((t-e)/i)*i;t=s+e,t>this.options.max&&(t-=i),this.max=parseFloat(t.toFixed(this._precision()))},_precision:function(){var t=this._precisionOf(this.options.step);return null!==this.options.min&&(t=Math.max(t,this._precisionOf(this.options.min))),t},_precisionOf:function(t){var e=""+t,i=e.indexOf(".");return-1===i?0:e.length-i-1},_valueMin:function(){return this.options.min},_valueMax:function(){return this.max},_refreshRange:function(t){"vertical"===t&&this.range.css({width:"",left:""}),"horizontal"===t&&this.range.css({height:"",bottom:""})},_refreshValue:function(){var e,i,s,n,o,a=this.options.range,r=this.options,h=this,l=this._animateOff?!1:r.animate,c={};this._hasMultipleValues()?this.handles.each(function(s){i=100*((h.values(s)-h._valueMin())/(h._valueMax()-h._valueMin())),c["horizontal"===h.orientation?"left":"bottom"]=i+"%",t(this).stop(1,1)[l?"animate":"css"](c,r.animate),h.options.range===!0&&("horizontal"===h.orientation?(0===s&&h.range.stop(1,1)[l?"animate":"css"]({left:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({width:i-e+"%"},{queue:!1,duration:r.animate})):(0===s&&h.range.stop(1,1)[l?"animate":"css"]({bottom:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({height:i-e+"%"},{queue:!1,duration:r.animate}))),e=i}):(s=this.value(),n=this._valueMin(),o=this._valueMax(),i=o!==n?100*((s-n)/(o-n)):0,c["horizontal"===this.orientation?"left":"bottom"]=i+"%",this.handle.stop(1,1)[l?"animate":"css"](c,r.animate),"min"===a&&"horizontal"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({width:i+"%"},r.animate),"max"===a&&"horizontal"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({width:100-i+"%"},r.animate),"min"===a&&"vertical"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({height:i+"%"},r.animate),"max"===a&&"vertical"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({height:100-i+"%"},r.animate))},_handleEvents:{keydown:function(e){var i,s,n,o,a=t(e.target).data("ui-slider-handle-index");switch(e.keyCode){case t.ui.keyCode.HOME:case t.ui.keyCode.END:case t.ui.keyCode.PAGE_UP:case t.ui.keyCode.PAGE_DOWN:case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(e.preventDefault(),!this._keySliding&&(this._keySliding=!0,this._addClass(t(e.target),null,"ui-state-active"),i=this._start(e,a),i===!1))return}switch(o=this.options.step,s=n=this._hasMultipleValues()?this.values(a):this.value(),e.keyCode){case t.ui.keyCode.HOME:n=this._valueMin();break;case t.ui.keyCode.END:n=this._valueMax();break;case t.ui.keyCode.PAGE_UP:n=this._trimAlignValue(s+(this._valueMax()-this._valueMin())/this.numPages);break;case t.ui.keyCode.PAGE_DOWN:n=this._trimAlignValue(s-(this._valueMax()-this._valueMin())/this.numPages);break;case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:if(s===this._valueMax())return;n=this._trimAlignValue(s+o);break;case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(s===this._valueMin())return;n=this._trimAlignValue(s-o)}this._slide(e,a,n)},keyup:function(e){var i=t(e.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(e,i),this._change(e,i),this._removeClass(t(e.target),null,"ui-state-active"))}}}),t.widget("ui.sortable",t.ui.mouse,{version:"1.12.1",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_isOverAxis:function(t,e,i){return t>=e&&e+i>t},_isFloating:function(t){return/left|right/.test(t.css("float"))||/inline|table-cell/.test(t.css("display"))},_create:function(){this.containerCache={},this._addClass("ui-sortable"),this.refresh(),this.offset=this.element.offset(),this._mouseInit(),this._setHandleClassName(),this.ready=!0},_setOption:function(t,e){this._super(t,e),"handle"===t&&this._setHandleClassName()},_setHandleClassName:function(){var e=this;this._removeClass(this.element.find(".ui-sortable-handle"),"ui-sortable-handle"),t.each(this.items,function(){e._addClass(this.instance.options.handle?this.item.find(this.instance.options.handle):this.item,"ui-sortable-handle")})},_destroy:function(){this._mouseDestroy();for(var t=this.items.length-1;t>=0;t--)this.items[t].item.removeData(this.widgetName+"-item");return this},_mouseCapture:function(e,i){var s=null,n=!1,o=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(e),t(e.target).parents().each(function(){return t.data(this,o.widgetName+"-item")===o?(s=t(this),!1):void 0}),t.data(e.target,o.widgetName+"-item")===o&&(s=t(e.target)),s?!this.options.handle||i||(t(this.options.handle,s).find("*").addBack().each(function(){this===e.target&&(n=!0)}),n)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(e,i,s){var n,o,a=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(e),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,a.cursorAt&&this._adjustOffsetFromHelper(a.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),a.containment&&this._setContainment(),a.cursor&&"auto"!==a.cursor&&(o=this.document.find("body"),this.storedCursor=o.css("cursor"),o.css("cursor",a.cursor),this.storedStylesheet=t("<style>*{ cursor: "+a.cursor+" !important; }</style>").appendTo(o)),a.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",a.opacity)),a.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",a.zIndex)),this.scrollParent[0]!==this.document[0]&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",e,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(n=this.containers.length-1;n>=0;n--)this.containers[n]._trigger("activate",e,this._uiHash(this));return t.ui.ddmanager&&(t.ui.ddmanager.current=this),t.ui.ddmanager&&!a.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this.dragging=!0,this._addClass(this.helper,"ui-sortable-helper"),this._mouseDrag(e),!0},_mouseDrag:function(e){var i,s,n,o,a=this.options,r=!1;for(this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==this.document[0]&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-e.pageY<a.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+a.scrollSpeed:e.pageY-this.overflowOffset.top<a.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-a.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-e.pageX<a.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+a.scrollSpeed:e.pageX-this.overflowOffset.left<a.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-a.scrollSpeed)):(e.pageY-this.document.scrollTop()<a.scrollSensitivity?r=this.document.scrollTop(this.document.scrollTop()-a.scrollSpeed):this.window.height()-(e.pageY-this.document.scrollTop())<a.scrollSensitivity&&(r=this.document.scrollTop(this.document.scrollTop()+a.scrollSpeed)),e.pageX-this.document.scrollLeft()<a.scrollSensitivity?r=this.document.scrollLeft(this.document.scrollLeft()-a.scrollSpeed):this.window.width()-(e.pageX-this.document.scrollLeft())<a.scrollSensitivity&&(r=this.document.scrollLeft(this.document.scrollLeft()+a.scrollSpeed))),r!==!1&&t.ui.ddmanager&&!a.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],n=s.item[0],o=this._intersectsWithPointer(s),o&&s.instance===this.currentContainer&&n!==this.currentItem[0]&&this.placeholder[1===o?"next":"prev"]()[0]!==n&&!t.contains(this.placeholder[0],n)&&("semi-dynamic"===this.options.type?!t.contains(this.element[0],n):!0)){if(this.direction=1===o?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;this._rearrange(e,s),this._trigger("change",e,this._uiHash());break}return this._contactContainers(e),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),this._trigger("sort",e,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(e,i){if(e){if(t.ui.ddmanager&&!this.options.dropBehaviour&&t.ui.ddmanager.drop(this,e),this.options.revert){var s=this,n=this.placeholder.offset(),o=this.options.axis,a={};o&&"x"!==o||(a.left=n.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===this.document[0].body?0:this.offsetParent[0].scrollLeft)),o&&"y"!==o||(a.top=n.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===this.document[0].body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,t(this.helper).animate(a,parseInt(this.options.revert,10)||500,function(){s._clear(e)})}else this._clear(e,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp(new t.Event("mouseup",{target:null})),"original"===this.options.helper?(this.currentItem.css(this._storedCSS),this._removeClass(this.currentItem,"ui-sortable-helper")):this.currentItem.show();for(var e=this.containers.length-1;e>=0;e--)this.containers[e]._trigger("deactivate",null,this._uiHash(this)),this.containers[e].containerCache.over&&(this.containers[e]._trigger("out",null,this._uiHash(this)),this.containers[e].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),t.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?t(this.domPosition.prev).after(this.currentItem):t(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},t(i).each(function(){var i=(t(e.item||this).attr(e.attribute||"id")||"").match(e.expression||/(.+)[\-=_](.+)/);i&&s.push((e.key||i[1]+"[]")+"="+(e.key&&e.expression?i[1]:i[2]))}),!s.length&&e.key&&s.push(e.key+"="),s.join("&")},toArray:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},i.each(function(){s.push(t(e.item||this).attr(e.attribute||"id")||"")}),s},_intersectsWith:function(t){var e=this.positionAbs.left,i=e+this.helperProportions.width,s=this.positionAbs.top,n=s+this.helperProportions.height,o=t.left,a=o+t.width,r=t.top,h=r+t.height,l=this.offset.click.top,c=this.offset.click.left,u="x"===this.options.axis||s+l>r&&h>s+l,d="y"===this.options.axis||e+c>o&&a>e+c,p=u&&d;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>t[this.floating?"width":"height"]?p:e+this.helperProportions.width/2>o&&a>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>r&&h>n-this.helperProportions.height/2},_intersectsWithPointer:function(t){var e,i,s="x"===this.options.axis||this._isOverAxis(this.positionAbs.top+this.offset.click.top,t.top,t.height),n="y"===this.options.axis||this._isOverAxis(this.positionAbs.left+this.offset.click.left,t.left,t.width),o=s&&n;return o?(e=this._getDragVerticalDirection(),i=this._getDragHorizontalDirection(),this.floating?"right"===i||"down"===e?2:1:e&&("down"===e?2:1)):!1},_intersectsWithSides:function(t){var e=this._isOverAxis(this.positionAbs.top+this.offset.click.top,t.top+t.height/2,t.height),i=this._isOverAxis(this.positionAbs.left+this.offset.click.left,t.left+t.width/2,t.width),s=this._getDragVerticalDirection(),n=this._getDragHorizontalDirection();return this.floating&&n?"right"===n&&i||"left"===n&&!i:s&&("down"===s&&e||"up"===s&&!e)},_getDragVerticalDirection:function(){var t=this.positionAbs.top-this.lastPositionAbs.top;return 0!==t&&(t>0?"down":"up")},_getDragHorizontalDirection:function(){var t=this.positionAbs.left-this.lastPositionAbs.left;return 0!==t&&(t>0?"right":"left")},refresh:function(t){return this._refreshItems(t),this._setHandleClassName(),this.refreshPositions(),this},_connectWith:function(){var t=this.options;return t.connectWith.constructor===String?[t.connectWith]:t.connectWith},_getItemsAsjQuery:function(e){function i(){r.push(this)}var s,n,o,a,r=[],h=[],l=this._connectWith();if(l&&e)for(s=l.length-1;s>=0;s--)for(o=t(l[s],this.document[0]),n=o.length-1;n>=0;n--)a=t.data(o[n],this.widgetFullName),a&&a!==this&&!a.options.disabled&&h.push([t.isFunction(a.options.items)?a.options.items.call(a.element):t(a.options.items,a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),a]);for(h.push([t.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):t(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),s=h.length-1;s>=0;s--)h[s][0].each(i);return t(r)},_removeCurrentsFromItems:function(){var e=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=t.grep(this.items,function(t){for(var i=0;e.length>i;i++)if(e[i]===t.item[0])return!1;return!0})},_refreshItems:function(e){this.items=[],this.containers=[this];var i,s,n,o,a,r,h,l,c=this.items,u=[[t.isFunction(this.options.items)?this.options.items.call(this.element[0],e,{item:this.currentItem}):t(this.options.items,this.element),this]],d=this._connectWith();if(d&&this.ready)for(i=d.length-1;i>=0;i--)for(n=t(d[i],this.document[0]),s=n.length-1;s>=0;s--)o=t.data(n[s],this.widgetFullName),o&&o!==this&&!o.options.disabled&&(u.push([t.isFunction(o.options.items)?o.options.items.call(o.element[0],e,{item:this.currentItem}):t(o.options.items,o.element),o]),this.containers.push(o));for(i=u.length-1;i>=0;i--)for(a=u[i][1],r=u[i][0],s=0,l=r.length;l>s;s++)h=t(r[s]),h.data(this.widgetName+"-item",a),c.push({item:h,instance:a,width:0,height:0,left:0,top:0})},refreshPositions:function(e){this.floating=this.items.length?"x"===this.options.axis||this._isFloating(this.items[0].item):!1,this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,n,o;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(n=this.options.toleranceElement?t(this.options.toleranceElement,s.item):s.item,e||(s.width=n.outerWidth(),s.height=n.outerHeight()),o=n.offset(),s.left=o.left,s.top=o.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)o=this.containers[i].element.offset(),this.containers[i].containerCache.left=o.left,this.containers[i].containerCache.top=o.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(e){e=e||this;var i,s=e.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=e.currentItem[0].nodeName.toLowerCase(),n=t("<"+s+">",e.document[0]);return e._addClass(n,"ui-sortable-placeholder",i||e.currentItem[0].className)._removeClass(n,"ui-sortable-helper"),"tbody"===s?e._createTrPlaceholder(e.currentItem.find("tr").eq(0),t("<tr>",e.document[0]).appendTo(n)):"tr"===s?e._createTrPlaceholder(e.currentItem,n):"img"===s&&n.attr("src",e.currentItem.attr("src")),i||n.css("visibility","hidden"),n},update:function(t,n){(!i||s.forcePlaceholderSize)&&(n.height()||n.height(e.currentItem.innerHeight()-parseInt(e.currentItem.css("paddingTop")||0,10)-parseInt(e.currentItem.css("paddingBottom")||0,10)),n.width()||n.width(e.currentItem.innerWidth()-parseInt(e.currentItem.css("paddingLeft")||0,10)-parseInt(e.currentItem.css("paddingRight")||0,10)))}}),e.placeholder=t(s.placeholder.element.call(e.element,e.currentItem)),e.currentItem.after(e.placeholder),s.placeholder.update(e,e.placeholder)},_createTrPlaceholder:function(e,i){var s=this;e.children().each(function(){t("<td>&#160;</td>",s.document[0]).attr("colspan",t(this).attr("colspan")||1).appendTo(i)})},_contactContainers:function(e){var i,s,n,o,a,r,h,l,c,u,d=null,p=null;for(i=this.containers.length-1;i>=0;i--)if(!t.contains(this.currentItem[0],this.containers[i].element[0]))if(this._intersectsWith(this.containers[i].containerCache)){if(d&&t.contains(this.containers[i].element[0],d.element[0]))continue;d=this.containers[i],p=i}else this.containers[i].containerCache.over&&(this.containers[i]._trigger("out",e,this._uiHash(this)),this.containers[i].containerCache.over=0);if(d)if(1===this.containers.length)this.containers[p].containerCache.over||(this.containers[p]._trigger("over",e,this._uiHash(this)),this.containers[p].containerCache.over=1);else{for(n=1e4,o=null,c=d.floating||this._isFloating(this.currentItem),a=c?"left":"top",r=c?"width":"height",u=c?"pageX":"pageY",s=this.items.length-1;s>=0;s--)t.contains(this.containers[p].element[0],this.items[s].item[0])&&this.items[s].item[0]!==this.currentItem[0]&&(h=this.items[s].item.offset()[a],l=!1,e[u]-h>this.items[s][r]/2&&(l=!0),n>Math.abs(e[u]-h)&&(n=Math.abs(e[u]-h),o=this.items[s],this.direction=l?"up":"down"));if(!o&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[p])return this.currentContainer.containerCache.over||(this.containers[p]._trigger("over",e,this._uiHash()),this.currentContainer.containerCache.over=1),void 0;o?this._rearrange(e,o,null,!0):this._rearrange(e,null,this.containers[p].element,!0),this._trigger("change",e,this._uiHash()),this.containers[p]._trigger("change",e,this._uiHash(this)),this.currentContainer=this.containers[p],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[p]._trigger("over",e,this._uiHash(this)),this.containers[p].containerCache.over=1}},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||t("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==this.document[0]&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===this.document[0].body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.currentItem.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;"parent"===n.containment&&(n.containment=this.helper[0].parentNode),("document"===n.containment||"window"===n.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,"document"===n.containment?this.document.width():this.window.width()-this.helperProportions.width-this.margins.left,("document"===n.containment?this.document.height()||document.body.parentNode.scrollHeight:this.window.height()||this.document[0].body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(n.containment)||(e=t(n.containment)[0],i=t(n.containment).offset(),s="hidden"!==t(e).css("overflow"),this.containment=[i.left+(parseInt(t(e).css("borderLeftWidth"),10)||0)+(parseInt(t(e).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(t(e).css("borderTopWidth"),10)||0)+(parseInt(t(e).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(e.scrollWidth,e.offsetWidth):e.offsetWidth)-(parseInt(t(e).css("borderLeftWidth"),10)||0)-(parseInt(t(e).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(t(e).css("borderTopWidth"),10)||0)-(parseInt(t(e).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,o=/(html|body)/i.test(n[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():o?0:n.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():o?0:n.scrollLeft())*s}},_generatePosition:function(e){var i,s,n=this.options,o=e.pageX,a=e.pageY,r="absolute"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=/(html|body)/i.test(r[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(e.pageX-this.offset.click.left<this.containment[0]&&(o=this.containment[0]+this.offset.click.left),e.pageY-this.offset.click.top<this.containment[1]&&(a=this.containment[1]+this.offset.click.top),e.pageX-this.offset.click.left>this.containment[2]&&(o=this.containment[2]+this.offset.click.left),e.pageY-this.offset.click.top>this.containment[3]&&(a=this.containment[3]+this.offset.click.top)),n.grid&&(i=this.originalPageY+Math.round((a-this.originalPageY)/n.grid[1])*n.grid[1],a=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-n.grid[1]:i+n.grid[1]:i,s=this.originalPageX+Math.round((o-this.originalPageX)/n.grid[0])*n.grid[0],o=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-n.grid[0]:s+n.grid[0]:s)),{top:a-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():h?0:r.scrollTop()),left:o-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():h?0:r.scrollLeft())}},_rearrange:function(t,e,i,s){i?i[0].appendChild(this.placeholder[0]):e.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?e.item[0]:e.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var n=this.counter;
this._delay(function(){n===this.counter&&this.refreshPositions(!s)})},_clear:function(t,e){function i(t,e,i){return function(s){i._trigger(t,s,e._uiHash(e))}}this.reverting=!1;var s,n=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(s in this._storedCSS)("auto"===this._storedCSS[s]||"static"===this._storedCSS[s])&&(this._storedCSS[s]="");this.currentItem.css(this._storedCSS),this._removeClass(this.currentItem,"ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!e&&n.push(function(t){this._trigger("receive",t,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||e||n.push(function(t){this._trigger("update",t,this._uiHash())}),this!==this.currentContainer&&(e||(n.push(function(t){this._trigger("remove",t,this._uiHash())}),n.push(function(t){return function(e){t._trigger("receive",e,this._uiHash(this))}}.call(this,this.currentContainer)),n.push(function(t){return function(e){t._trigger("update",e,this._uiHash(this))}}.call(this,this.currentContainer)))),s=this.containers.length-1;s>=0;s--)e||n.push(i("deactivate",this,this.containers[s])),this.containers[s].containerCache.over&&(n.push(i("out",this,this.containers[s])),this.containers[s].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,e||this._trigger("beforeStop",t,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.cancelHelperRemoval||(this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null),!e){for(s=0;n.length>s;s++)n[s].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!this.cancelHelperRemoval},_trigger:function(){t.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(e){var i=e||this;return{helper:i.helper,placeholder:i.placeholder||t([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:e?e.element:null}}}),t.widget("ui.spinner",{version:"1.12.1",defaultElement:"<input>",widgetEventPrefix:"spin",options:{classes:{"ui-spinner":"ui-corner-all","ui-spinner-down":"ui-corner-br","ui-spinner-up":"ui-corner-tr"},culture:null,icons:{down:"ui-icon-triangle-1-s",up:"ui-icon-triangle-1-n"},incremental:!0,max:null,min:null,numberFormat:null,page:10,step:1,change:null,spin:null,start:null,stop:null},_create:function(){this._setOption("max",this.options.max),this._setOption("min",this.options.min),this._setOption("step",this.options.step),""!==this.value()&&this._value(this.element.val(),!0),this._draw(),this._on(this._events),this._refresh(),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_getCreateOptions:function(){var e=this._super(),i=this.element;return t.each(["min","max","step"],function(t,s){var n=i.attr(s);null!=n&&n.length&&(e[s]=n)}),e},_events:{keydown:function(t){this._start(t)&&this._keydown(t)&&t.preventDefault()},keyup:"_stop",focus:function(){this.previous=this.element.val()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,void 0):(this._stop(),this._refresh(),this.previous!==this.element.val()&&this._trigger("change",t),void 0)},mousewheel:function(t,e){if(e){if(!this.spinning&&!this._start(t))return!1;this._spin((e>0?1:-1)*this.options.step,t),clearTimeout(this.mousewheelTimer),this.mousewheelTimer=this._delay(function(){this.spinning&&this._stop(t)},100),t.preventDefault()}},"mousedown .ui-spinner-button":function(e){function i(){var e=this.element[0]===t.ui.safeActiveElement(this.document[0]);e||(this.element.trigger("focus"),this.previous=s,this._delay(function(){this.previous=s}))}var s;s=this.element[0]===t.ui.safeActiveElement(this.document[0])?this.previous:this.element.val(),e.preventDefault(),i.call(this),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,i.call(this)}),this._start(e)!==!1&&this._repeat(null,t(e.currentTarget).hasClass("ui-spinner-up")?1:-1,e)},"mouseup .ui-spinner-button":"_stop","mouseenter .ui-spinner-button":function(e){return t(e.currentTarget).hasClass("ui-state-active")?this._start(e)===!1?!1:(this._repeat(null,t(e.currentTarget).hasClass("ui-spinner-up")?1:-1,e),void 0):void 0},"mouseleave .ui-spinner-button":"_stop"},_enhance:function(){this.uiSpinner=this.element.attr("autocomplete","off").wrap("<span>").parent().append("<a></a><a></a>")},_draw:function(){this._enhance(),this._addClass(this.uiSpinner,"ui-spinner","ui-widget ui-widget-content"),this._addClass("ui-spinner-input"),this.element.attr("role","spinbutton"),this.buttons=this.uiSpinner.children("a").attr("tabIndex",-1).attr("aria-hidden",!0).button({classes:{"ui-button":""}}),this._removeClass(this.buttons,"ui-corner-all"),this._addClass(this.buttons.first(),"ui-spinner-button ui-spinner-up"),this._addClass(this.buttons.last(),"ui-spinner-button ui-spinner-down"),this.buttons.first().button({icon:this.options.icons.up,showLabel:!1}),this.buttons.last().button({icon:this.options.icons.down,showLabel:!1}),this.buttons.height()>Math.ceil(.5*this.uiSpinner.height())&&this.uiSpinner.height()>0&&this.uiSpinner.height(this.uiSpinner.height())},_keydown:function(e){var i=this.options,s=t.ui.keyCode;switch(e.keyCode){case s.UP:return this._repeat(null,1,e),!0;case s.DOWN:return this._repeat(null,-1,e),!0;case s.PAGE_UP:return this._repeat(null,i.page,e),!0;case s.PAGE_DOWN:return this._repeat(null,-i.page,e),!0}return!1},_start:function(t){return this.spinning||this._trigger("start",t)!==!1?(this.counter||(this.counter=1),this.spinning=!0,!0):!1},_repeat:function(t,e,i){t=t||500,clearTimeout(this.timer),this.timer=this._delay(function(){this._repeat(40,e,i)},t),this._spin(e*this.options.step,i)},_spin:function(t,e){var i=this.value()||0;this.counter||(this.counter=1),i=this._adjustValue(i+t*this._increment(this.counter)),this.spinning&&this._trigger("spin",e,{value:i})===!1||(this._value(i),this.counter++)},_increment:function(e){var i=this.options.incremental;return i?t.isFunction(i)?i(e):Math.floor(e*e*e/5e4-e*e/500+17*e/200+1):1},_precision:function(){var t=this._precisionOf(this.options.step);return null!==this.options.min&&(t=Math.max(t,this._precisionOf(this.options.min))),t},_precisionOf:function(t){var e=""+t,i=e.indexOf(".");return-1===i?0:e.length-i-1},_adjustValue:function(t){var e,i,s=this.options;return e=null!==s.min?s.min:0,i=t-e,i=Math.round(i/s.step)*s.step,t=e+i,t=parseFloat(t.toFixed(this._precision())),null!==s.max&&t>s.max?s.max:null!==s.min&&s.min>t?s.min:t},_stop:function(t){this.spinning&&(clearTimeout(this.timer),clearTimeout(this.mousewheelTimer),this.counter=0,this.spinning=!1,this._trigger("stop",t))},_setOption:function(t,e){var i,s,n;return"culture"===t||"numberFormat"===t?(i=this._parse(this.element.val()),this.options[t]=e,this.element.val(this._format(i)),void 0):(("max"===t||"min"===t||"step"===t)&&"string"==typeof e&&(e=this._parse(e)),"icons"===t&&(s=this.buttons.first().find(".ui-icon"),this._removeClass(s,null,this.options.icons.up),this._addClass(s,null,e.up),n=this.buttons.last().find(".ui-icon"),this._removeClass(n,null,this.options.icons.down),this._addClass(n,null,e.down)),this._super(t,e),void 0)},_setOptionDisabled:function(t){this._super(t),this._toggleClass(this.uiSpinner,null,"ui-state-disabled",!!t),this.element.prop("disabled",!!t),this.buttons.button(t?"disable":"enable")},_setOptions:r(function(t){this._super(t)}),_parse:function(t){return"string"==typeof t&&""!==t&&(t=window.Globalize&&this.options.numberFormat?Globalize.parseFloat(t,10,this.options.culture):+t),""===t||isNaN(t)?null:t},_format:function(t){return""===t?"":window.Globalize&&this.options.numberFormat?Globalize.format(t,this.options.numberFormat,this.options.culture):t},_refresh:function(){this.element.attr({"aria-valuemin":this.options.min,"aria-valuemax":this.options.max,"aria-valuenow":this._parse(this.element.val())})},isValid:function(){var t=this.value();return null===t?!1:t===this._adjustValue(t)},_value:function(t,e){var i;""!==t&&(i=this._parse(t),null!==i&&(e||(i=this._adjustValue(i)),t=this._format(i))),this.element.val(t),this._refresh()},_destroy:function(){this.element.prop("disabled",!1).removeAttr("autocomplete role aria-valuemin aria-valuemax aria-valuenow"),this.uiSpinner.replaceWith(this.element)},stepUp:r(function(t){this._stepUp(t)}),_stepUp:function(t){this._start()&&(this._spin((t||1)*this.options.step),this._stop())},stepDown:r(function(t){this._stepDown(t)}),_stepDown:function(t){this._start()&&(this._spin((t||1)*-this.options.step),this._stop())},pageUp:r(function(t){this._stepUp((t||1)*this.options.page)}),pageDown:r(function(t){this._stepDown((t||1)*this.options.page)}),value:function(t){return arguments.length?(r(this._value).call(this,t),void 0):this._parse(this.element.val())},widget:function(){return this.uiSpinner}}),t.uiBackCompat!==!1&&t.widget("ui.spinner",t.ui.spinner,{_enhance:function(){this.uiSpinner=this.element.attr("autocomplete","off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml())},_uiSpinnerHtml:function(){return"<span>"},_buttonHtml:function(){return"<a></a><a></a>"}}),t.ui.spinner,t.widget("ui.tabs",{version:"1.12.1",delay:300,options:{active:null,classes:{"ui-tabs":"ui-corner-all","ui-tabs-nav":"ui-corner-all","ui-tabs-panel":"ui-corner-bottom","ui-tabs-tab":"ui-corner-top"},collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_isLocal:function(){var t=/#.*$/;return function(e){var i,s;i=e.href.replace(t,""),s=location.href.replace(t,"");try{i=decodeURIComponent(i)}catch(n){}try{s=decodeURIComponent(s)}catch(n){}return e.hash.length>1&&i===s}}(),_create:function(){var e=this,i=this.options;this.running=!1,this._addClass("ui-tabs","ui-widget ui-widget-content"),this._toggleClass("ui-tabs-collapsible",null,i.collapsible),this._processTabs(),i.active=this._initialActive(),t.isArray(i.disabled)&&(i.disabled=t.unique(i.disabled.concat(t.map(this.tabs.filter(".ui-state-disabled"),function(t){return e.tabs.index(t)}))).sort()),this.active=this.options.active!==!1&&this.anchors.length?this._findActive(i.active):t(),this._refresh(),this.active.length&&this.load(i.active)},_initialActive:function(){var e=this.options.active,i=this.options.collapsible,s=location.hash.substring(1);return null===e&&(s&&this.tabs.each(function(i,n){return t(n).attr("aria-controls")===s?(e=i,!1):void 0}),null===e&&(e=this.tabs.index(this.tabs.filter(".ui-tabs-active"))),(null===e||-1===e)&&(e=this.tabs.length?0:!1)),e!==!1&&(e=this.tabs.index(this.tabs.eq(e)),-1===e&&(e=i?!1:0)),!i&&e===!1&&this.anchors.length&&(e=0),e},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):t()}},_tabKeydown:function(e){var i=t(t.ui.safeActiveElement(this.document[0])).closest("li"),s=this.tabs.index(i),n=!0;if(!this._handlePageNav(e)){switch(e.keyCode){case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:s++;break;case t.ui.keyCode.UP:case t.ui.keyCode.LEFT:n=!1,s--;break;case t.ui.keyCode.END:s=this.anchors.length-1;break;case t.ui.keyCode.HOME:s=0;break;case t.ui.keyCode.SPACE:return e.preventDefault(),clearTimeout(this.activating),this._activate(s),void 0;case t.ui.keyCode.ENTER:return e.preventDefault(),clearTimeout(this.activating),this._activate(s===this.options.active?!1:s),void 0;default:return}e.preventDefault(),clearTimeout(this.activating),s=this._focusNextTab(s,n),e.ctrlKey||e.metaKey||(i.attr("aria-selected","false"),this.tabs.eq(s).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",s)},this.delay))}},_panelKeydown:function(e){this._handlePageNav(e)||e.ctrlKey&&e.keyCode===t.ui.keyCode.UP&&(e.preventDefault(),this.active.trigger("focus"))},_handlePageNav:function(e){return e.altKey&&e.keyCode===t.ui.keyCode.PAGE_UP?(this._activate(this._focusNextTab(this.options.active-1,!1)),!0):e.altKey&&e.keyCode===t.ui.keyCode.PAGE_DOWN?(this._activate(this._focusNextTab(this.options.active+1,!0)),!0):void 0},_findNextTab:function(e,i){function s(){return e>n&&(e=0),0>e&&(e=n),e}for(var n=this.tabs.length-1;-1!==t.inArray(s(),this.options.disabled);)e=i?e+1:e-1;return e},_focusNextTab:function(t,e){return t=this._findNextTab(t,e),this.tabs.eq(t).trigger("focus"),t},_setOption:function(t,e){return"active"===t?(this._activate(e),void 0):(this._super(t,e),"collapsible"===t&&(this._toggleClass("ui-tabs-collapsible",null,e),e||this.options.active!==!1||this._activate(0)),"event"===t&&this._setupEvents(e),"heightStyle"===t&&this._setupHeightStyle(e),void 0)},_sanitizeSelector:function(t){return t?t.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var e=this.options,i=this.tablist.children(":has(a[href])");e.disabled=t.map(i.filter(".ui-state-disabled"),function(t){return i.index(t)}),this._processTabs(),e.active!==!1&&this.anchors.length?this.active.length&&!t.contains(this.tablist[0],this.active[0])?this.tabs.length===e.disabled.length?(e.active=!1,this.active=t()):this._activate(this._findNextTab(Math.max(0,e.active-1),!1)):e.active=this.tabs.index(this.active):(e.active=!1,this.active=t()),this._refresh()},_refresh:function(){this._setOptionDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false","aria-expanded":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-hidden":"true"}),this.active.length?(this.active.attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0}),this._addClass(this.active,"ui-tabs-active","ui-state-active"),this._getPanelForTab(this.active).show().attr({"aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var e=this,i=this.tabs,s=this.anchors,n=this.panels;this.tablist=this._getList().attr("role","tablist"),this._addClass(this.tablist,"ui-tabs-nav","ui-helper-reset ui-helper-clearfix ui-widget-header"),this.tablist.on("mousedown"+this.eventNamespace,"> li",function(e){t(this).is(".ui-state-disabled")&&e.preventDefault()}).on("focus"+this.eventNamespace,".ui-tabs-anchor",function(){t(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this.tabs=this.tablist.find("> li:has(a[href])").attr({role:"tab",tabIndex:-1}),this._addClass(this.tabs,"ui-tabs-tab","ui-state-default"),this.anchors=this.tabs.map(function(){return t("a",this)[0]}).attr({role:"presentation",tabIndex:-1}),this._addClass(this.anchors,"ui-tabs-anchor"),this.panels=t(),this.anchors.each(function(i,s){var n,o,a,r=t(s).uniqueId().attr("id"),h=t(s).closest("li"),l=h.attr("aria-controls");e._isLocal(s)?(n=s.hash,a=n.substring(1),o=e.element.find(e._sanitizeSelector(n))):(a=h.attr("aria-controls")||t({}).uniqueId()[0].id,n="#"+a,o=e.element.find(n),o.length||(o=e._createPanel(a),o.insertAfter(e.panels[i-1]||e.tablist)),o.attr("aria-live","polite")),o.length&&(e.panels=e.panels.add(o)),l&&h.data("ui-tabs-aria-controls",l),h.attr({"aria-controls":a,"aria-labelledby":r}),o.attr("aria-labelledby",r)}),this.panels.attr("role","tabpanel"),this._addClass(this.panels,"ui-tabs-panel","ui-widget-content"),i&&(this._off(i.not(this.tabs)),this._off(s.not(this.anchors)),this._off(n.not(this.panels)))},_getList:function(){return this.tablist||this.element.find("ol, ul").eq(0)},_createPanel:function(e){return t("<div>").attr("id",e).data("ui-tabs-destroy",!0)},_setOptionDisabled:function(e){var i,s,n;for(t.isArray(e)&&(e.length?e.length===this.anchors.length&&(e=!0):e=!1),n=0;s=this.tabs[n];n++)i=t(s),e===!0||-1!==t.inArray(n,e)?(i.attr("aria-disabled","true"),this._addClass(i,null,"ui-state-disabled")):(i.removeAttr("aria-disabled"),this._removeClass(i,null,"ui-state-disabled"));this.options.disabled=e,this._toggleClass(this.widget(),this.widgetFullName+"-disabled",null,e===!0)},_setupEvents:function(e){var i={};e&&t.each(e.split(" "),function(t,e){i[e]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(!0,this.anchors,{click:function(t){t.preventDefault()}}),this._on(this.anchors,i),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(e){var i,s=this.element.parent();"fill"===e?(i=s.height(),i-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var e=t(this),s=e.css("position");"absolute"!==s&&"fixed"!==s&&(i-=e.outerHeight(!0))}),this.element.children().not(this.panels).each(function(){i-=t(this).outerHeight(!0)}),this.panels.each(function(){t(this).height(Math.max(0,i-t(this).innerHeight()+t(this).height()))}).css("overflow","auto")):"auto"===e&&(i=0,this.panels.each(function(){i=Math.max(i,t(this).height("").height())}).height(i))},_eventHandler:function(e){var i=this.options,s=this.active,n=t(e.currentTarget),o=n.closest("li"),a=o[0]===s[0],r=a&&i.collapsible,h=r?t():this._getPanelForTab(o),l=s.length?this._getPanelForTab(s):t(),c={oldTab:s,oldPanel:l,newTab:r?t():o,newPanel:h};e.preventDefault(),o.hasClass("ui-state-disabled")||o.hasClass("ui-tabs-loading")||this.running||a&&!i.collapsible||this._trigger("beforeActivate",e,c)===!1||(i.active=r?!1:this.tabs.index(o),this.active=a?t():o,this.xhr&&this.xhr.abort(),l.length||h.length||t.error("jQuery UI Tabs: Mismatching fragment identifier."),h.length&&this.load(this.tabs.index(o),e),this._toggle(e,c))},_toggle:function(e,i){function s(){o.running=!1,o._trigger("activate",e,i)}function n(){o._addClass(i.newTab.closest("li"),"ui-tabs-active","ui-state-active"),a.length&&o.options.show?o._show(a,o.options.show,s):(a.show(),s())}var o=this,a=i.newPanel,r=i.oldPanel;this.running=!0,r.length&&this.options.hide?this._hide(r,this.options.hide,function(){o._removeClass(i.oldTab.closest("li"),"ui-tabs-active","ui-state-active"),n()}):(this._removeClass(i.oldTab.closest("li"),"ui-tabs-active","ui-state-active"),r.hide(),n()),r.attr("aria-hidden","true"),i.oldTab.attr({"aria-selected":"false","aria-expanded":"false"}),a.length&&r.length?i.oldTab.attr("tabIndex",-1):a.length&&this.tabs.filter(function(){return 0===t(this).attr("tabIndex")}).attr("tabIndex",-1),a.attr("aria-hidden","false"),i.newTab.attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0})},_activate:function(e){var i,s=this._findActive(e);s[0]!==this.active[0]&&(s.length||(s=this.active),i=s.find(".ui-tabs-anchor")[0],this._eventHandler({target:i,currentTarget:i,preventDefault:t.noop}))},_findActive:function(e){return e===!1?t():this.tabs.eq(e)},_getIndex:function(e){return"string"==typeof e&&(e=this.anchors.index(this.anchors.filter("[href$='"+t.ui.escapeSelector(e)+"']"))),e},_destroy:function(){this.xhr&&this.xhr.abort(),this.tablist.removeAttr("role").off(this.eventNamespace),this.anchors.removeAttr("role tabIndex").removeUniqueId(),this.tabs.add(this.panels).each(function(){t.data(this,"ui-tabs-destroy")?t(this).remove():t(this).removeAttr("role tabIndex aria-live aria-busy aria-selected aria-labelledby aria-hidden aria-expanded")}),this.tabs.each(function(){var e=t(this),i=e.data("ui-tabs-aria-controls");i?e.attr("aria-controls",i).removeData("ui-tabs-aria-controls"):e.removeAttr("aria-controls")}),this.panels.show(),"content"!==this.options.heightStyle&&this.panels.css("height","")},enable:function(e){var i=this.options.disabled;i!==!1&&(void 0===e?i=!1:(e=this._getIndex(e),i=t.isArray(i)?t.map(i,function(t){return t!==e?t:null}):t.map(this.tabs,function(t,i){return i!==e?i:null})),this._setOptionDisabled(i))},disable:function(e){var i=this.options.disabled;if(i!==!0){if(void 0===e)i=!0;else{if(e=this._getIndex(e),-1!==t.inArray(e,i))return;i=t.isArray(i)?t.merge([e],i).sort():[e]}this._setOptionDisabled(i)}},load:function(e,i){e=this._getIndex(e);var s=this,n=this.tabs.eq(e),o=n.find(".ui-tabs-anchor"),a=this._getPanelForTab(n),r={tab:n,panel:a},h=function(t,e){"abort"===e&&s.panels.stop(!1,!0),s._removeClass(n,"ui-tabs-loading"),a.removeAttr("aria-busy"),t===s.xhr&&delete s.xhr};this._isLocal(o[0])||(this.xhr=t.ajax(this._ajaxSettings(o,i,r)),this.xhr&&"canceled"!==this.xhr.statusText&&(this._addClass(n,"ui-tabs-loading"),a.attr("aria-busy","true"),this.xhr.done(function(t,e,n){setTimeout(function(){a.html(t),s._trigger("load",i,r),h(n,e)},1)}).fail(function(t,e){setTimeout(function(){h(t,e)},1)})))},_ajaxSettings:function(e,i,s){var n=this;return{url:e.attr("href").replace(/#.*$/,""),beforeSend:function(e,o){return n._trigger("beforeLoad",i,t.extend({jqXHR:e,ajaxSettings:o},s))}}},_getPanelForTab:function(e){var i=t(e).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+i))}}),t.uiBackCompat!==!1&&t.widget("ui.tabs",t.ui.tabs,{_processTabs:function(){this._superApply(arguments),this._addClass(this.tabs,"ui-tab")}}),t.ui.tabs,t.widget("ui.tooltip",{version:"1.12.1",options:{classes:{"ui-tooltip":"ui-corner-all ui-widget-shadow"},content:function(){var e=t(this).attr("title")||"";return t("<a>").text(e).html()},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,track:!1,close:null,open:null},_addDescribedBy:function(e,i){var s=(e.attr("aria-describedby")||"").split(/\s+/);s.push(i),e.data("ui-tooltip-id",i).attr("aria-describedby",t.trim(s.join(" ")))},_removeDescribedBy:function(e){var i=e.data("ui-tooltip-id"),s=(e.attr("aria-describedby")||"").split(/\s+/),n=t.inArray(i,s);-1!==n&&s.splice(n,1),e.removeData("ui-tooltip-id"),s=t.trim(s.join(" ")),s?e.attr("aria-describedby",s):e.removeAttr("aria-describedby")},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.liveRegion=t("<div>").attr({role:"log","aria-live":"assertive","aria-relevant":"additions"}).appendTo(this.document[0].body),this._addClass(this.liveRegion,null,"ui-helper-hidden-accessible"),this.disabledTitles=t([])},_setOption:function(e,i){var s=this;this._super(e,i),"content"===e&&t.each(this.tooltips,function(t,e){s._updateContent(e.element)})},_setOptionDisabled:function(t){this[t?"_disable":"_enable"]()},_disable:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur");n.target=n.currentTarget=s.element[0],e.close(n,!0)}),this.disabledTitles=this.disabledTitles.add(this.element.find(this.options.items).addBack().filter(function(){var e=t(this);return e.is("[title]")?e.data("ui-tooltip-title",e.attr("title")).removeAttr("title"):void 0}))},_enable:function(){this.disabledTitles.each(function(){var e=t(this);e.data("ui-tooltip-title")&&e.attr("title",e.data("ui-tooltip-title"))}),this.disabledTitles=t([])},open:function(e){var i=this,s=t(e?e.target:this.element).closest(this.options.items);s.length&&!s.data("ui-tooltip-id")&&(s.attr("title")&&s.data("ui-tooltip-title",s.attr("title")),s.data("ui-tooltip-open",!0),e&&"mouseover"===e.type&&s.parents().each(function(){var e,s=t(this);s.data("ui-tooltip-open")&&(e=t.Event("blur"),e.target=e.currentTarget=this,i.close(e,!0)),s.attr("title")&&(s.uniqueId(),i.parents[this.id]={element:this,title:s.attr("title")},s.attr("title",""))}),this._registerCloseHandlers(e,s),this._updateContent(s,e))},_updateContent:function(t,e){var i,s=this.options.content,n=this,o=e?e.type:null;return"string"==typeof s||s.nodeType||s.jquery?this._open(e,t,s):(i=s.call(t[0],function(i){n._delay(function(){t.data("ui-tooltip-open")&&(e&&(e.type=o),this._open(e,t,i))})}),i&&this._open(e,t,i),void 0)},_open:function(e,i,s){function n(t){l.of=t,a.is(":hidden")||a.position(l)}var o,a,r,h,l=t.extend({},this.options.position);if(s){if(o=this._find(i))return o.tooltip.find(".ui-tooltip-content").html(s),void 0;i.is("[title]")&&(e&&"mouseover"===e.type?i.attr("title",""):i.removeAttr("title")),o=this._tooltip(i),a=o.tooltip,this._addDescribedBy(i,a.attr("id")),a.find(".ui-tooltip-content").html(s),this.liveRegion.children().hide(),h=t("<div>").html(a.find(".ui-tooltip-content").html()),h.removeAttr("name").find("[name]").removeAttr("name"),h.removeAttr("id").find("[id]").removeAttr("id"),h.appendTo(this.liveRegion),this.options.track&&e&&/^mouse/.test(e.type)?(this._on(this.document,{mousemove:n}),n(e)):a.position(t.extend({of:i},this.options.position)),a.hide(),this._show(a,this.options.show),this.options.track&&this.options.show&&this.options.show.delay&&(r=this.delayedShow=setInterval(function(){a.is(":visible")&&(n(l.of),clearInterval(r))},t.fx.interval)),this._trigger("open",e,{tooltip:a})}},_registerCloseHandlers:function(e,i){var s={keyup:function(e){if(e.keyCode===t.ui.keyCode.ESCAPE){var s=t.Event(e);s.currentTarget=i[0],this.close(s,!0)}}};i[0]!==this.element[0]&&(s.remove=function(){this._removeTooltip(this._find(i).tooltip)}),e&&"mouseover"!==e.type||(s.mouseleave="close"),e&&"focusin"!==e.type||(s.focusout="close"),this._on(!0,i,s)},close:function(e){var i,s=this,n=t(e?e.currentTarget:this.element),o=this._find(n);return o?(i=o.tooltip,o.closing||(clearInterval(this.delayedShow),n.data("ui-tooltip-title")&&!n.attr("title")&&n.attr("title",n.data("ui-tooltip-title")),this._removeDescribedBy(n),o.hiding=!0,i.stop(!0),this._hide(i,this.options.hide,function(){s._removeTooltip(t(this))}),n.removeData("ui-tooltip-open"),this._off(n,"mouseleave focusout keyup"),n[0]!==this.element[0]&&this._off(n,"remove"),this._off(this.document,"mousemove"),e&&"mouseleave"===e.type&&t.each(this.parents,function(e,i){t(i.element).attr("title",i.title),delete s.parents[e]}),o.closing=!0,this._trigger("close",e,{tooltip:i}),o.hiding||(o.closing=!1)),void 0):(n.removeData("ui-tooltip-open"),void 0)},_tooltip:function(e){var i=t("<div>").attr("role","tooltip"),s=t("<div>").appendTo(i),n=i.uniqueId().attr("id");return this._addClass(s,"ui-tooltip-content"),this._addClass(i,"ui-tooltip","ui-widget ui-widget-content"),i.appendTo(this._appendTo(e)),this.tooltips[n]={element:e,tooltip:i}},_find:function(t){var e=t.data("ui-tooltip-id");return e?this.tooltips[e]:null},_removeTooltip:function(t){t.remove(),delete this.tooltips[t.attr("id")]},_appendTo:function(t){var e=t.closest(".ui-front, dialog");return e.length||(e=this.document[0].body),e},_destroy:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur"),o=s.element;n.target=n.currentTarget=o[0],e.close(n,!0),t("#"+i).remove(),o.data("ui-tooltip-title")&&(o.attr("title")||o.attr("title",o.data("ui-tooltip-title")),o.removeData("ui-tooltip-title"))}),this.liveRegion.remove()}}),t.uiBackCompat!==!1&&t.widget("ui.tooltip",t.ui.tooltip,{options:{tooltipClass:null},_tooltip:function(){var t=this._superApply(arguments);return this.options.tooltipClass&&t.tooltip.addClass(this.options.tooltipClass),t}}),t.ui.tooltip});
/*! jCarousel - v0.3.1 - 2014-04-26
* http://sorgalla.com/jcarousel
* Copyright (c) 2014 Jan Sorgalla; Licensed MIT */
(function(t){"use strict";var i=t.jCarousel={};i.version="0.3.1";var s=/^([+\-]=)?(.+)$/;i.parseTarget=function(t){var i=!1,e="object"!=typeof t?s.exec(t):null;return e?(t=parseInt(e[2],10)||0,e[1]&&(i=!0,"-="===e[1]&&(t*=-1))):"object"!=typeof t&&(t=parseInt(t,10)||0),{target:t,relative:i}},i.detectCarousel=function(t){for(var i;t.length>0;){if(i=t.filter("[data-jcarousel]"),i.length>0)return i;if(i=t.find("[data-jcarousel]"),i.length>0)return i;t=t.parent()}return null},i.base=function(s){return{version:i.version,_options:{},_element:null,_carousel:null,_init:t.noop,_create:t.noop,_destroy:t.noop,_reload:t.noop,create:function(){return this._element.attr("data-"+s.toLowerCase(),!0).data(s,this),!1===this._trigger("create")?this:(this._create(),this._trigger("createend"),this)},destroy:function(){return!1===this._trigger("destroy")?this:(this._destroy(),this._trigger("destroyend"),this._element.removeData(s).removeAttr("data-"+s.toLowerCase()),this)},reload:function(t){return!1===this._trigger("reload")?this:(t&&this.options(t),this._reload(),this._trigger("reloadend"),this)},element:function(){return this._element},options:function(i,s){if(0===arguments.length)return t.extend({},this._options);if("string"==typeof i){if(s===void 0)return this._options[i]===void 0?null:this._options[i];this._options[i]=s}else this._options=t.extend({},this._options,i);return this},carousel:function(){return this._carousel||(this._carousel=i.detectCarousel(this.options("carousel")||this._element),this._carousel||t.error('Could not detect carousel for plugin "'+s+'"')),this._carousel},_trigger:function(i,e,r){var n,o=!1;return r=[this].concat(r||[]),(e||this._element).each(function(){n=t.Event((s+":"+i).toLowerCase()),t(this).trigger(n,r),n.isDefaultPrevented()&&(o=!0)}),!o}}},i.plugin=function(s,e){var r=t[s]=function(i,s){this._element=t(i),this.options(s),this._init(),this.create()};return r.fn=r.prototype=t.extend({},i.base(s),e),t.fn[s]=function(i){var e=Array.prototype.slice.call(arguments,1),n=this;return"string"==typeof i?this.each(function(){var r=t(this).data(s);if(!r)return t.error("Cannot call methods on "+s+" prior to initialization; "+'attempted to call method "'+i+'"');if(!t.isFunction(r[i])||"_"===i.charAt(0))return t.error('No such method "'+i+'" for '+s+" instance");var o=r[i].apply(r,e);return o!==r&&o!==void 0?(n=o,!1):void 0}):this.each(function(){var e=t(this).data(s);e instanceof r?e.reload(i):new r(this,i)}),n},r}})(jQuery),function(t,i){"use strict";var s=function(t){return parseFloat(t)||0};t.jCarousel.plugin("jcarousel",{animating:!1,tail:0,inTail:!1,resizeTimer:null,lt:null,vertical:!1,rtl:!1,circular:!1,underflow:!1,relative:!1,_options:{list:function(){return this.element().children().eq(0)},items:function(){return this.list().children()},animation:400,transitions:!1,wrap:null,vertical:null,rtl:null,center:!1},_list:null,_items:null,_target:null,_first:null,_last:null,_visible:null,_fullyvisible:null,_init:function(){var t=this;return this.onWindowResize=function(){t.resizeTimer&&clearTimeout(t.resizeTimer),t.resizeTimer=setTimeout(function(){t.reload()},100)},this},_create:function(){this._reload(),t(i).on("resize.jcarousel",this.onWindowResize)},_destroy:function(){t(i).off("resize.jcarousel",this.onWindowResize)},_reload:function(){this.vertical=this.options("vertical"),null==this.vertical&&(this.vertical=this.list().height()>this.list().width()),this.rtl=this.options("rtl"),null==this.rtl&&(this.rtl=function(i){if("rtl"===(""+i.attr("dir")).toLowerCase())return!0;var s=!1;return i.parents("[dir]").each(function(){return/rtl/i.test(t(this).attr("dir"))?(s=!0,!1):void 0}),s}(this._element)),this.lt=this.vertical?"top":"left",this.relative="relative"===this.list().css("position"),this._list=null,this._items=null;var i=this._target&&this.index(this._target)>=0?this._target:this.closest();this.circular="circular"===this.options("wrap"),this.underflow=!1;var s={left:0,top:0};return i.length>0&&(this._prepare(i),this.list().find("[data-jcarousel-clone]").remove(),this._items=null,this.underflow=this._fullyvisible.length>=this.items().length,this.circular=this.circular&&!this.underflow,s[this.lt]=this._position(i)+"px"),this.move(s),this},list:function(){if(null===this._list){var i=this.options("list");this._list=t.isFunction(i)?i.call(this):this._element.find(i)}return this._list},items:function(){if(null===this._items){var i=this.options("items");this._items=(t.isFunction(i)?i.call(this):this.list().find(i)).not("[data-jcarousel-clone]")}return this._items},index:function(t){return this.items().index(t)},closest:function(){var i,e=this,r=this.list().position()[this.lt],n=t(),o=!1,l=this.vertical?"bottom":this.rtl&&!this.relative?"left":"right";return this.rtl&&this.relative&&!this.vertical&&(r+=this.list().width()-this.clipping()),this.items().each(function(){if(n=t(this),o)return!1;var a=e.dimension(n);if(r+=a,r>=0){if(i=a-s(n.css("margin-"+l)),!(0>=Math.abs(r)-a+i/2))return!1;o=!0}}),n},target:function(){return this._target},first:function(){return this._first},last:function(){return this._last},visible:function(){return this._visible},fullyvisible:function(){return this._fullyvisible},hasNext:function(){if(!1===this._trigger("hasnext"))return!0;var t=this.options("wrap"),i=this.items().length-1;return i>=0&&!this.underflow&&(t&&"first"!==t||i>this.index(this._last)||this.tail&&!this.inTail)?!0:!1},hasPrev:function(){if(!1===this._trigger("hasprev"))return!0;var t=this.options("wrap");return this.items().length>0&&!this.underflow&&(t&&"last"!==t||this.index(this._first)>0||this.tail&&this.inTail)?!0:!1},clipping:function(){return this._element["inner"+(this.vertical?"Height":"Width")]()},dimension:function(t){return t["outer"+(this.vertical?"Height":"Width")](!0)},scroll:function(i,s,e){if(this.animating)return this;if(!1===this._trigger("scroll",null,[i,s]))return this;t.isFunction(s)&&(e=s,s=!0);var r=t.jCarousel.parseTarget(i);if(r.relative){var n,o,l,a,h,u,c,f,d=this.items().length-1,_=Math.abs(r.target),p=this.options("wrap");if(r.target>0){var g=this.index(this._last);if(g>=d&&this.tail)this.inTail?"both"===p||"last"===p?this._scroll(0,s,e):t.isFunction(e)&&e.call(this,!1):this._scrollTail(s,e);else if(n=this.index(this._target),this.underflow&&n===d&&("circular"===p||"both"===p||"last"===p)||!this.underflow&&g===d&&("both"===p||"last"===p))this._scroll(0,s,e);else if(l=n+_,this.circular&&l>d){for(f=d,h=this.items().get(-1);l>f++;)h=this.items().eq(0),u=this._visible.index(h)>=0,u&&h.after(h.clone(!0).attr("data-jcarousel-clone",!0)),this.list().append(h),u||(c={},c[this.lt]=this.dimension(h),this.moveBy(c)),this._items=null;this._scroll(h,s,e)}else this._scroll(Math.min(l,d),s,e)}else if(this.inTail)this._scroll(Math.max(this.index(this._first)-_+1,0),s,e);else if(o=this.index(this._first),n=this.index(this._target),a=this.underflow?n:o,l=a-_,0>=a&&(this.underflow&&"circular"===p||"both"===p||"first"===p))this._scroll(d,s,e);else if(this.circular&&0>l){for(f=l,h=this.items().get(0);0>f++;){h=this.items().eq(-1),u=this._visible.index(h)>=0,u&&h.after(h.clone(!0).attr("data-jcarousel-clone",!0)),this.list().prepend(h),this._items=null;var v=this.dimension(h);c={},c[this.lt]=-v,this.moveBy(c)}this._scroll(h,s,e)}else this._scroll(Math.max(l,0),s,e)}else this._scroll(r.target,s,e);return this._trigger("scrollend"),this},moveBy:function(t,i){var e=this.list().position(),r=1,n=0;return this.rtl&&!this.vertical&&(r=-1,this.relative&&(n=this.list().width()-this.clipping())),t.left&&(t.left=e.left+n+s(t.left)*r+"px"),t.top&&(t.top=e.top+n+s(t.top)*r+"px"),this.move(t,i)},move:function(i,s){s=s||{};var e=this.options("transitions"),r=!!e,n=!!e.transforms,o=!!e.transforms3d,l=s.duration||0,a=this.list();if(!r&&l>0)return a.animate(i,s),void 0;var h=s.complete||t.noop,u={};if(r){var c=a.css(["transitionDuration","transitionTimingFunction","transitionProperty"]),f=h;h=function(){t(this).css(c),f.call(this)},u={transitionDuration:(l>0?l/1e3:0)+"s",transitionTimingFunction:e.easing||s.easing,transitionProperty:l>0?function(){return n||o?"all":i.left?"left":"top"}():"none",transform:"none"}}o?u.transform="translate3d("+(i.left||0)+","+(i.top||0)+",0)":n?u.transform="translate("+(i.left||0)+","+(i.top||0)+")":t.extend(u,i),r&&l>0&&a.one("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd",h),a.css(u),0>=l&&a.each(function(){h.call(this)})},_scroll:function(i,s,e){if(this.animating)return t.isFunction(e)&&e.call(this,!1),this;if("object"!=typeof i?i=this.items().eq(i):i.jquery===void 0&&(i=t(i)),0===i.length)return t.isFunction(e)&&e.call(this,!1),this;this.inTail=!1,this._prepare(i);var r=this._position(i),n=this.list().position()[this.lt];if(r===n)return t.isFunction(e)&&e.call(this,!1),this;var o={};return o[this.lt]=r+"px",this._animate(o,s,e),this},_scrollTail:function(i,s){if(this.animating||!this.tail)return t.isFunction(s)&&s.call(this,!1),this;var e=this.list().position()[this.lt];this.rtl&&this.relative&&!this.vertical&&(e+=this.list().width()-this.clipping()),this.rtl&&!this.vertical?e+=this.tail:e-=this.tail,this.inTail=!0;var r={};return r[this.lt]=e+"px",this._update({target:this._target.next(),fullyvisible:this._fullyvisible.slice(1).add(this._visible.last())}),this._animate(r,i,s),this},_animate:function(i,s,e){if(e=e||t.noop,!1===this._trigger("animate"))return e.call(this,!1),this;this.animating=!0;var r=this.options("animation"),n=t.proxy(function(){this.animating=!1;var t=this.list().find("[data-jcarousel-clone]");t.length>0&&(t.remove(),this._reload()),this._trigger("animateend"),e.call(this,!0)},this),o="object"==typeof r?t.extend({},r):{duration:r},l=o.complete||t.noop;return s===!1?o.duration=0:t.fx.speeds[o.duration]!==void 0&&(o.duration=t.fx.speeds[o.duration]),o.complete=function(){n(),l.call(this)},this.move(i,o),this},_prepare:function(i){var e,r,n,o,l=this.index(i),a=l,h=this.dimension(i),u=this.clipping(),c=this.vertical?"bottom":this.rtl?"left":"right",f=this.options("center"),d={target:i,first:i,last:i,visible:i,fullyvisible:u>=h?i:t()};if(f&&(h/=2,u/=2),u>h)for(;;){if(e=this.items().eq(++a),0===e.length){if(!this.circular)break;if(e=this.items().eq(0),i.get(0)===e.get(0))break;if(r=this._visible.index(e)>=0,r&&e.after(e.clone(!0).attr("data-jcarousel-clone",!0)),this.list().append(e),!r){var _={};_[this.lt]=this.dimension(e),this.moveBy(_)}this._items=null}if(o=this.dimension(e),0===o)break;if(h+=o,d.last=e,d.visible=d.visible.add(e),n=s(e.css("margin-"+c)),u>=h-n&&(d.fullyvisible=d.fullyvisible.add(e)),h>=u)break}if(!this.circular&&!f&&u>h)for(a=l;;){if(0>--a)break;if(e=this.items().eq(a),0===e.length)break;if(o=this.dimension(e),0===o)break;if(h+=o,d.first=e,d.visible=d.visible.add(e),n=s(e.css("margin-"+c)),u>=h-n&&(d.fullyvisible=d.fullyvisible.add(e)),h>=u)break}return this._update(d),this.tail=0,f||"circular"===this.options("wrap")||"custom"===this.options("wrap")||this.index(d.last)!==this.items().length-1||(h-=s(d.last.css("margin-"+c)),h>u&&(this.tail=h-u)),this},_position:function(t){var i=this._first,s=i.position()[this.lt],e=this.options("center"),r=e?this.clipping()/2-this.dimension(i)/2:0;return this.rtl&&!this.vertical?(s-=this.relative?this.list().width()-this.dimension(i):this.clipping()-this.dimension(i),s+=r):s-=r,!e&&(this.index(t)>this.index(i)||this.inTail)&&this.tail?(s=this.rtl&&!this.vertical?s-this.tail:s+this.tail,this.inTail=!0):this.inTail=!1,-s},_update:function(i){var s,e=this,r={target:this._target||t(),first:this._first||t(),last:this._last||t(),visible:this._visible||t(),fullyvisible:this._fullyvisible||t()},n=this.index(i.first||r.first)<this.index(r.first),o=function(s){var o=[],l=[];i[s].each(function(){0>r[s].index(this)&&o.push(this)}),r[s].each(function(){0>i[s].index(this)&&l.push(this)}),n?o=o.reverse():l=l.reverse(),e._trigger(s+"in",t(o)),e._trigger(s+"out",t(l)),e["_"+s]=i[s]};for(s in i)o(s);return this}})}(jQuery,window),function(t){"use strict";t.jcarousel.fn.scrollIntoView=function(i,s,e){var r,n=t.jCarousel.parseTarget(i),o=this.index(this._fullyvisible.first()),l=this.index(this._fullyvisible.last());if(r=n.relative?0>n.target?Math.max(0,o+n.target):l+n.target:"object"!=typeof n.target?n.target:this.index(n.target),o>r)return this.scroll(r,s,e);if(r>=o&&l>=r)return t.isFunction(e)&&e.call(this,!1),this;for(var a,h=this.items(),u=this.clipping(),c=this.vertical?"bottom":this.rtl?"left":"right",f=0;;){if(a=h.eq(r),0===a.length)break;if(f+=this.dimension(a),f>=u){var d=parseFloat(a.css("margin-"+c))||0;f-d!==u&&r++;break}if(0>=r)break;r--}return this.scroll(r,s,e)}}(jQuery),function(t){"use strict";t.jCarousel.plugin("jcarouselControl",{_options:{target:"+=1",event:"click",method:"scroll"},_active:null,_init:function(){this.onDestroy=t.proxy(function(){this._destroy(),this.carousel().one("jcarousel:createend",t.proxy(this._create,this))},this),this.onReload=t.proxy(this._reload,this),this.onEvent=t.proxy(function(i){i.preventDefault();var s=this.options("method");t.isFunction(s)?s.call(this):this.carousel().jcarousel(this.options("method"),this.options("target"))},this)},_create:function(){this.carousel().one("jcarousel:destroy",this.onDestroy).on("jcarousel:reloadend jcarousel:scrollend",this.onReload),this._element.on(this.options("event")+".jcarouselcontrol",this.onEvent),this._reload()},_destroy:function(){this._element.off(".jcarouselcontrol",this.onEvent),this.carousel().off("jcarousel:destroy",this.onDestroy).off("jcarousel:reloadend jcarousel:scrollend",this.onReload)},_reload:function(){var i,s=t.jCarousel.parseTarget(this.options("target")),e=this.carousel();if(s.relative)i=e.jcarousel(s.target>0?"hasNext":"hasPrev");else{var r="object"!=typeof s.target?e.jcarousel("items").eq(s.target):s.target;i=e.jcarousel("target").index(r)>=0}return this._active!==i&&(this._trigger(i?"active":"inactive"),this._active=i),this}})}(jQuery),function(t){"use strict";t.jCarousel.plugin("jcarouselPagination",{_options:{perPage:null,item:function(t){return'<a href="#'+t+'">'+t+"</a>"},event:"click",method:"scroll"},_carouselItems:null,_pages:{},_items:{},_currentPage:null,_init:function(){this.onDestroy=t.proxy(function(){this._destroy(),this.carousel().one("jcarousel:createend",t.proxy(this._create,this))},this),this.onReload=t.proxy(this._reload,this),this.onScroll=t.proxy(this._update,this)},_create:function(){this.carousel().one("jcarousel:destroy",this.onDestroy).on("jcarousel:reloadend",this.onReload).on("jcarousel:scrollend",this.onScroll),this._reload()},_destroy:function(){this._clear(),this.carousel().off("jcarousel:destroy",this.onDestroy).off("jcarousel:reloadend",this.onReload).off("jcarousel:scrollend",this.onScroll),this._carouselItems=null},_reload:function(){var i=this.options("perPage");if(this._pages={},this._items={},t.isFunction(i)&&(i=i.call(this)),null==i)this._pages=this._calculatePages();else for(var s,e=parseInt(i,10)||0,r=this._getCarouselItems(),n=1,o=0;;){if(s=r.eq(o++),0===s.length)break;this._pages[n]=this._pages[n]?this._pages[n].add(s):s,0===o%e&&n++}this._clear();var l=this,a=this.carousel().data("jcarousel"),h=this._element,u=this.options("item"),c=this._getCarouselItems().length;t.each(this._pages,function(i,s){var e=l._items[i]=t(u.call(l,i,s));e.on(l.options("event")+".jcarouselpagination",t.proxy(function(){var t=s.eq(0);if(a.circular){var e=a.index(a.target()),r=a.index(t);parseFloat(i)>parseFloat(l._currentPage)?e>r&&(t="+="+(c-e+r)):r>e&&(t="-="+(e+(c-r)))}a[this.options("method")](t)},l)),h.append(e)}),this._update()},_update:function(){var i,s=this.carousel().jcarousel("target");t.each(this._pages,function(t,e){return e.each(function(){return s.is(this)?(i=t,!1):void 0}),i?!1:void 0}),this._currentPage!==i&&(this._trigger("inactive",this._items[this._currentPage]),this._trigger("active",this._items[i])),this._currentPage=i},items:function(){return this._items},reloadCarouselItems:function(){return this._carouselItems=null,this},_clear:function(){this._element.empty(),this._currentPage=null},_calculatePages:function(){for(var t,i=this.carousel().data("jcarousel"),s=this._getCarouselItems(),e=i.clipping(),r=0,n=0,o=1,l={};;){if(t=s.eq(n++),0===t.length)break;l[o]=l[o]?l[o].add(t):t,r+=i.dimension(t),r>=e&&(o++,r=0)}return l},_getCarouselItems:function(){return this._carouselItems||(this._carouselItems=this.carousel().jcarousel("items")),this._carouselItems}})}(jQuery),function(t){"use strict";t.jCarousel.plugin("jcarouselAutoscroll",{_options:{target:"+=1",interval:3e3,autostart:!0},_timer:null,_init:function(){this.onDestroy=t.proxy(function(){this._destroy(),this.carousel().one("jcarousel:createend",t.proxy(this._create,this))},this),this.onAnimateEnd=t.proxy(this.start,this)},_create:function(){this.carousel().one("jcarousel:destroy",this.onDestroy),this.options("autostart")&&this.start()},_destroy:function(){this.stop(),this.carousel().off("jcarousel:destroy",this.onDestroy)},start:function(){return this.stop(),this.carousel().one("jcarousel:animateend",this.onAnimateEnd),this._timer=setTimeout(t.proxy(function(){this.carousel().jcarousel("scroll",this.options("target"))},this),this.options("interval")),this},stop:function(){return this._timer&&(this._timer=clearTimeout(this._timer)),this.carousel().off("jcarousel:animateend",this.onAnimateEnd),this}})}(jQuery);
/*! jQuery Validation Plugin - v1.19.1 - 6/15/2019
 * https://jqueryvalidation.org/
 * Copyright (c) 2019 Jörn Zaefferer; Licensed MIT */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){a.extend(a.fn,{validate:function(b){if(!this.length)return void(b&&b.debug&&window.console&&console.warn("Nothing selected, can't validate, returning nothing."));var c=a.data(this[0],"validator");return c?c:(this.attr("novalidate","novalidate"),c=new a.validator(b,this[0]),a.data(this[0],"validator",c),c.settings.onsubmit&&(this.on("click.validate",":submit",function(b){c.submitButton=b.currentTarget,a(this).hasClass("cancel")&&(c.cancelSubmit=!0),void 0!==a(this).attr("formnovalidate")&&(c.cancelSubmit=!0)}),this.on("submit.validate",function(b){function d(){var d,e;return c.submitButton&&(c.settings.submitHandler||c.formSubmitted)&&(d=a("<input type='hidden'/>").attr("name",c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)),!(c.settings.submitHandler&&!c.settings.debug)||(e=c.settings.submitHandler.call(c,c.currentForm,b),d&&d.remove(),void 0!==e&&e)}return c.settings.debug&&b.preventDefault(),c.cancelSubmit?(c.cancelSubmit=!1,d()):c.form()?c.pendingRequest?(c.formSubmitted=!0,!1):d():(c.focusInvalid(),!1)})),c)},valid:function(){var b,c,d;return a(this[0]).is("form")?b=this.validate().form():(d=[],b=!0,c=a(this[0].form).validate(),this.each(function(){b=c.element(this)&&b,b||(d=d.concat(c.errorList))}),c.errorList=d),b},rules:function(b,c){var d,e,f,g,h,i,j=this[0],k="undefined"!=typeof this.attr("contenteditable")&&"false"!==this.attr("contenteditable");if(null!=j&&(!j.form&&k&&(j.form=this.closest("form")[0],j.name=this.attr("name")),null!=j.form)){if(b)switch(d=a.data(j.form,"validator").settings,e=d.rules,f=a.validator.staticRules(j),b){case"add":a.extend(f,a.validator.normalizeRule(c)),delete f.messages,e[j.name]=f,c.messages&&(d.messages[j.name]=a.extend(d.messages[j.name],c.messages));break;case"remove":return c?(i={},a.each(c.split(/\s/),function(a,b){i[b]=f[b],delete f[b]}),i):(delete e[j.name],f)}return g=a.validator.normalizeRules(a.extend({},a.validator.classRules(j),a.validator.attributeRules(j),a.validator.dataRules(j),a.validator.staticRules(j)),j),g.required&&(h=g.required,delete g.required,g=a.extend({required:h},g)),g.remote&&(h=g.remote,delete g.remote,g=a.extend(g,{remote:h})),g}}}),a.extend(a.expr.pseudos||a.expr[":"],{blank:function(b){return!a.trim(""+a(b).val())},filled:function(b){var c=a(b).val();return null!==c&&!!a.trim(""+c)},unchecked:function(b){return!a(b).prop("checked")}}),a.validator=function(b,c){this.settings=a.extend(!0,{},a.validator.defaults,b),this.currentForm=c,this.init()},a.validator.format=function(b,c){return 1===arguments.length?function(){var c=a.makeArray(arguments);return c.unshift(b),a.validator.format.apply(this,c)}:void 0===c?b:(arguments.length>2&&c.constructor!==Array&&(c=a.makeArray(arguments).slice(1)),c.constructor!==Array&&(c=[c]),a.each(c,function(a,c){b=b.replace(new RegExp("\\{"+a+"\\}","g"),function(){return c})}),b)},a.extend(a.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",pendingClass:"pending",validClass:"valid",errorElement:"label",focusCleanup:!1,focusInvalid:!0,errorContainer:a([]),errorLabelContainer:a([]),onsubmit:!0,ignore:":hidden",ignoreTitle:!1,onfocusin:function(a){this.lastActive=a,this.settings.focusCleanup&&(this.settings.unhighlight&&this.settings.unhighlight.call(this,a,this.settings.errorClass,this.settings.validClass),this.hideThese(this.errorsFor(a)))},onfocusout:function(a){this.checkable(a)||!(a.name in this.submitted)&&this.optional(a)||this.element(a)},onkeyup:function(b,c){var d=[16,17,18,20,35,36,37,38,39,40,45,144,225];9===c.which&&""===this.elementValue(b)||a.inArray(c.keyCode,d)!==-1||(b.name in this.submitted||b.name in this.invalid)&&this.element(b)},onclick:function(a){a.name in this.submitted?this.element(a):a.parentNode.name in this.submitted&&this.element(a.parentNode)},highlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).addClass(c).removeClass(d):a(b).addClass(c).removeClass(d)},unhighlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).removeClass(c).addClass(d):a(b).removeClass(c).addClass(d)}},setDefaults:function(b){a.extend(a.validator.defaults,b)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",equalTo:"Please enter the same value again.",maxlength:a.validator.format("Please enter no more than {0} characters."),minlength:a.validator.format("Please enter at least {0} characters."),rangelength:a.validator.format("Please enter a value between {0} and {1} characters long."),range:a.validator.format("Please enter a value between {0} and {1}."),max:a.validator.format("Please enter a value less than or equal to {0}."),min:a.validator.format("Please enter a value greater than or equal to {0}."),step:a.validator.format("Please enter a multiple of {0}.")},autoCreateRanges:!1,prototype:{init:function(){function b(b){var c="undefined"!=typeof a(this).attr("contenteditable")&&"false"!==a(this).attr("contenteditable");if(!this.form&&c&&(this.form=a(this).closest("form")[0],this.name=a(this).attr("name")),d===this.form){var e=a.data(this.form,"validator"),f="on"+b.type.replace(/^validate/,""),g=e.settings;g[f]&&!a(this).is(g.ignore)&&g[f].call(e,this,b)}}this.labelContainer=a(this.settings.errorLabelContainer),this.errorContext=this.labelContainer.length&&this.labelContainer||a(this.currentForm),this.containers=a(this.settings.errorContainer).add(this.settings.errorLabelContainer),this.submitted={},this.valueCache={},this.pendingRequest=0,this.pending={},this.invalid={},this.reset();var c,d=this.currentForm,e=this.groups={};a.each(this.settings.groups,function(b,c){"string"==typeof c&&(c=c.split(/\s/)),a.each(c,function(a,c){e[c]=b})}),c=this.settings.rules,a.each(c,function(b,d){c[b]=a.validator.normalizeRule(d)}),a(this.currentForm).on("focusin.validate focusout.validate keyup.validate",":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable], [type='button']",b).on("click.validate","select, option, [type='radio'], [type='checkbox']",b),this.settings.invalidHandler&&a(this.currentForm).on("invalid-form.validate",this.settings.invalidHandler)},form:function(){return this.checkForm(),a.extend(this.submitted,this.errorMap),this.invalid=a.extend({},this.errorMap),this.valid()||a(this.currentForm).triggerHandler("invalid-form",[this]),this.showErrors(),this.valid()},checkForm:function(){this.prepareForm();for(var a=0,b=this.currentElements=this.elements();b[a];a++)this.check(b[a]);return this.valid()},element:function(b){var c,d,e=this.clean(b),f=this.validationTargetFor(e),g=this,h=!0;return void 0===f?delete this.invalid[e.name]:(this.prepareElement(f),this.currentElements=a(f),d=this.groups[f.name],d&&a.each(this.groups,function(a,b){b===d&&a!==f.name&&(e=g.validationTargetFor(g.clean(g.findByName(a))),e&&e.name in g.invalid&&(g.currentElements.push(e),h=g.check(e)&&h))}),c=this.check(f)!==!1,h=h&&c,c?this.invalid[f.name]=!1:this.invalid[f.name]=!0,this.numberOfInvalids()||(this.toHide=this.toHide.add(this.containers)),this.showErrors(),a(b).attr("aria-invalid",!c)),h},showErrors:function(b){if(b){var c=this;a.extend(this.errorMap,b),this.errorList=a.map(this.errorMap,function(a,b){return{message:a,element:c.findByName(b)[0]}}),this.successList=a.grep(this.successList,function(a){return!(a.name in b)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){a.fn.resetForm&&a(this.currentForm).resetForm(),this.invalid={},this.submitted={},this.prepareForm(),this.hideErrors();var b=this.elements().removeData("previousValue").removeAttr("aria-invalid");this.resetElements(b)},resetElements:function(a){var b;if(this.settings.unhighlight)for(b=0;a[b];b++)this.settings.unhighlight.call(this,a[b],this.settings.errorClass,""),this.findByName(a[b].name).removeClass(this.settings.validClass);else a.removeClass(this.settings.errorClass).removeClass(this.settings.validClass)},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(a){var b,c=0;for(b in a)void 0!==a[b]&&null!==a[b]&&a[b]!==!1&&c++;return c},hideErrors:function(){this.hideThese(this.toHide)},hideThese:function(a){a.not(this.containers).text(""),this.addWrapper(a).hide()},valid:function(){return 0===this.size()},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{a(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").trigger("focus").trigger("focusin")}catch(b){}},findLastActive:function(){var b=this.lastActive;return b&&1===a.grep(this.errorList,function(a){return a.element.name===b.name}).length&&b},elements:function(){var b=this,c={};return a(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function(){var d=this.name||a(this).attr("name"),e="undefined"!=typeof a(this).attr("contenteditable")&&"false"!==a(this).attr("contenteditable");return!d&&b.settings.debug&&window.console&&console.error("%o has no name assigned",this),e&&(this.form=a(this).closest("form")[0],this.name=d),this.form===b.currentForm&&(!(d in c||!b.objectLength(a(this).rules()))&&(c[d]=!0,!0))})},clean:function(b){return a(b)[0]},errors:function(){var b=this.settings.errorClass.split(" ").join(".");return a(this.settings.errorElement+"."+b,this.errorContext)},resetInternals:function(){this.successList=[],this.errorList=[],this.errorMap={},this.toShow=a([]),this.toHide=a([])},reset:function(){this.resetInternals(),this.currentElements=a([])},prepareForm:function(){this.reset(),this.toHide=this.errors().add(this.containers)},prepareElement:function(a){this.reset(),this.toHide=this.errorsFor(a)},elementValue:function(b){var c,d,e=a(b),f=b.type,g="undefined"!=typeof e.attr("contenteditable")&&"false"!==e.attr("contenteditable");return"radio"===f||"checkbox"===f?this.findByName(b.name).filter(":checked").val():"number"===f&&"undefined"!=typeof b.validity?b.validity.badInput?"NaN":e.val():(c=g?e.text():e.val(),"file"===f?"C:\\fakepath\\"===c.substr(0,12)?c.substr(12):(d=c.lastIndexOf("/"),d>=0?c.substr(d+1):(d=c.lastIndexOf("\\"),d>=0?c.substr(d+1):c)):"string"==typeof c?c.replace(/\r/g,""):c)},check:function(b){b=this.validationTargetFor(this.clean(b));var c,d,e,f,g=a(b).rules(),h=a.map(g,function(a,b){return b}).length,i=!1,j=this.elementValue(b);"function"==typeof g.normalizer?f=g.normalizer:"function"==typeof this.settings.normalizer&&(f=this.settings.normalizer),f&&(j=f.call(b,j),delete g.normalizer);for(d in g){e={method:d,parameters:g[d]};try{if(c=a.validator.methods[d].call(this,j,b,e.parameters),"dependency-mismatch"===c&&1===h){i=!0;continue}if(i=!1,"pending"===c)return void(this.toHide=this.toHide.not(this.errorsFor(b)));if(!c)return this.formatAndAdd(b,e),!1}catch(k){throw this.settings.debug&&window.console&&console.log("Exception occurred when checking element "+b.id+", check the '"+e.method+"' method.",k),k instanceof TypeError&&(k.message+=".  Exception occurred when checking element "+b.id+", check the '"+e.method+"' method."),k}}if(!i)return this.objectLength(g)&&this.successList.push(b),!0},customDataMessage:function(b,c){return a(b).data("msg"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase())||a(b).data("msg")},customMessage:function(a,b){var c=this.settings.messages[a];return c&&(c.constructor===String?c:c[b])},findDefined:function(){for(var a=0;a<arguments.length;a++)if(void 0!==arguments[a])return arguments[a]},defaultMessage:function(b,c){"string"==typeof c&&(c={method:c});var d=this.findDefined(this.customMessage(b.name,c.method),this.customDataMessage(b,c.method),!this.settings.ignoreTitle&&b.title||void 0,a.validator.messages[c.method],"<strong>Warning: No message defined for "+b.name+"</strong>"),e=/\$?\{(\d+)\}/g;return"function"==typeof d?d=d.call(this,c.parameters,b):e.test(d)&&(d=a.validator.format(d.replace(e,"{$1}"),c.parameters)),d},formatAndAdd:function(a,b){var c=this.defaultMessage(a,b);this.errorList.push({message:c,element:a,method:b.method}),this.errorMap[a.name]=c,this.submitted[a.name]=c},addWrapper:function(a){return this.settings.wrapper&&(a=a.add(a.parent(this.settings.wrapper))),a},defaultShowErrors:function(){var a,b,c;for(a=0;this.errorList[a];a++)c=this.errorList[a],this.settings.highlight&&this.settings.highlight.call(this,c.element,this.settings.errorClass,this.settings.validClass),this.showLabel(c.element,c.message);if(this.errorList.length&&(this.toShow=this.toShow.add(this.containers)),this.settings.success)for(a=0;this.successList[a];a++)this.showLabel(this.successList[a]);if(this.settings.unhighlight)for(a=0,b=this.validElements();b[a];a++)this.settings.unhighlight.call(this,b[a],this.settings.errorClass,this.settings.validClass);this.toHide=this.toHide.not(this.toShow),this.hideErrors(),this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return a(this.errorList).map(function(){return this.element})},showLabel:function(b,c){var d,e,f,g,h=this.errorsFor(b),i=this.idOrName(b),j=a(b).attr("aria-describedby");h.length?(h.removeClass(this.settings.validClass).addClass(this.settings.errorClass),h.html(c)):(h=a("<"+this.settings.errorElement+">").attr("id",i+"-error").addClass(this.settings.errorClass).html(c||""),d=h,this.settings.wrapper&&(d=h.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()),this.labelContainer.length?this.labelContainer.append(d):this.settings.errorPlacement?this.settings.errorPlacement.call(this,d,a(b)):d.insertAfter(b),h.is("label")?h.attr("for",i):0===h.parents("label[for='"+this.escapeCssMeta(i)+"']").length&&(f=h.attr("id"),j?j.match(new RegExp("\\b"+this.escapeCssMeta(f)+"\\b"))||(j+=" "+f):j=f,a(b).attr("aria-describedby",j),e=this.groups[b.name],e&&(g=this,a.each(g.groups,function(b,c){c===e&&a("[name='"+g.escapeCssMeta(b)+"']",g.currentForm).attr("aria-describedby",h.attr("id"))})))),!c&&this.settings.success&&(h.text(""),"string"==typeof this.settings.success?h.addClass(this.settings.success):this.settings.success(h,b)),this.toShow=this.toShow.add(h)},errorsFor:function(b){var c=this.escapeCssMeta(this.idOrName(b)),d=a(b).attr("aria-describedby"),e="label[for='"+c+"'], label[for='"+c+"'] *";return d&&(e=e+", #"+this.escapeCssMeta(d).replace(/\s+/g,", #")),this.errors().filter(e)},escapeCssMeta:function(a){return a.replace(/([\\!"#$%&'()*+,.\/:;<=>?@\[\]^`{|}~])/g,"\\$1")},idOrName:function(a){return this.groups[a.name]||(this.checkable(a)?a.name:a.id||a.name)},validationTargetFor:function(b){return this.checkable(b)&&(b=this.findByName(b.name)),a(b).not(this.settings.ignore)[0]},checkable:function(a){return/radio|checkbox/i.test(a.type)},findByName:function(b){return a(this.currentForm).find("[name='"+this.escapeCssMeta(b)+"']")},getLength:function(b,c){switch(c.nodeName.toLowerCase()){case"select":return a("option:selected",c).length;case"input":if(this.checkable(c))return this.findByName(c.name).filter(":checked").length}return b.length},depend:function(a,b){return!this.dependTypes[typeof a]||this.dependTypes[typeof a](a,b)},dependTypes:{"boolean":function(a){return a},string:function(b,c){return!!a(b,c.form).length},"function":function(a,b){return a(b)}},optional:function(b){var c=this.elementValue(b);return!a.validator.methods.required.call(this,c,b)&&"dependency-mismatch"},startRequest:function(b){this.pending[b.name]||(this.pendingRequest++,a(b).addClass(this.settings.pendingClass),this.pending[b.name]=!0)},stopRequest:function(b,c){this.pendingRequest--,this.pendingRequest<0&&(this.pendingRequest=0),delete this.pending[b.name],a(b).removeClass(this.settings.pendingClass),c&&0===this.pendingRequest&&this.formSubmitted&&this.form()?(a(this.currentForm).submit(),this.submitButton&&a("input:hidden[name='"+this.submitButton.name+"']",this.currentForm).remove(),this.formSubmitted=!1):!c&&0===this.pendingRequest&&this.formSubmitted&&(a(this.currentForm).triggerHandler("invalid-form",[this]),this.formSubmitted=!1)},previousValue:function(b,c){return c="string"==typeof c&&c||"remote",a.data(b,"previousValue")||a.data(b,"previousValue",{old:null,valid:!0,message:this.defaultMessage(b,{method:c})})},destroy:function(){this.resetForm(),a(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur").find(".validate-lessThan-blur").off(".validate-lessThan").removeClass("validate-lessThan-blur").find(".validate-lessThanEqual-blur").off(".validate-lessThanEqual").removeClass("validate-lessThanEqual-blur").find(".validate-greaterThanEqual-blur").off(".validate-greaterThanEqual").removeClass("validate-greaterThanEqual-blur").find(".validate-greaterThan-blur").off(".validate-greaterThan").removeClass("validate-greaterThan-blur")}},classRuleSettings:{required:{required:!0},email:{email:!0},url:{url:!0},date:{date:!0},dateISO:{dateISO:!0},number:{number:!0},digits:{digits:!0},creditcard:{creditcard:!0}},addClassRules:function(b,c){b.constructor===String?this.classRuleSettings[b]=c:a.extend(this.classRuleSettings,b)},classRules:function(b){var c={},d=a(b).attr("class");return d&&a.each(d.split(" "),function(){this in a.validator.classRuleSettings&&a.extend(c,a.validator.classRuleSettings[this])}),c},normalizeAttributeRule:function(a,b,c,d){/min|max|step/.test(c)&&(null===b||/number|range|text/.test(b))&&(d=Number(d),isNaN(d)&&(d=void 0)),d||0===d?a[c]=d:b===c&&"range"!==b&&(a[c]=!0)},attributeRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)"required"===c?(d=b.getAttribute(c),""===d&&(d=!0),d=!!d):d=f.attr(c),this.normalizeAttributeRule(e,g,c,d);return e.maxlength&&/-1|2147483647|524288/.test(e.maxlength)&&delete e.maxlength,e},dataRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)d=f.data("rule"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase()),""===d&&(d=!0),this.normalizeAttributeRule(e,g,c,d);return e},staticRules:function(b){var c={},d=a.data(b.form,"validator");return d.settings.rules&&(c=a.validator.normalizeRule(d.settings.rules[b.name])||{}),c},normalizeRules:function(b,c){return a.each(b,function(d,e){if(e===!1)return void delete b[d];if(e.param||e.depends){var f=!0;switch(typeof e.depends){case"string":f=!!a(e.depends,c.form).length;break;case"function":f=e.depends.call(c,c)}f?b[d]=void 0===e.param||e.param:(a.data(c.form,"validator").resetElements(a(c)),delete b[d])}}),a.each(b,function(d,e){b[d]=a.isFunction(e)&&"normalizer"!==d?e(c):e}),a.each(["minlength","maxlength"],function(){b[this]&&(b[this]=Number(b[this]))}),a.each(["rangelength","range"],function(){var c;b[this]&&(a.isArray(b[this])?b[this]=[Number(b[this][0]),Number(b[this][1])]:"string"==typeof b[this]&&(c=b[this].replace(/[\[\]]/g,"").split(/[\s,]+/),b[this]=[Number(c[0]),Number(c[1])]))}),a.validator.autoCreateRanges&&(null!=b.min&&null!=b.max&&(b.range=[b.min,b.max],delete b.min,delete b.max),null!=b.minlength&&null!=b.maxlength&&(b.rangelength=[b.minlength,b.maxlength],delete b.minlength,delete b.maxlength)),b},normalizeRule:function(b){if("string"==typeof b){var c={};a.each(b.split(/\s/),function(){c[this]=!0}),b=c}return b},addMethod:function(b,c,d){a.validator.methods[b]=c,a.validator.messages[b]=void 0!==d?d:a.validator.messages[b],c.length<3&&a.validator.addClassRules(b,a.validator.normalizeRule(b))},methods:{required:function(b,c,d){if(!this.depend(d,c))return"dependency-mismatch";if("select"===c.nodeName.toLowerCase()){var e=a(c).val();return e&&e.length>0}return this.checkable(c)?this.getLength(b,c)>0:void 0!==b&&null!==b&&b.length>0},email:function(a,b){return this.optional(b)||/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(a)},url:function(a,b){return this.optional(b)||/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i.test(a)},date:function(){var a=!1;return function(b,c){return a||(a=!0,this.settings.debug&&window.console&&console.warn("The `date` method is deprecated and will be removed in version '2.0.0'.\nPlease don't use it, since it relies on the Date constructor, which\nbehaves very differently across browsers and locales. Use `dateISO`\ninstead or one of the locale specific methods in `localizations/`\nand `additional-methods.js`.")),this.optional(c)||!/Invalid|NaN/.test(new Date(b).toString())}}(),dateISO:function(a,b){return this.optional(b)||/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(a)},number:function(a,b){return this.optional(b)||/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)},digits:function(a,b){return this.optional(b)||/^\d+$/.test(a)},minlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d},maxlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e<=d},rangelength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d[0]&&e<=d[1]},min:function(a,b,c){return this.optional(b)||a>=c},max:function(a,b,c){return this.optional(b)||a<=c},range:function(a,b,c){return this.optional(b)||a>=c[0]&&a<=c[1]},step:function(b,c,d){var e,f=a(c).attr("type"),g="Step attribute on input type "+f+" is not supported.",h=["text","number","range"],i=new RegExp("\\b"+f+"\\b"),j=f&&!i.test(h.join()),k=function(a){var b=(""+a).match(/(?:\.(\d+))?$/);return b&&b[1]?b[1].length:0},l=function(a){return Math.round(a*Math.pow(10,e))},m=!0;if(j)throw new Error(g);return e=k(d),(k(b)>e||l(b)%l(d)!==0)&&(m=!1),this.optional(c)||m},equalTo:function(b,c,d){var e=a(d);return this.settings.onfocusout&&e.not(".validate-equalTo-blur").length&&e.addClass("validate-equalTo-blur").on("blur.validate-equalTo",function(){a(c).valid()}),b===e.val()},remote:function(b,c,d,e){if(this.optional(c))return"dependency-mismatch";e="string"==typeof e&&e||"remote";var f,g,h,i=this.previousValue(c,e);return this.settings.messages[c.name]||(this.settings.messages[c.name]={}),i.originalMessage=i.originalMessage||this.settings.messages[c.name][e],this.settings.messages[c.name][e]=i.message,d="string"==typeof d&&{url:d}||d,h=a.param(a.extend({data:b},d.data)),i.old===h?i.valid:(i.old=h,f=this,this.startRequest(c),g={},g[c.name]=b,a.ajax(a.extend(!0,{mode:"abort",port:"validate"+c.name,dataType:"json",data:g,context:f.currentForm,success:function(a){var d,g,h,j=a===!0||"true"===a;f.settings.messages[c.name][e]=i.originalMessage,j?(h=f.formSubmitted,f.resetInternals(),f.toHide=f.errorsFor(c),f.formSubmitted=h,f.successList.push(c),f.invalid[c.name]=!1,f.showErrors()):(d={},g=a||f.defaultMessage(c,{method:e,parameters:b}),d[c.name]=i.message=g,f.invalid[c.name]=!0,f.showErrors(d)),i.valid=j,f.stopRequest(c,j)}},d)),"pending")}}});var b,c={};return a.ajaxPrefilter?a.ajaxPrefilter(function(a,b,d){var e=a.port;"abort"===a.mode&&(c[e]&&c[e].abort(),c[e]=d)}):(b=a.ajax,a.ajax=function(d){var e=("mode"in d?d:a.ajaxSettings).mode,f=("port"in d?d:a.ajaxSettings).port;return"abort"===e?(c[f]&&c[f].abort(),c[f]=b.apply(this,arguments),c[f]):b.apply(this,arguments)}),a});
(function(d,f,g,b){var e="tooltipster",c={animation:"fade",arrow:true,arrowColor:"",content:"",delay:200,fixedWidth:0,maxWidth:0,functionBefore:function(l,m){m()},functionAfter:function(l){},icon:"(?)",iconDesktop:false,iconTouch:false,iconTheme:".tooltipster-icon",interactive:false,interactiveTolerance:350,offsetX:0,offsetY:0,onlyOne:true,position:"top",speed:350,timer:0,theme:".tooltipster-default",touchDevices:true,trigger:"hover"};var deviceme = ''; var toolipmask = '';if(jQuery(window).width() > 760){deviceme = '<div class="tooltipster-arrowbg"></div>'; toolipmask = "<div class='tooltipster-mask'></div>"}function h(m,l){this.element=m;this.options=d.extend({},c,l);this._defaults=c;this._name=e;this.init()}function j(){return !!("ontouchstart" in f)}function a(){var l=g.body||g.documentElement;var n=l.style;var o="transition";if(typeof n[o]=="string"){return true}v=["Moz","Webkit","Khtml","O","ms"],o=o.charAt(0).toUpperCase()+o.substr(1);for(var m=0;m<v.length;m++){if(typeof n[v[m]+o]=="string"){return true}}return false}var k=true;if(!a()){k=false}h.prototype={init:function(){var r=d(this.element);var n=this;var q=true;if((n.options.touchDevices==false)&&(j())){q=false}if(g.all&&!g.querySelector){q=false}if(q==true){if((this.options.iconDesktop==true)&&(!j())||((this.options.iconTouch==true)&&(j()))){var m=r.attr("title");r.removeAttr("title");var p=n.options.iconTheme;var o=d('<span class="'+p.replace(".","")+'" title="'+m+'">'+this.options.icon+"</span>");o.insertAfter(r);r.data("tooltipsterIcon",o);r=o}var l=d.trim(n.options.content).length>0?n.options.content:r.attr("title");r.data("tooltipsterContent",l);r.removeAttr("title");if((this.options.touchDevices==true)&&(j())){r.bind("touchstart",function(t,s){n.showTooltip()})}else{if(this.options.trigger=="hover"){r.mouseenter(function(){n.showTooltip()});if(this.options.interactive==true){r.mouseleave(function(){var t=r.data("tooltipster");var u=false;if((t!==b)&&(t!=="")){t.mouseenter(function(){u=true});t.mouseleave(function(){u=false});var s=setTimeout(function(){if(u==true){t.mouseleave(function(){n.hideTooltip()})}else{n.hideTooltip()}},n.options.interactiveTolerance)}else{n.hideTooltip()}})}else{r.mouseleave(function(){n.hideTooltip()})}}if(this.options.trigger=="click"){r.click(function(){if((r.data("tooltipster")=="")||(r.data("tooltipster")==b)){n.showTooltip()}else{n.hideTooltip()}})}}}},showTooltip:function(m){var n=d(this.element);var l=this;if(n.data("tooltipsterIcon")!==b){n=n.data("tooltipsterIcon")}if((d(".tooltipster-base").not(".tooltipster-dying").length>0)&&(l.options.onlyOne==true)){d(".tooltipster-base").not(".tooltipster-dying").each(function(){if(n.data("tooltipster")!==d(this)){d(this).addClass("tooltipster-kill");var o=d(this).data("origin");o.data("plugin_tooltipster").hideTooltip()}})}n.clearQueue().delay(l.options.delay).queue(function(){l.options.functionBefore(n,function(){if((n.data("tooltipster")!==b)&&(n.data("tooltipster")!=="")){var ad=n.data("tooltipster");if(!ad.hasClass("tooltipster-kill")){var aj="tooltipster-"+l.options.animation;ad.removeClass("tooltipster-dying");if(k==true){ad.clearQueue().addClass(aj+"-show")}if(l.options.timer>0){var N=ad.data("tooltipsterTimer");clearTimeout(N);N=setTimeout(function(){ad.data("tooltipsterTimer",b);l.hideTooltip()},l.options.timer);ad.data("tooltipsterTimer",N)}if((l.options.touchDevices==true)&&(j())){d("body").bind("touchstart",function(ak){if(l.options.interactive==true){var am=d(ak.target);var al=true;am.parents().each(function(){if(d(this).hasClass("tooltipster-base")){al=false}});if(al==true){l.hideTooltip();d("body").unbind("touchstart")}}else{l.hideTooltip();d("body").unbind("touchstart")}})}}}else{d("body").css("overflow-x","hidden");var y=n.data("tooltipsterContent");var P=l.options.theme;var U=P.replace(".","");var aj="tooltipster-"+l.options.animation;var G="-webkit-transition-duration: "+l.options.speed+"ms; -webkit-animation-duration: "+l.options.speed+"ms; -moz-transition-duration: "+l.options.speed+"ms; -moz-animation-duration: "+l.options.speed+"ms; -o-transition-duration: "+l.options.speed+"ms; -o-animation-duration: "+l.options.speed+"ms; -ms-transition-duration: "+l.options.speed+"ms; -ms-animation-duration: "+l.options.speed+"ms; transition-duration: "+l.options.speed+"ms; animation-duration: "+l.options.speed+"ms;";var af=l.options.fixedWidth>0?"width:"+l.options.fixedWidth+"px;":"";var K=l.options.maxWidth>0?"max-width:"+l.options.maxWidth+"px;":"";var M=l.options.interactive==true?"pointer-events: auto;":"";var ad=d('<div class="tooltipster-base '+U+" "+aj+'" style="'+af+" "+K+" "+M+" "+G+'"><div class="tooltipster-content">'+y+"</div></div>");if((jQuery('.tooltipster-mask').length == 0) && (jQuery(window).width() > 760)){jQuery("body").append(toolipmask); } ad.appendTo("body");n.data("tooltipster",ad);ad.data("origin",n);var ae=d(f).width();var A=n.outerWidth(false);var ac=n.outerHeight(false);var ai=ad.outerWidth(false);var o=ad.innerWidth();var I=ad.outerHeight(false);var X=n.offset();var W=X.top;var u=X.left;var x=b;if(n.is("area")){var Q=n.attr("shape");var ab=n.parent().attr("name");var L=d('img[usemap="#'+ab+'"]');var p=L.offset().left;var H=L.offset().top;var S=n.attr("coords")!==b?n.attr("coords").split(","):b;if(Q=="circle"){var J=parseInt(S[0]);var s=parseInt(S[1]);var B=parseInt(S[2]);ac=B*2;A=B*2;W=H+s-B;u=p+J-B}else{if(Q=="rect"){var J=parseInt(S[0]);var s=parseInt(S[1]);var r=parseInt(S[2]);var F=parseInt(S[3]);ac=F-s;A=r-J;W=H+s;u=p+J}else{if(Q=="poly"){var w=[];var aa=[];var E=0,D=0,Z=0,Y=0;var ag="even";for(i=0;i<S.length;i++){var C=parseInt(S[i]);if(ag=="even"){if(C>Z){Z=C;if(i==0){E=Z}}if(C<E){E=C}ag="odd"}else{if(C>Y){Y=C;if(i==1){D=Y}}if(C<D){D=C}ag="even"}}ac=Y-D;A=Z-E;W=H+D;u=p+E}else{ac=L.outerHeight(false);A=L.outerWidth(false);W=H;u=p}}}}if(l.options.fixedWidth==0){ad.css({width:(o+1)+"px","padding-left":"0px","padding-right":"0px"})}var t=0,R=0;var T=parseInt(l.options.offsetY);var V=parseInt(l.options.offsetX);var q="";function O(){function aq(){var aA=d(f).scrollLeft();if((t-aA)<0){var az=t-aA;t=aA;ad.data("arrow-reposition",az)}if(((t+ai)-aA)>ae){var az=t-((ae+aA)-ai);t=(ae+aA)-ai;ad.data("arrow-reposition",az)}}function an(aA,az){if((W-d(f).scrollTop()-I-T-11)<0){l.options.position=aA;x=az}}if(l.options.position=="top"){var av=(u+ai)-(u+A);t=(u+V)-(av/2);R=(W-I)-T-12;aq();an("bottom","top")}if(l.options.position=="top-left"){t=u+V;R=(W-I)-T-12;aq();an("bottom-left","top-left")}if(l.options.position=="top-right"){t=(u+A+V)-ai;R=(W-I)-T-12;aq();an("bottom-right","top-right")}if(l.options.position=="bottom"){var av=(u+ai)-(u+A);t=u-(av/2)+V;R=(W+ac)+T+12;aq()}if(l.options.position=="bottom-left"){t=u+V;R=(W+ac)+T+12;aq()}if(l.options.position=="bottom-right"){t=(u+A+V)-ai;R=(W+ac)+T+12;aq()}if(l.options.position=="left"){t=u-V-ai-12;myLeftMirror=u+V+A+12;var ao=(W+I)-(W+n.outerHeight(false));R=W-(ao/2)-T;if((t<0)&&((myLeftMirror+ai)>ae)){var ak=parseFloat(ad.css("border-width"))*2;var ap=(ai+t)-ak;ad.css("width",ap+"px");I=ad.outerHeight(false);t=u-V-ap-12-ak;ao=(W+I)-(W+n.outerHeight(false));R=W-(ao/2)-T}else{if(t<0){t=u+V+A+12;ad.data("arrow-reposition","left")}}}if(l.options.position=="right"){t=u+V+A+12;myLeftMirror=u-V-ai-12;var ao=(W+I)-(W+n.outerHeight(false));R=W-(ao/2)-T;if(((t+ai)>ae)&&(myLeftMirror<0)){var ak=parseFloat(ad.css("border-width"))*2;var ap=(ae-t)-ak;ad.css("width",ap+"px");I=ad.outerHeight(false);ao=(W+I)-(W+n.outerHeight(false));R=W-(ao/2)-T}else{if((t+ai)>ae){t=u-V-ai-12;ad.data("arrow-reposition","right")}}}if(l.options.arrow==true){var ar="tooltipster-arrow-"+l.options.position;if(l.options.arrowColor.length<1){var at=ad.css("background-color")}else{var at=l.options.arrowColor}var am=ad.data("arrow-reposition");if(!am){am=""}else{if(am=="left"){ar="tooltipster-arrow-right";am=""}else{if(am=="right"){ar="tooltipster-arrow-left";am=""}else{am="left:"+am+"px;"}}}if((l.options.position=="top")||(l.options.position=="top-left")||(l.options.position=="top-right")){var ay=parseFloat(ad.css("border-bottom-width"));var al=ad.css("border-bottom-color")}else{if((l.options.position=="bottom")||(l.options.position=="bottom-left")||(l.options.position=="bottom-right")){var ay=parseFloat(ad.css("border-top-width"));var al=ad.css("border-top-color")}else{if(l.options.position=="left"){var ay=parseFloat(ad.css("border-right-width"));var al=ad.css("border-right-color")}else{if(l.options.position=="right"){var ay=parseFloat(ad.css("border-left-width"));var al=ad.css("border-left-color")}else{var ay=parseFloat(ad.css("border-bottom-width"));var al=ad.css("border-bottom-color")}}}}if(ay>1){ay++}var ax="";if(ay!==0){var aw="";var au="border-color: "+al+";";if(ar.indexOf("bottom")!==-1){aw="margin-top: -"+ay+"px;"}else{if(ar.indexOf("top")!==-1){aw="margin-bottom: -"+ay+"px;"}else{if(ar.indexOf("left")!==-1){aw="margin-right: -"+ay+"px;"}else{if(ar.indexOf("right")!==-1){aw="margin-left: -"+ay+"px;"}}}}ax='<span class="tooltipster-arrow-border" style="'+aw+" "+au+';"></span>'}q='<div class="'+ar+' tooltipster-arrow" style="'+am+'">'+ax+ deviceme +'<span style="border-color:'+at+';"></span></div>'}ad.css({top:R+"px",left:t+"px"})}O();ad.append(q);if(k==true){ad.addClass(aj+"-show")}else{ad.css("display","none").removeClass(aj).fadeIn(l.options.speed)}var z=y;var ah=setInterval(function(){var ak=n.data("tooltipsterContent");if((z!==ak)&&(ak!=="")){z=ak;ad.find(".tooltipster-content").html(ak);ad.css({width:"","-webkit-transition-duration":l.options.speed+"ms","-moz-transition-duration":l.options.speed+"ms","-o-transition-duration":l.options.speed+"ms","-ms-transition-duration":l.options.speed+"ms","transition-duration":l.options.speed+"ms","-webkit-transition-property":"-webkit-transform","-moz-transition-property":"-moz-transform","-o-transition-property":"-o-transform","-ms-transition-property":"-ms-transform","transition-property":"transform",}).addClass("tooltipster-content-changing");setTimeout(function(){ad.removeClass("tooltipster-content-changing");setTimeout(function(){ad.css({"-webkit-transition-property":"","-moz-transition-property":"","-o-transition-property":"","-ms-transition-property":"","transition-property":""})},l.options.speed)},l.options.speed);ai=ad.outerWidth(false);o=ad.innerWidth();I=ad.outerHeight(false);O()}if(d("body").find(ad).length==0){clearInterval(ah)}},200);if(l.options.timer>0){var N=setTimeout(function(){ad.data("tooltipsterTimer",b);l.hideTooltip()},l.options.timer+l.options.speed);ad.data("tooltipsterTimer",N)}if((l.options.touchDevices==true)&&(j())){d("body").bind("touchstart",function(ak){if(l.options.interactive==true){var am=d(ak.target);var al=true;am.parents().each(function(){if(d(this).hasClass("tooltipster-base")){al=false}});if(al==true){l.hideTooltip();d("body").unbind("touchstart")}}else{l.hideTooltip();d("body").unbind("touchstart")}})}ad.mouseleave(function(){l.hideTooltip()});if(x!==b){l.options.position=x}}});n.dequeue()})},hideTooltip:function(m){var p=d(this.element);var l=this;if(p.data("tooltipsterIcon")!==b){p=p.data("tooltipsterIcon")}var o=p.data("tooltipster");p.clearQueue();if((o!==b)&&(o!=="")){var q=o.data("tooltipsterTimer");if(q!==b){clearTimeout(q)}var n="tooltipster-"+l.options.animation;if(k==true){o.clearQueue().removeClass(n+"-show").addClass("tooltipster-dying").delay(l.options.speed).queue(function(){o.remove();p.data("tooltipster","");d("body").css("verflow-x","");l.options.functionAfter(p)})}else{o.clearQueue().addClass("tooltipster-dying").fadeOut(l.options.speed,function(){o.remove();p.data("tooltipster","");d("body").css("verflow-x","");l.options.functionAfter(p)})}}}};d.fn[e]=function(l){return this.each(function(){if(!d.data(this,"plugin_"+e)){d.data(this,"plugin_"+e,new h(this,l))}var m=d(this).data("plugin_tooltipster").options;if((m.iconDesktop==true)&&(!j())||((m.iconTouch==true)&&(j()))){var n=d(this).data("plugin_tooltipster");d(this).next().data("plugin_tooltipster",n)}})};if(j()){f.addEventListener("orientationchange",function(){if(d(".tooltipster-base").length>0){d(".tooltipster-base").each(function(){var l=d(this).data("origin");l.data("plugin_tooltipster").hideTooltip()})}},false)}})(jQuery,window,document);
/**
 * Owl carousel
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 * @todo Lazy Load Icon
 * @todo prevent animationend bubling
 * @todo itemsScaleUp
 * @todo Test Zepto
 * @todo stagePadding calculate wrong active classes
 */
;(function($, window, document, undefined) {

	var drag, state, e;

	/**
	 * Template for status information about drag and touch events.
	 * @private
	 */
	drag = {
		start: 0,
		startX: 0,
		startY: 0,
		current: 0,
		currentX: 0,
		currentY: 0,
		offsetX: 0,
		offsetY: 0,
		distance: null,
		startTime: 0,
		endTime: 0,
		updatedX: 0,
		targetEl: null
	};

	/**
	 * Template for some status informations.
	 * @private
	 */
	state = {
		isTouch: false,
		isScrolling: false,
		isSwiping: false,
		direction: false,
		inMotion: false
	};

	/**
	 * Event functions references.
	 * @private
	 */
	e = {
		_onDragStart: null,
		_onDragMove: null,
		_onDragEnd: null,
		_transitionEnd: null,
		_resizer: null,
		_responsiveCall: null,
		_goToLoop: null,
		_checkVisibile: null
	};

	/**
	 * Creates a carousel.
	 * @class The Owl Carousel.
	 * @public
	 * @param {HTMLElement|jQuery} element - The element to create the carousel for.
	 * @param {Object} [options] - The options
	 */
	function Owl(element, options) {

		/**
		 * Current settings for the carousel.
		 * @public
		 */
		this.settings = null;

		/**
		 * Current options set by the caller including defaults.
		 * @public
		 */
		this.options = $.extend({}, Owl.Defaults, options);

		/**
		 * Plugin element.
		 * @public
		 */
		this.$element = $(element);

		/**
		 * Caches informations about drag and touch events.
		 */
		this.drag = $.extend({}, drag);

		/**
		 * Caches some status informations.
		 * @protected
		 */
		this.state = $.extend({}, state);

		/**
		 * @protected
		 * @todo Must be documented
		 */
		this.e = $.extend({}, e);

		/**
		 * References to the running plugins of this carousel.
		 * @protected
		 */
		this._plugins = {};

		/**
		 * Currently suppressed events to prevent them from beeing retriggered.
		 * @protected
		 */
		this._supress = {};

		/**
		 * Absolute current position.
		 * @protected
		 */
		this._current = null;

		/**
		 * Animation speed in milliseconds.
		 * @protected
		 */
		this._speed = null;

		/**
		 * Coordinates of all items in pixel.
		 * @todo The name of this member is missleading.
		 * @protected
		 */
		this._coordinates = [];

		/**
		 * Current breakpoint.
		 * @todo Real media queries would be nice.
		 * @protected
		 */
		this._breakpoint = null;

		/**
		 * Current width of the plugin element.
		 */
		this._width = null;

		/**
		 * All real items.
		 * @protected
		 */
		this._items = [];

		/**
		 * All cloned items.
		 * @protected
		 */
		this._clones = [];

		/**
		 * Merge values of all items.
		 * @todo Maybe this could be part of a plugin.
		 * @protected
		 */
		this._mergers = [];

		/**
		 * Invalidated parts within the update process.
		 * @protected
		 */
		this._invalidated = {};

		/**
		 * Ordered list of workers for the update process.
		 * @protected
		 */
		this._pipe = [];

		$.each(Owl.Plugins, $.proxy(function(key, plugin) {
			this._plugins[key[0].toLowerCase() + key.slice(1)]
				= new plugin(this);
		}, this));

		$.each(Owl.Pipe, $.proxy(function(priority, worker) {
			this._pipe.push({
				'filter': worker.filter,
				'run': $.proxy(worker.run, this)
			});
		}, this));

		this.setup();
		this.initialize();
	}

	/**
	 * Default options for the carousel.
	 * @public
	 */
	Owl.Defaults = {
		items: 3,
		loop: false,
		center: false,

		mouseDrag: true,
		touchDrag: true,
		pullDrag: true,
		freeDrag: false,

		margin: 0,
		stagePadding: 0,

		merge: false,
		mergeFit: true,
		autoWidth: false,

		startPosition: 0,
		rtl: false,

		smartSpeed: 250,
		fluidSpeed: false,
		dragEndSpeed: false,

		responsive: {},
		responsiveRefreshRate: 200,
		responsiveBaseElement: window,
		responsiveClass: false,

		fallbackEasing: 'swing',

		info: false,

		nestedItemSelector: false,
		itemElement: 'div',
		stageElement: 'div',

		// Classes and Names
		themeClass: 'owl-theme',
		baseClass: 'owl-carousel',
		itemClass: 'owl-item',
		centerClass: 'center',
		activeClass: 'active'
	};

	/**
	 * Enumeration for width.
	 * @public
	 * @readonly
	 * @enum {String}
	 */
	Owl.Width = {
		Default: 'default',
		Inner: 'inner',
		Outer: 'outer'
	};

	/**
	 * Contains all registered plugins.
	 * @public
	 */
	Owl.Plugins = {};

	/**
	 * Update pipe.
	 */
	Owl.Pipe = [ {
		filter: [ 'width', 'items', 'settings' ],
		run: function(cache) {
			cache.current = this._items && this._items[this.relative(this._current)];
		}
	}, {
		filter: [ 'items', 'settings' ],
		run: function() {
			var cached = this._clones,
				clones = this.$stage.children('.cloned');

			if (clones.length !== cached.length || (!this.settings.loop && cached.length > 0)) {
				this.$stage.children('.cloned').remove();
				this._clones = [];
			}
		}
	}, {
		filter: [ 'items', 'settings' ],
		run: function() {
			var i, n,
				clones = this._clones,
				items = this._items,
				delta = this.settings.loop ? clones.length - Math.max(this.settings.items * 2, 4) : 0;

			for (i = 0, n = Math.abs(delta / 2); i < n; i++) {
				if (delta > 0) {
					this.$stage.children().eq(items.length + clones.length - 1).remove();
					clones.pop();
					this.$stage.children().eq(0).remove();
					clones.pop();
				} else {
					clones.push(clones.length / 2);
					this.$stage.append(items[clones[clones.length - 1]].clone().addClass('cloned'));
					clones.push(items.length - 1 - (clones.length - 1) / 2);
					this.$stage.prepend(items[clones[clones.length - 1]].clone().addClass('cloned'));
				}
			}
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function() {
			var rtl = (this.settings.rtl ? 1 : -1),
				width = (this.width() / this.settings.items).toFixed(3),
				coordinate = 0, merge, i, n;

			this._coordinates = [];
			for (i = 0, n = this._clones.length + this._items.length; i < n; i++) {
				merge = this._mergers[this.relative(i)];
				merge = (this.settings.mergeFit && Math.min(merge, this.settings.items)) || merge;
				coordinate += (this.settings.autoWidth ? this._items[this.relative(i)].width() + this.settings.margin : width * merge) * rtl;

				this._coordinates.push(coordinate);
			}
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function() {
			var i, n, width = (this.width() / this.settings.items).toFixed(3), css = {
				'width': Math.abs(this._coordinates[this._coordinates.length - 1]) + this.settings.stagePadding * 2,
				'padding-left': this.settings.stagePadding || '',
				'padding-right': this.settings.stagePadding || ''
			};

			this.$stage.css(css);

			css = { 'width': this.settings.autoWidth ? 'auto' : width - this.settings.margin };
			css[this.settings.rtl ? 'margin-left' : 'margin-right'] = this.settings.margin;

			if (!this.settings.autoWidth && $.grep(this._mergers, function(v) { return v > 1 }).length > 0) {
				for (i = 0, n = this._coordinates.length; i < n; i++) {
					css.width = Math.abs(this._coordinates[i]) - Math.abs(this._coordinates[i - 1] || 0) - this.settings.margin;
					this.$stage.children().eq(i).css(css);
				}
			} else {
				this.$stage.children().css(css);
			}
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function(cache) {
			cache.current && this.reset(this.$stage.children().index(cache.current));
		}
	}, {
		filter: [ 'position' ],
		run: function() {
			this.animate(this.coordinates(this._current));
		}
	}, {
		filter: [ 'width', 'position', 'items', 'settings' ],
		run: function() {
			var rtl = this.settings.rtl ? 1 : -1,
				padding = this.settings.stagePadding * 2,
				begin = this.coordinates(this.current()) + padding,
				end = begin + this.width() * rtl,
				inner, outer, matches = [], i, n;

			for (i = 0, n = this._coordinates.length; i < n; i++) {
				inner = this._coordinates[i - 1] || 0;
				outer = Math.abs(this._coordinates[i]) + padding * rtl;

				if ((this.op(inner, '<=', begin) && (this.op(inner, '>', end)))
					|| (this.op(outer, '<', begin) && this.op(outer, '>', end))) {
					matches.push(i);
				}
			}

			this.$stage.children('.' + this.settings.activeClass).removeClass(this.settings.activeClass);
			this.$stage.children(':eq(' + matches.join('), :eq(') + ')').addClass(this.settings.activeClass);

			if (this.settings.center) {
				this.$stage.children('.' + this.settings.centerClass).removeClass(this.settings.centerClass);
				this.$stage.children().eq(this.current()).addClass(this.settings.centerClass);
			}
		}
	} ];

	/**
	 * Initializes the carousel.
	 * @protected
	 */
	Owl.prototype.initialize = function() {
		this.trigger('initialize');

		this.$element
			.addClass(this.settings.baseClass)
			.addClass(this.settings.themeClass)
			.toggleClass('owl-rtl', this.settings.rtl);

		// check support
		this.browserSupport();

		if (this.settings.autoWidth && this.state.imagesLoaded !== true) {
			var imgs, nestedSelector, width;
			imgs = this.$element.find('img');
			nestedSelector = this.settings.nestedItemSelector ? '.' + this.settings.nestedItemSelector : undefined;
			width = this.$element.children(nestedSelector).width();

			if (imgs.length && width <= 0) {
				this.preloadAutoWidthImages(imgs);
				return false;
			}
		}

		this.$element.addClass('owl-loading');

		// create stage
		this.$stage = $('<' + this.settings.stageElement + ' class="owl-stage"/>')
			.wrap('<div class="owl-stage-outer">');

		// append stage
		this.$element.append(this.$stage.parent());

		// append content
		this.replace(this.$element.children().not(this.$stage.parent()));

		// set view width
		this._width = this.$element.width();

		// update view
		this.refresh();

		this.$element.removeClass('owl-loading').addClass('owl-loaded');

		// attach generic events
		this.eventsCall();

		// attach generic events
		this.internalEvents();

		// attach custom control events
		this.addTriggerableEvents();

		this.trigger('initialized');
	};

	/**
	 * Setups the current settings.
	 * @todo Remove responsive classes. Why should adaptive designs be brought into IE8?
	 * @todo Support for media queries by using `matchMedia` would be nice.
	 * @public
	 */
	Owl.prototype.setup = function() {
		var viewport = this.viewport(),
			overwrites = this.options.responsive,
			match = -1,
			settings = null;

		if (!overwrites) {
			settings = $.extend({}, this.options);
		} else {
			$.each(overwrites, function(breakpoint) {
				if (breakpoint <= viewport && breakpoint > match) {
					match = Number(breakpoint);
				}
			});

			settings = $.extend({}, this.options, overwrites[match]);
			delete settings.responsive;

			// responsive class
			if (settings.responsiveClass) {
				this.$element.attr('class', function(i, c) {
					return c.replace(/\b owl-responsive-\S+/g, '');
				}).addClass('owl-responsive-' + match);
			}
		}

		if (this.settings === null || this._breakpoint !== match) {
			this.trigger('change', { property: { name: 'settings', value: settings } });
			this._breakpoint = match;
			this.settings = settings;
			this.invalidate('settings');
			this.trigger('changed', { property: { name: 'settings', value: this.settings } });
		}
	};

	/**
	 * Updates option logic if necessery.
	 * @protected
	 */
	Owl.prototype.optionsLogic = function() {
		// Toggle Center class
		this.$element.toggleClass('owl-center', this.settings.center);

		// if items number is less than in body
		if (this.settings.loop && this._items.length < this.settings.items) {
			this.settings.loop = false;
		}

		if (this.settings.autoWidth) {
			this.settings.stagePadding = false;
			this.settings.merge = false;
		}
	};

	/**
	 * Prepares an item before add.
	 * @todo Rename event parameter `content` to `item`.
	 * @protected
	 * @returns {jQuery|HTMLElement} - The item container.
	 */
	Owl.prototype.prepare = function(item) {
		var event = this.trigger('prepare', { content: item });

		if (!event.data) {
			event.data = $('<' + this.settings.itemElement + '/>')
				.addClass(this.settings.itemClass).append(item)
		}

		this.trigger('prepared', { content: event.data });

		return event.data;
	};

	/**
	 * Updates the view.
	 * @public
	 */
	Owl.prototype.update = function() {
		var i = 0,
			n = this._pipe.length,
			filter = $.proxy(function(p) { return this[p] }, this._invalidated),
			cache = {};

		while (i < n) {
			if (this._invalidated.all || $.grep(this._pipe[i].filter, filter).length > 0) {
				this._pipe[i].run(cache);
			}
			i++;
		}

		this._invalidated = {};
	};

	/**
	 * Gets the width of the view.
	 * @public
	 * @param {Owl.Width} [dimension=Owl.Width.Default] - The dimension to return.
	 * @returns {Number} - The width of the view in pixel.
	 */
	Owl.prototype.width = function(dimension) {
		dimension = dimension || Owl.Width.Default;
		switch (dimension) {
			case Owl.Width.Inner:
			case Owl.Width.Outer:
				return this._width;
			default:
				return this._width - this.settings.stagePadding * 2 + this.settings.margin;
		}
	};

	/**
	 * Refreshes the carousel primarily for adaptive purposes.
	 * @public
	 */
	Owl.prototype.refresh = function() {
		if (this._items.length === 0) {
			return false;
		}

		var start = new Date().getTime();

		this.trigger('refresh');

		this.setup();

		this.optionsLogic();

		// hide and show methods helps here to set a proper widths,
		// this prevents scrollbar to be calculated in stage width
		this.$stage.addClass('owl-refresh');

		this.update();

		this.$stage.removeClass('owl-refresh');

		this.state.orientation = window.orientation;

		this.watchVisibility();

		this.trigger('refreshed');
	};

	/**
	 * Save internal event references and add event based functions.
	 * @protected
	 */
	Owl.prototype.eventsCall = function() {
		// Save events references
		this.e._onDragStart = $.proxy(function(e) {
			this.onDragStart(e);
		}, this);
		this.e._onDragMove = $.proxy(function(e) {
			this.onDragMove(e);
		}, this);
		this.e._onDragEnd = $.proxy(function(e) {
			this.onDragEnd(e);
		}, this);
		this.e._onResize = $.proxy(function(e) {
			this.onResize(e);
		}, this);
		this.e._transitionEnd = $.proxy(function(e) {
			this.transitionEnd(e);
		}, this);
		this.e._preventClick = $.proxy(function(e) {
			this.preventClick(e);
		}, this);
	};

	/**
	 * Checks window `resize` event.
	 * @protected
	 */
	Owl.prototype.onThrottledResize = function() {
		window.clearTimeout(this.resizeTimer);
		this.resizeTimer = window.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate);
	};

	/**
	 * Checks window `resize` event.
	 * @protected
	 */
	Owl.prototype.onResize = function() {
		if (!this._items.length) {
			return false;
		}

		if (this._width === this.$element.width()) {
			return false;
		}

		if (this.trigger('resize').isDefaultPrevented()) {
			return false;
		}

		this._width = this.$element.width();

		this.invalidate('width');

		this.refresh();

		this.trigger('resized');
	};

	/**
	 * Checks for touch/mouse drag event type and add run event handlers.
	 * @protected
	 */
	Owl.prototype.eventsRouter = function(event) {
		var type = event.type;

		if (type === "mousedown" || type === "touchstart") {
			this.onDragStart(event);
		} else if (type === "mousemove" || type === "touchmove") {
			this.onDragMove(event);
		} else if (type === "mouseup" || type === "touchend") {
			this.onDragEnd(event);
		} else if (type === "touchcancel") {
			this.onDragEnd(event);
		}
	};

	/**
	 * Checks for touch/mouse drag options and add necessery event handlers.
	 * @protected
	 */
	Owl.prototype.internalEvents = function() {
		var isTouch = isTouchSupport(),
			isTouchIE = isTouchSupportIE();

		if (this.settings.mouseDrag){
			this.$stage.on('mousedown', $.proxy(function(event) { this.eventsRouter(event) }, this));
			this.$stage.on('dragstart', function() { return false });
			this.$stage.get(0).onselectstart = function() { return false };
		} else {
			this.$element.addClass('owl-text-select-on');
		}

		if (this.settings.touchDrag && !isTouchIE){
			this.$stage.on('touchstart touchcancel', $.proxy(function(event) { this.eventsRouter(event) }, this));
		}

		// catch transitionEnd event
		if (this.transitionEndVendor) {
			this.on(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd, false);
		}

		// responsive
		if (this.settings.responsive !== false) {
			this.on(window, 'resize', $.proxy(this.onThrottledResize, this));
		}
	};

	/**
	 * Handles touchstart/mousedown event.
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onDragStart = function(event) {
		var ev, isTouchEvent, pageX, pageY, animatedPos;

		ev = event.originalEvent || event || window.event;

		// prevent right click
		if (ev.which === 3 || this.state.isTouch) {
			return false;
		}

		if (ev.type === 'mousedown') {
			this.$stage.addClass('owl-grab');
		}

		this.trigger('drag');
		this.drag.startTime = new Date().getTime();
		this.speed(0);
		this.state.isTouch = true;
		this.state.isScrolling = false;
		this.state.isSwiping = false;
		this.drag.distance = 0;

		pageX = getTouches(ev).x;
		pageY = getTouches(ev).y;

		// get stage position left
		this.drag.offsetX = this.$stage.position().left;
		this.drag.offsetY = this.$stage.position().top;

		if (this.settings.rtl) {
			this.drag.offsetX = this.$stage.position().left + this.$stage.width() - this.width()
				+ this.settings.margin;
		}

		// catch position // ie to fix
		if (this.state.inMotion && this.support3d) {
			animatedPos = this.getTransformProperty();
			this.drag.offsetX = animatedPos;
			this.animate(animatedPos);
			this.state.inMotion = true;
		} else if (this.state.inMotion && !this.support3d) {
			this.state.inMotion = false;
			return false;
		}

		this.drag.startX = pageX - this.drag.offsetX;
		this.drag.startY = pageY - this.drag.offsetY;

		this.drag.start = pageX - this.drag.startX;
		this.drag.targetEl = ev.target || ev.srcElement;
		this.drag.updatedX = this.drag.start;

		// to do/check
		// prevent links and images dragging;
		if (this.drag.targetEl.tagName === "IMG" || this.drag.targetEl.tagName === "A") {
			this.drag.targetEl.draggable = false;
		}

		$(document).on('mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents', $.proxy(function(event) {this.eventsRouter(event)},this));
	};

	/**
	 * Handles the touchmove/mousemove events.
	 * @todo Simplify
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onDragMove = function(event) {
		var ev, isTouchEvent, pageX, pageY, minValue, maxValue, pull;

		if (!this.state.isTouch) {
			return;
		}

		if (this.state.isScrolling) {
			return;
		}

		ev = event.originalEvent || event || window.event;

		pageX = getTouches(ev).x;
		pageY = getTouches(ev).y;

		// Drag Direction
		this.drag.currentX = pageX - this.drag.startX;
		this.drag.currentY = pageY - this.drag.startY;
		this.drag.distance = this.drag.currentX - this.drag.offsetX;

		// Check move direction
		if (this.drag.distance < 0) {
			this.state.direction = this.settings.rtl ? 'right' : 'left';
		} else if (this.drag.distance > 0) {
			this.state.direction = this.settings.rtl ? 'left' : 'right';
		}
		// Loop
		if (this.settings.loop) {
			if (this.op(this.drag.currentX, '>', this.coordinates(this.minimum())) && this.state.direction === 'right') {
				this.drag.currentX -= (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length);
			} else if (this.op(this.drag.currentX, '<', this.coordinates(this.maximum())) && this.state.direction === 'left') {
				this.drag.currentX += (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length);
			}
		} else {
			// pull
			minValue = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum());
			maxValue = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum());
			pull = this.settings.pullDrag ? this.drag.distance / 5 : 0;
			this.drag.currentX = Math.max(Math.min(this.drag.currentX, minValue + pull), maxValue + pull);
		}

		// Lock browser if swiping horizontal

		if ((this.drag.distance > 8 || this.drag.distance < -8)) {
			if (ev.preventDefault !== undefined) {
				ev.preventDefault();
			} else {
				ev.returnValue = false;
			}
			this.state.isSwiping = true;
		}

		this.drag.updatedX = this.drag.currentX;

		// Lock Owl if scrolling
		if ((this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === false) {
			this.state.isScrolling = true;
			this.drag.updatedX = this.drag.start;
		}

		this.animate(this.drag.updatedX);
	};

	/**
	 * Handles the touchend/mouseup events.
	 * @protected
	 */
	Owl.prototype.onDragEnd = function(event) {
		var compareTimes, distanceAbs, closest;

		if (!this.state.isTouch) {
			return;
		}

		if (event.type === 'mouseup') {
			this.$stage.removeClass('owl-grab');
		}

		this.trigger('dragged');

		// prevent links and images dragging;
		this.drag.targetEl.removeAttribute("draggable");

		// remove drag event listeners

		this.state.isTouch = false;
		this.state.isScrolling = false;
		this.state.isSwiping = false;

		// to check
		if (this.drag.distance === 0 && this.state.inMotion !== true) {
			this.state.inMotion = false;
			return false;
		}

		// prevent clicks while scrolling

		this.drag.endTime = new Date().getTime();
		compareTimes = this.drag.endTime - this.drag.startTime;
		distanceAbs = Math.abs(this.drag.distance);

		// to test
		if (distanceAbs > 3 || compareTimes > 300) {
			this.removeClick(this.drag.targetEl);
		}

		closest = this.closest(this.drag.updatedX);

		this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed);
		this.current(closest);
		this.invalidate('position');
		this.update();

		// if pullDrag is off then fire transitionEnd event manually when stick
		// to border
		if (!this.settings.pullDrag && this.drag.updatedX === this.coordinates(closest)) {
			this.transitionEnd();
		}

		this.drag.distance = 0;

		$(document).off('.owl.dragEvents');
	};

	/**
	 * Attaches `preventClick` to disable link while swipping.
	 * @protected
	 * @param {HTMLElement} [target] - The target of the `click` event.
	 */
	Owl.prototype.removeClick = function(target) {
		this.drag.targetEl = target;
		$(target).on('click.preventClick', this.e._preventClick);
		// to make sure click is removed:
		window.setTimeout(function() {
			$(target).off('click.preventClick');
		}, 300);
	};

	/**
	 * Suppresses click event.
	 * @protected
	 * @param {Event} ev - The event arguments.
	 */
	Owl.prototype.preventClick = function(ev) {
		if (ev.preventDefault) {
			ev.preventDefault();
		} else {
			ev.returnValue = false;
		}
		if (ev.stopPropagation) {
			ev.stopPropagation();
		}
		$(ev.target).off('click.preventClick');
	};

	/**
	 * Catches stage position while animate (only CSS3).
	 * @protected
	 * @returns
	 */
	Owl.prototype.getTransformProperty = function() {
		var transform, matrix3d;

		transform = window.getComputedStyle(this.$stage.get(0), null).getPropertyValue(this.vendorName + 'transform');
		// var transform = this.$stage.css(this.vendorName + 'transform')
		transform = transform.replace(/matrix(3d)?\(|\)/g, '').split(',');
		matrix3d = transform.length === 16;

		return matrix3d !== true ? transform[4] : transform[12];
	};

	/**
	 * Gets absolute position of the closest item for a coordinate.
	 * @todo Setting `freeDrag` makes `closest` not reusable. See #165.
	 * @protected
	 * @param {Number} coordinate - The coordinate in pixel.
	 * @return {Number} - The absolute position of the closest item.
	 */
	Owl.prototype.closest = function(coordinate) {
		var position = -1, pull = 30, width = this.width(), coordinates = this.coordinates();

		if (!this.settings.freeDrag) {
			// check closest item
			$.each(coordinates, $.proxy(function(index, value) {
				if (coordinate > value - pull && coordinate < value + pull) {
					position = index;
				} else if (this.op(coordinate, '<', value)
					&& this.op(coordinate, '>', coordinates[index + 1] || value - width)) {
					position = this.state.direction === 'left' ? index + 1 : index;
				}
				return position === -1;
			}, this));
		}

		if (!this.settings.loop) {
			// non loop boundries
			if (this.op(coordinate, '>', coordinates[this.minimum()])) {
				position = coordinate = this.minimum();
			} else if (this.op(coordinate, '<', coordinates[this.maximum()])) {
				position = coordinate = this.maximum();
			}
		}

		return position;
	};

	/**
	 * Animates the stage.
	 * @public
	 * @param {Number} coordinate - The coordinate in pixels.
	 */
	Owl.prototype.animate = function(coordinate) {
		this.trigger('translate');
		this.state.inMotion = this.speed() > 0;

		if (this.support3d) {
			this.$stage.css({
				transform: 'translate3d(' + coordinate + 'px' + ',0px, 0px)',
				transition: (this.speed() / 1000) + 's'
			});
		} else if (this.state.isTouch) {
			this.$stage.css({
				left: coordinate + 'px'
			});
		} else {
			this.$stage.animate({
				left: coordinate
			}, this.speed() / 1000, this.settings.fallbackEasing, $.proxy(function() {
				if (this.state.inMotion) {
					this.transitionEnd();
				}
			}, this));
		}
	};

	/**
	 * Sets the absolute position of the current item.
	 * @public
	 * @param {Number} [position] - The new absolute position or nothing to leave it unchanged.
	 * @returns {Number} - The absolute position of the current item.
	 */
	Owl.prototype.current = function(position) {
		if (position === undefined) {
			return this._current;
		}

		if (this._items.length === 0) {
			return undefined;
		}

		position = this.normalize(position);

		if (this._current !== position) {
			var event = this.trigger('change', { property: { name: 'position', value: position } });

			if (event.data !== undefined) {
				position = this.normalize(event.data);
			}

			this._current = position;

			this.invalidate('position');

			this.trigger('changed', { property: { name: 'position', value: this._current } });
		}

		return this._current;
	};

	/**
	 * Invalidates the given part of the update routine.
	 * @param {String} part - The part to invalidate.
	 */
	Owl.prototype.invalidate = function(part) {
		this._invalidated[part] = true;
	}

	/**
	 * Resets the absolute position of the current item.
	 * @public
	 * @param {Number} position - The absolute position of the new item.
	 */
	Owl.prototype.reset = function(position) {
		position = this.normalize(position);

		if (position === undefined) {
			return;
		}

		this._speed = 0;
		this._current = position;

		this.suppress([ 'translate', 'translated' ]);

		this.animate(this.coordinates(position));

		this.release([ 'translate', 'translated' ]);
	};

	/**
	 * Normalizes an absolute or a relative position for an item.
	 * @public
	 * @param {Number} position - The absolute or relative position to normalize.
	 * @param {Boolean} [relative=false] - Whether the given position is relative or not.
	 * @returns {Number} - The normalized position.
	 */
	Owl.prototype.normalize = function(position, relative) {
		var n = (relative ? this._items.length : this._items.length + this._clones.length);

		if (!$.isNumeric(position) || n < 1) {
			return undefined;
		}

		if (this._clones.length) {
			position = ((position % n) + n) % n;
		} else {
			position = Math.max(this.minimum(relative), Math.min(this.maximum(relative), position));
		}

		return position;
	};

	/**
	 * Converts an absolute position for an item into a relative position.
	 * @public
	 * @param {Number} position - The absolute position to convert.
	 * @returns {Number} - The converted position.
	 */
	Owl.prototype.relative = function(position) {
		position = this.normalize(position);
		position = position - this._clones.length / 2;
		return this.normalize(position, true);
	};

	/**
	 * Gets the maximum position for an item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
	Owl.prototype.maximum = function(relative) {
		var maximum, width, i = 0, coordinate,
			settings = this.settings;

		if (relative) {
			return this._items.length - 1;
		}

		if (!settings.loop && settings.center) {
			maximum = this._items.length - 1;
		} else if (!settings.loop && !settings.center) {
			maximum = this._items.length - settings.items;
		} else if (settings.loop || settings.center) {
			maximum = this._items.length + settings.items;
		} else if (settings.autoWidth || settings.merge) {
			revert = settings.rtl ? 1 : -1;
			width = this.$stage.width() - this.$element.width();
			while (coordinate = this.coordinates(i)) {
				if (coordinate * revert >= width) {
					break;
				}
				maximum = ++i;
			}
		} else {
			throw 'Can not detect maximum absolute position.'
		}

		return maximum;
	};

	/**
	 * Gets the minimum position for an item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
	Owl.prototype.minimum = function(relative) {
		if (relative) {
			return 0;
		}

		return this._clones.length / 2;
	};

	/**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
	Owl.prototype.items = function(position) {
		if (position === undefined) {
			return this._items.slice();
		}

		position = this.normalize(position, true);
		return this._items[position];
	};

	/**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
	Owl.prototype.mergers = function(position) {
		if (position === undefined) {
			return this._mergers.slice();
		}

		position = this.normalize(position, true);
		return this._mergers[position];
	};

	/**
	 * Gets the absolute positions of clones for an item.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @returns {Array.<Number>} - The absolute positions of clones for the item or all if no position was given.
	 */
	Owl.prototype.clones = function(position) {
		var odd = this._clones.length / 2,
			even = odd + this._items.length,
			map = function(index) { return index % 2 === 0 ? even + index / 2 : odd - (index + 1) / 2 };

		if (position === undefined) {
			return $.map(this._clones, function(v, i) { return map(i) });
		}

		return $.map(this._clones, function(v, i) { return v === position ? map(i) : null });
	};

	/**
	 * Sets the current animation speed.
	 * @public
	 * @param {Number} [speed] - The animation speed in milliseconds or nothing to leave it unchanged.
	 * @returns {Number} - The current animation speed in milliseconds.
	 */
	Owl.prototype.speed = function(speed) {
		if (speed !== undefined) {
			this._speed = speed;
		}

		return this._speed;
	};

	/**
	 * Gets the coordinate of an item.
	 * @todo The name of this method is missleanding.
	 * @public
	 * @param {Number} position - The absolute position of the item within `minimum()` and `maximum()`.
	 * @returns {Number|Array.<Number>} - The coordinate of the item in pixel or all coordinates.
	 */
	Owl.prototype.coordinates = function(position) {
		var coordinate = null;

		if (position === undefined) {
			return $.map(this._coordinates, $.proxy(function(coordinate, index) {
				return this.coordinates(index);
			}, this));
		}

		if (this.settings.center) {
			coordinate = this._coordinates[position];
			coordinate += (this.width() - coordinate + (this._coordinates[position - 1] || 0)) / 2 * (this.settings.rtl ? -1 : 1);
		} else {
			coordinate = this._coordinates[position - 1] || 0;
		}

		return coordinate;
	};

	/**
	 * Calculates the speed for a translation.
	 * @protected
	 * @param {Number} from - The absolute position of the start item.
	 * @param {Number} to - The absolute position of the target item.
	 * @param {Number} [factor=undefined] - The time factor in milliseconds.
	 * @returns {Number} - The time in milliseconds for the translation.
	 */
	Owl.prototype.duration = function(from, to, factor) {
		return Math.min(Math.max(Math.abs(to - from), 1), 6) * Math.abs((factor || this.settings.smartSpeed));
	};

	/**
	 * Slides to the specified item.
	 * @public
	 * @param {Number} position - The position of the item.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.to = function(position, speed) {
		if (this.settings.loop) {
			var distance = position - this.relative(this.current()),
				revert = this.current(),
				before = this.current(),
				after = this.current() + distance,
				direction = before - after < 0 ? true : false,
				items = this._clones.length + this._items.length;

			if (after < this.settings.items && direction === false) {
				revert = before + this._items.length;
				this.reset(revert);
			} else if (after >= items - this.settings.items && direction === true) {
				revert = before - this._items.length;
				this.reset(revert);
			}
			window.clearTimeout(this.e._goToLoop);
			this.e._goToLoop = window.setTimeout($.proxy(function() {
				this.speed(this.duration(this.current(), revert + distance, speed));
				this.current(revert + distance);
				this.update();
			}, this), 30);
		} else {
			this.speed(this.duration(this.current(), position, speed));
			this.current(position);
			this.update();
		}
	};

	/**
	 * Slides to the next item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.next = function(speed) {
		speed = speed || false;
		this.to(this.relative(this.current()) + 1, speed);
	};

	/**
	 * Slides to the previous item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.prev = function(speed) {
		speed = speed || false;
		this.to(this.relative(this.current()) - 1, speed);
	};

	/**
	 * Handles the end of an animation.
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.transitionEnd = function(event) {

		// if css2 animation then event object is undefined
		if (event !== undefined) {
			event.stopPropagation();

			// Catch only owl-stage transitionEnd event
			if ((event.target || event.srcElement || event.originalTarget) !== this.$stage.get(0)) {
				return false;
			}
		}

		this.state.inMotion = false;
		this.trigger('translated');
	};

	/**
	 * Gets viewport width.
	 * @protected
	 * @return {Number} - The width in pixel.
	 */
	Owl.prototype.viewport = function() {
		var width;
		if (this.options.responsiveBaseElement !== window) {
			width = $(this.options.responsiveBaseElement).width();
		} else if (window.innerWidth) {
			width = window.innerWidth;
		} else if (document.documentElement && document.documentElement.clientWidth) {
			width = document.documentElement.clientWidth;
		} else {
			throw 'Can not detect viewport width.';
		}
		return width;
	};

	/**
	 * Replaces the current content.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The new content.
	 */
	Owl.prototype.replace = function(content) {
		this.$stage.empty();
		this._items = [];

		if (content) {
			content = (content instanceof jQuery) ? content : $(content);
		}

		if (this.settings.nestedItemSelector) {
			content = content.find('.' + this.settings.nestedItemSelector);
		}

		content.filter(function() {
			return this.nodeType === 1;
		}).each($.proxy(function(index, item) {
			item = this.prepare(item);
			this.$stage.append(item);
			this._items.push(item);
			this._mergers.push(item.find('[data-merge]').andSelf('[data-merge]').attr('data-merge') * 1 || 1);
		}, this));

		this.reset($.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);

		this.invalidate('items');
	};

	/**
	 * Adds an item.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The item content to add.
	 * @param {Number} [position] - The relative position at which to insert the item otherwise the item will be added to the end.
	 */
	Owl.prototype.add = function(content, position) {
		position = position === undefined ? this._items.length : this.normalize(position, true);

		this.trigger('add', { content: content, position: position });

		if (this._items.length === 0 || position === this._items.length) {
			this.$stage.append(content);
			this._items.push(content);
			this._mergers.push(content.find('[data-merge]').andSelf('[data-merge]').attr('data-merge') * 1 || 1);
		} else {
			this._items[position].before(content);
			this._items.splice(position, 0, content);
			this._mergers.splice(position, 0, content.find('[data-merge]').andSelf('[data-merge]').attr('data-merge') * 1 || 1);
		}

		this.invalidate('items');

		this.trigger('added', { content: content, position: position });
	};

	/**
	 * Removes an item by its position.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {Number} position - The relative position of the item to remove.
	 */
	Owl.prototype.remove = function(position) {
		position = this.normalize(position, true);

		if (position === undefined) {
			return;
		}

		this.trigger('remove', { content: this._items[position], position: position });

		this._items[position].remove();
		this._items.splice(position, 1);
		this._mergers.splice(position, 1);

		this.invalidate('items');

		this.trigger('removed', { content: null, position: position });
	};

	/**
	 * Adds triggerable events.
	 * @protected
	 */
	Owl.prototype.addTriggerableEvents = function() {
		var handler = $.proxy(function(callback, event) {
			return $.proxy(function(e) {
				if (e.relatedTarget !== this) {
					this.suppress([ event ]);
					callback.apply(this, [].slice.call(arguments, 1));
					this.release([ event ]);
				}
			}, this);
		}, this);

		$.each({
			'next': this.next,
			'prev': this.prev,
			'to': this.to,
			'destroy': this.destroy,
			'refresh': this.refresh,
			'replace': this.replace,
			'add': this.add,
			'remove': this.remove
		}, $.proxy(function(event, callback) {
			this.$element.on(event + '.owl.carousel', handler(callback, event + '.owl.carousel'));
		}, this));

	};

	/**
	 * Watches the visibility of the carousel element.
	 * @protected
	 */
	Owl.prototype.watchVisibility = function() {

		// test on zepto
		if (!isElVisible(this.$element.get(0))) {
			this.$element.addClass('owl-hidden');
			window.clearInterval(this.e._checkVisibile);
			this.e._checkVisibile = window.setInterval($.proxy(checkVisible, this), 500);
		}

		function isElVisible(el) {
			return el.offsetWidth > 0 && el.offsetHeight > 0;
		}

		function checkVisible() {
			if (isElVisible(this.$element.get(0))) {
				this.$element.removeClass('owl-hidden');
				this.refresh();
				window.clearInterval(this.e._checkVisibile);
			}
		}
	};

	/**
	 * Preloads images with auto width.
	 * @protected
	 * @todo Still to test
	 */
	Owl.prototype.preloadAutoWidthImages = function(imgs) {
		var loaded, that, $el, img;

		loaded = 0;
		that = this;
		imgs.each(function(i, el) {
			$el = $(el);
			img = new Image();

			img.onload = function() {
				loaded++;
				$el.attr('src', img.src);
				$el.css('opacity', 1);
				if (loaded >= imgs.length) {
					that.state.imagesLoaded = true;
					that.initialize();
				}
			};

			img.src = $el.attr('src') || $el.attr('data-src') || $el.attr('data-src-retina');
		});
	};

	/**
	 * Destroys the carousel.
	 * @public
	 */
	Owl.prototype.destroy = function() {

		if (this.$element.hasClass(this.settings.themeClass)) {
			this.$element.removeClass(this.settings.themeClass);
		}

		if (this.settings.responsive !== false) {
			$(window).off('resize.owl.carousel');
		}

		if (this.transitionEndVendor) {
			this.off(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd);
		}

		for ( var i in this._plugins) {
			this._plugins[i].destroy();
		}

		if (this.settings.mouseDrag || this.settings.touchDrag) {
			this.$stage.off('mousedown touchstart touchcancel');
			$(document).off('.owl.dragEvents');
			this.$stage.get(0).onselectstart = function() {};
			this.$stage.off('dragstart', function() { return false });
		}

		// remove event handlers in the ".owl.carousel" namespace
		this.$element.off('.owl');

		this.$stage.children('.cloned').remove();
		this.e = null;
		this.$element.removeData('owlCarousel');

		this.$stage.children().contents().unwrap();
		this.$stage.children().unwrap();
		this.$stage.unwrap();
	};

	/**
	 * Operators to calculate right-to-left and left-to-right.
	 * @protected
	 * @param {Number} [a] - The left side operand.
	 * @param {String} [o] - The operator.
	 * @param {Number} [b] - The right side operand.
	 */
	Owl.prototype.op = function(a, o, b) {
		var rtl = this.settings.rtl;
		switch (o) {
			case '<':
				return rtl ? a > b : a < b;
			case '>':
				return rtl ? a < b : a > b;
			case '>=':
				return rtl ? a <= b : a >= b;
			case '<=':
				return rtl ? a >= b : a <= b;
			default:
				break;
		}
	};

	/**
	 * Attaches to an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The event handler to attach.
	 * @param {Boolean} capture - Wether the event should be handled at the capturing phase or not.
	 */
	Owl.prototype.on = function(element, event, listener, capture) {
		if (element.addEventListener) {
			element.addEventListener(event, listener, capture);
		} else if (element.attachEvent) {
			element.attachEvent('on' + event, listener);
		}
	};

	/**
	 * Detaches from an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The attached event handler to detach.
	 * @param {Boolean} capture - Wether the attached event handler was registered as a capturing listener or not.
	 */
	Owl.prototype.off = function(element, event, listener, capture) {
		if (element.removeEventListener) {
			element.removeEventListener(event, listener, capture);
		} else if (element.detachEvent) {
			element.detachEvent('on' + event, listener);
		}
	};

	/**
	 * Triggers an public event.
	 * @protected
	 * @param {String} name - The event name.
	 * @param {*} [data=null] - The event data.
	 * @param {String} [namespace=.owl.carousel] - The event namespace.
	 * @returns {Event} - The event arguments.
	 */
	Owl.prototype.trigger = function(name, data, namespace) {
		var status = {
			item: { count: this._items.length, index: this.current() }
		}, handler = $.camelCase(
			$.grep([ 'on', name, namespace ], function(v) { return v })
				.join('-').toLowerCase()
		), event = $.Event(
			[ name, 'owl', namespace || 'carousel' ].join('.').toLowerCase(),
			$.extend({ relatedTarget: this }, status, data)
		);

		if (!this._supress[name]) {
			$.each(this._plugins, function(name, plugin) {
				if (plugin.onTrigger) {
					plugin.onTrigger(event);
				}
			});

			this.$element.trigger(event);

			if (this.settings && typeof this.settings[handler] === 'function') {
				this.settings[handler].apply(this, event);
			}
		}

		return event;
	};

	/**
	 * Suppresses events.
	 * @protected
	 * @param {Array.<String>} events - The events to suppress.
	 */
	Owl.prototype.suppress = function(events) {
		$.each(events, $.proxy(function(index, event) {
			this._supress[event] = true;
		}, this));
	}

	/**
	 * Releases suppressed events.
	 * @protected
	 * @param {Array.<String>} events - The events to release.
	 */
	Owl.prototype.release = function(events) {
		$.each(events, $.proxy(function(index, event) {
			delete this._supress[event];
		}, this));
	}

	/**
	 * Checks the availability of some browser features.
	 * @protected
	 */
	Owl.prototype.browserSupport = function() {
		this.support3d = isPerspective();

		if (this.support3d) {
			this.transformVendor = isTransform();

			// take transitionend event name by detecting transition
			var endVendors = [ 'transitionend', 'webkitTransitionEnd', 'transitionend', 'oTransitionEnd' ];
			this.transitionEndVendor = endVendors[isTransition()];

			// take vendor name from transform name
			this.vendorName = this.transformVendor.replace(/Transform/i, '');
			this.vendorName = this.vendorName !== '' ? '-' + this.vendorName.toLowerCase() + '-' : '';
		}

		this.state.orientation = window.orientation;
	};

	/**
	 * Get touch/drag coordinats.
	 * @private
	 * @param {event} - mousedown/touchstart event
	 * @returns {object} - Contains X and Y of current mouse/touch position
	 */

	function getTouches(event) {
		if (event.touches !== undefined) {
			return {
				x: event.touches[0].pageX,
				y: event.touches[0].pageY
			};
		}

		if (event.touches === undefined) {
			if (event.pageX !== undefined) {
				return {
					x: event.pageX,
					y: event.pageY
				};
			}

		if (event.pageX === undefined) {
			return {
					x: event.clientX,
					y: event.clientY
				};
			}
		}
	}

	/**
	 * Checks for CSS support.
	 * @private
	 * @param {Array} array - The CSS properties to check for.
	 * @returns {Array} - Contains the supported CSS property name and its index or `false`.
	 */
	function isStyleSupported(array) {
		var p, s, fake = document.createElement('div'), list = array;
		for (p in list) {
			s = list[p];
			if (typeof fake.style[s] !== 'undefined') {
				fake = null;
				return [ s, p ];
			}
		}
		return [ false ];
	}

	/**
	 * Checks for CSS transition support.
	 * @private
	 * @todo Realy bad design
	 * @returns {Number}
	 */
	function isTransition() {
		return isStyleSupported([ 'transition', 'WebkitTransition', 'MozTransition', 'OTransition' ])[1];
	}

	/**
	 * Checks for CSS transform support.
	 * @private
	 * @returns {String} The supported property name or false.
	 */
	function isTransform() {
		return isStyleSupported([ 'transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform' ])[0];
	}

	/**
	 * Checks for CSS perspective support.
	 * @private
	 * @returns {String} The supported property name or false.
	 */
	function isPerspective() {
		return isStyleSupported([ 'perspective', 'webkitPerspective', 'MozPerspective', 'OPerspective', 'MsPerspective' ])[0];
	}

	/**
	 * Checks wether touch is supported or not.
	 * @private
	 * @returns {Boolean}
	 */
	function isTouchSupport() {
		return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
	}

	/**
	 * Checks wether touch is supported or not for IE.
	 * @private
	 * @returns {Boolean}
	 */
	function isTouchSupportIE() {
		return window.navigator.msPointerEnabled;
	}

	/**
	 * The jQuery Plugin for the Owl Carousel
	 * @public
	 */
	$.fn.owlCarousel = function(options) {
		return this.each(function() {
			if (!$(this).data('owlCarousel')) {
				$(this).data('owlCarousel', new Owl(this, options));
			}
		});
	};

	/**
	 * The constructor for the jQuery Plugin
	 * @public
	 */
	$.fn.owlCarousel.Constructor = Owl;

})(window.Zepto || window.jQuery, window, document);

/**
 * Lazy Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the lazy plugin.
	 * @class The Lazy Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var Lazy = function(carousel) {

		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Already loaded items.
		 * @protected
		 * @type {Array.<jQuery>}
		 */
		this._loaded = [];

		/**
		 * Event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel change.owl.carousel': $.proxy(function(e) {
				if (!e.namespace) {
					return;
				}

				if (!this._core.settings || !this._core.settings.lazyLoad) {
					return;
				}

				if ((e.property && e.property.name == 'position') || e.type == 'initialized') {
					var settings = this._core.settings,
						n = (settings.center && Math.ceil(settings.items / 2) || settings.items),
						i = ((settings.center && n * -1) || 0),
						position = ((e.property && e.property.value) || this._core.current()) + i,
						clones = this._core.clones().length,
						load = $.proxy(function(i, v) { this.load(v) }, this);

					while (i++ < n) {
						this.load(clones / 2 + this._core.relative(position));
						clones && $.each(this._core.clones(this._core.relative(position++)), load);
					}
				}
			}, this)
		};

		// set the default options
		this._core.options = $.extend({}, Lazy.Defaults, this._core.options);

		// register event handler
		this._core.$element.on(this._handlers);
	}

	/**
	 * Default options.
	 * @public
	 */
	Lazy.Defaults = {
		lazyLoad: false
	}

	/**
	 * Loads all resources of an item at the specified position.
	 * @param {Number} position - The absolute position of the item.
	 * @protected
	 */
	Lazy.prototype.load = function(position) {
		var $item = this._core.$stage.children().eq(position),
			$elements = $item && $item.find('.owl-lazy');

		if (!$elements || $.inArray($item.get(0), this._loaded) > -1) {
			return;
		}

		$elements.each($.proxy(function(index, element) {
			var $element = $(element), image,
				url = (window.devicePixelRatio > 1 && $element.attr('data-src-retina')) || $element.attr('data-src');

			this._core.trigger('load', { element: $element, url: url }, 'lazy');

			if ($element.is('img')) {
				$element.one('load.owl.lazy', $.proxy(function() {
					$element.css('opacity', 1);
					this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
				}, this)).attr('src', url);
			} else {
				image = new Image();
				image.onload = $.proxy(function() {
					$element.css({
						'background-image': 'url(' + url + ')',
						'opacity': '1'
					});
					this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
				}, this);
				image.src = url;
			}
		}, this));

		this._loaded.push($item.get(0));
	}

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Lazy.prototype.destroy = function() {
		var handler, property;

		for (handler in this.handlers) {
			this._core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	}

	$.fn.owlCarousel.Constructor.Plugins.Lazy = Lazy;

})(window.Zepto || window.jQuery, window, document);

/**
 * AutoHeight Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the auto height plugin.
	 * @class The Auto Height Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var AutoHeight = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function() {
				if (this._core.settings.autoHeight) {
					this.update();
				}
			}, this),
			'changed.owl.carousel': $.proxy(function(e) {
				if (this._core.settings.autoHeight && e.property.name == 'position'){
					this.update();
				}
			}, this),
			'loaded.owl.lazy': $.proxy(function(e) {
				if (this._core.settings.autoHeight && e.element.closest('.' + this._core.settings.itemClass)
					=== this._core.$stage.children().eq(this._core.current())) {
					this.update();
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, AutoHeight.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	AutoHeight.Defaults = {
		autoHeight: false,
		autoHeightClass: 'owl-height'
	};

	/**
	 * Updates the view.
	 */
	AutoHeight.prototype.update = function() {
		this._core.$stage.parent()
			.height(this._core.$stage.children().eq(this._core.current()).height())
			.addClass(this._core.settings.autoHeightClass);
	};

	AutoHeight.prototype.destroy = function() {
		var handler, property;

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.AutoHeight = AutoHeight;

})(window.Zepto || window.jQuery, window, document);

/**
 * Video Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the video plugin.
	 * @class The Video Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var Video = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Cache all video URLs.
		 * @protected
		 * @type {Object}
		 */
		this._videos = {};

		/**
		 * Current playing item.
		 * @protected
		 * @type {jQuery}
		 */
		this._playing = null;

		/**
		 * Whether this is in fullscreen or not.
		 * @protected
		 * @type {Boolean}
		 */
		this._fullscreen = false;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'resize.owl.carousel': $.proxy(function(e) {
				if (this._core.settings.video && !this.isInFullScreen()) {
					e.preventDefault();
				}
			}, this),
			'refresh.owl.carousel changed.owl.carousel': $.proxy(function(e) {
				if (this._playing) {
					this.stop();
				}
			}, this),
			'prepared.owl.carousel': $.proxy(function(e) {
				var $element = $(e.content).find('.owl-video');
				if ($element.length) {
					$element.css('display', 'none');
					this.fetch($element, $(e.content));
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Video.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);

		this._core.$element.on('click.owl.video', '.owl-video-play-icon', $.proxy(function(e) {
			this.play(e);
		}, this));
	};

	/**
	 * Default options.
	 * @public
	 */
	Video.Defaults = {
		video: false,
		videoHeight: false,
		videoWidth: false
	};

	/**
	 * Gets the video ID and the type (YouTube/Vimeo only).
	 * @protected
	 * @param {jQuery} target - The target containing the video data.
	 * @param {jQuery} item - The item containing the video.
	 */
	Video.prototype.fetch = function(target, item) {

		var type = target.attr('data-vimeo-id') ? 'vimeo' : 'youtube',
			id = target.attr('data-vimeo-id') || target.attr('data-youtube-id'),
			width = target.attr('data-width') || this._core.settings.videoWidth,
			height = target.attr('data-height') || this._core.settings.videoHeight,
			url = target.attr('href');

		if (url) {
			id = url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

			if (id[3].indexOf('youtu') > -1) {
				type = 'youtube';
			} else if (id[3].indexOf('vimeo') > -1) {
				type = 'vimeo';
			} else {
				throw new Error('Video URL not supported.');
			}
			id = id[6];
		} else {
			throw new Error('Missing video URL.');
		}

		this._videos[url] = {
			type: type,
			id: id,
			width: width,
			height: height
		};

		item.attr('data-video', url);

		this.thumbnail(target, this._videos[url]);
	};

	/**
	 * Creates video thumbnail.
	 * @protected
	 * @param {jQuery} target - The target containing the video data.
	 * @param {Object} info - The video info object.
	 * @see `fetch`
	 */
	Video.prototype.thumbnail = function(target, video) {

		var tnLink,
			icon,
			path,
			dimensions = video.width && video.height ? 'style="width:' + video.width + 'px;height:' + video.height + 'px;"' : '',
			customTn = target.find('img'),
			srcType = 'src',
			lazyClass = '',
			settings = this._core.settings,
			create = function(path) {
				icon = '<div class="owl-video-play-icon"></div>';

				if (settings.lazyLoad) {
					tnLink = '<div class="owl-video-tn ' + lazyClass + '" ' + srcType + '="' + path + '"></div>';
				} else {
					tnLink = '<div class="owl-video-tn" style="opacity:1;background-image:url(' + path + ')"></div>';
				}
				target.after(tnLink);
				target.after(icon);
			};

		// wrap video content into owl-video-wrapper div
		target.wrap('<div class="owl-video-wrapper"' + dimensions + '></div>');

		if (this._core.settings.lazyLoad) {
			srcType = 'data-src';
			lazyClass = 'owl-lazy';
		}

		// custom thumbnail
		if (customTn.length) {
			create(customTn.attr(srcType));
			customTn.remove();
			return false;
		}

		if (video.type === 'youtube') {
			path = "https://img.youtube.com/vi/" + video.id + "/hqdefault.jpg";
			create(path);
		} else if (video.type === 'vimeo') {
			$.ajax({
				type: 'GET',
				url: 'https://vimeo.com/api/v2/video/' + video.id + '.json',
				jsonp: 'callback',
				dataType: 'jsonp',
				success: function(data) {
					path = data[0].thumbnail_large;
					create(path);
				}
			});
		}
	};

	/**
	 * Stops the current video.
	 * @public
	 */
	Video.prototype.stop = function() {
		this._core.trigger('stop', null, 'video');
		this._playing.find('.owl-video-frame').remove();
		this._playing.removeClass('owl-video-playing');
		this._playing = null;
	};

	/**
	 * Starts the current video.
	 * @public
	 * @param {Event} ev - The event arguments.
	 */
	Video.prototype.play = function(ev) {
		this._core.trigger('play', null, 'video');

		if (this._playing) {
			this.stop();
		}

		var target = $(ev.target || ev.srcElement),
			item = target.closest('.' + this._core.settings.itemClass),
			video = this._videos[item.attr('data-video')],
			width = video.width || '100%',
			height = video.height || this._core.$stage.height(),
			html, wrap;

		if (video.type === 'youtube') {
			html = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/'
				+ video.id + '?autoplay=1&v=' + video.id + '" frameborder="0" allowfullscreen></iframe>';
		} else if (video.type === 'vimeo') {
			html = '<iframe src="https://player.vimeo.com/video/' + video.id + '?autoplay=1" width="' + width
				+ '" height="' + height
				+ '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
		}

		item.addClass('owl-video-playing');
		this._playing = item;

		wrap = $('<div style="height:' + height + 'px; width:' + width + 'px" class="owl-video-frame">'
			+ html + '</div>');
		target.after(wrap);
	};

	/**
	 * Checks whether an video is currently in full screen mode or not.
	 * @todo Bad style because looks like a readonly method but changes members.
	 * @protected
	 * @returns {Boolean}
	 */
	Video.prototype.isInFullScreen = function() {

		// if Vimeo Fullscreen mode
		var element = document.fullscreenElement || document.mozFullScreenElement
			|| document.webkitFullscreenElement;

		if (element && $(element).parent().hasClass('owl-video-frame')) {
			this._core.speed(0);
			this._fullscreen = true;
		}

		if (element && this._fullscreen && this._playing) {
			return false;
		}

		// comming back from fullscreen
		if (this._fullscreen) {
			this._fullscreen = false;
			return false;
		}

		// check full screen mode and window orientation
		if (this._playing) {
			if (this._core.state.orientation !== window.orientation) {
				this._core.state.orientation = window.orientation;
				return false;
			}
		}

		return true;
	};

	/**
	 * Destroys the plugin.
	 */
	Video.prototype.destroy = function() {
		var handler, property;

		this._core.$element.off('click.owl.video');

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Video = Video;

})(window.Zepto || window.jQuery, window, document);

/**
 * Animate Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the animate plugin.
	 * @class The Navigation Plugin
	 * @param {Owl} scope - The Owl Carousel
	 */
	var Animate = function(scope) {
		this.core = scope;
		this.core.options = $.extend({}, Animate.Defaults, this.core.options);
		this.swapping = true;
		this.previous = undefined;
		this.next = undefined;

		this.handlers = {
			'change.owl.carousel': $.proxy(function(e) {
				if (e.property.name == 'position') {
					this.previous = this.core.current();
					this.next = e.property.value;
				}
			}, this),
			'drag.owl.carousel dragged.owl.carousel translated.owl.carousel': $.proxy(function(e) {
				this.swapping = e.type == 'translated';
			}, this),
			'translate.owl.carousel': $.proxy(function(e) {
				if (this.swapping && (this.core.options.animateOut || this.core.options.animateIn)) {
					this.swap();
				}
			}, this)
		};

		this.core.$element.on(this.handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	Animate.Defaults = {
		animateOut: false,
		animateIn: false
	};

	/**
	 * Toggles the animation classes whenever an translations starts.
	 * @protected
	 * @returns {Boolean|undefined}
	 */
	Animate.prototype.swap = function() {

		if (this.core.settings.items !== 1 || !this.core.support3d) {
			return;
		}

		this.core.speed(0);

		var left,
			clear = $.proxy(this.clear, this),
			previous = this.core.$stage.children().eq(this.previous),
			next = this.core.$stage.children().eq(this.next),
			incoming = this.core.settings.animateIn,
			outgoing = this.core.settings.animateOut;

		if (this.core.current() === this.previous) {
			return;
		}

		if (outgoing) {
			left = this.core.coordinates(this.previous) - this.core.coordinates(this.next);
			previous.css( { 'left': left + 'px' } )
				.addClass('animated owl-animated-out')
				.addClass(outgoing)
				.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', clear);
		}

		if (incoming) {
			next.addClass('animated owl-animated-in')
				.addClass(incoming)
				.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', clear);
		}
	};

	Animate.prototype.clear = function(e) {
		$(e.target).css( { 'left': '' } )
			.removeClass('animated owl-animated-out owl-animated-in')
			.removeClass(this.core.settings.animateIn)
			.removeClass(this.core.settings.animateOut);
		this.core.transitionEnd();
	}

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Animate.prototype.destroy = function() {
		var handler, property;

		for (handler in this.handlers) {
			this.core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Animate = Animate;

})(window.Zepto || window.jQuery, window, document);

/**
 * Autoplay Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the autoplay plugin.
	 * @class The Autoplay Plugin
	 * @param {Owl} scope - The Owl Carousel
	 */
	var Autoplay = function(scope) {
		this.core = scope;
		this.core.options = $.extend({}, Autoplay.Defaults, this.core.options);

		this.handlers = {
			'translated.owl.carousel refreshed.owl.carousel': $.proxy(function() {
				this.autoplay();
			}, this),
			'play.owl.autoplay': $.proxy(function(e, t, s) {
				this.play(t, s);
			}, this),
			'stop.owl.autoplay': $.proxy(function() {
				this.stop();
			}, this),
			'mouseover.owl.autoplay': $.proxy(function() {
				if (this.core.settings.autoplayHoverPause) {
					this.pause();
				}
			}, this),
			'mouseleave.owl.autoplay': $.proxy(function() {
				if (this.core.settings.autoplayHoverPause) {
					this.autoplay();
				}
			}, this)
		};

		this.core.$element.on(this.handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	Autoplay.Defaults = {
		autoplay: false,
		autoplayTimeout: 5000,
		autoplayHoverPause: false,
		autoplaySpeed: false
	};

	/**
	 * @protected
	 * @todo Must be documented.
	 */
	Autoplay.prototype.autoplay = function() {
		if (this.core.settings.autoplay && !this.core.state.videoPlay) {
			window.clearInterval(this.interval);

			this.interval = window.setInterval($.proxy(function() {
				this.play();
			}, this), this.core.settings.autoplayTimeout);
		} else {
			window.clearInterval(this.interval);
		}
	};

	/**
	 * Starts the autoplay.
	 * @public
	 * @param {Number} [timeout] - ...
	 * @param {Number} [speed] - ...
	 * @returns {Boolean|undefined} - ...
	 * @todo Must be documented.
	 */
	Autoplay.prototype.play = function(timeout, speed) {
		// if tab is inactive - doesnt work in <IE10
		if (document.hidden === true) {
			return;
		}

		if (this.core.state.isTouch || this.core.state.isScrolling
			|| this.core.state.isSwiping || this.core.state.inMotion) {
			return;
		}

		if (this.core.settings.autoplay === false) {
			window.clearInterval(this.interval);
			return;
		}

		this.core.next(this.core.settings.autoplaySpeed);
	};

	/**
	 * Stops the autoplay.
	 * @public
	 */
	Autoplay.prototype.stop = function() {
		window.clearInterval(this.interval);
	};

	/**
	 * Pauses the autoplay.
	 * @public
	 */
	Autoplay.prototype.pause = function() {
		window.clearInterval(this.interval);
	};

	/**
	 * Destroys the plugin.
	 */
	Autoplay.prototype.destroy = function() {
		var handler, property;

		window.clearInterval(this.interval);

		for (handler in this.handlers) {
			this.core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.autoplay = Autoplay;

})(window.Zepto || window.jQuery, window, document);

/**
 * Navigation Plugin
 * @version 2.0.0
 * @author Artus Kolanowski
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {
	'use strict';

	/**
	 * Creates the navigation plugin.
	 * @class The Navigation Plugin
	 * @param {Owl} carousel - The Owl Carousel.
	 */
	var Navigation = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Indicates whether the plugin is initialized or not.
		 * @protected
		 * @type {Boolean}
		 */
		this._initialized = false;

		/**
		 * The current paging indexes.
		 * @protected
		 * @type {Array}
		 */
		this._pages = [];

		/**
		 * All DOM elements of the user interface.
		 * @protected
		 * @type {Object}
		 */
		this._controls = {};

		/**
		 * Markup for an indicator.
		 * @protected
		 * @type {Array.<String>}
		 */
		this._templates = [];

		/**
		 * The carousel element.
		 * @type {jQuery}
		 */
		this.$element = this._core.$element;

		/**
		 * Overridden methods of the carousel.
		 * @protected
		 * @type {Object}
		 */
		this._overrides = {
			next: this._core.next,
			prev: this._core.prev,
			to: this._core.to
		};

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'prepared.owl.carousel': $.proxy(function(e) {
				if (this._core.settings.dotsData) {
					this._templates.push($(e.content).find('[data-dot]').andSelf('[data-dot]').attr('data-dot'));
				}
			}, this),
			'add.owl.carousel': $.proxy(function(e) {
				if (this._core.settings.dotsData) {
					this._templates.splice(e.position, 0, $(e.content).find('[data-dot]').andSelf('[data-dot]').attr('data-dot'));
				}
			}, this),
			'remove.owl.carousel prepared.owl.carousel': $.proxy(function(e) {
				if (this._core.settings.dotsData) {
					this._templates.splice(e.position, 1);
				}
			}, this),
			'change.owl.carousel': $.proxy(function(e) {
				if (e.property.name == 'position') {
					if (!this._core.state.revert && !this._core.settings.loop && this._core.settings.navRewind) {
						var current = this._core.current(),
							maximum = this._core.maximum(),
							minimum = this._core.minimum();
						e.data = e.property.value > maximum
							? current >= maximum ? minimum : maximum
							: e.property.value < minimum ? maximum : e.property.value;
					}
				}
			}, this),
			'changed.owl.carousel': $.proxy(function(e) {
				if (e.property.name == 'position') {
					this.draw();
				}
			}, this),
			'refreshed.owl.carousel': $.proxy(function() {
				if (!this._initialized) {
					this.initialize();
					this._initialized = true;
				}
				this._core.trigger('refresh', null, 'navigation');
				this.update();
				this.draw();
				this._core.trigger('refreshed', null, 'navigation');
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Navigation.Defaults, this._core.options);

		// register event handlers
		this.$element.on(this._handlers);
	}

	/**
	 * Default options.
	 * @public
	 * @todo Rename `slideBy` to `navBy`
	 */
	Navigation.Defaults = {
		nav: false,
		navRewind: true,
		navText: [ '< Previous', 'Next >' ],
		navSpeed: false,
		navElement: 'div',
		navContainer: false,
		navContainerClass: 'owl-nav',
		navClass: [ 'owl-prev', 'owl-next' ],
		slideBy: 1,
		dotClass: 'owl-dot',
		dotsClass: 'owl-dots',
		dots: true,
		dotsEach: false,
		dotData: false,
		dotsSpeed: false,
		dotsContainer: false,
		controlsClass: 'owl-controls'
	}

	/**
	 * Initializes the layout of the plugin and extends the carousel.
	 * @protected
	 */
	Navigation.prototype.initialize = function() {
		var $container, override,
			options = this._core.settings;

		// create the indicator template
		if (!options.dotsData) {
			this._templates = [ $('<div>')
				.addClass(options.dotClass)
				.append($('<span>'))
				.prop('outerHTML') ];
		}

		// create controls container if needed
		if (!options.navContainer || !options.dotsContainer) {
			this._controls.$container = $('<div>')
				.addClass(options.controlsClass)
				.appendTo(this.$element);
		}

		// create DOM structure for absolute navigation
		this._controls.$indicators = options.dotsContainer ? $(options.dotsContainer)
			: $('<div>').hide().addClass(options.dotsClass).appendTo(this._controls.$container);

		this._controls.$indicators.on('click', 'div', $.proxy(function(e) {
			var index = $(e.target).parent().is(this._controls.$indicators)
				? $(e.target).index() : $(e.target).parent().index();

			e.preventDefault();

			this.to(index, options.dotsSpeed);
		}, this));

		// create DOM structure for relative navigation
		$container = options.navContainer ? $(options.navContainer)
			: $('<div>').addClass(options.navContainerClass).prependTo(this._controls.$container);

		this._controls.$next = $('<' + options.navElement + '>');
		this._controls.$previous = this._controls.$next.clone();

		this._controls.$previous
			.addClass(options.navClass[0])
			.html(options.navText[0])
			.hide()
			.prependTo($container)
			.on('click', $.proxy(function(e) {
				this.prev(options.navSpeed);
			}, this));
		this._controls.$next
			.addClass(options.navClass[1])
			.html(options.navText[1])
			.hide()
			.appendTo($container)
			.on('click', $.proxy(function(e) {
				this.next(options.navSpeed);
			}, this));

		// override public methods of the carousel
		for (override in this._overrides) {
			this._core[override] = $.proxy(this[override], this);
		}
	}

	/**
	 * Destroys the plugin.
	 * @protected
	 */
	Navigation.prototype.destroy = function() {
		var handler, control, property, override;

		for (handler in this._handlers) {
			this.$element.off(handler, this._handlers[handler]);
		}
		for (control in this._controls) {
			this._controls[control].remove();
		}
		for (override in this.overides) {
			this._core[override] = this._overrides[override];
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	}

	/**
	 * Updates the internal state.
	 * @protected
	 */
	Navigation.prototype.update = function() {
		var i, j, k,
			options = this._core.settings,
			lower = this._core.clones().length / 2,
			upper = lower + this._core.items().length,
			size = options.center || options.autoWidth || options.dotData
				? 1 : options.dotsEach || options.items;

		if (options.slideBy !== 'page') {
			options.slideBy = Math.min(options.slideBy, options.items);
		}

		if (options.dots || options.slideBy == 'page') {
			this._pages = [];

			for (i = lower, j = 0, k = 0; i < upper; i++) {
				if (j >= size || j === 0) {
					this._pages.push({
						start: i - lower,
						end: i - lower + size - 1
					});
					j = 0, ++k;
				}
				j += this._core.mergers(this._core.relative(i));
			}
		}
	}

	/**
	 * Draws the user interface.
	 * @todo The option `dotData` wont work.
	 * @protected
	 */
	Navigation.prototype.draw = function() {
		var difference, i, html = '',
			options = this._core.settings,
			$items = this._core.$stage.children(),
			index = this._core.relative(this._core.current());

		if (options.nav && !options.loop && !options.navRewind) {
			this._controls.$previous.toggleClass('disabled', index <= 0);
			this._controls.$next.toggleClass('disabled', index >= this._core.maximum());
		}

		this._controls.$previous.toggle(options.nav);
		this._controls.$next.toggle(options.nav);

		if (options.dots) {
			difference = this._pages.length - this._controls.$indicators.children().length;

			if (options.dotData && difference !== 0) {
				for (i = 0; i < this._controls.$indicators.children().length; i++) {
					html += this._templates[this._core.relative(i)];
				}
				this._controls.$indicators.html(html);
			} else if (difference > 0) {
				html = new Array(difference + 1).join(this._templates[0]);
				this._controls.$indicators.append(html);
			} else if (difference < 0) {
				this._controls.$indicators.children().slice(difference).remove();
			}

			this._controls.$indicators.find('.active').removeClass('active');
			this._controls.$indicators.children().eq($.inArray(this.current(), this._pages)).addClass('active');
		}

		this._controls.$indicators.toggle(options.dots);
	}

	/**
	 * Extends event data.
	 * @protected
	 * @param {Event} event - The event object which gets thrown.
	 */
	Navigation.prototype.onTrigger = function(event) {
		var settings = this._core.settings;

		event.page = {
			index: $.inArray(this.current(), this._pages),
			count: this._pages.length,
			size: settings && (settings.center || settings.autoWidth || settings.dotData
				? 1 : settings.dotsEach || settings.items)
		};
	}

	/**
	 * Gets the current page position of the carousel.
	 * @protected
	 * @returns {Number}
	 */
	Navigation.prototype.current = function() {
		var index = this._core.relative(this._core.current());
		return $.grep(this._pages, function(o) {
			return o.start <= index && o.end >= index;
		}).pop();
	}

	/**
	 * Gets the current succesor/predecessor position.
	 * @protected
	 * @returns {Number}
	 */
	Navigation.prototype.getPosition = function(successor) {
		var position, length,
			options = this._core.settings;

		if (options.slideBy == 'page') {
			position = $.inArray(this.current(), this._pages);
			length = this._pages.length;
			successor ? ++position : --position;
			position = this._pages[((position % length) + length) % length].start;
		} else {
			position = this._core.relative(this._core.current());
			length = this._core.items().length;
			successor ? position += options.slideBy : position -= options.slideBy;
		}
		return position;
	}

	/**
	 * Slides to the next item or page.
	 * @public
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.
	 */
	Navigation.prototype.next = function(speed) {
		$.proxy(this._overrides.to, this._core)(this.getPosition(true), speed);
	}

	/**
	 * Slides to the previous item or page.
	 * @public
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.
	 */
	Navigation.prototype.prev = function(speed) {
		$.proxy(this._overrides.to, this._core)(this.getPosition(false), speed);
	}

	/**
	 * Slides to the specified item or page.
	 * @public
	 * @param {Number} position - The position of the item or page.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 * @param {Boolean} [standard=false] - Whether to use the standard behaviour or not.
	 */
	Navigation.prototype.to = function(position, speed, standard) {
		var length;

		if (!standard) {
			length = this._pages.length;
			$.proxy(this._overrides.to, this._core)(this._pages[((position % length) + length) % length].start, speed);
		} else {
			$.proxy(this._overrides.to, this._core)(position, speed);
		}
	}

	$.fn.owlCarousel.Constructor.Plugins.Navigation = Navigation;

})(window.Zepto || window.jQuery, window, document);

/**
 * Hash Plugin
 * @version 2.0.0
 * @author Artus Kolanowski
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {
	'use strict';

	/**
	 * Creates the hash plugin.
	 * @class The Hash Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var Hash = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Hash table for the hashes.
		 * @protected
		 * @type {Object}
		 */
		this._hashes = {};

		/**
		 * The carousel element.
		 * @type {jQuery}
		 */
		this.$element = this._core.$element;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function() {
				if (this._core.settings.startPosition == 'URLHash') {
					$(window).trigger('hashchange.owl.navigation');
				}
			}, this),
			'prepared.owl.carousel': $.proxy(function(e) {
				var hash = $(e.content).find('[data-hash]').andSelf('[data-hash]').attr('data-hash');
				this._hashes[hash] = e.content;
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Hash.Defaults, this._core.options);

		// register the event handlers
		this.$element.on(this._handlers);

		// register event listener for hash navigation
		$(window).on('hashchange.owl.navigation', $.proxy(function() {
			var hash = window.location.hash.substring(1),
				items = this._core.$stage.children(),
				position = this._hashes[hash] && items.index(this._hashes[hash]) || 0;

			if (!hash) {
				return false;
			}

			this._core.to(position, false, true);
		}, this));
	}

	/**
	 * Default options.
	 * @public
	 */
	Hash.Defaults = {
		URLhashListener: false
	}

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Hash.prototype.destroy = function() {
		var handler, property;

		$(window).off('hashchange.owl.navigation');

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	}

	$.fn.owlCarousel.Constructor.Plugins.Hash = Hash;

})(window.Zepto || window.jQuery, window, document);

/*!
 * jQuery Selectbox plugin 0.2
 *
 * Copyright 2011-2012, Dimitar Ivanov (http://www.bulgaria-web-developers.com/projects/javascript/selectbox/)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Date: Tue Jul 17 19:58:36 2012 +0300
 */
(function ($, undefined) {
	var PROP_NAME = 'selectbox',
		FALSE = false,
		TRUE = true,
		keyvalue = "",
		deviceAgent = navigator.userAgent.toLowerCase(),
		agentID = deviceAgent.match(/(iphone|ipod|ipad|android|blackBerry)/);
	/**
	 * Selectbox manager.
	 * Use the singleton instance of this class, $.selectbox, to interact with the select box.
	 * Settings for (groups of) select boxes are maintained in an instance object,
	 * allowing multiple different settings on the same page
	 */
	function Selectbox() {
		this._state = [];
		this._defaults = { // Global defaults for all the select box instances
			classHolder: "sbHolder",
			classHolderDisabled: "sbHolderDisabled",
			classSelector: "sbSelector",
			classOptions: "sbOptions",
			classGroup: "sbGroup",
			classSub: "sbSub",
			classDisabled: "sbDisabled",
			classToggleOpen: "sbToggleOpen",
			classToggle: "sbToggle",
			classFocus: "sbFocus",
			speed: 200,
			effect: "slide", // "slide" or "fade"
			onChange: null, //Define a callback function when the selectbox is changed
			onOpen: null, //Define a callback function when the selectbox is open
			onClose: null //Define a callback function when the selectbox is closed
			
		};
	}

	$.extend(Selectbox.prototype, {
		/**
		 * Is the first field in a jQuery collection open as a selectbox
		 * 
		 * @param {Object} target
		 * @return {Boolean}
		 */
		_isOpenSelectbox: function (target) {
			if (!target) {
				return FALSE;
			}
			var inst = this._getInst(target);
			return inst.isOpen;
		},
		/**
		 * Is the first field in a jQuery collection disabled as a selectbox
		 * 
		 * @param {HTMLElement} target
		 * @return {Boolean}
		 */
		_isDisabledSelectbox: function (target) {
			if (!target) {
				return FALSE;
			}
			var inst = this._getInst(target);
			return inst.isDisabled;
		},
		/**
		 * Attach the select box to a jQuery selection.
		 * 
		 * @param {HTMLElement} target
		 * @param {Object} settings
		 */
		_attachSelectbox: function (target, settings) {
			if (this._getInst(target)) {
				return FALSE;
			}
			var $target = $(target),
				self = this,
				inst = self._newInst($target),
				sbHolder, sbSelector, sbToggle, sbOptions,
				s = FALSE, optGroup = $target.find("optgroup"), opts = $target.find("option"), olen = opts.length;
				
			$target.attr("sb", inst.uid);
			
			$.extend(inst.settings, self._defaults, settings);
			self._state[inst.uid] = FALSE;
			if(agentID){$target.addClass('device-select');}else{$target.addClass('desktopselect');}
			
			
			function closeOthers() {
				var key, sel,
					uid = this.attr("id").split("_")[1];
				for (key in self._state) {
					if (key !== uid) {
						if (self._state.hasOwnProperty(key)) {
							sel = $("select[sb='" + key + "']")[0];
							if (sel) {
								self._closeSelectbox(sel);
							}
						}
					}
				}
			}
			
			
			sbHolder = $("<div>", {
				"id": "sbHolder_" + inst.uid,
				"class": inst.settings.classHolder,
				"tabindex": $target.attr("tabindex")
			});
			
			$target.removeAttr("tabindex");
			
			var sb_width = $target.css('width');
		    //alert(sb_width);
			//sbHolder.css('width', sb_width);
			sbSelector = $("<a>", {
				"id": "sbSelector_" + inst.uid,
				"href": "#",
				"class": inst.settings.classSelector,
				"click": function (e) {
					e.preventDefault();
					closeOthers.apply($(this), []);
					var uid = $(this).attr("id").split("_")[1];
					if (self._state[uid]) {
						self._closeSelectbox(target);
					} else {
						if(agentID == null || !agentID){self._openSelectbox(target);}
					}
				}
			});
			
			$(".items-per-page .sbSelector").each(function (i, e) {
			    var $e = $(e);
			    if ($e.text().length > 8) {
			        $e.addClass("sbLineHeight");
			    }
			    else {
			    	$e.removeClass("sbLineHeight");
			    };
			});
			
			sbToggle = $("<a>", {
				"id": "sbToggle_" + inst.uid,
				"href": "#",
				"class": inst.settings.classToggle,
				"click": function (e) {
					e.preventDefault();
					closeOthers.apply($(this), []);
					var uid = $(this).attr("id").split("_")[1];
					if (self._state[uid]) {
						self._closeSelectbox(target);
					} else {
						if(agentID == null || !agentID){self._openSelectbox(target);}
					}
				}
			});
			sbToggle.appendTo(sbHolder);

			sbOptions = $("<ul>", {
				"id": "sbOptions_" + inst.uid,
				"class": inst.settings.classOptions,
				"css": {
					"display": "none"
				}
			});
			
			$target.children().each(function(i) {
			
				var that = $(this), li, config = {};
				if (that.is("option")) {
					getOptions(that);
				} else if (that.is("optgroup")) {
					li = $("<li>");
					$("<span>", {
						"text": that.attr("label")
					}).addClass(inst.settings.classGroup).appendTo(li);
					li.appendTo(sbOptions);
					if (that.is(":disabled")) {
						config.disabled = true;
					}
					config.sub = true;
					getOptions(that.find("option"), config);
				}
			});
			
		 
			function getOptions () {
				var sub = arguments[1] && arguments[1].sub ? true : false,
					disabled = arguments[1] && arguments[1].disabled ? true : false;
				arguments[0].each(function (i) {
					var that = $(this),
						li = $("<li>"),
						child;
					if (that.is(":selected")) {
						sbSelector.text(that.text());
						s = TRUE;
					}
					if (i === olen - 1) {
						li.addClass("last");
					}
					if (!that.is(":disabled") && !disabled) {
						child = $("<a>", {
							"href": "#" + that.val(),
							"rel": that.val()
						}).text(that.text()).bind("click.sb", function (e) {
							if (e && e.preventDefault) {
								e.preventDefault();
							}
							var t = sbToggle,
							 	$this = $(this),
								uid = t.attr("id").split("_")[1];
							self._changeSelectbox(target, $this.attr("rel"), $this.text());
							$this.parent().siblings().find("a").removeClass(inst.settings.classFocus);
							$this.addClass(inst.settings.classFocus);
							self._closeSelectbox(target);
						}).bind("mouseover.sb", function () {
							var $this = $(this);
							//$this.parent().siblings().find("a").removeClass(inst.settings.classFocus);
							//$this.addClass(inst.settings.classFocus);
						}).bind("mouseout.sb", function () {
							//$(this).removeClass(inst.settings.classFocus);
						});
						if (sub) {
							child.addClass(inst.settings.classSub);
						}
						if (that.is(":selected")) {
							child.addClass(inst.settings.classFocus);
						}
						child.appendTo(li);
					} else {
						child = $("<span>", {
							"text": that.text()
						}).addClass(inst.settings.classDisabled);
						if (sub) {
							child.addClass(inst.settings.classSub);
						}
						child.appendTo(li);
					}
					li.appendTo(sbOptions);
				});
			}
			
			if (!s) {
				sbSelector.text(opts.first().text());
			}

			$.data(target, PROP_NAME, inst);
			 
			
			sbHolder.data("uid", inst.uid).bind("keydown.sb", function (e) {
				var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0,
					$this = $(this),
					uid = $this.data("uid"),
					inst = $this.siblings("select[sb='"+uid+"']").data(PROP_NAME),
					trgt = $this.siblings(["select[sb='", uid, "']"].join("")).get(0),
					$f = $this.find("ul").find("a." + inst.settings.classFocus),
					$currentkeycode = "";
				
				switch (key) {
					case 37: //Arrow Left
					case 38: //Arrow Up
						var $next;
						$("a", $this).removeClass(inst.settings.classFocus);
						if ($f.length > 0) {
							$next = $f.parent().prevAll("li:has(a)").eq(0).find("a");
						} else {
							$next = $this.find("ul").find("a").eq(0);
						}
						if ($next.length > 0) {
							$next.addClass(inst.settings.classFocus).focus();
							$("#sbSelector_" + uid).text($next.text());
						}
						keyvalue = "";
						break;		
					case 39: //Arrow Right
					case 40: //Arrow Down
						var $next;
						$("a", $this).removeClass(inst.settings.classFocus);
						if ($f.length > 0) {
							$next = $f.parent().nextAll("li:has(a)").eq(0).find("a");
						} else {
							$next = $this.find("ul").find("a").eq(0);
						}
						if ($next.length > 0) {
							$next.addClass(inst.settings.classFocus).focus();
							$("#sbSelector_" + uid).text($next.text());
						}
						keyvalue = "";
						break;				
					case 13: //Enter
						if ($f.length > 0) {
							self._changeSelectbox(trgt, $f.attr("rel"), $f.text());
						}
						self._closeSelectbox(trgt);
						break;
					case 9: //Tab
						if (trgt) {
							var inst = self._getInst(trgt);
							if (inst/* && inst.isOpen*/) {
								if ($f.length > 0) {
									self._changeSelectbox(trgt, $f.attr("rel"), $f.text());
								}
								self._closeSelectbox(trgt);
							}
						}
						var i = parseInt($this.attr("tabindex"), 10);
						if (!e.shiftKey) {
							i++;
						} else {
							i--;
						}
						$("*[tabindex='" + i + "']").focus();
						break;
					case 27: //Escape
						self._closeSelectbox(trgt);
						break;
					case 96: //Escape
						$currentkeycode = 0;
						break;
					case 97: //Escape
						$currentkeycode = "1";
						break;
					case 98: //Escape
						$currentkeycode = "2";
						break;
					case 99: //Escape
						$currentkeycode = "3";
						break;
					case 100: //Escape
						$currentkeycode = "4";
						break;
					case 101: //Escape
						$currentkeycode = "5";
						break;
					case 102: //Escape
						$currentkeycode = "6";
						break;		
					case 103: //Escape
						$currentkeycode = "7";
						break;
					case 104: //Escape
						$currentkeycode = "8";
						break;
					case 105: //Escape
						$currentkeycode = "9";
						break;						
				}
				
				if((key >= 48 && key <= 57) || (key >= 65 && key <= 90) || (key >= 96 && key <= 105)){
					if((key >= 48 && key <= 57) || (key >= 65 && key <= 90)){
						$currentkeycode = String.fromCharCode(key).toLowerCase();	
					}
					 if(keyvalue.length == 0){
						 keyvalue = $currentkeycode
					 }else{
						 keyvalue = keyvalue + $currentkeycode;
					 }
					 var $count = 0;
					 
					 var filteredresults = $this.find('.sbOptions li').filter(function() { return $(this).text().toLowerCase().indexOf(keyvalue) === 0; });
					 $.each(filteredresults, function(i,v){
						if(!$(this).find('a').hasClass(inst.settings.classFocus)){
							self._changeSelectbox(trgt, $(this).find('a').attr("rel"), $(this).find('a').text());
							$this.find('.sbOptions li').find('a').removeClass(inst.settings.classFocus);
							$(this).find('a').addClass(inst.settings.classFocus);
							$count++;
							return false;
						} 
					 });
					 
					 var $next = $this.find('.sbOptions li a.'+inst.settings.classFocus).closest('li').next(),
					 	 $nexttext = $next.text().toLowerCase().indexOf($currentkeycode);
					 
					 if(filteredresults.length == 0 && $next.length != 0 && $nexttext === 0){
						 self._changeSelectbox(trgt, $next.find('a').attr("rel"), $next.find('a').text());
						$this.find('.sbOptions li').find('a').removeClass(inst.settings.classFocus);
						$next.find('a').addClass(inst.settings.classFocus);
						$count++;
						return false;
					 }
					 
					 if($count == 0){
						keyvalue = "";
					 }
				}
				e.stopPropagation();
				return false;
			}).delegate("a", "mouseover", function (e) {
				//$(this).addClass(inst.settings.classFocus);
				keyvalue = "";
			}).delegate("a", "mouseout", function (e) {
				//$(this).removeClass(inst.settings.classFocus);	
				keyvalue = "";
			});
			
			sbSelector.appendTo(sbHolder);
			sbOptions.appendTo(sbHolder);			
			sbHolder.insertAfter($target);
			
			$("html").on('mousedown', function(e) {
				e.stopPropagation();          
				$("select").selectbox('close'); 
			});
			$([".", inst.settings.classHolder, ", .", inst.settings.classSelector].join("")).mousedown(function(e) {    
				e.stopPropagation();
			});
		},
		/**
		 * Remove the selectbox functionality completely. This will return the element back to its pre-init state.
		 * 
		 * @param {HTMLElement} target
		 */
		_detachSelectbox: function (target) {
			var inst = this._getInst(target);
			if (!inst) {
				return FALSE;
			}
			$("#sbHolder_" + inst.uid).remove();
			$.data(target, PROP_NAME, null);
			$(target).show();			
		},
		/**
		 * Change selected attribute of the selectbox.
		 * 
		 * @param {HTMLElement} target
		 * @param {String} value
		 * @param {String} text
		 */
		_changeSelectbox: function (target, value, text) {
			var onChange,
				inst = this._getInst(target);
			if (inst) {
				onChange = this._get(inst, 'onChange');
				$("#sbSelector_" + inst.uid).text(text);
			}
			value = value.replace(/\'/g, "\\'");
			$(target).find("option[value='" + value + "']").attr("selected", TRUE);
			if (inst && onChange) {
				onChange.apply((inst.input ? inst.input[0] : null), [value, inst]);
			} else if (inst && inst.input) {
				inst.input.trigger('change');
			}
			inst.input.focus().click();
		},
		/**
		 * Enable the selectbox.
		 * 
		 * @param {HTMLElement} target
		 */
		_enableSelectbox: function (target) {
			var inst = this._getInst(target);
			if (!inst || !inst.isDisabled) {
				return FALSE;
			}
			$("#sbHolder_" + inst.uid).removeClass(inst.settings.classHolderDisabled);
			inst.isDisabled = FALSE;
			$.data(target, PROP_NAME, inst);
		},
		/**
		 * Disable the selectbox.
		 * 
		 * @param {HTMLElement} target
		 */
		_disableSelectbox: function (target) {
			var inst = this._getInst(target);
			if (!inst || inst.isDisabled) {
				return FALSE;
			}
			$("#sbHolder_" + inst.uid).addClass(inst.settings.classHolderDisabled);
			inst.isDisabled = TRUE;
			$.data(target, PROP_NAME, inst);
		},
		/**
		 * Get or set any selectbox option. If no value is specified, will act as a getter.
		 * 
		 * @param {HTMLElement} target
		 * @param {String} name
		 * @param {Object} value
		 */
		_optionSelectbox: function (target, name, value) {
			var inst = this._getInst(target);
			if (!inst) {
				return FALSE;
			}
			//TODO check name
			inst[name] = value;
			$.data(target, PROP_NAME, inst);
		},
		/**
		 * Call up attached selectbox
		 * 
		 * @param {HTMLElement} target
		 */
		_openSelectbox: function (target) {
			var inst = this._getInst(target);
			//if (!inst || this._state[inst.uid] || inst.isDisabled) {
			if (!inst || inst.isOpen || inst.isDisabled) {
				return;
			}
			var	el = $("#sbOptions_" + inst.uid),
				viewportHeight = parseInt($(window).height(), 10),
				offset = $("#sbHolder_" + inst.uid).offset(),
				scrollTop = $(window).scrollTop(),
				height = el.prev().height(),
				diff = viewportHeight - (offset.top - scrollTop) - height / 2,
				onOpen = this._get(inst, 'onOpen');
			el.css({
				"top": height + "px"
				//"maxHeight": (diff - height) + "px" Commented out by Kyle
			});
			inst.settings.effect === "fade" ? el.fadeIn(inst.settings.speed) : el.slideDown(inst.settings.speed);
			$("#sbToggle_" + inst.uid).addClass(inst.settings.classToggleOpen);
			$("#sbToggle_" + inst.uid).next().addClass('active');
			this._state[inst.uid] = TRUE;
			inst.isOpen = TRUE;
			if (onOpen) {
				onOpen.apply((inst.input ? inst.input[0] : null), [inst]);
			}
			$.data(target, PROP_NAME, inst);
		},
		/**
		 * Close opened selectbox
		 * 
		 * @param {HTMLElement} target
		 */
		_closeSelectbox: function (target) {
			var inst = this._getInst(target);
			//if (!inst || !this._state[inst.uid]) {
			if (!inst || !inst.isOpen) {
				return;
			}
			var onClose = this._get(inst, 'onClose');
			inst.settings.effect === "fade" ? $("#sbOptions_" + inst.uid).fadeOut(inst.settings.speed) : $("#sbOptions_" + inst.uid).slideUp(inst.settings.speed);
			$("#sbToggle_" + inst.uid).removeClass(inst.settings.classToggleOpen);
			$("#sbToggle_" + inst.uid).next().removeClass('active');
			this._state[inst.uid] = FALSE;
			inst.isOpen = FALSE;
			if (onClose) {
				onClose.apply((inst.input ? inst.input[0] : null), [inst]);
			}
			$.data(target, PROP_NAME, inst);
			keyvalue = "";
		},
		/**
		 * Create a new instance object
		 * 
		 * @param {HTMLElement} target
		 * @return {Object}
		 */
		_newInst: function(target) {
			var id = target[0].id.replace(/([^A-Za-z0-9_-])/g, '\\\\$1');
			return {
				id: id, 
				input: target, 
				uid: Math.floor(Math.random() * 99999999),
				isOpen: FALSE,
				isDisabled: FALSE,
				settings: {}
			}; 
		},
		/**
		 * Retrieve the instance data for the target control.
		 * 
		 * @param {HTMLElement} target
		 * @return {Object} - the associated instance data
		 * @throws error if a jQuery problem getting data
		 */
		_getInst: function(target) {
			try {
				return $.data(target, PROP_NAME);
			}
			catch (err) {
				throw 'Missing instance data for this selectbox';
			}
		},
		/**
		 * Get a setting value, defaulting if necessary
		 * 
		 * @param {Object} inst
		 * @param {String} name
		 * @return {Mixed}
		 */
		_get: function(inst, name) {
			return inst.settings[name] !== undefined ? inst.settings[name] : this._defaults[name];
		}
	});

	/**
	 * Invoke the selectbox functionality.
	 * 
	 * @param {Object|String} options
	 * @return {Object}
	 */
	$.fn.selectbox = function (options) {
		
		var otherArgs = Array.prototype.slice.call(arguments, 1);
		if (typeof options == 'string' && options == 'isDisabled') {
			return $.selectbox['_' + options + 'Selectbox'].apply($.selectbox, [this[0]].concat(otherArgs));
		}
		
		if (options == 'option' && arguments.length == 2 && typeof arguments[1] == 'string') {
			return $.selectbox['_' + options + 'Selectbox'].apply($.selectbox, [this[0]].concat(otherArgs));
		}
		
		return this.each(function() {
			typeof options == 'string' ?
				$.selectbox['_' + options + 'Selectbox'].apply($.selectbox, [this].concat(otherArgs)) :
				$.selectbox._attachSelectbox(this, options);
				
		});
	};
	
	$.selectbox = new Selectbox(); // singleton instance
	$.selectbox.version = "0.2";
	 
})(jQuery);
;(function (factory)
{
    if (typeof define === 'function' && define.amd)
    {
        define(['jquery'], factory);
    }
    else if (typeof exports === 'object')
    {
        factory(require('jquery'));
    }
    else
    {
        factory(jQuery);
    }
}
(function ($)
{
    "use strict";

    var pluginName = "tinyscrollbar"
    ,   defaults   =
        {
            axis         : 'y'    // Vertical or horizontal scrollbar? ( x || y ).
        ,   wheel        : true   // Enable or disable the mousewheel;
        ,   wheelSpeed   : 40     // How many pixels must the mouswheel scroll at a time.
        ,   wheelLock    : true   // Lock default scrolling window when there is no more content.
        ,   scrollInvert : true  // Enable invert style scrolling
        ,   trackSize    : false  // Set the size of the scrollbar to auto or a fixed number.
        ,   thumbSize    : 30  // Set the size of the thumb to auto or a fixed number
        }
    ;

    function Plugin($container, options)
    {
        this.options   = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name     = pluginName;

        var self        = this
        ,   $viewport   = $container.find(".viewport")
        ,   $overview   = $container.find(".overview")
        ,   $scrollbar  = $container.find(".scrollbar")
        ,   $track      = $scrollbar.find(".track")
        ,   $thumb      = $scrollbar.find(".thumb")

        ,   mousePosition  = 0

        ,   isHorizontal   = this.options.axis === 'x'
        ,   hasTouchEvents = ("ontouchstart" in document.documentElement)
        ,   wheelEvent     = ("onwheel" in document || document.documentMode >= 9) ? "wheel" :
                             (document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll")

                             ,   sizeLabel = isHorizontal ? "width" : "height"
        ,   posiLabel = isHorizontal ? "left" : "top"
        ;

        this.contentPosition = 0;
        this.viewportSize    = 0;
        this.contentSize     = 0;
        this.contentRatio    = 0;
        this.trackSize       = 0;
        this.trackRatio      = 0;
        this.thumbSize       = 0;
        this.thumbPosition   = 0;

        function initialize()
        {
            self.update();
            setEvents();

            return self;
        }

        this.update = function(scrollTo)
        {
            var sizeLabelCap  = sizeLabel.charAt(0).toUpperCase() + sizeLabel.slice(1).toLowerCase();
            this.viewportSize = $viewport[0]['offset'+ sizeLabelCap];
            this.contentSize  = $overview[0]['scroll'+ sizeLabelCap];
            this.contentRatio = this.viewportSize / this.contentSize;
            this.trackSize    = this.options.trackSize || this.viewportSize;
            this.thumbSize    = Math.min(this.trackSize, Math.max(0, (this.options.thumbSize || (this.trackSize * this.contentRatio))));
            this.trackRatio   = this.options.thumbSize ? (this.contentSize - this.viewportSize) / (this.trackSize - this.thumbSize) : (this.contentSize / this.trackSize);
            mousePosition     = $track.offset().top;

            $scrollbar.toggleClass("disable", this.contentRatio >= 1);
            switch (scrollTo)
            {
                case "bottom":
                    this.contentPosition = this.contentSize - this.viewportSize;
                    break;

                case "relative":
                    this.contentPosition = Math.min(Math.max(this.contentSize - this.viewportSize, 0), Math.max(0, this.contentPosition));
                    break;

                default:
                    this.contentPosition = parseInt(scrollTo, 10) || 0;
            }

            setSize();

            return self;
        };

        function setSize()
        {
            $thumb.css(posiLabel, self.contentPosition / self.trackRatio);
            $overview.css(posiLabel, -self.contentPosition);
            $scrollbar.css(sizeLabel, self.trackSize);
            $track.css(sizeLabel, self.trackSize);
            $thumb.css(sizeLabel, self.thumbSize);
        }

        function setEvents()
        {
            if(hasTouchEvents)
            {
                $viewport[0].ontouchstart = function(event)
                {
                    if(1 === event.touches.length)
                    {
                        event.stopPropagation();

                        start(event.touches[0]);
                    }
                };
            }
            else
            {
                $thumb.bind("mousedown", start);
                $track.bind("mousedown", drag);
            }

            $(window).resize(function()
            {
                self.update("relative");
            });

            if(self.options.wheel && window.addEventListener)
            {
                $container[0].addEventListener(wheelEvent, wheel, false );
            }
            else if(self.options.wheel)
            {
                $container[0].onmousewheel = wheel;
            }
        }

        function start(event)
        {
            $("body").addClass("noSelect");

            mousePosition      = isHorizontal ? event.pageX : event.pageY;
            self.thumbPosition = parseInt($thumb.css(posiLabel), 10) || 0;

            if(hasTouchEvents)
            {
                document.ontouchmove = function(event)
                {
                    event.preventDefault();
                    drag(event.touches[0]);
                };
                document.ontouchend = end;
            }
            else
            {
                $(document).bind("mousemove", drag);
                $(document).bind("mouseup", end);
                $thumb.bind("mouseup", end);
            }
        }

        function wheel(event)
        {
            if(self.contentRatio < 1)
            {
                var evntObj         = event || window.event
                ,   deltaDir        = "delta" + self.options.axis.toUpperCase()
                ,   wheelSpeedDelta = -(evntObj[deltaDir] || evntObj.detail || (-1 / 3 * evntObj.wheelDelta)) / 40
                ;

                self.contentPosition -= wheelSpeedDelta * self.options.wheelSpeed;
                self.contentPosition = Math.min((self.contentSize - self.viewportSize), Math.max(0, self.contentPosition));

                $container.trigger("move");

                $thumb.css(posiLabel, self.contentPosition / self.trackRatio);
                $overview.css(posiLabel, -self.contentPosition);

                if(self.options.wheelLock || (self.contentPosition !== (self.contentSize - self.viewportSize) && self.contentPosition !== 0))
                {
                    evntObj = $.event.fix(evntObj);
                    evntObj.preventDefault();
                }
            }
        }

        function drag(event)
        {
            if(self.contentRatio < 1)
            {
                var mousePositionNew   = isHorizontal ? event.pageX : event.pageY
                ,   thumbPositionDelta = mousePositionNew - mousePosition
                ;

                if(self.options.scrollInvert && hasTouchEvents)
                {
                    thumbPositionDelta = mousePosition - mousePositionNew;
                }

                var thumbPositionNew = Math.min((self.trackSize - self.thumbSize), Math.max(0, self.thumbPosition + thumbPositionDelta));
                self.contentPosition = thumbPositionNew * self.trackRatio;

                $container.trigger("move");

                $thumb.css(posiLabel, thumbPositionNew);
                $overview.css(posiLabel, -self.contentPosition);
            }
        }

        function end()
        {
            $("body").removeClass("noSelect");
            $(document).unbind("mousemove", drag);
            $(document).unbind("mouseup", end);
            $thumb.unbind("mouseup", end);
            document.ontouchmove = document.ontouchend = null;
        }

        return initialize();
    }

    $.fn[pluginName] = function(options)
    {
        return this.each(function()
        {
            if(!$.data(this, "plugin_" + pluginName))
            {
                $.data(this, "plugin_" + pluginName, new Plugin($(this), options));
            }
        });
    };
}));
/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.0
 *
 */
(function($) {

  jQuery.fn.extend({
    slimScroll: function(options) {
      var defaults = {

        // width in pixels of the visible scroll area
        width : 'auto',

        // height in pixels of the visible scroll area
      //  height : newscrollheight,

        // width in pixels of the scrollbar and rail
        size : '7px',

        // scrollbar color, accepts any hex/color value
        color: '#000',

        // scrollbar position - left/right
        position : 'right',

        // distance in pixels between the side edge and the scrollbar
        distance : '1px',

        // default scroll position on load - top / bottom / $('selector')
        start : 'top',

        // sets scrollbar opacity
        opacity : .4,

        // enables always-on mode for the scrollbar
        alwaysVisible : false,

        // check if we should hide the scrollbar when user is hovering over
        disableFadeOut : false,

        // sets visibility of the rail
        railVisible : false,

        // sets rail color
        railColor : '#333',

        // sets rail opacity
        railOpacity : .2,

        // whether  we should use jQuery UI Draggable to enable bar dragging
        railDraggable : true,

        // defautlt CSS class of the slimscroll rail
        railClass : 'slimScrollRail',

        // defautlt CSS class of the slimscroll bar
        barClass : 'slimScrollBar',

        // defautlt CSS class of the slimscroll wrapper
        wrapperClass : 'slimScrollDiv',

        // check if mousewheel should scroll the window if we reach top/bottom
        allowPageScroll : false,

        // scroll amount applied to each mouse wheel step
        wheelStep : 100,

        // scroll amount applied when user is using gestures
        touchScrollStep : 200,

        // sets border radius
        borderRadius: '7px',

        // sets border radius of the rail
        railBorderRadius : '7px'
      };

      var o = $.extend(defaults, options);

      // do it for every element that matches selector
      this.each(function(){

      var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
        barHeight, percentScroll, lastScroll,
        divS = '<div></div>',
        minBarHeight = 30,
        releaseScroll = false;

        // used in event handlers and for better minification
        var me = $(this);

        // ensure we are not binding it again
        if (me.parent().hasClass(o.wrapperClass))
        {
            // start from last bar position
            var offset = me.scrollTop();

            // find bar and rail
            bar = me.parent().find('.' + o.barClass);
            rail = me.parent().find('.' + o.railClass);

            getBarHeight();

            // check if we should scroll existing instance
            if ($.isPlainObject(options))
            {
              // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
              if ( 'height' in options && options.height == 'auto' ) {
                me.parent().css('height', 'auto');
                me.css('height', 'auto');
                var height = me.parent().parent().height();
                me.parent().css('height', height);
                me.css('height', height);
              }

              if ('scrollTo' in options)
              {
                // jump to a static point
                offset = parseInt(o.scrollTo);
              }
              else if ('scrollBy' in options)
              {
                // jump by value pixels
                offset += parseInt(o.scrollBy);
              }
              else if ('destroy' in options)
              {
                // remove slimscroll elements
                bar.remove();
                rail.remove();
                me.unwrap();
                return;
              }

              // scroll content by the given offset
              scrollContent(offset, false, true);
            }

            return;
        }

        // optionally set height to the parent's height
        o.height = (o.height == 'auto') ? me.parent().height() : o.height;

        // wrap content
        var wrapper = $(divS)
          .addClass(o.wrapperClass)
          .css({
            position: 'relative',
            overflow: 'hidden',
            width: o.width,
            height: o.height
          });

        // update style for the div
        me.css({
          overflow: 'hidden',
          width: o.width,
          height: o.height
        });

        // create scrollbar rail
        var rail = $(divS)
          .addClass(o.railClass)
          .css({
            width: o.size,
            height: '100%',
            position: 'absolute',
            top: 0,
            display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
            'border-radius': o.railBorderRadius,
            background: o.railColor,
            opacity: o.railOpacity,
            zIndex: 90
          });

        // create scrollbar
        var bar = $(divS)
          .addClass(o.barClass)
          .css({
            background: o.color,
            width: o.size,
            position: 'absolute',
            top: 0,
            opacity: o.opacity,
            display: o.alwaysVisible ? 'block' : 'none',
            'border-radius' : o.borderRadius,
            BorderRadius: o.borderRadius,
            MozBorderRadius: o.borderRadius,
            WebkitBorderRadius: o.borderRadius,
            zIndex: 99
          });

        // set position
        var posCss = (o.position == 'right') ? { right: o.distance } : { left: o.distance };
        rail.css(posCss);
        bar.css(posCss);

        // wrap it
        me.wrap(wrapper);

        // append to parent div
        me.parent().append(bar);
        me.parent().append(rail);

        // make it draggable and no longer dependent on the jqueryUI
        if (o.railDraggable){
          bar.on("mousedown", function(e) {
            var $doc = $(document);
            isDragg = true;
            t = parseFloat(bar.css('top'));
            pageY = e.pageY;

            $doc.on("mousemove.slimscroll", function(e){
              currTop = t + e.pageY - pageY;
              bar.css('top', currTop);
              scrollContent(0, bar.position().top, false);// scroll content
            });

            $doc.on("mouseup.slimscroll", function(e) {
              isDragg = false;hideBar();
              $doc.unbind('.slimscroll');
            });
            return false;
          }).on("selectstart.slimscroll", function(e){
            e.stopPropagation();
            e.preventDefault();
            return false;
          });
        }

        // on rail over
        rail.on('hover(', function(){
          showBar();
        }, function(){
          // hideBar();
        });

        // on bar over
        bar.on('hover', function(){
          isOverBar = true;
        }, function(){
          isOverBar = false;
        });

        // show on parent mouseover
        me.on('hover', function(){
          isOverPanel = true;
          showBar();
         // hideBar();
        }, function(){
          isOverPanel = false;
          //hideBar();
          showBar();
        });

        // support for mobile
        me.on('touchstart', function(e,b){
          if (e.originalEvent.touches.length)
          {
            // record where touch started
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        me.on('touchmove', function(e){
          // prevent scrolling the page if necessary
          if(!releaseScroll)
          {
  		      e.originalEvent.preventDefault();
		      }
          if (e.originalEvent.touches.length)
          {
            // see how far user swiped
            var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
            // scroll content
            scrollContent(diff, true);
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        bar.on('touchstart', function(e,b){
	        if (e.originalEvent.touches.length)
	        {
	          // record where touch started
	          touchDif = e.originalEvent.touches[0].pageY;
	        }
	      });

	    bar.on('touchmove', function(e){
          // prevent scrolling the page if necessary
          if(!releaseScroll)
          {
  		      e.originalEvent.preventDefault();
		      }
          if (e.originalEvent.touches.length)
          {
            // see how far user swiped
            var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
            // scroll content
            scrollContent(diff, true);
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });
        // set up initial height
        getBarHeight();

        // check start position
        if (o.start === 'bottom')
        {
          // scroll content to bottom
          bar.css({ top: me.outerHeight() - bar.outerHeight() });
          scrollContent(0, true);
        }
        else if (o.start !== 'top')
        {
          // assume jQuery selector
          scrollContent($(o.start).position().top, null, true);

          // make sure bar stays hidden
          if (!o.alwaysVisible) { bar.hide(); }
        }

        // attach scroll events
        attachWheel();

        function _onWheel(e)
        {
          // use mouse wheel only when mouse is over
          if (!isOverPanel) { return; }

          var e = e || window.event;

          var delta = 0;
          if (e.wheelDelta) { delta = -e.wheelDelta/120; }
          if (e.detail) { delta = e.detail / 3; }

          var target = e.target || e.srcTarget || e.srcElement;
          if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
            // scroll content
            scrollContent(delta, true);
          }

          // stop window scroll
          if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
          if (!releaseScroll) { e.returnValue = false; }
        }

        function scrollContent(y, isWheel, isJump)
        {
          releaseScroll = false;
          var delta = y;
          var maxTop = me.outerHeight() - bar.outerHeight();

          if (isWheel)
          {
            // move bar with mouse wheel
            delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();

            // move bar, make sure it doesn't go out
            delta = Math.min(Math.max(delta, 0), maxTop);

            // if scrolling down, make sure a fractional change to the
            // scroll position isn't rounded away when the scrollbar's CSS is set
            // this flooring of delta would happened automatically when
            // bar.css is set below, but we floor here for clarity
            delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

            // scroll the scrollbar
            bar.css({ top: delta + 'px' });
          }

          // calculate actual scroll amount
          percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
          delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

          if (isJump)
          {
            delta = y;
            var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
            offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
            bar.css({ top: offsetTop + 'px' });
          }

          // scroll content
          me.scrollTop(delta);

          // fire scrolling event
          me.trigger('slimscrolling', ~~delta);

          // ensure bar is visible
          showBar();

          // trigger hide when scroll is stopped
          //hideBar();
        }

        function attachWheel()
        {
          if (window.addEventListener)
          {
            this.addEventListener('DOMMouseScroll', _onWheel, false );
            this.addEventListener('mousewheel', _onWheel, false );
            this.addEventListener('MozMousePixelScroll', _onWheel, false );
          }
          else
          {
            document.attachEvent("onmousewheel", _onWheel)
          }
        }

        function getBarHeight()
        {
          // calculate scrollbar height and make sure it is not too small
          barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
          bar.css({ height: barHeight + 'px' });

          // hide scrollbar if content is not long enough
          var display = barHeight == me.outerHeight() ? 'none' : 'block';
          bar.css({ display: display });
        }

        function showBar()
        {
          // recalculate bar height
          getBarHeight();
          clearTimeout(queueHide);

          // when bar reached top or bottom
          if (percentScroll == ~~percentScroll)
          {
            //release wheel
            releaseScroll = o.allowPageScroll;

            // publish approporiate event
            if (lastScroll != percentScroll)
            {
                var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
                me.trigger('slimscroll', msg);
            }
          }
          else
          {
            releaseScroll = false;
          }
          lastScroll = percentScroll;

          // show only when required
          if(barHeight >= me.outerHeight()) {
            //allow window scroll
            releaseScroll = true;
            return;
          }
          bar.stop(true,true).fadeIn('fast');
          if (o.railVisible) { rail.stop(true,true).fadeIn('fast'); }
        }

        function hideBar()
        {
          // only hide when options allow it
          if (!o.alwaysVisible)
          {
            queueHide = setTimeout(function(){
              if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg)
              {
                bar.fadeOut('slow');
                rail.fadeOut('slow');
              }
            }, 1000);
          }
        }

      });

      // maintain chainability
      return this;
    }
  });

  jQuery.fn.extend({
    slimscroll: jQuery.fn.slimScroll
  });

})(jQuery);

/*


   Magic Zoom Plus v5.1.14 
   Copyright 2016 Magic Toolbox
   Buy a license: https://www.magictoolbox.com/magiczoomplus/
   License agreement: https://www.magictoolbox.com/license/


*/
eval(function(m,a,g,i,c,k){c=function(e){return(e<a?'':c(parseInt(e/a)))+((e=e%a)>35?String.fromCharCode(e+29):e.toString(36))};if(!''.replace(/^/,String)){while(g--){k[c(g)]=i[g]||c(g)}i=[function(e){return k[e]}];c=function(){return'\\w+'};g=1};while(g--){if(i[g]){m=m.replace(new RegExp('\\b'+c(g)+'\\b','g'),i[g])}}return m}('1j.9N=(17(){1c y,A;y=A=(17(){1c U={4y:"hs.3-b5",cC:0,83:{},$aC:17(Y){1a(Y.$6c||(Y.$6c=++O.cC))},9d:17(Y){1a(O.83[Y]||(O.83[Y]={}))},$F:17(){},$1l:17(){1a 1l},$1r:17(){1a 1r},dj:"cK-"+1p.5P(1p.6x()*1t bE().d4()),3q:17(Y){1a(2z!=Y)},b7:17(Z,Y){1a(2z!=Z)?Z:Y},9e:17(Y){1a!!(Y)},1O:17(Y){if(!O.3q(Y)){1a 1l}if(Y.$4z){1a Y.$4z}if(!!Y.6p){if(1==Y.6p){1a"6f"}if(3==Y.6p){1a"dS"}}if(Y.1I&&Y.cO){1a"ht"}if(Y.1I&&Y.9j){1a"1Z"}if((Y 5b 1j.6C||Y 5b 1j.cb)&&Y.5i===O.3J){1a"41"}if(Y 5b 1j.6w){1a"49"}if(Y 5b 1j.cb){1a"17"}if(Y 5b 1j.6a){1a"1N"}if(O.1e.57){if(O.3q(Y.dw)){1a"1z"}}1k{if(Y===1j.1z||Y.5i==1j.1u||Y.5i==1j.f7||Y.5i==1j.d0||Y.5i==1j.hu||Y.5i==1j.hv){1a"1z"}}if(Y 5b 1j.bE){1a"ed"}if(Y 5b 1j.fp){1a"hq"}if(Y===1j){1a"1j"}if(Y===1m){1a"1m"}1a 7Z(Y)},26:17(ad,ac){if(!(ad 5b 1j.6w)){ad=[ad]}if(!ac){1a ad[0]}1T(1c ab=0,Z=ad.1I;ab<Z;ab++){if(!O.3q(ad)){8N}1T(1c aa in ac){if(!6C.2w.40.2c(ac,aa)){8N}3h{ad[ab][aa]=ac[aa]}3z(Y){}}}1a ad[0]},9a:17(ac,ab){if(!(ac 5b 1j.6w)){ac=[ac]}1T(1c aa=0,Y=ac.1I;aa<Y;aa++){if(!O.3q(ac[aa])){8N}if(!ac[aa].2w){8N}1T(1c Z in(ab||{})){if(!ac[aa].2w[Z]){ac[aa].2w[Z]=ab[Z]}}}1a ac[0]},cF:17(aa,Z){if(!O.3q(aa)){1a aa}1T(1c Y in(Z||{})){if(!aa[Y]){aa[Y]=Z[Y]}}1a aa},$3h:17(){1T(1c Z=0,Y=1Z.1I;Z<Y;Z++){3h{1a 1Z[Z]()}3z(aa){}}1a 1h},$A:17(aa){if(!O.3q(aa)){1a O.$([])}if(aa.cQ){1a O.$(aa.cQ())}if(aa.cO){1c Z=aa.1I||0,Y=1t 6w(Z);5U(Z--){Y[Z]=aa[Z]}1a O.$(Y)}1a O.$(6w.2w.bX.2c(aa))},6o:17(){1a 1t bE().d4()},4a:17(ac){1c aa;4F(O.1O(ac)){1D"8G":aa={};1T(1c ab in ac){aa[ab]=O.4a(ac[ab])}1G;1D"49":aa=[];1T(1c Z=0,Y=ac.1I;Z<Y;Z++){aa[Z]=O.4a(ac[Z])}1G;1R:1a ac}1a O.$(aa)},$:17(aa){1c Y=1r;if(!O.3q(aa)){1a 1h}if(aa.$aJ){1a aa}4F(O.1O(aa)){1D"49":aa=O.cF(aa,O.26(O.6w,{$aJ:O.$F}));aa.3e=aa.dq;1a aa;1G;1D"1N":1c Z=1m.dk(aa);if(O.3q(Z)){1a O.$(Z)}1a 1h;1G;1D"1j":1D"1m":O.$aC(aa);aa=O.26(aa,O.3C);1G;1D"6f":O.$aC(aa);aa=O.26(aa,O.3X);1G;1D"1z":aa=O.26(aa,O.1u);1G;1D"dS":1D"17":1D"49":1D"ed":1R:Y=1l;1G}if(Y){1a O.26(aa,{$aJ:O.$F})}1k{1a aa}},$1t:17(Y,aa,Z){1a O.$(O.dM.8b(Y)).7U(aa||{}).1y(Z||{})},6B:17(Z,ab,af){1c ac,aa,ad,ae=[],Y=-1;af||(af=O.dj);ac=O.$(af)||O.$1t("2m",{id:af,1v:"a1/65"}).21((1m.hk||1m.3D),"1H");aa=ac.dt||ac.dG;if("1N"!=O.1O(ab)){1T(1c ad in ab){ae.3b(ad+":"+ab[ad])}ab=ae.7f(";")}if(aa.dh){Y=aa.dh(Z+" {"+ab+"}",aa.hn.1I)}1k{Y=aa.ho(Z,ab)}1a Y},hw:17(ab,Y){1c aa,Z;aa=O.$(ab);if("6f"!==O.1O(aa)){1a}Z=aa.dt||aa.dG;if(Z.dF){Z.dF(Y)}1k{if(Z.dO){Z.dO(Y)}}},hx:17(){1a"hG-hF-hH-hI-hJ".4r(/[hE]/g,17(aa){1c Z=1p.6x()*16|0,Y=aa=="x"?Z:(Z&3|8);1a Y.7Q(16)}).7z()},6e:(17(){1c Y;1a 17(Z){if(!Y){Y=1m.8b("a")}Y.3F("6Q",Z);1a("!!"+Y.6Q).4r("!!","")}})(),hD:17(aa){1c ab=0,Y=aa.1I;1T(1c Z=0;Z<Y;++Z){ab=31*ab+aa.eN(Z);ab%=hz}1a ab}};1c O=U;1c P=U.$;if(!1j.dV){1j.dV=U;1j.$cK=U.$}O.6w={$4z:"49",4L:17(ab,ac){1c Y=13.1I;1T(1c Z=13.1I,aa=(ac<0)?1p.1V(0,Z+ac):ac||0;aa<Z;aa++){if(13[aa]===ab){1a aa}}1a-1},5S:17(Y,Z){1a 13.4L(Y,Z)!=-1},dq:17(Y,ab){1T(1c aa=0,Z=13.1I;aa<Z;aa++){if(aa in 13){Y.2c(ab,13[aa],aa,13)}}},2Y:17(Y,ad){1c ac=[];1T(1c ab=0,Z=13.1I;ab<Z;ab++){if(ab in 13){1c aa=13[ab];if(Y.2c(ad,13[ab],ab,13)){ac.3b(aa)}}}1a ac},hy:17(Y,ac){1c ab=[];1T(1c aa=0,Z=13.1I;aa<Z;aa++){if(aa in 13){ab[aa]=Y.2c(ac,13[aa],aa,13)}}1a ab}};O.9a(6a,{$4z:"1N",4T:17(){1a 13.4r(/^\\s+|\\s+$/g,"")},eq:17(Y,Z){1a(Z||1l)?(13.7Q()===Y.7Q()):(13.5l().7Q()===Y.5l().7Q())},5G:17(){1a 13.4r(/-\\D/g,17(Y){1a Y.9q(1).7z()})},9m:17(){1a 13.4r(/[A-Z]/g,17(Y){1a("-"+Y.9q(0).5l())})},hA:17(Y){1a 5K(13,Y||10)},hB:17(){1a 2u(13)},cN:17(){1a!13.4r(/1r/i,"").4T()},4G:17(Z,Y){Y=Y||"";1a(Y+13+Y).4L(Y+Z+Y)>-1}});U.9a(cb,{$4z:"17",1F:17(){1c Z=O.$A(1Z),Y=13,aa=Z.6W();1a 17(){1a Y.6q(aa||1h,Z.5L(O.$A(1Z)))}},2K:17(){1c Z=O.$A(1Z),Y=13,aa=Z.6W();1a 17(ab){1a Y.6q(aa||1h,O.$([ab||(O.1e.2B?1j.1z:1h)]).5L(Z))}},2H:17(){1c Z=O.$A(1Z),Y=13,aa=Z.6W();1a 1j.4J(17(){1a Y.6q(Y,Z)},aa||0)},e4:17(){1c Z=O.$A(1Z),Y=13;1a 17(){1a Y.2H.6q(Y,Z)}},dU:17(){1c Z=O.$A(1Z),Y=13,aa=Z.6W();1a 1j.fs(17(){1a Y.6q(Y,Z)},aa||0)}});1c V={},N=2v.hj.5l(),M=N.3E(/(3T|5Y|57|bQ)\\/(\\d+\\.?\\d*)/i),R=N.3E(/(hi|bR)\\/(\\d+\\.?\\d*)/i)||N.3E(/(cW|4o|a6|cZ|66|bR)\\/(\\d+\\.?\\d*)/i),T=N.3E(/4y\\/(\\d+\\.?\\d*)/i),I=1m.5n.2m;17 J(Z){1c Y=Z.9q(0).7z()+Z.bX(1);1a Z in I||("cY"+Y)in I||("d9"+Y)in I||("62"+Y)in I||("O"+Y)in I}O.1e={2J:{h0:!!(1m.gZ),h1:!!(1j.bV),at:!!(1m.eI),56:!!(1m.h2||1m.h3||1m.9F||1m.cy||1m.gY||1m.gX||1m.gS||1m.gR||1m.gT),e3:!!(1j.gU)&&!!(1j.gW)&&(1j.8W&&"gV"in 1t 8W),1X:J("1X"),2h:J("2h"),9v:J("9v"),cG:J("cG"),51:1l,cT:1l,8O:1l,5E:1l,7N:(17(){1a 1m.h4.h5("bm://bn.bq.bp/he/hd/hf#hg","1.1")})()},bU:17(){1a"hh"in 1j||(1j.cH&&1m 5b cH)||(2v.hc>0)||(2v.hb>0)}(),38:N.3E(/(6L|bb\\d+|h7).+|h6|h8\\/|h9|ha|hK|hL|ir|iq|is|ip(cJ|d5|ad)|it|iu|io |im|ii|ih|38.+cZ|ij|66 m(ik|in)i|il( iv)?|d8|p(iw|iF)\\/|iE|iG|iH|iI(4|6)0|iD|iC|iy\\.(1e|4e)|ix|iz|iA (ce|d8)|iB|ig/)?1r:1l,7C:(M&&M[1])?M[1].5l():(1j.66)?"bQ":!!(1j.ic)?"57":(2z!==1m.hU||1h!=1j.hT)?"5Y":(1h!==1j.hV||!2v.hW)?"3T":"hX",4y:(M&&M[2])?2u(M[2]):0,3B:(R&&R[1])?R[1].5l():"",6X:(R&&R[2])?2u(R[2]):0,8y:"",c4:"",4V:"",2B:0,4S:N.3E(/ip(?:ad|d5|cJ)/)?"a2":(N.3E(/(?:hR|6L)/)||2v.4S.3E(/hN|9s|hM/i)||["hO"])[0].5l(),cD:1m.9K&&"cP"==1m.9K.5l(),cS:0,48:17(){1a(1m.9K&&"cP"==1m.9K.5l())?1m.3D:1m.5n},51:1j.51||1j.hP||1j.hQ||1j.hY||1j.hZ||2z,9r:1j.9r||1j.cR||1j.cR||1j.i7||1j.i9||1j.ia||2z,2p:1l,7K:17(){if(O.1e.2p){1a}1c ab,aa;O.1e.2p=1r;O.3D=O.$(1m.3D);O.9s=O.$(1j);3h{1c Z=O.$1t("2Z").1y({1f:2M,1g:2M,78:"69",2j:"5v",1H:-gQ}).21(1m.3D);O.1e.cS=Z.dm-Z.df;Z.2T()}3z(Y){}3h{ab=O.$1t("2Z");aa=ab.2m;aa.cL="cU:2b(bT://),2b(bT://),i6 2b(bT://)";O.1e.2J.cT=(/(2b\\s*\\(.*?){3}/).3m(aa.cU);aa=1h;ab=1h}3z(Y){}if(!O.1e.7d){O.1e.7d=O.9l("2h").9m()}3h{ab=O.$1t("2Z");ab.2m.cL=O.9l("2Y").9m()+":5c(i5);";O.1e.2J.8O=!!ab.2m.1I&&(!O.1e.2B||O.1e.2B>9);ab=1h}3z(Y){}if(!O.1e.2J.8O){O.$(1m.5n).1B("6P-i1-3k")}3h{O.1e.2J.5E=(17(){1c ac=O.$1t("5E");1a!!(ac.cV&&ac.cV("2d"))})()}3z(Y){}if(2z===1j.i0&&2z!==1j.i2){V.2U="i3"}O.3C.2W.2c(O.$(1m),"9Y")}};(17(){1c ad=[],ac,ab,Z;17 Y(){1a!!(1Z.9j.aP)}4F(O.1e.7C){1D"57":if(!O.1e.4y){O.1e.4y=!!(1j.8W)?3:2}1G;1D"5Y":O.1e.4y=(R&&R[2])?2u(R[2]):0;1G}O.1e[O.1e.7C]=1r;if(R&&"cW"===R[1]){O.1e.3B="4o"}if(!!1j.4o){O.1e.4o=1r}if(R&&"bR"===R[1]){O.1e.3B="66";O.1e.66=1r}if("a6"===O.1e.3B&&(T&&T[1])){O.1e.6X=2u(T[1])}if("6L"==O.1e.4S&&O.1e.3T&&(T&&T[1])){O.1e.6S=1r}ac=({5Y:["-d3-","d9","d3"],3T:["-3T-","cY","3T"],57:["-62-","62","62"],bQ:["-o-","O","o"]})[O.1e.7C]||["","",""];O.1e.8y=ac[0];O.1e.c4=ac[1];O.1e.4V=ac[2];O.1e.2B=(!O.1e.57)?2z:(1m.cp)?1m.cp:17(){1c ae=0;if(O.1e.cD){1a 5}4F(O.1e.4y){1D 2:ae=6;1G;1D 3:ae=7;1G}1a ae}();ad.3b(O.1e.4S+"-3k");if(O.1e.38){ad.3b("38-3k")}if(O.1e.6S){ad.3b("6L-1e-3k")}if(O.1e.2B){O.1e.3B="ie";O.1e.6X=O.1e.2B;ad.3b("ie"+O.1e.2B+"-3k");1T(ab=11;ab>O.1e.2B;ab--){ad.3b("iJ-ie"+ab+"-3k")}}if(O.1e.3T&&O.1e.4y<fy){O.1e.2J.56=1l}if(O.1e.51){O.1e.51.2c(1j,17(){O.1e.2J.51=1r})}if(O.1e.2J.7N){ad.3b("7N-3k")}1k{ad.3b("6P-7N-3k")}Z=(1m.5n.6j||"").3E(/\\S+/g)||[];1m.5n.6j=O.$(Z).5L(ad).7f(" ");3h{1m.5n.3F("3w-3k-cv",O.1e.3B);1m.5n.3F("3w-3k-cv-fU",O.1e.6X)}3z(aa){}if(O.1e.2B&&O.1e.2B<9){1m.8b("5I");1m.8b("ei")}})();(17(){O.1e.56={a9:O.1e.2J.56,5k:17(){1a!!(1m.fF||1m[O.1e.4V+"fI"]||1m.56||1m.fQ||1m[O.1e.4V+"fK"])},bL:17(Y,Z){Z||(Z={});if(13.a9){O.$(1m).1C(13.c0,13.cw=17(aa){if(13.5k()){Z.aE&&Z.aE()}1k{O.$(1m).1P(13.c0,13.cw);Z.aD&&Z.aD()}}.2K(13));O.$(1m).1C(13.bZ,13.6n=17(aa){Z.8n&&Z.8n();O.$(1m).1P(13.bZ,13.6n)}.2K(13));(Y[O.1e.4V+"fM"]||Y[O.1e.4V+"fJ"]||Y.fE||17(){}).2c(Y)}1k{if(Z.8n){Z.8n()}}},er:(1m.9F||1m.cy||1m[O.1e.4V+"fG"]||1m[O.1e.4V+"fH"]||17(){}).1F(1m),c0:1m.dW?"fO":(1m.9F?"":O.1e.4V)+"fV",bZ:1m.dW?"fP":(1m.9F?"":O.1e.4V)+"fD",fR:O.1e.4V,fS:1h}})();1c X=/\\S+/g,L=/^(3L(dZ|dN|dR|ee)fY)|((7h|8e)(dZ|dN|dR|ee))$/,Q={"fA":("2z"===7Z(I.eh))?"fB":"eh"},S={eT:1r,fz:1r,2s:1r,bN:1r,1n:1r},K=(1j.ec)?17(aa,Y){1c Z=1j.ec(aa,1h);1a Z?Z.fC(Y)||Z[Y]:1h}:17(ab,Z){1c aa=ab.fx,Y=1h;Y=aa?aa[Z]:1h;if(1h==Y&&ab.2m&&ab.2m[Z]){Y=ab.2m[Z]}1a Y};17 W(aa){1c Y,Z;Z=(O.1e.3T&&"2Y"==aa)?1l:(aa in I);if(!Z){Y=O.1e.c4+aa.9q(0).7z()+aa.bX(1);if(Y in I){1a Y}}1a aa}O.9l=W;O.3X={e6:17(Y){1a!(Y||"").4G(" ")&&(13.6j||"").4G(Y," ")},1B:17(ac){1c Z=(13.6j||"").3E(X)||[],ab=(ac||"").3E(X)||[],Y=ab.1I,aa=0;1T(;aa<Y;aa++){if(!O.$(Z).5S(ab[aa])){Z.3b(ab[aa])}}13.6j=Z.7f(" ");1a 13},1Q:17(ad){1c Z=(13.6j||"").3E(X)||[],ac=(ad||"").3E(X)||[],Y=ac.1I,ab=0,aa;1T(;ab<Y;ab++){if((aa=O.$(Z).4L(ac[ab]))>-1){Z.9T(aa,1)}}13.6j=ad?Z.7f(" "):"";1a 13},gy:17(Y){1a 13.e6(Y)?13.1Q(Y):13.1B(Y)},3u:17(Z){1c aa=Z.5G(),Y=1h;Z=Q[aa]||(Q[aa]=W(aa));Y=K(13,Z);if("2y"===Y){Y=1h}if(1h!==Y){if("2s"==Z){1a O.3q(Y)?2u(Y):1}if(L.3m(Z)){Y=5K(Y,10)?Y:"6l"}}1a Y},3K:17(Z,Y){1c ab=Z.5G();3h{if("2s"==Z){13.e7(Y);1a 13}Z=Q[ab]||(Q[ab]=W(ab));13.2m[Z]=Y+(("6b"==O.1O(Y)&&!S[ab])?"2A":"")}3z(aa){}1a 13},1y:17(Z){1T(1c Y in Z){13.3K(Y,Z[Y])}1a 13},gz:17(){1c Y={};O.$A(1Z).3e(17(Z){Y[Z]=13.3u(Z)},13);1a Y},e7:17(aa,Y){1c Z;Y=Y||1l;13.2m.2s=aa;aa=5K(2u(aa)*2M);if(Y){if(0===aa){if("3r"!=13.2m.4E){13.2m.4E="3r"}}1k{if("5T"!=13.2m.4E){13.2m.4E="5T"}}}if(O.1e.2B&&O.1e.2B<9){if(!9b(aa)){if(!~13.2m.2Y.4L("c7")){13.2m.2Y+=" e8:e9.dL.c7(9H="+aa+")"}1k{13.2m.2Y=13.2m.2Y.4r(/9H=\\d*/i,"9H="+aa)}}1k{13.2m.2Y=13.2m.2Y.4r(/e8:e9.dL.c7\\(9H=\\d*\\)/i,"").4T();if(""===13.2m.2Y){13.2m.5z("2Y")}}}1a 13},7U:17(Y){1T(1c Z in Y){if("41"===Z){13.1B(""+Y[Z])}1k{13.3F(Z,""+Y[Z])}}1a 13},gA:17(){1c Z=0,Y=0;Z=13.3u("1X-5e");Y=13.3u("1X-bs");Z=Z.4L("62")>-1?2u(Z):Z.4L("s")>-1?2u(Z)*aY:0;Y=Y.4L("62")>-1?2u(Y):Y.4L("s")>-1?2u(Y)*aY:0;1a Z+Y},4h:17(){1a 13.1y({6r:"36",4E:"3r"})},5u:17(){1a 13.1y({6r:"",4E:"5T"})},1E:17(){1a{1f:13.dm,1g:13.gB}},8K:17(Z){1c Y=13.1E();Y.1f-=(2u(13.3u("3L-1M-1f")||0)+2u(13.3u("3L-2L-1f")||0));Y.1g-=(2u(13.3u("3L-1H-1f")||0)+2u(13.3u("3L-2R-1f")||0));if(!Z){Y.1f-=(2u(13.3u("7h-1M")||0)+2u(13.3u("7h-2L")||0));Y.1g-=(2u(13.3u("7h-1H")||0)+2u(13.3u("7h-2R")||0))}1a Y},7r:17(){1a{1H:13.8f,1M:13.8H}},gx:17(){1c Y=13,Z={1H:0,1M:0};do{Z.1M+=Y.8H||0;Z.1H+=Y.8f||0;Y=Y.4H}5U(Y);1a Z},8z:17(){1c ac=13,Z=0,ab=0;if(O.3q(1m.5n.7u)){1c Y=13.7u(),aa=O.$(1m).7r(),ad=O.1e.48();1a{1H:Y.1H+aa.y-ad.gw,1M:Y.1M+aa.x-ad.gs}}do{Z+=ac.gr||0;ab+=ac.gt||0;ac=ac.gu}5U(ac&&!(/^(?:3D|bW)$/i).3m(ac.b4));1a{1H:ab,1M:Z}},7H:17(){1c Z=13.8z();1c Y=13.1E();1a{1H:Z.1H,2R:Z.1H+Y.1g,1M:Z.1M,2L:Z.1M+Y.1f}},5t:17(Z){3h{13.gv=Z}3z(Y){13.fZ=Z}1a 13},2T:17(){1a(13.4H)?13.4H.bh(13):13},5h:17(){O.$A(13.gC).3e(17(Y){if(3==Y.6p||8==Y.6p){1a}O.$(Y).5h()});13.2T();13.c1();if(13.$6c){O.83[13.$6c]=1h;4U O.83[13.$6c]}1a 1h},3c:17(aa,Z){Z=Z||"2R";1c Y=13.4p;("1H"==Z&&Y)?13.gD(aa,Y):13.bo(aa);1a 13},21:17(aa,Z){1c Y=O.$(aa).3c(13,Z);1a 13},eK:17(Y){13.3c(Y.4H.8J(13,Y));1a 13},a4:17(Y){if("6f"!==O.1O("1N"==O.1O(Y)?Y=1m.dk(Y):Y)){1a 1l}1a(13==Y)?1l:(13.5S&&!(O.1e.dd))?(13.5S(Y)):(13.de)?!!(13.de(Y)&16):O.$A(13.7Y(Y.b4)).5S(Y)}};O.3X.gM=O.3X.3u;O.3X.gN=O.3X.1y;if(!1j.3X){1j.3X=O.$F;if(O.1e.7C.3T){1j.1m.8b("gO")}1j.3X.2w=(O.1e.7C.3T)?1j["[[gK.2w]]"]:{}}O.9a(1j.3X,{$4z:"6f"});O.3C={1E:17(){if(O.1e.bU||O.1e.gJ||O.1e.dd){1a{1f:1j.5j,1g:1j.4W}}1a{1f:O.1e.48().df,1g:O.1e.48().gE}},7r:17(){1a{x:1j.gG||O.1e.48().8H,y:1j.gH||O.1e.48().8f}},gI:17(){1c Y=13.1E();1a{1f:1p.1V(O.1e.48().gq,Y.1f),1g:1p.1V(O.1e.48().gp,Y.1g)}}};O.26(1m,{$4z:"1m"});O.26(1j,{$4z:"1j"});O.26([O.3X,O.3C],{2e:17(ab,Z){1c Y=O.9d(13.$6c),aa=Y[ab];if(2z!==Z&&2z===aa){aa=Y[ab]=Z}1a(O.3q(aa)?aa:1h)},3f:17(aa,Z){1c Y=O.9d(13.$6c);Y[aa]=Z;1a 13},33:17(Z){1c Y=O.9d(13.$6c);4U Y[Z];1a 13}});if(!(1j.c6&&1j.c6.2w&&1j.c6.2w.ca)){O.26([O.3X,O.3C],{ca:17(Y){1a O.$A(13.9R("*")).2Y(17(aa){3h{1a(1==aa.6p&&aa.6j.4G(Y," "))}3z(Z){}})}})}O.26([O.3X,O.3C],{aq:17(){1a 13.ca(1Z[0])},7Y:17(){1a 13.9R(1Z[0])}});if(O.1e.56.a9&&!1m.dK){O.3X.dK=17(){O.1e.56.bL(13)}}O.1u={$4z:"1z",6d:O.$1l,2f:17(){1a 13.5q().3U()},5q:17(){if(13.dD){13.dD()}1k{13.dw=1r}1a 13},3U:17(){if(13.dv){13.dv()}1k{13.ga=1l}1a 13},4v:17(){13.6d=O.$1r;1a 13},7W:17(){1c Z,Y;Z=((/3x/i).3m(13.1v))?13.2I[0]:13;1a(!O.3q(Z))?{x:0,y:0}:{x:Z.2F,y:Z.2G}},5D:17(){1c Z,Y;Z=((/3x/i).3m(13.1v))?13.2I[0]:13;1a(!O.3q(Z))?{x:0,y:0}:{x:Z.52||Z.2F+O.1e.48().8H,y:Z.59||Z.2G+O.1e.48().8f}},by:17(){1c Y=13.4b||13.gb;5U(Y&&3==Y.6p){Y=Y.4H}1a Y},8d:17(){1c Z=1h;4F(13.1v){1D"7F":1D"g6":1D"g5":Z=13.9n||13.g1;1G;1D"8m":1D"bY":1D"em":Z=13.9n||13.g0;1G;1R:1a Z}3h{5U(Z&&3==Z.6p){Z=Z.4H}}3z(Y){Z=1h}1a Z},6T:17(){if(!13.dC&&13.2q!==2z){1a(13.2q&1?1:(13.2q&2?3:(13.2q&4?2:0)))}1a 13.dC},g2:17(){1a(13.2k&&("3x"===13.2k||13.2k===13.5m))||(/3x/i).3m(13.1v)},g3:17(){1a 13.2k?(("3x"===13.2k||13.5m===13.2k)&&13.9L):1===13.2I.1I&&(13.6m.1I?13.6m[0].3N==13.2I[0].3N:1r)}};O.aR="dB";O.aT="g4";O.9y="";if(!1m.dB){O.aR="gd";O.aT="gl";O.9y="7V"}O.1u.1x={1v:"",x:1h,y:1h,2N:1h,2q:1h,4b:1h,9n:1h,$4z:"1z.4i",6d:O.$1l,5C:O.$([]),4g:17(Y){1c Z=Y;13.5C.3b(Z)},2f:17(){1a 13.5q().3U()},5q:17(){13.5C.3e(17(Z){3h{Z.5q()}3z(Y){}});1a 13},3U:17(){13.5C.3e(17(Z){3h{Z.3U()}3z(Y){}});1a 13},4v:17(){13.6d=O.$1r;1a 13},7W:17(){1a{x:13.2F,y:13.2G}},5D:17(){1a{x:13.x,y:13.y}},by:17(){1a 13.4b},8d:17(){1a 13.9n},6T:17(){1a 13.2q},f4:17(){1a 13.5C.1I>0?13.5C[0].by():2z}};O.26([O.3X,O.3C],{1C:17(aa,ac,ad,ag){1c af,Y,ab,ae,Z;if("1N"==O.1O(aa)){Z=aa.8v(" ");if(Z.1I>1){aa=Z}}if(O.1O(aa)=="49"){O.$(aa).3e(13.1C.2K(13,ac,ad,ag));1a 13}if(!aa||!ac||O.1O(aa)!="1N"||O.1O(ac)!="17"){1a 13}if(aa=="9Y"&&O.1e.2p){ac.2c(13);1a 13}aa=V[aa]||aa;ad=5K(ad||50);if(!ac.$9x){ac.$9x=1p.5P(1p.6x()*O.6o())}af=O.3C.2e.2c(13,"8x",{});Y=af[aa];if(!Y){af[aa]=Y=O.$([]);ab=13;if(O.1u.1x[aa]){O.1u.1x[aa].1L.5R.2c(13,ag)}1k{Y.3j=17(ah){ah=O.26(ah||1j.e,{$4z:"1z"});O.3C.2W.2c(ab,aa,O.$(ah))};13[O.aR](O.9y+aa,Y.3j,1l)}}ae={1v:aa,fn:ac,aS:ad,dA:ac.$9x};Y.3b(ae);Y.gn(17(ai,ah){1a ai.aS-ah.aS});1a 13},1P:17(ae){1c ac=O.3C.2e.2c(13,"8x",{}),aa,Y,Z,af,ad,ab;ad=1Z.1I>1?1Z[1]:-2M;if("1N"==O.1O(ae)){ab=ae.8v(" ");if(ab.1I>1){ae=ab}}if(O.1O(ae)=="49"){O.$(ae).3e(13.1P.2K(13,ad));1a 13}ae=V[ae]||ae;if(!ae||O.1O(ae)!="1N"||!ac||!ac[ae]){1a 13}aa=ac[ae]||[];1T(Z=0;Z<aa.1I;Z++){Y=aa[Z];if(-2M==ad||!!ad&&ad.$9x===Y.dA){af=aa.9T(Z--,1)}}if(0===aa.1I){if(O.1u.1x[ae]){O.1u.1x[ae].1L.2T.2c(13)}1k{13[O.aT](O.9y+ae,aa.3j,1l)}4U ac[ae]}1a 13},2W:17(ac,ae){1c ab=O.3C.2e.2c(13,"8x",{}),aa,Y,Z;ac=V[ac]||ac;if(!ac||O.1O(ac)!="1N"||!ab||!ab[ac]){1a 13}3h{ae=O.26(ae||{},{1v:ac})}3z(ad){}if(2z===ae.2N){ae.2N=O.6o()}aa=ab[ac]||[];1T(Z=0;Z<aa.1I&&!(ae.6d&&ae.6d());Z++){aa[Z].fn.2c(13,ae)}},bG:17(Z,Y){1c ac=("9Y"==Z)?1l:1r,ab=13,aa;Z=V[Z]||Z;if(!ac){O.3C.2W.2c(13,Z);1a 13}if(ab===1m&&1m.9D&&!ab.b3){ab=1m.5n}if(1m.9D){aa=1m.9D(Z);aa.73(Y,1r,1r)}1k{aa=1m.gk();aa.9E=Z}if(1m.9D){ab.b3(aa)}1k{ab.gj("7V"+Y,aa)}1a aa},c1:17(){1c Z=O.3C.2e.2c(13,"8x");if(!Z){1a 13}1T(1c Y in Z){O.3C.1P.2c(13,Y)}O.3C.33.2c(13,"8x");1a 13}});(17(Y){if("8p"===1m.8q){1a Y.1e.7K.2H(1)}if(Y.1e.3T&&Y.1e.4y<gf){(17(){(Y.$(["2l","8p"]).5S(1m.8q))?Y.1e.7K():1Z.9j.2H(50)})()}1k{if(Y.1e.57&&Y.1e.2B<9&&1j==1H){(17(){(Y.$3h(17(){Y.1e.48().iK("1M");1a 1r}))?Y.1e.7K():1Z.9j.2H(50)})()}1k{Y.3C.1C.2c(Y.$(1m),"gg",Y.1e.7K);Y.3C.1C.2c(Y.$(1j),"6k",Y.1e.7K)}}})(U);O.3J=17(){1c ac=1h,Z=O.$A(1Z);if("41"==O.1O(Z[0])){ac=Z.6W()}1c Y=17(){1T(1c af in 13){13[af]=O.4a(13[af])}if(13.5i.$3O){13.$3O={};1c ah=13.5i.$3O;1T(1c ag in ah){1c ae=ah[ag];4F(O.1O(ae)){1D"17":13.$3O[ag]=O.3J.du(13,ae);1G;1D"8G":13.$3O[ag]=O.4a(ae);1G;1D"49":13.$3O[ag]=O.4a(ae);1G}}}1c ad=(13.3P)?13.3P.6q(13,1Z):13;4U 13.aP;1a ad};if(!Y.2w.3P){Y.2w.3P=O.$F}if(ac){1c ab=17(){};ab.2w=ac.2w;Y.2w=1t ab;Y.$3O={};1T(1c aa in ac.2w){Y.$3O[aa]=ac.2w[aa]}}1k{Y.$3O=1h}Y.5i=O.3J;Y.2w.5i=Y;O.26(Y.2w,Z[0]);O.26(Y,{$4z:"41"});1a Y};U.3J.du=17(Y,Z){1a 17(){1c ab=13.aP;1c aa=Z.6q(Y,1Z);1a aa}};(17(ab){1c aa=ab.$;1c Y=5,Z=bJ;ab.1u.1x.1S=1t ab.3J(ab.26(ab.1u.1x,{1v:"1S",3P:17(ae,ad){1c ac=ad.5D();13.x=ac.x;13.y=ac.y;13.2F=ad.2F;13.2G=ad.2G;13.2N=ad.2N;13.2q=ad.6T();13.4b=ae;13.4g(ad)}}));ab.1u.1x.1S.1L={1w:{7y:Z,2q:1},5R:17(ac){13.3f("1z:1S:1w",ab.26(ab.4a(ab.1u.1x.1S.1L.1w),ac||{}));13.1C("6I",ab.1u.1x.1S.1L.3j,1);13.1C("6u",ab.1u.1x.1S.1L.3j,1);13.1C("2Q",ab.1u.1x.1S.1L.aM,1);if(ab.1e.57&&ab.1e.2B<9){13.1C("97",ab.1u.1x.1S.1L.3j,1)}},2T:17(){13.1P("6I",ab.1u.1x.1S.1L.3j);13.1P("6u",ab.1u.1x.1S.1L.3j);13.1P("2Q",ab.1u.1x.1S.1L.aM);if(ab.1e.57&&ab.1e.2B<9){13.1P("97",ab.1u.1x.1S.1L.3j)}},aM:17(ac){ac.3U()},3j:17(af){1c ae,ac,ad;ac=13.2e("1z:1S:1w");if(af.1v!="97"&&af.6T()!=ac.2q){1a}if(13.2e("1z:1S:b1")){13.33("1z:1S:b1");1a}if("6I"==af.1v){ae=1t ab.1u.1x.1S(13,af);13.3f("1z:1S:8R",ae)}1k{if("6u"==af.1v){ae=13.2e("1z:1S:8R");if(!ae){1a}ad=af.5D();13.33("1z:1S:8R");ae.4g(af);if(af.2N-ae.2N<=ac.7y&&1p.89(1p.4C(ad.x-ae.x,2)+1p.4C(ad.y-ae.y,2))<=Y){13.2W("1S",ae)}1m.2W("6u",af)}1k{if(af.1v=="97"){ae=1t ab.1u.1x.1S(13,af);13.2W("1S",ae)}}}}}})(U);(17(Z){1c Y=Z.$;Z.1u.1x.2S=1t Z.3J(Z.26(Z.1u.1x,{1v:"2S",2n:"3M",6v:1l,3P:17(ad,ac,ab){1c aa=ac.5D();13.x=aa.x;13.y=aa.y;13.2F=ac.2F;13.2G=ac.2G;13.2N=ac.2N;13.2q=ac.6T();13.4b=ad;13.4g(ac);13.2n=ab}}));Z.1u.1x.2S.1L={5R:17(){1c ab=Z.1u.1x.2S.1L.dE.2K(13),aa=Z.1u.1x.2S.1L.9w.2K(13);13.1C("6I",Z.1u.1x.2S.1L.aN,1);13.1C("6u",Z.1u.1x.2S.1L.9w,1);1m.1C("87",ab,1);1m.1C("6u",aa,1);13.3f("1z:2S:4K:1m:5B",ab);13.3f("1z:2S:4K:1m:7s",aa)},2T:17(){13.1P("6I",Z.1u.1x.2S.1L.aN);13.1P("6u",Z.1u.1x.2S.1L.9w);Y(1m).1P("87",13.2e("1z:2S:4K:1m:5B")||Z.$F);Y(1m).1P("6u",13.2e("1z:2S:4K:1m:7s")||Z.$F);13.33("1z:2S:4K:1m:5B");13.33("1z:2S:4K:1m:7s")},aN:17(ab){1c aa;if(1!=ab.6T()){1a}aa=1t Z.1u.1x.2S(13,ab,"3M");13.3f("1z:2S:3M",aa)},9w:17(ab){1c aa;aa=13.2e("1z:2S:3M");if(!aa){1a}ab.3U();aa=1t Z.1u.1x.2S(13,ab,"9M");13.33("1z:2S:3M");13.2W("2S",aa)},dE:17(ab){1c aa;aa=13.2e("1z:2S:3M");if(!aa){1a}ab.3U();if(!aa.6v){aa.6v=1r;13.2W("2S",aa)}aa=1t Z.1u.1x.2S(13,ab,"ds");13.2W("2S",aa)}}})(U);(17(Z){1c Y=Z.$;Z.1u.1x.4d=1t Z.3J(Z.26(Z.1u.1x,{1v:"4d",7t:1l,7B:1h,3P:17(ac,ab){1c aa=ab.5D();13.x=aa.x;13.y=aa.y;13.2F=ab.2F;13.2G=ab.2G;13.2N=ab.2N;13.2q=ab.6T();13.4b=ac;13.4g(ab)}}));Z.1u.1x.4d.1L={1w:{7y:7E},5R:17(aa){13.3f("1z:4d:1w",Z.26(Z.4a(Z.1u.1x.4d.1L.1w),aa||{}));13.1C("1S",Z.1u.1x.4d.1L.3j,1)},2T:17(){13.1P("1S",Z.1u.1x.4d.1L.3j)},3j:17(ac){1c ab,aa;ab=13.2e("1z:4d:1z");aa=13.2e("1z:4d:1w");if(!ab){ab=1t Z.1u.1x.4d(13,ac);ab.7B=4J(17(){ab.7t=1r;ac.6d=Z.$1l;13.2W("1S",ac);13.33("1z:4d:1z")}.1F(13),aa.7y+10);13.3f("1z:4d:1z",ab);ac.4v()}1k{3Y(ab.7B);13.33("1z:4d:1z");if(!ab.7t){ab.4g(ac);ac.4v().2f();13.2W("4d",ab)}1k{}}}}})(U);(17(ae){1c ad=ae.$;17 Y(af){1a af.2k?(("3x"===af.2k||af.5m===af.2k)&&af.9L):1===af.2I.1I&&(af.6m.1I?af.6m[0].3N==af.2I[0].3N:1r)}17 aa(af){if(af.2k){1a("3x"===af.2k||af.5m===af.2k)?af.9J:1h}1k{1a af.2I[0].3N}}17 ab(af){if(af.2k){1a("3x"===af.2k||af.5m===af.2k)?af:1h}1k{1a af.2I[0]}}ae.1u.1x.1Y=1t ae.3J(ae.26(ae.1u.1x,{1v:"1Y",id:1h,3P:17(ag,af){1c ah=ab(af);13.id=ah.9J||ah.3N;13.x=ah.52;13.y=ah.59;13.52=ah.52;13.59=ah.59;13.2F=ah.2F;13.2G=ah.2G;13.2N=af.2N;13.2q=0;13.4b=ag;13.4g(af)}}));1c Z=10,ac=7E;ae.1u.1x.1Y.1L={5R:17(af){13.1C(["5r",1j.2v.3a?"76":"7J"],ae.1u.1x.1Y.1L.7e,1);13.1C(["5V",1j.2v.3a?"6t":"5W"],ae.1u.1x.1Y.1L.75,1);13.1C("2Q",ae.1u.1x.1Y.1L.aV,1)},2T:17(){13.1P(["5r",1j.2v.3a?"76":"7J"],ae.1u.1x.1Y.1L.7e);13.1P(["5V",1j.2v.3a?"6t":"5W"],ae.1u.1x.1Y.1L.75);13.1P("2Q",ae.1u.1x.1Y.1L.aV)},aV:17(af){af.3U()},7e:17(af){if(!Y(af)){13.33("1z:1Y:1z");1a}13.3f("1z:1Y:1z",1t ae.1u.1x.1Y(13,af));13.3f("1z:1S:b1",1r)},75:17(ai){1c ag=ae.6o(),ah=13.2e("1z:1Y:1z"),af=13.2e("1z:1Y:1w");if(!ah||!Y(ai)){1a}13.33("1z:1Y:1z");if(ah.id==aa(ai)&&ai.2N-ah.2N<=ac&&1p.89(1p.4C(ab(ai).52-ah.x,2)+1p.4C(ab(ai).59-ah.y,2))<=Z){13.33("1z:1S:8R");ai.2f();ah.4g(ai);13.2W("1Y",ah)}}}})(U);O.1u.1x.3G=1t O.3J(O.26(O.1u.1x,{1v:"3G",7t:1l,7B:1h,3P:17(Z,Y){13.x=Y.x;13.y=Y.y;13.2F=Y.2F;13.2G=Y.2G;13.2N=Y.2N;13.2q=0;13.4b=Z;13.4g(Y)}}));O.1u.1x.3G.1L={1w:{7y:bJ},5R:17(Y){13.3f("1z:3G:1w",O.26(O.4a(O.1u.1x.3G.1L.1w),Y||{}));13.1C("1Y",O.1u.1x.3G.1L.3j,1)},2T:17(){13.1P("1Y",O.1u.1x.3G.1L.3j)},3j:17(aa){1c Z,Y;Z=13.2e("1z:3G:1z");Y=13.2e("1z:3G:1w");if(!Z){Z=1t O.1u.1x.3G(13,aa);Z.7B=4J(17(){Z.7t=1r;aa.6d=O.$1l;13.2W("1Y",aa)}.1F(13),Y.7y+10);13.3f("1z:3G:1z",Z);aa.4v()}1k{3Y(Z.7B);13.33("1z:3G:1z");if(!Z.7t){Z.4g(aa);aa.4v().2f();13.2W("3G",Z)}1k{}}}};(17(ad){1c ac=ad.$;17 Y(ae){1a ae.2k?(("3x"===ae.2k||ae.5m===ae.2k)&&ae.9L):1===ae.2I.1I&&(ae.6m.1I?ae.6m[0].3N==ae.2I[0].3N:1r)}17 aa(ae){if(ae.2k){1a("3x"===ae.2k||ae.5m===ae.2k)?ae.9J:1h}1k{1a ae.2I[0].3N}}17 ab(ae){if(ae.2k){1a("3x"===ae.2k||ae.5m===ae.2k)?ae:1h}1k{1a ae.2I[0]}}1c Z=10;ad.1u.1x.2r=1t ad.3J(ad.26(ad.1u.1x,{1v:"2r",2n:"3M",id:1h,6v:1l,3P:17(ag,af,ae){1c ah=ab(af);13.id=ah.9J||ah.3N;13.2F=ah.2F;13.2G=ah.2G;13.52=ah.52;13.59=ah.59;13.x=ah.52;13.y=ah.59;13.2N=af.2N;13.2q=0;13.4b=ag;13.4g(af);13.2n=ae}}));ad.1u.1x.2r.1L={5R:17(){1c af=ad.1u.1x.2r.1L.92.1F(13),ae=ad.1u.1x.2r.1L.75.1F(13);13.1C(["5r",1j.2v.3a?"76":"7J"],ad.1u.1x.2r.1L.7e,1);13.1C(["5V",1j.2v.3a?"6t":"5W"],ad.1u.1x.2r.1L.75,1);13.1C(["7R",1j.2v.3a?"6D":"7I"],ad.1u.1x.2r.1L.92,1);13.3f("1z:2r:4K:1m:5B",af);13.3f("1z:2r:4K:1m:7s",ae);ac(1m).1C(1j.2v.3a?"6D":"7I",af,1);ac(1m).1C(1j.2v.3a?"6t":"5W",ae,1)},2T:17(){13.1P(["5r",1j.2v.3a?"76":"7J"],ad.1u.1x.2r.1L.7e);13.1P(["5V",1j.2v.3a?"6t":"5W"],ad.1u.1x.2r.1L.75);13.1P(["7R",1j.2v.3a?"6D":"7I"],ad.1u.1x.2r.1L.92);ac(1m).1P(1j.2v.3a?"6D":"7I",13.2e("1z:2r:4K:1m:5B")||ad.$F,1);ac(1m).1P(1j.2v.3a?"6t":"5W",13.2e("1z:2r:4K:1m:7s")||ad.$F,1);13.33("1z:2r:4K:1m:5B");13.33("1z:2r:4K:1m:7s")},7e:17(af){1c ae;if(!Y(af)){1a}ae=1t ad.1u.1x.2r(13,af,"3M");13.3f("1z:2r:3M",ae)},75:17(af){1c ae;ae=13.2e("1z:2r:3M");if(!ae||!ae.6v||ae.id!=aa(af)){1a}ae=1t ad.1u.1x.2r(13,af,"9M");13.33("1z:2r:3M");13.2W("2r",ae)},92:17(af){1c ae;ae=13.2e("1z:2r:3M");if(!ae||!Y(af)){1a}if(ae.id!=aa(af)){13.33("1z:2r:3M");1a}if(!ae.6v&&1p.89(1p.4C(ab(af).52-ae.x,2)+1p.4C(ab(af).59-ae.y,2))>Z){ae.6v=1r;13.2W("2r",ae)}if(!ae.6v){1a}ae=1t ad.1u.1x.2r(13,af,"ds");13.2W("2r",ae)}}})(U);O.1u.1x.3Z=1t O.3J(O.26(O.1u.1x,{1v:"3Z",43:1,b0:1,dg:1,2n:"kf",3P:17(Z,Y){13.2N=Y.2N;13.2q=0;13.4b=Z;13.x=Y.4j[0].2F+(Y.4j[1].2F-Y.4j[0].2F)/2;13.y=Y.4j[0].2G+(Y.4j[1].2G-Y.4j[0].2G)/2;13.di=1p.89(1p.4C(Y.4j[0].2F-Y.4j[1].2F,2)+1p.4C(Y.4j[0].2G-Y.4j[1].2G,2));13.4g(Y)},3S:17(Y){1c Z;13.2n="ke";if(Y.2I[0].3N!=13.5C[0].4j[0].3N||Y.2I[1].3N!=13.5C[0].4j[1].3N){1a}Z=1p.89(1p.4C(Y.2I[0].2F-Y.2I[1].2F,2)+1p.4C(Y.2I[0].2G-Y.2I[1].2G,2));13.b0=13.43;13.43=Z/13.di;13.dg=13.43/13.b0;13.x=Y.2I[0].2F+(Y.2I[1].2F-Y.2I[0].2F)/2;13.y=Y.2I[0].2G+(Y.2I[1].2G-Y.2I[0].2G)/2;13.4g(Y)}}));O.1u.1x.3Z.1L={5R:17(){13.1C("5r",O.1u.1x.3Z.1L.aZ,1);13.1C("5V",O.1u.1x.3Z.1L.aW,1);13.1C("7R",O.1u.1x.3Z.1L.aX,1)},2T:17(){13.1P("5r",O.1u.1x.3Z.1L.aZ);13.1P("5V",O.1u.1x.3Z.1L.aW);13.1P("7R",O.1u.1x.3Z.1L.aX)},aZ:17(Z){1c Y;if(Z.4j.1I!=2){1a}Z.3U();Y=1t O.1u.1x.3Z(13,Z);13.3f("1z:3Z:1z",Y)},aW:17(Z){1c Y;Y=13.2e("1z:3Z:1z");if(!Y){1a}Z.3U();13.33("1z:3Z:1z")},aX:17(Z){1c Y;Y=13.2e("1z:3Z:1z");if(!Y){1a}Z.3U();Y.3S(Z);13.2W("3Z",Y)}};(17(ad){1c ab=ad.$;ad.1u.1x.4w=1t ad.3J(ad.26(ad.1u.1x,{1v:"4w",3P:17(aj,ai,al,af,ae,ak,ag){1c ah=ai.5D();13.x=ah.x;13.y=ah.y;13.2N=ai.2N;13.4b=aj;13.ko=al||0;13.aH=af||0;13.7P=ae||0;13.km=ak||0;13.kn=ag||0;13.ay=ai.ay||0;13.aQ=1l;13.4g(ai)}}));1c ac,Z;17 Y(){ac=1h}17 aa(ae,af){1a(ae>50)||(1===af&&!("9s"==ad.1e.4S&&ae<1))||(0===ae%12)||(0==ae%4.l4)}ad.1u.1x.4w.1L={9E:"l3"in 1m||ad.1e.2B>8?"l5":"l6",5R:17(){13.1C(ad.1u.1x.4w.1L.9E,ad.1u.1x.4w.1L.3j,1)},2T:17(){13.1P(ad.1u.1x.4w.1L.9E,ad.1u.1x.4w.1L.3j,1)},3j:17(aj){1c ak=0,ah=0,af=0,ae=0,ai,ag;if(aj.dr){af=aj.dr*-1}if(aj.dp!==2z){af=aj.dp}if(aj.dn!==2z){af=aj.dn}if(aj.dl!==2z){ah=aj.dl*-1}if(aj.7P){af=-1*aj.7P}if(aj.aH){ah=aj.aH}if(0===af&&0===ah){1a}ak=0===af?ah:af;ae=1p.1V(1p.3A(af),1p.3A(ah));if(!ac||ae<ac){ac=ae}ai=ak>0?"5P":"3R";ak=1p[ai](ak/ac);ah=1p[ai](ah/ac);af=1p[ai](af/ac);if(Z){3Y(Z)}Z=4J(Y,7E);ag=1t ad.1u.1x.4w(13,aj,ak,ah,af,0,ac);ag.aQ=aa(ac,aj.ay||0);13.2W("4w",ag)}}})(U);O.9s=O.$(1j);O.dM=O.$(1m);1a U})();(17(K){if(!K){5A"6E 6F 6J"}1c J=K.$;1c I=1j.kY||1j.kZ||1h;y.cf=1t K.3J({29:1h,2p:1l,1w:{9C:K.$F,6h:K.$F,as:K.$F,6n:K.$F,7o:K.$F,eg:K.$F,9I:1l,ea:1r},1A:1h,8M:1h,au:0,7c:{9C:17(L){if(L.4b&&(7E===L.4b.8X||ef===L.4b.8X)&&L.kP){13.1w.9C.1F(1h,(L.2l-(13.1w.ea?13.au:0))/L.kR).2H(1);13.au=L.2l}},6h:17(L){if(L){J(L).2f()}13.8F();if(13.2p){1a}13.2p=1r;13.8D();!13.1w.9I&&13.1w.9C.1F(1h,1).2H(1);13.1w.6h.1F(1h,13).2H(1);13.1w.7o.1F(1h,13).2H(1)},as:17(L){if(L){J(L).2f()}13.8F();13.2p=1l;13.8D();13.1w.as.1F(1h,13).2H(1);13.1w.7o.1F(1h,13).2H(1)},6n:17(L){if(L){J(L).2f()}13.8F();13.2p=1l;13.8D();13.1w.6n.1F(1h,13).2H(1);13.1w.7o.1F(1h,13).2H(1)}},9u:17(){J(["6k","aI","e5"]).3e(17(L){13.29.1C(L,13.7c["7V"+L].2K(13).e4(1))},13)},8F:17(){if(13.8M){3h{3Y(13.8M)}3z(L){}13.8M=1h}J(["6k","aI","e5"]).3e(17(M){13.29.1P(M)},13)},8D:17(){13.1E();if(13.29.2e("1t")){1c L=13.29.4H;13.29.2T().33("1t").1y({2j:"k9",1H:"2y"});L.5h()}},e2:17(M){1c N=1t 8W(),L;J(["aI","je"]).3e(17(O){N["7V"+O]=J(17(P){13.7c["7V"+O].2c(13,P)}).1F(13)},13);N.6n=J(17(){13.1w.eg.1F(1h,13).2H(1);13.1w.9I=1l;13.9u();13.29.1W=M}).1F(13);N.6h=J(17(){if(7E!==N.8X&&ef!==N.8X){13.7c.6n.2c(13);1a}L=N.ka;13.9u();if(I&&!K.1e.57&&!("a2"===K.1e.4S&&K.1e.4y<j9)){13.29.3F("1W",I.ja(L))}1k{13.29.1W=M}}).1F(13);N.8c("jg",M);N.jh="jo";N.jp()},3P:17(M,L){13.1w=K.26(13.1w,L);13.29=J(M)||K.$1t("29",{},{"1V-1f":"36","1V-1g":"36"}).21(K.$1t("2Z").1B("3k-aO-29").1y({2j:"5v",1H:-eM,1f:10,1g:10,78:"3r"}).21(1m.3D)).3f("1t",1r);if(K.1e.2J.e3&&13.1w.9I&&"1N"==K.1O(M)){13.e2(M);1a}1c N=17(){if(13.dQ()){13.7c.6h.2c(13)}1k{13.7c.6n.2c(13)}N=1h}.1F(13);13.9u();if("1N"==K.1O(M)){13.29.1W=M}1k{if(K.1e.57&&5==K.1e.4y&&K.1e.2B<9){13.29.dT=17(){if(/2l|8p/.3m(13.29.8q)){13.29.dT=1h;N&&N()}}.1F(13)}13.29.1W=M.2t("1W")}13.29&&13.29.8p&&N&&(13.8M=N.2H(2M))},j5:17(){13.8F();13.8D();13.2p=1l;1a 13},dQ:17(){1c L=13.29;1a(L.8Q)?(L.8Q>0):(L.8q)?("8p"==L.8q):L.1f>0},1E:17(){1a 13.1A||(13.1A={1f:13.29.8Q||13.29.1f,1g:13.29.f8||13.29.1g})}})})(y);(17(J){if(!J){5A"6E 6F 6J"}if(J.5J){1a}1c I=J.$;J.5J=1t J.3J({3P:17(L,K){1c M;13.el=J.$(L);13.1w=J.26(13.1w,K);13.5Q=1l;13.7D=13.bB;M=J.5J.8E[13.1w.1X]||13.1w.1X;if("17"===J.1O(M)){13.7D=M}1k{13.5M=13.8l(M)||13.8l("63")}if("1N"==J.1O(13.1w.7x)){13.1w.7x="iP"===13.1w.7x?6i:5K(13.1w.7x)||1}},1w:{db:60,5e:8s,1X:"63",7x:1,4X:"iL",dP:J.$F,7a:J.$F,bF:J.$F,ek:J.$F,9o:1l,iM:1l},4q:1h,5M:1h,7D:1h,iN:17(K){13.1w.1X=K;K=J.5J.8E[13.1w.1X]||13.1w.1X;if("17"===J.1O(K)){13.7D=K}1k{13.7D=13.bB;13.5M=13.8l(K)||13.8l("63")}},4O:17(M){1c K=/\\%$/,L;13.4q=M||{};13.bA=0;13.2n=0;13.iO=0;13.9f={};13.7G="7G"===13.1w.4X||"7G-4D"===13.1w.4X;13.7g="7g"===13.1w.4X||"7g-4D"===13.1w.4X;1T(L in 13.4q){K.3m(13.4q[L][0])&&(13.9f[L]=1r);if("4D"===13.1w.4X||"7G-4D"===13.1w.4X||"7g-4D"===13.1w.4X){13.4q[L].4D()}}13.b6=J.6o();13.dY=13.b6+13.1w.5e;13.1w.dP.2c();if(0===13.1w.5e){13.6K(1);13.1w.7a.2c()}1k{13.9p=13.e1.1F(13);if(!13.1w.9o&&J.1e.2J.51){13.5Q=J.1e.51.2c(1j,13.9p)}1k{13.5Q=13.9p.dU(1p.5N(aY/13.1w.db))}}1a 13},bz:17(){if(13.5Q){if(!13.1w.9o&&J.1e.2J.51&&J.1e.9r){J.1e.9r.2c(1j,13.5Q)}1k{ep(13.5Q)}13.5Q=1l}},2f:17(K){K=J.3q(K)?K:1l;13.bz();if(K){13.6K(1);13.1w.7a.2H(10)}1a 13},bw:17(M,L,K){M=2u(M);L=2u(L);1a(L-M)*K+M},e1:17(){1c L=J.6o(),K=(L-13.b6)/13.1w.5e,M=1p.5P(K);if(L>=13.dY&&M>=13.1w.7x){13.bz();13.6K(1);13.1w.7a.2H(10);1a 13}if(13.7G&&13.bA<M){1T(1c N in 13.4q){13.4q[N].4D()}}13.bA=M;if(!13.1w.9o&&J.1e.2J.51){13.5Q=J.1e.51.2c(1j,13.9p)}13.6K((13.7g?M:0)+13.7D(K%1))},6K:17(K){1c L={},N=K;1T(1c M in 13.4q){if("2s"===M){L[M]=1p.5N(13.bw(13.4q[M][0],13.4q[M][1],K)*2M)/2M}1k{L[M]=13.bw(13.4q[M][0],13.4q[M][1],K);13.9f[M]&&(L[M]+="%")}}13.1w.bF(L,13.el);13.7i(L);13.1w.ek(L,13.el)},7i:17(K){1a 13.el.1y(K)},8l:17(K){1c L,M=1h;if("1N"!==J.1O(K)){1a 1h}4F(K){1D"9h":M=I([0,0,1,1]);1G;1D"63":M=I([0.25,0.1,0.25,1]);1G;1D"63-in":M=I([0.42,0,1,1]);1G;1D"63-cz":M=I([0,0,0.58,1]);1G;1D"63-in-cz":M=I([0.42,0,0.58,1]);1G;1D"cj":M=I([0.47,0,0.jU,0.jT]);1G;1D"ci":M=I([0.39,0.jP,0.jQ,1]);1G;1D"jR":M=I([0.jS,0.bv,0.55,0.95]);1G;1D"cq":M=I([0.55,0.jY,0.68,0.53]);1G;1D"cn":M=I([0.25,0.46,0.45,0.94]);1G;1D"k7":M=I([0.k8,0.cE,0.k5,0.k4]);1G;1D"cs":M=I([0.55,0.k0,0.k2,0.19]);1G;1D"co":M=I([0.k3,0.61,0.cA,1]);1G;1D"jN":M=I([0.jz,0.a8,0.cA,1]);1G;1D"jA":M=I([0.eL,0.cE,0.eR,0.22]);1G;1D"jy":M=I([0.cB,0.84,0.44,1]);1G;1D"jt":M=I([0.77,0,0.88,1]);1G;1D"ju":M=I([0.jv,0.bv,0.jw,0.jC]);1G;1D"jK":M=I([0.23,1,0.32,1]);1G;1D"jM":M=I([0.86,0,0.jJ,1]);1G;1D"ch":M=I([0.95,0.bv,0.jE,0.jF]);1G;1D"cm":M=I([0.19,1,0.22,1]);1G;1D"jH":M=I([1,0,0,1]);1G;1D"j8":M=I([0.6,0.jG,0.98,0.jI]);1G;1D"jL":M=I([0.jD,0.82,0.cB,1]);1G;1D"jB":M=I([0.jO,0.k1,0.15,0.86]);1G;1D"cl":M=I([0.6,-0.28,0.bI,0.a8]);1G;1D"ck":M=I([0.88,0.9P,0.32,1.bM]);1G;1D"k6":M=I([0.68,-0.55,0.jZ,1.55]);1G;1R:K=K.4r(/\\s/g,"");if(K.3E(/^4Y-4R\\((?:-?[0-9\\.]{0,}[0-9]{1,},){3}(?:-?[0-9\\.]{0,}[0-9]{1,})\\)$/)){M=K.4r(/^4Y-4R\\s*\\(|\\)$/g,"").8v(",");1T(L=M.1I-1;L>=0;L--){M[L]=2u(M[L])}}}1a I(M)},bB:17(W){1c K=0,V=0,S=0,X=0,U=0,Q=0,R=13.1w.5e;17 P(Y){1a((K*Y+V)*Y+S)*Y}17 O(Y){1a((X*Y+U)*Y+Q)*Y}17 M(Y){1a(3*K*Y+2*V)*Y+S}17 T(Y){1a 1/(7E*Y)}17 L(Y,Z){1a O(N(Y,Z))}17 N(af,ag){1c ae,ad,ac,Z,Y,ab;17 aa(ah){if(ah>=0){1a ah}1k{1a 0-ah}}1T(ac=af,ab=0;ab<8;ab++){Z=P(ac)-af;if(aa(Z)<ag){1a ac}Y=M(ac);if(aa(Y)<0.c9){1G}ac=ac-Z/Y}ae=0;ad=1;ac=af;if(ac<ae){1a ae}if(ac>ad){1a ad}5U(ae<ad){Z=P(ac);if(aa(Z-af)<ag){1a ac}if(af>Z){ae=ac}1k{ad=ac}ac=(ad-ae)*0.5+ae}1a ac}S=3*13.5M[0];V=3*(13.5M[2]-13.5M[0])-S;K=1-S-V;Q=3*13.5M[1];U=3*(13.5M[3]-13.5M[1])-Q;X=1-Q-U;1a L(W,T(R))}});J.5J.8E={9h:"9h",iW:"cj",iT:"ci",jk:"ch",jj:"cm",ji:"cq",jn:"cn",l2:"cs",l7:"co",l0:"cl",kS:"ck",da:17(L,K){K=K||[];1a 1p.4C(2,10*--L)*1p.ew(20*L*1p.ev*(K[0]||1)/3)},kU:17(L,K){1a 1-J.5J.8E.da(1-L,K)},cX:17(M){1T(1c L=0,K=1;1;L+=K,K/=2){if(M>=(7-4*L)/11){1a K*K-1p.4C((11-6*L-11*M)/4,2)}}},kW:17(K){1a 1-J.5J.8E.cX(1-K)},36:17(K){1a 0}}})(y);(17(J){if(!J){5A"6E 6F 6J"}if(J.9g){1a}1c I=J.$;J.9g=1t J.3J(J.5J,{3P:17(K,L){13.bd=K;13.1w=J.26(13.1w,L);13.5Q=1l;13.$3O.3P()},4O:17(O){1c K=/\\%$/,N,M,L=O.1I;13.be=O;13.8Z=1t 6w(L);1T(M=0;M<L;M++){13.8Z[M]={};1T(N in O[M]){K.3m(O[M][N][0])&&(13.8Z[M][N]=1r);if("4D"===13.1w.4X||"7G-4D"===13.1w.4X||"7g-4D"===13.1w.4X){13.be[M][N].4D()}}}13.$3O.4O({});1a 13},6K:17(K){1T(1c L=0;L<13.bd.1I;L++){13.el=J.$(13.bd[L]);13.4q=13.be[L];13.9f=13.8Z[L];13.$3O.6K(K)}}})})(y);(17(J){if(!J){5A"6E 6F 6J";1a}if(J.bf){1a}1c I=J.$;J.bf=17(L,M){1c K=13.7p=J.$1t("2Z",1h,{2j:"5v","z-9c":cI}).1B("kl");J.$(L).1C("7F",17(){K.21(1m.3D)});J.$(L).1C("8m",17(){K.2T()});J.$(L).1C("87",17(R){1c T=20,Q=J.$(R).5D(),P=K.1E(),O=J.$(1j).1E(),S=J.$(1j).7r();17 N(W,U,V){1a(V<(W-U)/2)?V:((V>(W+U)/2)?(V-U):(W-U)/2)}K.1y({1M:S.x+N(O.1f,P.1f+2*T,Q.x-S.x)+T,1H:S.y+N(O.1g,P.1g+2*T,Q.y-S.y)+T})});13.a1(M)};J.bf.2w.a1=17(K){13.7p.4p&&13.7p.bh(13.7p.4p);13.7p.3c(1m.ar(K))}})(y);(17(J){if(!J){5A"6E 6F 6J";1a}if(J.kN){1a}1c I=J.$;J.91=17(N,M,L,K){13.9i=1h;13.5d=J.$1t("bl",1h,{2j:"5v","z-9c":cI,4E:"3r",2s:0.8}).1B(K||"").21(L||1m.3D);13.d2(N);13.5u(M)};J.91.2w.5u=17(K){13.5d.5u();13.9i=13.4h.1F(13).2H(J.b7(K,kq))};J.91.2w.4h=17(K){3Y(13.9i);13.9i=1h;if(13.5d&&!13.b8){13.b8=1t y.5J(13.5d,{5e:J.b7(K,eB),7a:17(){13.5d.5h();4U 13.5d;13.b8=1h}.1F(13)}).4O({2s:[13.5d.3u("2s"),0]})}};J.91.2w.d2=17(K){13.5d.4p&&13.7p.bh(13.5d.4p);13.5d.3c(1m.ar(K))}})(y);(17(J){if(!J){5A"6E 6F 6J"}if(J.7n){1a}1c M=J.$,I=1h,Q={"3g":1,49:2,6b:3,"17":4,1N:2M},K={"3g":17(T,S,R){if("3g"!=J.1O(S)){if(R||"1N"!=J.1O(S)){1a 1l}1k{if(!/^(1r|1l)$/.3m(S)){1a 1l}1k{S=S.cN()}}}if(T.40("2E")&&!M(T["2E"]).5S(S)){1a 1l}I=S;1a 1r},1N:17(T,S,R){if("1N"!==J.1O(S)){1a 1l}1k{if(T.40("2E")&&!M(T["2E"]).5S(S)){1a 1l}1k{I=""+S;1a 1r}}},6b:17(U,T,S){1c R=1l,W=/%$/,V=(J.1O(T)=="1N"&&W.3m(T));if(S&&!"6b"==7Z T){1a 1l}T=2u(T);if(9b(T)){1a 1l}if(9b(U.7v)){U.7v=d1.kH}if(9b(U.bk)){U.bk=d1.kJ}if(U.40("2E")&&!M(U["2E"]).5S(T)){1a 1l}if(U.7v>T||T>U.bk){1a 1l}I=V?(T+"%"):T;1a 1r},49:17(U,S,R){if("1N"===J.1O(S)){3h{S=1j.kL.kK(S)}3z(T){1a 1l}}if(J.1O(S)==="49"){I=S;1a 1r}1k{1a 1l}},"17":17(T,S,R){if(J.1O(S)==="17"){I=S;1a 1r}1k{1a 1l}}},L=17(W,V,S){1c U;U=W.40("3d")?W.3d:[W];if("49"!=J.1O(U)){1a 1l}1T(1c T=0,R=U.1I-1;T<=R;T++){if(K[U[T].1v](U[T],V,S)){1a 1r}}1a 1l},O=17(W){1c U,T,V,R,S;if(W.40("3d")){R=W.3d.1I;1T(U=0;U<R;U++){1T(T=U+1;T<R;T++){if(Q[W.3d[U]["1v"]]>Q[W.3d[T].1v]){S=W.3d[U];W.3d[U]=W.3d[T];W.3d[T]=S}}}}1a W},P=17(U){1c T;T=U.40("3d")?U.3d:[U];if("49"!=J.1O(T)){1a 1l}1T(1c S=T.1I-1;S>=0;S--){if(!T[S].1v||!Q.40(T[S].1v)){1a 1l}if(J.3q(T[S]["2E"])){if("49"!==J.1O(T[S]["2E"])){1a 1l}1T(1c R=T[S]["2E"].1I-1;R>=0;R--){if(!K[T[S].1v]({1v:T[S].1v},T[S]["2E"][R],1r)){1a 1l}}}}if(U.40("1R")&&!L(U,U["1R"],1r)){1a 1l}1a 1r},N=17(R){13.4u={};13.1w={};13.cx(R)};J.26(N.2w,{cx:17(T){1c S,R,U;1T(S in T){if(!T.40(S)){8N}R=(S+"").4T().5G();if(!13.4u.40(R)){13.4u[R]=O(T[S]);if(!P(13.4u[R])){5A"kx kw ky kz \'"+S+"\' kC in "+T}13.1w[R]=2z}}},7i:17(S,R){S=(S+"").4T().5G();if(J.1O(R)=="1N"){R=R.4T()}if(13.4u.40(S)){I=R;if(L(13.4u[S],R)){13.1w[S]=I}I=1h}},eA:17(R){R=(R+"").4T().5G();if(13.4u.40(R)){1a J.3q(13.1w[R])?13.1w[R]:13.4u[R]["1R"]}},8a:17(S){1T(1c R in S){13.7i(R,S[R])}},eu:17(){1c S=J.26({},13.1w);1T(1c R in S){if(2z===S[R]&&2z!==13.4u[R]["1R"]){S[R]=13.4u[R]["1R"]}}1a S},9G:17(R){M(R.8v(";")).3e(M(17(S){S=S.8v(":");13.7i(S.6W().4T(),S.7f(":"))}).1F(13))},9e:17(R){R=(R+"").4T().5G();1a 13.4u.40(R)},kB:17(R){R=(R+"").4T().5G();1a 13.9e(R)&&J.3q(13.1w[R])},2T:17(R){R=(R+"").4T().5G();if(13.9e(R)){4U 13.1w[R];4U 13.4u[R]}}});J.7n=N}(y));(17(M){if(!M){5A"6E 6F 6J";1a}1c L=M.$;if(M.9Z){1a}1c K="bm://bn.bq.bp/kF/7N",J="bm://bn.bq.bp/kG/ku";1c I=17(N){13.72={};13.7M=L(N);13.5E=L(1m.8Y(K,"7N"));13.5E.3F("1f",13.7M.8Q||13.7M.1f);13.5E.3F("1g",13.7M.f8||13.7M.1g);13.1i=L(1m.8Y(K,"1i"));13.1i.ki(J,"6Q",13.7M.2t("1W"));13.1i.3F("1f","2M%");13.1i.3F("1g","2M%");13.1i.21(13.5E)};I.2w.6M=17(){1a 13.5E};I.2w.5c=17(N){if(1p.5N(N)<1){1a}if(!13.72.5c){13.72.5c=L(1m.8Y(K,"2Y"));13.72.5c.3F("id","fh");13.72.5c.bo(L(1m.8Y(K,"kd")).7U({"in":"kj",ft:N}));13.72.5c.21(13.5E);13.1i.3F("2Y","2b(#fh)")}1k{13.72.5c.4p.3F("ft",N)}1a 13};M.9Z=I}(y));1c s=(17(K){1c J=K.$;1c I=17(M,L){13.3i={8y:"3k",3y:"8g",2j:"2R",1A:{kr:"2A",1f:"2y",1g:"2y"},kQ:["1g","1f"]};13.3O=M;13.4x=1h;13.6G=1h;13.2O=1h;13.2P={};13.ex=[];13.5Z=1h;13.bD=1h;13.5O=1h;13.3i=K.26(13.3i,L);13.3l=13.3i.8y+"-bu";13.8A=13.3i.8y+"-6N";13.ez()};I.2w={ez:17(){13.4x=K.$1t("2Z").1B(13.3l).1B(13.3l+"-"+13.3i.3y).1y({4E:"3r"});13.6G=K.$1t("2Z").1B(13.3l+"-6G").21(13.4x);13.4x.21(13.3O);J(["4M","4A"]).3e(17(L){13.2P[L]=K.$1t("2q").1B(13.3l+"-2q").1B(13.3l+"-2q-"+L).21(13.4x).1C("1S 1Y",(17(N,M){J(N).5C[0].2f().4v();J(N).5q();13.69(M)}).2K(13,L))}.1F(13));13.2P.4M.1B(13.3l+"-2q-4N");13.2O=K.$1t("kT").1C("1S 1Y",17(L){L.2f()})},fl:17(M){1c L=K.$1t("kX").1B(13.8A).3c(M).21(13.2O);1t K.cf(M,{7o:13.9z.1F(13)});13.ex.3b(L);1a L},fq:17(M){1c L=13.5Z||13.2O.aq(13.8A+"-6O")[0];if(L){J(L).1Q(13.8A+"-6O")}13.5Z=J(M);if(!13.5Z){1a}13.5Z.1B(13.8A+"-6O");13.69(13.5Z)},bj:17(){if(13.6G!==13.2O.4H){J(13.2O).21(13.6G);13.eZ();J(1j).1C("71",13.5O=13.9z.1F(13));13.bj.1F(13).2H(1);1a}1c L=13.3O.1E();if(L.1g>0&&L.1g>L.1f){13.8j("4Z")}1k{13.8j("8g")}13.9z();13.4x.1y({4E:""})},2f:17(){if(13.5O){J(1j).1P("71",13.5O)}13.4x.5h()},69:17(Y,O){1c Q={x:0,y:0},ab="4Z"==13.3i.3y?"1H":"1M",T="4Z"==13.3i.3y?"1g":"1f",P="4Z"==13.3i.3y?"y":"x",X=13.2O.4H.1E()[T],U=13.2O.4H.8z(),N=13.2O.1E()[T],W,L,aa,R,M,V,S,Z=[];if(13.bD){13.bD.2f()}1k{13.2O.1y("1X",K.1e.7d+6a.7q(32)+"7w")}if(2z===O){O=8s}W=13.2O.8z();if("1N"==K.1O(Y)){Q[P]=("4A"==Y)?1p.1V(W[ab]-U[ab]-X,X-N):1p.2g(W[ab]-U[ab]+X,0)}1k{if("6f"==K.1O(Y)){L=Y.1E();aa=Y.8z();Q[P]=1p.2g(0,1p.1V(X-N,W[ab]+X/2-aa[ab]-L[T]/2))}1k{1a}}if(K.1e.5Y&&"6L"==K.1e.4S||K.1e.2B&&K.1e.2B<10){if("1N"==K.1O(Y)&&Q[P]==W[ab]-U[ab]){W[ab]+=0===W[ab]-U[ab]?30:-30}Q["8e-"+ab]=[((N<=X)?0:(W[ab]-U[ab])),Q[P]];4U Q.x;4U Q.y;if(!13.bH){13.bH=1t K.9g([13.2O],{5e:eB})}Z.3b(Q);13.bH.4O(Z);S=Q["8e-"+ab][1]}1k{13.2O.1y({1X:K.1e.7d+6a.7q(32)+O+"62 63",2h:"4k("+Q.x+"2A, "+Q.y+"2A, 0)"});S=Q[P]}if(S>=0){13.2P.4M.1B(13.3l+"-2q-4N")}1k{13.2P.4M.1Q(13.3l+"-2q-4N")}if(S<=X-N){13.2P.4A.1B(13.3l+"-2q-4N")}1k{13.2P.4A.1Q(13.3l+"-2q-4N")}S=1h},eZ:17(){1c N,M,O,V,U,X,P,T,S,W,ac,Z,aa,Y={x:0,y:0},L,R,Q=bJ,ab=17(af){1c ae,ad=0;1T(ae=1.5;ae<=90;ae+=1.5){ad+=(af*1p.ew(ae/1p.ev/2))}(V<0)&&(ad*=(-1));1a ad};U=J(17(ad){Y={x:0,y:0};L="4Z"==13.3i.3y?"1H":"1M";R="4Z"==13.3i.3y?"1g":"1f";N="4Z"==13.3i.3y?"y":"x";Z=13.2O.4H.1E()[R];ac=13.2O.1E()[R];O=Z-ac;if(O>=0){1a}if(ad.2n=="3M"){if(2z===aa){aa=0}13.2O.3K("1X",K.1e.7d+6a.7q(32)+"f5");X=ad[N];S=ad.y;T=ad.x;W=1l}1k{if("9M"==ad.2n){if(W){1a}P=ab(1p.3A(V));aa+=P;(aa<=O)&&(aa=O);(aa>=0)&&(aa=0);Y[N]=aa;13.2O.3K("1X",K.1e.7d+6a.7q(32)+Q+"62  4Y-4R(.0, .0, .0, 1)");13.2O.3K("2h","4k("+Y.x+"2A, "+Y.y+"2A, 6l)");V=0}1k{if(W){1a}if("8g"==13.3i.3y&&1p.3A(ad.x-T)>1p.3A(ad.y-S)||"4Z"==13.3i.3y&&1p.3A(ad.x-T)<1p.3A(ad.y-S)){ad.2f();V=ad[N]-X;aa+=V;Y[N]=aa;13.2O.3K("2h","4k("+Y.x+"2A, "+Y.y+"2A, 6l)");if(aa>=0){13.2P.4M.1B(13.3l+"-2q-4N")}1k{13.2P.4M.1Q(13.3l+"-2q-4N")}if(aa<=O){13.2P.4A.1B(13.3l+"-2q-4N")}1k{13.2P.4A.1Q(13.3l+"-2q-4N")}}1k{W=1r}}X=ad[N]}}).1F(13);13.2O.1C("2r",U)},9z:17(){1c O,N,L,M=13.3O.1E();if(M.1g>0&&M.1g>M.1f){13.8j("4Z")}1k{13.8j("8g")}O="4Z"==13.3i.3y?"1g":"1f";N=13.2O.1E()[O];L=13.4x.1E()[O];if(N<=L){13.4x.1B("6P-2P");13.2O.3K("1X","").1E();13.2O.3K("2h","4k(0,0,0)");13.2P.4M.1B(13.3l+"-2q-4N");13.2P.4A.1Q(13.3l+"-2q-4N")}1k{13.4x.1Q("6P-2P")}if(13.5Z){13.69(13.5Z,0)}},8j:17(L){if("4Z"!==L&&"8g"!==L||L==13.3i.3y){1a}13.4x.1Q(13.3l+"-"+13.3i.3y);13.3i.3y=L;13.4x.1B(13.3l+"-"+13.3i.3y);13.2O.3K("1X","36").1E();13.2O.3K("2h","").3K("8e","")}};1a I})(y);1c i=A.$;if(7Z 6C.aw!="17"){6C.aw=17(L){if(L==1h){5A 1t jV("js iY 2z iX 1h 64 8G")}L=6C(L);1T(1c I=1;I<1Z.1I;I++){1c K=1Z[I];if(K!=1h){1T(1c J in K){if(6C.2w.40.2c(K,J)){L[J]=K[J]}}}}1a L}}if(!A.1e.7T){A.1e.7T=A.9l("2h").9m()}1c p={4l:{1v:"1N","2E":["2Q","7A"],"1R":"7A"},4c:{3d:[{1v:"1N","2E":["1n","2D","4f","3Q"],"1R":"1n"},{1v:"3g","2E":[1l]}],"1R":"1n"},fj:{3d:[{1v:"1N","2E":["2y"]},{1v:"6b",7v:1}],"1R":"2y"},fi:{3d:[{1v:"1N","2E":["2y"]},{1v:"6b",7v:1}],"1R":"2y"},c5:{1v:"1N","1R":"2L"},j0:{1v:"6b",7v:0,"1R":15},7S:{3d:[{1v:"1N","2E":["2R","1H","3Q"],"1R":"3Q"},{1v:"3g","2E":[1l]}],"1R":"3Q"},2o:{3d:[{1v:"1N","2E":["1j","dX","3Q"]},{1v:"3g","2E":[1l]}],"1R":"1j"},4I:{3d:[{1v:"1N","2E":["1n","2D","3Q"],"1R":"1n"},{1v:"3g","2E":[1l]}],"1R":"1n"},3v:{1v:"1N","2E":["2Q","2X"],"1R":"2Q"},3W:{1v:"3g","1R":1r},fc:{1v:"3g","1R":1r},3n:{3d:[{1v:"1N","2E":["bO","2X","3Q"]},{1v:"3g","2E":[1l]}],"1R":"bO"},eD:{1v:"3g","1R":1r},f9:{1v:"3g","1R":1r},f6:{1v:"3g","1R":1l},8V:{1v:"3g","1R":1l},b2:{1v:"3g","1R":1r},eO:{1v:"3g","1R":1l},fd:{1v:"3g","1R":1r},bx:{1v:"1N","2E":["2Q","7A"],"1R":"2Q"},5H:{1v:"1N"},9S:{1v:"3g","1R":1l},bt:{1v:"1N","1R":"j1 64 1n"},a5:{1v:"1N","1R":"f0 64 1n"},93:{1v:"1N","1R":"f0 64 2o"},j4:{1v:"1N","1R":"j3"},j2:{1v:"1N","1R":"iV"},iU:{1v:"1N","1R":"iQ"}};1c m={4c:{3d:[{1v:"1N","2E":["1n","2D","3Q"],"1R":"1n"},{1v:"3g","2E":[1l]}],"1R":"1n"},3v:{1v:"1N","2E":["2Q","2X"],"1R":"2Q"},93:{1v:"1N","1R":"iR 64 2o"},bt:{1v:"1N","1R":"j6 64 1n"},a5:{1v:"1N","1R":"jl 1Y 64 1n"}};1c o="9N",D="1q",b=20,B=["en","es","eC","eV","cM","ct"];1c v,q={},F=i([]),H,f=1j.jq||1,G,z=1r,g=A.1e.2J.9v?"4k(":"9X(",C=A.1e.2J.9v?",0)":")",n=1h;1c r=(17(){1c J,M,L,K,I;1a I})();1c t=17(){1a"j7$jb"+"p".7z()+" jc$"+"dc.1.14".4r("v","")+" jf$"+"c".7z()+((1j.aB$aK&&"1N"==A.1O(1j.aB$aK))?" jd$"+1j.aB$aK.5l():"")};17 x(K){1c J,I;J="";1T(I=0;I<K.1I;I++){J+=6a.7q(14^K.eN(I))}1a J}17 j(K){1c J=[],I=1h;(K&&(I=i(K)))&&(J=F.2Y(17(L){1a L.3I===I}));1a J.1I?J[0]:1h}17 a(K){1c J=i(1j).1E(),I=i(1j).7r();K=K||0;1a{1M:K,2L:J.1f-K,1H:K,2R:J.1g-K,x:I.x,y:I.y}}17 c(I){1a(I.2k&&("3x"===I.2k||I.2k===I.5m))||(/3x/i).3m(I.1v)}17 h(I){1a I.2k?(("3x"===I.2k||I.5m===I.2k)&&I.9L):1===I.2I.1I&&(I.6m.1I?I.6m[0].3N==I.2I[0].3N:1r)}17 e(I){1a 6C.aw({},I,{1v:I.1v,52:I.52,59:I.59,eU:I.eU,eG:I.eG,2F:I.2F,2G:I.2G})}17 u(){1c K=A.$A(1Z),J=K.6W(),I=q[J];if(I){1T(1c L=0;L<I.1I;L++){I[L].6q(1h,K)}}}17 E(){1c M=1Z[0],I,L,J=[];3h{do{L=M.b4;if(/^[A-aL-z]*$/.3m(L)){if(I=M.2t("id")){if(/^[A-aL-z][-A-aL-l8-kp]*/.3m(I)){L+="#"+I}}J.3b(L)}M=M.4H}5U(M&&M!==1m.5n);J=J.4D();A.6B(J.7f(" ")+"> .1q-5I > 29",{1f:"2M% !2i;",1X:"36",2h:"36"},"1q-bV-65",1r)}3z(K){}}17 w(){1c J=1h,K=1h,I=17(){1j.kc(1m.3D.8H,1m.3D.8f);1j.b3(1t 1u("71"))};K=fs(17(){1c N=1j.3y==90||1j.3y==-90,M=1j.4W,L=(N?fa.kt:fa.kD)*0.85;if((J==1h||J==1l)&&((N&&M<L)||(!N&&M<L))){J=1r;I()}1k{if((J==1h||J==1r)&&((N&&M>L)||(!N&&M>L))){J=1l;I()}}},kv);1a K}17 d(){A.6B(".3k-3r-6G, .3k-aO-29",{6r:"fk !2i","2g-1g":"0 !2i","2g-1f":"0 !2i","1V-1g":"36 !2i","1V-1f":"36 !2i",1f:"fr !2i",1g:"fr !2i",2j:"5v !2i",1H:"-c3 !2i",1M:"0 !2i",78:"3r !2i","-3T-2h":"36 !2i",2h:"36 !2i","-3T-1X":"36 !2i",1X:"36 !2i"},"9A-9B-65");A.6B(".3k-aO-29 29",{6r:"bP-fk !2i",3L:"0 !2i",7h:"0 !2i","2g-1g":"0 !2i","2g-1f":"0 !2i","1V-1g":"36 !2i","1V-1f":"36 !2i","-3T-2h":"36 !2i",2h:"36 !2i","-3T-1X":"36 !2i",1X:"36 !2i"},"9A-9B-65");if(A.1e.6S){A.6B(".38-3k .1q-2o .1q-2o-bg",{6r:"36 !2i"},"9A-9B-65")}if(A.1e.6S&&("4o"!==A.1e.3B||44==A.1e.6X)){A.6B(".38-3k .1q-1n-1j.1q-2D, .38-3k .1q-1n-1j.1q-2D:gi",{"3L-ge":"0 !2i"},"9A-9B-65")}}1c l=17(L,M,J,K,I){13.1K={1W:1h,2b:1h,6g:1,1d:1h,2n:0,1A:{1f:0,1g:0},2l:1l};13.1n={1W:1h,2b:1h,6g:1,1d:1h,2n:0,1A:{1f:0,1g:0},2l:1l};if("8G"==A.1O(L)){13.1K=L}1k{if("1N"==A.1O(L)){13.1K.2b=A.6e(L)}}if("8G"==A.1O(M)){13.1n=M}1k{if("1N"==A.1O(M)){13.1n.2b=A.6e(M)}}13.3s=J;13.1w=K;13.4m=I;13.7j=1h;13.4e=1h;13.1d=1h};l.2w={a0:17(K,J,I){1c L=K.7Y("29")[0];if(I){13.1K.1d=L||A.$1t("29").21(K)}if(f>1){13.1K.2b=K.2t("3w-1i-2x");if(13.1K.2b){13.1K.6g=2}13.1n.2b=K.2t("3w-1n-1i-2x");if(13.1n.2b){13.1n.6g=2}}13.1K.1W=K.2t("3w-1i")||K.2t("gm")||(L?L.2t("1W"):1h);if(13.1K.1W){13.1K.1W=A.6e(13.1K.1W)}13.1K.2b=13.1K.2b||13.1K.1W;if(13.1K.2b){13.1K.2b=A.6e(13.1K.2b)}13.1n.1W=K.2t("3w-1n-1i")||K.2t("6Q");if(13.1n.1W){13.1n.1W=A.6e(13.1n.1W)}13.1n.2b=13.1n.2b||13.1n.1W;if(13.1n.2b){13.1n.2b=A.6e(13.1n.2b)}13.3s=K.2t("3w-3s")||K.2t("8t")||J;13.4e=K.2t("3w-4e");13.4m=K;1a 13},c8:17(I){1c J=1h;if(1Z.1I>1&&"17"===A.1O(1Z[1])){J=1Z[1]}if(0!==13[I].2n){if(13[I].2l){13.6h(J)}1a}if(13[I].2b&&13[I].1d&&!13[I].1d.2t("1W")&&!13[I].1d.2t("gc")){13[I].1d.3F("1W",13[I].2b)}13[I].2n=1;1t A.cf(13[I].1d||13[I].2b,{7o:i(17(K){13[I].2l=1r;13[I].2n=K.2p?2:-1;if(K.2p){13[I].1A=K.1E();if(!13[I].1d){13[I].1d=i(K.29);13[I].1d.2t("2m");13[I].1d.5z("2m");13[I].1A.1f/=13[I].6g;13[I].1A.1g/=13[I].6g}1k{13[I].1d.1y({"1V-1f":13[I].1A.1f,"1V-1g":13[I].1A.1g});if(13[I].1d.8U&&13[I].1d.8U!=13[I].1d.1W){13[I].2b=13[I].1d.8U}1k{if(A.6e(13[I].1d.2t("1W")||"")!=13[I].2b){13[I].1d.3F("1W",13[I].2b)}}}}13.6h(J)}).1F(13)})},8T:17(){13.c8("1K",1Z[0])},bS:17(){13.c8("1n",1Z[0])},6k:17(){13.7j=1h;if(1Z.1I>0&&"17"===A.1O(1Z[0])){13.7j=1Z[0]}13.8T();13.bS()},6h:17(I){if(I){I.2c(1h,13)}if(13.7j&&13.1K.2l&&13.1n.2l){13.7j.2c(1h,13);13.7j=1h;1a}},2l:17(){1a(13.1K.2l&&13.1n.2l)},2p:17(){1a(2===13.1K.2n&&2===13.1n.2n)},7L:17(J){1c I="1K"==J?"1n":"1K";if(!13[J].2l||(13[J].2l&&2===13[J].2n)){1a 13[J].2b}1k{if(!13[I].2l||(13[I].2l&&2===13[I].2n)){1a 13[I].2b}1k{1a 1h}}},6M:17(J){1c I="1K"==J?"1n":"1K";if(!13[J].2l||(13[J].2l&&2===13[J].2n)){1a 13[J].1d}1k{if(!13[I].2l||(13[I].2l&&2===13[I].2n)){1a 13[I].1d}1k{1a 1h}}},1E:17(J){1c I="1K"==J?"1n":"1K";if(!13[J].2l||(13[J].2l&&2===13[J].2n)){1a 13[J].1A}1k{if(!13[I].2l||(13[I].2l&&2===13[I].2n)){1a 13[I].1A}1k{1a{1f:0,1g:0}}}},g9:17(J){1c I="1K"==J?"1n":"1K";if(!13[J].2l||(13[J].2l&&2===13[J].2n)){1a 13[J].6g}1k{if(!13[I].2l||(13[I].2l&&2===13[I].2n)){1a 13[I].6g}1k{1a 1}}},6U:17(I){13.1d=13.6M(I)}};1c k=17(J,I){13.1w=1t A.7n(p);13.1o=i(17(){if(1Z.1I>1){1a 13.7i(1Z[0],1Z[1])}1k{1a 13.eA(1Z[0])}}).1F(13.1w);13.eo=1t A.7n(m);13.3H=[];13.1i=1h;13.74=1h;13.3I=i(J).1C("3M g7 2Q",17(K){K.2f()});13.id=1h;13.1d=1h;13.8P=1h;13.6Z=1h;13.9k=1h;13.6H=1h;13.79={1f:0,1g:0};13.1A={1f:0,1g:0};13.2a={1f:0,1g:0};13.3o={1f:0,1g:0};13.24={1H:0,1M:0,2R:0,2L:0};13.2p=1l;13.1J=1l;13.5y=1h;13.cg=1h;13.5O=i(17(){if(13.1J){13.1i.1d.1y({"1V-1g":1p.2g(13.1i.1E("1n").1g,13.6R())});13.1i.1d.1y({"1V-1f":1p.2g(13.1i.1E("1n").1f,13.7m())})}13.9U(1Z[0])}).1F(13);13.c2=i(17(K){3Y(13.cg);13.cg=i(13.5O).2H(10,"69"===K.1v)}).2K(13);if(t){H.3c(A.$1t("2Z",{},{6r:"36",4E:"3r"}).3c(1m.ar(t)));t=2z}13.1s=1h;13.1b=1h;13.3n=1h;13.bc=1h;13.6A=0;13.8w=1r;13.6y=1h;13.5F=1h;13.6N=1h;13.3p=1h;13.3V=1h;13.3W=1h;13.5p=1h;13.8I=1h;13.4Q=1h;13.8L=1h;13.5f=1h;13.4t=1h;13.4P=[];13.2P={};13.4O(I)};k.2w={eJ:17(I){13.1w.8a(1j[D+"7n"]||{});13.1w.9G(13.3I.2t("3w-1w")||"");if(!A.1e.bU){13.1o("9S",1l)}if(A.1e.38||13.1o("9S")){13.1w.8a(13.eo.eu());13.1w.8a(1j[D+"gL"]||{});13.1w.9G(13.3I.2t("3w-38-1w")||"")}if("1N"==A.1O(I)){13.1w.9G(I||"")}1k{13.1w.8a(I||{})}if(13.1o("5H")){13.1o("5H",13.1o("5H").4r(","," "))}if(1l===13.1o("7S")){13.1o("7S","3Q")}if(1l===13.1o("3n")){13.1o("3n","3Q")}4F(13.1o("3n")){1D"3Q":13.6A=0;1G;1D"bO":13.6A=2;1G;1D"2X":13.6A=6i;1G}if("3Q"===13.1o("4c")){13.1o("4c",1l)}if("3Q"===13.1o("2o")){13.1o("2o",1l)}if("3Q"===13.1o("4I")){13.1o("4I",1l)}if(A.1e.38&&"1n"==13.1o("4c")&&"2C"==13.1o("c5")){if(13.1o("2o")){13.1o("4c",1l)}1k{13.1o("4l","2Q")}}},4O:17(J){1c I;13.eJ(J);if(z&&!13.1o("b2")){1a}13.id=13.3I.2t("id")||"1q-"+1p.5P(1p.6x()*A.6o());13.3I.3F("id",13.id);13.1d=A.$1t("5I").1B("1q-5I");E(13.3I);13.6Z=13.3I.eI("29");13.9k=13.6Z?13.6Z.2t("1W"):1h;13.6H=i(13.3I).2t("8t");i(13.3I).5z("8t");13.74=1t l().a0(13.3I,13.6H,1r);13.1i=13.74;13.1d.eK(13.1i.1K.1d).1B(13.1o("5H"));if(1r!==13.1o("eO")){13.1d.1C("gP",17(L){L.2f();1a 1l})}13.1d.1B("1q-"+13.1o("4l")+"-1n");if(!13.1o("2o")){13.1d.1B("1q-6P-2o")}13.1s={1d:A.$1t("2Z",{"41":"1q-1s"},{1H:0}).21(13.1d),1i:A.$1t("29",{1W:"3w:1i/eE;eP,eW/eX="},{2j:"5v",1H:0,1M:0}),1f:0,1g:0,34:{x:0,y:0},5w:{x:0,y:0},1A:{1f:0,1g:0},3L:{x:0,y:0},dx:0,dy:0,5x:1l,4h:17(){if(A.1e.2J.2h){13.1d.1y({2h:"9X(-c3,-c3)"})}1k{13.1d.1y({1H:-eM})}}};13.1s.4h();13.1s.1d.3c(13.1s.1i);13.1b={1d:A.$1t("2Z",{"41":"1q-1n-1j"},{1H:-eS}).1B(13.1o("5H")).21(H),1i:A.$1t("29",{1W:"3w:1i/eE;eP,eW/eX="},{2j:"5v"}),ap:0,1f:0,1g:0,5j:0,4W:0,1A:{1f:"2y",6V:"2A",1g:"2y",6Y:"2A"},1U:13.1o("4c"),2j:13.1o("c5"),7b:13.1o("4l"),4i:1l,2V:1l,3t:1l,5k:1l,5s:i(17(){13.1b.5k=1l!==1Z[0];13.1d[13.1b.5k?"1Q":"1B"]("1q-6P-1n")}).1F(13),4h:i(17(){1c L=i(13.1d).2e("cr");13.1b.1d.1P("2U");13.1b.1d.1y({1H:-eS}).21(H);13.1b.1d.1Q("1q-9W 1q-p-"+("1n"==13.1b.1U?13.1b.2j:13.1b.1U));if(!13.1J&&L){L.2T()}13.1b.1i.2t("2m");13.1b.1i.5z("2m")}).1F(13),ao:i(17(L){13.1d[1l===L?"1B":"1Q"]("1q-6P-1n");13.1d["2D"==L?"1B":"1Q"]("1q-2D-1n");13.1b.1d["2D"==L?"1B":"1Q"]("1q-2D");13.1b.1d["4f"==L?"1B":"1Q"]("1q-4f");if("1n"!=L){13.1d.1Q("1q-2C-1n");13.1b.1d.1Q("1q-2C")}13.1b.1U=L;if(1l===L){13.1b.5s(1l)}1k{if("4f"===L){13.1b.5s(1r)}}}).1F(13)};13.1b.1d.3c(13.1b.1i);13.1b.ao(13.1o("4c"));13.1b.1i.5z("1f");13.1b.1i.5z("1g");if("2z"!==7Z(r)){1c K=1p.5P(1p.6x()*A.6o());i(13.1d).3f("cr",A.$1t(((1p.5P(1p.6x()*bi)+1)%2)?"bl":"2Z").7U({id:"7X"+K}).1y({6r:"bP",78:"3r",4E:"5T",f3:r[1],fb:r[2],eT:r[3],fX:"fW-fN",2j:"5v",1H:8,1M:8,8e:"2y",1f:"2y",fL:"2L","fT-1g":"i4",bN:fg}).5t(x(r[0])));if(i(i(13.1d).2e("cr")).7Y("a")[0]){i(i(i(13.1d).2e("cr")).7Y("a")[0]).1C("1Y 1S",17(L){L.5q();1j.8c(13.6Q)}).7U({id:"9t"+K})}A.6B("#"+13.id+" > 5I.1q-5I > #"+("7X"+K)+",#"+13.id+" > 5I.1q-5I > #"+("7X"+K)+" > #"+("9t"+K)+",bW 3D .1q-2o > #"+("7X"+K)+" > #"+("9t"+K)+",bW 3D .1q-2o > #"+("7X"+K)+" > #"+("9t"+K),{6r:"bP !2i;",4E:"5T !2i;",bN:"fg !2i;",fb:r[2]+" !2i;",f3:r[1]+" !2i;"},"1q-bV-65",1r)}if((I=(""+13.1o("fj")).3E(/^([0-9]+)?(2A|%)?$/))){13.1b.1A.6V=I[2]||"2A";13.1b.1A.1f=(2u(I[1])||"2y")}if((I=(""+13.1o("fi")).3E(/^([0-9]+)?(2A|%)?$/))){13.1b.1A.6Y=I[2]||"2A";13.1b.1A.1g=(2u(I[1])||"2y")}if("2D"==13.1b.1U){13.1d.1B("1q-2D-1n");13.1b.1d.1B("1q-2D");if("2y"===13.1b.1A.1f){13.1b.1A.6V="%";13.1b.1A.1f=70}if("2y"===13.1b.1A.1g){13.1b.1A.6Y="%"}}1k{if(13.1o("1n-2j").3E(/^#/)){if(13.1b.4i=i(13.1o("1n-2j").4r(/^#/,""))){if(i(13.1b.4i).1E().1g>50){if("2y"===13.1b.1A.1f){13.1b.1A.6V="%";13.1b.1A.1f=2M}if("2y"===13.1b.1A.1g){13.1b.1A.6Y="%";13.1b.1A.1g=2M}}}1k{13.1o("1n-2j","2L")}}if("4f"==13.1b.1U){if("2y"===13.1b.1A.1f){13.1b.1A.6V="2A"}if("2y"===13.1b.1A.1g){13.1b.1A.6Y="2A"}}if("1n"==13.1b.1U){if("2y"===13.1b.1A.1f||"2C"==13.1o("1n-2j")){13.1b.1A.6V="%";13.1b.1A.1f=2M}if("2y"===13.1b.1A.1g||"2C"==13.1o("1n-2j")){13.1b.1A.6Y="%";13.1b.1A.1g=2M}}if("2C"==13.1o("1n-2j")){13.1d.1B("1q-2C-1n")}}13.1b.2j=13.1b.4i?"4i":13.1o("1n-2j");13.1s.3L.x=2u(13.1s.1d.3u("3L-1M-1f")||"0");13.1s.3L.y=2u(13.1s.1d.3u("3L-1H-1f")||"0");13.1i.8T(17(){if(2!==13.1i.1K.2n){1a}13.1i.6U("1K");13.1A=13.1i.1d.1E();13.fo();13.2p=1r;if(1r===13.1o("8V")){13.67()}}.1F(13));if(1r!==13.1o("8V")||"2X"==13.1o("4l")){13.1i.6k(i(17(L){13.7l(L,1r)}).1F(13));13.5F=i(13.8B).1F(13).2H(8C)}13.eY()},2f:17(){13.fv();if(13.1b){13.1b.1d.5h()}if(13.4t){13.4t.2f();13.4t=1h}if(13.3p){13.3p.5h()}if(13.1J){i(A.1e.48()).1y({78:""})}i(13.3H).3e(17(I){i(I.4m).1Q("1q-6N-6O").1Q(13.1o("5H")||"1q-$i8-65-41-64-2T$")},13);if(13.6Z){13.3I.3c(13.6Z);if(13.9k){13.6Z.3F("1W",13.9k)}}if(13.6H){13.3I.3F("8t",13.6H)}if(13.1d){13.1d.5h()}},7l:17(J,K){1c I=13.1i;if(2!==J.1n.2n){13.1i=J;13.2p=1r;13.1b.5s(1l);1a}13.1i=J;13.1i.6U(13.1J?"1n":"1K");13.1b.1i.1W=13.1i.7L("1n");13.1b.1d.1Q("1q-4f");13.1b.1i.2t("2m");13.1b.1i.5z("2m");13.1b.1d.1E();4J(i(17(){1c M=13.1b.1i.1E(),L;13.3o=13.1i.1E("1n");if(M.1f*M.1g>1&&M.1f*M.1g<13.3o.1f*13.3o.1g){13.3o=M}13.2a=A.4a(13.3o);if("4f"==13.1b.1U){13.1b.1d.1B("1q-4f")}13.fw();13.1s.1i.1W=13.1i.1d.8U||13.1i.1d.1W;13.1b.5s(13.1b.1U&&!(13.1J&&"4f"==13.1b.1U));13.2p=1r;13.5y=1h;13.5O();13.1d.1B("1q-2p");13.bK();if(I!==13.1i){u("es",13.id,I.4m,13.1i.4m);if(13.8S){L=13.8S;13.8S=1h;13.3S(L.1i,L.f2)}}1k{u("en",13.id)}if(13.73){13.1d.2W(13.73.1v,13.73)}1k{if(13.1J&&"2X"==13.1o("3v")){13.4B()}1k{if(!!K){13.67()}}}}).1F(13),hC)},eY:17(){1c J=13.id,I,K;K=1t fp("1n\\\\-id(\\\\s+)?:(\\\\s+)?"+J+"($|;)");if(A.1e.2J.at){I=A.$A(1m.aA(\'[3w-1n-id="\'+13.id+\'"]\'));I=i(I).5L(A.$A(1m.aA(\'[cc*="1n-id"]\')).2Y(17(L){1a K.3m(L.2t("cc")||"")}))}1k{I=A.$A(1m.9R("A")).2Y(17(L){1a J==L.2t("3w-1n-id")||K.3m(L.2t("cc")||"")})}i(I).3e(17(M){1c L,N;i(M).1C("2Q",17(O){O.3U()});L=1t l().a0(M,13.6H);if(13.1i.1n.1W.4G(L.1n.1W)&&13.1i.1K.1W.4G(L.1K.1W)){i(L.4m).1B("1q-6N-6O");L=13.1i;L.4m=M}if(!L.4e&&13.1i.4e){L.4e=13.1i.4e}N=i(17(){13.3S(L)}).1F(13);i(M).1C("6I",17(O){if("fm"in O){O.fm()}},5);i(M).1C("1Y "+("7A"==13.1o("bx")?"7F 8m":"1S"),i(17(P,O){if(13.5X){3Y(13.5X)}13.5X=1l;if("7F"==P.1v){13.5X=i(N).2H(O)}1k{if("1Y"==P.1v||"1S"==P.1v){N()}}}).2K(13,60)).1B(13.1o("5H")).1B("1q-6N");L.8T();if(1r!==13.1o("8V")){L.bS()}13.3H.3b(L)},13)},3S:17(I,J){if(!13.2p){13.8S={1i:I,f2:J};1a}if(!I||I===13.1i){1a 1l}13.4n(1h,1r);13.2p=1l;13.1d.1Q("1q-2p");13.5F=i(13.8B).1F(13).2H(8C);I.6k(i(17(Q){1c K,R,P,M,L,O,N=(A.1e.2B<10)?"1E":"7u";13.bK();Q.6U("1K");if(!Q.1d){13.2p=1r;13.1d.1B("1q-2p");1a}13.a3(Q);K=13.1i.1d[N]();if(13.1J){Q.6U("1n");P=A.$1t("2Z").1B("1q-2o-bg");if(A.1e.2J.8O||A.1e.2B<10){P.3c(A.$1t("29",{1W:Q.7L("1n")}).1y({2s:0}))}1k{P.3c(1t A.9Z(Q.1d).5c(b).6M().1y({2s:0}))}i(P).1y({"z-9c":-99}).21(13.3p)}if(13.1J&&"1n"===13.1b.1U&&"2X"===13.1o("3v")){i(Q.1d).1y({2s:0}).21(13.1d);R=K;L=[Q.1d,13.1i.1d];O=[{2s:[0,1]},{2s:[1,0]}];i(Q.1d).1y({"1V-1f":1p.2g(Q.1E("1n").1f,13.7m()),"1V-1g":1p.2g(Q.1E("1n").1g,13.6R())})}1k{13.1d.1y({1g:13.1d[N]().1g});13.1i.1d.1y({2j:"5v",1H:0,1M:0,2R:0,2L:0,1f:"2M%",1g:"2M%","1V-1f":"","1V-1g":""});i(Q.1d).1y({"1V-1f":1p.2g(Q.1E(13.1J?"1n":"1K").1f,13.1J?13.7m():6i),"1V-1g":1p.2g(Q.1E(13.1J?"1n":"1K").1g,13.1J?13.6R():6i),2j:"hm",1H:0,1M:0,2s:0,2h:""}).21(13.1d);R=i(Q.1d)[N]();if(!J){i(Q.1d).1y({"2g-1f":K.1f,1g:K.1g,"1V-1f":K.1f,"1V-1g":""})}13.1d.1y({1g:"",78:""}).1E();i(Q.1d).1E();L=[Q.1d,13.1i.1d];O=[A.26({2s:[0,1]},J?{43:[0.6,1]}:{"2g-1f":[K.1f,R.1f],"1V-1f":[K.1f,R.1f],1g:[K.1g,R.1g]}),{2s:[1,0]}]}if(13.1J){if(13.3V.4p&&P.4p){M=i(13.3V.4p).3u("2s");if(A.1e.5Y){L=L.5L([P.4p]);O=O.5L([{2s:[0.az,M]}])}1k{L=L.5L([P.4p,13.3V.4p]);O=O.5L([{2s:[0.az,M]},{2s:[M,0.az]}])}}}1t A.9g(L,{5e:(J||13.1o("fd"))?J?8C:hl:0,1X:J?"4Y-4R(0.88, 0.9P, 0.ax, 1.bM)":(K.1f==R.1f)?"9h":"4Y-4R(0.25, .1, .1, 1)",7a:i(17(){13.1i.1d.2T().2t("2m");13.1i.1d.5z("2m");i(Q.1d).1y(13.1J?{1f:"2y",1g:"2y"}:{1f:"",1g:""}).1y({"2g-1f":"","2g-1g":"",2s:"","1V-1f":1p.2g(Q.1E(13.1J?"1n":"1K").1f,13.1J?13.7m():6i),"1V-1g":1p.2g(Q.1E(13.1J?"1n":"1K").1g,13.1J?13.6R():6i)});if(13.1J){13.3V.2T();13.3V=2z;13.3V=P.3K("z-9c",-2M);i(13.3V.4p).1y({2s:""});if(13.3W){if(Q.3s){if(Q.4e){13.3W.5t("").3c(A.$1t("a",{6Q:Q.4e}).1C("1Y 1S",13.9O.1F(13)).5t(Q.3s))}1k{13.3W.5t(Q.3s).1B("1q-5u")}}1k{13.3W.1Q("1q-5u")}}}13.7l(Q)}).1F(13),bF:i(17(S,T){if(2z!==S.43){T.3K("2h","43("+S.43+")")}})}).4O(O)}).1F(13))},a3:17(J){1c I=1l;i(13.3H).3e(17(K){i(K.4m).1Q("1q-6N-6O");if(K===J){I=1r}});if(I&&J.4m){i(J.4m).1B("1q-6N-6O")}if(13.4t){13.4t.fq(J.eF)}},fw:17(I){if(13.1i.3s&&"3Q"!==13.1o("7S")&&"2D"!==13.1b.1U){if(!13.1b.3s){13.1b.3s=A.$1t("2Z",{"41":"1q-3s"}).21(13.1b.1d.1B("3s-"+13.1o("7S")))}13.1b.3s.5t(13.1i.3s)}},67:17(I,L,J){1c K;if(!13.1J){if(13.6A<=0){1a}if(1r!==J){13.6A--}}if(2z===L||1h===L){if(!13.1b.2V&&!13.1b.3t){if(13.1o("4c")&&(13.1b.5k||!13.1i.2l())){if("7A"==13.1b.7b){L=13.1o("bt")}1k{if("2Q"==13.1b.7b){L=13.1o("a5")}}}1k{L=13.1o("2o")?13.1o("93"):""}}1k{L=13.1o("2o")?13.1o("93"):""}}if(!L){13.ba();1a}K=13.1d;if(!13.3n){13.3n=A.$1t("2Z",{"41":"1q-3n"});13.bc=A.$1t("bl",{"41":"1q-3n-hr"}).3c(1m.ar(L)).21(13.3n);i(13.3n).21(13.1d)}1k{i(13.bc).5t(L)}13.3n.1y({"1X-bs":""}).1Q("1q-3n-3r");if(13.1J){K=13.4Q}1k{if((13.1b.2V||13.1b.3t)&&"2D"!==13.1b.1U&&"2C"==13.1b.2j){K=13.1b.1d}}if(1r===I){4J(i(17(){13.3n.1B("1q-3n-3r")}).1F(13),16)}13.3n.21(K)},ba:17(){if(13.3n){13.3n.1y({"1X-bs":"f5"}).1B("1q-3n-3r")}},8B:17(){if(!13.6y){13.6y=A.$1t("2Z",{"41":"1q-hp"});13.1d.3c(13.6y);13.6y.1E()}13.6y.1B("f1")},bK:17(){3Y(13.5F);13.5F=1h;if(13.6y){i(13.6y).1Q("f1")}},7O:17(K,O){1c N=A.4a(13.1b.1A),M=(!13.1J&&13.1b.4i)?i(13.1b.4i).1E():{1f:0,1g:0},J,I,L=13.1A,P={x:0,y:0};O=O||13.1b.2j;13.79=13.1i.1d.1E();13.1A=13.1i.1d.1E();13.24=13.1i.1d.7u();if(!M.1g){M=13.1A}if(1l===13.1o("f9")||1l===13.1b.1U||"4f"===13.1b.1U){K=1l}if("4f"==13.1b.1U){if("2y"===N.1f){N.1f=13.3o.1f}if("2y"===N.1g){N.1g=13.3o.1g}}if(13.1J&&"2D"==13.1b.1U){N.1f=70;N.1g="2y"}if("2D"==13.1b.1U&&"2y"===N.1g){13.1b.1f=2u(N.1f/2M)*1p.2g(M.1f,M.1g);13.1b.1g=13.1b.1f}1k{if("1n"==13.1b.1U&&"2C"==O){13.1A=13.1d.1E();M=13.1A;13.24=13.1d.7u();13.1b.1f=M.1f;13.1b.1g=M.1g}1k{13.1b.1f=("%"===N.6V)?2u(N.1f/2M)*M.1f:5K(N.1f);13.1b.1g=("%"===N.6Y)?2u(N.1g/2M)*M.1g:5K(N.1g)}}if("4f"==13.1b.1U){I=1p.2g(1p.2g(13.1b.1f/13.3o.1f,13.1b.1g/13.3o.1g),1);13.1b.1f=13.3o.1f*I;13.1b.1g=13.3o.1g*I}13.1b.1f=1p.3R(13.1b.1f);13.1b.1g=1p.3R(13.1b.1g);13.1b.ap=13.1b.1f/13.1b.1g;13.1b.1d.1y({1f:13.1b.1f,1g:13.1b.1g});if(K){M=13.1J?13.3p.1E():13.1b.1d.1E();if(!13.1J&&(13.79.1f*13.79.1g)/(13.3o.1f*13.3o.1g)>0.8){13.2a.1f=1.5*13.3o.1f;13.2a.1g=1.5*13.3o.1g}1k{13.2a=A.4a(13.3o)}}if(1l!==13.1b.1U&&!13.1b.2V&&!(13.1J&&"2X"==13.1o("3v"))){if((13.79.1f*13.79.1g)/(13.2a.1f*13.2a.1g)>0.8){13.2a=A.4a(13.3o);13.1b.5s(1l)}1k{13.1b.5s(1r)}}13.1b.1i.1y({1f:13.2a.1f,1g:13.2a.1g});J=13.1b.1d.8K();13.1b.5j=1p.3R(J.1f);13.1b.4W=1p.3R(J.1g);13.1s.1f=1p.3R(13.1b.5j/(13.2a.1f/13.1A.1f));13.1s.1g=1p.3R(13.1b.4W/(13.2a.1g/13.1A.1g));13.1s.1d.1y({1f:13.1s.1f,1g:13.1s.1g});13.1s.1i.1y(13.1A);A.26(13.1s,13.1s.1d.1E());if(13.1b.2V){3Y(13.5a);13.5a=1h;if(13.1s.5x){13.1s.34.x*=(13.1A.1f/L.1f);13.1s.34.y*=(13.1A.1g/L.1g);P.x=13.1s.5w.x;P.y=13.1s.5w.y}1k{P.x=13.24.1M+13.1s.1f/2+(13.1s.34.x*(13.1A.1f/L.1f));P.y=13.24.1H+13.1s.1g/2+(13.1s.34.y*(13.1A.1g/L.1g))}13.81(1h,P)}},9U:17(M){1c P,O,I,N,L,K,J=i(13.1d).2e("cr");I=a(5);L=13.1b.2j;N=13.1J?"2C":13.1b.4i?"4i":13.1o("1n-2j");K=13.1J&&"1n"==13.1b.1U?13.3p:1m.3D;if(13.1J){I.y=0;I.x=0}if(!M){13.7O(1r,N)}P=13.24.1H;if("2D"!==13.1b.1U){if(M){13.7O(1l);1a}4F(N){1D"2C":1D"4i":P=0;O=0;1G;1D"1H":P=13.24.1H-13.1b.1g-13.1o("1n-5o");if(I.1H>P){P=13.24.2R+13.1o("1n-5o");N="2R"}O=13.24.1M;1G;1D"2R":P=13.24.2R+13.1o("1n-5o");if(I.2R<P+13.1b.1g){P=13.24.1H-13.1b.1g-13.1o("1n-5o");N="1H"}O=13.24.1M;1G;1D"1M":O=13.24.1M-13.1b.1f-13.1o("1n-5o");if(I.1M>O&&I.2L>=13.24.2L+13.1o("1n-5o")+13.1b.1f){O=13.24.2L+13.1o("1n-5o");N="2L"}1G;1D"2L":1R:O=13.24.2L+13.1o("1n-5o");if(I.2L<O+13.1b.1f&&I.1M<=13.24.1M-13.1b.1f-13.1o("1n-5o")){O=13.24.1M-13.1b.1f-13.1o("1n-5o");N="1M"}1G}4F(13.1o("1n-2j")){1D"1H":1D"2R":if(I.1H>P||I.2R<P+13.1b.1g){N="2C"}1G;1D"1M":1D"2L":if(I.1M>O||I.2L<O+13.1b.1f){N="2C"}1G}13.1b.2j=N;if(!13.1b.3t&&!13.1b.2V){if(A.1e.38&&!13.1J&&"1n"==13.1b.1U){if(13.1o("2o")){13.1b.5s("2C"!==N)}1k{if("2Q"!==13.1o("4l")){13.1b.7b="2C"===N?"2Q":13.1o("4l");13.an();13.am();13.8r("2Q"===13.1b.7b);13.8k("2Q"===13.1b.7b&&!13.1o("2o"))}}13.67(1l,1h,1r)}1a}13.7O(1l);if(M){1a}if("4i"==N){K=13.1b.4i;I.y=0;I.x=0}if("2C"==N){if("4f"!==13.1b.1U){13.1b.1d.1B("1q-2C");13.1d.1B("1q-2C-1n")}13.1s.4h();P=13.24.1H+I.y;O=13.24.1M+I.x;if(!13.1J&&A.1e.2B&&A.1e.2B<11){P=0;O=0;K=13.1d}}1k{P+=I.y;O+=I.x;13.1d.1Q("1q-2C-1n");13.1b.1d.1Q("1q-2C")}13.1b.1d.1y({1H:P,1M:O})}1k{13.7O(1l);K=13.1d}13.1b.1d[13.1J?"1B":"1Q"]("1q-1J");if(!13.1J&&J){J.21("1n"==13.1b.1U&&"2C"==N?13.1b.1d:13.1d,((1p.5P(1p.6x()*bi)+1)%2)?"1H":"2R")}13.1b.1d.21(K)},fu:17(O){1c K,I,M,L,N=1l,J=O.aQ?5:3/54;i(O).2f();J=(2M+J*1p.3A(O.7P))/2M;if(O.7P<0){J=1/J}if("2D"==13.1b.1U){I=1p.1V(2M,1p.5N(13.1b.1f*J));I=1p.2g(I,13.1A.1f*0.9);M=I/13.1b.ap;13.1b.1f=1p.3R(I);13.1b.1g=1p.3R(M);13.1b.1d.1y({1f:13.1b.1f,1g:13.1b.1g});K=13.1b.1d.8K();13.1b.5j=1p.3R(K.1f);13.1b.4W=1p.3R(K.1g);N=1r}1k{if(!13.1J&&"1n"==13.1b.1U){I=1p.1V(50,1p.5N(13.1s.1f*J));I=1p.2g(I,13.1A.1f*0.9);M=I/13.1b.ap;13.2a.1f=1p.3R((13.1b.5j/I)*13.1A.1f);13.2a.1g=1p.3R((13.1b.4W/M)*13.1A.1g);13.1b.1i.1y({1f:13.2a.1f,1g:13.2a.1g})}1k{1a}}L=i(1j).7r();13.1s.1f=1p.3R(13.1b.5j/(13.2a.1f/13.1A.1f));13.1s.1g=1p.3R(13.1b.4W/(13.2a.1g/13.1A.1g));13.1s.1d.1y({1f:13.1s.1f,1g:13.1s.1g});A.26(13.1s,13.1s.1d.1E());if(13.1b.2V){3Y(13.5a);13.5a=1h;if(N){13.5a=1r}13.81(1h,{x:O.x-L.x,y:O.y-L.y});if(N){13.5a=1h}}},8r:17(K){1c J;1c I=K?"3G 1S":"5r"+(1j.2v.3a?" 76":1j.2v.9V?" 7J":"")+(1j.2v.3a?" 6D":1j.2v.9V?" 7I":" 87");1c L=13.1d.2e("1q:5g:4B:fn",(!K)?i(17(M){if(c(M)&&!h(M)){1a}if(M&&"3x"===M.2k&&"76"!==M.1v){1a}J=(A.1e.2B<9)?A.26({},M):M;if(!13.5y){3Y(13.5y);13.5y=4J(i(17(){13.4B(J)}).1F(13),hS)}}).2K(13):i(13.4B).2K(13));13.1d.3f("1q:5g:4B:1z",I).1C(I,L,10)},an:17(J){1c I=13.1d.2e("1q:5g:4B:1z"),K=13.1d.2e("1q:5g:4B:fn");13.1d.1P(I,K);13.1d.33("1q:5g:4B:fn")},8k:17(J){1c I=J?"3G 1S":"5V"+(1j.2v.3a?" 6t bY":1j.2v.9V?" 5W em":" 8m");1c K=13.1d.2e("1q:5g:4n:fn",i(17(L){if(c(L)&&!h(L)){1a}if(13.1b.1d!==L.8d()&&!(("2C"==13.1b.2j||"2D"==13.1b.1U)&&13.1b.1d.a4(L.8d()))&&!13.1d.a4(L.8d())){13.4n(L)}}).2K(13));13.1d.3f("1q:5g:4n:1z",I).1C(I,K,20)},am:17(){1c I=13.1d.2e("1q:5g:4n:1z"),J=13.1d.2e("1q:5g:4n:fn");13.1d.1P(I,J);13.1d.33("1q:5g:4n:fn")},fo:17(){13.ff=13.5B.1F(13);13.1d.1C(["5r",1j.2v.3a?"76":"7J"],i(17(I){if((A.1e.6S||"6L"===A.1e.4S&&A.1e.5Y)&&13.1o("4c")&&"2Q"!==13.1o("4l")&&"5r"===I.1v){I.3U();if(A.1e.5Y){I.5q()}}if(!13.1b.2V){1a}if("2C"===13.1b.2j){13.1s.5w=I.7W()}}).2K(13),10);13.1d.1C(["5V",1j.2v.3a?"6t":"5W"],i(17(I){if(c(I)&&h(I)){13.1s.7k=1l}}).2K(13),10);13.1d.1C("7R "+("6L"===A.1e.4S?"":1j.2v.3a?"6D":1j.2v.9V?"7I":"87"),i(13.81).2K(13));if(13.1o("4c")){13.8r("2Q"===13.1o("4l"));13.8k("2Q"===13.1o("4l")&&!13.1o("2o"))}13.1d.1C("6I",17(I){I.5q()},10).1C("1S",i(17(I){13.1d.bG("f7","2Q");if(13.1J){13.3p.2W("1S",I)}}).1F(13),15);if(13.1o("2o")){13.1d.1C("1Y 1S",i(13.2o).2K(13),15)}1k{13.1d.1C("1Y 1S",i(13.9O).2K(13),15)}if(13.3H.1I>1){13.b9()}if(!A.1e.38&&13.1o("f6")){13.1d.1C("4w",13.fu.2K(13))}i(1j).1C(A.1e.38?"71":"71 69",13.c2)},fv:17(){if(13.1d){13.1d.1P("4w")}i(1j).1P("71 69",13.c2);i(13.3H).3e(17(I){i(I.4m).c1()})},4B:17(O){1c P,N,L,M,I,J=0,K=0;if(!13.2p||!13.1b.5k||13.1b.2V||13.1b.3t){if(!13.1i.2l()){if(O){13.73=e(O);O.4v()}13.1i.6k(13.7l.1F(13));if(!13.5F){13.5F=i(13.8B).1F(13).2H(8C)}}1a}if(O&&"6D"==O.1v&&"3x"==O.2k){1a}if(!13.1o("4c")&&13.1o("2o")&&!13.1J){13.1b.2V=1r;1a}13.1b.3t=1r;if(13.1J&&"1n"==13.1b.1U){M=13.1i.1d.7H();13.5p.1B("1q-1n-in");I=13.4Q.7H();K=((M.1M+M.2L)/2-(I.1M+I.2L)/2);J=((M.1H+M.2R)/2-(I.1H+I.2R)/2)}13.1b.1i.1P("2U");13.1b.1d.1Q("1q-9W").1P("2U");13.1b.1d.1B("1q-3t");13.1d.1B("1q-3t");13.9U();N=("1n"==13.1b.1U)?13.1b.2j:13.1b.1U;if(A.1e.2J.1X&&!(13.1J&&"2X"==13.1o("3v"))){if("2C"==N){L=13.1i.1d.1E();13.1b.1i.1y({2h:"4k(0,"+J+"2A, 0) 43("+L.1f/13.2a.1f+", "+L.1g/13.2a.1g+")"}).1E();13.1b.1i.1C("2U",i(17(){13.1b.1i.1P("2U");13.1b.1d.1Q("1q-3t 1q-p-"+N);13.1b.3t=1l;13.1b.2V=1r}).1F(13));13.1b.1d.1B("1q-p-"+N).1E();if(!A.1e.38&&A.1e.4o&&("4o"===A.1e.3B||"66"===A.1e.3B)){13.1b.3t=1l;13.1b.2V=1r}}1k{13.1b.1d.1C("2U",i(17(){13.1b.1d.1P("2U");13.1b.1d.1Q("1q-3t 1q-p-"+N)}).1F(13));13.1b.1d.1B("1q-p-"+N).1E();13.1b.1d.1Q("1q-p-"+N);13.1b.3t=1l;13.1b.2V=1r}}1k{13.1b.1d.1Q("1q-3t");13.1b.3t=1l;13.1b.2V=1r}if(!13.1J){13.67(1r)}if(O){O.2f().4v();P=O.7W();if("2D"==13.1b.1U&&(/1Y/i).3m(O.1v)){P.y-=13.1b.1g/2+10}if("2C"==N&&((/1Y/i).3m(O.1v)||c(O))){13.1s.34={x:0,y:0};P.x=-(P.x-13.24.1M-13.1A.1f/2)*(13.2a.1f/13.1A.1f);P.y=-(P.y-13.24.1H-13.1A.1g/2)*(13.2a.1g/13.1A.1g)}}1k{P={x:13.24.1M+(13.24.2L-13.24.1M)/2,y:13.24.1H+(13.24.2R-13.24.1H)/2};if(A.1e.38&&13.1J&&"2X"===13.1o("3v")){13.1s.5x=1r;13.1s.34={x:0,y:0};P.x=-(P.x-13.24.1M-13.1A.1f/2)*(13.2a.1f/13.1A.1f);P.y=-(P.y-13.24.1H-13.1A.1g/2)*(13.2a.1g/13.1A.1g)}}13.1d.1Q("1q-3t").1B("1q-2V");P.x+=-K;P.y+=-J;13.1s.5w={x:0,y:0};13.1s.dx=0;13.1s.dy=0;13.81(O,P,1r);u("eC",13.id)},4n:17(K,P){1c N,L,I,J,M=0,O=0,Q=13.1b.2V;13.73=1h;if(!13.2p){1a}if(K&&"bY"==K.1v&&"3x"==K.2k){1a}3Y(13.5a);13.5a=1h;3Y(13.5y);13.5y=1h;13.1b.3t=1l;13.1b.2V=1l;if(1r!==P&&!13.1J){if(Q){if(A.1e.38&&!13.1J&&"1n"==13.1b.1U){13.9U()}1k{13.67()}}}if(!13.1b.5k){1a}if(K){K.2f()}13.1b.1i.1P("2U");13.1b.1d.1Q("1q-3t").1P("2U");if(13.1J){J=13.4Q.7H();if("2X"!==13.1o("3v")){13.5p.1Q("1q-1n-in")}13.1i.1d.1y({"1V-1g":13.6R()});I=13.1i.1d.7H();O=((I.1M+I.2L)/2-(J.1M+J.2L)/2);M=((I.1H+I.2R)/2-(J.1H+J.2R)/2)}N=("1n"==13.1b.1U)?13.1b.2j:13.1b.1U;if(A.1e.2J.1X&&K&&!(13.1J&&"2X"==13.1o("3v"))){if("2C"==N){13.1b.1i.1C("2U",i(17(){13.1b.1i.1P("2U");13.1d.1Q("1q-2V");4J(i(17(){13.1b.4h()}).1F(13),32)}).1F(13));L=13.1i.1d.1E();13.1b.1d.1B("1q-9W 1q-p-"+N).1E();13.1b.1i.1y({2h:"4k(0,"+M+"2A,0) 43("+L.1f/13.2a.1f+", "+L.1g/13.2a.1g+")"})}1k{13.1b.1d.1C("2U",i(17(){13.1b.4h();13.1d.1Q("1q-2V")}).1F(13));13.1b.1d.3u("2s");13.1b.1d.1B("1q-9W 1q-p-"+N);13.1d.1Q("1q-2V")}}1k{13.1b.4h();13.1d.1Q("1q-2V")}13.1s.dx=0;13.1s.dy=0;13.1s.5w={x:0,y:0};13.1s.4h();if(Q){u("eV",13.id)}},81:17(S,R,Q){1c K=R,M,L,O=0,J,N=0,I,T,P=1l;if(!13.1b.2V&&!Q){1a}if(S){i(S).3U().5q();if(c(S)&&!h(S)){1a}P=(/1Y/i).3m(S.1v)||c(S);if(P&&!13.1s.7k){13.1s.7k=P}if(!K){K=S.7W()}}if("4f"==13.1b.1U){1a}if("1n"==13.1b.1U&&"2C"===13.1b.2j&&(S&&P||!S&&13.1s.5x)){13.1s.5x=1r;M=13.1s.34.x+(K.x-13.1s.5w.x);L=13.1s.34.y+(K.y-13.1s.5w.y);13.1s.5w=K;O=1p.2g(0,13.1b.5j-13.2a.1f)/2;J=-O;N=1p.2g(0,13.1b.4W-13.2a.1g)/2;I=-N}1k{13.1s.5x=1l;if("2D"==13.1b.1U){K.y=1p.1V(13.24.1H,1p.2g(K.y,13.24.2R));K.x=1p.1V(13.24.1M,1p.2g(K.x,13.24.2L))}M=K.x-13.24.1M;L=K.y-13.24.1H;J=13.1A.1f-13.1s.1f;I=13.1A.1g-13.1s.1g;M-=13.1s.1f/2;L-=13.1s.1g/2}if("2D"!==13.1b.1U){M=1p.1V(O,1p.2g(M,J));L=1p.1V(N,1p.2g(L,I))}13.1s.34.x=M=1p.5N(M);13.1s.34.y=L=1p.5N(L);if("1n"==13.1b.1U&&"2C"!=13.1b.2j){if(A.1e.2J.2h){13.1s.1d.1y({2h:"9X("+13.1s.34.x+"2A,"+13.1s.34.y+"2A)"});13.1s.1i.1y({2h:"9X("+-(13.1s.34.x+13.1s.3L.x)+"2A, "+-(13.1s.34.y+13.1s.3L.y)+"2A)"})}1k{13.1s.1d.1y({1H:13.1s.34.y,1M:13.1s.34.x});13.1s.1i.1y({1H:-(13.1s.34.y+13.1s.3L.y),1M:-(13.1s.34.x+13.1s.3L.x)})}}if("2D"==13.1b.1U){if(13.1s.7k&&!(S&&"3G"==S.1v)){K.y-=13.1b.1g/2+10}13.1b.1d.1y({1H:K.y-13.24.1H-13.1b.1g/2,1M:K.x-13.24.1M-13.1b.1f/2})}if(!13.5a){13.1s.dx=0;13.1s.dy=0;13.5B(1)}},5B:17(K){1c J,I;if(!gF(K)){if(13.1s.5x){K=13.1s.7k?0.4:0.16}1k{K=13.1o("eD")?0.2:13.1s.7k?0.4:0.8}}J=((13.1s.34.x-13.1s.dx)*K);I=((13.1s.34.y-13.1s.dy)*K);13.1s.dx+=J;13.1s.dy+=I;if(!13.5a||1p.3A(J)>0.c9||1p.3A(I)>0.c9){13.1b.1i.1y(A.1e.2J.2h?{2h:g+(13.1s.5x?13.1s.dx:-(13.1s.dx*(13.2a.1f/13.1A.1f)-1p.1V(0,13.2a.1f-13.1b.5j)/2))+"2A,"+(13.1s.5x?13.1s.dy:-(13.1s.dy*(13.2a.1g/13.1A.1g)-1p.1V(0,13.2a.1g-13.1b.4W)/2))+"2A"+C+" 43(1)"}:{1M:-(13.1s.dx*(13.2a.1f/13.1A.1f)+1p.2g(0,13.2a.1f-13.1b.5j)/2),1H:-(13.1s.dy*(13.2a.1g/13.1A.1g)+1p.2g(0,13.2a.1g-13.1b.4W)/2)})}if("2D"==13.1b.1U){1a}13.5a=4J(13.ff,16)},b9:17(){1c U,K,P=30,M=go,R,S="",J={},I,O,T=0,V={1X:A.1e.7T+6a.7q(32)+"eQ 4Y-4R(.18,.35,.58,1)"},L,Q,N=i(17(W){if(!13.2p||13.1b.2V){1a}if(W.2n=="3M"){3Y(13.5y);13.5y=1h;T=0;J={x:W.x,y:W.y,ey:W.2N};U=13.1A.1f;K=U/2;13.1i.1d.1P("2U");13.1i.1d.3K("1X","");13.1i.1d.3K("2h","4k(0, 0, 0)");Q=1h}1k{I=(W.x-J.x);O={x:0,y:0,z:0};if(1h===Q){Q=(1p.3A(W.x-J.x)<1p.3A(W.y-J.y))}if(Q){1a}W.2f();if("9M"==W.2n){T=0;L=1h;R=W.2N-J.ey;if(1p.3A(I)>K||(R<M&&1p.3A(I)>P)){if((S=(I>0)?"et":(I<=0)?"ks":"")){if(S=="et"){L=13.8h();T+=U*10}1k{L=13.8i();T-=U*10}}}O.x=T;O.eH=-90*(O.x/U);13.1i.1d.1C("2U",i(17(X){13.1i.1d.1P("2U");13.1i.1d.3K("1X","");if(L){13.1i.1d.1y({2h:"4k("+O.x+"2A, 6l, 6l)"});13.3S(L,1r)}}).1F(13));13.1i.1d.1y(V);13.1i.1d.1y({"1X-5e":O.x?"kV":"eQ",2s:1-0.7*1p.3A(O.x/U),2h:"4k("+O.x+"2A, 6l, 6l)"});I=0;1a}O.x=I;O.z=-50*1p.3A(O.x/K);O.eH=-60*(O.x/K);13.1i.1d.1y({2s:1-0.7*1p.3A(O.x/K),2h:"4k("+O.x+"2A, 6l, "+O.z+"2A)"})}}).1F(13);13.1d.1C("2r",N)},d7:17(){1c J,I;if(13.3H.1I){13.4P=13.3H}1k{J=13.3I.2t("3w-aG");if(J){if(A.1e.2J.at){I=A.$A(1m.aA(\'.9N[3w-aG="\'+J+\'"]\'))}1k{I=A.$A(1m.9R("A")).2Y(17(K){1a J==K.2t("3w-aG")})}i(I).3e(17(L){1c K,M;K=j(L);if(K&&K.3H.1I>0){1a}if(K){M=1t l(K.1i.1K.2b,K.1i.1n.2b,K.1i.3s,1h,K.1i.4m)}1k{M=1t l().a0(L,K?K.6H:1h)}if(13.1i.1n.1W.4G(M.1n.2b)&&13.1i.1K.1W.4G(M.1K.2b)){M=13.1i}13.4P.3b(M)},13);13.74=13.1i}}if(13.4P.1I>1){13.5p.1B("fe-bu");13.5f=A.$1t("2Z",{"41":"1q-2o-iS"}).21(13.5p);13.4t=1t s(13.5f);i(13.4P).3e(17(K){1c L=i(17(M){13.a3(K);13.3S(K)}).1F(13);K.eF=13.4t.fl(A.$1t("29",{1W:K.7L("1K")}).1C("1Y 1S",17(M){M.2f()}).1C("1Y "+("7A"==13.1o("bx")?"7F 8m":"1S"),i(17(N,M){if(13.5X){3Y(13.5X)}13.5X=1l;if("7F"==N.1v){13.5X=i(L).2H(M)}1k{if("1Y"==N.1v||"1S"==N.1v){L()}}}).2K(13,60)))},13);13.2P.4A.5u();13.2P.4M.5u()}1k{13.5p.1Q("fe-bu");13.2P.4A.4h();13.2P.4M.4h()}},d6:17(){1c I;if(13.4t){13.4t.2f();13.4t=1h}if(13.5f){13.5f.2T();13.5f=1h}if(13.4P.1I>1&&!13.3H.1I){13.1d.1P("2r");13.1i.1d.2T().2t("2m");13.1i.1d.5z("2m");13.74.1d.21(13.1d);13.7l(13.74);5U(I=13.4P.jW()){if(I!==13.74){if(I.1K.1d){I.1K.1d.5h();I.1K.1d=1h}if(I.1n.1d){I.1n.1d.5h();I.1n.1d=1h}I=1h}}}13.4P=[]},6z:17(){if(!13.2p||!13.1J){1a}if("a2"==A.1e.4S&&"a6"==A.1e.3B&&7==5K(A.1e.6X)){ep(n);n=1h}i(1m).1P("br",13.a7);13.4n(1h,1r);13.2p=1l;if(y.1e.56.a9&&y.1e.56.5k()){y.1e.56.er()}1k{if(A.1e.2J.1X){13.1d.1P("2U").1y({1X:""});13.1d.1C("2U",13.8o);if(A.1e.4o&&("4o"===A.1e.3B||"66"===A.1e.3B)){4J(i(17(){13.8o()}).1F(13),8s)}13.3V.1P("2U").1y({1X:""});13.3V.1y({1X:"bC 0.6s 4Y-4R(0.eL, 0.jx, 0.eR, 0.iZ) 0.7w"}).1E();if(A.1e.6S&&"4o"!==A.1e.3B){13.1d.1y({1X:"bC .4s 4Y-4R(0.8s, 0, 0.bI, 0.a8) 7w"}).1E()}1k{13.1d.1y({1X:"bC .4s 4Y-4R(0.8s, -0.jm, 0.bI, 0.a8) 7w"}).1E()}if(1l!==13.1b.1U&&"2X"==13.1o("3v")&&"2D"!==13.1o("4I")){13.1i.1d.1y({"1V-1g":13.1i.1E("1n").1g});13.1i.1d.1y({"1V-1f":13.1i.1E("1n").1f})}13.3V.1y({2s:0.4});13.1d.1y({2s:0.kO,2h:"43(0.4)"})}1k{13.8o()}}},2o:17(K){if(!13.1i.2l()||!13.2p||13.1J){if(!13.1i.2l()){if(K){13.73=e(K);K.4v()}13.1i.6k(13.7l.1F(13));if(!13.5F){13.5F=i(13.8B).1F(13).2H(8C)}}1a}if(K){K.4v()}1c I=i(13.1d).2e("cr"),J=1m.kk();13.ba();13.6A--;13.4n(1h,1r);13.an();13.am();13.2p=1l;if(!13.3p){13.3p=A.$1t("2Z").1B("1q-2o").1B(13.1o("5H")).1y({2s:0});13.5p=A.$1t("2Z").1B("1q-2o-cu").21(13.3p);13.8L=A.$1t("2Z").1B("1q-2o-kb").21(13.5p);i(["4M","4A","6z"]).3e(17(M){1c L="1q-2q";13.2P[M]=A.$1t("2q",{8t:13.1o("a1-kg-"+M)}).1B(L).1B(L+"-"+M);J.bo(13.2P[M]);4F(M){1D"4M":13.2P[M].1C("1Y 1S",17(N){N.2f();13.3S(13.8h())}.2K(13));1G;1D"4A":13.2P[M].1C("1Y 1S",17(N){N.2f();13.3S(13.8i())}.2K(13));1G;1D"6z":13.2P[M].1C("1Y 1S",17(N){N.2f();13.6z()}.2K(13));1G}},13);13.8L.3c(J);13.3p.1C("4w 5r 3G",i(17(L){i(L).2f()}));if(13.1o("fc")){13.3p.1C("1Y 1S",17(N){1c M=N.5D(),L=i("2D"===13.1o("4I")?13.1b.1d:13.1b.1i).7H();if("2X"!==13.1o("3v")&&L.1H<=M.y&&M.y<=L.2R&&L.1M<=M.x&&M.x<=L.2L){N.4v();13.4n(N);1a}if("2X"!==13.1o("3v")&&13.1d.a4(N.f4())){1a}N.2f();13.6z()}.2K(13))}13.a7=i(17(M){1c L=1h;if(27!==M.8u&&37!==M.8u&&39!==M.8u){1a}i(M).2f();if(27===M.8u){13.6z()}1k{L=(37===M.8u)?13.8h():13.8i();if(L){13.3S(L)}}}).2K(13);13.80=i(17(){1c L;13.1d.1P("2U").1y({1X:"",2h:"4k(0,0,0)"});if(13.1J){1a}13.1J=1r;13.3p.1Q("1q-2o-kA").1y({2s:1});13.1b.ao(13.1o("4I"));13.2a=A.4a(13.3o);13.5O();if(13.3W&&13.1i.3s){if(13.1i.4e){13.3W.3c(A.$1t("a",{6Q:13.1i.4e}).1C("1Y 1S",13.9O.1F(13)).5t(13.1i.3s))}1k{13.3W.5t(13.1i.3s)}13.3W.1B("1q-5u")}if("2X"!==13.1o("3v")){13.8r(1r);13.8k(1r)}13.2p=1r;if("2X"===13.1o("3v")){if(1l!==13.1b.1U){13.1b.5s(1r)}if(A.1e.38&&13.8w){13.8w=1l}13.4B()}if((A.1e.38||13.1o("9S"))&&13.1b.5k){if(13.8w||13.6A>0){13.67(1r,13.1o("a5"))}13.8w=1l}13.8L.1Q("1q-3r").1B("1q-9Q 1q-5T");13.5f&&13.5f.1Q("1q-3r").1B("1q-9Q 1q-5T");if(13.4t){13.4t.bj();13.a3(13.1i)}if(I){I.21(13.3p,((1p.5P(1p.6x()*bi)+1)%2)?"1H":"2R")}if(13.4P.1I&&!13.3H.1I){13.b9()}i(1m).1C("br",13.a7);if("a2"==A.1e.4S&&"a6"==A.1e.3B&&7==5K(A.1e.6X)){n=w()}u("cM",13.id)}).1F(13);13.8o=i(17(){13.1d.1P("2U");if(!13.1J){1a}if(13.1J){i(1m).1P("br",13.a7);13.4n(1h,1r)}13.d6();13.1J=1l;13.1b.ao(13.1o("4c"));13.1d.8J(13.1i.6M("1K"),13.1i.1d);13.1i.6U("1K");i(13.1i.1d).1y({1f:"",1g:"","1V-1f":1p.2g(13.1i.1E("1K").1f),"1V-1g":1p.2g(13.1i.1E("1K").1g)});13.1s.1i.1W=13.1i.7L("1K");13.1d.1y({2s:"",1X:""});13.1d.1y({2h:"4k(0,0,0)"});i(13.3I).8J(13.1d,13.8P);13.7O(1r);if(13.3W){13.3W.2T();13.3W=1h}13.an();13.am();if("2X"==13.1o("4l")){13.4B()}1k{if(1l!==13.1o("4c")){13.8r("2Q"===13.1o("4l"));13.8k("2Q"===13.1o("4l")&&!13.1o("2o"))}}13.67();13.3V.1P("2U");13.3p.2T();13.3V.2T();13.3V=1h;i(A.1e.48()).1Q("1q-1J-ej-8c");13.2p=1r;if(A.1e.2B<10){13.5O()}1k{i(1j).bG("d0","71")}u("ct",13.id)}).1F(13);13.8I=A.$1t("2Z",{"41":"1q-1i-cu"}).21(13.5p);13.4Q=A.$1t("5I").21(13.8I);13.8P=13.1d.jr(1l)}13.d7();i(A.1e.48()).1B("1q-1J-ej-8c");i(1m.3D).1E();if("dX"==13.1o("2o")){13.aF();y.1e.56.bL(13.3p,{aE:i(17(){13.80()}).1F(13),aD:13.8o,8n:i(17(){13.av()}).1F(13)})}1k{4J(i(17(){13.aF();13.av()}).1F(13),96)}},aF:17(){1c J,I;J=A.$1t("29",{1W:13.1i.7L("1n")});13.3V=A.$1t("2Z").1B("1q-2o-bg").3c((A.1e.2J.8O||A.1e.2B<10)?J:1t A.9Z(J).5c(b).6M()).21(13.3p);if("2X"===13.1o("3v")&&1l!==13.1o("4I")){13.5p.1B("1q-2X-1n"+("1n"===13.1o("4I")?" 1q-1n-in":"")).1E()}I=i(13.1d)[(A.1e.2B<10)?"1E":"7u"]();i(13.8P).1y({1f:I.1f,1g:I.1g});13.1d.8J(13.1i.6M("1n"),13.1i.1d);13.1i.6U("1n");13.3p.21(1m.3D);13.7m=17(){1c K=13.8I;if(i(13.4Q).1E().1f>50){K=13.4Q}1a 17(){1a"2X"==13.1o("3v")&&1l!==13.1o("4I")&&"2D"!==13.1o("4I")?6i:1p.5N(i(K).8K().1f)}}.2c(13);13.6R=17(){1c K=13.8I;if(i(13.4Q).1E().1g>50){K=13.4Q}1a 17(){1a"2X"==13.1o("3v")&&1l!==13.1o("4I")&&"2D"!==13.1o("4I")?6i:1p.5N(i(K).8K().1g)}}.2c(13);13.8L.1Q("1q-9Q 1q-5T").1B("1q-3r");13.5f&&13.5f.1Q("1q-9Q 1q-5T").1B("1q-3r");13.1i.1d.1y({"1V-1g":1p.2g(13.1i.1E("1n").1g,13.6R())});13.1i.1d.1y({"1V-1f":1p.2g(13.1i.1E("1n").1f,13.7m())});13.4Q.3c(i(13.3I).8J(13.8P,13.1d));if(13.1o("3W")){13.3W=A.$1t("ei",{"41":"1q-3s"}).21(13.4Q)}},av:17(){13.1d.1y({1X:""});13.1d.1y({2h:"43(0.6)"}).1E();if(A.1e.6S&&"4o"!==A.1e.3B){13.1d.1y({1X:A.1e.7T+" 0.6s 4Y-4R(0.88, 0.9P, 0.ax, 1) 7w"})}1k{13.1d.1y({1X:A.1e.7T+" 0.6s 4Y-4R(0.88, 0.9P, 0.ax, 1.bM) 7w"})}if(A.1e.2J.1X){13.1d.1C("2U",13.80);if(A.1e.4o&&("4o"===A.1e.3B||"66"===A.1e.3B)){4J(i(17(){13.80()}).1F(13),l1)}}1k{13.80.2H(16,13)}13.3p.1y({2s:1});13.1d.1y({2h:"43(1)"})},9O:17(){if(13.1i.4e){1j.8c(13.1i.4e,"kM")}},8i:17(){1c I=(13.1J?13.4P:13.3H).2Y(17(L){1a(-1!==L.1K.2n||-1!==L.1n.2n)}),J=I.1I,K=i(I).4L(13.1i)+1;1a(1>=J)?1h:I[(K>=J)?0:K]},8h:17(){1c I=(13.1J?13.4P:13.3H).2Y(17(L){1a(-1!==L.1K.2n||-1!==L.1n.2n)}),J=I.1I,K=i(I).4L(13.1i)-1;1a(1>=J)?1h:I[(K<0)?J-1:K]},dH:17(J,K){1c I=13.3H.2Y(17(L){1a((L.1n.1W.4G(J)||L.1n.2b.4G(J))&&(L.1K.1W.4G(K)||L.1K.2b.4G(K)))})||[];1a I[0]||((K&&J&&"1N"===A.1O(K)&&"1N"===A.1O(J))?1t l(K,J):1h)},aU:17(J){1c I=13.3H.2Y(17(K){1a(K.4m===J)})||[];1a I[0]},dJ:17(I){1a 13.3H[I]}};v={4y:"dc.1.14 (kh)",4O:17(L,J){1c K=1h,I=[];A.$A((L?[i(L)]:A.$A(1m.aq("9N")).5L(A.$A(1m.aq("cd"))))).3e((17(M){if(i(M)){if(!j(M)){K=1t k(M,J);if(z&&!K.1o("b2")){K.2f();K=1h}1k{F.3b(K);I.3b(K)}}}}).1F(13));1a L?I[0]:I},2f:17(L){1c J,K,I;if(L){(K=j(L))&&(K=F.9T(F.4L(K),1))&&K[0].2f()&&(4U K[0]);1a}5U(J=F.1I){K=F.9T(J-1,1);K[0].2f();4U K[0]}},kI:17(I){13.2f(I);1a 13.4O(I)},3S:17(N,M,L,J){1c K=j(N),I;if(K){I="6f"===A.1O(M)?K.aU(M):K.dH(M,L);if(I){K.3S(I)}}},kE:17(L,K){1c J=j(L),I;if(J){4F(A.1O(K)){1D"6f":I=J.aU(K);1G;1D"6b":I=J.dJ(K);1G;1R:}if(I){J.3S(I)}}},4M:17(J){1c I;(I=j(J))&&I.3S(I.8h())},4A:17(J){1c I;(I=j(J))&&I.3S(I.8i())},jX:17(J){1c I;(I=j(J))&&I.4B()},ib:17(J){1c I;(I=j(J))&&I.4n()},2o:17(J){1c I;(I=j(J))&&I.2o()},6z:17(J){1c I;(I=j(J))&&I.6z()},eb:17(I,J){if(!q[I]){q[I]=[]}if("17"==A.1O(J)){q[I].3b(J)}},gh:17(I){1a!!j(I)}};i(1m).1C("9Y",17(){1c J=1j[D+"7n"]||{};t=t();d();H=A.$1t("2Z",{"41":"3k-3r-6G"}).21(1m.3D);G=(A.1e.38&&1j.e0&&1j.e0("(1V-dz-1f: dI), (1V-dz-1g: dI)").g8);if(A.1e.38){A.26(p,m)}1T(1c I=0;I<B.1I;I++){if(J[B[I]]&&A.$F!==J[B[I]]){v.eb(B[I],J[B[I]])}}v.4O();z=1l});1j.cd=1j.cd||{};1a v})();',62,1311,'|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||this||||function|||return|zoomBox|var|node|browser|width|height|null|image|window|else|false|document|zoom|option|Math|mz|true|lens|new|Event|type|options|Custom|jSetCss|event|size|jAddClass|jAddEvent|case|jGetSize|jBind|break|top|length|expanded|small|handler|left|string|jTypeOf|jRemoveEvent|jRemoveClass|default|btnclick|for|mode|max|src|transition|tap|arguments||jAppendTo|||boundaries||extend|||img|zoomSize|url|call||jFetch|stop|min|transform|important|position|pointerType|loaded|style|state|expand|ready|button|touchdrag|opacity|getAttribute|parseFloat|navigator|prototype||auto|undefined|px|ieMode|inner|magnifier|enum|clientX|clientY|jDelay|changedTouches|features|jBindAsEvent|right|100|timeStamp|context|buttons|click|bottom|mousedrag|jRemove|transitionend|active|jCallEvent|always|filter|div||||jDel|pos||none||mobile||pointerEnabled|push|append|oneOf|jEach|jStore|boolean|try|settings|handle|magic|rootCSS|test|hint|zoomSizeOrigin|expandBox|defined|hidden|caption|activating|jGetCss|expandZoomOn|data|touch|orientation|catch|abs|uaName|Doc|body|match|setAttribute|dbltap|additionalImages|placeholder|Class|jSetCssProp|border|dragstart|identifier|parent|init|off|ceil|update|webkit|stopDefaults|expandBg|expandCaption|Element|clearTimeout|touchpinch|hasOwnProperty|class||scale|||||getDoc|array|detach|target|zoomMode|dblbtnclick|link|preview|pushToEvents|hide|custom|touches|translate3d|zoomOn|origin|deactivate|chrome|firstChild|styles|replace||expandThumbs|schema|stopQueue|mousescroll|root|version|J_TYPE|next|activate|pow|reverse|visibility|switch|has|parentNode|expandZoomMode|setTimeout|listeners|indexOf|prev|disabled|start|expandGallery|expandFigure|bezier|platform|jTrim|delete|domPrefix|innerHeight|direction|cubic|vertical||requestAnimationFrame|pageX||||fullScreen|trident||pageY|moveTimer|instanceof|blur|messageBox|duration|expandNav|handlers|kill|constructor|innerWidth|enabled|toLowerCase|MSPOINTER_TYPE_TOUCH|documentElement|distance|expandStage|stopDistribution|touchstart|enable|changeContent|show|absolute|spos|innertouch|activateTimer|removeAttribute|throw|move|events|jGetPageXY|canvas|loadTimer|jCamelize|cssClass|figure|FX|parseInt|concat|cubicBezier|round|resizeCallback|floor|timer|add|contains|visible|while|touchend|MSPointerUp|updateTimer|gecko|selectedItem|||ms|ease|to|css|opera|showHint||scroll|String|number|J_UUID|isQueueStopped|getAbsoluteURL|element|dppx|onload|Infinity|className|load|0px|targetTouches|onerror|now|nodeType|apply|display||pointerup|mouseup|dragged|Array|random|loadingBox|close|hintRuns|addCSS|Object|pointermove|MagicJS|not|wrapper|originalTitle|mousedown|found|render|android|getNode|thumb|selected|no|href|expandMaxHeight|androidBrowser|getButton|setCurNode|wunits|shift|uaVersion|hunits|originalImg||resize|filters|initEvent|primaryImage|onTouchEnd|pointerdown||overflow|normalSize|onComplete|trigger|_handlers|cssTransformProp|onTouchStart|join|continuous|padding|set|callback|touchmovement|setupZoom|expandMaxWidth|Options|oncomplete|tooltip|fromCharCode|jGetScroll|end|timedout|getBoundingClientRect|minimum|0s|cycles|threshold|toUpperCase|hover|tm|engine|easeFn|200|mouseover|alternate|jGetRect|MSPointerMove|MSPointerDown|onready|getURL|originalImage|svg|setSize|deltaY|toString|touchmove|zoomCaption|cssTransform|setProps|on|getClientXY|crMz|byTag|typeof|onExpand|animate||storage||||mousemove|175|sqrt|fromJSON|createElement|open|getRelated|margin|scrollTop|horizontal|getPrev|getNext|setOrientation|registerDeactivateEvent|parseCubicBezier|mouseout|fallback|onClose|complete|readyState|registerActivateEvent|600|title|keyCode|split|mobileZoomHint|_EVENTS_|cssPrefix|jGetPosition|itemCSS|showLoading|400|_cleanup|Transition|_unbind|object|scrollLeft|expandImageStage|replaceChild|getInnerSize|expandControls|_timer|continue|cssFilters|stubNode|naturalWidth|btnclickEvent|nextImage|loadSmall|currentSrc|lazyZoom|XMLHttpRequest|status|createElementNS|pStyles_arr||Message|onTouchMove|textExpandHint||||dblclick|||implement|isNaN|index|getStorage|exists|pStyles|PFX|linear|hideTimer|callee|originalImgSrc|normalizeCSS|dashize|relatedTarget|forceAnimation|loopBind|charAt|cancelAnimationFrame|win|mzCrA|_bind|perspective|handleMouseUp|J_EUID|_event_prefix_|reflow|magiczoom|reset|onprogress|createEvent|eventType|exitFullscreen|fromString|Opacity|xhr|pointerId|compatMode|isPrimary|dragend|MagicZoom|openLink|885|fade|getElementsByTagName|forceTouch|splice|reflowZoom|msPointerEnabled|deactivating|translate|domready|SVGImage|parseNode|text|ios|setActiveThumb|hasChild|textClickZoomHint|safari|keyboardCallback|045|capable|||||||||||||unregisterDeactivateEvent|unregisterActivateEvent|setMode|aspectRatio|byClass|createTextNode|onabort|query|loadedBytes|expandToWindow|assign|320|deltaMode|0001|querySelectorAll|mgctlbx|uuid|onExit|onEnter|prepareExpandedView|gallery|deltaX|abort|J_EXT|Pltm|Za|onclick|handleMouseDown|temporary|caller|isMouse|_event_add_|priority|_event_del_|imageByOrigin|onClick|handleTouchEnd|handleTouchMove|1000|handleTouchStart|previousScale|ignore|autostart|dispatchEvent|tagName||startTime|ifndef|hideFX|swipe|hideHint||hintMessage|el_arr|styles_arr|Tooltip||removeChild|101|run|maximum|span|http|www|appendChild|org|w3|keydown|delay|textHoverZoomHint|thumbs|05|calc|selectorTrigger|getTarget|stopAnimation|cycle|cubicBezierAtTime|all|scrollFX|Date|onBeforeRender|jRaiseEvent|selectorsMoveFX|735|300|hideLoading|request|275|zIndex|once|inline|presto|opr|loadZoom|https|touchScreen|runtime|html|slice|pointerout|errorEventName|changeEventName|jClearEvents|onResize|10000px|cssDomPrefix|zoomPosition|HTMLElement|Alpha|loadImg|000001|getElementsByClassName|Function|rel|MagicZoomPlus||ImageLoader|resizeTimer|easeInExpo|easeOutSine|easeInSine|easeOutBack|easeInBack|easeOutExpo|easeOutQuad|easeOutCubic|documentMode|easeInQuad||easeInCubic|onExpandClose|stage|ua|onchange|parseSchema|cancelFullScreen|out|355|165|UUID|backCompat|03|nativize|animation|DocumentTouch|999|hone|mjs|cssText|onExpandOpen|jToBool|item|backcompat|toArray|mozCancelAnimationFrame|scrollbarsWidth|multibackground|background|getContext|crios|bounceIn|Webkit|firefox|UIEvent|Number|setMessage|moz|getTime|od|destroyExpandGallery|setupExpandGallery|phone|Moz|elasticIn|fps|v5|webkit419|compareDocumentPosition|clientWidth|curScale|insertRule|_initialDistance|stylesId|getElementById|wheelDeltaX|offsetWidth|wheelDeltaY||wheelDelta|forEach|detail|dragmove|sheet|wrap|preventDefault|cancelBubble|||device|euid|addEventListener|which|stopPropagation|handleMouseMove|deleteRule|styleSheet|imageByURL|767px|imageByIndex|requestFullScreen|Microsoft|doc|Bottom|removeRule|onStart|isReady|Left|textnode|onreadystatechange|interval|magicJS|msExitFullscreen|fullscreen|finishTime|Top|matchMedia|loop|loadBlob|xhr2|jDefer|error|jHasClass|jSetOpacity|progid|DXImageTransform|progressiveLoad|registerCallback|getComputedStyle|date|Right|304|onxhrerror|styleFloat|figcaption|view|onAfterRender||MSPointerOut|onZoomReady|touchOptions|clearInterval||cancel|onUpdate|backward|getJSON|PI|cos|items|ts|setupContent|get|500|onZoomIn|smoothing|gif|selector|screenY|deg|querySelector|loadOptions|enclose|895|10000|charCodeAt|rightClick|base64|300ms|685|100000|fontWeight|screenX|onZoomOut|R0lGODlhAQABAAD|ACwAAAAAAQABAAACADs|setupSelectors|initDrag|Click|shown|onswipe|color|getOriginalTarget|0ms|variableZoom|MouseEvent|naturalHeight|upscale|screen|fontSize|closeOnClickOutside|transitionEffect|with|moveBind|2147483647|filterBlur|zoomHeight|zoomWidth|block|addItem|stopImmediatePropagation||registerEvents|RegExp|selectItem|10px|setInterval|stdDeviation|changeZoomLevel|unregisterEvents|setCaption|currentStyle|536|lineHeight|float|cssFloat|getPropertyValue|fullscreenerror|requestFullscreen|fullscreenElement|ExitFullscreen|CancelFullScreen|FullscreenElement|RequestFullScreen|FullScreen|textAlign|RequestFullscreen|serif|MSFullscreenChange|MSFullscreenError|webkitIsFullScreen|prefix|activeElement|line|ver|fullscreenchange|sans|fontFamily|Width|innerText|toElement|fromElement|isTouchEvent|isPrimaryTouch|removeEventListener|MSPointerOver|pointerover|selectstart|matches|getRatio|returnValue|srcElement|srcset|attachEvent|radius|420|DOMContentLoaded|running|before|fireEvent|createEventObject|detachEvent|rev|sort|201|scrollHeight|scrollWidth|offsetLeft|clientLeft|offsetTop|offsetParent|innerHTML|clientTop|jGetFullScroll|jToggleClass|jGetStyles|jGetTransitionDuration|offsetHeight|childNodes|insertBefore|clientHeight|isFinite|pageXOffset|pageYOffset|jGetFullSize|presto925|DOMElement|MobileOptions|jGetStyle|jSetStyle|iframe|contextmenu|9999|oCancelFullScreen|mozCancelFullScreen|msCancelFullScreen|ProgressEvent|withCredentials|FormData|webkitCancelFullScreen|webkitexitFullscreen|evaluate|xpath|air|fullscreenEnabled|msFullscreenEnabled|implementation|hasFeature|avantgo|meego|bada|blackberry|blazer|msMaxTouchPoints|maxTouchPoints|SVG11|TR|feature|Image|ontouchstart|edge|userAgent|head|350|relative|cssRules|addRule|loading|regexp|message|v3|collection|KeyboardEvent|KeyEvent|removeCSS|generateUUID|map|4294967296|jToInt|toFloat|256|getHashCode|xy|xxxx|xxxxxxxx|4xxx|yxxx|xxxxxxxxxxxx|compal|elaine|linux|mac|other|mozRequestAnimationFrame|webkitRequestAnimationFrame|webos|120|mozInnerScreenY|getBoxObjectFor|WebKitPoint|taintEnabled|unknown|oRequestAnimationFrame|msRequestAnimationFrame|TransitionEvent|cssfilters|WebKitTransitionEvent|webkitTransitionEnd|2em|2px|red|oCancelAnimationFrame|dummy|msCancelAnimationFrame|webkitCancelRequestAnimationFrame|zoomOut|ActiveXObject||||xiino|mmp|midp|netfront|ob|palm|maemo||lge||hiptop|fennec|iemobile|iris|kindle|os|ixi|vodafone|up|wap|windows|xda|treo|symbian|plucker|re|pocket|psp|series|lt|doScroll|normal|roundCss|setTransition|curFrame|infinite|Previous|Tap|thumbnails|sineOut|textBtnPrev|Next|sineIn|or|convert|220|zoomDistance|Hover|textBtnNext|Close|textBtnClose|destroy|Touch|mgctlbxN|easeInCirc|537|createObjectURL|MZ|mgctlbxV|mgctlbxP|progress|mgctlbxL|GET|responseType|quadIn|expoOut|expoIn|Double|280|quadOut|blob|send|devicePixelRatio|cloneNode|Cannot|easeInOutQuart|easeInQuint|755|855|030|easeOutQuart|645|easeInQuart|easeInOutCirc|06|075|795|035|04|easeInOutExpo|335|07|easeOutQuint|easeOutCirc|easeInOutQuint|easeInOutCubic|785|575|565|easeInOutSine|445|715|745|TypeError|pop|zoomIn|085|265|055|135|675|215|955|515|easeInOutBack|easeInOutQuad|455|static|response|controls|scrollTo|feGaussianBlur|pinchupdate|pinchstart|btn|Plus|setAttributeNS|SourceGraphic|createDocumentFragment|MagicToolboxTooltip|deltaZ|deltaFactor|delta|9_|5000|units|forward|availWidth|xlink|250|definition|Incorrect|of|the|opening|isset|parameter|availHeight|switchTo|2000|1999|NEGATIVE_INFINITY|refresh|POSITIVE_INFINITY|parse|JSON|_self|MessageBox|01|lengthComputable|sides|total|backOut|ul|elasticOut|100ms|bounceOut|li|URL|webkitURL|backIn|800|cubicIn|onwheel|000244140625|wheel|mousewheel|cubicOut|z0'.split('|'),0,{}))
