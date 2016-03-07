/**
Scope Manager.

<Usage sample>

$sm().defaultScopes = ['main'];
$sm().pushScopes(
	{
		name  : 'main',
		scope : function() {
			console.log('main scope activated');
		}
	},
	{
		name  : 'index',
		rex   : /^.*(\/|\/index\.php)(((\?|#).*)|$)/, // - if you want to call it based on regex
		scope : function() {
			console.log('index scope activated');
		},
		destruct : function() {
			// if you want to destruct it add this func...
			// actions on destruct
		}
	},
	{
		name  : 'news',
		rex   : /^.*(\/|\/news\.php)(((\?|#).*)|$)/,
		scope : function() {
			console.log('news scope activated');
		},
		destruct : function() {
			// if you want to destruct it add this func...
			// actions on destruct
		}
	}
);

// with JQuery:
$().ready(function() {
	$sm().init();
})

</Usage sample>

will do:
execute scope function of main on all pages,
scope function of index on ...../index.php

Manual scope execution:
add to the page where index should be executed:

$sm('index');

or call manually:

$sm().useScope('index');


License MIT.

by Anton Blinkov. 2015.
*/
(function() {
	var $sm = {
		_prevInParam : null,
		_paramName : '$sm',
		noConflict : function(restorePrev) {
			if (restorePrev && this._prevInParam !== null) window[this._paramName] = this._prevInParam;
			return this;
		},
		_scopes : [],
		_usedScopes : [],
		pushScopes : function() {
			var i;
			for (i = 0; i < arguments.length; i++) {
				var scope = arguments[i];
				if (!scope.name) {
					console.log('!Error: the scope\'s name isn\'t defined');
					continue;
				}
				if (!scope.scope) {
					console.log('!Error: the scope\'s function isn\'t defined');
					continue;
				}
				if (!scope.vars) scope.vars = {};
				this._scopes.push(scope);
			}
		},
		getScope : function(scope) {
			var scopes = this._scopes;
			for (var i = 0; i < scopes.length; i++) {
				if (scopes[i].name == scope) {
					return scopes[i];
				}
			}
			return false;
		},
		// shortlink for calling scope's public functions and variables
		sf : function(scope) {
			var scope = this.getScope(scope);
			if (scope) return scope.vars;
			return false;
		},
		// register scope's public functions and variables.
		// you can pass a function created by "function functionNameHere () {" instead of varname 
		// and value isn't needed then, it will be set to that function automatically.
		addVar : function(scope, varname, value) {
			if (typeof scope !== 'string') {
				if (scope.name) scope = scope.name;
				else return;
			}
			//console.log(scope);
			if (typeof varname === 'function') {
				value = varname;
				varname = value.name;
				if (!varname) return;
				//console.log(varname);
			}
			var scopes = this._scopes;
			for (var i = 0; i < scopes.length; i++) {
				if (scopes[i].name == scope) {
					scopes[i].vars[varname] = value;
				}
			}
		},
		init : function() {
			// default scopes
			var scopesToUse = this.defaultScopes;
			for (var i = 0; i < scopesToUse.length; i++) {
				this.useScope(scopesToUse[i]);
			}
			
			// search for scopes by regex [
			var pathname = window.location.pathname;
			var location = window.location.href;
			var scopes = this._scopes;
			for (var i = 0; i < scopes.length; i++) {
				var scope = scopes[i];
				if ((scope.rex && scope.rex.test(location)) 
					|| (scope.rexp && scope.rexp.test(pathname)))
				{
					if (!this.scopeUsed(scope.name)) {
						this._usedScopes.push(scope.name);
						scope.scope();
					}
				}
			}
			// ]
			
			// scopes added via direct .scopes
			scopesToUse = this.scopes;
			for (var i = 0; i < scopesToUse.length; i++) {
				this.useScope(scopesToUse[i]);
			}
		},
		useScope : function() {
			for (var i = 0; i < arguments.length; i++) {
				var name = arguments[i];
				var scope = this.getScope(name);
				if (scope) {
					if (!this.scopeUsed(scope.name)) {
						this._usedScopes.push(scope.name);
						scope.scope();
					}
				} else {
					// error
					console.log("!Error: scope '" + name + "' couldn't be found.");
				}
			}
		},
		scopeUsed : function(scope) {
			var scopes = this._usedScopes;
			for (var i = 0; i < scopes.length; i++) {
				if (scopes[i] == scope) {
					return true;
				}
			}
			return false;
		},
		destruct : function(scopeName) {
			var scope = this.getScope(scopeName);
			if (scope.destruct) {
				scope.destruct();
				// remove from used
				var su = [], scopes = this._usedScopes;
				for (var i = 0; i < scopes.length; i++) {
					if (scopes[i] != scopeName) su.push(scopes[i]);
				}
				this._usedScopes = su;
			}
		},
		defaultScopes : [],
		scopes : [],
		cmp : {},
		utils : {}
	};
	
	if (window[$sm._paramName] !== undefined && window[$sm._paramName] !== null) {
		$sm._prevInParam = window[$sm._paramName];
	}
	
	window[$sm._paramName] = function() {
		if (arguments.length > 0) $sm.scopes = arguments;
		return $sm;
	}
})();
