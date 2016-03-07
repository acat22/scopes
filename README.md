# scopes
##Scope Manager for Java Script.<br>

It's a scope manager, with it you can easily create scopes.<br>
For example for your SPA.<br>
It's a lightweight pure scope manager, doesn't have any dependencies.<br>
If you don't want to use something heavy as Angular just to be able to use scopes,<br>
that's for you.<br>

<Usage sample><br>

	$sm().defaultScopes = ['main']; // these scopes will run on all pages.
	$sm().pushScopes(
		{
			name  : 'main', // the scope 'main'
			scope : function() {
				console.log('main scope activated');
			}
		},
		{
			name  : 'index', // scope for index page
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
			name  : 'news', // scope for news page
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

	// Run this command after the page loaded, this sample uses JQuery:
	$().ready(function() {
		$sm().init();
	})

</Usage sample><br>

will do:<br>
execute scope function of main on all pages,<br>
scope function of index on ...../index.php<br>

Manual scope execution:<br>
add to the page where index should be executed:<br>

	$sm('index');

or call manually:<br>

	$sm().useScope('index');


License MIT.